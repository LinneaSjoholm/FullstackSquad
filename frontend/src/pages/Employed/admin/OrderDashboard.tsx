import React, { useEffect } from 'react';
import AdminOrderList from '../../../components/AdminOrderList';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../../components/navbar';

const OrderDashboard: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  return (
    <>
      <Navbar />
    
      <div className="orders-container">
        <h1>Orders</h1>
      </div>

      <AdminOrderList />
    </>
  );
};

export default OrderDashboard;