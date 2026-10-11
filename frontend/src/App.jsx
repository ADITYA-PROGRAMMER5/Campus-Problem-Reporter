import { useState } from "react";
import Register from "./components/Register";
import Login from "./components/Login";
import "./index.css";

function App() {
  const [currentPage, setCurrentPage] = useState("login");

  return currentPage === "login" ? (
    <Login onCreateAccount={() => setCurrentPage("register")} />
  ) : (
    <Register onLogin={() => setCurrentPage("login")} />
  );
}

export default App;