"use client";
import React, { useState } from 'react';
import { SearchCode, CheckCircle, ShieldCheck, ShieldAlert, AlertTriangle, XCircle } from 'lucide-react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanSteps, setScanSteps] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const parseAppId = (input: string) => {
    try {
      if (input.includes('apps.apple.com')) {
        const match = input.match(/\/id(\d+)/);
        if (match) return match[1];
      }
      
      if (input.includes('id=')) {
        const urlParams = new URLSearchParams(input.split('?')[1]);
        return urlParams.get('id');
      }
      return input.trim();
    } catch {
      return input.trim();
    }
  };

  const simulateScanSteps = async () => {
    const steps = [
      "Fetching Google Play Store Metadata...",
      "Cross-checking Developer with RBI NBFC Registry...",
      "Scraping User Reviews...",
      "Analyzing Permissions with Groq AI...",
      "Generating Final Safety Score..."
    ];
    setScanSteps([]);
    for (let i = 0; i < steps.length; i++) {
      await new Promise(res => setTimeout(res, 800));
      setScanSteps(prev => [...prev, steps[i]]);
    }
  };

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setError('');
    setResult(null);
    setLoading(true);

    const appId = parseAppId(query);
    const platform = query.includes('apple.com') ? 'ios' : 'android';
    if (!appId) {
      setError("Invalid App ID or URL");
      setLoading(false);
      return;
    }

    const scanAnimPromise = simulateScanSteps();

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appId, platform })
      });
      const data = await res.json();
      await scanAnimPromise;
      if (!res.ok) throw new Error(data.error || 'Failed to analyze app');
      setResult(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="ambient-bg">
        <div className="ambient-blob blob-1"></div>
        <div className="ambient-blob blob-2"></div>
      </div>

      <nav className="navbar">
        <div className="logo">
          App<span>Sniff</span>
        </div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      <main className="container">
        <section className="hero">
          <div className="hero-pill">
            <span className="dot"></span>
            Protect your data & finances
          </div>
          <h1>
            Don't fall for <span className="highlight">fake</span> loan apps.
          </h1>
          <p>
            Verify if a lending app is registered with the RBI, check what suspicious 
            permissions they ask for, and read AI-summarized warnings from other users 
            before you download.
          </p>
          
          <form onSubmit={handleScan} className="search-wrapper">
            <div className="search-container">
              <div className="search-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="search-input"
                placeholder="Paste Play Store or App Store URL..." 
                disabled={loading}
              />
              <button type="submit" className="search-btn" disabled={loading || !query}>
                {loading ? 'Analyzing...' : 'Analyze'}
              </button>
            </div>
          </form>

          {/* Error State */}
          {error && (
            <div className="mt-8 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-start gap-3 animate-fade-in text-left max-w-2xl w-full mx-auto">
              <XCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-white">Analysis Failed</h3>
                <p className="text-sm opacity-90">{error}</p>
              </div>
            </div>
          )}

          {/* Loading Animation */}
          {loading && (
            <div className="mt-12 bg-[#111111] rounded-2xl border border-white/10 p-8 w-full max-w-2xl mx-auto text-left overflow-hidden relative shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 animate-pulse" />
              <div className="flex items-center gap-4 mb-6">
                <SearchCode className="w-8 h-8 text-emerald-500 animate-bounce" />
                <h2 className="text-xl font-bold text-white">Deep Scanning...</h2>
              </div>
              <div className="space-y-4">
                {scanSteps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-slate-300 animate-fade-in-right">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <span className="font-medium">{step}</span>
                  </div>
                ))}
                <div className="flex items-center gap-3 text-slate-500 animate-pulse mt-4">
                  <div className="w-5 h-5 rounded-full border-2 border-slate-600 border-t-emerald-500 animate-spin" />
                  <span className="font-medium">Processing...</span>
                </div>
              </div>
            </div>
          )}

          {/* Results Dashboard */}
          {result && !loading && (
            <div className="mt-12 w-full max-w-3xl mx-auto animate-fade-in-up space-y-6 text-left">
              {/* Main Score Card */}
              <div className="bg-[#111111] rounded-3xl border border-white/10 p-8 flex flex-col md:flex-row gap-8 items-center shadow-2xl">
                <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-sm flex-shrink-0 border border-white/10 bg-white/5">
                  {result.app.icon ? (
                    <img src={result.app.icon} alt="App Icon" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500">No Icon</div>
                  )}
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold text-white mb-1">{result.app.title}</h2>
                  <p className="text-slate-400 font-medium mb-3">{result.app.developer}</p>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm font-medium">
                    <span className="px-3 py-1 bg-white/5 text-slate-300 border border-white/10 rounded-full">{result.app.installs} Installs</span>
                    <span className="px-3 py-1 bg-white/5 text-slate-300 border border-white/10 rounded-full">{result.app.score} ★</span>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center border-4 ${result.analysis.safetyScore > 80 ? 'border-emerald-500 text-emerald-400' : result.analysis.safetyScore > 50 ? 'border-amber-500 text-amber-400' : 'border-rose-500 text-rose-400'}`}>
                    <span className="text-3xl font-black">{result.analysis.safetyScore}</span>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider mt-2 text-slate-500">Safety Score</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* RBI Status */}
                <div className={`p-6 rounded-2xl border ${result.rbiRegistered ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20'}`}>
                  <div className="flex items-center gap-3 mb-3">
                    {result.rbiRegistered ? <ShieldCheck className="w-6 h-6 text-emerald-400" /> : <ShieldAlert className="w-6 h-6 text-rose-400" />}
                    <h3 className="font-bold text-lg text-white">RBI Registry Status</h3>
                  </div>
                  <p className={`text-sm font-medium ${result.rbiRegistered ? 'text-emerald-200' : 'text-rose-200'}`}>
                    {result.rbiRegistered 
                      ? "Verified: This developer matched with an official RBI-registered NBFC. It is a legitimate lending institution." 
                      : "Warning: We could not find this developer in the official RBI registry. This app may be operating illegally."}
                  </p>
                </div>

                {/* AI Summary */}
                <div className="p-6 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                  <div className="flex items-center gap-3 mb-3">
                    <SearchCode className="w-6 h-6 text-blue-400" />
                    <h3 className="font-bold text-lg text-white">AI Risk Analysis</h3>
                  </div>
                  <p className="text-sm font-medium text-blue-100">
                    {result.analysis.summary}
                  </p>
                  {result.analysis.fakeReviewSuspected && (
                    <div className="mt-4 inline-flex items-center gap-2 bg-rose-500/20 text-rose-300 border border-rose-500/20 px-3 py-1.5 rounded-md text-xs font-bold">
                      <AlertTriangle className="w-4 h-4" /> Fake Reviews Detected
                    </div>
                  )}
                </div>
              </div>

              {/* Suspicious Permissions */}
              {result.analysis.suspiciousPermissions?.length > 0 && (
                <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                   <h3 className="font-bold text-lg text-white mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-400" /> Suspicious Permissions
                  </h3>
                  <ul className="space-y-2">
                    {result.analysis.suspiciousPermissions.map((perm: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-amber-100/80">
                        <span className="text-amber-500 font-bold mt-0.5">•</span> {perm}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </section>

        {!result && !loading && (
          <>
            <section className="trust-banner">
              <div className="trust-content text-left">
                <h2>Powered by Official Data</h2>
                <p>Our database is synchronized directly with the latest RBI NBFC circulars.</p>
              </div>
              <div className="trust-badge">
                <div className="badge-pill">
                  <span className="pulse-dot"></span>
                  Database Active
                </div>
                <span className="badge-text">Updated today</span>
              </div>
            </section>

            <section id="features">
              <div className="features-header">
                <h2>Comprehensive Security</h2>
                <p>We analyze every aspect of the app to keep you safe.</p>
              </div>

              <div className="features-grid text-left">
                <div className="feature-card">
                  <div className="feature-icon-wrapper icon-safe">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      <polyline points="9 12 11 14 15 10"></polyline>
                    </svg>
                  </div>
                  <h3>RBI Registry Check</h3>
                  <p>
                    We instantly cross-reference the app's developer and associated NBFC with 
                    the official Reserve Bank of India registry to ensure they are legal.
                  </p>
                </div>

                <div className="feature-card">
                  <div className="feature-icon-wrapper icon-warn">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                      <line x1="12" y1="9" x2="12" y2="13"></line>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                  </div>
                  <h3>Permission Analysis</h3>
                  <p>
                    Predatory apps steal your contacts and photos to blackmail you later. 
                    We flag dangerous permissions before you even install the app.
                  </p>
                </div>

                <div className="feature-card">
                  <div className="feature-icon-wrapper icon-ai">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                  </div>
                  <h3>AI Review Insights</h3>
                  <p>
                    Our AI scans hundreds of user reviews looking for keywords like "harassment", 
                    "fake", or "high interest" to uncover hidden red flags.
                  </p>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </>
  );
}
