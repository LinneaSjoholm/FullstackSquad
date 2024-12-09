import React, { useState, useEffect } from 'react';
import { lockOrder, adminGetOrders, updateOrder } from '../api/AdminOrderApi';

const AdminOrderList: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // For managing popup modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<string>('');
  const [commentToChef, setCommentToChef] = useState<string>(''); // New state for comment

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
          order.orderId === orderId ? { ...order, locked: true } : order
        )
      );
    } catch (error) {
      console.error('Error locking order:', error);
      alert('Failed to lock order.');
    }
  };

  const handleUpdateOrder = async () => {
    if (selectedOrderId && newStatus) {
      try {
        // Include comment in the update request
        await updateOrder(selectedOrderId, newStatus, commentToChef);
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderId === selectedOrderId
              ? { ...order, status: newStatus, messageToChef: commentToChef } // Update status and comment
              : order
          )
        );
        alert('Order updated successfully!');
        setIsModalOpen(false); // Close the modal after successful update
      } catch (error) {
        console.error('Error updating order:', error);
        alert('Failed to update order.');
      }
    } else {
      alert('Please provide a valid status');
    }
  };

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>{error}</p>;

  const newOrders = orders.filter((order) => !order.locked);
  const lockedOrders = orders.filter((order) => order.locked);

  return (
    <div>
      <h2>New Orders</h2>
      {newOrders.length === 0 ? (
        <p>No new orders.</p>
      ) : (
        newOrders.map((order, index) => (
          <div key={order.orderId}>
            <div>
              <span>{index + 1}. Order ID: {order.orderId}</span> - <span>{order.dishName}</span> - <span>{order.messageToChef}</span> - <span>{order.status}</span>
              <button onClick={() => handleLockOrder(order.orderId)}>Lock Order</button>
              <button onClick={() => {
                setSelectedOrderId(order.orderId);
                setNewStatus(order.status || ''); // pre-fill the current status
                setCommentToChef(order.messageToChef || ''); // pre-fill the current comment
                setIsModalOpen(true);
              }}>
                Update Order
              </button>
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
              <span>{index + 1}. Order ID: {order.orderId}</span> - <span>{order.dishName}</span> - <span>{order.messageToChef}</span> - <span>{order.status}</span>
              <span>Order is locked</span>
            </div>
          </div>
        ))
      )}

      {/* Modal for updating order */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Update Order Status</h3>
            <label>Status:</label>
            <input
              type="text"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            />
            <label>Comment to Chef:</label>
            <textarea
              value={commentToChef}
              onChange={(e) => setCommentToChef(e.target.value)} // Update comment
              placeholder="Add a comment for the chef (e.g. allergies, special requests)"
            />
            <button onClick={handleUpdateOrder}>Update</button>
            <button onClick={() => setIsModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrderList;
