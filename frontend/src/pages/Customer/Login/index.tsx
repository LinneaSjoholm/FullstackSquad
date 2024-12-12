import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importera useNavigate
import { FaArrowLeft } from "react-icons/fa"; // Import back arrow icon from react-icons
import "../../../styles/LoginUser.css";
import AdminIcon from "../../../assets/loginicon.png";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>(""); // För att visa felmeddelanden
  const navigate = useNavigate(); // Skapa navigate-funktionen

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Rensa tidigare fel

    const loginData = { email, password };

    console.log("Sending login request with data:", loginData);

    try {
      const response = await fetch(
        "https://3uhcgg5udg.execute-api.eu-north-1.amazonaws.com/user/login",
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
        console.log("Login successful:", data);

        // Spara token, användarnamn och userId i localStorage
        localStorage.setItem("userToken", data.token);  // Save token with the key 'userToken'
        localStorage.setItem("userName", data.name);
        localStorage.setItem("userId", data.userId); // Här sparas userId också

        // Navigera till profil-sidan efter inloggning
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
      {/* Back to homepage button */}
      <div className="back-button" onClick={() => navigate("/")}>
        <FaArrowLeft size={20} /> {/* You can adjust the size of the arrow */}
        <span>Back to Home</span>
      </div>
      <div className="headertext">
        <h1>Gusto</h1>
        <h2>To Go</h2>
      </div>
      
      <div className="admin-icon-container">
        <img
          src={AdminIcon}
          alt="Admin Login"
          className="admin-icon"
          onClick={() => navigate("/admin/login")} // Navigate to admin login
        />
      </div>
      
      <div className="login-box">
        <h2>Log In</h2>
        {error && <p className="error-message">{error}</p>} {/* Display error */}
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

