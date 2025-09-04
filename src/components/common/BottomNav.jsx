import React, { useState, useRef, useLayoutEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './BottomNav.css';

import IconHome from '../ui/IconHome';
import IconWriters from '../ui/IconWriters';
import IconCreator from '../ui/IconCreator';
import IconLibrary from '../ui/IconLibrary';
import IconProfile from '../ui/IconProfile';

// --- 1. එක් එක් icon එකට අදාළව circle එකේ පිහිටීම වෙනස් කිරීමට 'offset' එකතු කිරීම ---
// offset: 0   -> පිහිටීම වෙනසක් නැත.
// offset: 5   -> circle එක දකුණට pixels 5ක් යයි.
// offset: -5  -> circle එක වමට pixels 5ක් යයි.
const navItems = [
  { path: '/', icon: IconHome, offset: 0 },
  { path: '/writers', icon: IconWriters, offset: 0 },
  { path: '/creator', icon: IconCreator, offset: 0 },
  { path: '/my-library', icon: IconLibrary, offset: 0 },
  { path: '/profile', icon: IconProfile, offset: 0 }
];

function BottomNav({ className }) {
  const location = useLocation();
  const roundRef = useRef(null);
  const navRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useLayoutEffect(() => {
    const currentPath = location.pathname;
    // මුල් පිටුවට අමතරව /books වැනි path එකකදීත් Home icon එක active කිරීමට
    const activeIndex = navItems.findIndex(item => 
      item.path === '/' ? currentPath === '/' : currentPath.startsWith(item.path)
    );
    
    if (activeIndex !== -1) {
      setActiveIndex(activeIndex);
      // activeIndex එකට අදාළව නිවැරදි item එක DOM එකෙන් තෝරාගැනීම
      const activeItem = navRef.current.children[activeIndex].querySelector('a');

      if (activeItem && roundRef.current) {
        // --- 2. Circle එකේ පිහිටීම υπολογනය කරන ක්‍රමය වඩාත් නිවැරදි කිරීම ---
        // පැරණි, අස්ථායී ක්‍රමය: const left = activeItem.offsetLeft; roundRef.current.style.left = `calc(23.9% + ${left}px)`;

        const iconLeft = activeItem.offsetLeft; // icon එකේ වම් කෙළවරේ සිට ඇති දුර
        const iconWidth = activeItem.offsetWidth; // icon එකේ සම්පූර්ණ පළල
        const circleWidth = roundRef.current.offsetWidth; // circle එකේ පළල
        const manualOffset = navItems[activeIndex].offset || 0; // අපි ලබාදුන් manual offset අගය

        // නව, ස්ථාවර ක්‍රමය: (icon එකේ මැද පිහිටීම) - (circle එකේ පළලෙන් භාගයක්) + (manual offset)
        const newLeftPosition = iconLeft + (iconWidth / 2) - (circleWidth / 2) + manualOffset;

        roundRef.current.style.left = `${newLeftPosition}px`;
      }
    }
  }, [location]);

  return (
    <div className={`bottom-nav-container ${className || ''}`}>
      <div className="bottom-nav-background">
        <div ref={roundRef} id="round"></div>
      </div>
      <ul ref={navRef} id="tab-bar">
        {navItems.map((item) => (
          <li key={item.path}>
            <NavLink to={item.path} className="icon">
              <item.icon className="icon-picture" />
            </NavLink>
          </li>
        ))}
      </ul>
      
      {/* SVG Goo Filter */}
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style={{ display: 'none' }}>
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 30 -7" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}

export default BottomNav;