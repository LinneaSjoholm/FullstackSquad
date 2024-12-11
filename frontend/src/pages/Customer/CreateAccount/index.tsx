import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/CreateAccount.css"; // Ny CSS-fil för denna vy

const CreateAccount = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const accountData = { email, name, password, address, phone };

    try {
      const response = await fetch(
        "https://cbcxsumuq8.execute-api.eu-north-1.amazonaws.com/dev/user/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(accountData),
        }
      );
    
      console.log("Response status:", response.status);
    
      if (response.ok) {
        const data = await response.json();
        console.log("Account created successfully:", data);
        setSuccess(true);
        navigate("/");
      } else {
        const errorData = await response.json();
        console.error("Error response from server:", errorData);
        setError(errorData.error || "Failed to create account.");
      }
    } catch (error) {
      console.error("Error during account creation:", error);
      setError("An error occurred. Please try again.");
    }
    
  };

  return (
    <div className="create-account-container">
      <div className="headertext">
        <h1>Gusto</h1>
        <h2>To Go</h2>
      </div>
      <div className="create-account-box">
        <h2>Create Account</h2>
        {error && <p className="error-message">{error}</p>}
        {success && (
          <p className="success-message">Account created successfully!</p>
        )}
        <form onSubmit={handleCreateAccount} className="create-account-form">
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
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
          <div className="form-group">
            <label htmlFor="address">Address:</label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone Number:</label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="create-account-button">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAccount;