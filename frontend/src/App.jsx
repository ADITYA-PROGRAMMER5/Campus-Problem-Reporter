
import { useState } from "react";
import Register from "./Components/Register";
import Login from "./Components/login";
import Dashboard from "./Components/Dashboard";
import "./index.css";

function App() {
  const [currentPage, setCurrentPage] = useState("login");
  const [user, setUser] = useState(null);

  // Save the user and open the dashboard after successful login
  function handleLoginSuccess(userData) {
    setUser(userData);
    setCurrentPage("dashboard");
  }

  // Log out and return to the login page
  function handleLogout() {
    setUser(null);
    setCurrentPage("login");
  }

  // Show the dashboard after login
  if (currentPage === "dashboard" && user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  // Show registration
  if (currentPage === "register") {
    return <Register onLogin={() => setCurrentPage("login")} />;
  }

  // Show login by default
  return (
    <Login
      onCreateAccount={() => setCurrentPage("register")}
      onLoginSuccess={handleLoginSuccess}
    />
  );
}

export default App;