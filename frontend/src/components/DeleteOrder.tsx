import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/DeleteOrder.css';


const DeleteOrder: React.FC<{ orderId: string }> = ({ orderId }) => {
  const [isOrderCanceled, setIsOrderCanceled] = useState(false);
  const navigate = useNavigate();

  const cancelOrder = async () => {
    try {
      const response = await fetch(`https://3uhcgg5udg.execute-api.eu-north-1.amazonaws.com/order/delete/${orderId}`, {
        method: 'DELETE',
        headers: {
          'x-api-key': 'bsQFNKDT2O4oIwmBc0FmN3KpwgIFc23L6lpdrrUT',
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok) {
        setIsOrderCanceled(true);
        alert('Order has been canceled.');
        navigate('/menu');  // Redirect to the menu after order cancellation
      } else {
        alert('Failed to cancel order: ' + data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while canceling the order.');
    }
  };

  if (isOrderCanceled) {
    return (
      <div className="delete-order-container">
        <div className="delete-order-message">
          <h2>Your order has been successfully canceled.</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="delete-order-container">
      <div className="delete-order-message">
        <h2>Are you sure you want to cancel your order?</h2>
        <button onClick={cancelOrder} className="Delete-order-button">Cancel Order</button>
      </div>
      </div>
  );
};

export default DeleteOrder;
