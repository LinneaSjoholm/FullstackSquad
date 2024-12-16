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
      )}
      <button className="back-btn" onClick={() => navigate("/user/profile")}>
        Back to Profile
      </button>
    </div>
  );
};

export default FavoritesPage;
