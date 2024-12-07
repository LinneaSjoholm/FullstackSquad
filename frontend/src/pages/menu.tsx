import React, { useState, useEffect } from 'react';
import { MenuItem, OrderItem, CartItem } from '../interfaces/index';
import Cart from '../components/cart';
import '../styles/Menu.css';
import shoppingBagIcon from '../assets/shopping-bag.png'; 
import heartIcon from '../assets/Vector (1).png';          
import arrabbiataPenne from '../assets/ArrabbiataPenne.png';
import carbonaraClassic from '../assets/CarbonaraClassic.png';
import creamyAlfredo from '../assets/CreamyAlfredo.png';
import fourCheeseTortellini from '../assets/FourCheeseTortellini.png';
import gardenPestoDelight from '../assets/GardenPestoDelight.png';
import LasagnaAlForno from '../assets/LasagnaAlForno.png';
import LemonHerbChickenPasta from '../assets/LemonHerbChickenPasta.png';
import ravioliFlorentine from '../assets/RavioliFlorentine.png';
import seafoodMarinara from '../assets/SeafoodMarinara.png';
import spaghettiBolognese from '../assets/SpaghettiBolognese.png';

const pastaImages: { [key: string]: string } = {
  'Arrabbiata Penne': arrabbiataPenne,
  'Carbonara Classic': carbonaraClassic,
  'Creamy Alfredo': creamyAlfredo,
  'Four Cheese Tortellini': fourCheeseTortellini,
  'Garden Pesto Delight': gardenPestoDelight,
  'Lasagna Al Forno': LasagnaAlForno,
  'Lemon Herb Chicken Pasta': LemonHerbChickenPasta,
  'Ravioli Florentine': ravioliFlorentine,
  'Seafood Marinara': seafoodMarinara,
  'Spaghetti Bolognese': spaghettiBolognese,
};

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
        return (b.popularity || 0) - (a.popularity || 0);
      } else if (sortBy === 'price') {
        return a.price - b.price;
      } else {
        return a.name.localeCompare(b.name);
      }
    });
  };

  const sortedMenuItems = Object.keys(menuItems).reduce((acc, category) => {
    acc[category] = sortMenuItems([...menuItems[category]], sortBy);
    return acc;
  }, {} as { [key: string]: MenuItem[] });

  const renderStars = (popularity: number) => {
    const starCount = Math.round(popularity / 20);
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} style={{ color: index < starCount ? 'gold' : 'gray' }}>★</span>
    ));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div>
        <h1>Menu</h1>
        <div>
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
            <h2>{category}</h2>
            <ul>
              {sortedMenuItems[category].map((item) => (
                <li key={item.id} style={{ marginBottom: '1rem' }}>
                  <h3>{item.name} - ${item.price}</h3>
                  
                  {/* Display the pasta image dynamically based on the item name */}
                  {category === 'pasta' && (
                    <img 
                      src={pastaImages[item.name]} 
                      alt={item.name} 
                      style={{ width: '', height: '' }} 
                    />
                  )}

                  <p>{item.description}</p>
                  <p>Ingredients: {item.ingredients.join(', ')}</p>

                  <div>
                    <p className="inline-text">{item.lactoseFree ? 'L/' : ''}</p>
                    <p className="inline-text">{item.glutenFree ? 'G' : ''}</p>
                  </div>

                  {category === 'pasta' && (
                    <div>{renderStars(item.popularity || 0)}</div>
                  )}

                  {category !== 'drink' && (
                    <button 
                      style={{ marginRight: '10px' }} 
                      onClick={() => console.log(`Added ${item.name} to favorites`)}
                    >
                      <img src={heartIcon} alt="Heart icon" style={{ width: '20px', height: '20px' }} />
                    </button>
                  )}

                  {category !== 'drink' && (
                    <button onClick={() => addToOrder(item.id)}>Add to order</button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div style={iconContainerStyles}>
        <button
          style={heartButtonStyles}
          onClick={() => console.log('Heart icon clicked')}
        >
          <img src={heartIcon} alt="Heart icon" style={{ width: '20px', height: '20px' }} />
        </button>

        <button 
          onClick={() => setCartVisible(!cartVisible)} 
          style={cartButtonStyles}
        >
          <img src={shoppingBagIcon} alt="Cart icon" style={{ width: '30px', height: '30px' }} />
        </button>
      </div>

      {cartVisible && (
        <Cart
          orderItems={orderItems}
          calculateTotalPrice={calculateTotalPrice}
          removeFromOrder={removeFromOrder}
        />
      )}
    </div>
  );
};

const iconContainerStyles: React.CSSProperties = {
  display: 'flex',
  position: 'absolute',
  top: '20px',
  right: '20px',
  zIndex: 1000,
};

const cartButtonStyles: React.CSSProperties = {
  backgroundColor: 'transparent',
  border: 'none',
  cursor: 'pointer',
};

const heartButtonStyles: React.CSSProperties = {
  backgroundColor: 'transparent',
  border: 'none',
  cursor: 'pointer',
  marginLeft: '10px',
};

export default Menu;
