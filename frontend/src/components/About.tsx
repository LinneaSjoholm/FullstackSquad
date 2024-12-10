import React from "react";
import "../styles/About.css/";



const About: React.FC = () => {
  return (
    <div className="container">
        <div className="about-message">
          <h1>About Us</h1>
          <h3>Our Story</h3>
        </div>
      {/* Main Content */}
      <main className="content">
        {/* Our Story Section */}
        <section className="story-section">
          <div className="story-content">
            <p>
            At Gusto To Go, we believe in serving only the best pasta, made with love and the finest ingredients. Our journey began with a simple mission: to bring the authentic taste of Italy straight to your door, quickly and conveniently. We’re passionate about creating meals that make you feel like you're dining in a cozy Italian trattoria — but with the ease of delivery right to your home.
            </p>
          </div>
        </section>

        {/* Team Section */}
        <section className="team-section">
          <h3>Meet the Team Behind Gusto To Go</h3>
          <div className="team-members">
            {/* Emma */}
            <div className="team-card">
              <img src="../images/Emma.jpg" alt="Emma" className="team-photo" />
              <p className="team-description">
                I’m Emma, a passionate and goal-driven CEO committed to innovation, sustainability, and building successful teams. I strive to inspire growth, foster collaboration, drive impactful change, implement visionary strategies, and empower individuals to reach their full potential, ensuring long-term success and creating meaningful contributions to both the organization and the wider community.
              </p>
            </div>

            {/* Linnea */}
            <div className="team-card">
              <img src="../images/Linnea.jpg" alt="Linnea" className="team-photo" />
              <p className="team-description">
              Linnea is a dedicated restaurant manager passionate about food, service, team leadership, and creating memorable guest experiences. She consistently fosters a positive work environment, motivates her team to achieve excellence, implements innovative service strategies, ensures operational efficiency, and maintains the highest standards of quality and presentation. Linnea thrives on exceeding guest expectations, building strong customer relationships, and driving team collaboration to deliver seamless, unforgettable dining experiences that leave a lasting impression on every guest.
              </p>
            </div>

            {/* Lam */}
            <div className="team-card">
              <img src="../images/Lam.jpg" alt="Lam" className="team-photo" />
              <p className="team-description">
              Lam is a driven restaurant leader excelling in team management, operational efficiency, and delivering outstanding dining experiences, consistently achieving high customer satisfaction, boosting employee morale, ensuring exceptional operational standards, fostering innovation, increasing revenue, and maintaining a strong commitment to quality and excellence in every aspect of the business.
              </p>
            </div>

            {/* Victoria */}
            <div className="team-card">
              <img src="../images/Victoria.jpg" alt="Victoria" className="team-photo" />
              <p className="team-description">
              Victoria is an inspiring restaurant manager who thrives on fostering teamwork, enhancing guest satisfaction, and maintaining exceptional service standards, while driving operational efficiency, mentoring team members, implementing innovative strategies, exceeding performance goals, and cultivating a positive, customer-focused environment that ensures memorable dining experiences and long-term success for the business.
              </p>
            </div>
          </div>
        </section>

        <section className="meet-the-team-section">
          <h3>Meet the Team Behind Gusto To Go</h3>
          <p>
          Our team is what makes Gusto To Go special. From our talented chefs who create each dish with care, to our dedicated delivery drivers who bring your order straight to you, every member of our team is passionate about delivering the best experience possible. We work hard to ensure your satisfaction — every plate, every order, every time.
          </p>
        </section>

        
        <section className="vision-section">
          <h3>Our Vision & Values</h3>
          <p>
          We strive to offer delicious, high-quality meals that cater to every taste and dietary need. Whether you're searching for a gluten-free alternative or craving a creamy Alfredo, at Gusto To Go, you’ll always find a dish that suits your preferences. Our mission is simple: to make sure that every customer enjoys a fresh, satisfying meal every time.
          </p>
        </section>
      </main>
    </div>
  );
};

export default About;
