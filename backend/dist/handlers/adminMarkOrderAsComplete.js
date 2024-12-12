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
export const adminMarkOrderAsComplete = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = event.pathParameters.id;
    try {
        const getOrderParams = { TableName: 'OrdersTable', Key: { orderId } };
        const orderData = yield db.get(getOrderParams);
        if (!orderData.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Order not found.' }),
            };
        }
        const completedUpdateParams = {
            TableName: 'OrdersTable',
            Key: { orderId },
            UpdateExpression: 'SET #status = :status, #updatedAt = :updatedAt',
            ExpressionAttributeNames: {
                '#status': 'status',
                '#updatedAt': 'updatedAt',
            },
            ExpressionAttributeValues: {
                ':status': 'completed', // Markera som färdig
                ':updatedAt': new Date().toISOString(),
            },
            ReturnValues: 'ALL_NEW',
        };
        const completedCommand = new UpdateCommand(completedUpdateParams);
        const updatedOrder = yield db.send(completedCommand);
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Order marked as completed successfully.',
                updatedOrder: updatedOrder.Attributes,
            }),
        };
    }
    catch (error) {
        console.error('Error marking order as completed:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to mark order as completed.' }),
        };
    }
});
