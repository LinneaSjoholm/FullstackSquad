import { db } from '../services/db';
import { getIngredientStock } from './getStockStatus';

export const updateStock = async (ingredientUsageList: { ingredientId: string, quantity: number }[]): Promise<void> => {
  const updatePromises = ingredientUsageList.map(async (ingredientUsage) => {
    
    // Hämta den aktuella ingrediensen från databasen
    const ingredient = await db.get({
      TableName: 'IngredientsTable',
      Key: { id: ingredientUsage.ingredientId },
    });

    if (ingredient.Item) {
      const updatedStock = ingredient.Item.stock - ingredientUsage.quantity;
      console.log(`Current stock for ${ingredientUsage.ingredientId}: ${ingredient.Item.stock}, updated stock: ${updatedStock}`);

      if (updatedStock < 0) {
        throw new Error(`Not enough stock for ingredient: ${ingredientUsage.ingredientId}`);
      }

      // Uppdatera lagret i databasen
      const params = {
        TableName: 'IngredientsTable',
        Key: { id: ingredientUsage.ingredientId },
        UpdateExpression: 'set stock = :stock',
        ExpressionAttributeValues: {
          ':stock': updatedStock,
        },
      };

      await db.update(params);
      console.log(`Stock updated for ingredientId: ${ingredientUsage.ingredientId}, new stock: ${updatedStock}`);
    }
  });

  try {
    await Promise.all(updatePromises);
    console.log("Stock has been successfully updated.");
  } catch (error) {
    console.error("Error updating stock", error);
    throw error;
  }
};
