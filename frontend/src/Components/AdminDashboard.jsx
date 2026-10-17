import { useEffect, useState } from "react";
import "./AdminDashboard.css";

const API_URL = "http://localhost:8000/api/reports.php";

function AdminDashboard({ user, onLogout }) {
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all reports from the PHP backend
  async function fetchReports() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load reports.");
      }

      setReports(data.reports);
    } catch (err) {
      setError(err.message || "Could not connect to the backend.");
    } finally {
      setLoading(false);
    }
  }

  // Load reports when the dashboard opens
  useEffect(() => {
    fetchReports();
  }, []);

  // Calculate report statistics
  const totalReports = reports.length;

  const pendingReports = reports.filter(
    (report) => report.status.toLowerCase() === "pending"
  ).length;

  const inProgressReports = reports.filter(
    (report) => report.status.toLowerCase() === "in progress"
  ).length;

  const resolvedReports = reports.filter(
    (report) => report.status.toLowerCase() === "resolved"
  ).length;

  // Apply the selected status filter
  const filteredReports =
    filter === "all"
      ? reports
      : reports.filter(
          (report) =>
            report.status.toLowerCase() === filter.toLowerCase()
        );

  return (
    <main className="admin-container">
      <header className="admin-header">
        <div>
          <p className="admin-label">CAMPUS PROBLEM REPORTER</p>
          <h1>Admin Dashboard</h1>
          <p>Welcome, {user.name}!</p>
        </div>

        <button className="admin-logout" onClick={onLogout}>
          Logout
        </button>
      </header>

      <section className="admin-stats">
        <article className="stat-card">
          <p>Total Reports</p>
          <h2>{totalReports}</h2>
        </article>

        <article className="stat-card pending-card">
          <p>Pending</p>
          <h2>{pendingReports}</h2>
        </article>

        <article className="stat-card progress-card">
          <p>In Progress</p>
          <h2>{inProgressReports}</h2>
        </article>

        <article className="stat-card resolved-card">
          <p>Resolved</p>
          <h2>{resolvedReports}</h2>
        </article>
      </section>

      <section className="admin-reports">
        <div className="reports-heading">
          <div>
            <h2>All Student Reports</h2>
            <p>View reports submitted across the campus.</p>
          </div>

          <button
            className="refresh-button"
            onClick={fetchReports}
            disabled={loading}
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        <div className="report-filters">
          <label htmlFor="status-filter">Filter by status:</label>

          <select
            id="status-filter"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            <option value="all">All Reports</option>
            <option value="pending">Pending</option>
            <option value="in progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        {loading && <p>Loading reports...</p>}

        {!loading && error && (
          <div className="admin-error">
            <p>{error}</p>
            <button onClick={fetchReports}>Try Again</button>
          </div>
        )}

        {!loading && !error && filteredReports.length === 0 && (
          <p className="empty-reports">No reports found.</p>
        )}

        {!loading && !error && filteredReports.length > 0 && (
          <div className="reports-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Report</th>
                  <th>Student</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Priority</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredReports.map((report) => (
                  <tr key={report.id}>
                    <td>{report.id}</td>

                    <td>
                      <strong>{report.title}</strong>
                      <p className="report-description">
                        {report.description}
                      </p>
                    </td>

                    <td>
                      <strong>{report.student_name}</strong>
                      <p className="report-description">
                        {report.student_email}
                      </p>
                    </td>

                    <td>{report.category}</td>
                    <td>{report.location}</td>
                    <td>
                      <span
                        className={`priority-badge ${report.priority
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      >
                        {report.priority}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`status-badge ${report.status
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      >
                        {report.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default AdminDashboard;