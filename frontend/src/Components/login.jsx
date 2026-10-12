
import { useState } from "react";
import { loginStudent } from "../Services/api";

function Login({ onCreateAccount, onLoginSuccess }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Update the field being typed into
  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  // Submit the login form
  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const data = await loginStudent(formData);

      setMessage(data.message);
      setLoggedInUser(data.user);

      // Clear the password field after successful login
      setFormData((previousData) => ({
        ...previousData,
        password: "",
      }));
    } catch (error) {
      setLoggedInUser(null);
      setMessage(error.message || "Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="register-container">
      <h1>Student Login</h1>
      <p>Sign in to Campus Problem Reporter.</p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {message && <p className="form-message">{message}</p>}
      </form>

      {loggedInUser && (
        <section>
          <h2>Welcome, {loggedInUser.name}!</h2>
          <p>Email: {loggedInUser.email}</p>
          <p>Role: {loggedInUser.role}</p>
        </section>
      )}

      <p className="auth-switch">
        Don't have an account?{" "}
        <a
          href="#register"
          onClick={(event) => {
            event.preventDefault();
            onCreateAccount();
          }}
        >
          Create an account
        </a>
      </p>
    </main>


  );
}

export default Login;