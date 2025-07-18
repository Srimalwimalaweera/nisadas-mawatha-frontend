import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Header.css';
import { useAuth } from '../../context/AuthContext.jsx'; // <-- අපේ Auth Context එක import කරනවා

function Header() {
  const { currentUser, logout } = useAuth(); // <-- Context එකෙන් user විස්තර ගන්නවා

  const handleLogout = async () => {
    try {
      await logout();
      // You can add a redirect here if needed, e.g., to the homepage
      console.log("User logged out");
    } catch {
      console.error("Failed to log out");
    }
  };

  return (
    <header className="main-header">
      <Link to="/" className="logo">නිසඳැස් මාවත</Link>
      <nav className="main-nav">
        <NavLink to="/">මුල් පිටුව</NavLink>
        <NavLink to="/books">පොත්</NavLink>
        <NavLink to="/writers">ලේඛකයින්</NavLink>
      </nav>
      <div className="user-actions">
        {currentUser ? (
          // User log වෙලා නම් මේ ටික පෙන්නනවා
          <>
  <Link to="/profile" className="user-profile-link">
    <span>Welcome, {currentUser.displayName || currentUser.email}</span>
  </Link>
  <button onClick={handleLogout} className="logout-btn">Logout</button>
</>
        ) : (
          // User log වෙලා නැත්නම් මේ ටික පෙන්නනවා
          <>
            <Link to="/login" className="login-btn-link">
              <button className="login-btn">Login</button>
            </Link>
            <Link to="/signup" className="signup-btn-link">
              <button className="signup-btn">Sign Up</button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;