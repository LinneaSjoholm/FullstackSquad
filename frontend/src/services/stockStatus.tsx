import React, { useEffect, useState } from 'react';

const StockStatus = () => {
  const [stockStatus, setStockStatus] = useState<any>(null);

  useEffect(() => {
    const fetchStockStatus = async () => {
      try {
        const response = await fetch('https://8yanxxf6q0.execute-api.eu-north-1.amazonaws.com/admin/stock-status', {
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

  if (!stockStatus) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Stock Status</h1>
      <ul style={{ paddingLeft: '20px' }}>
        {stockStatus.map((item: any, index: number) => (
          <li
            key={index}
            style={{
              marginBottom: '15px',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              backgroundColor: '#0000',
            }}
          >
            <h3 style={{ margin: '0' }}>{item.name}</h3>
            <p><strong>Stock:</strong> {item.stock !== 'NaN' ? item.stock : 'Out of Stock'}</p> {/* Hantera "NaN"*/}
            <p><strong>Dish Names:</strong> {item.dishNames ? item.dishNames.join(', ') : 'No dishes available'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StockStatus;
