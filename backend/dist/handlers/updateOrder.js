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
export const updateOrder = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = event.pathParameters.id;
    const body = JSON.parse(event.body);
    const { items } = body;
    if (!items || items.length === 0) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Items are required to update the order.' }),
        };
    }
    try {
        // Fetch the current order
        const getOrderParams = { TableName: 'OrdersTable', Key: { orderId } };
        const orderData = yield db.get(getOrderParams);
        if (!orderData.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Order not found.' }),
            };
        }
        // Check if the order is locked
        if (orderData.Item.status === 'locked') {
            return {
                statusCode: 403,
                body: JSON.stringify({ message: 'Order is locked and cannot be updated.' }),
            };
        }
        // Fetch each product individually using GetItem
        const updatedItems = [];
        for (const item of items) {
            const productData = yield db.get({
                TableName: 'MenuTable',
                Key: { id: item.id },
            });
            if (!productData.Item) {
                return {
                    statusCode: 404,
                    body: JSON.stringify({ message: `Product with id ${item.id} not found.` }),
                };
            }
            // Map item details
            updatedItems.push({
                id: item.id,
                name: productData.Item.name,
                quantity: item.quantity,
                price: parseFloat(productData.Item.price),
            });
        }
        // Update the order in the database
        const updateParams = {
            TableName: 'OrdersTable',
            Key: { orderId },
            UpdateExpression: 'SET #items = :items, updatedAt = :updatedAt',
            ExpressionAttributeNames: {
                '#items': 'items',
            },
            ExpressionAttributeValues: {
                ':items': updatedItems,
                ':updatedAt': new Date().toISOString(),
            },
            ReturnValues: 'ALL_NEW',
        };
        const updateCommand = new UpdateCommand(updateParams);
        const updatedOrder = yield db.send(updateCommand);
        // Since there's no $metadata, just use updatedOrder.Attributes directly
        const orderDetails = updatedOrder.Attributes;
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Order updated successfully.',
                updatedOrder: orderDetails,
            }),
        };
    }
    catch (error) {
        console.error('Error updating order:', error);
        let errorMessage = 'Failed to update order.';
        // Type guard to handle unknown error type and safely access error message
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return {
            statusCode: 500,
            body: JSON.stringify({ message: errorMessage }),
        };
    }
});
