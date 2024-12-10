import React from "react";
import "../styles/Footer.css";
import { FaFacebook, FaInstagram } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      {/* Adress Sektion */}
      <address>
        123 Flavor Street <br />
        Food City <br />
        +123 456 789
      </address>

      <div className="social-icons">
        <a href="https://www.facebook.com" className="social-icon" target="_blank" rel="noopener noreferrer">
          <FaFacebook style={{ fontSize: '2rem', color: '#4267B2' }} />
        </a>
        <a href="https://www.instagram.com" className="social-icon" target="_blank" rel="noopener noreferrer">
          <FaInstagram style={{ fontSize: '2rem', color: '#E1306C' }} />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
