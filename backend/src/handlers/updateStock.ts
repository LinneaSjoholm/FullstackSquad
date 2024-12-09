// src/handlers/handleStock.ts
import { db } from '../services/db';  
import { UpdateCommand } from '@aws-sdk/lib-dynamodb'; // Importera rätt uppdateringskommando

// Funktion för att uppdatera lagret för ingredienser
export const handleStock = async (ingredientsToUpdate: { id: string; quantity: number }[]) => {
  const updatePromises = ingredientsToUpdate.map(async (ingredient) => {
    try {
      // Hämta ingrediensen från DynamoDB
      const result = await db.get({
        TableName: 'IngredientsTable',
        Key: { id: ingredient.id },  // Använd ingredientId som nyckel om det är korrekt
      });

      if (!result.Item) {
        throw new Error(`Ingredient ${ingredient.id} not found`);
      }

      // Hämtar aktuellt lager och kontrollerar det
      const currentStock = result.Item.stock ? parseInt(result.Item.stock.N, 10) : 0;
      if (isNaN(currentStock)) {
        throw new Error(`Invalid stock value for ingredient ${ingredient.id}: ${result.Item.stock.N}`);
      }

      const updatedStock = currentStock - ingredient.quantity;
      if (updatedStock < 0) {
        throw new Error(`Not enough stock for ingredient ${ingredient.id}`);
      }

      // Förbered uppdateringsparametrar
      const updateParams = {
        TableName: 'IngredientsTable',
        Key: { id: ingredient.id },  // Uppdatera rätt nyckel
        UpdateExpression: 'SET stock = :newStock',
        ExpressionAttributeValues: {
          ':newStock': updatedStock.toString(),
        },
      };

      // Använd UpdateCommand för att uppdatera lagret
      const updateCommand = new UpdateCommand(updateParams);
      await db.send(updateCommand);

      console.log(`Lager för ingrediensen ${ingredient.id} uppdaterades till: ${updatedStock}`);

    } catch (error) {
      console.error(`Error updating stock for ingredient ${ingredient.id}:`, error);
    }
  });

  // Vänta på att alla uppdateringar ska genomföras innan funktionen avslutas
  await Promise.all(updatePromises);
};
