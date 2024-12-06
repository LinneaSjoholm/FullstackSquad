import { db } from '../services/db';
import { UpdateCommand, UpdateCommandInput } from '@aws-sdk/lib-dynamodb';

export const adminLockOrder = async (event: any): Promise<any> => {
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

    // Uppdatera beställningen och sätt "locked" till true
    const updateParams: UpdateCommandInput = {
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

    const updateCommand = new UpdateCommand(updateParams);
    const updatedOrder = await db.send(updateCommand);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Order locked successfully.',
        updatedOrder: updatedOrder.Attributes,
      }),
    };
  } catch (error) {
    console.error('Error locking order:', error);
    let errorMessage = 'Failed to lock order.';

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ message: errorMessage }),
    };
  }
};
