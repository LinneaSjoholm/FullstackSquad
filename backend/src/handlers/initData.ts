import { DynamoDB } from 'aws-sdk';
import { Ingredient } from '../models/ingredient';
import { Dish } from '../models/dish';

// Skapa DynamoDB klient
const dynamoDb = new DynamoDB.DocumentClient();

export const initData = async (): Promise<void> => {
  // Lägg till ingredienser
  const ingredients: Ingredient[] = [

  ];

  // Lägg till menyrätter
  const dishes: Dish[] = [

  ];

  // Lägg till ingredienser i DynamoDB
  const ingredientPromises = ingredients.map(ingredient => {
    const params = {
      TableName: 'IngredientsTable',
      Item: ingredient
    };
    return dynamoDb.put(params).promise();
  });

  // Lägg till rätter i DynamoDB
  const dishPromises = dishes.map(dish => {
    const params = {
      TableName: 'MenuTable',
      Item: dish
    };
    return dynamoDb.put(params).promise();
  });

  try {
    await Promise.all([...ingredientPromises, ...dishPromises]);
    console.log("Ingredients and dishes have been added to DynamoDB.");
  } catch (error) {
    console.error("Error inserting data", error);
  }
};
