import React from "react";
import Menu from "../../../assets/Menu.png"
import profileIcon from "../../../assets/profileIcon.png";
import favorite from "../../../assets/favorite.png";
import "../../../styles/Profile.css"; // Se till att ha en CSS-fil för styling

const Profile = () => {
    return (
      <div>
        <header className="profile-header">
            <img src={Menu} alt="Menu Icon" className="menu-icon" />
          <h1>Gusto</h1>
            <h2>To Go</h2>
        </header>
        <div className="profile-section">
          <img src={profileIcon} alt="Profile Icon" className="profile-icon" />
          <h2>My Profile</h2>
        </div>
        <div className="profile-content">
        <div className="favorites-section">
          <h3>Favorites</h3>
          <img src={favorite} alt="Favorite Icon" className="favorite-icon" />
          <div className="favorites-list">
            {/* Här kommer enskilda favoriträtter */}
            <div className="favorite-item">
              <p>Creamy Alfredo</p>
              <button className="order-again-btn">Order Again</button>
            </div>
          </div>
        </div>
        <div className="orderhistory-section">
          <h3>Order History</h3>
          <div className="order-list">
            {/* Här kommer tidigare beställningar */}
            <div className="order-item">
              <p>Creamy Alfredo</p>
              <button className="order-again-btn">Order Again</button>
            </div>
          </div>
        </div>
      </div>
      </div>
    );
  };
  
export default Profile;