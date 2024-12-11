import React from 'react';
import AdminOrderList from '../../../components/AdminOrderList'
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../../components/navBar';

const OrderDashboard: React.FC = () => {
  const navigate = useNavigate();
  return (

  <>
    <div className="orders-container">
      <Navbar />
      
      <h1>Orders</h1>
      <AdminOrderList />
    
    </div>

  </>
  );
};

export default OrderDashboard;