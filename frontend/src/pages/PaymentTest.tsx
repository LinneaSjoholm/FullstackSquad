import React, { useState } from "react";
import PaymentOverlay from "../components/PaymentOverlay";

const PaymentTest = () => {
  const [showOverlay, setShowOverlay] = useState(false);

  const handleOpenOverlay = () => {
    setShowOverlay(true);
  };

  const handleCloseOverlay = () => {
    setShowOverlay(false);
  };

  return (
    <div>
      <h1>Test Payment Overlay</h1>
      <button onClick={handleOpenOverlay}>Open Payment Overlay</button>
      {showOverlay && <PaymentOverlay onClose={handleCloseOverlay} />}
    </div>
  );
};

export default PaymentTest;