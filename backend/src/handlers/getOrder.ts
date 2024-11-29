import { db } from '../services/db';

export const getOrder = async (event: any): Promise<any> => {
  const orderId = event.pathParameters.id;

  const params = {
    TableName: 'OrdersTable',
    Key: {
      orderId: orderId,
    },
  };

  try {
    const data = await db.get(params);

    if (!data.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Order not found' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data.Item),
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: 'Failed to fetch order',
          error: error.message,
        }),
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: 'Failed to fetch order',
          error: 'Unknown error occurred',
        }),
      };
    }
  }
};
