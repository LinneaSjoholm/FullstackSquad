import React from 'react';
import '../styles/HomePage.css';
import { Icon } from '@iconify/react';
import fingerTapLine from '@iconify-icons/mingcute/finger-tap-line';
import { useNavigate } from 'react-router-dom';
import pictureHomePage from '../assets/pictureHomePage.png'


const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container">

    <p className="tagline1">"Fresh flavors, fast delivery."</p>
    
      <div className="btn__container">
      <button className="account-btn">Create account</button>
      <button className="login-btn">Login</button>
      </div>

      <p className="tagline2">Hungry? Let's fix that.</p>
      <button className="takeaway-btn">
        Take away 
      </button>
      <Icon icon={fingerTapLine} className="icon"/>

      <span className="cta-section">
      <p className="tagline3">"Order now and taste the difference."</p>
      <button 
      className="menu-btn"
      onClick={() => navigate('/menu')}>
        Explore our full menu
      </button>
      </span>

      <div className="image-container">
        <img src={pictureHomePage} alt="Delicious food" className="homepage-image" />
      </div>

    </div>
  );
};

export default HomePage;
