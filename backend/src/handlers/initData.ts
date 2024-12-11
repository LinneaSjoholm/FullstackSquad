import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { Ingredient } from '../interfaces/ingredient';
import { db } from '../services/db';

export const initData = async (): Promise<void> => {
  const ingredients: Ingredient[] = [
    { 
      id: 'ingredient1', 
      name: 'Parmesan Cheese', 
      stock: 10, 
      unit: 'kg', 
      dishNames: ['Creamy Alfredo', 'Arrabbiata Penne', 'Lemon Herb Chicken Pasta'],
      usagePerDish: { 
        'Creamy Alfredo': 30, // 30g per portion
        'Arrabbiata Penne': 20, // 20g per portion
        'Lemon Herb Chicken Pasta': 25 // 25g per portion
      }
    },
    { 
      id: 'ingredient2', 
      name: 'Cream', 
      stock: 8, 
      unit: 'kg', 
      dishNames: ['Creamy Alfredo', 'Lemon Herb Chicken Pasta'],
      usagePerDish: { 
        'Creamy Alfredo': 50, // 50g per portion
        'Lemon Herb Chicken Pasta': 40 // 40g per portion
      }
    },
    { 
      id: 'ingredient3', 
      name: 'Garlic', 
      stock: 5, 
      unit: 'kg', 
      dishNames: ['Creamy Alfredo', 'Lemon Herb Chicken Pasta', 'Ravioli Florentine'],
      usagePerDish: { 
        'Creamy Alfredo': 10, // 10g per portion
        'Lemon Herb Chicken Pasta': 10, // 10g per portion
        'Ravioli Florentine': 12 // 12g per portion
      }
    },
    { 
      id: 'ingredient4', 
      name: 'Pasta', 
      stock: 2, 
      unit: 'kg', 
      dishNames: ['Creamy Alfredo', 'Arrabbiata Penne', 'Garden Pesto Delight', 'Lemon Herb Chicken Pasta'],
      usagePerDish: { 
        'Creamy Alfredo': 150, // 150g per portion
        'Arrabbiata Penne': 200, // 200g per portion
        'Garden Pesto Delight': 180, // 180g per portion
        'Lemon Herb Chicken Pasta': 160 // 160g per portion
      }
    },
    { 
      id: 'ingredient5', 
      name: 'Tomato Sauce', 
      stock: 7, 
      unit: 'kg', 
      dishNames: ['Arrabbiata Penne', 'Lasagna al Forno', 'Seafood Marinara'],
      usagePerDish: { 
        'Arrabbiata Penne': 100, // 100g per portion
        'Lasagna al Forno': 120, // 120g per portion
        'Seafood Marinara': 80 // 80g per portion
      }
    },
    { 
      id: 'ingredient6', 
      name: 'Spinach', 
      stock: 6, 
      unit: 'kg', 
      dishNames: ['Lemon Herb Chicken Pasta', 'Ravioli Florentine'],
      usagePerDish: { 
        'Lemon Herb Chicken Pasta': 50, // 50g per portion
        'Ravioli Florentine': 60 // 60g per portion
      }
    },
    { 
      id: 'ingredient7', 
      name: 'Basil', 
      stock: 4, 
      unit: 'kg', 
      dishNames: ['Arrabbiata Penne', 'Garden Pesto Delight', 'Ravioli Florentine'],
      usagePerDish: { 
        'Arrabbiata Penne': 5, // 5g per portion
        'Garden Pesto Delight': 5, // 5g per portion
        'Ravioli Florentine': 6 // 6g per portion
      }
    },
    { 
      id: 'ingredient8', 
      name: 'Beef Ragù', 
      stock: 9, 
      unit: 'kg', 
      dishNames: ['Spaghetti Bolognese', 'Lasagna al Forno'],
      usagePerDish: { 
        'Spaghetti Bolognese': 150, // 150g per portion
        'Lasagna al Forno': 200 // 200g per portion
      }
    },
    { 
      id: 'ingredient9', 
      name: 'Shrimp', 
      stock: 3, 
      unit: 'kg', 
      dishNames: ['Seafood Marinara'],
      usagePerDish: { 
        'Seafood Marinara': 100 // 100g per portion
      }
    },
    { 
      id: 'ingredient10', 
      name: 'Calamari', 
      stock: 25, 
      unit: 'kg', 
      dishNames: ['Seafood Marinara'],
      usagePerDish: { 
        'Seafood Marinara': 120 // 120g per portion
      }
    },
    { 
      id: 'ingredient11', 
      name: 'Mussels', 
      stock: 2, 
      unit: 'kg', 
      dishNames: ['Seafood Marinara'],
      usagePerDish: { 
        'Seafood Marinara': 150 // 150g per portion
      }
    },
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
