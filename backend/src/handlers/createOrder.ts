import { db } from '../services/db';  
import { updateStock } from './updateStock';

export const createOrder = async (event: any): Promise<any> => {
  const { name, customerName, customerPhone, dishNames } = JSON.parse(event.body);

  if (!dishNames || dishNames.length === 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Dish out of stock',
      }),
    };
  }

  // Skapa ett unikt orderId med endast siffror (timestamp)
  const orderId = Date.now().toString();
  const orderedDishes = [];
  const ingredientsToUpdate: { id: string; quantity: number }[] = [];

  try {
    // Hämta ingredienser för varje rätt och summera dem
    for (const dishName of dishNames) {
      const menuParams = {
        TableName: 'MenuTable',
        Key: { name: dishName },
      };

      const dish = await db.get(menuParams);

      if (!dish.Item) {
        throw new Error(`Dish not found: ${dishName}`);
      }

      orderedDishes.push(dish.Item);

      for (const ingredient of dish.Item.ingredients) {
        const existingIngredient = ingredientsToUpdate.find(i => i.id === ingredient.id);

        if (existingIngredient) {
          existingIngredient.quantity += ingredient.quantity;
        } else {
          ingredientsToUpdate.push({ id: ingredient.id, quantity: ingredient.quantity });
        }
      }
    }

    // Uppdatera lagerstatus
    if (ingredientsToUpdate.length > 0) {
      await updateStock(ingredientsToUpdate);
    }

    // Skapa order
    const params = {
      TableName: 'OrdersTable',
      Item: {
        orderId: orderId,
        name: name,
        customerName: customerName,
        customerPhone: customerPhone,
        status: 'pending', // Orderstatus vid skapande
        createdAt: new Date().toISOString(),
        dishes: orderedDishes, // Lägg till rätter i ordern
      },
    };

    // Spara order i databasen
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
