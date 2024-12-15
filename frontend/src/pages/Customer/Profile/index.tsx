import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import profileIcon from "../../../assets/profileIcon.png";
import favorite from "../../../assets/favorite.png";
import pastaImages from "../../../interfaces/pastaImages"; // Import pastaImages
import "../../../styles/Profile.css";

const Profile = () => {
  const [userName, setUserName] = useState("Guest");
  const [favorites, setFavorites] = useState<any[]>([]); // Handle favorites as an array of objects
  const [orderHistory, setOrderHistory] = useState<any[]>([]); // Handle order history as an array of objects
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("userToken");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        console.error("Token or User ID is missing.");
        navigate("/user/login");
        return;
      }

      try {
        const response = await fetch(
          `https://8yanxxf6q0.execute-api.eu-north-1.amazonaws.com/user/profile/${userId}`,
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          console.error("Failed to fetch user profile:", response.status);
          const errorData = await response.json();
          console.error("Error message:", errorData);
          throw new Error("Failed to fetch user profile");
        }

        const data = await response.json();
        
        // Update user data: name, favorites, and order history
        setUserName(data.user?.name || "Guest");
        setFavorites(data.favorites || []); // Use the actual favorites data
        setOrderHistory(data.orders || []); // Use the actual order history data
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [navigate]);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("favorites");
    localStorage.removeItem("orderHistory");
    localStorage.removeItem("userId"); // Remove userId during logout

    navigate("/user/login");
  };

  // Handle removing an item from favorites
  const removeFavorite = (item: any) => {
    const updatedFavorites = favorites.filter(fav => fav.id !== item.id); // Remove the item by ID
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites)); // Update localStorage
  };

  // Map pasta ID to name (or handle pasta object if it's more complex)
  const getPastaNameById = (id: string): string => {
    const pastaMapping: { [key: string]: string } = {
      '2': 'Arrabbiata Penne',
      '10': 'Carbonara Classic',
      '1': 'Creamy Alfredo',
      '8': 'Four Cheese Tortellini',
      '3': 'Garden Pesto Delight',
      '7': 'Lasagna al Forno',
      '5': 'Lemon Herb Chicken Pasta',
      '6': 'Ravioli Florentine',
      '9': 'Seafood Marinara',
      '4': 'Spaghetti Bolognese',
    };
    return pastaMapping[id] || ''; // Return the pasta name if exists
  };

  // Handle re-ordering a past order
  const handleOrderAgain = (item: any) => {
    const pastaName = getPastaNameById(item.id); // Use item ID to get pasta name
    navigate("/menu", { state: { pastaName } });
  };

  return (
    <div>
      <div className="profile-section">
        <img src={profileIcon} alt="Profile Icon" className="profile-icon" />
        <h2>Welcome, {userName}!</h2>
        <button onClick={handleLogout}>Log Out</button>
      </div>
      <div className="profile-content">
        <div className="favorites-section">
          <h3>Your Favorites</h3>
          <img src={favorite} alt="Favorite Icon" className="favorite-icon" />
          <div className="favorites-list">
            {favorites.length > 0 ? (
              favorites.map((item, index) => {
                const pastaName = getPastaNameById(item.id); // Use the ID to get pasta name
                const image = pastaImages[pastaName];
                
                return (
                  <div key={index} className="favorite-item">
                    {image ? (
                      <img src={image} alt={pastaName} className="favorite-item-image" />
                    ) : (
                      <p>No image available</p>
                    )}
                    <p>{pastaName}</p>
                    <button className="order-again-btn" onClick={() => handleOrderAgain(item)}>
                      Order Again
                    </button>
                    <button className="remove-favorite-btn" onClick={() => removeFavorite(item)}>
                      Remove from Favorites
                    </button>
                  </div>
                );
              })
            ) : (
              <p>You have no favorites yet.</p>
            )}
          </div>
        </div>
        <div className="orderhistory-section">
          <h3>Order History</h3>
          <div className="order-list">
            {orderHistory.length > 0 ? (
              orderHistory.map((order, index) => (
                <div key={index} className="order-item">
                  <p>Order ID: {order.orderId}</p>
                  <p>Total Price: ${order.totalPrice}</p>
                  <button className="order-again-btn" onClick={() => handleOrderAgain(order)}>
                    Order Again
                  </button>
                </div>
              ))
            ) : (
              <p>You have no order history yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
