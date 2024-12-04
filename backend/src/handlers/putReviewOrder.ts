import { DocumentClient } from 'aws-sdk/clients/dynamodb';

const dynamoDb = new DocumentClient();

// API-nyckeln (kan hämtas från miljövariabler för att vara mer säker)
const API_KEY = process.env.API_KEY || 'your-default-api-key';

// Define interface for menu item
interface MenuItem {
  id: string;
  name: string;
  quantity: number;
  ingredients: string[];
  ingredientsToAdd?: string[];
  ingredientsToRemove?: string[];
  lactoseFree?: boolean;
  glutenFree?: boolean;
  description?: string;
  price?: number;
}

export const putReviewOrder = async (event: any) => {
  // Kontrollera om API-nyckeln finns i begäran
  const apiKey = event.headers['x-api-key'];
  if (!apiKey || apiKey !== API_KEY) {
    return {
      statusCode: 403, // Forbidden om nyckeln inte är rätt
      body: JSON.stringify({ message: 'Forbidden: Invalid API key' }),
    };
  }

  console.log("Received event:", JSON.stringify(event, null, 2));

  const orderId = event.pathParameters?.id;

  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Request body is missing' }),
    };
  }

  let items: { id: string; quantity: number; ingredientsToAdd: string[]; ingredientsToRemove: string[]; lactoseFree?: boolean; glutenFree?: boolean }[] = [];
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

  if (!orderId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Order ID is required' }),
    };
  }

  if (!customerName || !customerPhone) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Customer name and phone number are required' }),
    };
  }

  if (!items || !Array.isArray(items)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Items are required for review' }),
    };
  }

  const orderParams = {
    TableName: 'OrdersTable',
    Key: { orderId },
  };

  try {
    const orderResult = await dynamoDb.get(orderParams).promise();
    console.log("Fetched order:", JSON.stringify(orderResult, null, 2));

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

    // Loop through items to update
    for (const itemToUpdate of items) {
      console.log(`Processing item: ${itemToUpdate.id}`);
      itemToUpdate.ingredientsToAdd = itemToUpdate.ingredientsToAdd || [];
      itemToUpdate.ingredientsToRemove = itemToUpdate.ingredientsToRemove || [];

      const originalItemIndex = originalItems.findIndex((original: MenuItem) => original.id === itemToUpdate.id);

      if (originalItemIndex !== -1) {
        const originalItem = originalItems[originalItemIndex];

        // Ensure ingredients is always an array
        originalItem.ingredients = originalItem.ingredients || [];

        const addedIngredients = itemToUpdate.ingredientsToAdd || [];
        const removedIngredients = itemToUpdate.ingredientsToRemove || [];

        if (addedIngredients.length > 0) updatedItemsDetails.push(`Added ingredients: ${addedIngredients.join(', ')}`);
        if (removedIngredients.length > 0) updatedItemsDetails.push(`Removed ingredients: ${removedIngredients.join(', ')}`);

        originalItem.quantity = itemToUpdate.quantity || originalItem.quantity;
        const price = originalItem.price ?? 0;
        totalPrice += price * originalItem.quantity;

        originalItem.ingredients = [...new Set([...originalItem.ingredients, ...addedIngredients])];
        originalItem.ingredients = originalItem.ingredients.filter(ingredient => !removedIngredients.includes(ingredient));

        // Ensure lactoseFree and glutenFree are properly updated
        originalItem.lactoseFree = itemToUpdate.lactoseFree ?? originalItem.lactoseFree;
        originalItem.glutenFree = itemToUpdate.glutenFree ?? originalItem.glutenFree;

        // Add the changes for tracking
        originalItem.ingredientsToAdd = addedIngredients;
        originalItem.ingredientsToRemove = removedIngredients;

      } else {
        const menuItem = menuResult.Items?.find((item: any) => item.id === itemToUpdate.id);
        const newItem: MenuItem = {
          id: itemToUpdate.id,
          name: menuItem?.name || 'Unknown Item',
          quantity: itemToUpdate.quantity || 1,
          ingredients: itemToUpdate.ingredientsToAdd || [],
          ingredientsToAdd: itemToUpdate.ingredientsToAdd || [],
          ingredientsToRemove: [],
          description: menuItem?.description,
          price: menuItem?.price ?? 0,
          lactoseFree: itemToUpdate.lactoseFree,
          glutenFree: itemToUpdate.glutenFree,
        };

        originalItems.push(newItem);

        const price = newItem.price ?? 0;
        totalPrice += price * newItem.quantity;
      }
    }

    // Generate the lactose-free and gluten-free messages
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
        itemMessage: item.ingredientsToAdd?.length || item.ingredientsToRemove?.length ? `Updated with changes` : `No changes`
      })),
      status: 'pending',
      customerName,
      customerPhone,
      lactoseFreeMessage,
      glutenFreeMessage,
    };

    console.log("Updated order:", JSON.stringify(updatedOrder, null, 2));

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
