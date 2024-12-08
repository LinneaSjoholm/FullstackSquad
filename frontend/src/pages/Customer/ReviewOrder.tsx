import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CartItem } from '../../interfaces'; // Importera dina interfaces
import '../../styles/ReviewOrder.css';


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
  }, [updatedItems]);

  // Uppdatera priset för en enskild dryck
  const updateTotalPrice = (itemId: string, drinkId: string) => {
    if (drinkId === '') {
      // Om användaren väljer "Select Drink" (tomt värde), återställ drycken
      setUpdatedItems((prevItems) => {
        return prevItems.map((item) => {
          if (item.id === itemId) {
            const oldDrinkPrice = item.drinkId
              ? menuItems.find((drink) => drink.id === item.drinkId)?.price
              : 0;
  
            // Återställ drinken och justera priset
            return {
              ...item,
              drinkId: '', // Sätt drinkId till tomt för att ta bort drycken
              drinkName: '', // Ta bort dryckens namn
              price: item.price - oldDrinkPrice, // Justera priset genom att ta bort dryckens pris
            };
          }
          return item;
        });
      });
    } else {
      // Om en dryck är vald, uppdatera dryck och pris
      const selectedDrink = menuItems.find((drink) => drink.id === drinkId);
      if (selectedDrink) {
        setUpdatedItems((prevItems) => {
          return prevItems.map((item) => {
            if (item.id === itemId) {
              const oldDrinkPrice = item.drinkId
                ? menuItems.find((drink) => drink.id === item.drinkId)?.price
                : 0;
  
              // Uppdatera artikel med den nya drycken och justera priset
              return {
                ...item,
                drinkId: drinkId,
                drinkName: selectedDrink.name,
                price: item.price - oldDrinkPrice + selectedDrink.price, // Justera priset med den nya drycken
              };
            }
            return item;
          });
        });
      }
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
    setUpdatedItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === itemId) {
          const updatedItem = {
            ...item,
            [preference]: !item[preference], // Toggla värdet
          };
          return updatedItem;
        }
        return item;
      })
    );
  };

        // Uppdatera beställning
        const handleRemoveItem = (itemId: string) => {
          setUpdatedItems((prevItems) => {
            const updatedItems = prevItems.map((item) => {
              if (item.id === itemId) {
                // Set the quantity to 0 for the removed item
                item.quantity = 0;
              }
              return item;
            });
        
            // Update total price based on updated quantities
            const newTotalPrice = updatedItems.reduce(
              (total, item) => total + item.price * item.quantity,
              0
            );
            setUpdatedTotalPrice(newTotalPrice);  // Update total price after removing item
            return updatedItems;
          });
        };
  
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
              drinkId: item.drinkId,  // Ensure the drinkId is included
              drinkName: item.drinkName,  // Ensure the drinkName is included
              price: item.price,
              ingredients: item.ingredients,
              ingredientsToAdd: item.ingredientsToAdd,
              ingredientsToRemove: item.ingredientsToRemove,
              lactoseFree: item.lactoseFree,
              glutenFree: item.glutenFree,
              itemMessage: "Updated with changes",
            })),
            status: "pending",
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
    <div className="review-container">
      <div className="menu-header">
        <h1></h1>
      </div>
      <h1 className="review-order-title">Review Your Order</h1>
      <ul className="review-order-items">
        {updatedItems.map((item) => (
          <li key={item.id} className="review-order-item">
            <div className="review-order-item-details">
            <h2 className="review-order-subtitle">Your Order Details</h2>
              <span className="review-order-item-name">{item.name}</span> x <span className="review-order-item-quantity">{item.quantity}</span> - <span className="review-order-item-price">${item.price * item.quantity}</span>
              <div className="review-order-item-drink">
                {item.drinkName && <p className="review-order-item-drink-name">Selected Drink: {item.drinkName}</p>}
              </div>
              <h4 className="review-order-item-heading">Add/Remove Ingredients:</h4>
              <div className="review-order-item-ingredients">
                {item.ingredientsToAdd?.map((ingredient) => (
                  <span key={ingredient} className="review-ingredient-add">+{ingredient} </span>
                ))}
                {item.ingredientsToRemove?.map((ingredient) => (
                  <span key={ingredient} className="review-ingredient-remove">-{ingredient} </span>
                ))}
              </div>
              {item.ingredients && (
                <div className="review-order-item-modify-ingredients">
                  <h4 className="review-order-item-heading">Do you want to remove something or add extra?</h4>
                  {item.ingredients.map((ingredient: string, index: number) => (
                    <div key={index} className="modify-ingredient">
                      <span className="review-modify-ingredient-name">{ingredient}</span>
                      <button className="review-modify-ingredient-button" onClick={() => handleIngredientChange(item.id, 'add', ingredient)}>+</button>
                      <button className="review-modify-ingredient-button" onClick={() => handleIngredientChange(item.id, 'remove', ingredient)}>-</button>
                      <button className="review-modify-ingredient-button" onClick={() => handleIngredientChange(item.id, 'reset', ingredient)}>Reset</button>
                    </div>
                  ))}
                </div>
              )}

              <div className="review-order-item-dietary-preferences">
                <div className="dietary-preference-item">
                  <p>{item.glutenFree ? 'Gluten Free' : 'Not Gluten Free'}</p>
                  <button
                    onClick={() => handleDietaryPreferenceChange(item.id, 'glutenFree', !item.glutenFree)}
                    className="review-dietary-button">
                    Gluten Free / Not Gluten Free
                  </button>
                </div>

                <div className="dietary-preference-item">
                  <p>{item.lactoseFree ? 'Lactose Free' : 'Not Lactose Free'}</p>
                  <button
                    onClick={() => handleDietaryPreferenceChange(item.id, 'lactoseFree', !item.lactoseFree)}
                    className="review-dietary-button">
                    Lactose Free / Not Lactose Free
                  </button>
                </div>
              </div>

              <div className="review-order-item-drink-selection">
                <h4 className="review-order-item-heading">Choose Drink:</h4>
                <select
                  value={item.drinkId || ''}
                  onChange={(e) => updateTotalPrice(item.id, e.target.value)}
                  className="review-drink-select"
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

              {/* Lägg till knapp för att ta bort artikel */}
              <button onClick={() => handleRemoveItem(item.id)} className="review-remove-item-button">Remove Meal</button>
              <h3 className="review-total-price">Total Price: ${updatedTotalPrice}</h3>
            </div>
          </li>
        ))}
      </ul>

      

      <div className="review-customer-details-container">
        <h2 className="review-customer-details-heading">Customer Details</h2>

        <div className="review-customer-details-input-group">
          <label htmlFor="customerName" className="review-customer-details-label">Name</label>
          <input
            id="customerName"
            type="text"
            value={updatedName}
            onChange={(e) => setUpdatedName(e.target.value)}
            placeholder="Enter your name"
            className="review-customer-details-input"
          />
        </div>

        <div className="review-customer-details-input-group">
          <label htmlFor="customerPhone" className="review-customer-details-label">Phone Number</label>
          <input
            id="customerPhone"
            type="text"
            value={updatedPhone}
            onChange={(e) => setUpdatedPhone(e.target.value)}
            placeholder="Enter your phone number"
            className="review-customer-details-input"
          />
        </div>
      <button onClick={handleUpdateOrder} className="review-update-order-button">
      Confirmation
      </button>
    </div>
      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 Your Company. All rights reserved.</p>
      </footer>
    </div>
    
  );
};

export default ReviewOrder;
