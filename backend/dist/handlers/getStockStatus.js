var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/handlers/getStockStatus.ts
import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
const client = new DynamoDB({
    region: process.env.AWS_REGION, // Se till att AWS-regionen är korrekt
});
const db = DynamoDBDocument.from(client);
export const getIngredientStock = (ingredientId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Hämta ingrediensen från DynamoDB baserat på id (primärnyckeln)
        const result = yield db.get({
            TableName: 'IngredientsTable', // Namnet på din tabell
            Key: { id: ingredientId }, // Använd 'id' som nyckel, inte 'name'
        });
        if (result.Item) {
            // Om ingrediensen finns, hämta lagerstatusen (som vi antar är ett nummer)
            const stock = result.Item.stock.N; // 'stock' bör vara lagrat som ett nummer
            console.log(`Lagerstatus för ${ingredientId}: ${stock}`);
            return stock; // Returnera lagerstatusen
        }
        else {
            console.log(`Ingrediensen med id ${ingredientId} finns inte i lagret.`);
            return null; // Om ingen ingrediens hittas
        }
    }
    catch (error) {
        // Hantera eventuella fel vid databasfrågan
        console.error('Error fetching ingredient stock:', error);
        return null;
    }
});
// Funktion för att hämta lagerstatus för alla ingredienser
export const getStockStatus = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        TableName: 'IngredientsTable',
    };
    try {
        // Hämta alla ingredienser från tabellen
        const result = yield db.scan(params);
        if (!result.Items || result.Items.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'No ingredients found' }),
            };
        }
        // Här filtrerar vi ut de ingredienser som används i någon rätt
        const filteredItems = result.Items.filter(item => {
            return item.dishNames && item.dishNames.length > 0;
        });
        // Returnera den filtrerade listan
        return {
            statusCode: 200,
            body: JSON.stringify(filteredItems),
        };
    }
    catch (error) {
        console.error('Error fetching stock status:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error fetching stock status' }),
        };
    }
});
