import React from 'react';
import { IoSend } from 'react-icons/io5';
import './CommentInput.css';

const CommentInput = ({
  value,
  onChange,
  onSubmit,
  placeholder = "What's on your mind?",
  buttonText = <IoSend />,
  isReply = false,
  currentUser
}) => {
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  const defaultAvatar = "https://firebasestorage.googleapis.com/v0/b/nisadas-mawatha.firebasestorage.app/o/webapp%2Fdefault-user.png?alt=media&token=a037895e-a611-4959-871d-c0f5f78c1874";

  return (
    <div className={`comment-input-container ${isReply ? 'reply' : ''}`}>
      <img
        src={currentUser?.photoURL || defaultAvatar}
        alt="You"
        className="comment-input-avatar"
        referrerPolicy="no-referrer"
      />
      <div className="comment-input-wrapper">
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="comment-input-field"
          onKeyPress={handleKeyPress}
        />
        <button onClick={onSubmit} className="comment-submit-btn">
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default CommentInput;