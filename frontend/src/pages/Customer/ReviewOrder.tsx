import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CartItem } from '../../interfaces'; // Importera dina interfaces

const ReviewOrder: React.FC = () => {
  const location = useLocation();
  const { customerName, customerPhone, orderItems, totalPrice, orderId } = location.state || {};
  const [updatedName, setUpdatedName] = useState(customerName || '');
  const [updatedPhone, setUpdatedPhone] = useState(customerPhone || '');
  const [updatedItems, setUpdatedItems] = useState<CartItem[]>(orderItems || []);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [updatedTotalPrice, setUpdatedTotalPrice] = useState(totalPrice || 0);
  const navigate = useNavigate();

  // Hämta menydata från backend
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
        const data = await response.json();
        if (response.ok) {
          const allDrinks = data.menu?.drink || []; // Fokusera enbart på drycker
          setMenuItems(allDrinks); // Sätt menyn till endast drycker
        } else {
          alert('Failed to fetch menu items.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while fetching menu items.');
      }
    };
    fetchMenu();
  }, []);

  // Uppdatera totalpriset för hela beställningen varje gång artiklar uppdateras
  useEffect(() => {
    const newTotalPrice = updatedItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    setUpdatedTotalPrice(newTotalPrice); // Uppdatera totalpriset
  }, [updatedItems]); // Kör denna effekt när updatedItems förändras

  // Uppdatera priset för en enskild dryck
  const updateTotalPrice = (itemId: string, drinkId: string) => {
    const selectedDrink = menuItems.find((drink) => drink.id === drinkId);
    if (selectedDrink) {
      // Uppdatera priset för den aktuella artikeln
      setUpdatedItems((prevItems) => {
        return prevItems.map((item) => {
          if (item.id === itemId) {
            const oldDrinkPrice = item.drinkId
              ? menuItems.find((drink) => drink.id === item.drinkId)?.price
              : 0;

            // Uppdatera dryckens information och pris
            item.drinkId = drinkId;
            item.drinkName = selectedDrink.name;
            item.price -= oldDrinkPrice; // Ta bort gamla dryckens pris
            item.price += selectedDrink.price; // Lägg till nya dryckens pris
          }
          return item;
        });
      });
    }
  };

  // Hantera ingrediensändringar
  const handleIngredientChange = (
    itemId: string,
    action: 'add' | 'remove' | 'reset',
    ingredient: string
  ) => {
    setUpdatedItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === itemId) {
          item.ingredientsToAdd = item.ingredientsToAdd || [];
          item.ingredientsToRemove = item.ingredientsToRemove || [];

          if (action === 'add') {
            if (!item.ingredientsToAdd.includes(ingredient)) {
              item.ingredientsToAdd.push(ingredient);
            }
            const removeIndex = item.ingredientsToRemove.indexOf(ingredient);
            if (removeIndex !== -1) {
              item.ingredientsToRemove.splice(removeIndex, 1);
            }
          } else if (action === 'remove') {
            if (!item.ingredientsToRemove.includes(ingredient)) {
              item.ingredientsToRemove.push(ingredient);
            }
            const addIndex = item.ingredientsToAdd.indexOf(ingredient);
            if (addIndex !== -1) {
              item.ingredientsToAdd.splice(addIndex, 1);
            }
          } else if (action === 'reset') {
            const addIndex = item.ingredientsToAdd.indexOf(ingredient);
            if (addIndex !== -1) {
              item.ingredientsToAdd.splice(addIndex, 1);
            }
            const removeIndex = item.ingredientsToRemove.indexOf(ingredient);
            if (removeIndex !== -1) {
              item.ingredientsToRemove.splice(removeIndex, 1);
            }
          }
        }
        return item;
      })
    );
  };

  // Hantera kostpreferenser (lactose-free/gluten-free)
  const handleDietaryPreferenceChange = (
    itemId: string,
    preference: 'lactoseFree' | 'glutenFree',
    value: boolean
  ) => {
    console.log(`Setting ${preference} for item ${itemId} to ${value}`); // Logga ändring
    
    setUpdatedItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === itemId) {
          const updatedItem = {
            ...item,
            [preference]: true, // Sätt det specifika preferensvärdet till true eller false
          };
  
          console.log(`Item after forced update:`, updatedItem); // Logga det uppdaterade objektet
          return updatedItem;
        }
        return item;
      })
    );
  };
  
  

  // Uppdatera beställning
  const handleUpdateOrder = async () => {
    const updatedOrderData = {
      orderId: orderId,
      createdAt: new Date().toISOString(),
      customerName: updatedName,
      customerPhone: updatedPhone,
      glutenFreeMessage: updatedItems.some(item => item.glutenFree) ? "Gluten-free selected." : "",
      lactoseFreeMessage: updatedItems.some(item => item.lactoseFree) ? "Lactose-free selected." : "",
      items: updatedItems.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        quantity: item.quantity,
        drinkId: item.drinkId,
        drinkName: item.drinkName,
        price: item.price,
        ingredients: item.ingredients,
        ingredientsToAdd: item.ingredientsToAdd,
        ingredientsToRemove: item.ingredientsToRemove,
        lactoseFree: item.lactoseFree,
        glutenFree: item.glutenFree,
        itemMessage: "Updated with changes"
      })),
      status: "pending"
    };

    try {
      const response = await fetch(`https://3uhcgg5udg.execute-api.eu-north-1.amazonaws.com/order/reviewOrder/${orderId}`, {
        method: 'PUT',
        headers: {
          'x-api-key': 'bsQFNKDT2O4oIwmBc0FmN3KpwgIFc23L6lpdrrUT',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedOrderData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Order updated successfully!');
        navigate(`/order/${orderId}`);
      } else {
        alert('Failed to update order: ' + data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while updating your order.');
    }
  };

  return (
    <div>
      <h1>Review Your Order</h1>
      <h2>Your Order Details</h2>
      <ul>
        {updatedItems.map((item) => (
          <li key={item.id}>
            <div>
              {item.name} x {item.quantity} - ${item.price * item.quantity}
              <div>
                {item.drinkName && <p>Selected Drink: {item.drinkName}</p>}
                <h4>Ingredients:</h4>
                {item.ingredientsToAdd?.map((ingredient) => (
                  <span key={ingredient}>+{ingredient} </span>
                ))}
                {item.ingredientsToRemove?.map((ingredient) => (
                  <span key={ingredient}>-{ingredient} </span>
                ))}
              </div>
              {item.ingredients && (
                <div>
                  <h4>Modify Ingredients:</h4>
                  {item.ingredients.map((ingredient: string, index: number) => (
                    <div key={index}>
                      <span>{ingredient}</span>
                      <button onClick={() => handleIngredientChange(item.id, 'add', ingredient)}>+</button>
                      <button onClick={() => handleIngredientChange(item.id, 'remove', ingredient)}>-</button>
                      <button onClick={() => handleIngredientChange(item.id, 'reset', ingredient)}>Reset</button>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <p>{item.lactoseFree ? 'Lactose Free' : 'Not Lactose Free'}</p>
                <button onClick={() => handleDietaryPreferenceChange(item.id, 'lactoseFree', !item.lactoseFree)}>
                  Toggle Lactose Free
                </button>

                <p>{item.glutenFree ? 'Gluten Free' : 'Not Gluten Free'}</p>
                <button onClick={() => handleDietaryPreferenceChange(item.id, 'glutenFree', !item.glutenFree)}>
                  Toggle Gluten Free
                </button>
              </div>

              <div>
                <h4>Choose Drink:</h4>
                <select
                  value={item.drinkId || ''}
                  onChange={(e) => updateTotalPrice(item.id, e.target.value)}
                >
                  <option value="">Select Drink</option>
                  {menuItems.length > 0 ? (
                    menuItems.map((drink) => (
                      <option key={drink.id} value={drink.id}>
                        {drink.name} - ${drink.price}
                      </option>
                    ))
                  ) : (
                    <option>No drinks available</option>
                  )}
                </select>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <h3>Total Price: ${updatedTotalPrice}</h3>

      <h2>Customer Details</h2>
      <div>
        <input
          type="text"
          value={updatedName}
          onChange={(e) => setUpdatedName(e.target.value)}
          placeholder="Customer Name"
        />
      </div>
      <div>
        <input
          type="text"
          value={updatedPhone}
          onChange={(e) => setUpdatedPhone(e.target.value)}
          placeholder="Customer Phone"
        />
      </div>

      <button onClick={handleUpdateOrder}>Update Order</button>
    </div>
  );
};

export default ReviewOrder;
