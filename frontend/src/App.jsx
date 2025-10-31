import "./App.css";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { useQueryClient } from "@tanstack/react-query";

function App() {
  const queryClient = useQueryClient(); // to use clear() method

  const [currentPage, setCurrentPage] = useState("login");

  // Track if user is logged in
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true), setCurrentPage("dashboard");
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setCurrentPage("login");
    queryClient.clear(); // important !
  };

  return (
    <div className="app">
      {currentPage === "login" && (
        <Login
          onSuccess={handleLoginSuccess}
          onSwitchToRegister={() => setCurrentPage("register")}
        />
      )}

      {currentPage === "register" && (
        <Register
          onSuccess={handleLoginSuccess}
          onSwitchToLogin={() => setCurrentPage("login")}
        />
      )}

      {currentPage === "dashboard" && isAuthenticated && (
        <Dashboard onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
