import React from "react";
import { useNavigate } from "react-router-dom";
import '../styles/navbar.css';

export const Navbar: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="navbar">
        <ul className="navbar-links">
            <li
            className="navbar-item"
            onClick={() => navigate("/admin/menu")}
            >
            Menu
            </li>
    
            <li
            className="navbar-item"
            onClick={() => navigate("/admin/stock")}
            >
            Stockstatus
            </li>
    
            <li
            className="navbar-item"
            onClick={() => navigate("/admin/orders")}
            >
            Orders
            </li>
        </ul>
        </div>
    );
    };