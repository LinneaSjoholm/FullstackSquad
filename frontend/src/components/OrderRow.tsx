import React from 'react';

interface OrderRowProps {
  orderId: string;
  locked?: boolean;
  onLock?: (orderId: string) => void; 
}

const OrderRow: React.FC<OrderRowProps> = ({ orderId, locked = false, onLock }) => {
  return (
    <div>
      <h3>Order ID: {orderId}</h3>
      {!locked && onLock && (
        <button onClick={() => onLock(orderId)}>Lock Order</button>
      )}
      {locked && <span>Order is locked</span>}
    </div>
  );
};

export default OrderRow;