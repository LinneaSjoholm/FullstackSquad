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
    // Validera input
    const body = JSON.parse(event.body);
    const { lock } = body;
    // Validera att lock är en boolean
    if (lock === undefined || typeof lock !== 'boolean') {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'The "lock" field is required and must be a boolean value (true/false).',
            }),
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
        // Kontrollera om locked finns i ordern, om inte skapa den.
        const updateExpression = [];
        const expressionAttributeNames = {};
        const expressionAttributeValues = {
            ':lock': lock,
            ':updatedAt': new Date().toISOString(),
        };
        updateExpression.push('#lock = :lock');
        expressionAttributeNames['#lock'] = 'locked'; // 'locked' är det fältet du vill uppdatera
        updateExpression.push('#updatedAt = :updatedAt');
        expressionAttributeNames['#updatedAt'] = 'updatedAt';
        const updateParams = {
            TableName: 'OrdersTable',
            Key: { orderId },
            UpdateExpression: `SET ${updateExpression.join(', ')}`,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: 'ALL_NEW', // Returnera alla nya attribut efter uppdateringen
        };
        const updateCommand = new UpdateCommand(updateParams);
        const updatedOrder = yield db.send(updateCommand);
        // Kontrollera om ordern har uppdaterats korrekt
        if (!updatedOrder.Attributes) {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Failed to update order lock status.' }),
            };
        }
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: `Order ${lock ? 'locked' : 'unlocked'} successfully.`,
                updatedOrder: updatedOrder.Attributes, // Returnera uppdaterad order
            }),
        };
    }
    catch (error) {
        console.error('Error locking order:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to lock order.' }),
        };
    }
});
// // import { db } from '../services/db';
// // import { UpdateCommand, UpdateCommandInput } from '@aws-sdk/lib-dynamodb';
// // export const adminLockAndMarkOrderAsCompleted = async (event: any): Promise<any> => {
// //   const orderId = event.pathParameters.id;
// //   try {
// //     // Hämta den aktuella beställningen
// //     const getOrderParams = { TableName: 'OrdersTable', Key: { orderId } };
// //     const orderData = await db.get(getOrderParams);
// //     if (!orderData.Item) {
// //       return {
// //         statusCode: 404,
// //         body: JSON.stringify({ message: 'Order not found.' }),
// //       };
// //     }
// //     // Först, lås beställningen
// //     const lockUpdateParams: UpdateCommandInput = {
// //       TableName: 'OrdersTable',
// //       Key: { orderId },
// //       UpdateExpression: 'SET #locked = :locked, #updatedAt = :updatedAt',
// //       ExpressionAttributeNames: {
// //         '#locked': 'locked',
// //         '#updatedAt': 'updatedAt',
// //       },
// //       ExpressionAttributeValues: {
// //         ':locked': true,  // Lås beställningen
// //         ':updatedAt': new Date().toISOString(),
// //       },
// //       ReturnValues: 'ALL_NEW',
// //     };
// //     const lockCommand = new UpdateCommand(lockUpdateParams);
// //     await db.send(lockCommand);
// //     // Markera beställningen som tillagad och klar
// //     const completedUpdateParams: UpdateCommandInput = {
// //       TableName: 'OrdersTable',
// //       Key: { orderId },
// //       UpdateExpression: 'SET #status = :status, #updatedAt = :updatedAt',
// //       ExpressionAttributeNames: {
// //         '#status': 'status',
// //         '#updatedAt': 'updatedAt',
// //       },
// //       ExpressionAttributeValues: {
// //         ':status': 'completed',  // Markera som klar
// //         ':updatedAt': new Date().toISOString(),
// //       },
// //       ReturnValues: 'ALL_NEW',
// //     };
// //     const completedCommand = new UpdateCommand(completedUpdateParams);
// //     const updatedOrder = await db.send(completedCommand);
// //     return {
// //       statusCode: 200,
// //       body: JSON.stringify({
// //         message: 'Order locked and marked as completed successfully.',
// //         updatedOrder: updatedOrder.Attributes,
// //       }),
// //     };
// //   } catch (error) {
// //     console.error('Error locking and marking order as completed:', error);
// //     let errorMessage = 'Failed to lock and mark order as completed.';
// //     if (error instanceof Error) {
// //       errorMessage = error.message;
// //     }
// //     return {
// //       statusCode: 500,
// //       body: JSON.stringify({ message: errorMessage }),
// //     };
// //   }
// // };
