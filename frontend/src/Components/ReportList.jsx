import { useEffect, useState } from "react";

function ReportList({ refreshKey, userId }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

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

  // Filter reports by title and selected status
  const filteredReports = reports.filter((report) => {
    const matchesSearch = report.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || report.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const reportsPerPage = 5;

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);

  // Find the reports to display on the current page
  const startIndex = (currentPage - 1) * reportsPerPage;

  const currentReports = filteredReports.slice(
    startIndex,
    startIndex + reportsPerPage
  );

  if (loading) {
    return <p>Loading reports...</p>;
  }

  return (
    <section className="report-list">

      <h2>My Reports</h2>

      <div className="report-filters">
        <input
          type="text"
          placeholder="Search reports by title..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {message && <p className="form-message">{message}</p>}

      {!message && filteredReports.length === 0 && (
        <p>No matching reports found.</p>
      )}

      <div className="reports-container">
        {filteredReports.map((report) => (
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