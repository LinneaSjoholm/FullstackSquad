var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { postOrder } from './postOrder';
import { updateStock } from './updateStock';
import { db } from '../services/db';
import { getIngredientStock } from './getStockStatus';
export const getIngredientsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        TableName: 'IngredientsTable',
    };
    try {
        const data = yield db.scan(params); // Skanna hela tabellen för att få alla ingredienser
        return data.Items;
    }
    catch (error) {
        console.error("Error fetching ingredients from DB", error);
        throw error;
    }
});
// Funktion för att sammanställa ingredienser från en order
const extractIngredientsForOrder = (items, ingredients) => {
    const ingredientUsageList = [];
    items.forEach(item => {
        item.ingredients.forEach(ingredient => {
            // Hämta ingrediensen från ingredient-listan som finns i databasen (ingredients)
            const ingredientData = ingredients.find(i => i.id === ingredient.ingredientId);
            if (ingredientData) {
                const usagePerPortion = ingredientData.usagePerDish[item.name] || 0;
                const totalQuantity = usagePerPortion * item.quantity; // Beräkna total mängd för denna ingrediens
                ingredientUsageList.push({
                    ingredientId: ingredient.ingredientId,
                    quantity: totalQuantity, // Total mängd i gram
                });
            }
        });
    });
    return ingredientUsageList;
};
export const handleOrderWithStock = (event) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Lambda function started"); // Lägg till detta för att se om det loggas överhuvudtaget
    try {
        // Posta ordern
        const postResponse = yield postOrder(event);
        const orderDetails = JSON.parse(event.body);
        const { items } = orderDetails;
        // Hämta ingredienser från databasen
        const ingredients = yield getIngredientsFromDB(); // Hämta alla ingredienser från DynamoDB eller en annan källa
        // Sammanställ ingredienser och kvantiteter som ska uppdateras
        const ingredientUsageList = extractIngredientsForOrder(items, ingredients);
        // Uppdatera lagret med de beräknade mängderna
        yield updateStock(ingredientUsageList);
        // Logga lagerstatusen efter uppdatering för varje ingrediens
        for (const ingredientUsage of ingredientUsageList) {
            const updatedStock = yield getIngredientStock(ingredientUsage.ingredientId);
            console.log(`Updated stock for ${ingredientUsage.ingredientId}: ${updatedStock}`);
        }
        return postResponse; // Returnera svaret från `postOrder`
    }
    catch (error) {
        console.error("Error in handleOrderWithStock", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error processing order with stock update', error }),
        };
    }
});
