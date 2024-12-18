import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Menu from './pages/menu';
import CreateOrder from './pages/Customer/CreateOrder';
import ReviewOrder from './pages/Customer/ReviewOrder';
import LoginAdmin from './pages/Employed/Login';
import Header from './components/Header';
import Footer from './components/Footer';
import PaymentOverlay from './components/PaymentOverlay';
import About from './pages/Customer/About';
import Contact from './pages/Customer/Contact';
import Confirmation from './pages/Customer/Confirmation';
import CreateAccount from './pages/Customer/CreateAccount';
import Login from './pages/Customer/Login';
import Profile from './pages/Customer/Profile';
import { UserRouteGuard } from './guard/UserRouteGuard';
import MenuAdmin from './pages/Employed/admin/MenuAdmin';
import StockStatus from './pages/Employed/admin/StockStatus';
import { CartItem } from './interfaces/index'; 
import OrderDashboard from './pages/Employed/admin/OrderDashboard';
import Dashboard from './pages/Employed/admin/Dashboard';
import { AdminRouteGuard } from './guard/AdminRouteGuard';
import FavoritesPage from './pages/Customer/Favorites/FavoritesPage';

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [updatedItems] = useState<CartItem[]>(cart);
  const [updatedTotalPrice] = useState<number>(0);
  const [user, setUser] = useState<{ id: string | null } | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Hämta den aktuella sökvägen
  const location = useLocation();

  // Lista över sidor där Header och Footer ska döljas
  const hideHeaderFooterPaths = [
    '/admin/login',
    '/user/login',
    '/user/create',
    '/admin/dashboard',
    '/admin/orders',
    '/admin/stock',
    '/admin/menu',
  ];

  return (
    <>
      {!hideHeaderFooterPaths.includes(location.pathname) && <Header />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<Menu setCart={setCart} cart={cart} user={user} token={token} />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/createOrder" element={<CreateOrder />} />
        <Route path="/review/Order" element={<ReviewOrder />} />

        <Route path="/user/create" element={<CreateAccount />} />
        <Route path="/user/login" element={<Login />} />
        <Route
          path="/user/profile"
          element={
            <UserRouteGuard>
              <Profile />
            </UserRouteGuard>
          }
        />
        <Route 
        path="/user/favorites" 
        element={
        <UserRouteGuard>
        <FavoritesPage />
        </UserRouteGuard>
        } />

        <Route
          path="/payment"
          element={
            <PaymentOverlay
              onClose={() => {}}
              onPaymentSuccess={() => {}}
              onPaymentFailure={() => {}}
              updatedItems={updatedItems}
              updatedTotalPrice={updatedTotalPrice}
            />
          }
        />
        
        <Route path="/admin/login" element={<LoginAdmin />} />
        <Route element={<AdminRouteGuard />}>
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/stock" element={<StockStatus />} />
        <Route path="/admin/menu" element={<MenuAdmin setCart={setCart} cart={cart}/>} />
        <Route path="/admin/orders" element={<OrderDashboard />} />
        </Route>
      </Routes>

      {!hideHeaderFooterPaths.includes(location.pathname) && <Footer />}
    </>
  );
};

export default App;
