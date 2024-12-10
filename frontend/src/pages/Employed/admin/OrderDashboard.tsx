import React from 'react';
import AdminOrderList from '../../../components/AdminOrderList'
import '../../../styles/adminOrderDashboard.css';
import { useNavigate } from 'react-router-dom';

const OrderDashboard: React.FC = () => {
  const navigate = useNavigate();
  return (

  <>
    <div className="navbar">
    <ul className="navbar-links">
      <li 
      className="navbar-item"
      onClick={() => navigate('/admin/menu')}>
        Menu
        </li>
      
      <li 
      className="navbar-item"
      onClick={() => navigate('/admin/stock')}>
        Stockstatus
        </li>
      
      <li 
      className="navbar-item"
      onClick={() => navigate('/admin/orders')}>Orders</li>
    </ul>
  </div>

    <div className="order-dashboard-container">
      
      <h1>Orders</h1>
      <AdminOrderList />
    
    </div>

  </>
  );
};

export default OrderDashboard;