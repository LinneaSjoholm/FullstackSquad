import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Menu from './components/menu';
import CreateOrder from './components/CreateOrder';
import HomePage from './pages/HomePage';
import ReviewOrder from './components/ReviewOrder'; // Import the ReviewOrder component

// Export the updated CartItem type to be used in other files
export interface CartItem {
  id: string;
  name: string;
  description: string;
  price: string;
  quantity: number;
  category: string; // Added category
  popularity: number; // Added popularity
}

const App = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const removeFromCart = (itemId: string) => {
    const updatedCart = cart.filter(item => item.id !== itemId);
    setCart(updatedCart);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<Menu cart={cart} setCart={setCart} />} />
          <Route path="/create-order" element={<CreateOrder cart={cart} setCart={setCart} removeFromCart={removeFromCart} />} />
          <Route 
            path="/review-order" 
            element={<ReviewOrder cart={cart} setCart={setCart} removeFromCart={removeFromCart} />} 
          /> {/* Pass all props to ReviewOrder */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
