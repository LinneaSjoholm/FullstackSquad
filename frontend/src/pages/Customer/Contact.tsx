import React from 'react';
import '../../styles/Contact.css';

const Contact: React.FC = () => {
  return (
    <div className="contact-container">
      <div className="contact-map-section">
        <h2>Find us</h2>
        <div className="contact-map">
          <iframe
            title="Gusto Italiano Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3934.4079535343853!2d100.02525747594865!3d9.560057156043452!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3054f08c0f703447%3A0x5ac875dc556675b7!2sGusto%20Italiano!5e0!3m2!1ssv!2s!4v1733894668612!5m2!1ssv!2s"
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

      <div className="contact-form-section">
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

