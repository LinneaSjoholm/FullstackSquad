import React from 'react';
import { OrderItem } from '../interfaces/index';  // Add this import for OrderItem
import { useNavigate } from 'react-router-dom';
import '../styles/Cart.css';

interface CartProps {
  orderItems: OrderItem[];
  calculateTotalPrice: () => number;
  removeFromOrder: (itemId: string) => void;
}

const Cart: React.FC<CartProps> = ({ orderItems, calculateTotalPrice, removeFromOrder }) => {
  const navigate = useNavigate();

  const proceedToCheckout = () => {
    navigate('/createOrder', { state: { orderItems, totalPrice: calculateTotalPrice() } });
  };

  return (
    <div style={cartStyles}>
      <h2>Your Order</h2>
      <ul>
        {orderItems.map((item) => (
          <li key={item.id}>
            {item.name} x {item.quantity} - ${item.price * item.quantity}
            <button onClick={() => removeFromOrder(item.id)} style={removeButtonStyles}>Remove</button>
          </li>
        ))}
      </ul>
      <h3>Total: ${calculateTotalPrice()}</h3>
      <button onClick={proceedToCheckout} style={checkoutButtonStyles}>Proceed to Checkout</button>
    </div>
  );
};

const cartStyles: React.CSSProperties = {
  position: 'fixed',
  top: '30rem',
  right: '20px',
  width: '300px',
  padding: '20px',
  backgroundColor: 'black',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  zIndex: 1000,
};

const removeButtonStyles: React.CSSProperties = {
  marginLeft: '10px',
  backgroundColor: '#0881A3',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  padding: '5px 10px',
};

const checkoutButtonStyles: React.CSSProperties = {
  marginTop: '10px',
  backgroundColor: '#0881A3',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  padding: '10px 20px',
  width: '100%',
};

export default Cart;
