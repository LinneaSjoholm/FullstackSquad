import React, { useEffect, useState } from 'react';
import '../../../styles/adminStockstatus.css';
import { useNavigate } from 'react-router-dom';

interface StockItem {
  id: string;
  name: string;
  stock: number;
  unit: string;
  dishNames: string[];
}

const StockStatus: React.FC = () => {
  const navigate = useNavigate();
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await fetch('https://8yanxxf6q0.execute-api.eu-north-1.amazonaws.com/admin/stock-status');
        const data = await response.json();

        if (response.ok) {
          setStockItems(data);
          setError(null);
        } else {
          setError(data.message || 'Failed to fetch stock data');
        }
      } catch (err) {
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, []);

  if (loading) {
    return <p className="stock-loading">Loading stock data...</p>;
  }

  if (error) {
    return <p className="stock-error">{error}</p>;
  }

  return (
    <div className="stock-dashboard-container">

      <div className="navbar">
        <ul className="navbar-links">
          <li 
          className="navbar-item"
          onClick={() => navigate('/admin/menu')}>
            Menu
            </li>
          
          <li 
          className="navbar-item"
          onClick={() => navigate('/admin/stock')}>
            Stockstatus
            </li>
          
          <li 
          className="navbar-item"
          onClick={() => navigate('/admin/orders')}>Orders</li>
        </ul>
      </div>

      <h1 className="stock-dashboard-header">Stock Status</h1>
      <table className="stock-table">
        <thead>
          <tr>
            <th>Ingredient</th>
            <th>Stock</th>
            <th>Unit</th>
            <th>Associated Dishes</th>
          </tr>
        </thead>
        <tbody>
          {stockItems.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td
                className={
                  item.stock <= 5
                    ? 'stock-status-critical'
                    : item.stock <= 10
                    ? 'stock-status-low'
                    : 'stock-status-sufficient'
                }
              >
                {item.stock}
              </td>
              <td>{item.unit}</td>
              <td>{item.dishNames.length > 0 ? item.dishNames.join(', ') : 'None'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockStatus;
