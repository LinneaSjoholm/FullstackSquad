import React from 'react';
import StockStatus from '../../services/stockStatus';
import { getStockStatus } from '../../services/getStockStatus';

const StockDashboard: React.FC = () => {
  return (
    <div>
      <StockStatus />
    </div>
  );
};

export default StockDashboard;
