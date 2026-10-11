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

  
}

export default ReportForm;