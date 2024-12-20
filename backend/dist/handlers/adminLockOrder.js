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
import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
export const adminLockOrder = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = event.pathParameters.id;
    try {
        // Hämta den aktuella beställningen
        const getOrderParams = { TableName: 'OrdersTable', Key: { orderId } };
        const orderData = yield db.get(getOrderParams);
        console.log('Order data retrieved:', orderData); // Logga orderData för att kontrollera
        if (!orderData.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Order not found.' }),
            };
        }
        // Först, lås beställningen
        const lockUpdateParams = {
            TableName: 'OrdersTable',
            Key: { orderId },
            UpdateExpression: 'SET #locked = :locked, #updatedAt = :updatedAt',
            ExpressionAttributeNames: {
                '#locked': 'locked',
                '#updatedAt': 'updatedAt',
            },
            ExpressionAttributeValues: {
                ':locked': true, // Lås beställningen
                ':updatedAt': new Date().toISOString(),
            },
            ReturnValues: 'ALL_NEW',
        };
        console.log('Lock update params:', lockUpdateParams); // Logga parametrarna för att säkerställa att de är korrekta
        const lockCommand = new UpdateCommand(lockUpdateParams);
        const lockResult = yield db.send(lockCommand);
        console.log('Lock result:', lockResult); // Logga resultatet av uppdateringen
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Order locked successfully.',
                updatedOrder: lockResult.Attributes,
            }),
        };
    }
    catch (error) {
        console.error('Error locking the order:', error);
        let errorMessage = 'Failed to lock the order.';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return {
            statusCode: 500,
            body: JSON.stringify({ message: errorMessage }),
        };
    }
});
