import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { Ingredient } from '../models/ingredient';

const client = new DynamoDB({
    region: process.env.AWS_REGION, 
  });
  
  const db = DynamoDBDocument.from(client);
  
export const initData = async (): Promise<void> => {
  const ingredients: Ingredient[] = [
    { id: 'ingredient1', name: 'Parmesan Cheese', stock: 10000, unit: 'g', dishNames: ['Creamy Alfredo', 'Arrabbiata Penne', 'Lemon Herb Chicken Pasta'] },
    { id: 'ingredient2', name: 'Cream', stock: 8000, unit: 'g', dishNames: ['Creamy Alfredo', 'Lemon Herb Chicken Pasta'] },
    { id: 'ingredient3', name: 'Garlic', stock: 5000, unit: 'g', dishNames: ['Creamy Alfredo', 'Lemon Herb Chicken Pasta', 'Ravioli Florentine'] },
    { id: 'ingredient4', name: 'Pasta', stock: 20000, unit: 'g', dishNames: ['Creamy Alfredo', 'Arrabbiata Penne', 'Garden Pesto Delight', 'Lemon Herb Chicken Pasta'] },
    { id: 'ingredient5', name: 'Tomato Sauce', stock: 7000, unit: 'g', dishNames: ['Arrabbiata Penne', 'Lasagna al Forno', 'Seafood Marinara'] },
    { id: 'ingredient6', name: 'Spinach', stock: 6000, unit: 'g', dishNames: ['Lemon Herb Chicken Pasta', 'Ravioli Florentine'] },
    { id: 'ingredient7', name: 'Basil', stock: 4000, unit: 'g', dishNames: ['Arrabbiata Penne', 'Garden Pesto Delight', 'Ravioli Florentine'] },
    { id: 'ingredient8', name: 'Beef Ragù', stock: 9000, unit: 'g', dishNames: ['Spaghetti Bolognese', 'Lasagna al Forno'] },
    { id: 'ingredient9', name: 'Shrimp', stock: 3000, unit: 'g', dishNames: ['Seafood Marinara'] },
    { id: 'ingredient10', name: 'Calamari', stock: 2500, unit: 'g', dishNames: ['Seafood Marinara'] },
    { id: 'ingredient11', name: 'Mussels', stock: 2000, unit: 'g', dishNames: ['Seafood Marinara'] },
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
