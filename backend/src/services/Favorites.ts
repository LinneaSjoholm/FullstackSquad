import { db } from "./db"; // Din DynamoDB-klient
import { Favorite } from "../interfaces/favorites";

// Funktion för att spara favoriter
export const saveFavorites = async (userId: string, items: any[]): Promise<void> => {
  try {
    console.log("Saving favorite items for user:", userId);

    // Filtrera bort ogiltiga objekt
    const validItems = items.filter(item => item && item.id);
    if (validItems.length === 0) {
      console.log("No valid items to save as favorites");
      return;
    }

    // Spara varje objekt som en "Favorite"
    for (const item of validItems) {
      const favorite: Favorite = {
        userId: userId, // Lägg till userId här
        id: item.id.toString(),
        name: item.name || "", 
        addedAt: new Date().toISOString(), 
      };

      const params = {
        TableName: "FavoritesTable",
        Item: favorite,
      };

      console.log("Saving favorite item to database:", params);

      // Kör PutItem för varje favorit
      await db.put(params);
    }

    console.log("All favorites saved successfully");
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

// Funktion för att uppdatera status på en favorit
export const updateFavoriteStatus = async (userId: string, itemId: string, status: string) => {
  try {
    const params = {
      TableName: "FavoritesTable",
      Key: {
        userId: userId
      },
      UpdateExpression: "SET status = :status",
      ExpressionAttributeValues: {
        ":status": status,
      },
      ReturnValues: "ALL_NEW" as const, // Hämta den uppdaterade posten
    };

    const result = await db.update(params);
    return result.Attributes; // Returnera de uppdaterade värdena
  } catch (error) {
    console.error("Error updating favorite status:", (error as Error).message);
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
