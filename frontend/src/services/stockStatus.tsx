// Frontend-funktion (React exempel)
import React, { useEffect, useState } from 'react';

const StockStatus = () => {
  const [stockStatus, setStockStatus] = useState<any>(null);

  useEffect(() => {
    const fetchStockStatus = async () => {
      try {
        const response = await fetch('/admin/stock-status', {
          method: 'GET',
          headers: {
            'x-api-key': 'bsQFNKDT2O4oIwmBc0FmN3KpwgIFc23L6lpdrrUT', 
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setStockStatus(data);
        } else {
          console.error('Failed to fetch stock status');
        }
      } catch (error) {
        console.error('Error fetching stock status:', error);
      }
    };

    fetchStockStatus();
  }, []);

  return (
    <div>
      <h1>Stock Status</h1>
      <pre>{JSON.stringify(stockStatus, null, 2)}</pre>
    </div>
  );
};

export default StockStatus;
