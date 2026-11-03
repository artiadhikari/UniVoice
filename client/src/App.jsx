
import { useState, useEffect } from "react";
import axios from "axios";

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
  RefreshCw,
} from "lucide-react";

import "./App.css";
import ComplaintForm from "./ComplaintForm";

function App() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Demo student profile
  const studentId = "STU001";

  // Fetch complaints from backend
  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `http://localhost:5000/api/complaints/my?student_id=${studentId}`
      );

      if (response.data.success) {
        setComplaints(response.data.data);
      }
    } catch (err) {
      console.error("Fetching complaints error:", err);
      setError("Unable to load complaints. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Load complaints on dashboard and My Complaints page
  useEffect(() => {
    if (activeTab === "Dashboard" || activeTab === "My Complaints") {
      fetchComplaints();
    }
  }, [activeTab]);

  // Real statistics
  const stats = [
    {
      label: "Total Complaints",
      value: complaints.length,
      icon: ClipboardList,
    },
    {
      label: "Pending",
      value: complaints.filter((c) => c.status === "Pending").length,
      icon: Clock,
    },
    {
      label: "In Progress",
      value: complaints.filter((c) => c.status === "In Progress").length,
      icon: AlertCircle,
    },
    {
      label: "Resolved",
      value: complaints.filter((c) => c.status === "Resolved").length,
      icon: CheckCircle2,
    },
  ];

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    return new Date(date.replace(" ", "T") + "Z").toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getStatusClass = (status) => {
    return status?.toLowerCase().replace(/\s+/g, "-") || "pending";
  };

  // Complaint card
  const ComplaintCard = ({ complaint }) => (
    <div className="complaint-card">
      <div className="complaint-card-top">
        <div>
          <span className="eyebrow">{complaint.category}</span>
          <h3>{complaint.ticket_id}</h3>
        </div>

        <span className={`status-badge ${getStatusClass(complaint.status)}`}>
          {complaint.status}
        </span>
      </div>

      <p className="complaint-description">
        {complaint.description}
      </p>

      <div className="complaint-meta">
        <span>
          <Clock size={15} />
          {formatDate(complaint.created_at)}
        </span>

        <span>
          {complaint.hostel}
          {complaint.room_number
            ? ` · Room ${complaint.room_number}`
            : ""}
        </span>

        <span className={`priority-badge ${complaint.priority?.toLowerCase()}`}>
          {complaint.priority} Priority
        </span>
      </div>
    </div>
  );

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <Mic size={24} />
          </div>

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
            className={`nav-item ${
              activeTab === name ? "active" : ""
            }`}
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
          <button className="mobile-menu">
            <Menu />
          </button>

          <div>
            <p>PARUL UNIVERSITY / STUDENT PORTAL</p>
            <h3>{activeTab}</h3>
          </div>

          <div className="top-actions">
            <button className="icon-button">
              <Search />
            </button>

            <button className="icon-button">
              <Bell />
            </button>

            <div className="profile-avatar">DS</div>
          </div>
        </header>

        {/* New Complaint Page */}
        {activeTab === "New Complaint" ? (
          <ComplaintForm
            onBack={() => setActiveTab("Dashboard")}
          />
        ) : activeTab === "My Complaints" ? (

          /* My Complaints Page */
          <section className="recent-section">
            <div className="section-heading">
              <div>
                <span className="eyebrow">YOUR ACTIVITY</span>
                <h2>My Complaints</h2>
                <p>Track all your submitted complaints.</p>
              </div>

              <button
                onClick={fetchComplaints}
                disabled={loading}
              >
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>

            {error && (
              <div className="empty-state">
                <AlertCircle size={30} />
                <p>{error}</p>
              </div>
            )}

            {loading ? (
              <div className="empty-state">
                <RefreshCw size={30} />
                <p>Loading your complaints...</p>
              </div>
            ) : complaints.length === 0 ? (
              <div className="empty-state">
                <ClipboardList size={35} />
                <h3>No complaints found</h3>
                <p>Your submitted complaints will appear here.</p>
              </div>
            ) : (
              <div className="complaints-list">
                {complaints.map((complaint) => (
                  <ComplaintCard
                    key={complaint.ticket_id}
                    complaint={complaint}
                  />
                ))}
              </div>
            )}
          </section>

        ) : activeTab === "Dashboard" ? (

          /* Dashboard Page */
          <>
            <section className="welcome">
              <div>
                <p className="eyebrow">STUDENT SUPPORT CENTER</p>
                <h1>Your voice matters.</h1>
                <p>
                  Report an issue, track its progress,
                  and make campus life better.
                </p>
              </div>

              <div className="welcome-decoration">
                <Mic size={70} />
              </div>
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

                <p>
                  Speak naturally in Hindi, English or Gujarati.
                  We'll help turn your concern into a complaint.
                </p>

                <button
                  className="report-button"
                  onClick={() => setActiveTab("New Complaint")}
                >
                  <Mic size={19} />
                  Report an Issue
                  <ArrowUpRight size={18} />
                </button>
              </div>

              <div className="report-illustration">
                <Mic size={54} />
              </div>
            </section>

            <section className="recent-section">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">ACTIVITY</span>
                  <h2>Recent complaints</h2>
                </div>

                <button
                  onClick={() => setActiveTab("My Complaints")}
                >
                  View all <ArrowUpRight size={16} />
                </button>
              </div>

              {error ? (
                <div className="empty-state">
                  <AlertCircle size={30} />
                  <p>{error}</p>
                </div>
              ) : loading ? (
                <div className="empty-state">
                  <RefreshCw size={30} />
                  <p>Loading recent complaints...</p>
                </div>
              ) : complaints.length === 0 ? (
                <div className="empty-state">
                  <ClipboardList size={35} />
                  <h3>No complaints displayed yet</h3>
                  <p>Your submitted complaints will appear here.</p>
                </div>
              ) : (
                <div className="complaints-list">
                  {complaints.slice(0, 3).map((complaint) => (
                    <ComplaintCard
                      key={complaint.ticket_id}
                      complaint={complaint}
                    />
                  ))}
                </div>
              )}
            </section>
          </>

        ) : (
          <section className="recent-section">
            <h2>Settings</h2>
            <p>Settings will be available soon.</p>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
