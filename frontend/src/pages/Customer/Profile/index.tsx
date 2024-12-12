import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import profileIcon from "../../../assets/profileIcon.png";
import favorite from "../../../assets/favorite.png";
import pastaImages from "../../../interfaces/pastaImages"; // Importera pastaImages
import "../../../styles/Profile.css";

const Profile = () => {
  const [userName, setUserName] = useState("Guest");
  const [favorites, setFavorites] = useState<string[]>([]); // Favorites data (nu som namn eller ID)
  const [orderHistory, setOrderHistory] = useState<string[]>([]); // Order history data
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("userToken");  // Fetch the token from localStorage
      if (!token) {
        navigate("/user/login");
        return;
      }

      const userId = localStorage.getItem("userId"); // Hämta användarens ID från localStorage
      if (!userId) {
        console.error("User ID is not available");
        return;
      }

      try {
        const response = await fetch(`https://3uhcgg5udg.execute-api.eu-north-1.amazonaws.com/user/profile/${userId}`, {
          method: 'GET',
          headers: {
            "Authorization": `Bearer ${token}`,  // Include token in Authorization header
            "Content-Type": "application/json"
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const data = await response.json();

        // Uppdatera tillstånden med data från API:t
        setUserName(data.userName);
        setFavorites(data.favorites);
        setOrderHistory(data.orderHistory);
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
    localStorage.removeItem("userId"); // Ta bort userId vid utloggning

    navigate("/user/login");
  };

  // Handle removing an item from favorites
  const removeFavorite = (item: string) => {
    const updatedFavorites = favorites.filter(fav => fav !== item); // Remove the item
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites)); // Update localStorage
  };

  // Översätt ID till namn (om favorites är lagrade som ID:n)
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
    return pastaMapping[id] || ''; // Returnerar namnet om det finns, annars en tom sträng
  };

  // Hantera att användaren klickar på "Order Again"
  const handleOrderAgain = (item: string) => {
    const pastaName = getPastaNameById(item); 
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
                const pastaName = getPastaNameById(item); 
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
              orderHistory.map((item, index) => (
                <div key={index} className="order-item">
                  <p>{item}</p>
                  <button className="order-again-btn" onClick={() => handleOrderAgain(item)}>
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
