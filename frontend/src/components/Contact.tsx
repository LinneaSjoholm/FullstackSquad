import React, { useState, useEffect } from 'react';
import '../styles/Contact.css';



  // Rendera data
  return Contact: React.FC (
    <div>
      <h2>Contact Information</h2>
      {error ? (
        <p>Error: {error}</p>
      ) : contactData ? (
        <div>
          <p><strong>Name:</strong></p>
          <p><strong>Email:</strong></p>
          <p><strong>Phone:</strong></p>
        </div>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default Contact;
