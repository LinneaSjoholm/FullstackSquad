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
import { updateStock } from './updateStock';
export const createOrder = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, customerName, customerPhone, dishNames } = JSON.parse(event.body);
    if (!dishNames || dishNames.length === 0) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Dish out of stock',
            }),
        };
    }
    // Skapa ett unikt orderId med endast siffror (timestamp)
    const orderId = Date.now().toString();
    const orderedDishes = [];
    const ingredientsToUpdate = [];
    try {
        // Hämta ingredienser för varje rätt och summera dem
        for (const dishName of dishNames) {
            const menuParams = {
                TableName: 'MenuTable',
                Key: { name: dishName },
            };
            const dish = yield db.get(menuParams);
            if (!dish.Item) {
                throw new Error(`Dish not found: ${dishName}`);
            }
            orderedDishes.push(dish.Item);
            for (const ingredient of dish.Item.ingredients) {
                const existingIngredient = ingredientsToUpdate.find(i => i.id === ingredient.id);
                if (existingIngredient) {
                    existingIngredient.quantity += ingredient.quantity;
                }
                else {
                    ingredientsToUpdate.push({ id: ingredient.id, quantity: ingredient.quantity });
                }
            }
        }
        // Uppdatera lagerstatus
        if (ingredientsToUpdate.length > 0) {
            yield updateStock(ingredientsToUpdate);
        }
        // Skapa order
        const params = {
            TableName: 'OrdersTable',
            Item: {
                orderId: orderId,
                name: name,
                customerName: customerName,
                customerPhone: customerPhone,
                status: 'pending', // Orderstatus vid skapande
                createdAt: new Date().toISOString(),
                dishes: orderedDishes, // Lägg till rätter i ordern
            },
        };
        // Spara order i databasen
        yield db.put(params);
        return {
            statusCode: 201,
            body: JSON.stringify({
                message: 'Order created successfully',
                orderId: orderId,
            }),
        };
    }
    catch (error) {
        if (error instanceof Error) {
            return {
                statusCode: 500,
                body: JSON.stringify({
                    message: 'Failed to create order',
                    error: error.message,
                }),
            };
        }
        else {
            return {
                statusCode: 500,
                body: JSON.stringify({
                    message: 'Failed to create order',
                    error: 'Unknown error occurred',
                }),
            };
        }
    }
});
