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
    <div className="cart">
      <h2>Your Order</h2>
      <ul>
        {orderItems.map((item) => (
          <li key={item.id}>
            {item.name} x {item.quantity} - ${item.price * item.quantity}
            <button onClick={() => removeFromOrder(item.id)} className="cart-remove-button">Remove</button>
          </li>
        ))}
      </ul>
      <h3>Total: ${calculateTotalPrice()}</h3>
      <button onClick={proceedToCheckout} className="cart-checkout-button">Proceed to Checkout</button>
    </div>
  );
};

export default Cart;
