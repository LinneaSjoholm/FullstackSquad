import React from 'react';

interface OrderRowProps {
  orderId: string;
  dishName?: string;
  messageToChef?: string;
  locked?: boolean;
  onLock?: (orderId: string) => void;
}

const OrderRow: React.FC<OrderRowProps> = ({ orderId, dishName, messageToChef, locked = false, onLock }) => {
  return (
    <div>
      <h3>Order ID: {orderId}</h3>
      <p>Dish Name: {dishName}</p>
      <p>Message to Chef: {messageToChef}</p>

      {!locked && onLock && (
        <button onClick={() => onLock(orderId)}>Lock Order</button>
      )}
      {locked && <span>Order is locked</span>}
    </div>
  );
};

export default OrderRow;
