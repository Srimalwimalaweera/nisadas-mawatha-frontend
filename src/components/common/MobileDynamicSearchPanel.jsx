import React, { useState, useEffect, useRef, useCallback } from 'react';
import MobileSearchBar from '../ui/MobileSearchBar';
import './MobileDynamicSearchPanel.css';

const MobileDynamicSearchPanel = ({ isOpen, onClose, onSearch }) => {
  const panelRef = useRef(null);
  const inactivityTimerRef = useRef(null);
  const [query, setQuery] = useState('');
  const [isClosing, setIsClosing] = useState(false); // Close animation එක සඳහා නව state එකක්

  const handleClose = useCallback(() => {
    setIsClosing(true); // 1. Close animation එක ආරම්භ කිරීම
    setTimeout(() => {
      onClose(); // 2. Animation එකෙන් පසුව, panel එක සම්පූර්ණයෙන්ම hide කිරීම
      setIsClosing(false); // 3. State එක reset කිරීම
    }, 400); // CSS transition එකේ කාලයට සමාන විය යුතුය
  }, [onClose]);

  const resetInactivityTimer = useCallback(() => {
    clearTimeout(inactivityTimerRef.current);
    inactivityTimerRef.current = setTimeout(() => {
      if (!query.trim()) {
        handleClose();
      }
    }, 15000);
  }, [query, handleClose]);

useEffect(() => {
    if (isOpen) {
      resetInactivityTimer();

      const handleClickOutside = (event) => {
        const headerSearchIcon = event.target.closest('.search-icon-btn');
        // Search bar එකේ input field එක ref මගින් ලබාගැනීම වෙනුවට, document.activeElement මගින් පරීක්ෂා කිරීම
        const activeEl = document.activeElement;
        
        if (panelRef.current && !panelRef.current.contains(event.target) && !headerSearchIcon) {
          // Input field එක focus වී නොමැති නම් පමණක් close කරන්න
          if (!query.trim() && activeEl?.tagName !== 'INPUT') {
            setTimeout(onClose, 1000);
          }
        }
      };
      
      document.addEventListener('mousedown', handleClickOutside);
      
      return () => {
        clearTimeout(inactivityTimerRef.current);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, query, onClose, resetInactivityTimer]);

  const handleSearch = (searchQuery) => {
    if (searchQuery) {
      onSearch(searchQuery);
      handleClose();
    }
  };

  return (
    <div ref={panelRef} className={`search-panel-container ${isOpen ? 'open' : ''}`} onContextMenu={(e) => e.preventDefault()}>
      <div className="search-panel-content">
        <MobileSearchBar 
            isActive={isOpen && !isClosing} // Panel එක close වන විට, search bar එකද close වීම
            query={query}
            setQuery={setQuery}
            onSearch={handleSearch}
        />
      </div>
    </div>
  );
};

export default MobileDynamicSearchPanel;