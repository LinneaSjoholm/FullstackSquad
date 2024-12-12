import { db } from '../services/db';
import { UpdateCommand, UpdateCommandInput } from '@aws-sdk/lib-dynamodb';
import { verifyAdmin } from '../middleware/verifyAdmin';

export const adminUpdateOrder = async (event: any): Promise<any> => {
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
  const body = JSON.parse(event.body);
  const { status, messageToChef, locked } = body;

  // Validera input
  if (!status || !messageToChef || locked === undefined) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Status, messageToChef, and locked are required to update the order.' }),
    };
  }

  try {
    // Hämta aktuell order
    const getOrderParams = { TableName: 'OrdersTable', Key: { orderId } };
    const orderData = await db.get(getOrderParams);

    if (!orderData.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Order not found.' }),
      };
    }

    // Uppdatera ordern med ny information
    const updateExpression = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {
      ':status': status,
      ':messageToChef': messageToChef,
      ':locked': locked,  // Uppdatera locked-fältet
      ':updatedAt': new Date().toISOString(),
    };

    updateExpression.push('#status = :status');
    expressionAttributeNames['#status'] = 'status';

    updateExpression.push('#messageToChef = :messageToChef');
    expressionAttributeNames['#messageToChef'] = 'messageToChef';

    updateExpression.push('#locked = :locked');  // Lägg till locked i uttrycket
    expressionAttributeNames['#locked'] = 'locked';

    updateExpression.push('#updatedAt = :updatedAt');
    expressionAttributeNames['#updatedAt'] = 'updatedAt';

    const updateParams: UpdateCommandInput = {
      TableName: 'OrdersTable',
      Key: { orderId },
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    };

    const updateCommand = new UpdateCommand(updateParams);
    const updatedOrder = await db.send(updateCommand);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Order updated successfully.',
        updatedOrder: updatedOrder.Attributes,
      }),
    };
  } catch (error: unknown) {
    console.error('Error updating order:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to update order.' }),
    };
  }
};
