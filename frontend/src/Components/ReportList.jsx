import { useEffect, useState } from "react";

function ReportList({ refreshKey, userId }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Fetch reports from the PHP backend
  async function fetchReports() {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `http://localhost:8000/api/myReports.php?user_id=${userId}`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not fetch reports");
      }

      setReports(data.reports || []);
    } catch (error) {
      setMessage(error.message || "Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  // Load reports when the component opens or refreshKey changes
  useEffect(() => {
    fetchReports();
  }, [refreshKey, userId]);

  if (loading) {
    return <p>Loading reports...</p>;
  }

  return (
    <section className="report-list">
      <h2>Campus Reports</h2>

      {message && <p className="form-message">{message}</p>}

      {!message && reports.length === 0 && (
        <p>No reports found.</p>
      )}

      <div className="reports-container">
        {reports.map((report) => (
          <article className="report-card" key={report.id}>
            <div className="report-header">
              <h3>{report.title}</h3>
              <span className={`status ${report.status}`}>
                {report.status === "pending"
                  ? "Pending"
                  : report.status === "in_progress"
                    ? "In Progress"
                    : report.status === "resolved"
                      ? "Resolved"
                      : report.status}
              </span>
            </div>

            <p className="description">{report.description}</p>

            <div className="report-details">
              <p><strong>Category:</strong> {report.category}</p>
              <p><strong>Location:</strong> {report.location}</p>

              <p>
                <strong>Priority:</strong>{" "}
                <span className={`priority ${report.priority}`}>
                  {report.priority}
                </span>
              </p>

              <p><strong>Reported by:</strong> {report.student_name}</p>
              <p><strong>Date:</strong> {report.created_at}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ReportList;