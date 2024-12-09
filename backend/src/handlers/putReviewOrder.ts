import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { DynamoDBItem, MenuItem } from '../interfaces';

const dynamoDb = new DocumentClient();

// Utility function to normalize ingredients
const normalizeIngredients = (ingredients: any[]): string[] => {
  return ingredients ? ingredients.map((ingredient) => ingredient.S) : [];
};

export const putReviewOrder = async (event: any) => {
  let items: { 
    id: string; 
    quantity: number; 
    ingredientsToAdd: string[]; 
    ingredientsToRemove: string[]; 
    lactoseFree?: boolean; 
    glutenFree?: boolean;
    drinkId?: string;  // Lägg till drinkId
  }[] = [];
  let customerName: string;
  let customerPhone: string;

  try {
    const parsedBody = JSON.parse(event.body);
    items = parsedBody.items;
    customerName = parsedBody.customerName;
    customerPhone = parsedBody.customerPhone;
  } catch (error) {
    console.error("Error parsing body:", error);
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid JSON format' }),
    };
  }

  const orderId = event.pathParameters?.id;
  if (!orderId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Order ID is required' }),
    };
  }

  const orderParams = {
    TableName: 'OrdersTable',
    Key: { orderId },
  };

  try {
    const orderResult = await dynamoDb.get(orderParams).promise();
    if (!orderResult.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Order not found' }),
      };
    }

    const originalItems: MenuItem[] = orderResult.Item.items || [];
    const menuParams = { TableName: 'MenuTable' };
    const menuResult = await dynamoDb.scan(menuParams).promise();

    if (!menuResult.Items || menuResult.Items.length === 0) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Menu data not found in DynamoDB' }),
      };
    }

    const updatedItemsDetails: string[] = [];
    let totalPrice = 0;

    for (const itemToUpdate of items) {
      itemToUpdate.ingredientsToAdd = itemToUpdate.ingredientsToAdd || [];
      itemToUpdate.ingredientsToRemove = itemToUpdate.ingredientsToRemove || [];

      const originalItemIndex = originalItems.findIndex((original: MenuItem) => original.id === itemToUpdate.id);

      // If item exists in the original order, update it
      if (originalItemIndex !== -1) {
        const originalItem = originalItems[originalItemIndex];

        const menuItem = menuResult.Items?.find((item: any) => item.id === itemToUpdate.id);
        const menuIngredients = menuItem?.ingredients || [];

        originalItem.ingredients = originalItem.ingredients || [...menuIngredients];

        // Add new ingredients and remove the specified ones
        originalItem.ingredients = [
          ...new Set([...originalItem.ingredients, ...itemToUpdate.ingredientsToAdd]),
        ];

        // Remove ingredients
        if (itemToUpdate.ingredientsToRemove.length > 0) {
          originalItem.ingredients = originalItem.ingredients.filter(
            (ingredient) => !itemToUpdate.ingredientsToRemove.includes(ingredient)
          );
          updatedItemsDetails.push(`Removed ingredients: ${itemToUpdate.ingredientsToRemove.join(", ")}`);
        }

        // Handle quantity change: log removal if quantity decreases
        if (itemToUpdate.quantity === 0) {
          originalItems.splice(originalItemIndex, 1); // Remove item from the originalItems list
          updatedItemsDetails.push(`Removed item: ${originalItem.name}`);
          // Remove associated drink if exists
          if (originalItem.drinkId) {
            originalItems.forEach(item => {
              if (item.drinkId === originalItem.drinkId) {
                item.drinkId = undefined; // Remove associated drink
                item.drinkName = undefined; // Remove associated drink name
                updatedItemsDetails.push(`Removed associated drink: ${item.drinkName}`);
              }
              
            });
          }
          continue; // Skip the rest of the processing for removed items
        }

        // Log removal if quantity decreased
        if (itemToUpdate.quantity < originalItem.quantity) {
          const quantityRemoved = originalItem.quantity - itemToUpdate.quantity;
          updatedItemsDetails.push(`Removed ${quantityRemoved} of ${originalItem.name}`);
        }

        // Otherwise, process the item (update ingredients, quantity, etc.)
        if (itemToUpdate.ingredientsToAdd.length > 0)
          updatedItemsDetails.push(`Added ingredients: ${itemToUpdate.ingredientsToAdd.join(", ")}`);
        if (itemToUpdate.ingredientsToRemove.length > 0)
          updatedItemsDetails.push(`Removed ingredients: ${itemToUpdate.ingredientsToRemove.join(", ")}`);

        originalItem.quantity = itemToUpdate.quantity || originalItem.quantity;
        const price = originalItem.price ?? 0;
        totalPrice += price * originalItem.quantity;

        originalItem.lactoseFree = itemToUpdate.lactoseFree ?? originalItem.lactoseFree;
        originalItem.glutenFree = itemToUpdate.glutenFree ?? originalItem.glutenFree;

        // Add drinkId if provided and look up the drink name
        if (itemToUpdate.drinkId) {
          const drink = menuResult.Items?.find((item: any) => item.id === itemToUpdate.drinkId);
          originalItem.drinkName = drink?.name ?? undefined; // Use undefined instead of null
        }

        originalItem.ingredientsToAdd = itemToUpdate.ingredientsToAdd;
        originalItem.ingredientsToRemove = itemToUpdate.ingredientsToRemove;

      } else {
        // If the item doesn't exist in the original order, add it as a new item
        const menuItem = menuResult.Items?.find((item: any) => item.id === itemToUpdate.id);
        const newItem: MenuItem = {
          id: itemToUpdate.id,
          name: menuItem?.name || "Unknown Item",
          quantity: itemToUpdate.quantity || 1,
          ingredients: itemToUpdate.ingredientsToAdd || [...(menuItem?.ingredients || [])],
          ingredientsToAdd: itemToUpdate.ingredientsToAdd || [],
          ingredientsToRemove: [],
          description: menuItem?.description,
          price: menuItem?.price ?? 0,
          lactoseFree: itemToUpdate.lactoseFree,
          glutenFree: itemToUpdate.glutenFree,
          popularity: menuItem?.popularity ?? 0,
        };

        // Add drinkId if provided and look up the drink name
        if (itemToUpdate.drinkId) {
          const drink = menuResult.Items?.find((item: any) => item.id === itemToUpdate.drinkId);
          newItem.drinkName = drink?.name || "Unknown Drink"; // Set the drink name, not ID
        }

        // If quantity is 0, don't add the item to the original items
        if (itemToUpdate.quantity === 0) {
          updatedItemsDetails.push(`Removed item: ${newItem.name}`);
          continue; // Skip adding it to the order
        }

        originalItems.push(newItem);

        const price = newItem.price ?? 0;
        totalPrice += price * newItem.quantity;
      }
    }

    const lactoseFreeMessage = items.some(item => item.lactoseFree) ? "Lactose-free selected." : "No lactose-free items selected.";
    const containsGlutenFree = items.some(item => item.glutenFree === true);
    const glutenFreeMessage = containsGlutenFree ? "Gluten-free selected." : "No gluten-free items selected.";

    const updatedOrder = {
      ...orderResult.Item,
      items: originalItems.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        lactoseFree: item.lactoseFree,
        glutenFree: item.glutenFree,
        description: item.description,
        ingredients: item.ingredients,
        ingredientsToAdd: item.ingredientsToAdd || [],
        ingredientsToRemove: item.ingredientsToRemove || [],
        itemMessage: item.ingredientsToAdd?.length || item.ingredientsToRemove?.length ? `Updated with changes` : `No changes`,
        drinkName: item.drinkName || undefined,  // Use undefined instead of null
      })),
      status: 'pending',
      customerName,
      customerPhone,
      lactoseFreeMessage,
      glutenFreeMessage,
      updatedAt: new Date().toISOString(),  // Adding updated timestamp
    };

    const updateParams = {
      TableName: 'OrdersTable',
      Item: updatedOrder,
    };

    await dynamoDb.put(updateParams).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Order updated successfully',
        updatedOrder: {
          ...updatedOrder,
          totalPrice,
          updatedAt: updatedOrder.updatedAt,  // Include updated timestamp in the response
        },
        details: updatedItemsDetails,
      }),
    };
  } catch (error) {
    console.error("Error updating order:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error updating order', error }),
    };
  }
};
