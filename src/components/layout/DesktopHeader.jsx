import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import SearchBox from '../ui/SearchBox';
import ThemeToggleButton from '../ui/ThemeToggleButton';
import ProfileDropdown from '../common/ProfileDropdown';
import AnimatedMenuIcon from '../ui/AnimatedMenuIcon'; // Menu icon import කරගැනීම
import './DesktopHeader.css';

const DesktopHeader = ({ navLinks, isAuthPage, showSearchBox, isMenuOpen, setIsMenuOpen }) => {
  const { currentUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  const navLinkClass = ({ isActive }) => `desktop-nav-link ${isActive ? 'active' : ''}`;

  return (
    <header className="new-main-header desktop-header">
      {/* Left Section */}
      <div className="header-left-section">
        <div className="header-menu-icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <AnimatedMenuIcon isOpen={isMenuOpen} />
        </div>
        <Link to="/">
          <img 
            src="https://firebasestorage.googleapis.com/v0/b/nisadas-mawatha.firebasestorage.app/o/webapp%2FNisadas%20Mawatha%20Logo.png?alt=media&token=bba44519-77de-48fb-a048-941625ac3e93" 
            alt="Nisadas Mawatha Logo"
            className="header-logo"
          />
        </Link>
      </div>

      {/* Center Section */}
      <div className="header-center-section">
        {!isAuthPage && showSearchBox && <SearchBox />}
        {!isAuthPage && (
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
        )}
      </div>

      {/* Right Section */}
      <div className="header-right-section">
        <ThemeToggleButton isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        {currentUser ? (
          <ProfileDropdown />
        ) : (
          !isAuthPage && (
            <div className="auth-buttons">
              <Link to="/auth">
                <button className="header-action-btn register-btn">Signup</button>
              </Link>
            </div>
          )
        )}
        
      </div>
    </header>
  );
};

export default DesktopHeader;