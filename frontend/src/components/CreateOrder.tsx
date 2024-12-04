import React from 'react';
import { CartItem } from '../App';
import { useNavigate } from 'react-router-dom';

interface CreateOrderProps {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  removeFromCart: (itemId: string) => void;
}

const CreateOrder: React.FC<CreateOrderProps> = ({ cart, setCart, removeFromCart }) => {
  const navigate = useNavigate(); // Hook för navigation

  // Uppdatera kvantitet eller ta bort från varukorgen om kvantiteten är 0
  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId); // Om kvantiteten blir 0, ta bort objektet från varukorgen
    } else {
      const updatedCart = cart.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      );
      setCart(updatedCart);
    }
  };

  // Beräkna totalpriset
  const calculateTotalPrice = () => {
    return cart.reduce(
      (total, item) => total + parseFloat(item.price.replace('$', '')) * item.quantity,
      0
    ).toFixed(2);
  };

  return (
    <div>
      {/* Tillbaka-knapp */}
      <button onClick={() => navigate('/menu')}>Back to Menu</button>

      <h3>Your Cart:</h3>
      {cart.length > 0 ? (
        <ul>
          {cart.map((item) => (
            <li key={item.id}>
              {item.name} - {item.quantity} x {item.price}
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Your cart is empty.</p>
      )}
      <h4>Total Price: ${calculateTotalPrice()}</h4>

      <button
        onClick={() => {
          if (cart.length === 0) {
            alert('Your cart is empty.');
          } else {
            // Navigate to review order
            navigate('/review-order');
          }
        }}
      >
        Review Order
      </button>
    </div>
  );
};

export default CreateOrder;
