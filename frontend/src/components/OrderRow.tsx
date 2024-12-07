import React, { useState } from 'react';
import { lockOrder } from '../api/AdminOrderApi';

const OrderRow: React.FC<{ orderId: string }> = ({ orderId }) => {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleLockClick = async () => {
    setLoading(true);
    setStatusMessage(null); // Rensa tidigare meddelande
    try {
      await lockOrder(orderId);
      setStatusMessage('Order locked successfully!');
    } catch (error) {
      console.error('Error locking order:', error);
      setStatusMessage('Failed to lock the order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
      <h3>Order ID: {orderId}</h3>
      <button onClick={handleLockClick} disabled={loading}>
        {loading ? 'Locking...' : 'Lock Order'}
      </button>
      {statusMessage && <p>{statusMessage}</p>}
    </div>
  );
};

export default OrderRow;
