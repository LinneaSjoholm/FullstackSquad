import { db } from './db'; // Importera din DynamoDB-klient
import { Dish } from '../models/dish';
import { Ingredient } from '../models/ingredient';
import { getMenu } from '../handlers/getMenu';

// Funktion för att hämta lagerstatus för en ingrediens
const getStockForIngredient = async (ingredientId: string): Promise<number> => {
  const params = {
    TableName: 'IngredientsTable',
    Key: {
      id: ingredientId,
    },
  };

  const result = await db.get(params);  // Hämta ingrediensdata
  return result.Item ? parseInt(result.Item.stock.N) : 0;  // Returnera lagerstatus (eller 0 om inte finns)
};

// Funktion för att hämta lagerstatus för rätter
const getMenuWithStockStatus = async (event: any): Promise<any> => {
  // Hämta menyn från din existerande getMenu-funktion
  const menuResponse = await getMenu(event);

  // Om menyn inte hämtades korrekt, returnera fel
  if (menuResponse.statusCode !== 200) {
    return menuResponse; 
  }

  // Hämta rätterna och ingredienserna
  const dishesWithIngredients = JSON.parse(menuResponse.body);

  // Lägg till lagerstatus för ingredienser
  const dishesWithStock = await Promise.all(
    dishesWithIngredients.map(async (dish: any) => {
      const ingredientsWithStock = await Promise.all(
        dish.ingredients.map(async (ingredientId: string) => {
          const stock = await getStockForIngredient(ingredientId);
          return { id: ingredientId, stock };
        })
      );

      // Beräkna den totala lagerstatusen för rätten
      const totalStock = ingredientsWithStock.reduce((minStock, ingredient) => {
        return Math.min(minStock, ingredient.stock); // Hitta den begränsande ingrediensen
      }, Infinity);

      return { 
        ...dish, 
        ingredients: ingredientsWithStock,
        totalStock // Lägg till lagerstatus för rätten
      };
    })
  );

  return {
    statusCode: 200,
    body: JSON.stringify(dishesWithStock),
  };
};
