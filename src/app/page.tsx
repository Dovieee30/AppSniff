import React from 'react';

export default function Home() {
  return (
    <>
      {/* Ambient background effect */}
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
        {/* HERO SECTION */}
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
          
          <div className="search-wrapper">
            <div className="search-container">
              <div className="search-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <input 
                type="text" 
                className="search-input"
                placeholder="Paste Play Store URL or App Name..." 
              />
              <button className="search-btn">
                Analyze
              </button>
            </div>
          </div>
        </section>

        {/* FULL WIDTH TRUST BANNER */}
        <section className="trust-banner">
          <div className="trust-content">
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

        {/* FEATURES SECTION */}
        <section id="features">
          <div className="features-header">
            <h2>Comprehensive Security</h2>
            <p>We analyze every aspect of the app to keep you safe.</p>
          </div>

          <div className="features-grid">
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
      </main>
    </>
  );
}
