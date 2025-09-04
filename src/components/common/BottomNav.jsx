import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './BottomNav.css';

import IconHome from '../ui/IconHome';
import IconWriters from '../ui/IconWriters';
import IconCreator from '../ui/IconCreator';
import IconLibrary from '../ui/IconLibrary';
import IconProfile from '../ui/IconProfile';

const navItems = [
  { path: '/', icon: IconHome },
  { path: '/writers', icon: IconWriters },
  { path: '/creator', icon: IconCreator },
  { path: '/my-library', icon: IconLibrary },
  { path: '/profile', icon: IconProfile }
];

function BottomNav({ className }) {
  const location = useLocation(); // location hook එක තවමත් අවශ්‍යයි active class එකට

  return (
    <div className={`bottom-nav-container ${className || ''}`}>
      {/* Circle එකට අදාළ background div එක සහ circle එක ඉවත් කරන ලදී */}
      <ul id="tab-bar">
        {navItems.map((item) => (
          <li key={item.path}>
            <NavLink 
              to={item.path} 
              className={({ isActive }) => (location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path)) ? 'icon active' : 'icon')}
            >
              <item.icon className="icon-picture" />
            </NavLink>
          </li>
        ))}
      </ul>
      {/* SVG Goo Filter එක තවදුරටත් අවශ්‍ය නැත */}
    </div>
  );
}

export default BottomNav;