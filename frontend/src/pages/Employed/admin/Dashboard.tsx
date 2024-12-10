import React, { useState, useEffect } from 'react';
import '../../../styles/adminDashboard.css';
import { useNavigate } from 'react-router-dom';


const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [currentDateTime, setCurrentDateTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedTime = now.toLocaleString('sv-SE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setCurrentDateTime(formattedTime);
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000); 

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-header">Dashboard</h1>
      <p className="dashboard-date">{currentDateTime}</p>
      <ul className="dashboard-navigation">
        <li
          className="dashboard-item"
          onClick={() => navigate('/admin/stock')}>
          Stock
        </li>
        <li
          className="dashboard-item"
          onClick={() => navigate('/admin/orders')}>
          Orders
        </li>
        <li
          className="dashboard-item"
          onClick={() => navigate('/admin/menu')}>
          Menu
        </li>
        <li
          className="dashboard-item logout"
          onClick={() => navigate('/admin/logout')}>
          Log out
        </li>
      </ul>
    </div>
  );
};

export default Dashboard;
