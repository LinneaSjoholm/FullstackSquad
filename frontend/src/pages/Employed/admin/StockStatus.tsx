import React, { useEffect, useState } from 'react';
import '../../../styles/adminStockstatus.css';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../../components/navbar';

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

  if (error) {
    return <p className="stock-error">{error}</p>;
  }

  return (
    <>
    <Navbar />

    <div className="stock-dashboard-header-container">
    <h1 className="stock-dashboard-header">Stock Status</h1>
    <p className="stock-dashboard-description">
        Below is a list of all ingredients in stock, along with their current stock levels and associated dishes.
        The stock levels are color-coded to indicate the status of each ingredient.
      </p>
    </div>

    <div className="stock-dashboard-container">
      <div className="stock-table-wrapper">
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
    </div>
    </>
  );
};

export default StockStatus;
