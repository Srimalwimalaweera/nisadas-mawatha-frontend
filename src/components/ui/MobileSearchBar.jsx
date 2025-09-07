import React, { useEffect, useRef } from 'react';
import { FiSearch } from 'react-icons/fi';
import './MobileSearchBar.css';

const MobileSearchBar = ({ isActive, query, setQuery, onSearch }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    // `isActive` prop එක true වූ විට, එනම් panel එක open වූ විට...
    if (isActive && inputRef.current) {
      // Animation එකට ඉඩ දීමට, සුළු delay එකකින් පසුව input එක focus කිරීම
      const timer = setTimeout(() => {
        inputRef.current.focus();
      }, 400); // CSS transition එකේ කාලයට සමාන අගයක් (0.4s)

      return () => clearTimeout(timer); // Cleanup
    }
  }, [isActive]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form className={`searchBox ${isActive ? 'active' : ''}`} onSubmit={handleSearch}>
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