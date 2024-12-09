import React from "react";
import "../styles/Footer.css";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      {/* Adress Sektion */}
      <address>
        123 Flavor Street <br />
        Food City <br />
        +123 456 789
      </address>

      {/* Sociala Ikoner Sektion */}
      <div className="social-icons">
        <a href="#" className="social-icon">Facebook</a>
        <a href="#" className="social-icon">Instagram</a>
      </div>
    </footer>
  );
};

export default Footer;
