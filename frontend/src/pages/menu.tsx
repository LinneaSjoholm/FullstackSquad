import React, { useState, useEffect } from 'react';
import { MenuItem, OrderItem, CartItem } from '../interfaces/index';
import Cart from '../components/cart';
import '../styles/Menu.css'; // Importera din CSS
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
  'Lasagna al Forno': LasagnaAlForno,
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

  // renderStars funktion för att visa stjärnor baserat på popularitet
  const renderStars = (popularity: number) => {
    const totalStars = 5;  // Max antal stjärnor att visa
  
    // Skala om populariteten till ett intervall mellan 0 och 5
    const scaledPopularity = Math.round((popularity / 100) * totalStars);
  
    // Skapa en array med stjärnor där 1 betyder fylld stjärna och 0 betyder tom
    const stars = Array.from({ length: totalStars }, (_, index) => index < scaledPopularity ? '★' : '☆');
  
    // Returnera stjärnorna som en sträng
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

  return (
    <div className="menu-container">
    <div className="header">
      <h1></h1>
    </div>
      <div className="menu-left">
        <h1>Menu</h1>
        <h1>All dishes can be made gluten-free and lactose-free upon request.</h1>
        <div className="sort-container">
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
    <h2 className={category === 'pasta' || category === 'drink' ? 'hidden' : ''}>{category}</h2>

    {/* Dölja texten för drycker */}
    {category !== 'drink' && (
      <h1></h1>
    )}

    <ul className="menu-list">
      {sortedMenuItems[category].map((item) => (
        <li key={item.id} className="menu-item">
          <h3>{item.name} - ${item.price}</h3>
          {category === 'pasta' && (
            <img 
              src={pastaImages[item.name]} 
              alt={item.name} 
              className="menu-item-image"
            />
          )}

          {/* Dölja description och ingredients för drycker */}
          {category !== 'drink' && (
            <>
              <p className="description-text">
                {item.description}
              </p>

              <p className="ingredients-text">
                Ingredients: {item.ingredients.join(', ')}
              </p>
            </>
          )}

          {/* Dölja diet-info för drycker */}
          {category !== 'drink' && (
            <div className="diet-info">
              <p className={`inline-text ${item.lactoseFree ? 'lactose-free' : ''}`}>
                {item.lactoseFree ? 'L ' : ''}
              </p>
              <p className={`inline-text ${item.glutenFree ? 'gluten-free' : ''}`}>
                {item.glutenFree ? 'G' : ''}
              </p>
            </div>
          )}

          {category === 'pasta' && (
           <div className="centered-container">
           {renderStars(item.popularity || 0)}
         </div>         
          )}
            <div className="button-container">
              {category !== 'drink' && (
                <button
                  className="favorite-button"
                  onClick={() => console.log(`Added ${item.name} to favorites`)}
                >
                  <img src={heartIcon} alt="Heart icon" className="icon" />
                </button>
              )}

              {category !== 'drink' && (
                <button className="add-to-order-button" onClick={() => addToOrder(item.id)}>
                  Add to order
                </button>
              )}
            </div>

        </li>
      ))}
    </ul>
  </div>
))}



      </div>
              <div className="icon-container">
          <button
            className="heart-button"
            onClick={() => console.log('Heart icon clicked')}
          >
            <img src={heartIcon} alt="Heart icon" className="heart-icon" />
          </button>

          <button 
            onClick={() => setCartVisible(!cartVisible)} 
            className="cart-button"
          >
            <img src={shoppingBagIcon} alt="Cart icon" className="cart-icon" />
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

export default Menu;
