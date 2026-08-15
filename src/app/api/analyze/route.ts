import { NextResponse } from 'next/server';
import gplay from 'google-play-scraper';
import { createClient } from '@supabase/supabase-js';
import Groq from 'groq-sdk';

// Initialize clients
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { appId } = await req.json();

    if (!appId) {
      return NextResponse.json({ error: 'App ID is required' }, { status: 400 });
    }

    // 1. Scrape App Data from Google Play
    let appData;
    try {
      appData = await gplay.app({ appId });
    } catch (e: any) {
      console.error("Scraper error:", e.message);
      return NextResponse.json({ error: 'App not found on Play Store or invalid ID' }, { status: 404 });
    }
    
    // Scrape Permissions
    let permissions: any[] = [];
    try {
      permissions = await gplay.permissions({ appId });
    } catch (e) {
      console.warn("Could not fetch permissions:", e);
    }
    
    // Scrape Reviews
    let reviews: any[] = [];
    try {
      const reviewsData = await gplay.reviews({ appId, sort: gplay.sort.NEWEST, num: 50 });
      reviews = reviewsData.data;
    } catch (e) {
      console.warn("Could not fetch reviews:", e);
    }

    // 2. Check RBI Registry in Supabase
    // We use advanced fuzzy matching (pg_trgm) via our RPC function.
    const { data: nbfcData, error: nbfcError } = await supabase
      .rpc('search_nbfc', { search_term: appData.developer });
    
    if (nbfcError) {
      console.error("Supabase RPC error:", nbfcError);
    }

    const isRBIRegistered = (nbfcData && nbfcData.length > 0) ? true : false;

    // 3. AI Analysis with Groq
    const permissionsList = permissions.map(p => p.permission).join(', ') || 'No permissions found';
    // Limit reviews text length so we don't blow up the LLM context window
    const reviewsList = reviews.map(r => r.text).join('\n').substring(0, 3000) || 'No reviews found';

    const prompt = `
      You are an AI security analyst specialized in detecting predatory loan apps.
      Analyze the following Android app data:
      
      App Name: ${appData.title}
      Developer: ${appData.developer}
      Category/Genre: ${appData.genre || 'Unknown'}
      RBI Registered NBFC: ${isRBIRegistered ? 'Yes' : 'No'}
      
      Permissions Requested:
      ${permissionsList}
      
      Recent User Reviews:
      ${reviewsList}
      
      Output your analysis in strict JSON format with the following keys:
      - safetyScore: a number from 0 to 100 (100 being completely safe, 0 being highly predatory)
      - riskLevel: "Safe", "Warning", or "Danger"
      - summary: A 2-sentence summary explaining why this score was given.
      - suspiciousPermissions: An array of strings highlighting dangerous permissions (like reading SMS, Contacts, Gallery if unjustified).
      - fakeReviewSuspected: boolean, true if reviews look bot-generated.
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama3-8b-8192',
      temperature: 0.2,
      response_format: { type: "json_object" }
    });

    const aiAnalysis = JSON.parse(chatCompletion.choices[0]?.message?.content || '{}');

    // Return the combined report
    return NextResponse.json({
      app: {
        title: appData.title,
        icon: appData.icon,
        developer: appData.developer,
        installs: appData.installs,
        score: appData.score,
      },
      rbiRegistered: isRBIRegistered,
      analysis: aiAnalysis
    });

  } catch (error: any) {
    console.error('Error analyzing app:', error);
    return NextResponse.json({ error: error.message || 'Failed to analyze app' }, { status: 500 });
  }
}
