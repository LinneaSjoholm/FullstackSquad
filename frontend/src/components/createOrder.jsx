import React, { useState } from 'react';

const createOrder = ({ cart, onPlaceOrder }) => {
  const [orderDetails, setOrderDetails] = useState({
    name: '',
    customerName: '',
    customerPhone: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleOrderSubmit = async () => {
    if (!orderDetails.name || !orderDetails.customerName || !orderDetails.customerPhone) {
      alert('Please fill in all details.');
      return;
    }

    // Send cart items along with order details to the backend
    try {
      const response = await fetch('https://your-api-url.com/createOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'your-api-key-here',
        },
        body: JSON.stringify({
          ...orderDetails,
          items: cart,  // Include cart items in the order
        }),
      });

      if (response.ok) {
        alert('Order placed successfully!');
        onPlaceOrder();  // Reset cart after successful order
      } else {
        alert('Failed to place order.');
      }
    } catch (err) {
      console.error('Error placing order:', err);
      alert('An error occurred while placing the order.');
    }
  };

  return (
    <div>
      <h3>Create Order</h3>
      <div>
        <label>
          Order Name:
          <input
            type="text"
            name="name"
            value={orderDetails.name}
            onChange={handleInputChange}
          />
        </label>
      </div>
      <div>
        <label>
          Customer Name:
          <input
            type="text"
            name="customerName"
            value={orderDetails.customerName}
            onChange={handleInputChange}
          />
        </label>
      </div>
      <div>
        <label>
          Customer Phone:
          <input
            type="text"
            name="customerPhone"
            value={orderDetails.customerPhone}
            onChange={handleInputChange}
          />
        </label>
      </div>
      <button onClick={handleOrderSubmit}>Place Order</button>
    </div>
  );
};

export default createOrder;
