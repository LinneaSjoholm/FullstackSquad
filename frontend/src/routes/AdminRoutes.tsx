import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import StockDashboard from '../pages/Employed/admin/StockStatus';
import MenuAdmin from '../pages/Employed/admin/MenuAdmin';
import { CartItem } from '../interfaces/index'; 
import OrderDashboard from '../pages/Employed/admin/OrderDashboard';
import Dashboard from '../pages/Employed/admin/Dashboard';
import { AdminRouteGuard } from '../guard/AdminRouteGuard';

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
