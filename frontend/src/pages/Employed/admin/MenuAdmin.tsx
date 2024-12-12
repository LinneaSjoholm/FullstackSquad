import React, { useState, useEffect } from 'react';
import { MenuItem, OrderItem, CartItem } from '../../../interfaces/index';
import { FaPen } from 'react-icons/fa'; 
import pastaImages from '../../../interfaces/pastaImages';
import '../../../styles/MenuAdmin.css';
import { Navbar } from '../../../components/navbar';

interface MenuAdminProps {
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  cart: CartItem[];
}

const MenuAdmin: React.FC<MenuAdminProps> = ({ setCart, cart }) => {
  const [menuItems, setMenuItems] = useState<{ [key: string]: MenuItem[] }>({});
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Kontrollera om admin är inloggad
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      // Om inget token finns, omdirigera till admin login-sidan
      window.location.href = '/admin/login';
    }

    const fetchMenu = async () => {
      try {
        const response = await fetch('https://3uhcgg5udg.execute-api.eu-north-1.amazonaws.com/menu', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Lägg till token i header
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

  const handleEdit = (itemId: string) => {
    const itemToEdit = Object.values(menuItems).flat().find((item) => item.id === itemId);
    setEditingItem(itemToEdit || null);
    setIsEditing(itemId);
  };

  const handleSave = async (itemId: string, updatedPrice: number, updatedDescription: string, updatedIngredients: string[]) => {
    if (!editingItem) return;

    setMenuItems((prevState) => {
      const updatedItems = Object.keys(prevState).reduce((acc, category) => {
        acc[category] = prevState[category].map((item) =>
          item.id === itemId ? { ...item, price: updatedPrice, description: updatedDescription, ingredients: updatedIngredients } : item
        );
        return acc;
      }, {} as { [key: string]: MenuItem[] });
      return updatedItems;
    });

    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch('https://3uhcgg5udg.execute-api.eu-north-1.amazonaws.com/menu/admin', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`, // Lägg till token i header
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId,
          name: editingItem.name,
          description: updatedDescription,
          price: updatedPrice,
          ingredients: updatedIngredients,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update menu item');
      }

      const data = await response.json();
      console.log('Item updated successfully:', data);
      setIsEditing(null);
      setEditingItem(null);
    } catch (error) {
      console.error('Error updating item:', error);
      setError('Failed to update menu item.');
    }
  };

  const handleCancel = () => {
    setIsEditing(null);
    setEditingItem(null);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="menu-admin-container">
      <Navbar />
      <div className="menu-header"></div>
      
      <div className="menu-left">
        <h1>Menu</h1>
        <div className="menu-items-container">
          {Object.keys(menuItems).map((category: string) => (
            <div key={category} className="menu-category">
              <h2>{category}</h2>
              <div className="menu-list">
                {menuItems[category].map((item: MenuItem) => (
                  <div key={item.id} className="menu-item">
                    <div className="menu-item-details">
                      {pastaImages[item.name] && (
                        <img src={pastaImages[item.name]} alt={item.name} className="menu-item-image" />
                      )}

                      <h3>{item.name} - ${item.price}</h3>
                      <p>{item.description}</p>
                      <p><strong>Ingredients:</strong> {item.ingredients.join(', ')}</p> {/* Visa ingredienser */}
                    </div>
                    <div className="menu-item-actions">
                      <button onClick={() => handleEdit(item.id)}>
                        <FaPen /> {/* Pennaikon */}
                      </button>
                    </div>
                    {isEditing === item.id && editingItem && (
                      <div className="edit-form">
                        <input
                          type="number"
                          value={editingItem.price}
                          onChange={(e) => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) })}
                        />
                        <textarea
                          value={editingItem.description}
                          onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                        />
                        {/* Formulär för att redigera ingredienser */}
                        <textarea
                          value={editingItem.ingredients.join(', ')} // Visa ingredienser som en kommaseparerad sträng
                          onChange={(e) => setEditingItem({ 
                            ...editingItem, 
                            ingredients: e.target.value.split(',').map(ingredient => ingredient.trim()) // Omvandla till array av ingredienser
                          })}
                        />
                        <button onClick={() => handleSave(item.id, editingItem.price, editingItem.description, editingItem.ingredients)}>
                          Save Changes
                        </button>
                        <button onClick={handleCancel}>Cancel</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 Your Company. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MenuAdmin;
