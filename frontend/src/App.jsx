import { useEffect, useState } from "react";

function App() {
  // Form data
  const [formData, setFormData] = useState({
    user_id: 1,
    title: "",
    description: "",
    category: "",
    location: "",
    priority: "medium",
  });

  // Store reports received from the backend
  const [reports, setReports] = useState([]);

  // Message shown to the user
  const [message, setMessage] = useState("");

  // Fetch reports from PHP backend
  const fetchReports = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/reports.php"
      );

      const data = await response.json();

      if (data.success) {
        setReports(data.reports);
      }
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    }
  };

  // Fetch reports when the page loads
  useEffect(() => {
    fetchReports();
  }, []);

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("Submitting...");

    try {
      const response = await fetch(
        "http://localhost:8000/api/createReport.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessage("Report submitted successfully!");

        // Clear form
        setFormData({
          user_id: 1,
          title: "",
          description: "",
          category: "",
          location: "",
          priority: "medium",
        });

        // Fetch latest reports
        fetchReports();
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error(error);
      setMessage("Could not connect to the backend.");
    }
  };

  return (
    <div>
      <h1>Campus Problem Reporter</h1>

      {/* Report Form */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Problem title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Describe the problem"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
        />

        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <button type="submit">
          Submit Report
        </button>
      </form>

      {/* Success / Error Message */}
      <p>{message}</p>

      {/* My Reports */}
      <h2>My Reports</h2>

      {reports.length === 0 ? (
        <p>No reports found.</p>
      ) : (
        <div className="reports-container">
          {reports.map((report) => (
            <div className="report-card" key={report.id}>

              <div className="report-header">
                <h3>{report.title}</h3>

                <span className={`status ${report.status}`}>
                  {report.status}
                </span>
              </div>

              <p className="description">
                {report.description}
              </p>

              <div className="report-details">

                <p>
                  <strong>Category:</strong>{" "}
                  {report.category}
                </p>

                <p>
                  <strong>Location:</strong>{" "}
                  {report.location}
                </p>

                <p>
                  <strong>Priority:</strong>{" "}
                  <span className={`priority ${report.priority}`}>
                    {report.priority}
                  </span>
                </p>

                <p>
                  <strong>Reported by:</strong>{" "}
                  {report.student_name}
                </p>

                <p>
                  <strong>Date:</strong>{" "}
                  {report.created_at}
                </p>

              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;