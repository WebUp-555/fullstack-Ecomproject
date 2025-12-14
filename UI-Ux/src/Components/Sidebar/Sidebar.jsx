import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleChangePassword = () => {
    navigate('/change-password');
    setIsOpen(false);
  };

  const handleUpdateDetails = () => {
    navigate('/update-details');
    setIsOpen(false);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch('http://localhost:8000/api/v1/users/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Log out regardless of server response
      if (response.ok || response.status === 401) {
        localStorage.removeItem('user');
        localStorage.removeItem('token'); // Also remove token if stored
        navigate('/signin');
        setIsOpen(false);
      } else {
        alert('Logout failed. Please try again.');
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout on error
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('/signin');
    } finally {
      setIsLoggingOut(false);
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
            <li onClick={handleUpdateDetails}>
              <span className="icon">👤</span>
              Update Details
            </li>
            <li onClick={handleChangePassword}>
              <span className="icon">🔒</span>
              Change Password
            </li>
            <li onClick={handleLogout} style={{ opacity: isLoggingOut ? 0.6 : 1, pointerEvents: isLoggingOut ? 'none' : 'auto' }}>
              <span className="icon">🚪</span>
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </li>
          </ul>
        </div>
      </div>

      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
    </>
  );
};

export default Sidebar;
