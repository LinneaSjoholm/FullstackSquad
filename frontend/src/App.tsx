import React from "react"; // Lägg till denna rad
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "./pages/Customer/Profile";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
};

export default App;
