// src/pages/Employed/admin/AdminRoutes.tsx
import React, { useState } from 'react';
import { Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";
import StockDashboard from "./StockStatus";
import MenuAdmin from "./MenuAdmin";
import OrderDashboard from "./OrderDashboard";
import LoginAdmin from ".././Login/index";
import { CartItem } from '../../../interfaces/index';

const AdminRoutes: React.FC = () => {
const [cart, setCart] = useState<CartItem[]>([]);
  return (
    <Routes>
      <Route path="login" element={<LoginAdmin />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="stock" element={<StockDashboard />} />
      <Route path="/admin/menu" element={<MenuAdmin setCart={setCart} cart={cart}/>} />
      <Route path="orders" element={<OrderDashboard />} />
    </Routes>
  );
};

export default AdminRoutes;
