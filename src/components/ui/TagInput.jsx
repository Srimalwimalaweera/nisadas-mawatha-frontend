import React, { useState } from 'react';
import './TagInput.css';

const TagInput = ({ tags, setTags }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e) => {
    if (e.key !== 'Enter' && e.key !== ',') return;
    e.preventDefault();
    const value = inputValue.trim();
    if (value && !tags.includes(value)) {
      setTags([...tags, value]);
      setInputValue('');
    }
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="tag-input-container">
      {tags.map((tag, index) => (
        <div key={index} className="tag-item">
          <span className="tag-text">{tag}</span>
          <button className="remove-tag-btn" onClick={() => removeTag(index)}>
            &times;
          </button>
        </div>
      ))}
      <input
        type="text"
        className="tag-input-field"
        placeholder="Add a tag and press Enter..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default TagInput;