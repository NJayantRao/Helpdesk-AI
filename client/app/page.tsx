export default function HomePage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          font-family: 'Inter', sans-serif;
          background: #f7f8fc;
          color: #0f0f0f;
        }

        .navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(247,248,252,0.92);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid #e8eaf0;
          height: 64px;
          display: flex;
          align-items: center;
          padding: 0 48px;
          justify-content: space-between;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 9px;
          font-size: 17px;
          font-weight: 800;
          color: #0f0f0f;
          letter-spacing: -0.5px;
        }

        .logo-icon {
          width: 30px;
          height: 30px;
          background: #0f0f0f;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .login-btn {
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #0f0f0f;
          background: white;
          border: 1.5px solid #d1d5db;
          border-radius: 8px;
          padding: 9px 22px;
          cursor: pointer;
          transition: all 0.15s ease;
          letter-spacing: -0.1px;
        }

        .login-btn:hover {
          border-color: #0f0f0f;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .hero {
          min-height: calc(100vh - 64px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 0 24px;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 100px;
          padding: 6px 16px;
          margin-bottom: 40px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
        }

        .badge-dot {
          width: 7px;
          height: 7px;
          background: #f59e0b;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .badge-text {
          font-size: 12px;
          font-weight: 600;
          color: #6b7280;
          letter-spacing: 0.4px;
          text-transform: uppercase;
        }

        .hero-heading {
          font-size: 68px;
          font-weight: 800;
          line-height: 1.06;
          letter-spacing: -3px;
          color: #0f0f0f;
          margin-bottom: 24px;
          max-width: 760px;
        }

        .hero-heading .accent {
          color: #2563eb;
        }

        .hero-sub {
          font-size: 18px;
          color: #6b7280;
          line-height: 1.65;
          letter-spacing: -0.2px;
          margin-bottom: 52px;
          max-width: 460px;
        }

        .hero-pills {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .pill {
          font-size: 13px;
          font-weight: 500;
          color: #374151;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 100px;
          padding: 7px 16px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .pill-divider {
          color: #d1d5db;
          font-size: 16px;
        }

        footer {
          border-top: 1px solid #e8eaf0;
          padding: 22px 48px;
          text-align: center;
        }

        footer p {
          font-size: 13px;
          color: #b0b7c3;
          letter-spacing: -0.1px;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .navbar { padding: 0 20px; }
          .hero-heading { font-size: 40px; letter-spacing: -1.8px; }
          .hero-sub { font-size: 16px; }
          footer { padding: 22px 20px; }
        }
      `}</style>

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <div className="logo-icon">
            <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="5" height="5" rx="1.2" fill="white" />
              <rect
                x="8"
                y="1"
                width="5"
                height="5"
                rx="1.2"
                fill="white"
                fillOpacity="0.45"
              />
              <rect
                x="1"
                y="8"
                width="5"
                height="5"
                rx="1.2"
                fill="white"
                fillOpacity="0.45"
              />
              <rect x="8" y="8" width="5" height="5" rx="1.2" fill="white" />
            </svg>
          </div>
          NIS
        </div>
        <button className="login-btn">Login</button>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="badge">
          <span className="badge-dot" />
          <span className="badge-text">Under Development</span>
        </div>

        <h1 className="hero-heading">
          <span className="accent">AI-Powered</span> Intelligent
          <br />
          University ERP
        </h1>

        <p className="hero-sub">
          A smarter academic system is under development.
        </p>

        <div className="hero-pills">
          <span className="pill">RAG-Based Helpdesk</span>
          <span className="pill-divider">·</span>
          <span className="pill">Multilingual AI</span>
          <span className="pill-divider">·</span>
          <span className="pill">Academic Intelligence</span>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <p>Built for modern academic systems</p>
      </footer>
    </>
  );
}
