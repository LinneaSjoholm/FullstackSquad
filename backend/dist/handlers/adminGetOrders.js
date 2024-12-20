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
export const adminGetOrders = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
    };
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({ message: 'CORS preflight passed.' }),
        };
    }
    const params = {
        TableName: 'OrdersTable',
    };
    try {
        const data = yield db.scan(params);
        if (!data.Items || data.Items.length === 0) {
            return {
                statusCode: 404,
                headers: corsHeaders,
                body: JSON.stringify({ message: 'No orders found' }),
            };
        }
        // Lägg till 'locked' fältet i varje order om det inte finns
        const ordersWithLock = data.Items.map((order) => {
            return Object.assign(Object.assign({}, order), { locked: order.locked !== undefined ? order.locked : false });
        });
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(ordersWithLock),
        };
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                message: 'Failed to fetch orders',
                error: errorMessage,
            }),
        };
    }
});
