// Skapa ett nytt interface för orderobjekt
export interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    ingredients: { 
      ingredientId: string; 
      gramsPerPortion: number; 
    }[];
    lactoseFree?: boolean;
    glutenFree?: boolean;
    popularity: number;
    description: string;
    drinkId?: string; 
    drinkName?: string; 
  }
  