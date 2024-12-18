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
    <div className="homepage-container">
      <p className="homepage-tagline1">"Fresh flavors, fast delivery."</p>

      <div className="homepage-btn-container">
        <div className='homepage-btn-section'>
        <button className="homepage-account-btn" onClick={() => navigate('/user/create')}>Create account</button>
        <button className="homepage-login-btn" onClick={() => navigate('/user/login')}>Login</button>
        </div>
      </div>

      <p className="homepage-tagline2">Hungry? Let's fix that.</p>

      <button className="homepage-takeaway-btn" onClick={() => navigate('/menu')}>Take away</button>
      <Icon icon={fingerTapLine} className="homepage-icon" />

      <article className="homepage-months-favorites">
  <span className="homepage-header-dishes1">
    <h2>Month's favorites</h2>
  </span>
  <p>Discover the most popular dishes of the month.</p>
  <section className="homepage-menu-items">
    <div className="homepage-dish">
      <img src={Arrabbiata} alt="Arrabbiata" className="homepage-dish-image" />
      <p className="homepage-dish-info">Arrabbiata Penne - $11.99</p>
    </div>
    <div className="homepage-dish">
      <img src={CreamyAlfredo} alt="Creamy Alfredo" className="homepage-dish-image" />
      <p className="homepage-dish-info">Creamy Alfredo - $10.99</p>
    </div>
    <div className="homepage-dish">
      <img src={GardenPesto} alt="Garden Pesto" className="homepage-dish-image" />
      <p className="homepage-dish-info">Garden Pesto - $9.99</p>
    </div>
    <div className="homepage-dish">
      <img src={LemonChicken} alt="Lemon Chicken" className="homepage-dish-image" />
      <p className="homepage-dish-info">Lemon Herb - $13.49</p>
    </div>
  </section>
</article>

<article className="homepage-customers-favorites">
  <span className="homepage-header-dishes2">
    <h2>Our customers favorites</h2>
  </span>
  <section className="homepage-customers-items">
    <div className="homepage-dish">
      <img src={Tortellini} alt="Tortellini" className="homepage-dish-image" />
      <p className="homepage-dish-info">Tortellini - $12.49</p>
    </div>
    <div className="homepage-dish">
      <img src={CreamyAlfredo} alt="Creamy Alfredo" className="homepage-dish-image" />
      <p className="homepage-dish-info">Creamy Alfredo - $10.99</p>
    </div>
  </section>
</article>

      <section className="homepage-reviews">
        <h1>Reviews</h1>
        <h4>What our customers say</h4>

        <div className="homepage-reviews-container">
          <div className="homepage-reviews-content">
            {reviews.slice(0, 4).map((review, index) => (
              <div className="homepage-review-card" key={index}>
                <p className="homepage-review-name">{review.name}</p>
                <p className="homepage-review-comment">{review.comment}</p>
                <div className="homepage-stars">
                  {'★'.repeat(review.stars)}{'☆'.repeat(5 - review.stars)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="homepage-cta-section">
        <h1 className="homepage-tagline3">Order now and taste the difference</h1>
        <button className="homepage-menu-btn" onClick={() => navigate('/menu')}>Explore our full menu</button>
        <Icon icon={fingerTapLine} className="homepage-icon2" />
      </div>

      <div className="homepage-image-container">
        <img src={pictureHomePage} alt="Delicious food" className="homepage-homepage-image" />
      </div>
    </div>
  );
};

export default HomePage;
