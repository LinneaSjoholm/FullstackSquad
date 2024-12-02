import React from 'react';
import About from './About'; // Importera About-komponenten
import Confirmation from './Confirmation'; // Importera Confirmation-komponenten
import Contact from './Contact'; // Importera Contact-komponenten
import Menu from './menu'; // Importera Menu-komponenten
import './App.css';


const App = () => {
  return (
    <div>
      <header>
        <h1>Welcome to Our App</h1>
      </header>
      
      <main>
        <section>
          <h2>About</h2>
          <About />
        </section>

        <section>
          <h2>Confirmation</h2>
          <Confirmation />
        </section>

        <section>
          <h2>Contact</h2>
          <Contact />
        </section>
      </main>
    </div>
  );
};

export default App;
