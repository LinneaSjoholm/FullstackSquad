import React from "react"; // Lägg till denna rad
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "./pages/Customer/Profile";
import Login from "./pages/Customer/Login";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/customer/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
};

export default App;
