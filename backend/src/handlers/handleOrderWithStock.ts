import { postOrder } from './postOrder';
import { updateStock } from './updateStock';
import { OrderItem } from '../interfaces/orderItem'; 
import { Ingredient } from '../interfaces/ingredient';
import { db } from '../services/db';
import { getIngredientStock } from './getStockStatus';


export const getIngredientsFromDB = async (): Promise<Ingredient[]> => {
    const params = {
      TableName: 'IngredientsTable',
    };
  
    try {
      const data = await db.scan(params);
      return data.Items as Ingredient[];
    } catch (error) {
      throw error;
    }
  };

// Funktion för att sammanställa ingredienser från en order
const extractIngredientsForOrder = (items: OrderItem[], ingredients: Ingredient[]) => {
    const ingredientUsageList: { ingredientId: string, quantity: number }[] = [];
  
    items.forEach(item => {
      item.ingredients.forEach(ingredient => {
        // Hämta ingrediensen från ingredient-listan som finns i databasen (ingredients)
        const ingredientData = ingredients.find(i => i.id === ingredient.ingredientId);
        if (ingredientData) {
          const usagePerPortion = ingredientData.usagePerDish[item.name] || 0;
          const totalQuantity = usagePerPortion * item.quantity; 
  
          ingredientUsageList.push({
            ingredientId: ingredient.ingredientId,
            quantity: totalQuantity, 
          });
        }
      });
    });
  
    return ingredientUsageList;
  };
  

  export const handleOrderWithStock = async (event: any) => {
  
    try {
      // Posta ordern
      const postResponse = await postOrder(event);
  
      const orderDetails = JSON.parse(event.body);
      const { items } = orderDetails;
  
      // Hämta ingredienser från databasen
      const ingredients = await getIngredientsFromDB(); 
  
      // Sammanställ ingredienser och kvantiteter som ska uppdateras
      const ingredientUsageList = extractIngredientsForOrder(items, ingredients);
  
      // Uppdatera lagret med de beräknade mängderna
      await updateStock(ingredientUsageList);
  
      // Logga lagerstatusen efter uppdatering för varje ingrediens
      for (const ingredientUsage of ingredientUsageList) {
        const updatedStock = await getIngredientStock(ingredientUsage.ingredientId);
      }
  
      return postResponse; // Returnera svaret från `postOrder`
    } catch (error) {
      console.error("Error in handleOrderWithStock", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error processing order with stock update', error }),
      };
    }
  };
  
  

