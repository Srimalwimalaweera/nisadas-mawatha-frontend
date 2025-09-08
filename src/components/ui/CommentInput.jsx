import React, { useRef, useEffect } from 'react';
import { IoSend } from 'react-icons/io5';
import './CommentInput.css';

const CommentInput = ({
  id,
  value,
  onChange,
  onSubmit,
  placeholder = "What's on your mind?",
  buttonText = <IoSend />,
  isReply = false,
  currentUser,
  charLimit 
}) => {

   const textareaRef = useRef(null);

  // value එක වෙනස් වන සෑම විටම textarea එකේ උස adjust කිරීම
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  const defaultAvatar = "https://firebasestorage.googleapis.com/v0/b/nisadas-mawatha.firebasestorage.app/o/webapp%2Fdefault-user.png?alt=media&token=a037895e-a611-4959-871d-c0f5f78c1874";

  // Counter එකේ වර්ණය වෙනස් කිරීමට class එකක් තීරණය කිරීම
const getCounterClass = () => {
    if (!charLimit) return '';
    const remaining = charLimit - value.length;
    if (remaining <= 0) return 'limit';
    if (remaining <= 20) return 'warn';
    return '';
  };

return (
    <div className="comment-input-container-wrapper">
      <div className={`comment-input-container ${isReply ? 'reply' : ''}`}>
        <img
          src={currentUser?.photoURL || defaultAvatar}
          alt="You"
          className="comment-input-avatar"
          referrerPolicy="no-referrer"
        />
        <div className="comment-input-wrapper">
          <textarea
            ref={textareaRef}
            rows={1} // ආරම්භක උස පේළි 1ක් ලෙස සකස් කිරීම
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="comment-input-field"
            onKeyPress={handleKeyPress}
            maxLength={charLimit}
          />
          <button onClick={onSubmit} className="comment-submit-btn">
            {buttonText}
          </button>
        </div>
      </div>
      {/* VVVV Character counter එක මෙතනට එක් කිරීම VVVV */}
      {charLimit && (
        <div className={`char-counter ${getCounterClass()}`}>
          {value.length} / {charLimit}
        </div>
      )}
    </div>
  );
};

export default CommentInput;