import React, { useState } from "react";
import "../styles/PaymentOverlay.css";

interface PaymentOverlayProps {
  onClose: () => void; // Funktion för att stänga overlay
}

const PaymentOverlay: React.FC<PaymentOverlayProps> = ({ onClose }) => {
  const [paymentMethod, setPaymentMethod] = useState<string>("");

  return (
    <div className="payment-overlay">
      <div className="payment-container">
        <h2>Payment method</h2>
        <div className="payment-options">
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <span>Card</span>
          </label>
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="klarna"
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <span>Klarna</span>
          </label>
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="paypal"
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <span>PayPal</span>
          </label>
        </div>
        <button onClick={onClose} className="close-button">
          Close
        </button>
      </div>
    </div>
  );
};

export default PaymentOverlay;