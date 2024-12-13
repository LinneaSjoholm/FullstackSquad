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

  // Lägg till en rätt (ökning av kvantitet)
  const handleAddItem = (item: CartItem) => {
    const updatedItems = updatedOrderItems.map((orderItem: CartItem) => {
      if (orderItem.id === item.id) {
        return { ...orderItem, quantity: orderItem.quantity + 1 };
      }
      return orderItem;
    });

    // Om artikeln inte finns, lägg till den
    if (!updatedOrderItems.find((orderItem: CartItem) => orderItem.id === item.id)) {
      updatedItems.push({ ...item, quantity: 1 });
    }

    const newTotalPrice = updatedItems.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);
    setUpdatedOrderItems(updatedItems);
    setUpdatedTotalPrice(newTotalPrice);
  };

  // Ta bort en rätt (minska kvantitet)
  const handleRemoveItem = (item: CartItem) => {
    const updatedItems = updatedOrderItems
      .map((orderItem: CartItem) => {
        if (orderItem.id === item.id) {
          // Minska kvantiteten
          return { ...orderItem, quantity: orderItem.quantity - 1 };
        }
        return orderItem;
      })
      .filter((orderItem: CartItem) => orderItem.quantity > 0); // Ta bort rätter med kvantitet <= 0

    const newTotalPrice = updatedItems.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);
    setUpdatedOrderItems(updatedItems);
    setUpdatedTotalPrice(newTotalPrice);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!customerName || !customerPhone) {
      alert("Please enter your name and phone number");
      return;
    }

    const token = localStorage.getItem("jwtToken"); // Hämta token om användaren är inloggad
    const orderData = {
      customerName: customerName || localStorage.getItem("userName") || "Guest",  // Använd användarnamn om inloggad, annars "Guest"
      customerPhone: customerPhone || localStorage.getItem("userPhone") || "",  // Hämta telefonnummer om tillgängligt
      items: updatedOrderItems,
      totalPrice: updatedTotalPrice,
      userId: token || "guest", // Skicka token om användaren är inloggad, annars "guest"
    };

    try {
      const response = await fetch("https://3uhcgg5udg.execute-api.eu-north-1.amazonaws.com/order", {
        method: "POST",
        headers: {
          "x-api-key": "bsQFNKDT2O4oIwmBc0FmN3KpwgIFc23L6lpdrrUT", // API-nyckel, kontrollera om den är korrekt
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (response.ok) {
        // Navigera till ordergranskning eller annan sida efter lyckad order
        navigate("/review/order", {
          state: {
            customerName,
            customerPhone,
            orderItems: updatedOrderItems,
            totalPrice: updatedTotalPrice,
            orderId: data.orderId,
          },
        });
      } else {
        alert("Failed to place order: " + data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while placing your order.");
    }
  };

  return (
    <div className="create-container">
      <div className="create-back-button-container">
        {/* Bakåt-knapp */}
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

                {/* Knapp för att lägga till eller ta bort */}
                <div className="create-item-actions">
                  <button onClick={() => handleRemoveItem(item)} className="create-remove-button">-</button>
                  <button onClick={() => handleAddItem(item)} className="create-add-button">+</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="create-item-info">
        <h2>Total Price: ${updatedTotalPrice}</h2>
      </div>

      <form onSubmit={handleSubmit} className="create-form">
        <div className='name-input'>
          <label htmlFor="customerName">Name:</label>
          <input
            type="text"
            id="customerName"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
        </div>
        <div className='number-input'>
          <label htmlFor="customerPhone">Number:</label>
          <input
            type="tel"
            id="customerPhone"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            required
          />
        </div>
      </form>
      <div className='review-button'>
        <button type="submit">Review order</button>
        </div>
    </div>
  );
};

export default CreateOrder;
