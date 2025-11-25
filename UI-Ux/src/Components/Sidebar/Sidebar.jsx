import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleChangePassword = () => {
    navigate('/change-password');
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/users/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        localStorage.removeItem('user');
        navigate('/signin');
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        <span className="hamburger-icon">☰</span>
      </button>

      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <button className="sidebar-close" onClick={toggleSidebar}>
          ×
        </button>

        <div className="sidebar-content">
          <h2>Account Settings</h2>
          
          <ul className="sidebar-menu">
            <li onClick={handleChangePassword}>
              <span className="icon">🔒</span>
              Change Password
            </li>
            <li onClick={handleLogout}>
              <span className="icon">🚪</span>
              Logout
            </li>
          </ul>
        </div>
      </div>

      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
    </>
  );
};

export default Sidebar;
