import React, { useState } from 'react';
import { motion } from 'framer-motion'; // Importera motion från Framer Motion
import '../styles/HomePage.css';
import { Icon } from '@iconify/react';
import fingerTapLine from '@iconify-icons/mingcute/finger-tap-line';
import { useNavigate } from 'react-router-dom';
import pictureHomePage from '../assets/pictureHomePage.png';
import Carbonara from '../assets/CarbonaraClassic.png';
import CreamyAlfredo from '../assets/CreamyAlfredo.png';
import GardenPesto from '../assets/GardenPestoDelight.png';
import LemonChicken from '../assets/LemonHerbChickenPasta.png';
import Arrabbiata from '../assets/ArrabbiataPenne.png';

const reviews = [
  { name: 'John D.', comment: 'Amazing pasta! Will definitely order again.', stars: 5 },
  { name: 'Sarah K.', comment: 'The carbonara was so creamy and delicious!', stars: 4 },
  { name: 'Mike L.', comment: 'Fast delivery, and the food was still hot. Highly recommend!', stars: 5 },
  { name: 'Emma R.', comment: 'Pesto pasta is my new favorite! So fresh and tasty.', stars: 4 },
  { name: 'Lucas T.', comment: 'Absolutely loved the lemon chicken pasta, so flavorful!', stars: 5 },
  { name: 'Olivia M.', comment: 'A bit too salty for me, but still very good overall.', stars: 3 },
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  // Skapa en state för att hålla koll på vilket set av recensioner som visas
  const [currentIndex, setCurrentIndex] = useState(0);

  // Antal recensioner som visas åt gången
  const reviewsPerPage = 3;

  // Funktion för att navigera till nästa set av recensioner
  const nextReviews = () => {
    if (currentIndex + reviewsPerPage < reviews.length) {
      setCurrentIndex(currentIndex + reviewsPerPage);
    }
  };

  // Funktion för att navigera till föregående set av recensioner
  const prevReviews = () => {
    if (currentIndex - reviewsPerPage >= 0) {
      setCurrentIndex(currentIndex - reviewsPerPage);
    }
  };

  // Skapa en lista med recensioner som ska visas baserat på currentIndex
  const visibleReviews = reviews.slice(currentIndex, currentIndex + reviewsPerPage);

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
        <h2>Month's favorites</h2>
        <p>Discover the most popular dishes of the month.</p>

        <section className="menu-items">
          <img src={Arrabbiata} alt="Arrabbiata" className="arrabbiata-image" />
          <img src={CreamyAlfredo} alt="Creamy Alfredo" className="alfredo-image" />
          <img src={GardenPesto} alt="Garden Pesto" className="pesto-image" />
          <img src={LemonChicken} alt="Lemon Chicken" className="lemon-image" />
        </section>
      </article>

      <span className="cta-section">
        <p className="tagline3">"Order now and taste the difference."</p>
        <button className="menu-btn" onClick={() => navigate('/menu')}>Explore our full menu</button>
      </span>

      <section className="reviews">
        <h1>Reviews</h1>
        <h3>What our customers say</h3>

        <div className="reviews-container">
          
          <button className="arrow-btn left-arrow" onClick={prevReviews}>
            <Icon icon="mdi:chevron-left" />
          </button>

          {/* Använd motion.div för att animera recensionerna */}
          <div className="reviews-slider">
            {visibleReviews.map((review, index) => (
              <motion.div
                className="review-card"
                key={index}
                initial={{ opacity: 0, x: 100 }} // Börjar från höger och är osynlig
                animate={{ opacity: 1, x: 0 }} // Slutar på sin normala position och blir synlig
                transition={{ duration: 0.5, delay: index * 0.2 }} // Fördröjer varje kort lite för att skapa en sekventiell effekt
              >
                <p className="review-name">{review.name}</p>
                <p className="review-comment">{review.comment}</p>
                <div className="stars">
                  {'★'.repeat(review.stars)}{'☆'.repeat(5 - review.stars)}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Höger pil */}
          <button className="arrow-btn right-arrow" onClick={nextReviews}>
            <Icon icon="mdi:chevron-right" />
          </button>
        </div>
      </section>

      <div className="image-container">
        <img src={pictureHomePage} alt="Delicious food" className="homepage-image" />
      </div>
    </div>
  );
};

export default HomePage;
