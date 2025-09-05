import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import ThemeToggleButton from './ThemeToggleButton';

import './SidePanel.css';

const SidePanel = ({ isOpen, isDarkMode, toggleTheme, navLinks, onClose }) => {
  const [highlightStyle, setHighlightStyle] = useState({});
  const navListRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const activeLink = navListRef.current?.querySelector('.side-panel-link.active');
    if (activeLink) {
      setHighlightStyle({
        top: `${activeLink.offsetTop}px`,
        height: `${activeLink.offsetHeight}px`,
        opacity: 1,
      });
    } else {
      setHighlightStyle({ opacity: 0 });
    }
  }, [location, isOpen]);

  const handleLinkClick = () => {
    // Highlighter animation එකේ කාලය (350ms) + අමතර 200ms = 550ms
    setTimeout(() => {
      onClose(); // Delay එකකින් පසුව panel එක close කරන function එක call කිරීම
    }, 1000);
  };
  
  const backgroundClass = isDarkMode ? 'dark-side-panel' : 'light-side-panel';
  

  return (
    <div
      className={`side-panel ${isOpen ? 'open' : ''} ${backgroundClass}`}
    >
      <div className="side-panel-content">
        <nav>
          <ul className="side-panel-nav-list" ref={navListRef}>
  {/* The moving highlight element */}
  <div className="nav-highlight" style={highlightStyle}></div>

  {navLinks.map(link => (
    <li key={link.to}>
      <NavLink 
        to={link.to} 
        className={({ isActive }) => `side-panel-link ${isActive ? 'active' : ''}`}
        onClick={handleLinkClick}
      >
        <span>{link.text}</span>
      </NavLink>
    </li>
  ))}
</ul>
        </nav>
        
        <div className="side-panel-footer">
          <ThemeToggleButton isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        </div>
      </div>
    </div>
  );
};

export default SidePanel;