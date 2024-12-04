var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { db } from './db';
import { getMenu } from '../handlers/getMenu';
// Funktion för att hämta lagerstatus för en ingrediens
const getStockForIngredient = (ingredientId) => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        TableName: 'IngredientsTable',
        Key: {
            id: ingredientId,
        },
    };
    const result = yield db.get(params);
    // Returnera lagerstatus (eller 0 om inte finns)
    return result.Item && result.Item.stock ? result.Item.stock : 0;
});
// Funktion för att hämta lagerstatus för rätter
export const getMenuWithStockStatus = (event) => __awaiter(void 0, void 0, void 0, function* () {
    // Hämta menyn från din existerande getMenu-funktion
    const menuResponse = yield getMenu(event);
    // Om menyn inte hämtades korrekt, returnera fel
    if (menuResponse.statusCode !== 200) {
        return menuResponse;
    }
    // Hämta rätterna och ingredienserna
    const dishesWithIngredients = JSON.parse(menuResponse.body);
    // Lägg till lagerstatus för ingredienser
    const dishesWithStock = yield Promise.all(dishesWithIngredients.map((dish) => __awaiter(void 0, void 0, void 0, function* () {
        const ingredientsWithStock = yield Promise.all(dish.ingredients.map((ingredientId) => __awaiter(void 0, void 0, void 0, function* () {
            const stock = yield getStockForIngredient(ingredientId);
            return { id: ingredientId, stock };
        })));
        // Beräkna den totala lagerstatusen för rätten
        const totalStock = ingredientsWithStock.reduce((minStock, ingredient) => {
            return Math.min(minStock, ingredient.stock); // Hitta den begränsande ingrediensen
        }, Infinity);
        return Object.assign(Object.assign({}, dish), { ingredients: ingredientsWithStock, totalStock // Lägg till lagerstatus för rätten
         });
    })));
    return {
        statusCode: 200,
        body: JSON.stringify(dishesWithStock),
    };
});
