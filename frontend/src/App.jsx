import React from 'react';
import './App.css';
import Menu from './components/menu'; // Importera Menu-komponenten

const App = () => {
  return (
    <div className="App">
      <h1>Welcome to the Takeaway Menu</h1>
      <Menu /> {/* Använd Menu-komponenten här */}
    </div>
  );
};

export default App;
