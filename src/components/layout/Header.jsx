import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import './Header.css';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { BsSunFill, BsMoonFill } from "react-icons/bs"; // System icon එක දැන් අවශ්‍ය නෑ
import ProfileDropdown from '../common/ProfileDropdown.jsx';

function Header() {
  const { currentUser } = useAuth();
  const { theme, toggleTheme } = useTheme(); // <-- සරල theme සහ toggleTheme
  const navigate = useNavigate();

  

  return (
    <header className="main-header">
      <Link to="/" className="logo-link">
        <img src="https://firebasestorage.googleapis.com/v0/b/nisadas-mawatha.firebasestorage.app/o/webapp%2FNisadas%20Mawatha%20Logo.png?alt=media&token=bba44519-77de-48fb-a048-941625ac3e93" alt="Nisadas Mawatha Logo" className="header-logo" />
      </Link>
      <nav className="main-nav">
        <NavLink to="/">මුල් පිටුව</NavLink>
        <NavLink to="/books">පොත්</NavLink>
        <NavLink to="/writers">ලේඛකයින්</NavLink>

        {currentUser && (
          <NavLink to="/my-library">My Library</NavLink>
        )}

        {currentUser && currentUser.role === 'admin' && (
          <NavLink to="/admin" style={{color: 'red', fontWeight: 'bold'}}>Admin Panel</NavLink>
        )}
      </nav>
      <div className="user-actions">
        <button onClick={toggleTheme} className="theme-toggle-btn" title="Toggle Theme">
          {/* Icon එක සරලව මාරු කරනවා */}
          {theme === 'light' ? <BsMoonFill /> : <BsSunFill />}
        </button>

        {currentUser ? (
          // User log වෙලා නම්, Profile Dropdown එක විතරක් පෙන්නනවා
          <ProfileDropdown />
        ) : (
          // User log වෙලා නැත්නම්, Login/Signup buttons පෙන්නනවා
          <>
            <Link to="/auth" className="login-btn-link">
    <button className="login-btn">Login / Sign Up</button>
  </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;