import React, { useState, useEffect } from 'react';
import { lockOrder, adminGetOrders } from '../api/AdminOrderApi';  

const AdminOrderList: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);  // För att hålla ordrarna
  const [loading, setLoading] = useState<boolean>(false);  // Laddningstillstånd
  const [error, setError] = useState<string | null>(null);  // Felmeddelanden

  // Hämtar alla ordrar när komponenten laddas
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await adminGetOrders();  // Hämtar ordrar från API
        if (response.statusCode === 200) {
          setOrders(response.body);  // Sätt ordrarna om hämtningen är framgångsrik
        } else {
          setError(response.body.message);  // Om det är något fel, sätt felmeddelande
        }
      } catch (err) {
        setError('An error occurred while fetching orders.');  // Fångar eventuella fel
      } finally {
        setLoading(false);  // Slå av laddningstilstånd
      }
    };

    fetchOrders();  
  }, []);

  // Hanterar att låsa en order (skickar en POST-förfrågan till backend)
  const handleLockOrder = async (orderId: string) => {
    try {
      await lockOrder(orderId);  // Låser ordern via API
      // Optimistisk uppdatering av UI:t
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === orderId ? { ...order, locked: true } : order  // Uppdatera den låsta ordern lokalt
        )
      );
    } catch (error) {
      console.error('Error locking order:', error);
      alert('Failed to lock order.');
    }
  };

  if (loading) return <p>Loading orders...</p>;  // Visa laddningstext medan ordrarna hämtas
  if (error) return <p>{error}</p>;  // Visa felmeddelande om något gick fel

  // Filtrera ordrar i nya och låsta
  const newOrders = orders.filter((order) => !order.locked).map((order) => ({
    orderId: order.orderId,
    dishName: order.items?.[0]?.name || 'Dish not specified',  // Namn på maträtt
    messageToChef: order.messageToChef || 'No message provided',  // Meddelande till kocken
    locked: order.locked,
  }));

  const lockedOrders = orders.filter((order) => order.locked).map((order) => ({
    orderId: order.orderId,
    dishName: order.items?.[0]?.name || 'Dish not specified',
    messageToChef: order.messageToChef || 'No message provided',
    locked: order.locked,
  }));

  return (
    <div>
      <h1>Admin Order List</h1>

      <h2>New Orders</h2>
      {newOrders.length === 0 ? (
        <p>No new orders.</p>
      ) : (
        newOrders.map((order, index) => (
          <div key={order.orderId}>
            <div>
              <span>{index + 1}. Order ID: {order.orderId}</span> - <span>{order.dishName}</span> - <span>{order.messageToChef}</span>
              <button onClick={() => handleLockOrder(order.orderId)}>Lock Order</button>
            </div>
          </div>
        ))
      )}

      <h2>Locked Orders</h2>
      {lockedOrders.length === 0 ? (
        <p>No locked orders.</p>
      ) : (
        lockedOrders.map((order, index) => (
          <div key={order.orderId}>
            <div>
              <span>{index + 1}. Order ID: {order.orderId}</span> - <span>{order.dishName}</span> - <span>{order.messageToChef}</span>
              <span>Order is locked</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminOrderList;
