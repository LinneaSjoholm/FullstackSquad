import { APIGatewayProxyHandler } from 'aws-lambda';  // Om du använder AWS Lambda
import { saveFavorites, getFavorites } from "../services/favoriteService";  // Importera service-funktioner
import { Favorite } from "../interfaces/favorites";   // Importera Favorite-typen

// API-handler för att spara favoriter
export const saveFavoritesHandler: APIGatewayProxyHandler = async (event) => {
  const userId = event.pathParameters?.userId;
  const items = JSON.parse(event.body || "[]");

  if (!userId || items.length === 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "UserId and items are required" }),
    };
  }

  try {
    await saveFavorites(userId, items);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Favorites saved successfully",
      }),
    };
  } catch (error) {
    console.error("Error saving favorites:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error saving favorites", error: (error as Error).message }),
    };
  }
};

// API-handler för att hämta favoriter
export const getFavoritesHandler: APIGatewayProxyHandler = async (event) => {
  const userId = event.pathParameters?.userId;  // Läsa userId från pathParameters

  if (!userId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "UserId is required" }),
    };
  }

  try {
    const favorites: Favorite[] = await getFavorites(userId);  // Anropa tjänsten för att hämta favoriter

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Favorites fetched successfully",
        favorites,
      }),
    };
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error fetching favorites", error: (error as Error).message }),
    };
  }
};
