import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateOrder: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<any>(null);
  const [messageToChef, setMessageToChef] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Fetching order with ID:", orderId);  
    const fetchOrder = async () => {
      try {
        const response = await fetch(`https://8yanxxf6q0.execute-api.eu-north-1.amazonaws.com/admin/order/${orderId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'bsQFNKDT2O4oIwmBc0FmN3KpwgIFc23L6lpdrrUT',
          },
        });
        const data = await response.json();
    
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch order.');
        }

        setOrder(data);
        setMessageToChef(data.messageToChef || '');
        setStatus(data.status || '');
      } catch (err) {
        console.error('Error fetching order:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    } else {
      setError('Order ID is missing.');
      setLoading(false);
    }
  }, [orderId]);

  const updateOrderStatus = async (updatedStatus: string) => {
    try {
      const response = await fetch(`https://8yanxxf6q0.execute-api.eu-north-1.amazonaws.com/admin/order/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'bsQFNKDT2O4oIwmBc0FmN3KpwgIFc23L6lpdrrUT',
        },
        body: JSON.stringify({ status: updatedStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update order.');
      }

      const data = await response.json();
      console.log('Order updated successfully:', data);
      alert('Order updated successfully!');
    } catch (err) {
      console.error('Error updating order:', err);
      alert(`Error updating order: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  if (loading) return <p>Loading order...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Update Order</h1>
      <form onSubmit={(e) => {
        e.preventDefault();
        updateOrderStatus(status);
      }}>
        <div>
          <label>Status:</label>
          <input
            type="text"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
        </div>

        <button type="submit" disabled={loading}>Update Status</button>
      </form>
    </div>
  );
};

export default UpdateOrder;
