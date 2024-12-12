import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import '../styles/navbar.css';

export const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Använd useLocation för att få aktuell väg

    // En funktion som kollar om den aktuella vägen matchar länken
    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="navbar">
            <ul className="navbar-links">
                <li
                    className={`navbar-item ${isActive("/admin/dashboard") ? "active" : ""}`}
                    onClick={() => navigate("/admin/dashboard")}
                >
                    Dashboard
                </li>
                <li
                    className={`navbar-item ${isActive("/admin/orders") ? "active" : ""}`}
                    onClick={() => navigate("/admin/orders")}
                >
                    Orders
                </li>
                <li
                    className={`navbar-item ${isActive("/admin/menu") ? "active" : ""}`}
                    onClick={() => navigate("/admin/menu")}
                >
                    Menu
                </li>
                <li
                    className={`navbar-item ${isActive("/admin/stock") ? "active" : ""}`}
                    onClick={() => navigate("/admin/stock")}
                >
                    Stock
                </li>

            </ul>
        </div>
    );
};
