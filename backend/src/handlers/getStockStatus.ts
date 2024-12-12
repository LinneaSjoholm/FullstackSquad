import { db } from '../services/db';

export const getIngredientStock = async (ingredientId: string) => {
  try {
    const result = await db.get({
      TableName: 'IngredientsTable',
      Key: { id: ingredientId },
    });

    if (result.Item) {
      const stock = result.Item.stock.N;
      return stock; 
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching ingredient stock:', error);
    return null;
  }
};



export const getStockStatus = async (event: any): Promise<any> => {
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
