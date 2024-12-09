import React, { useState } from "react";
import "../styles/PaymentOverlay.css";
import CardIcon from "../assets/CardIcon.png";
import Klarna from "../assets/Klarna-logo.png";
import paypal from "../assets/paypal-logo.png";

interface PaymentOverlayProps {
  onClose: () => void; // Funktion för att stänga overlay
}

const PaymentOverlay: React.FC<PaymentOverlayProps> = ({ onClose }) => {
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expirationDate: "",
    cvv: "",
    cardholderName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [amount] = useState<number>(199.99); // Sätt din summa här
  const [isGuest, setIsGuest] = useState<boolean>(true); // Ändra till false om användaren är inloggad
  const [userId] = useState<string>(""); // Lämna tom om `isGuest` är true

  const handleCardDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardDetails({
      ...cardDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleOrder = async () => {
    const payload = {
      userId: isGuest ? undefined : userId,
      orderId: `order-${Math.random().toString(36).substring(2, 15)}`,
      paymentMethod,
      amount,
      isGuest,
      cardDetails: paymentMethod === "card" ? cardDetails : undefined,
    };
  
    try {
      const response = await fetch(
        "https://cbcxsumuq8.execute-api.eu-north-1.amazonaws.com/dev/payment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
  
      console.log("Full response:", response);
  
      if (response.ok) {
        const result = await response.json();
        console.log("Response JSON:", result);
        alert(`Payment successful! Payment ID: ${result.paymentId}`);
        onClose();
      } else {
        const error = await response.json();
        console.log("Error JSON:", error);
        alert(`Payment failed: ${error.error}`);
      }
    } catch (error) {
      console.error("Error during payment:", error);
      alert("An unexpected error occurred.");
    }
  };

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
            <img src={CardIcon} alt="Card Icon" className="card-icon" />
          </label>
          {paymentMethod === "card" && (
            <div className="payment-card-form">
              <div className="card">
                <h3>Card Details:</h3>
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="Card Number"
                  value={cardDetails.cardNumber}
                  onChange={handleCardDetailsChange}
                />
                <input
                  type="text"
                  name="expirationDate"
                  placeholder="Expiration Date"
                  value={cardDetails.expirationDate}
                  onChange={handleCardDetailsChange}
                />
                <input
                  type="text"
                  name="cvv"
                  placeholder="CVV/CVC"
                  value={cardDetails.cvv}
                  onChange={handleCardDetailsChange}
                />
              </div>
              <div className="billing">
                <h3>Billing Address:</h3>
                <input
                  type="text"
                  name="cardholderName"
                  placeholder="Cardholder name"
                  value={cardDetails.cardholderName}
                  onChange={handleCardDetailsChange}
                />
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={cardDetails.address}
                  onChange={handleCardDetailsChange}
                />
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={cardDetails.city}
                  onChange={handleCardDetailsChange}
                />
                <input
                  type="text"
                  name="postalCode"
                  placeholder="Postal Code"
                  value={cardDetails.postalCode}
                  onChange={handleCardDetailsChange}
                />
                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  value={cardDetails.country}
                  onChange={handleCardDetailsChange}
                />
              </div>
            </div>
          )}
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="klarna"
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <span>Klarna</span>
            <img src={Klarna} alt="Klarna Icon" className="klarna-icon" />
          </label>
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="paypal"
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <span>PayPal</span>
            <img src={paypal} alt="PayPal Icon" className="paypal-icon" />
          </label>
        </div>
        <button onClick={handleOrder} className="close-button">
          Order
        </button>
      </div>
    </div>
  );
};

export default PaymentOverlay;