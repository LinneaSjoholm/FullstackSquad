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
export const adminUpdateOrder = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = event.pathParameters.id;
    const body = JSON.parse(event.body);
    const { status, messageToChef } = body;
    // Validera input
    if (!status || !messageToChef) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Both status and messageToChef are required to update the order.' }),
        };
    }
    try {
        // Hämta aktuell order
        const getOrderParams = { TableName: 'OrdersTable', Key: { orderId } };
        const orderData = yield db.get(getOrderParams);
        if (!orderData.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Order not found.' }),
            };
        }
        // Uppdatera ordern med ny information
        const updateExpression = [];
        const expressionAttributeNames = {};
        const expressionAttributeValues = {
            ':status': status,
            ':messageToChef': messageToChef,
            ':updatedAt': new Date().toISOString(),
        };
        updateExpression.push('#status = :status');
        expressionAttributeNames['#status'] = 'status';
        updateExpression.push('#messageToChef = :messageToChef');
        expressionAttributeNames['#messageToChef'] = 'messageToChef';
        updateExpression.push('#updatedAt = :updatedAt');
        expressionAttributeNames['#updatedAt'] = 'updatedAt';
        const updateParams = {
            TableName: 'OrdersTable',
            Key: { orderId },
            UpdateExpression: `SET ${updateExpression.join(', ')}`,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: 'ALL_NEW',
        };
        const updateCommand = new UpdateCommand(updateParams);
        const updatedOrder = yield db.send(updateCommand);
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Order updated successfully.',
                updatedOrder: updatedOrder.Attributes,
            }),
        };
    }
    catch (error) {
        console.error('Error updating order:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to update order.' }),
        };
    }
});
