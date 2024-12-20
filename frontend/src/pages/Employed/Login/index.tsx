import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/LoginAdmin.css";
import { FaArrowLeft } from "react-icons/fa"; // Importera tillbaka-pilen från react-icons
import { saveAdminToken, removeAdminToken } from "../../../utils/auth"; // Importera removeAdminToken

const LoginAdmin = () => {
  const [adminID, setAdminID] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Funktion för att navigera tillbaka till användarens login
  const handleBackToLogin = () => {
    navigate("/user/login");
  };

  // Rensa gammal token när komponenten laddas
  useEffect(() => {
    removeAdminToken(); // Ta bort eventuell tidigare token
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Rensa tidigare fel

    const loginData = { adminID, adminPassword };

    try {
      const response = await fetch("https://3uhcgg5udg.execute-api.eu-north-1.amazonaws.com/admin/login", 
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

        // Spara JWT-token
        saveAdminToken(data.token);

        // Navigera till admin-dashboard
        navigate("/admin/dashboard");
      } else {
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
      {/* Lägg till en knapp eller ikon för att gå tillbaka */}
      <div className="back-button" onClick={() => navigate("/user/login")}>
              <FaArrowLeft size={20} /> {/* You can adjust the size of the arrow */}
              <span>Back to User Login</span>
            </div>
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
      </form>
    </div>
  );
};

export default LoginAdmin;
