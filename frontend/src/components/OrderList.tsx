import React, { useState, useEffect } from 'react';
import OrderRow from './OrderRow';

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Hämta ordrar från backend när komponenten laddas
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('https://8yanxxf6q0.execute-api.eu-north-1.amazonaws.com/admin/orders'); // Ange din API-URL
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch orders.');
        }

        setOrders(data); // Uppdatera state med ordrar
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
      } finally {
        setLoading(false); // Sluta ladda oavsett resultat
      }
    };

    fetchOrders();
  }, []);

  // Rendera laddningsmeddelande, fel eller ordrar
  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h3>Pending orders</h3>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <OrderRow key={order.orderId} orderId={order.orderId} /> // orderId hämtas dynamiskt
        ))
      )}
    </div>
  );
};

export default OrderList;
