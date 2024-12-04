import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      <h2>Welcome to the Home Page!</h2>
      <p>Explore our delicious menu by clicking below:</p>
      <Link to="/menu">
        <button>Go to Menu</button>
      </Link>
    </div>
  );
};

export default HomePage;
