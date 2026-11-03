import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import AdminDashboard from "./AdminDashboard";
import PortalSelect from "./components/PortalSelect";

import {
  Mic,
  LayoutDashboard,
  ClipboardList,
  Settings,
  Bell,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Menu,
  RefreshCw,
  Check,
} from "lucide-react";

import "./App.css";
import ComplaintForm from "./ComplaintForm";

const API_URL = "http://localhost:5000/api/complaints";

function App() {
  // Portal selection
  const [selectedPortal, setSelectedPortal] = useState(() => {
    return (
      sessionStorage.getItem("univoice_portal") ||
      (window.location.pathname === "/admin" ? "admin" : null)
    );
  });

  // Student dashboard state
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Notification state
  const [notifications, setNotifications] = useState([]);
  const [notificationError, setNotificationError] = useState("");
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [markingReadId, setMarkingReadId] = useState(null);

  // Demo student profile
  const studentId = "STU001";

  // Select portal
  const selectPortal = (portal) => {
    sessionStorage.setItem("univoice_portal", portal);
    setSelectedPortal(portal);

    if (portal === "admin") {
      window.history.pushState({}, "", "/admin");
    } else {
      window.history.replaceState({}, "", "/");
    }
  };

  // Return to portal selection
  const backToPortal = () => {
    sessionStorage.removeItem("univoice_portal");
    setSelectedPortal(null);
    setActiveTab("Dashboard");
    window.history.replaceState({}, "", "/");
  };

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const portal = sessionStorage.getItem("univoice_portal");

      if (window.location.pathname === "/admin" && portal === "admin") {
        setSelectedPortal("admin");
      } else if (portal) {
        setSelectedPortal(portal);
      } else {
        setSelectedPortal(null);
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // Fetch complaints from backend
  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/my?student_id=${studentId}`
      );

      if (response.data.success) {
        const records =
          response.data.data ?? response.data.complaints ?? [];

        setComplaints(records);
      } else {
        setError("Unable to load complaints. Please try again.");
      }
    } catch (err) {
      console.error("Fetching complaints error:", err);
      setError("Unable to load complaints. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch notifications from backend
  const fetchNotifications = useCallback(async () => {
    try {
      setNotificationError("");
      setNotificationsLoading(true);

      const response = await axios.get(
        `${API_URL}/notifications?student_id=${studentId}`
      );

      if (response.data.success) {
        setNotifications(response.data.notifications || []);
      } else {
        setNotificationError("Unable to load notifications.");
      }
    } catch (err) {
      console.error("Notification fetch error:", err);
      setNotificationError("Unable to load notifications.");
    } finally {
      setNotificationsLoading(false);
    }
  }, []);

  // Load complaints when student dashboard pages open
  useEffect(() => {
    if (
      selectedPortal === "student" &&
      (activeTab === "Dashboard" || activeTab === "My Complaints")
    ) {
      fetchComplaints();
    }
  }, [activeTab, selectedPortal, fetchComplaints]);

  // Fetch notifications only inside student portal
  useEffect(() => {
    if (selectedPortal !== "student") return;

    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 10000);

    return () => clearInterval(interval);
  }, [selectedPortal, fetchNotifications]);

  // Calculate unread notifications
  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  // Mark notification as read
  const markNotificationRead = async (notificationId) => {
    try {
      setMarkingReadId(notificationId);

      const response = await axios.patch(
        `${API_URL}/notifications/${notificationId}/read`
      );

      if (response.data.success) {
        setNotifications((previous) =>
          previous.map((notification) =>
            notification.id === notificationId
              ? { ...notification, is_read: 1 }
              : notification
          )
        );
      } else {
        setNotificationError("Unable to update notification.");
      }
    } catch (err) {
      console.error("Mark notification read error:", err);
      setNotificationError("Unable to update notification.");
    } finally {
      setMarkingReadId(null);
    }
  };

  // Real complaint statistics
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

    const parsedDate = new Date(
      date.includes("T") ? date : date.replace(" ", "T") + "Z"
    );

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date unavailable";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
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

  // Show portal selection
  if (!selectedPortal) {
    return <PortalSelect onSelect={selectPortal} />;
  }

  
    
  if (selectedPortal === "admin") {
    return <AdminDashboard onBack={backToPortal} />;
  }

  // Student portal
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
          { name: "Notifications", icon: Bell },
          { name: "Settings", icon: Settings },
        ].map(({ name, icon: Icon }) => (
          <button
            key={name}
            className={`nav-item ${activeTab === name ? "active" : ""}`}
            onClick={() => setActiveTab(name)}
          >
            <Icon size={19} />
            {name}

            {name === "Notifications" && unreadCount > 0 && (
              <span className="nav-notification-count">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>
        ))}

        <button className="nav-item" onClick={backToPortal}>
          <ArrowUpRight size={19} />
          Switch Portal
        </button>

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
          <button className="mobile-menu" aria-label="Menu">
            <Menu />
          </button>

          <div>
            <p>PARUL UNIVERSITY / STUDENT PORTAL</p>
            <h3>{activeTab}</h3>
          </div>

          <div className="top-actions">
            <button
              className="icon-button notification-bell"
              aria-label={`${unreadCount} unread notifications`}
              title={`${unreadCount} unread notifications`}
              onClick={() => setActiveTab("Notifications")}
            >
              <Bell />

              {unreadCount > 0 && (
                <span className="notification-count">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            <div className="profile-avatar">DS</div>
          </div>
        </header>

        {/* New Complaint Page */}
        {activeTab === "New Complaint" ? (
          <ComplaintForm
            onBack={() => {
              setActiveTab("Dashboard");
              fetchComplaints();
            }}
          />
        ) : activeTab === "Notifications" ? (
          <section className="notifications-page">
            <div className="notifications-page-header">
              <div>
                <span className="eyebrow">STUDENT UPDATES</span>
                <h2>Notifications</h2>
                <p>
                  Stay updated about your complaints and their progress.
                </p>
              </div>

              <button
                className="refresh-notifications"
                onClick={fetchNotifications}
                disabled={notificationsLoading}
              >
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>

            <div className="notification-summary">
              <div className="notification-summary-card">
                <span>Total Notifications</span>
                <h2>{notifications.length}</h2>
              </div>

              <div className="notification-summary-card">
                <span>Unread</span>
                <h2>{unreadCount}</h2>
              </div>

              <div className="notification-summary-card">
                <span>Read</span>
                <h2>{notifications.length - unreadCount}</h2>
              </div>
            </div>

            {notificationError && (
              <div className="notification-error">
                {notificationError}
              </div>
            )}

            {notificationsLoading && notifications.length === 0 ? (
              <div className="notifications-empty">
                <RefreshCw size={32} />
                <h3>Loading notifications...</h3>
              </div>
            ) : notifications.length === 0 ? (
              <div className="notifications-empty">
                <Bell size={38} />
                <h3>You're all caught up!</h3>
                <p>
                  You will receive updates here when your complaint
                  status changes.
                </p>
              </div>
            ) : (
              <div className="notifications-page-list">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`notification-card ${
                      notification.is_read ? "read" : "unread"
                    }`}
                  >
                    <div className="notification-card-icon">
                      {notification.is_read ? (
                        <CheckCircle2 size={21} />
                      ) : (
                        <Bell size={21} />
                      )}
                    </div>

                    <div className="notification-card-content">
                      <div className="notification-card-heading">
                        <h3>Complaint Update</h3>

                        <span
                          className={`notification-status ${
                            notification.is_read ? "read" : "unread"
                          }`}
                        >
                          {notification.is_read ? "READ" : "UNREAD"}
                        </span>
                      </div>

                      <p>{notification.message}</p>

                      <div className="notification-card-meta">
                        <span>
                          Ticket: {notification.ticket_id}
                        </span>

                        <span>
                          {formatDate(notification.created_at)}
                        </span>
                      </div>
                    </div>

                    {!notification.is_read ? (
                      <button
                        className="mark-read-button"
                        disabled={markingReadId === notification.id}
                        onClick={() =>
                          markNotificationRead(notification.id)
                        }
                      >
                        <Check size={16} />

                        {markingReadId === notification.id
                          ? "Updating..."
                          : "Mark as read"}
                      </button>
                    ) : (
                      <span className="read-indicator">
                        <CheckCircle2 size={16} />
                        Read
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : activeTab === "My Complaints" ? (
          <section className="recent-section">
            <div className="section-heading">
              <div>
                <span className="eyebrow">YOUR REPORTS</span>
                <h2>My Complaints</h2>
              </div>

              <button onClick={fetchComplaints} disabled={loading}>
                <RefreshCw size={16} />
                Refresh
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
                <p>Loading your complaints...</p>
              </div>
            ) : complaints.length === 0 ? (
              <div className="empty-state">
                <ClipboardList size={35} />
                <h3>No complaints yet</h3>
                <p>Your submitted complaints will appear here.</p>

                <button
                  className="report-button"
                  onClick={() => setActiveTab("New Complaint")}
                >
                  <Mic size={19} />
                  Report an Issue
                  <ArrowUpRight size={18} />
                </button>
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