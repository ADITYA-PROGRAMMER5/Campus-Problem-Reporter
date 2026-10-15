import { useState } from "react";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
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

  const [currentPage, setCurrentPage] = useState(() =>
    getSavedUser() ? "dashboard" : "login"
  );

  // Save user details after successful login
  function handleLoginSuccess(userData) {
    sessionStorage.setItem(
      "campusReporterUser",
      JSON.stringify(userData)
    );

    setUser(userData);
    setCurrentPage("dashboard");
  }

  // Clear saved user details on logout
  function handleLogout() {
    sessionStorage.removeItem("campusReporterUser");

    setUser(null);
    setCurrentPage("login");
  }

  if (currentPage === "dashboard" && user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  if (currentPage === "register") {
    return <Register onLogin={() => setCurrentPage("login")} />;
  }

  return (
    <Login
      onCreateAccount={() => setCurrentPage("register")}
      onLoginSuccess={handleLoginSuccess}
    />
  );
}

export default App;