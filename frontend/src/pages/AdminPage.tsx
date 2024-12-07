import React from 'react';
import OrderList from '../components/OrderList'

const AdminPage: React.FC = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <OrderList />
    </div>
  );
};

export default AdminPage;
