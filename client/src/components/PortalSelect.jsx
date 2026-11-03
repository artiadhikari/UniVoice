
import { GraduationCap, ShieldCheck, Mic } from "lucide-react";
import "./PortalSelect.css";

function PortalSelect({ onSelect }) {
  return (
    <main className="portal-page">
      <div className="portal-content">
        <div className="portal-brand">
          <div className="portal-logo">
            <Mic size={26} />
          </div>
          <span>UniVoice</span>
        </div>

        <div className="portal-heading">
          <span className="portal-tag">PARUL UNIVERSITY</span>
          <h1>Every Voice <span>Matters.</span></h1>
          <p>
            A smarter way to raise concerns, track complaints,
            and make campus life better.
          </p>
        </div>

        <div className="portal-cards">
          <button
            className="portal-card student-card"
            onClick={() => onSelect("student")}
          >
            <div className="portal-icon student-icon">
              <GraduationCap size={30} />
            </div>
            <div className="portal-card-text">
              <h2>Student Portal</h2>
              <p>Raise complaints, track tickets and stay updated.</p>
              <span>Continue as Student ↗</span>
            </div>
          </button>

          <button
            className="portal-card admin-card"
            onClick={() => onSelect("admin")}
          >
            <div className="portal-icon admin-icon">
              <ShieldCheck size={30} />
            </div>
            <div className="portal-card-text">
              <h2>Admin Portal</h2>
              <p>Manage complaints, review issues and update statuses.</p>
              <span>Continue as Admin ↗</span>
            </div>
          </button>
        </div>

        <p className="portal-footer">
          Voice-powered grievance management · Demo access
        </p>
      </div>
    </main>
  );
}

export default PortalSelect;
