import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import pastaImages from "../../../interfaces/pastaImages"; // Import pastaImages

interface Favorite {
  id: string;
}

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]); // State för att lagra favoriter
  const [loading, setLoading] = useState<boolean>(true); // State för laddningsstatus
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

  // Fetcha favoriter från backend
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
              "Authorization": `Bearer ${token}`,
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
        setFavorites(data.favorites || []); // Uppdatera favoriter i state
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setLoading(false); // Stäng av laddningsstatus
      }
    };

    fetchFavorites();
  }, [navigate]);

  // Handle ordering a favorite dish again
  const handleOrderAgain = (item: Favorite) => {
    const pastaName = getPastaNameById(item.id);
    navigate("/menu", { state: { pastaName } });
  };

  return (
<<<<<<< HEAD
    <div className="favorites-page">
      <h2>Your Favorite Dishes</h2>
      {loading ? (
        <p>Loading your favorites...</p>
      ) : (
        <div className="favorites-list">
          {favorites.length > 0 ? (
            favorites.map((item: Favorite, index: number) => {
              const pastaName = getPastaNameById(item.id);
              const image = pastaImages[pastaName];

              return (
                <div key={index} className="favorite-item">
                  {image ? (
                    <img src={image} alt={pastaName} className="favorite-item-image" />
                  ) : (
                    <p>No image available</p>
                  )}
                  <p>{pastaName}</p>
=======
    <div className="profile-container">
      <div className="profile-buttons">
        <button className="logout-button" onClick={handleLogout}>Log Out</button>
      </div>
      <div className="profile-section">
        <img src={profileIcon} alt="Profile Icon" className="profile-icon" />
        <h2>Welcome, {userName}!</h2>
      </div>
      <div className="profile-content">
        <div className="profile-header-section">
          <div className="profile-favorite-section">
          <h3>Favorites</h3>
          <img src={favorite} alt="Favorite Icon" className="favorite-icon" />
          </div>
          <h3>Order History</h3>
        </div>
        <div className="profile-both-list">
        <div>
          <div className="profile-favorites-list">
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
          <div className="order-list">
            {orderHistory.length > 0 ? (
              orderHistory.map((item, index) => (
                <div key={index} className="order-item">
                  <p>{item}</p>
>>>>>>> Lam
                  <button className="order-again-btn" onClick={() => handleOrderAgain(item)}>
                    Order Again
                  </button>
                </div>
              );
            })
          ) : (
            <p>You have no favorites yet.</p>
          )}
        </div>
<<<<<<< HEAD
      )}
      <button className="back-btn" onClick={() => navigate("/user/profile")}>
        Back to Profile
      </button>
=======
        </div>
        
      </div>
      <div className="profile-bottom-text">
      <p>Need help? Contact us at support@gustotogo.com or call +123 456 789</p>
      </div>
>>>>>>> Lam
    </div>
  );
};

export default FavoritesPage;
