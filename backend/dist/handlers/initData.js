var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
const client = new DynamoDB({
    region: process.env.AWS_REGION,
});
// Skapa och exportera en instans av DynamoDBDocument
const db = DynamoDBDocument.from(client);
export const initData = () => __awaiter(void 0, void 0, void 0, function* () {
    // Ingredienser med lagerstatus (kg) och koppling till rätter
    const ingredients = [
        { id: 'ingredient1', name: 'Parmesan Cheese', stock: 10, unit: 'kg', dishNames: ['Creamy Alfredo', 'Arrabbiata Penne', 'Lemon Herb Chicken Pasta'] },
        { id: 'ingredient2', name: 'Cream', stock: 8, unit: 'kg', dishNames: ['Creamy Alfredo', 'Lemon Herb Chicken Pasta'] },
        { id: 'ingredient3', name: 'Garlic', stock: 5, unit: 'kg', dishNames: ['Creamy Alfredo', 'Lemon Herb Chicken Pasta', 'Ravioli Florentine'] },
        { id: 'ingredient4', name: 'Pasta', stock: 20, unit: 'kg', dishNames: ['Creamy Alfredo', 'Arrabbiata Penne', 'Garden Pesto Delight', 'Lemon Herb Chicken Pasta'] },
        { id: 'ingredient5', name: 'Tomato Sauce', stock: 7, unit: 'kg', dishNames: ['Arrabbiata Penne', 'Lasagna al Forno', 'Seafood Marinara'] },
        { id: 'ingredient6', name: 'Spinach', stock: 6, unit: 'kg', dishNames: ['Lemon Herb Chicken Pasta', 'Ravioli Florentine'] },
        { id: 'ingredient7', name: 'Basil', stock: 4, unit: 'kg', dishNames: ['Arrabbiata Penne', 'Garden Pesto Delight', 'Ravioli Florentine'] },
        { id: 'ingredient8', name: 'Beef Ragù', stock: 9, unit: 'kg', dishNames: ['Spaghetti Bolognese', 'Lasagna al Forno'] },
        { id: 'ingredient9', name: 'Shrimp', stock: 3, unit: 'kg', dishNames: ['Seafood Marinara'] },
        { id: 'ingredient10', name: 'Calamari', stock: 2.5, unit: 'kg', dishNames: ['Seafood Marinara'] },
        { id: 'ingredient11', name: 'Mussels', stock: 2, unit: 'kg', dishNames: ['Seafood Marinara'] },
    ];
    // Lägg till ingredienser i DynamoDB
    const ingredientPromises = ingredients.map(ingredient => {
        const params = {
            TableName: 'IngredientsTable',
            Item: ingredient,
        };
        return db.put(params);
    });
    try {
        yield Promise.all(ingredientPromises);
        console.log("Ingredients have been added to DynamoDB.");
    }
    catch (error) {
        console.error("Error inserting ingredients into DynamoDB", error);
    }
});
