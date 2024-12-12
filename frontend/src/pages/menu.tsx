import React, { useState, useEffect } from 'react';
import { MenuItem, OrderItem, CartItem } from '../interfaces/index';
import Cart from '../../src/components/cart';
import '../styles/Menu.css'; 
import shoppingBagIcon from '../assets/shopping-bag.png'; 
import pastaImages from '../interfaces/pastaImages'; 
import '../styles/Cart.css';
import FavoriteButton from '../components/FavoriteButton';

interface MenuProps {
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  cart: CartItem[];
}

const Menu: React.FC<MenuProps> = ({ setCart, cart }) => {
  const [menuItems, setMenuItems] = useState<{ [key: string]: MenuItem[] }>({});
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'popularity' | 'price' | 'name'>('popularity');
  const [cartVisible, setCartVisible] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<string[]>([]);  // State för favoriter


  // Kontrollera om användaren är inloggad genom att kolla efter ett token i localStorage
  const isLoggedIn = !!localStorage.getItem('token'); // true om token finns, false annars
  // Hämta favoriter från localStorage vid första renderingen
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  // Uppdatera localStorage när favoriter ändras
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (itemId: string) => {
    setFavorites((prevFavorites) => {
      const updatedFavorites = prevFavorites.includes(itemId)
        ? prevFavorites.filter((id) => id !== itemId)  // Remove from favorites
        : [...prevFavorites, itemId];  // Add to favorites
  
      // Update favorites in localStorage
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  };
  
  
  

  
  // För att stänga varukorgen automatiskt när den är tom
  useEffect(() => {
    if (orderItems.length === 0) {
      setCartVisible(false);
    }
  }, [orderItems]);

  // renderStars funktion för att visa stjärnor baserat på popularitet
  const renderStars = (popularity: number) => {
    const totalStars = 5;  // Max antal stjärnor att visa
    const scaledPopularity = Math.round((popularity / 100) * totalStars);
    const stars = Array.from({ length: totalStars }, (_, index) => index < scaledPopularity ? '★' : '☆');
    return stars.join(' ');
  };

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch('https://3uhcgg5udg.execute-api.eu-north-1.amazonaws.com/menu', {
          method: 'GET',
          headers: {
            'x-api-key': 'bsQFNKDT2O4oIwmBc0FmN3KpwgIFc23L6lpdrrUT',
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch menu');
        }

        const data = await response.json();

        if (data.menu) {
          setMenuItems(data.menu);
        } else {
          setError('Menu data is not available');
        }
      } catch (error) {
        setError('Failed to fetch menu');
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const addToOrder = (itemId: string) => {
    setOrderItems((prevState) => {
      const itemIndex = prevState.findIndex((item) => item.id === itemId);

      if (itemIndex !== -1) {
        const updatedOrder = prevState.map((item, index) => {
          if (index === itemIndex) {
            return { 
              ...item, 
              quantity: item.quantity + 1 
            };
          }
          return item;
        });
        return updatedOrder;
      } else {
        const item = Object.values(menuItems).flat().find((item) => item.id === itemId);
        if (item) {
          return [
            ...prevState, 
            { 
              ...item, 
              quantity: 1, 
              lactoseFree: false, 
              glutenFree: false  
            }
          ];
        }
        return prevState;
      }
    });
    setCartVisible(true);
  };

  const removeFromOrder = (itemId: string) => {
    setOrderItems((prevState) => {
      const updatedOrder = prevState.map((item) => {
        if (item.id === itemId) {
          if (item.quantity > 1) {
            return { ...item, quantity: item.quantity - 1 };
          }
          return null;
        }
        return item;
      }).filter((item) => item !== null);

      return updatedOrder;
    });
  };

  const calculateTotalPrice = () => {
    return orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const sortMenuItems = (items: MenuItem[], sortBy: 'popularity' | 'price' | 'name') => {
    return items.sort((a, b) => {
      if (sortBy === 'popularity') {
        const popularityA = a.popularity || 0;  // Default to 0 if popularity is missing or invalid
        const popularityB = b.popularity || 0;  // Default to 0 if popularity is missing or invalid
        return popularityB - popularityA;  // Descending order
      } else if (sortBy === 'price') {
        return a.price - b.price;  // Ascending price order
      } else {
        return a.name.localeCompare(b.name);  // Alphabetical order
      }
    });
  };

  const sortedMenuItems = Object.keys(menuItems).reduce((acc, category) => {
    acc[category] = sortMenuItems([...menuItems[category]], sortBy);
    return acc;
  }, {} as { [key: string]: MenuItem[] });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  function handleCloseCart(): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="menu-container">
      <div className="menu-header">
        <h1></h1>
      </div>
      <button
          onClick={() => setCartVisible(!cartVisible)}
          className="menu-cart-button"
        >
          <img src={shoppingBagIcon} alt="Cart icon" className="menu-cart-icon" />
        </button>
      <div className="menu-left">
        <h1>Menu</h1>
        <h2>All dishes can be made gluten-free and lactose-free upon request.</h2>
        <div className="menu-sort-container">
          <label htmlFor="sortBy">Sort by:</label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'popularity' | 'price' | 'name')}
          >
            <option value="popularity">Popularity</option>
            <option value="price">Price</option>
            <option value="name">Name</option>
          </select>
        </div>
        
        {Object.keys(sortedMenuItems).map((category) => (
  <div key={category}>
    <h2 className={category === 'pasta' || category === 'drink' ? 'hidden' : ''}>
      {category}
    </h2>

    {category !== 'drink' && <h1></h1>}

    <ul className="menu-list">
      {sortedMenuItems[category].map((item) => (
        <li key={item.id} className="menu-item">
          <h3>
            {item.name} - ${item.price}
          </h3>
          {category === 'pasta' && (
            <img
              src={pastaImages[item.name]}
              alt={item.name}
              className="menu-item-image"
            />
          )}

          {category !== 'drink' && (
            <>
              <p className="menu-description-text">{item.description}</p>
              <p className="menu-ingredients-text">
                Ingredients: {item.ingredients.join(', ')}
              </p>
            </>
          )}

          {category !== 'drink' && (
            <div className="menu-diet-info">
              <p
                className={`menu-inline-text ${item.lactoseFree ? 'lactose-free' : ''}`}
              >
                {item.lactoseFree ? 'L ' : ''} 
              </p>
              <p
                className={`menu-inline-text ${item.glutenFree ? 'gluten-free' : ''}`}
              >
                {item.glutenFree ? 'G' : ''}
              </p>
            </div>
          )}

          {category === 'pasta' && (
            <div className="menu-centered-container">
              {renderStars(item.popularity || 0)}
            </div>
          )}
          
          <div className="menu-button-container">
            {category !== 'drink' && (
              <button
                className="menu-favorite-button"
                onClick={() => toggleFavorite(item.id)}
              ></button>
            )}

            {category !== 'drink' && (
              <button
                className="menu-add-to-order-button"
                onClick={() => addToOrder(item.id)}
              >
                Add to order
              </button>
            )}
          </div>
          
          {/* Render the FavoriteButton here for each item */}
          <FavoriteButton
              itemId={item.id} 
              isFavorite={favorites.includes(item.id)}  // Check if item is a favorite
              onToggleFavorite={toggleFavorite} 
              isLoggedIn={isLoggedIn}
            />
        </li>
      ))}
    </ul>
  </div>
))}

  
        
      </div>
  
      {cartVisible && (
        <Cart
        orderItems={orderItems}
        calculateTotalPrice={calculateTotalPrice}
        removeFromOrder={removeFromOrder}
        onClose={handleCloseCart} // Skickar onClose här
      />
      )}
  
    </div>
  );
}

export default Menu;