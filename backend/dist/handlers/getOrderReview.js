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
export const getOrderReview = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = event.pathParameters.id; // Hämta orderId från URL-parametern
    const params = {
        TableName: 'OrdersTable',
        Key: {
            orderId: orderId,
        },
    };
    try {
        const data = yield db.get(params);
        if (!data.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Order not found' }),
            };
        }
        // Returnera orderdetaljer för att visa en översikt till kunden
        return {
            statusCode: 200,
            body: JSON.stringify({
                orderId: data.Item.orderId,
                name: data.Item.name,
                customerName: data.Item.customerName,
                customerPhone: data.Item.customerPhone,
                status: data.Item.status,
                createdAt: data.Item.createdAt,
            }),
        };
    }
    catch (error) {
        if (error instanceof Error) {
            return {
                statusCode: 500,
                body: JSON.stringify({
                    message: 'Failed to fetch order review',
                    error: error.message,
                }),
            };
        }
        else {
            return {
                statusCode: 500,
                body: JSON.stringify({
                    message: 'Failed to fetch order review',
                    error: 'Unknown error occurred',
                }),
            };
        }
    }
});
