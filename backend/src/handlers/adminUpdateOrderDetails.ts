import { db } from '../services/db';
import { UpdateCommand, UpdateCommandInput } from '@aws-sdk/lib-dynamodb';

export const adminUpdateOrder = async (event: any): Promise<any> => {
    const orderId = event.pathParameters.id;
    const body = JSON.parse(event.body);
    const { items, status, customerDetails, messageToChef } = body;
  
    // Kontrollera om API-nyckeln är korrekt
    // if (!event.headers['x-api-key'] || event.headers['x-api-key'] !== process.env.ADMIN_API_KEY) {
    //   return {
    //     statusCode: 403,
    //     body: JSON.stringify({ message: 'Unauthorized.' }),
    //   };
    // }
  
    if (!items || items.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Items are required to update the order.' }),
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
  
      // Bygg uppdaterade items
      const updatedItems = [];
      for (const item of items) {
        const productData = await db.get({
          TableName: 'MenuTable',
          Key: { id: item.id },
        });
  
        if (!productData.Item) {
          return {
            statusCode: 404,
            body: JSON.stringify({ message: `Product with id ${item.id} not found.` }),
          };
        }
  
        updatedItems.push({
          id: item.id,
          name: productData.Item.name,
          quantity: item.quantity,
          price: parseFloat(productData.Item.price),
        });
      }
  
      // Bygg uppdateringsuttrycket och attributvärden
      const updateExpression = [];
      const expressionAttributeNames: Record<string, string> = {};
      const expressionAttributeValues: Record<string, any> = {
        ':items': updatedItems,
        ':updatedAt': new Date().toISOString(),  // Lägg till updatedAt här
      };
  
      updateExpression.push('#items = :items');
      expressionAttributeNames['#items'] = 'items';
  
      if (status) {
        updateExpression.push('#status = :status');
        expressionAttributeNames['#status'] = 'status';
        expressionAttributeValues[':status'] = status;
      }
  
      if (customerDetails) {
        updateExpression.push('#customerDetails = :customerDetails');
        expressionAttributeNames['#customerDetails'] = 'customerDetails';
        expressionAttributeValues[':customerDetails'] = customerDetails;
      }
  
      if (messageToChef) {
        updateExpression.push('#messageToChef = :messageToChef');
        expressionAttributeNames['#messageToChef'] = 'messageToChef';
        expressionAttributeValues[':messageToChef'] = messageToChef;
      }
  
      // Lägg till updatedAt i uttrycket
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
  
      // Uppdatera ordern i databasen
      const updateCommand = new UpdateCommand(updateParams);
      const updatedOrder = await db.send(updateCommand);
  
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Order updated successfully by admin.',
          updatedOrder: updatedOrder.Attributes,
        }),
      };
    } catch (error: unknown) {
      console.error('Error updating order:', error);
      let errorMessage = 'Failed to update order.';
  
      if (error instanceof Error) {
        errorMessage = error.message;
      }
  
      return {
        statusCode: 500,
        body: JSON.stringify({ message: errorMessage }),
      };
    }
  };
  
