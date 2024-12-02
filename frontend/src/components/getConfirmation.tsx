import React, { useState, useEffect } from 'react';

const Confirmation = () => {
  const [confirmationData, setConfirmationData] = useState<null | { message: string; details: string }>(null);
  const [error, setError] = useState<string | null>(null);

  // Hämta data från API:t
  const fetchConfirmation = async () => {
    try {
      const response = await fetch('https://https://5g1yvg1h5a.execute-api.eu-north-1.amazonaws.com/confirmation', {
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
      setConfirmationData(data); // Uppdatera state med hämtad data
    } catch (err) {
      console.error('Failed to fetch confirmation data:', err);
      setError('Failed to fetch confirmation data');
    }
  };

  // Körs när komponenten mountas
  useEffect(() => {
    fetchConfirmation();
  }, []);

  // Rendera data
  return (
    <div>
      <h2>Confirmation</h2>
      {error ? (
        <p>Error: {error}</p>
      ) : confirmationData ? (
        <div>
          <h3>{confirmationData.message}</h3>
          <p>{confirmationData.details}</p>
        </div>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default Confirmation;
