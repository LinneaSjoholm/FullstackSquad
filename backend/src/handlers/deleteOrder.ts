import { db } from '../services/db';
import { UpdateCommand, UpdateCommandInput } from '@aws-sdk/lib-dynamodb';

// API-nyckeln (kan hämtas från miljövariabler för att vara mer säker)
const API_KEY = process.env.API_KEY || 'your-default-api-key';

export const deleteOrder = async (event: any): Promise<any> => {
  // Kontrollera om API-nyckeln finns i begäran
  const apiKey = event.headers['x-api-key'];
  if (!apiKey || apiKey !== API_KEY) {
    return {
      statusCode: 403, // Forbidden om nyckeln inte är rätt
      body: JSON.stringify({ message: 'Forbidden: Invalid API key' }),
    };
  }

  const orderId = event.pathParameters.id;

  try {
    // Hämta den aktuella ordern
    const getOrderParams = { TableName: 'OrdersTable', Key: { orderId } };
    const orderData = await db.get(getOrderParams);

    // Om ordern inte finns, returnera 404
    if (!orderData.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Order not found.' }),
      };
    }

    // Om ordern redan är låst, returnera 403
    if (orderData.Item.status === 'locked' || orderData.Item.status === 'completed') {
      return {
        statusCode: 403,
        body: JSON.stringify({ message: 'Order cannot be canceled because it is locked or already completed.' }),
      };
    }

    // Uppdatera orderstatusen till "canceled" (med alias för status)
    const updateParams: UpdateCommandInput = {
      TableName: 'OrdersTable',
      Key: { orderId },
      UpdateExpression: 'SET #status = :status, updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#status': 'status', // Alias för reserverat ord "status"
      },
      ExpressionAttributeValues: {
        ':status': 'canceled',
        ':updatedAt': new Date().toISOString(),
      },
      ReturnValues: 'ALL_NEW',
    };

    const updateCommand = new UpdateCommand(updateParams);
    const updatedOrder = await db.send(updateCommand);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Order canceled successfully.',
        updatedOrder: updatedOrder.Attributes, 
      }),
    };
  } catch (error: unknown) {
    console.error('Error canceling order:', error);

    // Felhantering av okänt fel
    let errorMessage = 'Failed to cancel order.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ message: errorMessage }),
    };
  }
};
