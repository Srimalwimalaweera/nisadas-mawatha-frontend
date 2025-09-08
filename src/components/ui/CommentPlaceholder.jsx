import React from 'react';
import './CommentPlaceholder.css';

const PlaceholderItem = () => (
  <div className="comment-placeholder">
    <div className="placeholder-avatar"></div>
    <div className="placeholder-content">
      <div className="placeholder-header">
        <div className="placeholder-line" style={{ width: '120px', height: '16px' }}></div>
        <div className="placeholder-line" style={{ width: '80px', height: '12px' }}></div>
      </div>
      <div className="placeholder-body">
        <div className="placeholder-line"></div>
        <div className="placeholder-line" style={{ width: '75%' }}></div>
      </div>
      <div className="placeholder-actions">
        <div className="placeholder-line" style={{ width: '80px', height: '32px' }}></div>
        <div className="placeholder-line" style={{ width: '80px', height: '32px' }}></div>
      </div>
    </div>
  </div>
);

const CommentPlaceholder = () => {
  return (
    <div className="placeholder-container">
      {[1, 2, 3].map(i => <PlaceholderItem key={i} />)}
    </div>
  );
};

export default CommentPlaceholder;