var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
const dynamoDb = new DocumentClient();
// API-nyckeln (kan hämtas från miljövariabler för att vara mer säker)
const API_KEY = process.env.API_KEY || 'your-default-api-key';
export const getOrderReview = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Kontrollera om API-nyckeln finns i begäran
    const apiKey = event.headers['x-api-key'];
    if (!apiKey || apiKey !== API_KEY) {
        return {
            statusCode: 403, // Forbidden om nyckeln inte är rätt
            body: JSON.stringify({ message: 'Forbidden: Invalid API key' }),
        };
    }
    const orderId = (_a = event.pathParameters) === null || _a === void 0 ? void 0 : _a.id; // Hämta orderId från URL (pathParameters)
    if (!orderId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Order ID is required' }),
        };
    }
    const params = {
        TableName: 'OrdersTable',
        Key: { orderId },
    };
    try {
        const result = yield dynamoDb.get(params).promise();
        if (!result.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Order not found' }),
            };
        }
        const order = result.Item;
        // Kolla om beställningen är under granskning
        if (order.reviewStatus === 'inReview') {
            order.items.forEach((item) => {
                // Lägg till ingredienser som ska läggas till
                if (item.ingredientsToAdd && item.ingredientsToAdd.length > 0) {
                    item.ingredients = [...new Set([...item.ingredients, ...item.ingredientsToAdd])];
                }
                // Ta bort ingredienser som ska tas bort
                if (item.ingredientsToRemove && item.ingredientsToRemove.length > 0) {
                    item.ingredients = item.ingredients.filter((ingredient) => !item.ingredientsToRemove.includes(ingredient));
                }
                // Applicera andra modifieringar (t.ex. laktosfri)
                if (item.lactoseFree !== undefined) {
                    item.lactoseFree = item.lactoseFree;
                }
                // Rensa upp temporära fält efter att modifieringarna tillämpats
                delete item.ingredientsToAdd;
                delete item.ingredientsToRemove;
            });
        }
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Order retrieved successfully for review',
                order,
            }),
        };
    }
    catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error fetching order', error }),
        };
    }
});
