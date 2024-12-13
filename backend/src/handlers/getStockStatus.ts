import { db } from '../services/db';
import { verifyAdmin } from '../middleware/verifyAdmin';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

// Funktion för att hämta lagerstatus för en specifik ingrediens
export const getIngredientStock = async (ingredientId: string, event: APIGatewayProxyEvent) => {
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

  try {
    const result = await db.get({
      TableName: 'IngredientsTable',
      Key: { id: ingredientId },
    });

    if (result.Item) {
      const stock = result.Item.stock.N;
      return {
        statusCode: 200,
        body: JSON.stringify({ stock }),
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Ingredient not found' }),
      };
    }
  } catch (error) {
    console.error('Error fetching ingredient stock:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error fetching ingredient stock' }),
    };
  }
};

// Funktion för att hämta lagerstatus för alla ingredienser
export const getStockStatus = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
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

  const params = {
    TableName: 'IngredientsTable',
  };

  try {
    const result = await db.scan(params);

    if (!result.Items || result.Items.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'No ingredients found' }),
      };
    }

    const filteredItems = result.Items.filter(item => {
      return item.dishNames && item.dishNames.length > 0;
    });

    return {
      statusCode: 200,
      body: JSON.stringify(filteredItems),
    };
  } catch (error) {
    console.error('Error fetching stock status:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error fetching stock status' }),
    };
  }
};
