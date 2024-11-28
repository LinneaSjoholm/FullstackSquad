import { db } from '../services/db';

export const getOrderReview = async (event: any): Promise<any> => {
  const orderId = event.pathParameters.id;  // Hämta orderId från URL-parametern

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

    // Returnera orderdetaljer för att visa en översikt till kunden
    return {
      statusCode: 200,
      body: JSON.stringify({
        orderId: data.Item.orderId,
        name: data.Item.name,
        customerName: data.Item.customerName,
        customerPhone: data.Item.customerPhone,
        status: data.Item.status,
        createdAt: data.Item.createdAt,
      }),
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: 'Failed to fetch order review',
          error: error.message,
        }),
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: 'Failed to fetch order review',
          error: 'Unknown error occurred',
        }),
      };
    }
  }
};
