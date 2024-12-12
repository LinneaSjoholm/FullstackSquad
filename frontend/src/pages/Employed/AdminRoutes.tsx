import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import StockDashboard from './admin/StockStatus';
import MenuAdmin from './admin/MenuAdmin';
import { CartItem } from '../../interfaces/index'; 
import OrderDashboard from './admin/OrderDashboard';
import Dashboard from './admin/Dashboard';
import { AdminRouteGuard } from '../../utils/AdminRouteGuard';

const AdminRoutes: React.FC = () => {
      const [cart, setCart] = useState<CartItem[]>([]);

  return (
    <Routes>
      <Route element={<AdminRouteGuard />}>
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/stock" element={<StockDashboard />} />
        <Route path="/admin/menu" element={<MenuAdmin setCart={setCart} cart={cart}/>} />
        <Route path="/admin/orders" element={<OrderDashboard />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
