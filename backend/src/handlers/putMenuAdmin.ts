import { db } from '../services/db';
import { UpdateCommand, UpdateCommandInput } from '@aws-sdk/lib-dynamodb';

const API_KEY = process.env.API_KEY || 'your-default-api-key';

export const putMenuAdmin = async (event: any): Promise<any> => {
  // Kontrollera om API-nyckeln finns i begäran
  const apiKey = event.headers['x-api-key'];
  if (!apiKey || apiKey !== API_KEY) {
    return {
      statusCode: 403, // Forbidden om nyckeln inte är rätt
      body: JSON.stringify({ message: 'Forbidden: Invalid API key' }),
    };
  }

  const { itemId, name, description, price, ingredients } = JSON.parse(event.body);

  if (!itemId || !name || price === undefined) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing required fields (itemId, name, price).' }),
    };
  }

  try {
    // Uppdatera menyalternativet i databasen
    const updateParams: UpdateCommandInput = {
      TableName: 'MenuTable',
      Key: { id: itemId },
      UpdateExpression: 'SET #name = :name, #description = :description, #price = :price, #ingredients = :ingredients, updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#name': 'name',
        '#description': 'description',
        '#price': 'price',
        '#ingredients': 'ingredients',
      },
      ExpressionAttributeValues: {
        ':name': name,
        ':description': description,
        ':price': price,
        ':ingredients': ingredients || [],
        ':updatedAt': new Date().toISOString(),
      },
      ReturnValues: 'ALL_NEW',
    };

    const updateCommand = new UpdateCommand(updateParams);
    const updatedItem = await db.send(updateCommand);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Menu item updated successfully.',
        updatedItem: updatedItem.Attributes,
      }),
    };
  } catch (error: unknown) {
    console.error('Error updating menu item:', error);

    let errorMessage = 'Failed to update menu item.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ message: errorMessage }),
    };
  }
};
