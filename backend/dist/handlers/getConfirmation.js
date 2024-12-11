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
export const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const apiKey = (_a = event.headers) === null || _a === void 0 ? void 0 : _a['x-api-key'];
    if (apiKey !== process.env.API_KEY) {
        return {
            statusCode: 403,
            body: JSON.stringify({ message: 'Forbidden: Invalid API key' }),
        };
    }
    const orderId = (_b = event.pathParameters) === null || _b === void 0 ? void 0 : _b.id;
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
        const result = yield db.get(params);
        if (!result.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Order not found' }),
            };
        }
        const updatedOrder = Object.assign(Object.assign({}, result.Item), { status: 'confirmed', reviewStatus: 'confirmed' }); // Mark as confirmed
        const updateParams = {
            TableName: 'OrdersTable',
            Item: updatedOrder,
        };
        yield db.put(updateParams); // Confirm the order in the database
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Order confirmed successfully',
                updatedOrder,
            }),
        };
    }
    catch (error) {
        console.error('Error confirming order:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error confirming order', error }),
        };
    }
});
