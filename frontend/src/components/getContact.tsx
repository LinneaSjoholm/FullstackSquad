import React, { useState, useEffect } from 'react';

const Contact = () => {
  const [contactData, setContactData] = useState<null | { name: string; email: string; phone: string }>(null);
  const [error, setError] = useState<string | null>(null);

  // Hämta data från API:t
  const fetchContact = async () => {
    try {
      const response = await fetch('https://5g1yvg1h5a.execute-api.eu-north-1.amazonaws.com/contact', {
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
      setContactData(data); // Uppdatera state med hämtad data
    } catch (err) {
      console.error('Failed to fetch contact data:', err);
      setError('Failed to fetch contact data');
    }
  };

  // Körs när komponenten mountas
  useEffect(() => {
    fetchContact();
  }, []);

  // Rendera data
  return (
    <div>
      <h2>Contact Information</h2>
      {error ? (
        <p>Error: {error}</p>
      ) : contactData ? (
        <div>
          <p><strong>Name:</strong> {contactData.name}</p>
          <p><strong>Email:</strong> {contactData.email}</p>
          <p><strong>Phone:</strong> {contactData.phone}</p>
        </div>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default Contact;
