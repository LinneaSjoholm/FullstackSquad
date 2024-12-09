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
export const cancelOrder = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = event.pathParameters.id;
    try {
        // Hämta den aktuella ordern
        const getOrderParams = { TableName: 'OrdersTable', Key: { orderId } };
        const orderData = yield db.get(getOrderParams);
        // Om ordern inte finns, returnera 404
        if (!orderData.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Order not found.' }),
            };
        }
        // Om ordern redan är låst, returnera 403
        if (orderData.Item.status === 'locked' || orderData.Item.status === 'completed') {
            return {
                statusCode: 403,
                body: JSON.stringify({ message: 'Order cannot be canceled because it is locked or already completed.' }),
            };
        }
        // Uppdatera orderstatusen till "canceled" (med alias för status)
        const updateParams = {
            TableName: 'OrdersTable',
            Key: { orderId },
            UpdateExpression: 'SET #status = :status, updatedAt = :updatedAt',
            ExpressionAttributeNames: {
                '#status': 'status', // Alias för reserverat ord "status"
            },
            ExpressionAttributeValues: {
                ':status': 'canceled',
                ':updatedAt': new Date().toISOString(),
            },
            ReturnValues: 'ALL_NEW',
        };
        const updateCommand = new UpdateCommand(updateParams);
        const updatedOrder = yield db.send(updateCommand);
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Order canceled successfully.',
                updatedOrder: updatedOrder.Attributes,
            }),
        };
    }
    catch (error) {
        console.error('Error canceling order:', error);
        // Felhantering av okänt fel
        let errorMessage = 'Failed to cancel order.';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return {
            statusCode: 500,
            body: JSON.stringify({ message: errorMessage }),
        };
    }
});
