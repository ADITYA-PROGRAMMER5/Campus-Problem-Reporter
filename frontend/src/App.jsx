import { useState } from "react";

function App() {
  const [formData, setFormData] = useState({
    user_id: 1,
    title: "",
    description: "",
    category: "",
    location: "",
    priority: "medium",
  });

  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("Submitting...");

    try {
      const response = await fetch(
        "http://localhost:8000/api/create_report.php",
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

        setFormData({
          user_id: 1,
          title: "",
          description: "",
          category: "",
          location: "",
          priority: "medium",
        });
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

      <p>{message}</p>
    </div>
  );
}

export default App;