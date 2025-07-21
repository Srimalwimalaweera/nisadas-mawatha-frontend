import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Header.css';
import { useAuth } from '../../context/AuthContext.jsx';

function Header() {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
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
        
        {/* <-- නිවැරදි කළ කොටස මෙන්න --> */}
        {currentUser && currentUser.role === 'admin' && (
          <NavLink to="/admin" style={{color: 'red', fontWeight: 'bold'}}>Admin Panel</NavLink>
        )}
      </nav>
      <div className="user-actions">
        {currentUser ? (
          <>
            <Link to="/profile" className="user-profile-link">
              <span>Welcome, {currentUser.displayName || currentUser.email}</span>
            </Link>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </>
        ) : (
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