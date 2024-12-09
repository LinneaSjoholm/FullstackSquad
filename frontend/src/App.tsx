import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/HomePage';
import Menu from './pages/menu';
import CreateOrder from './pages/Customer/CreateOrder';
import ReviewOrder from './pages/Customer/ReviewOrder';
import OrderDashboard from './pages/admin/OrderDashboard';
import StockDashboard from './pages/admin/StockStatus';
import { CartItem } from './interfaces/index'; 
import MenuAdmin from './pages/Employed/MenuAdmin'


const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu setCart={setCart} cart={cart} />} />
        <Route
          path="/createOrder"
          element={<CreateOrder />} // No need to pass props here since we are using location.state in CreateOrder
        />
        <Route path="/review-Order" element={<ReviewOrder />} />
        <Route path="/admin/dashboard" element={<OrderDashboard />} />
        <Route path="/admin/stock" element={<StockDashboard />} />
        <Route path="/menu-admin" element={<MenuAdmin setCart={setCart} cart={cart}/>} />
      </Routes>
    </Router>
  );
};

export default App;
