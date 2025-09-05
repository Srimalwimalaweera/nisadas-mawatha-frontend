import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './BottomNav.css';

import IconHome from '../ui/IconHome';
import IconWriters from '../ui/IconWriters';
import IconCreator from '../ui/IconCreator';
import IconLibrary from '../ui/IconLibrary';
import IconProfile from '../ui/IconProfile';
import IconTrending from '../ui/IconTrending';

const navItems = [
  { path: '/', icon: IconHome, name: 'Home' },
   { path: '/trending', icon: IconTrending, name:'Trending' },
  { path: '/writers', icon: IconWriters, name:'Writers' },
  { path: '/creator', icon: IconCreator,name:'Upload'},
  { path: '/my-library', icon: IconLibrary, name:'Library' },
  { path: '/profile', icon: IconProfile, name:'Profile' }
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
              <span className="icon-label">{item.name}</span> 
            </NavLink>
          </li>
        ))}
      </ul>
      {/* SVG Goo Filter එක තවදුරටත් අවශ්‍ය නැත */}
    </div>
  );
}

export default BottomNav;