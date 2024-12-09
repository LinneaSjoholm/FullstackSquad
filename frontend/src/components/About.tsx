import React from "react";
import "../styles/About.css/";



const About: React.FC = () => {
  return (
    <div className="container">
        <div className="about-message">
          <h2>About Us</h2>
          <h3>Our Story</h3>
        </div>
      {/* Main Content */}
      <main className="content">
        {/* Our Story Section */}
        <section className="story-section">
          <div className="story-content">
            <p>
                At Gusto To Go, we believe in serving only the best pasta, made
                with love and the finest ingredients. Our journey began with a
                simple mission: to bring the authentic taste of Italy straight to
                your door, quickly and conveniently. We’re passionate about
                creating meals that make you feel like you’re dining in a cozy
                Italian trattoria — but with the ease of delivery right to your
                home.
            </p>
          </div>
        </section>

        {/* Team Section */}
        <section className="team-section">
          <h3>Meet the Team Behind Gusto To Go</h3>
          <div className="team-members">
            {/* Emma */}
            <div className="team-card">
                <div className="Photo-emma">
                    <img src="path_to_emma_image.jpg" alt="Emma" className="team-photo" />
                </div>
                    <div className="team-description">
                        <p>
                            I’m Emma, a passionate and goal-driven CEO to innovation,
                            sustainability, and building successful teams.
                        </p>
                    </div>
            </div>

            {/* Linnea */}
            <div className="team-card">
              <img src="path_to_linnea_image.jpg" alt="Linnea" className="team-photo" />
              <p className="team-description">
                Linnea is a dedicated restaurant manager passionate about food,
                service, team leadership, and creating memorable guest
                experiences.
              </p>
            </div>

            {/* Lam */}
            <div className="team-card">
              <img src="path_to_lam_image.jpg" alt="Lam" className="team-photo" />
              <p className="team-description">
                Lam is a driven restaurant leader excelling in team management,
                operational efficiency, and delivering outstanding dining
                experiences.
              </p>
            </div>

            {/* Victoria */}
            <div className="team-card">
              <img src="path_to_victoria_image.jpg" alt="Victoria" className="team-photo" />
              <p className="team-description">
                Victoria is an inspiring restaurant manager who thrives on
                fostering teamwork, enhancing guest satisfaction, and
                maintaining exceptional service standards.
              </p>
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="vision-section">
          <h3>Our Vision & Values</h3>
          <p>
            We strive to offer delicious, high-quality meals that cater to
            every taste and dietary need. Whether you’re searching for a
            gluten-free alternative or craving a creamy Alfredo, at Gusto To
            Go, you’ll always find a dish that suits your preferences. Our
            mission is simple: to make sure that every customer enjoys a fresh,
            satisfying meal every time.
          </p>
        </section>
      </main>

      
    </div>
  );
};

export default About;
