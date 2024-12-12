import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/LoginAdmin.css";

const LoginAdmin = () => {
  const [adminID, setAdminID] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Funktion för att navigera tillbaka till användarens login
  const handleBackToLogin = () => {
    navigate("/user/login"); // Här anger du rätt väg till användarens login-sida
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Rensa tidigare fel

    const loginData = { adminID, adminPassword };

    try {
      const response = await fetch(
        "https://3uhcgg5udg.execute-api.eu-north-1.amazonaws.com/admin/login", // Ersätt med rätt endpoint
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Admin login successful:", data);

        // Spara JWT-token i localStorage
        localStorage.setItem("adminToken", data.token);

        // Navigera till admin-dashboard
        navigate("/admin/dashboard");
      } else {
        // Felhantering om login misslyckas
        const errorData = await response.json();
        setError(errorData.error || "Failed to log in as admin");
      }
    } catch (error) {
      console.error("Error during admin login:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="admin-login-container">
      <h2>Admin Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleLogin} className="admin-login-form">
        <div className="form-group">
          <label htmlFor="adminID">Admin ID:</label>
          <input
            type="text"
            id="adminID"
            value={adminID}
            onChange={(e) => setAdminID(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="adminPassword">Password:</label>
          <input
            type="password"
            id="adminPassword"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="admin-login-button">
          Log In
        </button>
        {/* Lägg till en knapp för att gå tillbaka */}
        <button onClick={handleBackToLogin} className="back-button">
          ← Back to User Login
        </button>
      </form>
    </div>
  );
};

export default LoginAdmin;
