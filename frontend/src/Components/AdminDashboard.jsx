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
    <></>
  );
}

export default AdminDashboard;