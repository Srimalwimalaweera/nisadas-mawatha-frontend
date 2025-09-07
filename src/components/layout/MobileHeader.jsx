import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import AnimatedMenuIcon from '../ui/AnimatedMenuIcon';
import ThemeToggleButton from '../ui/ThemeToggleButton';
import ProfileDropdown from '../common/ProfileDropdown';
import { FiSearch } from 'react-icons/fi';

import './MobileHeader.css';

const MobileHeader = ({ isAuthPage, isMenuOpen, setIsMenuOpen, isSearchPanelOpen, setIsSearchPanelOpen }) => {
  const { currentUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <header className={'new-main-header mobile-header'}>
      <div className="header-left-section">
        <div className="header-menu-icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <AnimatedMenuIcon isOpen={isMenuOpen} />
        </div>
        
        {/* Search icon එක click කළ විට search panel එක toggle වේ */}
        <button className="search-icon-btn" onClick={() => setIsSearchPanelOpen(prev => !prev)}>
            <FiSearch />
        </button>
      </div>
      
      <div className="header-center-section">
        <Link to="/" className="mobile-logo-link">
          <img 
            src="https://firebasestorage.googleapis.com/v0/b/nisadas-mawatha.firebasestorage.app/o/webapp%2FNisadas%20Mawatha%20Logo.png?alt=media&token=bba44519-77de-48fb-a048-941625ac3e93" 
            alt="Nisadas Mawatha Logo"
            className="header-logo"
          />
        </Link>
        {/* පැරණි search bar එක මෙතනින් ඉවත් කර ඇත */}
      </div>

      <div className="header-right-section">
        <ThemeToggleButton isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        {currentUser ? ( <ProfileDropdown /> ) : (
          !isAuthPage && (
            <div className="auth-buttons">
              <Link to="/auth"><button className="header-action-btn login-btn">Login</button></Link>
            </div>
          )
        )}
      </div>
    </header>
  );
};

export default MobileHeader;