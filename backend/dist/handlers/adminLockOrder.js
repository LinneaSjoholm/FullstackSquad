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
    var _a;
    const orderId = (_a = event.pathParameters) === null || _a === void 0 ? void 0 : _a.id;
    if (!orderId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Order ID is required.' }),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
            }
        };
    }
    try {
        const getOrderParams = { TableName: 'OrdersTable', Key: { orderId } };
        const orderData = yield db.get(getOrderParams);
        if (!orderData.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Order not found.' }),
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
                }
            };
        }
        const updateParams = {
            TableName: 'OrdersTable',
            Key: { orderId },
            UpdateExpression: 'SET #locked = :locked, #status = :status, #updatedAt = :updatedAt',
            ExpressionAttributeNames: {
                '#locked': 'locked',
                '#status': 'status',
                '#updatedAt': 'updatedAt',
            },
            ExpressionAttributeValues: {
                ':locked': true,
                ':status': 'locked',
                ':updatedAt': new Date().toISOString(),
            },
            ReturnValues: 'ALL_NEW',
        };
        const updateCommand = new UpdateCommand(updateParams);
        const updatedOrder = yield db.send(updateCommand);
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Order locked successfully.',
                updatedOrder: updatedOrder.Attributes,
            }),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
            }
        };
    }
    catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to lock order.' }),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
            }
        };
    }
});
