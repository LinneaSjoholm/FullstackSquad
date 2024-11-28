import { db } from '../services/db';  

export const createOrder = async (event: any): Promise<any> => {
  const { name, customerName, customerPhone } = JSON.parse(event.body);

  // Skapa ett unikt orderId med endast siffror (timestamp)
  const orderId = Date.now().toString();  

  const params = {
    TableName: 'OrdersTable',
    Item: {
      orderId: orderId,
      name: name,
      customerName: customerName,
      customerPhone: customerPhone,
      status: 'pending',  // Orderstatus vid skapande
      createdAt: new Date().toISOString(),
    },
  };

  try {
    // Använd db.put för att sätta in en ny order i DynamoDB
    await db.put(params);

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: 'Order created successfully',
        orderId: orderId,
      }),
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: 'Failed to create order',
          error: error.message,
        }),
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: 'Failed to create order',
          error: 'Unknown error occurred',
        }),
      };
    }
  }
};
