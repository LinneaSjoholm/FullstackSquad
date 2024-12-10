import React from 'react';
import '../../styles/Contact.css';

const Contact: React.FC = () => {
  return (
    <div className="contact-container">
      <div className="map-section">
        <h2>Find us</h2>
        <div className="map">
          <iframe
            title="Gusto Italiano Location"
            src="https://www.google.com/maps/embed?pb=YOUR_MAP_EMBED_URL"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
        <h3>Contact Us</h3>
        <div className="contact-details">
          <div>
            <span>📞</span> +123 456 7890
          </div>
          <div>
            <span>📍</span> Gusto road 2
          </div>
        </div>
      </div>

      <div className="form-section">
        <h2>Send Us Your Inquiry</h2>
        <p>– We’ll Get Back to You Soon!</p>
        <form className="contact-form">
          <input type="text" placeholder="Name" required />
          <input type="email" placeholder="Email" required />
          <input type="tel" placeholder="Number" required />
          <textarea placeholder="Write something" rows={5} required></textarea>
          <button className='submit-button' type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
