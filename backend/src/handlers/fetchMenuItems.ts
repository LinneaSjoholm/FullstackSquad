import { DynamoDBItem, MenuItem } from '../interfaces';
import { db } from '../services/db'; // DynamoDB-klienten

// Funktion för att hämta menyobjekt som en array av MenuItem
export const fetchMenuItems = async (): Promise<MenuItem[]> => {
  const params = {
    TableName: 'MenuTable',
  };

  try {
    const result = await db.scan(params);

    if (!result.Items || result.Items.length === 0) {
      throw new Error('No menu items found');
    }

    // Mappa DynamoDB-objekt till MenuItem
    const menuItems = result.Items.map((item) => {
      const dbItem = item as DynamoDBItem;

      return {
        id: dbItem.id,
        name: dbItem.name,
        price: dbItem.price,
        quantity: dbItem.quantity || 1,
        ingredients: dbItem.ingredients || [],
        lactoseFree: dbItem.lactoseFree,
        glutenFree: dbItem.glutenFree,
        popularity: dbItem.popularity,
        description: dbItem.description || '',
        drinkId: dbItem.drinkId,
        drinkName: dbItem.drinkName,
      } as MenuItem;
    });

    return menuItems;
  } catch (error) {
    console.error('Error fetching menu items:', error);
    throw error;
  }
};
