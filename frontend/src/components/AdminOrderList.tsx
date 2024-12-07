import React, { useState, useEffect } from 'react';
import { lockOrder, adminGetOrders } from '../api/AdminOrderApi';  // Importera både lock och get funktionerna

const AdminOrderList: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await adminGetOrders();  // Hämtar orderdata
        if (response.statusCode === 200) {
          setOrders(response.body); // Sätt orderlistan i state
        } else {
          setError(response.body.message);  // Hantera eventuella fel
        }
      } catch (err) {
        setError('An error occurred while fetching orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();  // Anropar fetchOrders när komponenten laddas
  }, []);

  const handleLockOrder = async (orderId: string) => {
    try {
      await lockOrder(orderId);  // Låser den valda ordern
      setOrders((prevOrders) => 
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, locked: true } : order // Uppdaterar orderns status lokalt
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
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            <div>
              <span>{order.name}</span>
              {!order.locked && (
                <button onClick={() => handleLockOrder(order.id)}>Lock Order</button>
              )}
              {order.locked && <span>Order is locked</span>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminOrderList;
