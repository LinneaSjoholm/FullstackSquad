import React from "react"; // Lägg till denna rad
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "./pages/Customer/Profile";
import Login from "./pages/Customer/Login";
import CreateAccount from "./pages/Customer/CreateAccount";
import LoginAdmin from "./pages/Employed/Login";
import PaymentTest from "./pages/PaymentTest";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/customer/create-account" element={<CreateAccount />} />
        <Route path="/user/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin/login" element={<LoginAdmin />} />
        <Route path="/payment-test" element={<PaymentTest />} /> 
      </Routes>
    </Router>
  );
};

export default App;
