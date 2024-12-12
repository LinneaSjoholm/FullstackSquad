import React, { useState } from "react";
import "../styles/PaymentOverlay.css";
import CardIcon from "../assets/CardIcon.png";
import Klarna from "../assets/Klarna-logo.png";
import paypal from "../assets/paypal-logo.png";
import { useNavigate } from "react-router-dom"; 
import { CartItem } from '../../src/interfaces/index'; 

interface PaymentOverlayProps {
  onClose: () => void; // Funktion för att stänga overlay
  onPaymentSuccess: (updatedOrder: any) => void; // Uppdaterad funktion för att hantera orderdata vid framgång
  onPaymentFailure: () => void;
  updatedItems: CartItem[];
  updatedTotalPrice?: number; // Se till att updatedTotalPrice definieras korrekt
}

const PaymentOverlay: React.FC<PaymentOverlayProps> = ({
  onClose,
  onPaymentSuccess,
  onPaymentFailure,
  updatedItems,
  updatedTotalPrice,
}) => {
  const navigate = useNavigate();

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
  const amount = updatedTotalPrice ?? 0; // Ensure it's never undefined
  const [isGuest, setIsGuest] = useState<boolean>(true); // Ändra till false om användaren är inloggad
  const [userId] = useState<string>(""); // Lämna tom om `isGuest` är true
  const [paymentError, setPaymentError] = useState<string>("");
  

  const handleOrder = async () => {
    // Kontrollera att en betalmetod har valts
    if (!paymentMethod) {
      setPaymentError("Please select a payment method.");
      return;
    }

    // Om kortmetod är vald, kontrollera att alla kortuppgifter är ifyllda
    if (paymentMethod === "card" && (
      !cardDetails.cardNumber ||
      !cardDetails.expirationDate ||
      !cardDetails.cvv ||
      !cardDetails.cardholderName
    )) {
      setPaymentError("Please fill in all card details.");
      return;
    }

    // Bygg upp payload för backend
    const payload: any = {
      userId: isGuest ? "" : userId, // If guest, use an empty string instead of undefined
      orderId: `order-${Math.random().toString(36).substring(2, 15)}`,
      paymentMethod,
      amount,
      isGuest,
      updatedItems,
      updatedTotalPrice,
      cardDetails: paymentMethod === "card" ? cardDetails : undefined,
    };
    

    // Logga payload för att kontrollera att allt skickas korrekt
    console.log("Payload being sent:", payload);

    try {
      const response = await fetch(
        "https://3uhcgg5udg.execute-api.eu-north-1.amazonaws.com/payment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Response JSON:", result);

        // När betalningen lyckas, vidarebefordra till confirmation-sidan
        onPaymentSuccess({ updatedItems, updatedTotalPrice });

        // Stäng overlay när betalningen är klar
        onClose(); // Stänger overlayn
        navigate("/confirmation", {
          state: {
            orderId: payload.orderId, // Använd det genererade orderId
            updatedItems,
            updatedTotalPrice,
          },
        }); // Navigera till confirmation-sidan och skicka data
      } else {
        const error = await response.json();
        console.log("Error JSON:", error);
        setPaymentError(`Payment failed: ${error.error}`);
      }
    } catch (error) {
      console.error("Error during payment:", error);
      setPaymentError("An unexpected error occurred. Please try again.");
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
              onChange={(e) => {
                setPaymentMethod(e.target.value);
                setPaymentError(""); // Rensa tidigare fel
              }}
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
                  onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                />
                <input
                  type="text"
                  name="expirationDate"
                  placeholder="Expiration Date"
                  value={cardDetails.expirationDate}
                  onChange={(e) => setCardDetails({ ...cardDetails, expirationDate: e.target.value })}
                />
                <input
                  type="text"
                  name="cvv"
                  placeholder="CVV/CVC"
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                />
              </div>
            </div>
          )}
          {/* Andra betalalternativ */}
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="klarna"
              onChange={(e) => {
                setPaymentMethod(e.target.value);
                setPaymentError(""); // Rensa tidigare fel
              }}
            />
            <span>Klarna</span>
            <img src={Klarna} alt="Klarna Icon" className="klarna-icon" />
          </label>
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="paypal"
              onChange={(e) => {
                setPaymentMethod(e.target.value);
                setPaymentError(""); // Rensa tidigare fel
              }}
            />
            <span>PayPal</span>
            <img src={paypal} alt="PayPal Icon" className="paypal-icon" />
          </label>
        </div>

        {paymentError && <div className="error-message">{paymentError}</div>} {/* Visa felmeddelande */}

        <button onClick={() => { 
          onClose(); // Stäng overlayn
          navigate("/review/Order"); // Navigera tillbaka till ReviewOrder-sidan
        }} className="close-button">
          Close
        </button>

        <button onClick={handleOrder} className="order-button">
          Order
        </button>
      </div>
    </div>
  );
};

export default PaymentOverlay;
