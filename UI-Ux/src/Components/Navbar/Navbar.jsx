import React, { useState, useEffect } from "react";
import { FaSignInAlt } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";

import "./Navbar.css";

const Navbar = () => {
  // Categories removed from navbar per request.
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);

    // Listen for storage changes (login/logout from other tabs)
    const handleStorageChange = () => {
      const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
      setIsLoggedIn(!!token);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    window.location.href = "/signin";
  };

  return (
    <nav className="navbar bg-zinc-900">
      <div className="logo-container">
        <Link to="/" aria-label="Go to home">
          <button className="logo-btn">
            <img
              src="/logoo.png"
              alt="Japanee Logo"
              className="logo-image"
            />
          </button>
        </Link>
      </div>

      <ul className="nav-links">
        <li><Link to="/" className={isActive("/") ? "active" : ""}>Home</Link></li>
        <li><Link to="/products" className={isActive("/products") ? "active" : ""}>Products</Link></li>
        <li><a href="/#about">About</a></li>
        <li><a href="/#services">Service</a></li>
        <li><a href="/#contact">Contact Us</a></li>
        <li>
          <Link to="/cart" aria-label="View cart">
            <img
              src="/Cart.png"
              alt="Cart"
              className="cart-icon rounded-full"
            />
          </Link>
        </li>
        {/* Categories intentionally not displayed */}
      </ul>
      
      <div className="navbar-right">
        {!isLoggedIn && (
          <Link to="/signin">
            <button className="sign-in-btn">
              <FaSignInAlt style={{ marginRight: "8px" }} />
              Sign In
            </button>
          </Link>
        )}
        {isLoggedIn && <Sidebar />}
      </div>
    </nav>
  );
};

export default Navbar;
