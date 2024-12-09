import { db } from '../services/db';
import { UpdateCommand, UpdateCommandInput } from '@aws-sdk/lib-dynamodb';

export const adminUpdateOrder = async (event: any): Promise<any> => {
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
      ':updatedAt': new Date().toISOString(),
    };

    updateExpression.push('#status = :status');
    expressionAttributeNames['#status'] = 'status';

    updateExpression.push('#messageToChef = :messageToChef');
    expressionAttributeNames['#messageToChef'] = 'messageToChef';

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
