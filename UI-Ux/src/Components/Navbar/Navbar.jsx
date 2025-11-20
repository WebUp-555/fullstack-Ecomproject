import React from "react";
import { FaSignInAlt } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import LogoutButton from "./LogoutButton.jsx";

import "./Navbar.css";

const Navbar = () => {
  // Categories removed from navbar per request.

  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
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
        <Link to="/signin">
          <button className="sign-in-btn">
            <FaSignInAlt style={{ marginRight: "8px" }} />
            Sign In
          </button>
        </Link>
        <LogoutButton />
      </div>
    </nav>
  );
};

export default Navbar;
