import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartItem } from '../App';

// MenuItem and MenuProps interface definitions
interface MenuItem {
  name: string;
  price: number;
  ingredients: string[];
  lactoseFree: boolean;
  glutenFree: boolean;
  popularity: number;
  category: string;
  description: string; // Added description
}

interface MenuProps {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

const Menu: React.FC<MenuProps> = ({ cart, setCart }) => {
  const [menu, setMenu] = useState<{ [key: string]: MenuItem[] }>({});
  const [sortedMenu, setSortedMenu] = useState<{ [key: string]: MenuItem[] }>({});
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);
  const navigate = useNavigate();

  // Fetch menu data from the backend
  const fetchMenu = async () => {
    try {
      const response = await fetch(
        'https://3uhcgg5udg.execute-api.eu-north-1.amazonaws.com/menu',
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
        console.error(`Failed to fetch menu: ${errorMessage}`);
        throw new Error(`Error ${response.status}: ${errorMessage}`);
      }

      const data = await response.json();
      if (data.menu) {
        setMenu(data.menu);
        setCategories(Object.keys(data.menu)); // Set categories
        setSortedMenu(data.menu); // Set sorted menu
      } else {
        setError('Failed to fetch menu. Invalid data format.');
      }
    } catch (err) {
      console.error('Failed to fetch menu:', err);
      setError('Failed to fetch menu');
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const renderStars = (popularity: number) => {
    const filledStars = Math.floor(popularity / 20);
    const emptyStars = 5 - filledStars;
    return (
      <span>
        {'★'.repeat(filledStars)}
        {'☆'.repeat(emptyStars)}
      </span>
    );
  };

  // Update Cart Item Quantity (Add/remove item)
  const updateCartItemQuantity = (item: MenuItem, increase: boolean) => {
    const existingItemIndex = cart.findIndex((cartItem) => cartItem.id === item.name);

    if (existingItemIndex >= 0) {
      const updatedCart = [...cart];
      const newQuantity = updatedCart[existingItemIndex].quantity + (increase ? 1 : -1);

      if (newQuantity > 0) {
        updatedCart[existingItemIndex].quantity = newQuantity;
      } else {
        updatedCart.splice(existingItemIndex, 1); // Remove item from cart
      }

      setCart(updatedCart);
    } else if (increase) {
      const newCart = [...cart, menuItemToCartItem(item)];
      setCart(newCart);
    }
  };

  const menuItemToCartItem = (item: MenuItem): CartItem => ({
    id: item.name, // Use the name as the ID
    name: item.name,
    price: item.price.toString(),
    description: item.ingredients.join(', '),
    quantity: 1,
    category: item.category,
    popularity: item.popularity,
  });

  const calculateTotal = () => {
    return cart.reduce(
      (total, item) => total + parseFloat(item.price) * item.quantity,
      0
    ).toFixed(2);
  };

  const handleCreateOrder = () => {
    navigate('/create-order');
  };

  // Filter drinks and render lactose/gluten information for non-drink items
  const renderLactoseGlutenInfo = (item: MenuItem) => {
    if (item.category === 'drink') return null;
    return (
      <div>
        <p>{item.lactoseFree ? 'L /' : ''}{item.glutenFree ? ' G' : ''}</p>
      </div>
    );
  };

  const renderPopularity = (item: MenuItem) => {
    if (item.category === 'drink') return null; // Hide popularity for drinks
    return <p>Popularity: {renderStars(item.popularity)}</p>;
  };

  // Filter out drinks from the menu
  const filteredMenu = Object.keys(sortedMenu)
    .filter(category => category !== 'drink')
    .reduce((acc, category) => {
      acc[category] = sortedMenu[category];
      return acc;
    }, {} as { [key: string]: MenuItem[] });

  // Sorting of menu based on selected criteria
  const filteredAndSortedMenu = Object.keys(filteredMenu).reduce((acc, category) => {
    let sortedItems = [...filteredMenu[category]];

    if (sortBy === 'price') {
      sortedItems.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'popularity') {
      sortedItems.sort((a, b) => b.popularity - a.popularity);
    } else if (sortBy === 'all') {
      sortedItems.sort((a, b) => a.name.localeCompare(b.name));
    }

    acc[category] = sortedItems;
    return acc;
  }, {} as { [key: string]: MenuItem[] });

  return (
    <div>
      <h2>Menu</h2>
      {error ? (
        <div>
          <p>Error: {error}</p>
          <button onClick={fetchMenu}>Try Again</button>
        </div>
      ) : (
        <div>
          {/* Sort By Selector */}
          <label htmlFor="sort">Sort By:</label>
          <select id="sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="all">All</option>
            <option value="price">Price</option>
            <option value="popularity">Popularity</option>
          </select>

          {/* Render Menu Items */}
          <div>
            {Object.keys(filteredAndSortedMenu).map((category) => (
              <div key={category}>
                <h3>{category}</h3>
                {filteredAndSortedMenu[category].map((item, index) => (
                  <div key={`${item.name}-${index}`} className="menu-item">
                    <h4>{item.name}</h4>
                    <p>{item.description}</p>
                    <p>Price: ${item.price}</p>
                    <p>Ingredients: {item.ingredients.join(', ')}</p>
                    {renderPopularity(item)} {/* Hide popularity for drinks */}
                    {renderLactoseGlutenInfo(item)} {/* Hide lactose/gluten for drinks */}
                    <div>
                      <button onClick={() => updateCartItemQuantity(item, false)}>-</button>
                      <span> {cart.find((cartItem) => cartItem.id === item.name)?.quantity || 0} </span>
                      <button onClick={() => updateCartItemQuantity(item, true)}>+</button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Floating Cart Summary */}
      <div style={cartSummaryStyles}>
        <h3>Your Cart</h3>
            {cart.length > 0 ? (
              <>
                <ul>
                  {cart.map((cartItem) => (
                    <li key={cartItem.id} style={{ marginBottom: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{cartItem.name} ({cartItem.quantity})</span>
                        <span>${(parseFloat(cartItem.price) * cartItem.quantity).toFixed(2)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
                <p>Total: ${calculateTotal()}</p>
                <button onClick={handleCreateOrder}>Create Order</button>
              </>
            ) : (
              <p>Your cart is empty</p>
            )}
          </div>
    </div>
  );
};

const cartSummaryStyles: React.CSSProperties = {
  position: 'fixed',
  top: '20px',
  right: '20px',
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  color: 'white',
  padding: '10px',
  borderRadius: '8px',
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
  width: '200px',
  zIndex: 1000,
};

export default Menu;
