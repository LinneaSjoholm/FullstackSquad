// src/components/Header.tsx
import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa'; // Importera både hamburgermenyn och krysset
import '../styles/Header.css';

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="header">
      {/* Hamburgermeny eller kryss beroende på menyns tillstånd */}
      <div className="menu-icon" onClick={toggleMenu}>
        {menuOpen ? <FaTimes /> : <FaBars />}  {/* Visar kryss om menyn är öppen, annars hamburgare */}
      </div>

      <h1>Gusto</h1>
      <p>To go</p>

      {/* Sidomeny */}
      <div className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <ul>
          <li>Home</li>
          <li>Menu</li>
          <li>About</li>
          <li>Contact</li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
