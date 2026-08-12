export default function Home() {
  return (
    <>
      <nav className="navbar">
        <div className="logo">
          App<span>Sniff</span>
        </div>
        <div>
          {/* We can add auth or about links here later */}
        </div>
      </nav>

      <main className="bento-container">
        {/* HERO SECTION */}
        <div className="bento-card card-hero">
          <div className="hero-badge">Protect your data & finances</div>
          <h1>Don't fall for fake loan apps.</h1>
          <p>
            Verify if a lending app is registered with the RBI, check what suspicious 
            permissions they ask for, and read AI-summarized warnings from other users 
            before you download.
          </p>
          
          <div className="search-box">
            <input 
              type="text" 
              placeholder="Paste Play Store URL or App Name..." 
            />
            <button>
              Analyze
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </div>

        {/* FEATURE CARDS */}
        <div className="bento-card card-feature">
          <div className="feature-icon icon-blue">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
          </div>
          <h3>RBI Registry Check</h3>
          <p>
            We instantly cross-reference the app's developer and associated NBFC with 
            the official Reserve Bank of India (RBI) registry to ensure they are legal.
          </p>
        </div>

        <div className="bento-card card-feature">
          <div className="feature-icon icon-red">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          </div>
          <h3>Permission Analysis</h3>
          <p>
            Predatory apps steal your contacts and photos to blackmail you later. 
            We flag dangerous permissions before you even install the app.
          </p>
        </div>

        <div className="bento-card card-feature">
          <div className="feature-icon icon-purple">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
          </div>
          <h3>AI Review Insights</h3>
          <p>
            Our AI scans hundreds of user reviews looking for keywords like "harassment", 
            "fake", or "high interest" to uncover hidden red flags.
          </p>
        </div>

        <div className="bento-card card-feature">
          <div className="feature-icon icon-green">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
          <h3>Safety Score</h3>
          <p>
            Get a clear, easy-to-understand Green, Yellow, or Red safety score 
            empowering you to make safe financial decisions.
          </p>
        </div>

        {/* FULL WIDTH INFO */}
        <div className="bento-card card-rbi">
          <div className="rbi-content">
            <h2>Powered by Official Data</h2>
            <p>Our database is synchronized with the latest RBI NBFC circulars.</p>
          </div>
          <div className="rbi-status">
            <div className="status-dot"></div>
            <span style={{ fontWeight: 600, color: '#f3f4f6' }}>Database Active & Updated</span>
          </div>
        </div>
      </main>
    </>
  );
}
