import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/HomePage';
import Menu from './pages/menu';
import CreateOrder from './pages/Customer/CreateOrder';
import ReviewOrder from './pages/Customer/ReviewOrder';
import { CartItem } from './interfaces/index'; 


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
      </Routes>
    </Router>
  );
};

export default App;
