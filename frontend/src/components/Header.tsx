// src/components/Header.tsx
import React from 'react';
import '../styles/Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <h1>Gusto</h1>
      <h2>To Go</h2>
      {/* Här kan du lägga till meny, ikon eller andra element */}
    </header>
  );
};

export default Header;