import { db } from "./db"; // Din DynamoDB-klient
import { Favorite } from "../interfaces/favorites";

export const saveFavorites = async (userId: string, items: any[]): Promise<void> => {
  try {
    console.log("Saving favorite items for user:", userId);

    // Filtrera bort ogiltiga objekt
    const validItems = items.filter(item => item && item.id);
    if (validItems.length === 0) {
      console.log("No valid items to save as favorites");
      return;
    }

    // Skapa den nya favoriter-listan
    const favoriteItems = validItems.map(item => ({
      id: item.id.toString(),
      name: item.name || "",
      addedAt: new Date().toISOString(),
    }));

    // Förbered parameter för att uppdatera användarens favoriter
    const params = {
      TableName: "FavoritesTable",
      Key: { userId },
      UpdateExpression: "SET favorites = :new_favorites",
      ExpressionAttributeValues: {
        ":new_favorites": favoriteItems, // Sätt hela listan av favoriter
      },
      ReturnValues: "UPDATED_NEW" as const,
    };

    console.log("Attempting to update favorite items:", params);

    // Uppdatera databasen
    await db.update(params);
    console.log(`Favorite items saved for user ${userId}`);
  } catch (error) {
    console.error("Error saving favorites:", (error as Error).message);
  }
};

// Funktion för att hämta favoriter
export const getFavorites = async (userId: string): Promise<Favorite[]> => {
  try {
    const params = {
      TableName: "FavoritesTable",
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
    };

    // Anropa DynamoDB-query
    const result = await db.query(params);

    // Returnera listan med favoriter eller en tom lista om inga favoriter hittades
    return result.Items as Favorite[] || [];
  } catch (error) {
    console.error("Error fetching favorites:", (error as Error).message);
    return [];
  }
};

// Funktion för att ta bort en favorit
export const deleteFavorite = async (userId: string, itemId: string): Promise<void> => {
  try {
    // Förbered parametrarna för borttagningen
    const params = {
      TableName: "FavoritesTable", // Tabellnamn
      Key: {
        userId: userId,  // Primärnyckel
      },
    };

    // Kör deleteItem för att ta bort posten
    await db.delete(params);
    console.log(`Favorite item ${itemId} removed for user ${userId}`);
  } catch (error) {
    console.error("Error deleting favorite:", (error as Error).message);
  }
};
