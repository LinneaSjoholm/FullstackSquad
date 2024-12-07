// Define an interface for a menu item
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  ingredients: string[];
  lactoseFree: boolean;
  glutenFree: boolean;
  category?: string;
  popularity?: number;
  updatedAt?: string;
}

// Define an interface for an order item
export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  ingredients: string[];

}

// Define an interface for a cart item (extends OrderItem and adds ingredients)
export interface CartItem extends OrderItem {
  basePrice: any;
  ingredientsToAdd?: string[];
  ingredientsToRemove?: string[];
  drinkId?: string;
  drinkName?: string;  // Add this field
  lactoseFree?: boolean;
  glutenFree?: boolean;
  description?: string; // Add this field
  id: string;
  name: string;
  quantity: number;
  price: number;
}


// Define an interface for a customer order
export interface CustomerOrder {
  orderId: string;
  items: OrderItem[];
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'canceled';  // Order status
}

// Ingredient interface for ingredient details
export interface Ingredient {
  name: string;
  description?: string;
  allergens?: string[];  // Possible allergens in the ingredient
}

