import React from 'react';

function Navbar() {
  React.useEffect(() => {
    console.log('Navbar mounted');
    
    setTimeout(() => {
      const logoutBtn = document.getElementById('logout-btn');
      console.log('Logout button element:', logoutBtn);
      console.log('Button position:', logoutBtn?.getBoundingClientRect());
      
      if (logoutBtn) {
        // Test with multiple event types
        logoutBtn.addEventListener('click', (e) => {
          console.log('🔴 CLICK EVENT FIRED!');
          e.preventDefault();
          localStorage.clear();
          window.location.href = 'http://localhost:5173/signin';
        });
        
        logoutBtn.addEventListener('mousedown', () => {
          console.log('🟡 MOUSEDOWN EVENT FIRED!');
        });
        
        logoutBtn.addEventListener('mouseup', () => {
          console.log('🟢 MOUSEUP EVENT FIRED!');
        });
      } else {
        console.error('❌ Logout button not found in DOM!');
      }
    }, 1000);
  }, []);

  return (
    <nav style={{ 
      backgroundColor: 'white', 
      padding: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      position: 'relative',
      zIndex: 9999
    }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Admin Dashboard</h1>
      
      <button 
        id="logout-btn"
        style={{
          backgroundColor: '#dc2626',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '6px',
          fontWeight: 'bold',
          cursor: 'pointer',
          border: 'none',
          fontSize: '16px',
          position: 'relative',
          zIndex: 10000
        }}
      >
        LOGOUT
      </button>
    </nav>
  );
}

export default Navbar;
