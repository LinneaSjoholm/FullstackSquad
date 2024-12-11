import React, { useState, useEffect } from 'react';
import { lockOrder, adminGetOrders, updateOrder, markOrderAsComplete } from '../api/AdminOrderApi';
import '../styles/adminOrderList.css';

const AdminOrderList: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<string>('');
  const [commentToChef, setCommentToChef] = useState<string>('');
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);
  

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await adminGetOrders();
        if (response.statusCode === 200) {
          setOrders(response.body);
        } else {
          setError(response.body.message || 'Failed to fetch orders.');
        }
      } catch (err) {
        setError('An error occurred while fetching orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleUpdateOrder = async () => {
    if (selectedOrderId && newStatus && commentToChef !== null) {
      try {
        const updatedOrder = await updateOrder(selectedOrderId, newStatus, commentToChef, false);

        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderId === selectedOrderId
              ? {
                  ...order,
                  status: updatedOrder.status,
                  messageToChef: updatedOrder.messageToChef,
                }
              : order
          )
        );
        setUpdateMessage('Order updated successfully!');
      } catch (error) {
        console.error('Error updating order:', error);
        setUpdateMessage('Failed to update order.');
      }
    } else {
      setUpdateMessage('Please provide a valid status and message to chef');
    }
  };

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

  const handleMarkAsCompleted = async (orderId: string) => {
    try {
      const updatedOrder = await markOrderAsComplete(orderId);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === orderId
            ? { ...order, status: 'completed' }
            : order
        )
      );
    } catch (error) {
      console.error('Error marking order as completed:', error);
      alert('Failed to mark order as completed.');
    }
  };



  const closeModal = () => {
    setIsModalOpen(false);
    setUpdateMessage(null); // Reset the message when the modal is closed
  };

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>{error}</p>;

  const newOrders = orders.filter((order) => !order.locked && order.status !== 'completed');
  const lockedOrders = orders.filter((order) => order.locked && order.status !== 'completed');
  const completedOrders = orders.filter((order) => order.status === 'completed');

  return (
    <div className="admin-order-list-container">
      <h2>New Orders</h2>
      {newOrders.length === 0 ? (
        <p>No new orders.</p>
      ) : (
        <div className="order-section">
          {newOrders.map((order, index) => (
            <div key={order.orderId} className="order-item">
              <span>
                {index + 1}. Order ID: {order.orderId}
              </span>{' '}
              <span>{order.dishName}</span>{' '}
              <span>{order.messageToChef || 'No message provided'}</span>{' '}
              <span className={`status ${order.status}`}>{order.status}</span>
              <div className="button-container">
                <button className="lock-btn" onClick={() => handleLockOrder(order.orderId)}>
                  Lock Order
                </button>

                <button
                  className="update-btn"
                  onClick={() => {
                    setSelectedOrderId(order.orderId);
                    setNewStatus(order.status || '');
                    setCommentToChef(order.messageToChef || '');
                    setIsModalOpen(true);
                  }}
                >
                  Update Order
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2>Locked Orders</h2>
      {lockedOrders.length === 0 ? (
        <p>No locked orders.</p>
      ) : (
        <div className="order-section">
          {lockedOrders.map((order, index) => (
            <div key={order.orderId} className="order-item">
              <span>
                {index + 1}. Order ID: {order.orderId}
              </span>{' '}
              <span>{order.dishName}</span>{' '}
              <span>{order.messageToChef || 'No message provided'}</span>{' '}
              <span className="status locked">Locked</span>
              <button
                className="complete-btn"
                onClick={() => handleMarkAsCompleted(order.orderId)}
              >
                Mark as completed
              </button>
            </div>
          ))}
        </div>
      )}

      <h2>Completed Orders</h2>
      {completedOrders.length === 0 ? (
        <p>No completed orders.</p>
      ) : (
        <div className="order-section">
          {completedOrders.map((order, index) => (
            <div key={order.orderId} className="order-item">
              <span>
                {index + 1}. Order ID: {order.orderId}
              </span>{' '}
              <span>{order.dishName}</span>{' '}
              <span>{order.messageToChef || 'No message provided'}</span>{' '}
              <span className="status completed">Completed</span>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-btn-modal" onClick={closeModal}>
              &times;
            </button>
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
              onChange={(e) => setCommentToChef(e.target.value)}
              placeholder="Add a comment for the chef (e.g. allergies, special requests)"
            />
            {updateMessage && <p className="update-message">{updateMessage}</p>}
            <button className="update-btn-modal" onClick={handleUpdateOrder}>
              Update
            </button>
            <button className="cancel-btn-modal" onClick={closeModal}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrderList;
