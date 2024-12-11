import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Menu from './pages/menu';
import CreateOrder from './pages/Customer/CreateOrder';
import ReviewOrder from './pages/Customer/ReviewOrder';
import Dashboard from './pages/Employed/admin/Dashboard';
import StockDashboard from './pages/Employed/admin/StockStatus';
import { CartItem } from './interfaces/index'; 
import MenuAdmin from './pages/Employed/admin/MenuAdmin';
import Profile from "./pages/Customer/Profile";
import Login from "./pages/Customer/Login";
import CreateAccount from "./pages/Customer/CreateAccount";
import LoginAdmin from "./pages/Employed/Login";
import PaymentTest from "./pages/PaymentTest";
import Header from "./components/Header";
import Footer from "./components/Footer";
import About from "./pages/Customer/About";
import Contact from "./pages/Customer/Contact";
import Confirmation from "./pages/Customer/Confirmation";
import OrderDashboard from './pages/Employed/admin/OrderDashboard';

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Hämta den aktuella sökvägen
  const location = useLocation();

  // Lista över sidor där Header och Footer ska döljas
  const hideHeaderFooterPaths = ['/admin/login', '/user/login', '/user/create', '/admin/dashboard', '/admin/orders', '/admin/stock', '/admin/menu', '/payment-test'];

  return (
    <>
      {!hideHeaderFooterPaths.includes(location.pathname) && <Header />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<Menu setCart={setCart} cart={cart} />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/createOrder" element={<CreateOrder />} />
        <Route path="/review/Order" element={<ReviewOrder />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/payment-test" element={<PaymentTest />} />
        <Route path="/admin/login" element={<LoginAdmin />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/orders" element={<OrderDashboard />} />
        <Route path="/admin/stock" element={<StockDashboard />} />
        <Route path="/admin/menu" element={<MenuAdmin setCart={setCart} cart={cart} />} />
        <Route path="/user/create" element={<CreateAccount />} />
        <Route path="/user/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>

      {!hideHeaderFooterPaths.includes(location.pathname) && <Footer />}
    </>
  );
};

export default App;
