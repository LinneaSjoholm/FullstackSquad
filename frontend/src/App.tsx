import React from "react"; // Lägg till denna rad
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "./pages/Customer/Profile";
import Login from "./pages/Customer/Login";
import CreateAccount from "./pages/Customer/CreateAccount";
import LoginAdmin from "./pages/Employed/Login";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/customer/create-account" element={<CreateAccount />} />
        <Route path="/user/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin/login" element={<LoginAdmin />} />
      </Routes>
    </Router>
  );
};

export default App;
