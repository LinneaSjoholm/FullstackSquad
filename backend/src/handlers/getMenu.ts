import { DynamoDBItem, MenuItem } from '../interfaces';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

const dynamoDb = new DocumentClient();

export const getMenu = async (event: any) => {
  const apiKey = event.headers['x-api-key'];
  const sortBy = event.queryStringParameters?.sortBy || 'popularity'; // Sorteringsparameter från användaren

  if (apiKey !== process.env.API_KEY) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: 'Forbidden: Invalid API key' }),
    };
  }

  const params = {
    TableName: 'MenuTable',
  };

  try {
    const result = await dynamoDb.scan(params).promise();

    if (!result.Items || result.Items.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'No menu items found' }),
      };
    }

    // Sorteringsfunktion
    const sortMenuItems = (items: MenuItem[], sortBy: 'popularity' | 'price' | 'name') => {
      return items.sort((a, b) => {
        if (sortBy === 'popularity') {
          return (b.popularity || 0) - (a.popularity || 0);
        } else if (sortBy === 'price') {
          return a.price - b.price;
        } else {
          return a.name.localeCompare(b.name);
        }
      });
    };

    // Gruppera menyn per kategori
    const menuGroupedByCategory = result.Items.reduce((acc, item) => {
      const dbItem = item as DynamoDBItem;
      const { category, id, description, ...filteredItem } = dbItem;
      const itemCategory = category || "Others";

      const reorderedItem: MenuItem = {
        id: dbItem.id,               // Lägg till id
        quantity: dbItem.quantity || 1,  // Lägg till quantity (om den inte finns, sätt ett defaultvärde)
        name: filteredItem.name,
        price: filteredItem.price,
        ingredients: filteredItem.ingredients,
        lactoseFree: filteredItem.lactoseFree,
        glutenFree: filteredItem.glutenFree,
        popularity: filteredItem.popularity,
        description: dbItem.description || '',  // Lägg till description
      };
      

      if (!acc[itemCategory]) {
        acc[itemCategory] = [];
      }

      acc[itemCategory].push(reorderedItem);
      return acc;
    }, {} as { [key: string]: MenuItem[] });

    // Sortera per användarens val av sorteringsparameter
    for (const category in menuGroupedByCategory) {
      menuGroupedByCategory[category] = sortMenuItems(menuGroupedByCategory[category], sortBy);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ menu: menuGroupedByCategory }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error fetching menu', error }),
    };
  }
};
