// Definiera en typ för alla fält som vi får från DynamoDB
export interface DynamoDBItem {
  quantity: number;
  id: string;
  name: string;
  price: number;
  popularity: number;
  lactoseFree: boolean;
  glutenFree: boolean;
  category: string;
  ingredients: string[];
  description: string;
  drinkId?: string;  
}
  
  // Definiera en typ för varje menyobjekt som vi skickar till användaren
  export interface MenuItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  ingredients: string[];
  ingredientsToAdd?: string[];
  ingredientsToRemove?: string[];
  lactoseFree?: boolean;
  glutenFree?: boolean;
  popularity: number;
  description: string;
  drinkId?: string; 
}
