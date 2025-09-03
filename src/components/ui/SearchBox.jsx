import React, { useState } from 'react';
import './SearchBox.css';

const SearchBox = () => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`searchContainer ${isFocused ? 'isFocused' : ''}`}>
      
      <svg className="searchSvg" viewBox="0 0 420 60" xmlns="http://www.w3.org/2000/svg">
        <rect className="bar"/>
        
        <g className="magnifier">
          <circle className="glass"/>
          <line className="handle" x1="32" y1="32" x2="44" y2="44"></line>
        </g>

        <g className="sparks">
          <circle className="spark"/>
          <circle className="spark"/>
          <circle className="spark"/>
        </g>

        <g className="burst patternOne">
          <circle className="particle circle"/>
          <path className="particle triangle"/>
          <circle className="particle circle"/>
          <path className="particle plus"/>
          <rect className="particle rect"/>
          <path className="particle triangle"/>
        </g>
        <g className="burst patternTwo">
          <path className="particle plus"/>
          <circle className="particle circle"/>
          <path className="particle triangle"/>
          <rect className="particle rect"/>
          <circle className="particle circle"/>
          <path className="particle plus"/>
        </g>
        <g className="burst patternThree">
          <circle className="particle circle"/>
          <rect className="particle rect"/>
          <path className="particle plus"/>
          <path className="particle triangle"/>
          <rect className="particle rect"/>
          <path className="particle plus"/>
        </g>
      </svg>
      
      <input 
        className="searchInput" 
        type="search" 
        name="q" 
        aria-label="Search for books or authors"
        placeholder="නිර්මාණ හෝ නිර්මාණකරුවන් සොයන්න..."
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </div>
  );
};

export default SearchBox;