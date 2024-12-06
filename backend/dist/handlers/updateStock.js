var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/handlers/handleStock.ts
import { db } from '../services/db';
import { UpdateCommand } from '@aws-sdk/lib-dynamodb'; // Importera rätt uppdateringskommando
// Funktion för att uppdatera lagret för ingredienser
export const handleStock = (ingredientsToUpdate) => __awaiter(void 0, void 0, void 0, function* () {
    const updatePromises = ingredientsToUpdate.map((ingredient) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Hämta ingrediensen från DynamoDB
            const result = yield db.get({
                TableName: 'IngredientsTable',
                Key: { id: ingredient.id }, // Använd ingredientId som nyckel om det är korrekt
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
                Key: { id: ingredient.id }, // Uppdatera rätt nyckel
                UpdateExpression: 'SET stock = :newStock',
                ExpressionAttributeValues: {
                    ':newStock': updatedStock.toString(),
                },
            };
            // Använd UpdateCommand för att uppdatera lagret
            const updateCommand = new UpdateCommand(updateParams);
            yield db.send(updateCommand);
            console.log(`Lager för ingrediensen ${ingredient.id} uppdaterades till: ${updatedStock}`);
        }
        catch (error) {
            console.error(`Error updating stock for ingredient ${ingredient.id}:`, error);
        }
    }));
    // Vänta på att alla uppdateringar ska genomföras innan funktionen avslutas
    yield Promise.all(updatePromises);
});
