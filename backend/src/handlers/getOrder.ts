import { db } from '../services/db'; // Använder din importerade db-modul

// API-nyckeln (kan hämtas från miljövariabler för att vara mer säker)
const API_KEY = process.env.API_KEY || 'your-default-api-key';

export const getOrder = async (event: any) => {
  // Kontrollera om API-nyckeln finns i begäran
  const apiKey = event.headers['x-api-key'];
  if (!apiKey || apiKey !== API_KEY) {
    return {
      statusCode: 403, // Forbidden om nyckeln inte är rätt
      body: JSON.stringify({ message: 'Forbidden: Invalid API key' }),
    };
  }

  const orderId = event.pathParameters?.id; // Hämta orderId från URL (pathParameters)

  if (!orderId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Order ID is required' }),
    };
  }

  const params = {
    TableName: 'OrdersTable',
    Key: {
      orderId, // Använd orderId för att hämta rätt objekt
    },
  };

  try {
    // Använd db.get istället för dynamoDb.get
    const result = await db.get(params);

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Order not found' }),
      };
    }

    // Hämta originalbeställning
    const order = result.Item;

    // Uppdatera ingredienser genom att sammanfoga 'ingredients' med 'ingredientsToAdd' och ta bort 'ingredientsToRemove'
    order.items.forEach((item: any) => {
      // Lägg till ingredienser från 'ingredientsToAdd' om de finns
      if (item.ingredientsToAdd && item.ingredientsToAdd.length > 0) {
        item.ingredients = [...new Set([...item.ingredients, ...item.ingredientsToAdd])];
      }

      // Ta bort ingredienser från 'ingredientsToRemove' om de finns
      if (item.ingredientsToRemove && item.ingredientsToRemove.length > 0) {
        item.ingredients = item.ingredients.filter(
          (ingredient: string) => !item.ingredientsToRemove.includes(ingredient)
        );
      }

      // Ta bort tillfälliga fält som inte längre behövs
      delete item.ingredientsToAdd;
      delete item.ingredientsToRemove;
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Order retrieved successfully',
        order,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error fetching order', error }),
    };
  }
};
