import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importera useNavigate
import "../../../styles/LoginUser.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // För att visa felmeddelanden
  const navigate = useNavigate(); // Skapa navigate-funktionen

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Rensa tidigare fel

    const loginData = { email, password };

    console.log("Sending login request with data:", loginData);

    try {
      const response = await fetch(
        "https://cbcxsumuq8.execute-api.eu-north-1.amazonaws.com/dev/user/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        }
      );

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (response.ok) {
        const data = await response.json();
        console.log("Login successful:", data);

        // Spara JWT-tokenet och användarnamnet
        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", data.name);

        // Navigera till profilsidan
        navigate("/profile");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to log in");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="headertext">
        <h1>Gusto</h1>
        <h2>To Go</h2>
      </div>
      <div className="login-box">
        <h2>Log In</h2>
        {error && <p className="error-message">{error}</p>} {/* Visa felmeddelande */}
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">E-mail:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;