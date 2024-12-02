import React, { useState, useEffect } from 'react';

const About = () => {
  const [aboutData, setAboutData] = useState<null | { title: string; description: string }>(null);
  const [error, setError] = useState<string | null>(null);

  // Hämta data från API:t
  const fetchAbout = async () => {
    try {
      const response = await fetch('https://https://5g1yvg1h5a.execute-api.eu-north-1.amazonaws.com/about', {
        method: 'GET',
        headers: {
          'x-api-key': 'VL0J9uv7ql9adOK44gxM37L4PpTwxqDTA3tWFLu7', // Din API-nyckel
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Error ${response.status}: ${errorMessage}`);
      }

      const data = await response.json();
      setAboutData(data); // Uppdatera state med hämtad data
    } catch (err) {
      console.error('Failed to fetch about data:', err);
      setError('Failed to fetch about data');
    }
  };

  // Körs när komponenten mountas
  useEffect(() => {
    fetchAbout();
  }, []);

  // Rendera data
  return (
    <div>
      <h2>About Us</h2>
      {error ? (
        <p>Error: {error}</p>
      ) : aboutData ? (
        <div>
          <h3>{aboutData.title}</h3>
          <p>{aboutData.description}</p>
        </div>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default About;
