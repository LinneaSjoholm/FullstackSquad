import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import pastaImages from "../../../interfaces/pastaImages"; // Import pastaImages
import "../../../styles/Profile.css";

interface Favorite {
  id: string;
}

const ProfilePage = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [orderHistory, setOrderHistory] = useState<string[]>([]); // Order history
  const [loading, setLoading] = useState<boolean>(true);
  const userName = localStorage.getItem("userName");
  const navigate = useNavigate();

  // Map pasta ID to name
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
    return pastaMapping[id] || '';
  };

  // Fetch favorites from backend
  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem("userToken");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        console.error("Token or User ID is missing.");
        navigate("/user/login");
        return;
      }

      try {
        const response = await fetch(
          `https://8yanxxf6q0.execute-api.eu-north-1.amazonaws.com/user/favorites/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Failed to fetch favorites:", errorData);
          throw new Error("Failed to fetch favorites");
        }

        const data = await response.json();
        setFavorites(data.favorites || []);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [navigate]);

  // Logout handler
  const handleLogout = () => {
    localStorage.clear();
    navigate("/user/login");
  };

  // Handle ordering a favorite dish again
  const handleOrderAgain = (item: Favorite) => {
    const pastaName = getPastaNameById(item.id);
    navigate("/menu", { state: { pastaName } });
  };

  // Remove favorite handler
  const removeFavorite = (item: Favorite) => {
    setFavorites((prevFavorites) =>
      prevFavorites.filter((favorite) => favorite.id !== item.id)
    );
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-buttons">
          <button className="logout-button" onClick={handleLogout}>
            Log Out
          </button>
        </div>
        <div className="profile-section">
          <h2>Welcome, {userName}!</h2>
        </div>
      </div>

      <h3>Order History</h3>
      <div className="order-list">
        {orderHistory.length > 0 ? (
          orderHistory.map((item, index) => (
            <div key={index} className="order-item">
              <p>{item}</p>
              <button className="order-again-btn" onClick={() => handleOrderAgain({ id: item })}>
                Order Again
              </button>
            </div>
          ))
        ) : (
          <p>You have no orders yet.</p>
        )}
      </div>

      <button className="favorites-btn" onClick={() => navigate("/user/favorites")}>
        View Favorites Page
      </button>

      <div className="profile-bottom-text">
        <p>Need help? Contact us at support@gustotogo.com or call +123 456 789</p>
      </div>
    </div>
  );
};

export default ProfilePage;
