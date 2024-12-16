import { db } from "../services/db"; // Din DynamoDB-klient
import { Favorite } from "../interfaces/favorites";  // Typen för favoriter

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

    // Skapa BatchWriteItem-request
    const favoriteItems = validItems.map(item => ({
      PutRequest: {
        Item: {
          userId: userId,
          itemId: item.id.toString(), // Säkerställ att item.id finns
        },
      },
    }));

    const batchParams = {
      RequestItems: {
        FavoritesTable: favoriteItems,
      },
    };

    console.log("Saving to database with batch write:", batchParams);

    // Kör batchWrite
    const result = await db.batchWrite(batchParams);
    console.log("Favorites saved successfully:", result);
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
