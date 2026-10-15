import { useEffect, useState } from "react";

function ReportList({ refreshKey, userId }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [editingReport, setEditingReport] = useState(null);
  const [editData, setEditData] = useState({});
  const [editMessage, setEditMessage] = useState("");

  async function fetchReports() {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `http://localhost:8000/api/myReports.php?user_id=${userId}`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not fetch reports.");
      }

      setReports(data.reports || []);
    } catch (error) {
      setMessage(error.message || "Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReports();
  }, [refreshKey, userId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, refreshKey]);

  function startEditing(report) {
    setEditingReport(report);
    setEditMessage("");

    setEditData({
      title: report.title || "",
      description: report.description || "",
      category: report.category || "",
      location: report.location || "",
    });
  }

  function closeEditModal() {
    setEditingReport(null);
    setEditData({});
    setEditMessage("");
  }

  function handleEditChange(event) {
    const { name, value } = event.target;

    setEditData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  function handleEditSubmit(event) {
    event.preventDefault();

    if (!editingReport) return;

    const hasChanges = Object.keys(editData).some(
      (key) => (editingReport[key] || "") !== editData[key]
    );

    if (!hasChanges) {
      setEditMessage("No changes detected.");
      return;
    }

    // Temporary frontend-only save.
    // PostgreSQL is not updated yet.
    setReports((previousReports) =>
      previousReports.map((report) =>
        report.id === editingReport.id
          ? { ...report, ...editData }
          : report
      )
    );

    closeEditModal();

    setMessage(
      "Changes updated on this page only. They are not saved to the database."
    );
  }

  const filteredReports = reports.filter((report) => {
    const matchesSearch = (report.title || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || report.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const reportsPerPage = 5;
  const totalPages = Math.ceil(
    filteredReports.length / reportsPerPage
  );

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

      {message && (
        <p className="form-message" role="status">
          {message}
        </p>
      )}

      <div className="report-filters">
        <input
          type="text"
          placeholder="Search reports by title..."
          aria-label="Search reports by title"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />

        <select
          aria-label="Filter reports by status"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {!message && filteredReports.length === 0 && (
        <p>No matching reports found.</p>
      )}

      <div className="reports-container">
        {currentReports.map((report) => (
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
              <p>
                <strong>Category:</strong> {report.category}
              </p>

              <p>
                <strong>Location:</strong> {report.location}
              </p>

              <p>
                <strong>Priority:</strong>{" "}
                <span className={`priority ${report.priority}`}>
                  {report.priority}
                </span>
              </p>

              <p>
                <strong>Reported by:</strong> {report.student_name}
              </p>

              <p>
                <strong>Date:</strong> {report.created_at}
              </p>
            </div>

            <button
              type="button"
              className="edit-report-btn"
              onClick={() => startEditing(report)}
            >
              Edit Report
            </button>
          </article>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            type="button"
            onClick={() =>
              setCurrentPage((page) => Math.max(1, page - 1))
            }
            disabled={currentPage === 1}
          >
            Previous
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            type="button"
            onClick={() =>
              setCurrentPage((page) =>
                Math.min(totalPages, page + 1)
              )
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* Edit modal: outside the report-card loop */}
      {editingReport && (
        <div
          className="edit-modal-overlay"
          onClick={closeEditModal}
        >
          <form
            className="edit-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-modal-title"
            onSubmit={handleEditSubmit}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="edit-modal-header">
              <div>
                <span className="edit-eyebrow">
                  REPORT MANAGEMENT
                </span>

                <h2 id="edit-modal-title">Edit Report</h2>

                <p>
                  Update the details of your campus issue.
                </p>
              </div>

              <button
                type="button"
                className="edit-close-btn"
                onClick={closeEditModal}
                aria-label="Close edit form"
              >
                ×
              </button>
            </div>

            <div className="edit-modal-body">
              <div className="edit-field">
                <label htmlFor="edit-title">
                  Report Title <span>*</span>
                </label>

                <input
                  id="edit-title"
                  name="title"
                  value={editData.title}
                  onChange={handleEditChange}
                  placeholder="e.g. Wi-Fi not working"
                  maxLength={200}
                  required
                  autoFocus
                />
              </div>

              <div className="edit-field">
                <label htmlFor="edit-description">
                  Description <span>*</span>
                </label>

                <textarea
                  id="edit-description"
                  name="description"
                  value={editData.description}
                  onChange={handleEditChange}
                  placeholder="Describe the issue and how it affects students..."
                  rows={4}
                  required
                />
              </div>

              <div className="edit-fields-grid">
                <div className="edit-field">
                  <label htmlFor="edit-category">
                    Category <span>*</span>
                  </label>

                  <input
                    id="edit-category"
                    name="category"
                    value={editData.category}
                    onChange={handleEditChange}
                    placeholder="e.g. Network"
                    maxLength={50}
                    required
                  />
                </div>

                <div className="edit-field">
                  <label htmlFor="edit-location">
                    Campus Location <span>*</span>
                  </label>

                  <input
                    id="edit-location"
                    name="location"
                    value={editData.location}
                    onChange={handleEditChange}
                    placeholder="e.g. Computer Lab 1"
                    maxLength={150}
                    required
                  />
                </div>
              </div>

              <p className="edit-required-note">
                <span>*</span> Required fields
              </p>

              {editMessage && (
                <p className="edit-inline-message" role="status">
                  {editMessage}
                </p>
              )}
            </div>

            <div className="edit-modal-footer">
              <button
                type="button"
                className="edit-cancel-btn"
                onClick={closeEditModal}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="edit-save-btn"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

export default ReportList;