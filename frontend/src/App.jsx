import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import About from "./components/About";
import Contact from "./components/Contact";
import Confirmation from "./components/Confirmation";

const App = () => {
  return (
    <Router>
      <div className="app">
        {/* Header visas på alla sidor */}
        <Header />
        
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/confirmation" element={<Confirmation />} />
          </Routes>
        </main>

        {/* Footer visas på alla sidor */}
        <Footer />
      </div>
    </Router>
  );
};

export default App;
