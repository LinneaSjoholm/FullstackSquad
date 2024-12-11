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
  drinkId?: string;
  image?: string | null; 
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
  drinkName?: string;  
  lactoseFree?: boolean;
  glutenFree?: boolean;
  description?: string; 
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
  status: 'pending' | 'confirmed' | 'canceled'; 
}

// Ingredient interface for ingredient details
export interface Ingredient {
  name: string;
  description?: string;
  allergens?: string[];  
}

const handleSave = async (
  itemId: string,
  updatedPrice: number,
  updatedDescription: string,
  updatedIngredients: string[],
  updatedImage: string
) => {
  updatedImage = updatedImage || '';  

};
interface OrderData {
  customerName: string;
  customerPhone: string; 
  items: any[];  
  totalPrice: number;
  orderId: string;
}

interface PaymentOverlayProps {
  order: {
    totalPrice: number;
    customerName: string;
    customerPhone: string;
    items: CartItem[];
  };
  onClose: () => void;
  onOrder: () => void;
}
