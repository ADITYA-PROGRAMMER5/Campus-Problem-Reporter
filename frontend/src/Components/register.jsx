
import { useState } from "react";
import { registerStudent } from "../Services/api";

function Register({ onLogin }) {  // Store the student's form values
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Update the field the student is typing in
  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      // Call the API function from services/api.js
      const data = await registerStudent(formData);

      setMessage(data.message);

      // Clear the form after successful registration
      setFormData({
        name: "",
        email: "",
        password: "",
      });
    } catch (error) {
      // Display the error returned by the API
      setMessage(error.message || "Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="register-container">
      <h1>Student Registration</h1>
      <p>Create your Campus Problem Reporter account.</p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Full Name</label>
        <input
          id="name"
          type="text"
          name="name"
          placeholder="Enter your name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          placeholder="Minimum 8 characters"
          value={formData.password}
          onChange={handleChange}
          minLength={8}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Create Account"}
        </button>

        {message && <p className="form-message">{message}</p>}
      </form>

      <p className="auth-switch">
        Already have an account?{" "}
        <a
          href="#login"
          onClick={(event) => {
            event.preventDefault();
            onLogin();
          }}
        >
          Login
        </a>
      </p>
    </main>
  );
}

export default Register;