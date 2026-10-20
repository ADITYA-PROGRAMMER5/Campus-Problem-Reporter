import { useEffect, useState } from "react";

function ReportList({ refreshKey, userId }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Edit modal state
  const [editingReport, setEditingReport] = useState(null);
  const [editData, setEditData] = useState({});
  const [editMessage, setEditMessage] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  // Delete confirmation modal state
  const [deletingReport, setDeletingReport] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [deleting, setDeleting] = useState(false);

  async function fetchReports() {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:8000/api/myReports.php",
        {
          method: "GET",
          credentials: "include",
        }
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

  // ---------------- EDIT REPORT ----------------

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
    if (savingEdit) return;

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

  async function handleEditSubmit(event) {
    event.preventDefault();

    if (!editingReport || savingEdit) return;

    const hasChanges = Object.keys(editData).some(
      (key) => (editingReport[key] || "") !== editData[key]
    );

    if (!hasChanges) {
      setEditMessage("No changes detected.");
      return;
    }

    setSavingEdit(true);
    setEditMessage("Saving changes...");

    try {
      const response = await fetch(
        "http://localhost:8000/api/updateReport.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: editingReport.id,
            user_id: userId,
            ...editData,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update report.");
      }

      await fetchReports();

      setEditingReport(null);
      setEditData({});
      setEditMessage("");
      setMessage("Report updated successfully!");
    } catch (error) {
      setEditMessage(
        error.message || "Could not connect to the server."
      );
    } finally {
      setSavingEdit(false);
    }
  }

  // ---------------- DELETE REPORT ----------------

  function startDeleting(report) {
    setDeletingReport(report);
    setDeleteMessage("");
  }

  function closeDeleteModal() {
    if (deleting) return;

    setDeletingReport(null);
    setDeleteMessage("");
  }

  async function handleDeleteReport() {
    if (!deletingReport || deleting) return;

    setDeleting(true);
    setDeleteMessage("Deleting report...");

    try {
      const response = await fetch(
        "http://localhost:8000/api/deleteReport.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: deletingReport.id,
            user_id: userId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to delete report.");
      }

      // Remove the deleted report from the visible list.
      setReports((previousReports) =>
        previousReports.filter(
          (report) => report.id !== deletingReport.id
        )
      );

      setDeletingReport(null);
      setDeleteMessage("");
      setMessage("Report deleted successfully!");
    } catch (error) {
      setDeleteMessage(
        error.message || "Could not connect to the server."
      );
    } finally {
      setDeleting(false);
    }
  }

  // ---------------- SEARCH AND PAGINATION ----------------

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

  // Keep the current page valid after deleting the last item on it.
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

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

      {filteredReports.length === 0 && (
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

            <div className="report-actions">
              <button
                type="button"
                className="edit-report-btn"
                onClick={() => startEditing(report)}
              >
                Edit Report
              </button>

              <button
                type="button"
                className="delete-report-btn"
                onClick={() => startDeleting(report)}
              >
                Delete Report
              </button>
            </div>
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

      {/* EDIT MODAL */}
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
                disabled={savingEdit}
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
                disabled={savingEdit}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="edit-save-btn"
                disabled={savingEdit}
              >
                {savingEdit ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingReport && (
        <div
          className="delete-modal-overlay"
          onClick={closeDeleteModal}
        >
          <div
            className="delete-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
            aria-describedby="delete-modal-description"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="delete-modal-icon">
              <span aria-hidden="true">!</span>
            </div>

            <span className="delete-eyebrow">
              DELETE CONFIRMATION
            </span>

            <h2 id="delete-modal-title">
              Delete this report?
            </h2>

            <p id="delete-modal-description">
              You're about to permanently delete{" "}
              <strong>{deletingReport.title}</strong>. This action
              cannot be undone.
            </p>

            {deleteMessage && (
              <p
                className="delete-inline-message"
                role="status"
              >
                {deleteMessage}
              </p>
            )}

            <div className="delete-modal-actions">
              <button
                type="button"
                className="delete-cancel-btn"
                onClick={closeDeleteModal}
                disabled={deleting}
              >
                Cancel
              </button>

              <button
                type="button"
                className="delete-confirm-btn"
                onClick={handleDeleteReport}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete Report"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default ReportList;