import React, { useState } from "react";
import "../../../styles/LoginUser.css"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Bygg ett request-objekt
    const loginData = { email, password };

    try {
      const response = await fetch("https://6u4ohje29a.execute-api.eu-north-1.amazonaws.com/dev/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Login successful:", data);
        alert("Login successful!");
      } else {
        const errorData = await response.json();
        console.error("Login failed:", errorData);
        alert("Login failed: " + errorData.error);
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred. Please try again.");
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
      <button type="submit" className="login-button">Log In</button>
    </form>
  </div>
</div>
  );
};

export default Login;