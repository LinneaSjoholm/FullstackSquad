import React from 'react';
import AdminOrderList from '../../../components/AdminOrderList'

const OrderDashboard: React.FC = () => {
  return (
    <div>
      <h1>Orders</h1>
      <AdminOrderList />
    </div>
  );
};

export default OrderDashboard;