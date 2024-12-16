import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CartItem } from "../../interfaces/index"; 
import "../../styles/Confirmation.css";

const Confirmation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Ta emot state från PaymentOverlay
  const { orderId, updatedTotalPrice, updatedItems }: { orderId: string; updatedTotalPrice: number; updatedItems: CartItem[] } = location.state || {};

  return (
    <div className="confirmation-container">
      <div className="confirmation-container-message">
        <h2 className="confirmation-thank-you-message">Thank you for choosing Gusto to Go</h2>
        <p className="confirmation-message">Your order is on its way!</p>
      </div>

      <main className="confirmation-order-content">
        <section className="confirmation-order-summary">
          <h2>Order #{orderId}</h2>
          <ul className="confirmation-order-items">
            {updatedItems?.map((item: CartItem, index: number) => (
              <li key={index}>
                <div className="confirmation-order-item">
                <h3><strong>{item.name} x {item.quantity}</strong></h3>
                <h3><strong>${item.price}</strong></h3>
                </div>
              <div className="confirmation-order-item-details">
                {/* Visa vald dryck */}
                {item.drinkName && (
                  <p><strong>Drink:</strong> {item.drinkName}</p>
                )}

                {/* Visa tillagda ingredienser, med säkerhetskontroll för undefined */}
                {item.ingredientsToAdd && item.ingredientsToAdd.length > 0 && (
                  <p><strong>Add Ingredients:</strong> {item.ingredientsToAdd.join(', ')}</p>
                )}
                
                {/* Visa borttagna ingredienser, med säkerhetskontroll för undefined */}
                {item.ingredientsToRemove && item.ingredientsToRemove.length > 0 && (
                  <p><strong>Remove Ingredients:</strong> {item.ingredientsToRemove.join(', ')}</p>
                )}

                {/* Visa dieter */}
                {item.lactoseFree && (
                  <p><strong>Lactose Free</strong></p>
                )}
                {item.glutenFree && (
                  <p><strong>Gluten Free</strong></p>
                )}
              </div>  
              </li>
            ))}
          </ul>

          <hr />

          <div className="confirmation-order-total">
            <h2>Total</h2>
            <h2>${updatedTotalPrice?.toFixed(2)}</h2>
          </div>

          <div className="confirmation-delivery-info">
            <p>Your food will be delivered in approximately 30 minutes</p>
            <p className="confirmation-delivery-icon">🚗</p>
            <button className="confirmation-back-to-menu" onClick={() => navigate("/menu")}>
              Go Back to Menu
            </button>
          </div>
        </section>

        <p className="confirmation-contact-info">
          Need help? Contact us at <a href="mailto:support@gustotogo.com">support@gustotogo.com</a> or call +123 456 789
        </p>
      </main>
    </div>
  );
};

export default Confirmation;
