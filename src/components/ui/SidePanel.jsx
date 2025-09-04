import React from 'react';
import { NavLink } from 'react-router-dom';

import './SidePanel.css';

const SidePanel = ({ isOpen, isDarkMode, toggleTheme, navLinks, onClose }) => {
  const backgroundClass = isDarkMode ? 'dark-side-panel' : 'light-side-panel';
  const navLinkClass = 'side-panel-link';

  return (
    <div
      className={`side-panel ${isOpen ? 'open' : ''} ${backgroundClass}`}
    >
      <div className="side-panel-content">
        <nav>
          <ul className="side-panel-nav-list">
            {navLinks.map(link => (
              <li key={link.to}>
                <NavLink 
                  to={link.to} 
                  className={link.className ? `${navLinkClass} ${link.className}` : navLinkClass}
                  onClick={onClose}
                >
                  {link.text}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        
      </div>
    </div>
  );
};

export default SidePanel;