import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { FaArrowLeft } from "react-icons/fa"; // Import back arrow icon from react-icons
import "../../../styles/CreateAccount.css"; // Ny CSS-fil för denna vy

const CreateAccount = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate(); // Create navigate function

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const accountData = { email, name, password, address, phone };

    try {
      const response = await fetch(
        "https://3uhcgg5udg.execute-api.eu-north-1.amazonaws.com/user/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(accountData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Account created successfully:", data);
        setSuccess(true);

        setTimeout(() => {
          navigate("/"); // Redirect to homepage after account creation
        }, 2000); // Wait for 2 seconds before redirecting
      } else {
        const errorData = await response.json();
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
        {/* Back to homepage button */}
      <div className="back-button" onClick={() => navigate("/")}>
        <FaArrowLeft size={24} /> {/* You can adjust the size of the arrow */}
        <span>Back to Home</span>
      </div>
      </div>
    </div>
  );
};

export default CreateAccount;
