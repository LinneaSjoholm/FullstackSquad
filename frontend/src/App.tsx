import React from "react"; // Lägg till denna rad
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "./pages/Customer/Profile";
import Login from "./pages/Customer/Login";
import CreateAccount from "./pages/Customer/CreateAccount";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/customer/create-account" element={<CreateAccount />} />
        <Route path="/customer/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
};

export default App;
