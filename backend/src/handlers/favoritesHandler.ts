import { APIGatewayProxyHandler } from 'aws-lambda';
import { saveFavorites, getFavorites, deleteFavorite } from "../services/Favorites";

// Funktion för att hämta favoriter
export const getFavoritesHandler: APIGatewayProxyHandler = async (event) => {
  const userId = event.pathParameters?.id; // Hämta användar-ID från URL-parametrar

  if (!userId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'User ID is required' }),
    };
  }

  try {
    const favorites = await getFavorites(userId);
    return {
      statusCode: 200,
      body: JSON.stringify(favorites),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error fetching favorites' }),
    };
  }
};

// Funktion för att spara favoriter
export const saveFavoritesHandler: APIGatewayProxyHandler = async (event) => {
  const userId = event.pathParameters?.id; // Hämta användar-ID från URL-parametrar
  const body = event.body ? JSON.parse(event.body) : null; // Hämta eventuella data från body (t.ex. för POST)

  if (!userId || !body?.items) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'User ID and items are required' }),
    };
  }

  try {
    await saveFavorites(userId, body.items);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Favorites saved successfully' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error saving favorites' }),
    };
  }
};

export const deleteFavoriteHandler: APIGatewayProxyHandler = async (event) => {
    // Hämta userId från path
    const userId = event.pathParameters?.id; 
    
    // Hämta id från queryStringParameters (query string)
    const id = event.queryStringParameters?.id; 
  
    // Kontrollera om userId eller id saknas
    if (!userId || !id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'User ID and favorite ID are required' }),
      };
    }
  
    try {
      // Anropa deleteFavorite-funktionen och radera favorit
      await deleteFavorite(userId, id); 
      return {
        statusCode: 200,
        body: JSON.stringify({ message: `Favorite item with ID ${id} deleted` }),
      };
    } catch (error) {
      console.error('Error in deleteFavoriteHandler:', error);
  
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error deleting favorite', error: (error as Error).message }),
      };
    }
};
