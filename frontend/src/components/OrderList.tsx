import React, { useState, useEffect } from 'react';
import OrderRow from './OrderRow';

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('https://8yanxxf6q0.execute-api.eu-north-1.amazonaws.com/admin/orders'); 
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch orders.');
        }

        setOrders(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
      } finally {
        setLoading(false); 
      }
    };

    fetchOrders();
  }, []);

  
  const newOrders = orders.filter((order) => !order.locked);
  const lockedOrders = orders.filter((order) => order.locked);

  const handleLockOrder = (orderId: string) => {
    
    console.log('Locking order', orderId);
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.orderId === orderId ? { ...order, locked: true } : order 
      )
    );
  };

  
  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h3>New Orders</h3>
      {newOrders.length === 0 ? (
        <p>No new orders found.</p>
      ) : (
        newOrders.map((order) => (
          <OrderRow key={order.orderId} orderId={order.orderId} onLock={handleLockOrder} />
        ))
      )}

      <h3>Locked Orders</h3>
      {lockedOrders.length === 0 ? (
        <p>No locked orders found.</p>
      ) : (
        lockedOrders.map((order) => (
          <OrderRow key={order.orderId} orderId={order.orderId} locked />
        ))
      )}
    </div>
  );
};

export default OrderList;

