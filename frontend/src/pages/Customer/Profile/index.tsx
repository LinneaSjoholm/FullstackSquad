import React, { useEffect, useState } from "react";
import Menu from "../../../assets/Menu.png";
import profileIcon from "../../../assets/profileIcon.png";
import favorite from "../../../assets/favorite.png";
import "../../../styles/Profile.css"; // Se till att ha en CSS-fil för styling

const Profile = () => {
  const [userName, setUserName] = useState("Guest");
  const [favorites, setFavorites] = useState<string[]>([]); // Exempeldata för favoriter
  const [orderHistory, setOrderHistory] = useState<string[]>([]); // Exempeldata för beställningar

  useEffect(() => {
    // Hämta användarens namn från localStorage
    const name = localStorage.getItem("userName");
    if (name) setUserName(name);

    // Simulerade API-anrop för "favorites" och "order history"
    setFavorites(["Creamy Alfredo", "Spaghetti Carbonara"]);
    setOrderHistory(["Creamy Alfredo", "Margherita Pizza"]);
  }, []);

  return (
    <div>
      
      <div className="profile-section">
        <img src={profileIcon} alt="Profile Icon" className="profile-icon" />
        <h2>Welcome, {userName}!</h2>
      </div>
      <div className="profile-content">
        <div className="favorites-section">
          <h3>Favorites</h3>
          <img src={favorite} alt="Favorite Icon" className="favorite-icon" />
          <div className="favorites-list">
            {favorites.map((item, index) => (
              <div key={index} className="favorite-item">
                <p>{item}</p>
                <button className="order-again-btn">Order Again</button>
              </div>
            ))}
          </div>
        </div>
        <div className="orderhistory-section">
          <h3>Order History</h3>
          <div className="order-list">
            {orderHistory.map((item, index) => (
              <div key={index} className="order-item">
                <p>{item}</p>
                <button className="order-again-btn">Order Again</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;