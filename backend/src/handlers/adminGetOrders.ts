import { db } from '../services/db';
import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';
import { verifyAdmin } from '../middleware/verifyAdmin';

export const adminGetOrders = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  // Anropa verifyAdmin och vänta på resultatet
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
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'CORS preflight passed.' }),
    };
  }

  const params = {
    TableName: 'OrdersTable',
  };

  try {
    const data = await db.scan(params);

    if (!data.Items || data.Items.length === 0) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'No orders found' }),
      };
    }

    // Lägg till 'locked' fältet i varje order om det inte finns
    const ordersWithLock = data.Items.map((order: any) => {
      return {
        ...order,
        locked: order.locked !== undefined ? order.locked : false, // Lägg till locked: false om det saknas
      };
    });

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(ordersWithLock),
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        message: 'Failed to fetch orders',
        error: errorMessage,
      }),
    };
  }
};
