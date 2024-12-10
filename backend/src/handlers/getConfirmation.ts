import { db } from '../services/db';

export const handler = async (event: any) => {
  const apiKey = event.headers?.['x-api-key'];

  if (apiKey !== process.env.API_KEY) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: 'Forbidden: Invalid API key' }),
    };
  }

  const orderId = event.pathParameters?.id;

  if (!orderId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Order ID is required' }),
    };
  }

  const params = {
    TableName: 'OrdersTable',
    Key: { orderId },
  };

  try {
    const result = await db.get(params);

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Order not found' }),
      };
    }

    const updatedOrder = { ...result.Item, status: 'confirmed', reviewStatus: 'confirmed' };  // Mark as confirmed
    const updateParams = {
      TableName: 'OrdersTable',
      Item: updatedOrder,
    };

    await db.put(updateParams);  // Confirm the order in the database

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Order confirmed successfully',
        updatedOrder,
      }),
    };
  } catch (error) {
    console.error('Error confirming order:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error confirming order', error }),
    };
  }
};
