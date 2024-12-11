import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HomePage.css';
import { Icon } from '@iconify/react';
import fingerTapLine from '@iconify-icons/mingcute/finger-tap-line';
import pictureHomePage from '../assets/pictureHomePage.png';
import CreamyAlfredo from '../assets/CreamyAlfredo.png';
import GardenPesto from '../assets/GardenPestoDelight.png';
import LemonChicken from '../assets/LemonHerbChickenPasta.png';
import Arrabbiata from '../assets/ArrabbiataPenne.png';
import Tortellini from '../assets/FourCheeseTortellini.png';

const reviews = [
  { name: 'John D.', comment: 'Amazing pasta! Will definitely order again.', stars: 5 },
  { name: 'Sarah K.', comment: 'The carbonara was so creamy and delicious!', stars: 4 },
  { name: 'Mike L.', comment: 'Fast delivery, and the food was still hot. Highly recommend!', stars: 5 },
  { name: 'Emma R.', comment: 'Pesto pasta is my new favorite! So fresh and tasty.', stars: 4 },
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <p className="tagline1">"Fresh flavors, fast delivery."</p>

      <div className="btn__container">
        <button className="account-btn" onClick={() => navigate('/user/create')}>Create account</button>
        <button className="login-btn" onClick={() => navigate('/user/login')}>Login</button>
      </div>

      <p className="tagline2">Hungry? Let's fix that.</p>

      <button className="takeaway-btn" onClick={() => navigate('/menu')}>Take away</button>
      <Icon icon={fingerTapLine} className="icon" />

      <article className="months-favorites">
        <span className="header-dishes1">
          <h2>Month's favorites</h2>
        </span>
        <p>Discover the most popular dishes of the month.</p>
        <section className="menu-items">
          <img src={Arrabbiata} alt="Arrabbiata" className="dish-image" />
          <img src={CreamyAlfredo} alt="Creamy Alfredo" className="dish-image" />
          <img src={GardenPesto} alt="Garden Pesto" className="dish-image" />
          <img src={LemonChicken} alt="Lemon Chicken" className="dish-image" />
        </section>
      </article>

      <article className="customers-favorites">
        <span className="header-dishes2">
          <h2>Our customers favorites</h2>
        </span>
        <section className="customers-items">
          <img src={Tortellini} alt="Tortellini" className="dish-image" />
          <img src={CreamyAlfredo} alt="Creamy Alfredo" className="dish-image" />
        </section>
      </article>

      <section className="reviews">
        <h1>Reviews</h1>
        <h4>What our customers say</h4>

        <div className="reviews-container">
          <div className="reviews-content">
            {reviews.slice(0, 4).map((review, index) => (
              <div className="review-card" key={index}>
                <p className="review-name">{review.name}</p>
                <p className="review-comment">{review.comment}</p>
                <div className="stars">
                  {'★'.repeat(review.stars)}{'☆'.repeat(5 - review.stars)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="cta-section">
        <h1 className="tagline3">Order now and taste the difference</h1>
        <button className="menu-btn" onClick={() => navigate('/menu')}>Explore our full menu</button>
        <Icon icon={fingerTapLine} className="icon2" />
      </div>

      <div className="image-container">
        <img src={pictureHomePage} alt="Delicious food" className="homepage-image" />
      </div>
    </div>
  );
};

export default HomePage;
