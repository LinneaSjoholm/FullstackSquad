import React, { useState, useEffect } from 'react';
import '../../../styles/adminDashboard.css';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../../components/navbar';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [currentDateTime, setCurrentDateTime] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem('adminToken');

    if (!token) {
      navigate('/admin/login');
    }

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
  }, [navigate]);  // Lägg till navigate som dependency

  // Funktion för utloggning
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <>
      <Navbar />

      <div className="dashboard-container">
        <h1 className="dashboard-header">Dashboard</h1>
        <h2 className="dashboard-subheader">Welcome back!</h2>
        <p className="dashboard-date">{currentDateTime}</p>

        <ul className="dashboard-navigation">
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
            className="dashboard-item"
            onClick={() => navigate('/admin/stock')}>
            Stock
          </li>

          <li
            className="dashboard-item logout"
            onClick={handleLogout}>
            Log out
          </li>
        </ul>
      </div>
    </>
  );
};

export default Dashboard;
