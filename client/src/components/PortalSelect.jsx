import {
  Mic,
  GraduationCap,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";

import "./PortalSelect.css";

// Tracks the cursor inside a card so the CSS spotlight can follow it.
function handleSpotlight(e) {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
}

function PortalSelect({ onSelect }) {
  return (
    <main className="portal-page">
      {/* Decorative background (non-interactive) */}
      <div className="portal-bg" aria-hidden="true">
        <span className="bg-orb bg-orb-1" />
        <span className="bg-orb bg-orb-2" />
        <span className="bg-orb bg-orb-3" />
        <span className="bg-grid" />
      </div>

      <nav className="portal-navbar">
        <div className="portal-brand">
          <div className="portal-logo">
            <Mic size={22} />
          </div>
          <span>UniVoice<span className="brand-dot">.</span></span>
        </div>

        <div className="university-label">
          <span className="university-pulse" aria-hidden="true" />
          PARUL UNIVERSITY
        </div>
      </nav>

      <section className="portal-main">
        <div className="portal-heading">
          <span className="portal-eyebrow">
            <span className="eyebrow-wave" aria-hidden="true">
              <i /><i /><i /><i /><i />
            </span>
            YOUR CAMPUS. YOUR VOICE.
          </span>

          <h1>
            Every voice deserves
            <br />
            <span>to be heard.</span>
          </h1>

          <p>
            A smarter way to connect, communicate, and
            make your campus experience better.
          </p>
        </div>

        <div className="portal-selection">
          <div className="selection-title">
            <h2>Choose your portal</h2>
            <span>SELECT YOUR ACCESS</span>
          </div>

          <div className="portal-cards">
            <button
              className="portal-card student-card"
              onClick={() => onSelect("student")}
              onMouseMove={handleSpotlight}
            >
              <span className="card-glow" aria-hidden="true" />

              <div className="portal-card-top">
                <div className="portal-card-icon">
                  <GraduationCap size={30} />
                </div>
                <ArrowUpRight size={22} className="portal-arrow" />
              </div>

              <div className="portal-card-content">
                <span className="card-label">STUDENT ACCESS</span>
                <h3>Student Portal</h3>
                <p>
                  Raise complaints, track your tickets,
                  and stay informed about every update.
                </p>
              </div>

              <div className="portal-card-bottom">
                <span>Continue as Student</span>
                <ArrowUpRight size={17} />
              </div>
            </button>

            <button
              className="portal-card admin-card"
              onClick={() => onSelect("admin")}
              onMouseMove={handleSpotlight}
            >
              <span className="card-glow" aria-hidden="true" />

              <div className="portal-card-top">
                <div className="portal-card-icon">
                  <ShieldCheck size={29} />
                </div>
                <ArrowUpRight size={22} className="portal-arrow" />
              </div>

              <div className="portal-card-content">
                <span className="card-label">ADMINISTRATION</span>
                <h3>Admin Portal</h3>
                <p>
                  Manage student complaints, review
                  campus concerns, and update resolutions.
                </p>
              </div>

              <div className="portal-card-bottom">
                <span>Continue as Admin</span>
                <ArrowUpRight size={17} />
              </div>
            </button>
          </div>
        </div>
      </section>

      <footer className="portal-footer">
        <span>© UniVoice · Parul University</span>
        <span>Voice-powered campus support</span>
      </footer>
    </main>
  );
}

export default PortalSelect;