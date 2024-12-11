import React from 'react';
import AdminOrderList from '../../../components/AdminOrderList'
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../../components/navbar';

const OrderDashboard: React.FC = () => {
  const navigate = useNavigate();
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