import { useState } from "react";

function ReportForm({ userId, onReportCreated }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    priority: "medium",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Update the field the student changes
  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  // Submit the report to the PHP backend
  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8000/api/createReport.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            user_id: userId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not submit report");
      }

      setMessage(data.message || "Report submitted successfully!");

      // Clear the form after a successful submission
      setFormData({
        title: "",
        description: "",
        category: "",
        location: "",
        priority: "medium",
      });

      // Tell the dashboard to refresh its report list
      if (onReportCreated) {
        onReportCreated();
      }
    } catch (error) {
      setMessage(error.message || "Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="report-form">
      <h2>Report a Campus Problem</h2>

      <form onSubmit={handleSubmit}>
        <label htmlFor="report-title">Problem Title</label>
        <input
          id="report-title"
          type="text"
          name="title"
          placeholder="e.g. Wi-Fi not working"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <label htmlFor="report-description">Description</label>
        <textarea
          id="report-description"
          name="description"
          placeholder="Describe the problem..."
          value={formData.description}
          onChange={handleChange}
          required
        />

        <label htmlFor="report-category">Category</label>
        <input
          id="report-category"
          type="text"
          name="category"
          placeholder="e.g. Network, Classroom"
          value={formData.category}
          onChange={handleChange}
          required
        />

        <label htmlFor="report-location">Location</label>
        <input
          id="report-location"
          type="text"
          name="location"
          placeholder="e.g. Computer Lab 1"
          value={formData.location}
          onChange={handleChange}
          required
        />

        <label htmlFor="report-priority">Priority</label>
        <select
          id="report-priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Report"}
        </button>

        {message && <p className="form-message">{message}</p>}
      </form>
    </section>
  );
}

export default ReportForm;