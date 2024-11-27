import React, { useState, useEffect } from 'react';

const Menu = () => {
  const [menu, setMenu] = useState([]);  // För att lagra menyn
  const [error, setError] = useState(null);  // För felmeddelanden

  // Hämta menyn från API:t
  const fetchMenu = async () => {
    try {
<<<<<<< HEAD
      const response = await fetch('https://i67oq9iy06.execute-api.eu-north-1.amazonaws.com/menu', {
=======
      const response = await fetch('https://anq217szle.execute-api.eu-north-1.amazonaws.com/dev/menu', {
>>>>>>> origin/dev
        method: 'GET',
        headers: {
          'x-api-key': 'bsQFNKDT2O4oIwmBc0FmN3KpwgIFc23L6lpdrrUT',  // Din API-nyckel
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Error ${response.status}: ${errorMessage}`);
      }

      const data = await response.json();
      setMenu(data);  // Uppdatera menyn
    } catch (err) {
      console.error('Failed to fetch menu:', err);
      setError('Failed to fetch menu');
    }
  };

  // Körs när komponenten mountas
  useEffect(() => {
    fetchMenu();
  }, []);

  // Rendera menyn
  return (
    <div>
      <h2>Menu</h2>
      {error ? (
        <p>Error: {error}</p>
      ) : (
        <ul>
          {menu.length > 0 ? (
            menu.map((item) => (
              <li key={item.id}>
                {item.name} - {item.price} SEK
              </li>
            ))
          ) : (
            <p>Loading menu...</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default Menu;
