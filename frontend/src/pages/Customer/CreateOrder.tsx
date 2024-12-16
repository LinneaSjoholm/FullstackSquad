import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CartItem } from '../../interfaces/index';
import pastaImages from '../../interfaces/pastaImages';
import '../../styles/CreateOrder.css';

const CreateOrder: React.FC = () => {
  const location = useLocation();
  const { orderItems, totalPrice } = location.state || { orderItems: [], totalPrice: 0 };
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [updatedOrderItems, setUpdatedOrderItems] = useState<CartItem[]>(orderItems);
  const [updatedTotalPrice, setUpdatedTotalPrice] = useState<number>(totalPrice);
  const navigate = useNavigate();

  const handleAddItem = (item: CartItem) => {
    const updatedItems = updatedOrderItems.map((orderItem: CartItem) => {
      if (orderItem.id === item.id) {
        return { ...orderItem, quantity: orderItem.quantity + 1 };
      }
      return orderItem;
    });

    if (!updatedOrderItems.find((orderItem: CartItem) => orderItem.id === item.id)) {
      updatedItems.push({ ...item, quantity: 1 });
    }

    const newTotalPrice = updatedItems.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);
    setUpdatedOrderItems(updatedItems);
    setUpdatedTotalPrice(newTotalPrice);
  };

  const handleRemoveItem = (item: CartItem) => {
    const updatedItems = updatedOrderItems
      .map((orderItem: CartItem) => {
        if (orderItem.id === item.id) {
          return { ...orderItem, quantity: orderItem.quantity - 1 };
        }
        return orderItem;
      })
      .filter((orderItem: CartItem) => orderItem.quantity > 0);

    const newTotalPrice = updatedItems.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);
    setUpdatedOrderItems(updatedItems);
    setUpdatedTotalPrice(newTotalPrice);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!customerName || !customerPhone) {
      alert('Please enter your name and phone number');
      return;
    }

    const token = localStorage.getItem('jwtToken');
    const isGuest = !token; 
    const orderData = {
      customerName: customerName || localStorage.getItem('userName') || 'Guest',
      customerPhone: customerPhone || localStorage.getItem('userPhone') || '',
      items: updatedOrderItems,
      totalPrice: updatedTotalPrice,
      userId: token || 'guest',
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
        navigate('/review/order', {
          state: {
            customerName,
            customerPhone,
            orderItems: updatedOrderItems,
            totalPrice: updatedTotalPrice,
            orderId: data.orderId,
            isGuest, 
          },
        });
      } else {
        alert('Failed to place order: ' + data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while placing your order.');
    }
  };

  return (
    <div className="create-container">
      <div className="create-back-button-container">
        <button onClick={() => navigate('/menu')} className="create-back-button">
          &larr; Back To Menu
        </button>
      </div>

      <div className="create-menu-header">
        <h1>Your Order</h1>
      </div>

      <div className="create-items-container">
        {updatedOrderItems.map((item: CartItem) => (
          <div key={item.id} className="create-order-item">
            <div className="create-item-details">
              <img
                src={pastaImages[item.name] || ''}
                alt={item.name}
                className="create-item-image"
              />
              <div className="create-item-info">
                <h3>{item.name}</h3>
                <p>Quantity: <strong>{item.quantity}</strong></p>
                <p>Price: <strong>${item.price * item.quantity}</strong></p>
                <div className="create-item-actions">
                  <button onClick={() => handleRemoveItem(item)} className="create-remove-button">-</button>
                  <button onClick={() => handleAddItem(item)} className="create-add-button">+</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="create-form">
        <div className="create-input-group">
          <div className="create-name-input">
            <label htmlFor="customerName">Full Name:</label>
            <input
              type="text"
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
          </div>
          <div className="create-number-input">
            <label htmlFor="customerPhone">Phone Number:</label>
            <input
              type="tel"
              id="customerPhone"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="create-review-button">
          <button type="submit">Review order</button>
        </div>
      </form>
        </div>
      );
    };

export default CreateOrder;
