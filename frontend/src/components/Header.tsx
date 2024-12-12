import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import '../styles/Header.css';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <header className="header">
      
      <div className="menu-icon" onClick={toggleMenu}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

      <h1>Gusto</h1>
      <p>To go</p>

      <div className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <ul>
          <li onClick={() => handleNavigation('/')}>Home</li>
          <li onClick={() => handleNavigation('/menu')}>Menu</li>
          <li onClick={() => handleNavigation('/about')}>About</li>
          <li onClick={() => handleNavigation('/contact')}>Contact</li>
          <li onClick={() => handleNavigation('/profile')}>Profile</li>

        </ul>
      </div>
    </header>
  );
};

export default Header;
