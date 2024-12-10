import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Menu from './pages/menu';
import CreateOrder from './pages/Customer/CreateOrder';
import ReviewOrder from './pages/Customer/ReviewOrder';
import OrderDashboard from './pages/Employed/admin/OrderDashboard';
import StockDashboard from './pages/Employed/admin/StockStatus';
import { CartItem } from './interfaces/index'; 
import MenuAdmin from './pages/Employed/MenuAdmin';
import Profile from "./pages/Customer/Profile";
import Login from "./pages/Customer/Login";
import CreateAccount from "./pages/Customer/CreateAccount";
import LoginAdmin from "./pages/Employed/Login";
import PaymentTest from "./pages/PaymentTest";
import Header from "./components/Header";
import Footer from "./components/Footer";
import About from "./components/About";
import Contact from "./components/Contact";
import Confirmation from "./components/Confirmation";

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  return (
    <Router>
      {/* Header visas alltid */}
      <Header />
      

        {/* Huvudsakligt innehåll */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<Menu setCart={setCart} cart={cart} />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/createOrder" element={<CreateOrder />} />
          <Route path="/review/Order" element={<ReviewOrder />} />
          <Route path="/admin/dashboard" element={<OrderDashboard />} />
          <Route path="/admin/stock" element={<StockDashboard />} />
          <Route path="/admin/menu" element={<MenuAdmin setCart={setCart} cart={cart}/>} />
          <Route path="/user/create" element={<CreateAccount />} />
          <Route path="/user/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin/login" element={<LoginAdmin />} />
          <Route path="/payment-test" element={<PaymentTest />} /> 
        </Routes>

      {/* Footer visas alltid */}
      <Footer />
    </Router>
  );
};

export default App;

