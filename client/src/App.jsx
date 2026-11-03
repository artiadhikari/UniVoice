import { useState } from "react";
import {
  Mic,
  LayoutDashboard,
  ClipboardList,
  Settings,
  Bell,
  Search,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Menu,
} from "lucide-react";
import "./App.css";

import ComplaintForm from "./ComplaintForm";

function App() {
  const [activeTab, setActiveTab] = useState("Dashboard");

  const stats = [
    { label: "Total Complaints", value: "128", icon: ClipboardList },
    { label: "Pending", value: "24", icon: Clock },
    { label: "In Progress", value: "18", icon: AlertCircle },
    { label: "Resolved", value: "86", icon: CheckCircle2 },
  ];

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon"><Mic size={24} /></div>
          <div>
            <h2>UniVoice</h2>
            <span>PARUL UNIVERSITY</span>
          </div>
        </div>

        <p className="nav-heading">MENU</p>
        {[
          { name: "Dashboard", icon: LayoutDashboard },
          { name: "My Complaints", icon: ClipboardList },
          { name: "Settings", icon: Settings },
        ].map(({ name, icon: Icon }) => (
          <button
            key={name}
            className={`nav-item ${activeTab === name ? "active" : ""}`}
            onClick={() => setActiveTab(name)}
          >
            <Icon size={19} />
            {name}
          </button>
        ))}

        <div className="sidebar-bottom">
          <div className="profile-avatar">DS</div>
          <div>
            <strong>Demo Student</strong>
            <span>Student Account</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <button className="mobile-menu"><Menu /></button>
          <div>
            <p>PARUL UNIVERSITY / STUDENT PORTAL</p>
            <h3>{activeTab}</h3>
          </div>
          <div className="top-actions">
            <button className="icon-button"><Search /></button>
            <button className="icon-button"><Bell /></button>
            <div className="profile-avatar">DS</div>
          </div>
        </header>
{activeTab === "New Complaint" ? (
  <ComplaintForm onBack={() => setActiveTab("Dashboard")} />
) : (
  <>
        <section className="welcome">
          <div>
            <p className="eyebrow">STUDENT SUPPORT CENTER</p>
            <h1>Your voice matters.</h1>
            <p>Report an issue, track its progress, and make campus life better.</p>
          </div>
          <div className="welcome-decoration"><Mic size={70} /></div>
        </section>

        <section className="stats-grid">
          {stats.map(({ label, value, icon: Icon }) => (
            <div className="stat-card" key={label}>
              <div className="stat-top">
                <span>{label}</span>
                <Icon size={20} />
              </div>
              <h2>{value}</h2>
            </div>
          ))}
        </section>

        <section className="report-section">
          <div>
            <span className="eyebrow">QUICK ACTION</span>
            <h2>Have something to report?</h2>
            <p>Speak naturally in Hindi or English. We'll help turn your concern into a complaint.</p>
            <button className="report-button" onClick={() => setActiveTab("New Complaint")}>
              <Mic size={19} /> Report an Issue <ArrowUpRight size={18} />
            </button>
          </div>
          <div className="report-illustration"><Mic size={54} /></div>
        </section>

        <section className="recent-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">ACTIVITY</span>
              <h2>Recent complaints</h2>
            </div>
            <button onClick={() => setActiveTab("My Complaints")}>View all <ArrowUpRight size={16} /></button>
          </div>

          <div className="empty-state">
            <ClipboardList size={35} />
            <h3>No complaints displayed yet</h3>
            <p>Your submitted complaints will appear here.</p>
          </div>
        </section>
          </>
)}
      </main>
    </div>
  );
}

export default App;