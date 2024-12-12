import { db } from '../services/db';
import { UpdateCommand, UpdateCommandInput } from '@aws-sdk/lib-dynamodb';
import { verifyAdmin } from '../middleware/verifyAdmin';

export const adminLockOrder = async (event: any): Promise<any> => {
  // Anropa verifyAdmin och vänta på resultatet
const authResult = await verifyAdmin(event);

// Om authResult inte är giltigt, returnera 401
if (!authResult.isValid) {
  return {
    statusCode: 401,
    message: 'Access Denied',
    error: 'You do not have the necessary permissions to access this resource. Please ensure you are logged in as an administrator.',
  };
}

  const orderId = event.pathParameters.id;

  try {
    // Hämta den aktuella beställningen
    const getOrderParams = { TableName: 'OrdersTable', Key: { orderId } };
    const orderData = await db.get(getOrderParams);

    console.log('Order data retrieved:', orderData); // Logga orderData för att kontrollera

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

    console.log('Lock update params:', lockUpdateParams); // Logga parametrarna för att säkerställa att de är korrekta

    const lockCommand = new UpdateCommand(lockUpdateParams);
    const lockResult = await db.send(lockCommand);
    console.log('Lock result:', lockResult); // Logga resultatet av uppdateringen

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Order locked successfully.',
        updatedOrder: lockResult.Attributes,
      }),
    };
  } catch (error) {
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
};
