import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

// Context Hooks
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

// UI Components

import AnimatedMenuIcon from '../ui/AnimatedMenuIcon.jsx';
import SidePanel from '../ui/SidePanel.jsx';
import ProfileDropdown from '../common/ProfileDropdown.jsx';
import SearchBox from '../ui/SearchBox.jsx';
import ThemeToggleButton from '../ui/ThemeToggleButton.jsx'; 
// අලුත් CSS file එක import කරගන්න
import './Header.css';

function Header({ showSearchBox = true }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  const headerClass = isDarkMode ? 'header-dark' : 'header-light';

  // Navigation link styles
  const navLinkClass = ({ isActive }) =>
    `desktop-nav-link ${isActive ? 'active' : ''}`;

  // Reusable navigation links
  const navLinks = [
    { to: "/", text: "මුල් පිටුව" },
    { to: "/books", text: "පොත්" },
    { to: "/writers", text: "ලේඛකයින්" },
    ...(currentUser ? [{ to: "/my-library", text: "My Library" }] : []),
    ...(currentUser && currentUser.role === 'admin' 
        ? [{ to: "/admin", text: "Admin Panel", className: "admin-link" }] 
        : [])
  ];

  return (
    <>
      <header className={`new-main-header ${headerClass}`}>
        
        {/* Left Section */}
        <div className="header-left-section">
          <div className="mobile-only" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <AnimatedMenuIcon isOpen={isMenuOpen} />
          </div>
          <Link to="/" className="desktop-only">
            <img 
              src="https://firebasestorage.googleapis.com/v0/b/nisadas-mawatha.firebasestorage.app/o/webapp%2FNisadas%20Mawatha%20Logo.png?alt=media&token=bba44519-77de-48fb-a048-941625ac3e93" 
              alt="Nisadas Mawatha Logo"
              className="header-logo"
            />
          </Link>
        </div>

        {/* Center Section */}
        <div className="header-center-section">
          <Link to="/" className="mobile-only">
             <img 
              src="https://firebasestorage.googleapis.com/v0/b/nisadas-mawatha.firebasestorage.app/o/webapp%2FNisadas%20Mawatha%20Logo.png?alt=media&token=bba44519-77de-48fb-a048-941625ac3e93" 
              alt="Nisadas Mawatha Logo"
              className="header-logo"
            />
          </Link>
          <div className="desktop-only desktop-nav-container">
            {showSearchBox && <SearchBox />}{/* SearchBox එක පසුවට එකතු කරගත හැක. දැනට Navigation එක දාමු. */}
            <nav>
              <ul className="desktop-nav-list">
                {navLinks.map(link => (
                  <li key={link.to}>
                    <NavLink to={link.to} className={link.className ? `${navLinkClass({isActive:false})} ${link.className}` : navLinkClass}>
                      {link.text}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Right Section */}
        <div className="header-right-section">
          <div className="desktop-only">
            {/* පැරණි toggle එක වෙනුවට අලුත් එක යෙදීම */}
            <ThemeToggleButton isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
          </div>
          
          {currentUser ? (
            <ProfileDropdown />
          ) : (
            <div className="auth-buttons">
              <Link to="/signup">
                <button className="header-action-btn signup-btn">Signup</button>
              </Link>
              <Link to="/login">
                <button className="header-action-btn login-btn">Login</button>
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Side Panel for Mobile */}
      <SidePanel 
        isOpen={isMenuOpen} 
        isDarkMode={isDarkMode} 
        toggleTheme={toggleTheme}
        navLinks={navLinks}
        onClose={() => setIsMenuOpen(false)}
      />
    </>
  );
}

export default Header;