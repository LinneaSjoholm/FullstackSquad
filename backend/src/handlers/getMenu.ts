import { db } from '../services/db';

export const getMenu = async (event: any): Promise<any> => {
  console.log('API_KEY in environment:', process.env.API_KEY);

  const apiKey = event.headers['x-api-key'];
  console.log('Received API key:', apiKey);

  if (apiKey !== process.env.API_KEY) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: 'Forbidden: Invalid API key' }),
    };
  }

  const queryStringParameters = event.queryStringParameters || {};
  const sortBy: string = queryStringParameters?.sortBy || 'id';  // Default sorting criterion
  const categoryFilter: string = queryStringParameters?.category || '';  // Filter by category
  const priceFilter: string | undefined = queryStringParameters?.price; // Filter by price if defined

  const params = {
    TableName: 'MenuTable',
  };

  try {
    const data = await db.scan(params);

    if (!data.Items || !Array.isArray(data.Items)) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'No items found in the menu.' }),
      };
    }

    // Filter by category if categoryFilter is defined
    let filteredItems = data.Items;
    if (categoryFilter) {
      filteredItems = filteredItems.filter((item: any) => item.category && item.category === categoryFilter);
    }

    // Filter by price if priceFilter is defined
    if (priceFilter) {
      const [minPrice, maxPrice] = priceFilter.split('-').map((price) => parseFloat(price));
      if (isNaN(minPrice) || isNaN(maxPrice)) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'Invalid price filter format. Use format minPrice-maxPrice (e.g. 10-20)' }),
        };
      }
      filteredItems = filteredItems.filter((item: any) => {
        const itemPrice = parseFloat(item.price);
        return itemPrice >= minPrice && itemPrice <= maxPrice;
      });
    }

    // Sort based on sortBy parameter
    let sortedItems = filteredItems;

    if (sortBy === 'price') {
      sortedItems = sortedItems.sort((a: any, b: any) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortBy === 'category') {
      sortedItems = sortedItems.sort((a: any, b: any) => a.category.localeCompare(b.category));
    } else if (sortBy === 'popularity') {
      // Sort by popularity in descending order (ensure popularity is treated as a number)
      sortedItems = sortedItems.sort((a: any, b: any) => {
        // Ensure popularity is a valid number
        const popA = Number(a.popularity) || 0; // If not a valid number, default to 0
        const popB = Number(b.popularity) || 0; // If not a valid number, default to 0
        return popB - popA; // Sort in descending order (more popular comes first)
      });
    } else if (sortBy === 'all') {
      // Sort alphabetically by name
      sortedItems = sortedItems.sort((a: any, b: any) => a.name.localeCompare(b.name));
    } else {
      sortedItems = sortedItems.sort((a: any, b: any) => a.id.localeCompare(b.id));
    }

    // Format prices with $ symbol
    sortedItems = sortedItems.map((item: any) => ({
      ...item,
      price: `$${parseFloat(item.price).toFixed(2)}`, // Add dollar sign and format price
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(sortedItems),
    };
  } catch (error: any) {
    console.error('Error fetching menu:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to fetch menu', error: error.message }),
    };
  }
};
