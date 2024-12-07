import React, { useState, useEffect } from 'react';
import { MenuItem, OrderItem, CartItem } from '../interfaces/index';
import Cart from '../components/cart';

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
    // Lägg till en maträtt till beställningen, eller öka kvantiteten om den redan finns
    const addToOrder = (itemId: string) => {
        setOrderItems((prevState) => {
        // Find if the item already exists in the order
        const itemIndex = prevState.findIndex((item) => item.id === itemId);
    
        // If the item already exists, just increase the quantity
        if (itemIndex !== -1) {
            const updatedOrder = prevState.map((item, index) => {
            if (index === itemIndex) {
                return { ...item, quantity: item.quantity + 1 }; // Increase quantity
            }
            return item;
            });
            return updatedOrder;
        } else {
            // If the item doesn't exist, find it in the menu and add it to the order
            const item = Object.values(menuItems).flat().find((item) => item.id === itemId);
            if (item) {
            return [...prevState, { ...item, quantity: 1 }];
            }
            return prevState; // No changes if item is not found
        }
        });
    };
  

  // Ta bort en maträtt från beställningen, minska kvantiteten eller ta bort helt
  const removeFromOrder = (itemId: string) => {
    setOrderItems((prevState) => {
      const updatedOrder = prevState.map((item) => {
        if (item.id === itemId) {
          if (item.quantity > 1) {
            return { ...item, quantity: item.quantity - 1 }; // Minska kvantiteten
          }
          return null; // Ta bort objektet helt när kvantiteten når 1
        }
        return item;
      }).filter((item) => item !== null); // Filtrera bort null (objekt som tas bort)
      
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
                <li key={item.id}>
                  <h3>{item.name} - ${item.price}</h3>
                  <p>{item.description}</p>
                  <p>Ingredients: {item.ingredients.join(', ')}</p>
                  <p>{item.lactoseFree ? 'Lactose Free' : ''}</p>
                  <p>{item.glutenFree ? 'Gluten Free' : ''}</p>
                  <button onClick={() => addToOrder(item.id)}>Add to order</button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <Cart
        orderItems={orderItems}
        calculateTotalPrice={calculateTotalPrice}
        removeFromOrder={removeFromOrder}
      />
    </div>
  );
};

export default Menu;
