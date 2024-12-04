import React, { useState } from 'react';
import { CartItem } from '../App';
import { useNavigate } from 'react-router-dom';

interface ReviewOrderProps {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  removeFromCart: (itemId: string) => void;
}

const ReviewOrder: React.FC<ReviewOrderProps> = ({ cart, setCart, removeFromCart }) => {
  const navigate = useNavigate(); // Hook for navigation
  const [lactoseFree, setLactoseFree] = useState<boolean>(false);
  const [glutenFree, setGlutenFree] = useState<boolean>(false);
  const [drink, setDrink] = useState<string>('');
  const [ingredientsToAdd, setIngredientsToAdd] = useState<{ [key: string]: string[] }>({});
  const [ingredientsToRemove, setIngredientsToRemove] = useState<{ [key: string]: string[] }>({});

  // Update quantity or remove item from cart
  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId); // If quantity is 0, remove the item
    } else {
      const updatedCart = cart.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      );
      setCart(updatedCart);
    }
  };

  // Handle ingredient changes
  const handleIngredientChange = (itemId: string, ingredient: string, action: 'add' | 'remove') => {
    const updatedIngredients = action === 'add' 
      ? [...(ingredientsToAdd[itemId] || []), ingredient]
      : (ingredientsToAdd[itemId] || []).filter(ing => ing !== ingredient);

    setIngredientsToAdd(prev => ({ ...prev, [itemId]: updatedIngredients }));
  };

  // Handle lactose and gluten preferences
  const handlePreferenceChange = (preference: 'lactoseFree' | 'glutenFree', value: boolean) => {
    if (preference === 'lactoseFree') {
      setLactoseFree(value);
    } else if (preference === 'glutenFree') {
      setGlutenFree(value);
    }
  };

  // Handle drink selection
  const handleDrinkSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDrink(event.target.value);
  };

  // Calculate total price of the cart
  const calculateTotalPrice = () => {
    return cart.reduce(
      (total, item) => total + parseFloat(item.price) * item.quantity,
      0
    ).toFixed(2);
  };

  // Handle final order submission
  const handleSubmitOrder = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty. Cannot submit the order.');
      return;
    }

    // Prepare the order data to send to the backend
    const orderData = {
      items: cart.map(item => ({
        id: item.id,
        quantity: item.quantity,
        ingredientsToAdd: ingredientsToAdd[item.id] || [],
        ingredientsToRemove: ingredientsToRemove[item.id] || [],
        lactoseFree,
        glutenFree,
      })),
      customerName: 'John Doe', // You might want to replace with an actual customer name input
      customerPhone: '1234567890', // You might want to replace with an actual customer phone input
      drink,
    };

    try {
      const response = await fetch('/api/put-review-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Order submitted successfully:', data);
        navigate('/thank-you'); // Navigate to a thank you page
      } else {
        console.error('Error submitting order:', data);
        alert('Error submitting order');
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Error submitting order');
    }
  };

  return (
    <div>
      <button onClick={() => navigate('/menu')}>Back to Menu</button>
      <h3>Your Order:</h3>
      {cart.length > 0 ? (
        <ul>
          {cart.map((item) => (
            <li key={item.id}>
              <div>
                <p>{item.name} - {item.quantity} x {item.price}</p>
                <p>Ingredients: {item.description}</p>
                <div>
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  <button onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>

                <div>
                  <h4>Modify Ingredients:</h4>
                  <button onClick={() => handleIngredientChange(item.id, 'Lettuce', 'add')}>Add Lettuce</button>
                  <button onClick={() => handleIngredientChange(item.id, 'Lettuce', 'remove')}>Remove Lettuce</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Your cart is empty.</p>
      )}

      <div>
        <h4>Select Drink:</h4>
        <select onChange={handleDrinkSelection}>
          <option value="">Select a drink</option>
          <option value="Coke">Coke</option>
          <option value="Water">Water</option>
          <option value="Juice">Juice</option>
        </select>
      </div>

      <div>
        <h4>Preferences:</h4>
        <label>
          <input type="checkbox" checked={lactoseFree} onChange={() => handlePreferenceChange('lactoseFree', !lactoseFree)} />
          Lactose-Free
        </label>
        <label>
          <input type="checkbox" checked={glutenFree} onChange={() => handlePreferenceChange('glutenFree', !glutenFree)} />
          Gluten-Free
        </label>
      </div>

      <h4>Total Price: ${calculateTotalPrice()}</h4>

      <button onClick={handleSubmitOrder}>Submit Order</button>
    </div>
  );
};

export default ReviewOrder;
