import React from "react";
import "../styles/Confirmation.css";

const Confirmation: React.FC = () => {
  return (
    <div className="container">

      <div className="container-message">
        <p className="message">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptas? Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisq
        </p>
        <h2 className="thank-you-message">Thank you for choosing Gusto to Go</h2>
        <p className="confirmation-message">your order is on its way!</p>
      </div>
    
    {/* Main Content */}
    <main className="order-content">
    {/* The Order Summary */}
      <section className="order-summary">
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
      </section>

      <p className="contact-info">
        Need help? Contact us at <a href="mailto:support@gustotogo.com">support@gustotogo.com</a> or call <br /> +123 456 789
      </p>
    </main>
    </div>
    
  );
};

export default Confirmation;
