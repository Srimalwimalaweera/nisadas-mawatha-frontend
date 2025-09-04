import React from 'react';
import './MonetizationToggle.css';

const MonetizationToggle = ({ isForSale, setIsForSale }) => {
  const handleToggle = () => {
    setIsForSale(!isForSale);
  };

  return (
    <div className="toggle-wrapper">
      <button
        type="button" // This prevents the button from submitting the form
        className={`monetization-toggle ${isForSale ? 'active' : ''}`}
        onClick={handleToggle}
      >
        <span className="toggle-background"></span>
        <span className="toggle-text">{isForSale ? 'SELL' : 'FREE'}</span>
      </button>
      <p className="toggle-subtext">Sell your eBook</p>
    </div>
  );
};

export default MonetizationToggle;