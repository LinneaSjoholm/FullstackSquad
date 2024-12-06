import { db } from '../services/db';

export const adminGetOrders = async (): Promise<any> => {
  const params = {
    TableName: 'OrdersTable',
  };

  try {
    const data = await db.scan(params);

    if (!data.Items || data.Items.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'No orders found' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data.Items),
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: 'Failed to fetch orders',
          error: error.message,
        }),
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: 'Failed to fetch orders',
          error: 'Unknown error occurred',
        }),
      };
    }
  }
};
