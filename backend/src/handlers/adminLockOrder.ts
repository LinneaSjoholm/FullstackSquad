import { db } from '../services/db';
import { UpdateCommand, UpdateCommandInput } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const adminLockOrder = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const orderId = event.pathParameters?.id;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'OPTIONS, POST',
  };

  if (!orderId) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'Order ID is required.' }),
    };
  }

  try {
    const getOrderParams = { TableName: 'OrdersTable', Key: { orderId } };
    const orderData = await db.get(getOrderParams);

    if (!orderData.Item) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'Order not found.' }),
      };
    }

    const updateParams: UpdateCommandInput = {
      TableName: 'OrdersTable',
      Key: { orderId },
      UpdateExpression: 'SET #locked = :locked, #updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#locked': 'locked',
        '#updatedAt': 'updatedAt',
      },
      ExpressionAttributeValues: {
        ':locked': true,
        ':updatedAt': new Date().toISOString(),
      },
      ReturnValues: 'ALL_NEW',
    };

    const updateCommand = new UpdateCommand(updateParams);
    const updatedOrder = await db.send(updateCommand);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        message: 'Order locked successfully.',
        updatedOrder: updatedOrder.Attributes,
      }),
    };
  } catch (error) {
    console.error('Error locking order:', error);

    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        message: 'Failed to lock order.',
        error: error instanceof Error ? error.message : 'Unknown error occurred.',
      }),
    };
  }
};
