/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import gplay from 'google-play-scraper';
// @ts-expect-error missing typings for app-store-scraper
import appStore from 'app-store-scraper';
import { createClient } from '@supabase/supabase-js';
import Groq from 'groq-sdk';

// Initialize clients
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { appId, platform = 'android' } = await req.json();

    if (!appId) {
      return NextResponse.json({ error: 'App ID is required' }, { status: 400 });
    }

    let appData: any = {};
    let permissions: any[] = [];
    let reviews: any[] = [];

    if (platform === 'ios') {
      try {
        const iosData = await appStore.app({ id: appId, country: 'in' });
        appData = {
          title: iosData.title,
          developer: iosData.developer,
          genre: iosData.primaryGenre,
          icon: iosData.icon,
          installs: 'N/A (iOS)',
          score: iosData.score
        };
      } catch (e: any) {
        console.error("iOS Scraper error:", e.message);
        return NextResponse.json({ error: 'App not found on Apple App Store or invalid ID' }, { status: 404 });
      }
      try {
        const iosReviews = await appStore.reviews({ id: appId, country: 'in', sort: appStore.sort.RECENT, page: 1 });
        reviews = iosReviews;
      } catch (e) {
        console.warn("Could not fetch iOS reviews:", e);
      }
    } else {
      try {
        appData = await gplay.app({ appId, country: 'in' });
      } catch (e: any) {
        console.error("Scraper error:", e.message);
        return NextResponse.json({ error: 'App not found on Play Store or invalid ID' }, { status: 404 });
      }
      
      try {
        // @ts-expect-error country doesn't exist in TS interface but works in runtime
        permissions = await gplay.permissions({ appId, country: 'in' });
      } catch (e) {
        console.warn("Could not fetch permissions:", e);
      }
      
      try {
        // @ts-expect-error HELPFULNESS is missing from TS enum
        const reviewsData = await gplay.reviews({ appId, country: 'in', sort: gplay.sort.HELPFULNESS, num: 50 });
        reviews = reviewsData.data;
      } catch (e) {
        console.warn("Could not fetch reviews:", e);
      }
    }

    // 2. Check RBI Registry in Supabase
    // We use advanced fuzzy matching (pg_trgm) via our RPC function.
    const { data: nbfcData, error: nbfcError } = await supabase
      .rpc('search_nbfc', { search_term: appData.developer });
    
    if (nbfcError) {
      console.error("Supabase RPC error:", nbfcError);
    }

    let isRBIRegistered = false;
    if (nbfcData && nbfcData.length > 0) {
      const normalize = (s: string) => (s || '').toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => !['private', 'pvt', 'limited', 'ltd', 'services', 'technologies', 'india', 'finance', 'financial', 'loan', 'loans'].includes(w) && w.length > 2);
      const devWords = normalize(appData.developer);
      const devSet = new Set(devWords);

      for (const nbfc of nbfcData) {
        const nbfcWords = normalize(nbfc.company_name);
        const nbfcSet = new Set(nbfcWords);
        
        if (devSet.size === 0 || nbfcSet.size === 0) continue;
        
        let intersection = 0;
        for (const w of devSet) {
          if (nbfcSet.has(w)) intersection++;
        }
        
        if (intersection > 0 && (intersection / Math.max(devSet.size, nbfcSet.size) >= 0.5)) {
          isRBIRegistered = true;
          break;
        }
      }
    }

    // 3. AI Analysis with Groq
    const permissionsList = permissions.map(p => p.permission).join(', ') || 'No permissions found';
    // Limit reviews text length so we don't blow up the LLM context window
    const reviewsList = reviews.map(r => r.text).join('\n').substring(0, 3000) || 'No reviews found';

    const prompt = `
      You are an elite cybersecurity AI specialized in detecting predatory loan apps and protecting consumers.
      Analyze the following app data and score its safety on a scale of 0 to 100.
      
      App Name: ${appData.title}
      Developer: ${appData.developer}
      Category/Genre: ${appData.genre || 'Unknown'}
      Platform: ${platform.toUpperCase()}
      RBI Registered NBFC: ${isRBIRegistered ? 'YES (Verified)' : 'NO (Unverified/Warning)'}
      
      Permissions Requested (if Android):
      ${permissionsList}
      
      Recent User Reviews:
      ${reviewsList}
      
      SCORING RULES (STRICTLY FOLLOW THESE EXACT NUMBERS):
      1. If the app is RBI Registered (YES) and there is NO mention of blackmail, score it EXACTLY 85. Permissions like SMS (for OTP), Contacts (for UPI/Sharing), Camera (for KYC), and Location are STANDARD and JUSTIFIED.
      2. If an RBI Registered app has bad reviews about "loan rejected" or "high interest", it is normal customer service friction. The score remains EXACTLY 85.
      3. If the app is NOT RBI Registered AND asks for SMS, Contacts, or Gallery, it is highly likely a predatory blackmail app. Score it EXACTLY 15.
      4. If user reviews explicitly mention "blackmail", "calling my contacts", or "fake loan", score it EXACTLY 5.
      5. If none of the above apply, score it EXACTLY 50 (Moderate Risk).
      
      Output your analysis in strict JSON format with the following keys:
      - safetyScore: number (0 to 100)
      - riskLevel: "Safe", "Warning", or "Danger"
      - summary: A 2-sentence summary explaining the score. If it's an RBI verified app, explicitly state that standard banking permissions were forgiven.
      - suspiciousPermissions: An array of strings highlighting truly dangerous/unjustified permissions based on the rules. (Can be empty for verified apps).
      - fakeReviewSuspected: boolean, true if reviews look bot-generated.
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'openai/gpt-oss-20b',
      temperature: 0.0,
      seed: 42,
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
