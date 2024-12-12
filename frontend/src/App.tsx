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
import Header from "./components/Header";
import Footer from "./components/Footer";
import PaymentOverlay from './components/PaymentOverlay';
import About from "./pages/Customer/About";
import Contact from "./pages/Customer/Contact";
import Confirmation from "./pages/Customer/Confirmation";
import OrderDashboard from './pages/Employed/admin/OrderDashboard';

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [updatedItems ] = useState<CartItem[]>(cart); // Om du behöver skicka uppdaterade varor till PaymentOverlay
  const [updatedTotalPrice ] = useState<number>(0); // För att skicka uppdaterad totalpriser

  // Exempel på funktioner som kan skickas till PaymentOverlay
  const handleCloseOverlay = () => {
    // Stänger overlay (kan stänga via en state eller annan metod)
    console.log('Overlay closed');
  };

  const handlePaymentSuccess = () => {
    // Hantera betalningsframgång
    console.log('Payment succeeded');
  };

  const handlePaymentFailure = () => {
    // Hantera betalningsmisslyckande
    console.log('Payment failed');
  };

  // Hämta den aktuella sökvägen
  const location = useLocation();

  // Lista över sidor där Header och Footer ska döljas
  const hideHeaderFooterPaths = ['/admin/login', '/user/login', '/user/create', '/admin/dashboard', '/admin/orders', '/admin/stock', '/admin/menu'];


  return (
    <>
      {!hideHeaderFooterPaths.includes(location.pathname) && <Header />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<Menu setCart={setCart} cart={cart} />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/createOrder" element={<CreateOrder />} />
        <Route path="/review/Order" element={<ReviewOrder />} />
        <Route path="/admin/orders" element={<OrderDashboard />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/stock" element={<StockDashboard />} />
        <Route path="/admin/menu" element={<MenuAdmin setCart={setCart} cart={cart}/>} />
        <Route path="/user/create" element={<CreateAccount />} />
        <Route path="/user/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin/login" element={<LoginAdmin />} />
        <Route 
          path="/payment" 
          element={
            <PaymentOverlay 
              onClose={handleCloseOverlay} 
              onPaymentSuccess={handlePaymentSuccess} 
              onPaymentFailure={handlePaymentFailure} 
              updatedItems={updatedItems} 
              updatedTotalPrice={updatedTotalPrice}
            />
          } 
        />
      </Routes>
  
      {!hideHeaderFooterPaths.includes(location.pathname) && <Footer />}
    </>
  );
};

export default App;
