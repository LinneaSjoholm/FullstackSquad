import React, { useState, useEffect } from 'react';
import { MenuItem, OrderItem, CartItem } from '../interfaces/index';
import Cart from '../../src/components/cart';
import '../styles/Menu.css'; 
import shoppingBagIcon from '../assets/shopping-bag.png'; 
import pastaImages from '../interfaces/pastaImages'; 
import '../styles/Cart.css';
import FavoriteButton from '../components/FavoriteButton';
import { FaHeart, FaRegHeart } from 'react-icons/fa';


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
  const [favorites, setFavorites] = useState<string[]>([]); // Manages the list of favorite item IDs

  
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    console.log('Stored favorites:', storedFavorites);  // Lägg till logg för att kolla om favoriter finns
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);
  

  const toggleFavorite = (itemId: string) => {
    setFavorites((prevFavorites: string[]) => {
      const newFavorites = [...prevFavorites];
      const index = newFavorites.indexOf(itemId);
  
      if (index === -1) {
        newFavorites.push(itemId);  
      } else {
        newFavorites.splice(index, 1); 
      }
  
      localStorage.setItem('favorites', JSON.stringify(newFavorites));  // Uppdatera localStorage
      console.log('Updated favorites:', newFavorites);  // Loggar nya favoriter
      return newFavorites;
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

   // Uppdaterad version av handleCloseCart
   function handleCloseCart() {
    setCartVisible(false);  // Stänger varukorgen
  }

  return (
    <div className='menu-container'>
      <div className="menu-cart-button">
      <button className="menu-cart-icon"
          onClick={() => setCartVisible(!cartVisible)}
        >
          <img src={shoppingBagIcon} alt="Cart icon"  />
        </button>
      </div>
      <div className="menu-bar">
        <div className='menu-header'>
        <h1>Menu</h1>
        <h2>
        All dishes can be made <span className="gluten-free"> Gluten-free </span> and 
        <span className="lactose-free"> Lactose-free </span> upon request.
      </h2>

        </div>
        <div className="menu-sort-container">
          <label  className="menu-sort-label" htmlFor="sortBy">Sort by:</label>
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
  
  {/* Lägg till en dynamisk klass för ul baserat på kategori */}
  <ul className={`menu-list ${category === 'pasta' ? 'pasta-style' : ''} ${category === 'drink' ? 'drink-style' : ''}`}>
    {sortedMenuItems[category].map((item) => (
      <li key={item.id} className="menu-item">
        <div className='menu-info'>
          <h3>{item.name}</h3>
          <h3>${item.price}</h3>
        </div>
        {category === 'pasta' && (
          <img
            src={pastaImages[item.name]}
            alt={item.name}
            className="menu-item-image"
          />
        )}

        {category !== 'drink' && (
          <div className='menu-description'>
            <p>{item.description}</p>
            
            <p> Ingredients: {item.ingredients.join(', ')}</p>
          </div>
        )}

        {category !== 'drink' && (
          <div className="menu-diet-info">
          </div>
        )}

        {category === 'pasta' && (
          <div className="menu-centered-container">
            {renderStars(item.popularity || 0)}
          </div>
        )}
        
        <div className="menu-button-container">
        {category !== 'drink' && (
          <div className="button-with-heart"> 
            {/* Favorite button with heart icon */}
            <button
              className="menu-favorite-button"
              onClick={() => toggleFavorite(item.id)}
            >
              {favorites.includes(item.id) ? (
                <FaHeart className="heart-icon-filled" /> // Fyllt hjärta
              ) : (
                <FaRegHeart className="heart-icon-empty" /> // Tomt hjärta
              )}
            </button>
            <button
              className="menu-add-to-order-button"
              onClick={() => addToOrder(item.id)}
            >
              Add to order
            </button>
           
          </div>
        )}
      </div>
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
          onClose={handleCloseCart} // Skickar handleCloseCart här
        />
      )}
    </div>
  );
}

export default Menu;