import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { Ingredient } from '../models/ingredient';

const client = new DynamoDB({
    region: process.env.AWS_REGION, 
  });
  
  // Skapa och exportera en instans av DynamoDBDocument
  const db = DynamoDBDocument.from(client);
  
export const initData = async (): Promise<void> => {
  // Ingredienser med lagerstatus (kg) och koppling till rätter
  const ingredients: Ingredient[] = [
    { id: 'ingredient1', name: 'Parmesan Cheese', stock: 10, unit: 'kg', dishIds: ['dish1', 'dish2', 'dish4'] },
    { id: 'ingredient2', name: 'Cream', stock: 8, unit: 'kg', dishIds: ['dish1', 'dish5'] },
    { id: 'ingredient3', name: 'Garlic', stock: 5, unit: 'kg', dishIds: ['dish1', 'dish5', 'dish9'] },
    { id: 'ingredient4', name: 'Pasta', stock: 20, unit: 'kg', dishIds: ['dish1', 'dish2', 'dish3', 'dish6'] },
    { id: 'ingredient5', name: 'Tomato Sauce', stock: 7, unit: 'kg', dishIds: ['dish2', 'dish4', 'dish7', 'dish8'] },
    { id: 'ingredient6', name: 'Spinach', stock: 6, unit: 'kg', dishIds: ['dish3', 'dish6'] },
    { id: 'ingredient7', name: 'Basil', stock: 4, unit: 'kg', dishIds: ['dish2', 'dish3', 'dish6'] },
    { id: 'ingredient8', name: 'Beef Ragù', stock: 9, unit: 'kg', dishIds: ['dish4', 'dish7'] },
    { id: 'ingredient9', name: 'Shrimp', stock: 3, unit: 'kg', dishIds: ['dish9'] },
    { id: 'ingredient10', name: 'Calamari', stock: 2.5, unit: 'kg', dishIds: ['dish9'] },
    { id: 'ingredient11', name: 'Mussels', stock: 2, unit: 'kg', dishIds: ['dish9'] },
  ];

  // Lägg till ingredienser i DynamoDB
  const ingredientPromises = ingredients.map(ingredient => {
    const params = {
      TableName: 'IngredientsTable',
      Item: ingredient,
    };
    return db.put(params);
  });

  try {
    await Promise.all(ingredientPromises);
    console.log("Ingredients have been added to DynamoDB.");
  } catch (error) {
    console.error("Error inserting ingredients into DynamoDB", error);
  }
};
