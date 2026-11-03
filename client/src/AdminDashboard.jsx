import { useEffect, useState } from "react";
import axios from "axios";
import {
  LayoutDashboard,
  RefreshCw,
  ClipboardList,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import "./AdminDashboard.css";

const API = "http://localhost:5000/api/complaints";

function AdminDashboard({ onBack }) {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState("");
  const [error, setError] = useState("");

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(API);
      setComplaints(response.data.complaints || []);
    } catch (err) {
      setError("Unable to load complaints. Check whether the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const updateStatus = async (ticketId, status) => {
    try {
      setUpdating(ticketId);

      await axios.patch(`${API}/${ticketId}/status`, { status });

      setComplaints((previous) =>
        previous.map((complaint) =>
          complaint.ticket_id === ticketId
            ? { ...complaint, status }
            : complaint
        )
      );
    } catch (err) {
      alert("Could not update complaint status.");
    } finally {
      setUpdating("");
    }
  };

  const pending = complaints.filter((c) => c.status === "Pending").length;
  const inProgress = complaints.filter(
    (c) => c.status === "In Progress"
  ).length;
  const resolved = complaints.filter((c) => c.status === "Resolved").length;

  const stats = [
    { title: "Total Complaints", value: complaints.length, icon: ClipboardList },
    { title: "Pending", value: pending, icon: Clock },
    { title: "In Progress", value: inProgress, icon: AlertCircle },
    { title: "Resolved", value: resolved, icon: CheckCircle },
  ];

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="admin-brand">
          <div className="admin-logo">UV</div>
          <div>
            <h2>UniVoice</h2>
            <p>Administration Portal</p>
          </div>
        </div>

        <div className="admin-header-right">
          <span className="admin-role">Administrator</span>
          <button
            className="admin-back"
            onClick={() => (onBack ? onBack() : (window.location.href = "/"))}
          >
            <ArrowLeft size={16} /> Back to Portal
          </button>
        </div>
      </header>

      <main className="admin-main">
        <div className="admin-title-row">
          <div>
            <h1><LayoutDashboard size={26} /> Admin Dashboard</h1>
            <p>Manage and monitor student hostel complaints.</p>
          </div>

          <button className="admin-refresh" onClick={fetchComplaints}>
            <RefreshCw size={16} /> Refresh
          </button>
        </div>

        <section className="admin-stats">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div className="admin-stat-card" key={stat.title}>
                <div className="admin-stat-icon"><Icon size={21} /></div>
                <div>
                  <p>{stat.title}</p>
                  <h2>{stat.value}</h2>
                </div>
              </div>
            );
          })}
        </section>

        <section className="admin-table-section">
          <div className="admin-table-heading">
            <div>
              <h2>All Complaints</h2>
              <p>Review complaints and update their status.</p>
            </div>
            <span>{complaints.length} records</span>
          </div>

          {error && <p className="admin-error">{error}</p>}

          {loading ? (
            <p className="admin-message">Loading complaints...</p>
          ) : complaints.length === 0 ? (
            <p className="admin-message">No complaints have been submitted yet.</p>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Ticket ID</th>
                    <th>Student</th>
                    <th>Category</th>
                    <th>Complaint</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Update Status</th>
                  </tr>
                </thead>

                <tbody>
                  {complaints.map((complaint) => (
                    <tr key={complaint.ticket_id}>
                      <td className="admin-ticket">{complaint.ticket_id}</td>
                      <td>
                        <strong>{complaint.student_name}</strong>
                        <small>{complaint.student_id}</small>
                      </td>
                      <td>{complaint.category}</td>
                      <td className="admin-description">
                        {complaint.description}
                        <small>
                          {complaint.hostel}
                          {complaint.room_number
                            ? ` · Room ${complaint.room_number}`
                            : ""}
                        </small>
                      </td>
                      <td>
                        <span className={`admin-priority ${(complaint.priority || "Medium").toLowerCase()}`}>
                          {complaint.priority || "Medium"}
                        </span>
                      </td>
                      <td>
                        <span className={`admin-status ${complaint.status.toLowerCase().replace(" ", "-")}`}>
                          {complaint.status}
                        </span>
                      </td>
                      <td>
                        <select
                          className="admin-status-select"
                          value={complaint.status}
                          disabled={updating === complaint.ticket_id}
                          onChange={(e) =>
                            updateStatus(complaint.ticket_id, e.target.value)
                          }
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                        {updating === complaint.ticket_id && (
                          <small>Updating...</small>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;