import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CartItem } from '../../interfaces/index';

const CreateOrder: React.FC = () => {
  const location = useLocation();
  const { orderItems, totalPrice } = location.state || { orderItems: [], totalPrice: 0 }; 
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Validate customer's details
    if (!customerName || !customerPhone) {
      alert('Please enter your name and phone number');
      return;
    }

    const orderData = {
      customerName,
      customerPhone,
      items: orderItems,
      totalPrice,
    };

    try {
      const response = await fetch('https://3uhcgg5udg.execute-api.eu-north-1.amazonaws.com/order', {
        method: 'POST',
        headers: {
          'x-api-key': 'bsQFNKDT2O4oIwmBc0FmN3KpwgIFc23L6lpdrrUT',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/review-order', { state: { customerName, customerPhone, orderItems, totalPrice, orderId: data.orderId } });
      } else {
        alert('Failed to place order: ' + data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while placing your order.');
    }
  };

  return (
    <div>
      <h1>Create Your Order</h1>
      <h2>Your Order Details</h2>
      <ul>
        {orderItems.map((item: CartItem) => (
          <li key={item.id}>
            {item.name} x {item.quantity} - ${item.price * item.quantity}
          </li>
        ))}
      </ul>
      <h3>Total Price: ${totalPrice}</h3>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="customerName">Your Name:</label>
          <input
            type="text"
            id="customerName"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="customerPhone">Your Phone Number:</label>
          <input
            type="tel"
            id="customerPhone"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            required
          />
        </div>
        <button type="submit">Place Order</button>
      </form>
    </div>
  );
};

export default CreateOrder;
