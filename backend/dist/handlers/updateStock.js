var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { db } from '../services/db';
import { getIngredientStock } from './getStockStatus';
export const updateStock = (ingredientUsageList) => __awaiter(void 0, void 0, void 0, function* () {
    const updatePromises = ingredientUsageList.map((ingredientUsage) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`Updating stock for ingredientId: ${ingredientUsage.ingredientId}, quantity: ${ingredientUsage.quantity}`);
        // Hämta den aktuella ingrediensen från databasen
        const ingredient = yield db.get({
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
            yield db.update(params);
            console.log(`Stock updated for ingredientId: ${ingredientUsage.ingredientId}, new stock: ${updatedStock}`);
            // Anropa getIngredientStock för att logga den uppdaterade lagerstatusen
            const updatedStockStatus = yield getIngredientStock(ingredientUsage.ingredientId);
            console.log(`Updated stock for ingredient ${ingredientUsage.ingredientId}: ${updatedStockStatus}`);
        }
    }));
    try {
        yield Promise.all(updatePromises);
        console.log("Stock has been successfully updated.");
    }
    catch (error) {
        console.error("Error updating stock", error);
        throw error;
    }
});
