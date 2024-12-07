import React, { useState, useEffect } from 'react';
import { lockOrder, adminGetOrders } from '../api/AdminOrderApi';  

const AdminOrderList: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await adminGetOrders();  
        if (response.statusCode === 200) {
          setOrders(response.body); 
        } else {
          setError(response.body.message);  
        }
      } catch (err) {
        setError('An error occurred while fetching orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();  
  }, []);

  const handleLockOrder = async (orderId: string) => {
    try {
      await lockOrder(orderId);  
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, locked: true } : order 
        )
      );
    } catch (error) {
      console.error('Error locking order:', error);
      alert('Failed to lock order.');
    }
  };

  return (
    <div>
      <h1>Admin Order List</h1>
      {loading && <p>Loading orders...</p>}
      {error && <p>{error}</p>}
      <h2>New Orders</h2>
      <ul>
        {orders.filter(order => !order.locked).map((order) => (
          <li key={order.id}>
            <div>
              <span>{order.name}</span>
              {!order.locked && (
                <button onClick={() => handleLockOrder(order.id)}>Lock Order</button>
              )}
            </div>
          </li>
        ))}
      </ul>

      <h2>Locked Orders</h2>
      <ul>
        {orders.filter(order => order.locked).map((order) => (
          <li key={order.id}>
            <div>
              <span>{order.name}</span>
              <span>Order is locked</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminOrderList;

