import React, { useState, useEffect } from 'react';

const Menu = () => {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]); // Cart state to track selected items and their quantities
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [categories, setCategories] = useState([]);

  // Function to fetch the menu from backend
  const fetchMenu = async () => {
    try {
      const response = await fetch(
        `https://3uhcgg5udg.execute-api.eu-north-1.amazonaws.com/menu?sortBy=${sortBy}&category=${categoryFilter}&price=${priceFilter}`,
        {
          method: 'GET',
          headers: {
            'x-api-key': 'bsQFNKDT2O4oIwmBc0FmN3KpwgIFc23L6lpdrrUT',
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Error ${response.status}: ${errorMessage}`);
      }

      const data = await response.json();
      setMenu(data);

      const allCategories = [...new Set(data.map(item => item.category))];
      setCategories(allCategories);
    } catch (err) {
      console.error('Failed to fetch menu:', err);
      setError('Failed to fetch menu');
    }
  };

  useEffect(() => {
    fetchMenu();
  }, [sortBy, categoryFilter, priceFilter]);

  // Function to handle adding an item to the cart
  const handleAddToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  // Function to handle removing an item from the cart
  const handleRemoveFromCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem && existingItem.quantity > 1) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem
      ));
    } else {
      setCart(cart.filter(cartItem => cartItem.id !== item.id));
    }
  };

  // Function to render the popularity as stars
  const renderPopularity = (popularity) => {
    const stars = Math.round(popularity / 20); // Assuming popularity is out of 100, 20 = 1 star, 40 = 2 stars, etc.
    let starsHTML = '';
    
    for (let i = 0; i < stars; i++) {
      starsHTML += '★';
    }

    return starsHTML;
  };

  // Convert price string to number for calculation (removes "$" and converts to float)
  const convertToNumber = (price) => {
    return parseFloat(price.replace('$', '').trim());
  };

  return (
    <div>
      <h2>Menu</h2>
      {error ? (
        <p>Error: {error}</p>
      ) : (
        <div>
          {/* Sorting */}
          <label htmlFor="sort">Sort By:</label>
          <select id="sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="all">All</option>
            <option value="price">Price</option>
            <option value="popularity">Popularity</option>
          </select>

          {/* Display menu items */}
          <ul>
            {menu.length > 0 ? (
              menu.map((item) => (
                <li key={item.id}>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <p><strong>{item.price}</strong></p>
                  <p>Popularity: {renderPopularity(item.popularity)}</p>
                  <div>
                    <button onClick={() => handleRemoveFromCart(item)}>-</button>
                    <span>{cart.find(cartItem => cartItem.id === item.id)?.quantity || 0}</span>
                    <button onClick={() => handleAddToCart(item)}>+</button>
                  </div>
                </li>
              ))
            ) : (
              <p>Loading menu...</p>
            )}
          </ul>
        </div>
      )}

      {/* Cart Display */}
      <div>
        <h3>Your Cart</h3>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul>
            {cart.map(item => (
              <li key={item.id}>
                {item.name} - {item.quantity} x {item.price}
                <button onClick={() => handleRemoveFromCart(item)}>-</button>
              </li>
            ))}
          </ul>
        )}
        {/* Total calculation */}
        <p>Total: ${cart.reduce((total, item) => total + convertToNumber(item.price) * item.quantity, 0).toFixed(2)}</p>
      </div>
    </div>
  );
};

export default Menu;
