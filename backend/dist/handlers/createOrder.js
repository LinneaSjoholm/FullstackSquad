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
export const createOrder = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, customerName, customerPhone } = JSON.parse(event.body);
    // Skapa ett unikt orderId med endast siffror (timestamp)
    const orderId = Date.now().toString();
    const params = {
        TableName: 'OrdersTable',
        Item: {
            orderId: orderId,
            name: name,
            customerName: customerName,
            customerPhone: customerPhone,
            status: 'pending', // Orderstatus vid skapande
            createdAt: new Date().toISOString(),
        },
    };
    try {
        // Använd db.put för att sätta in en ny order i DynamoDB
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
