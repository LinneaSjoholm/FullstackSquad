import { db } from '../services/db';
import { UpdateCommand, UpdateCommandInput } from '@aws-sdk/lib-dynamodb';

export const adminLockAndMarkOrderAsCompleted = async (event: any): Promise<any> => {
  const orderId = event.pathParameters.id;

  try {
    // Hämta den aktuella beställningen
    const getOrderParams = { TableName: 'OrdersTable', Key: { orderId } };
    const orderData = await db.get(getOrderParams);

    if (!orderData.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Order not found.' }),
      };
    }

    // Först, lås beställningen
    const lockUpdateParams: UpdateCommandInput = {
      TableName: 'OrdersTable',
      Key: { orderId },
      UpdateExpression: 'SET #locked = :locked, #updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#locked': 'locked',
        '#updatedAt': 'updatedAt',
      },
      ExpressionAttributeValues: {
        ':locked': true,  // Lås beställningen
        ':updatedAt': new Date().toISOString(),
      },
      ReturnValues: 'ALL_NEW',
    };

    const lockCommand = new UpdateCommand(lockUpdateParams);
    await db.send(lockCommand);

    // Därefter, markera beställningen som färdig (completed)
    const completedUpdateParams: UpdateCommandInput = {
      TableName: 'OrdersTable',
      Key: { orderId },
      UpdateExpression: 'SET #status = :status, #updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#status': 'status',
        '#updatedAt': 'updatedAt',
      },
      ExpressionAttributeValues: {
        ':status': 'completed',  // Markera som klar
        ':updatedAt': new Date().toISOString(),
      },
      ReturnValues: 'ALL_NEW',
    };

    const completedCommand = new UpdateCommand(completedUpdateParams);
    const updatedOrder = await db.send(completedCommand);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Order locked and marked as completed successfully.',
        updatedOrder: updatedOrder.Attributes,
      }),
    };
  } catch (error) {
    console.error('Error locking and marking order as completed:', error);
    let errorMessage = 'Failed to lock and mark order as completed.';

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ message: errorMessage }),
    };
  }
};
