import React from "react";
<<<<<<< HEAD:frontend/src/components/Confirmation.tsx
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Confirmation.css";
=======
import "../../styles/Confirmation.css";
>>>>>>> Lam:frontend/src/pages/Customer/Confirmation.tsx

const Confirmation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, updatedTotalPrice, updatedItems } = location.state || {};

  return (
    <div className="container">
      <div className="container-message">
<<<<<<< HEAD:frontend/src/components/Confirmation.tsx
=======
        {/* <p className="message">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptas? Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisq */}
        {/* </p> */}
>>>>>>> Lam:frontend/src/pages/Customer/Confirmation.tsx
        <h2 className="thank-you-message">Thank you for choosing Gusto to Go</h2>
        <p className="confirmation-message">Your order is on its way!</p>
      </div>

      <main className="order-content">
        <section className="order-summary">
          <h3>Order #{orderId}</h3>
          <ul className="order-items">
            {updatedItems?.map((item: any, index: number) => (
              <li key={index} className="order-item">
                <span>{item.name} x {item.quantity}</span>
                <span>${item.price * item.quantity}</span>

                {/* Show selected drink */}
                {item.drinkName && (
                  <p><strong>Drink:</strong> {item.drinkName}</p>
                )}

                {/* Show add/remove ingredients */}
                {item.ingredientsToAdd?.length > 0 && (
                  <p><strong>Add Ingredients:</strong> {item.ingredientsToAdd.join(', ')}</p>
                )}
                {item.ingredientsToRemove?.length > 0 && (
                  <p><strong>Remove Ingredients:</strong> {item.ingredientsToRemove.join(', ')}</p>
                )}

                {/* Show dietary preferences */}
                {item.lactoseFree && (
                  <p><strong>Lactose Free</strong></p>
                )}
                {item.glutenFree && (
                  <p><strong>Gluten Free</strong></p>
                )}
              </li>
            ))}
          </ul>

          <hr />

          <div className="order-total">
            <span>Total</span>
            <span>${updatedTotalPrice}</span>
          </div>

          <div className="delivery-info">
            <p>Your food will be delivered in approximately 30 minutes</p>
            <p className="delivery-icon">🚗</p>
            <button className="back-to-menu" onClick={() => navigate("/menu")}>
              Go Back to Menu
            </button>
          </div>
        </section>

        <p className="contact-info">
          Need help? Contact us at <a href="mailto:support@gustotogo.com">support@gustotogo.com</a> or call +123 456 789
        </p>
      </main>
    </div>
  );
};

export default Confirmation;

