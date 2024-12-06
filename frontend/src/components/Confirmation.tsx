import React from "react";
import "../styles/Confirmation.css";

const Confirmation: React.FC = () => {
  return (
    <div>{/* Main Content */}
      <div className="thank-you-message">
        <h2>Thank you for choosing Gusto to Go</h2>
        <p>your order is on its way!</p>
      </div>
    
    <main className="order-details">
      <div className="order-summary">
        <div className="order-number">
        <h3>Order #12345</h3>
        </div>
        <div>
            <ul className="order-items">
            <li>
                <span>Creamy Alfredo</span>
                <span>$10.99</span>
            </li>
            <li>
                <span>Garden Pesto Delight</span>
                <span>$10.99</span>
            </li>
            </ul>
            <hr />
            <div className="order-total">
                <span>Total</span>
                <span>$21.98</span>
            </div>
        </div>
        <div className="delivery-info">
        <p>
          Your food will be delivered in approximately 30 minutes
        </p>
        <p className="delivery-icon">🚗</p>
        <button className="back-to-menu">Go Back to Menu</button>
        </div>
        
      </div>
      <p className="contact-info">
        Need help? Contact us at <a href="mailto:support@gustotogo.com">support@gustotogo.com</a> or call <br /> +123 456 789
      </p>
    </main>
    </div>
    
  );
};

export default Confirmation;
