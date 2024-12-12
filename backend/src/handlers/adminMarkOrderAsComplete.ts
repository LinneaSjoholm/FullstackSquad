import { db } from '../services/db';
import { UpdateCommand, UpdateCommandInput } from '@aws-sdk/lib-dynamodb';
import { verifyAdmin } from '../middleware/verifyAdmin'; // Importera verifyAdmin

export const adminMarkOrderAsComplete = async (event: any): Promise<any> => {
  // Först, kontrollera om användaren är en administratör
  const authResult = await verifyAdmin(event);

  // Om authResult inte är giltigt, returnera 401
  if (!authResult.isValid) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        message: 'Access Denied',
        error: 'You do not have the necessary permissions to access this resource. Please ensure you are logged in as an administrator.',
      }),
    };
  }

  const orderId = event.pathParameters.id;

  try {
    const getOrderParams = { TableName: 'OrdersTable', Key: { orderId } };
    const orderData = await db.get(getOrderParams);

    if (!orderData.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Order not found.' }),
      };
    }

    const completedUpdateParams: UpdateCommandInput = {
      TableName: 'OrdersTable',
      Key: { orderId },
      UpdateExpression: 'SET #status = :status, #updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#status': 'status',
        '#updatedAt': 'updatedAt',
      },
      ExpressionAttributeValues: {
        ':status': 'completed',  // Markera som färdig
        ':updatedAt': new Date().toISOString(),
      },
      ReturnValues: 'ALL_NEW',
    };

    const completedCommand = new UpdateCommand(completedUpdateParams);
    const updatedOrder = await db.send(completedCommand);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Order marked as completed successfully.',
        updatedOrder: updatedOrder.Attributes,
      }),
    };
  } catch (error) {
    console.error('Error marking order as completed:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to mark order as completed.' }),
    };
  }
};
