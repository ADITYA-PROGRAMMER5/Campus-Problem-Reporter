import { useState } from "react";
import Dashboard from "./Components/Dashboard";
import Login from "./Components/login";
import Register from "./Components/register";
import AdminDashboard from "./Components/AdminDashboard";
import "./index.css";

// Restore the saved user when the app starts
function getSavedUser() {
  try {
    const savedUser = sessionStorage.getItem("campusReporterUser");
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    return null;
  }
}

function App() {
  const [user, setUser] = useState(() => getSavedUser());

  const [currentPage, setCurrentPage] = useState(() => {
    const savedUser = getSavedUser();

    if (!savedUser) return "login";

    return savedUser.role === "admin" ? "admin" : "dashboard";
  });

  // Save the logged-in user's details
  function handleLoginSuccess(userData) {
    sessionStorage.setItem(
      "campusReporterUser",
      JSON.stringify(userData)
    );

    setUser(userData);

    // Open the correct dashboard based on the user's role
    setCurrentPage(
      userData.role === "admin" ? "admin" : "dashboard"
    );
  }

  // Log out the user
  async function handleLogout() {
    try {
      const response = await fetch(
        "http://localhost:8000/api/logout.php",
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Logout failed.");
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear frontend login information
      sessionStorage.removeItem("campusReporterUser");

      // Reset React state
      setUser(null);
      setCurrentPage("login");
    }
  }

  // Show the admin dashboard
  if (user && currentPage === "admin" && user.role === "admin") {
    return (
      <AdminDashboard
        user={user}
        onLogout={handleLogout}
      />
    );
  }

  // Show the student dashboard
  if (user && currentPage === "dashboard") {
    return (
      <Dashboard
        user={user}
        onLogout={handleLogout}
      />
    );
  }

  // Show registration
  if (currentPage === "register") {
    return (
      <Register
        onLogin={() => setCurrentPage("login")}
      />
    );
  }

  // Show login
  return (
    <Login
      onCreateAccount={() => setCurrentPage("register")}
      onLoginSuccess={handleLoginSuccess}
    />
  );
}

export default App;