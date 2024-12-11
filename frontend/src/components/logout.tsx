import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Ta bort token från localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userName');

    // Navigera till login-sidan efter utloggning
    navigate('/user/login'); // Omdirigera användaren till login
  };

  return (
    <div>
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
};

export default Logout;
