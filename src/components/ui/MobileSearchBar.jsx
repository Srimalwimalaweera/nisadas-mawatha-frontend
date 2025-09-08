import React, { useEffect, useRef } from 'react';
import { FiSearch } from 'react-icons/fi';
import './MobileSearchBar.css';

const MobileSearchBar = ({ isActive, query, setQuery, onSearch }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    // `isActive` prop එක true නම් (එනම් panel එක open නම්)
    if (isActive && inputRef.current) {
      // CSS animation එකට සුළු වේලාවක් දී, input field එක focus කිරීම
      const timer = setTimeout(() => {
        inputRef.current.focus();
      }, 400); 

      return () => clearTimeout(timer);
    }
  }, [isActive]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    // `isActive` prop එක true නම්, `active` class එක මෙතනින් එක් වේ.
    // එමගින් CSS animation එක auto-trigger වී search bar එක expand වේ.
    <form className={`searchBox ${isActive ? 'active' : ''}`} onSubmit={handleSearch} onContextMenu={(e) => e.preventDefault()}>
      <input 
        ref={inputRef}
        className="searchInput"
        type="text" 
        name="" 
        placeholder="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button className="searchButton" type="submit">
        <FiSearch />
      </button>
    </form>
  );
};

export default MobileSearchBar;