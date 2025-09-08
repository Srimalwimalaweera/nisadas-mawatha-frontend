import React, { useState } from 'react';
import { MessageCircle, MoreHorizontal, Heart } from 'lucide-react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getApp } from 'firebase/app';
import { useAuth } from '../../context/AuthContext';
import { usePopup } from '../../context/PopupContext';

import CommentInput from './CommentInput';
import CommentReactionPanel from './CommentReactionPanel';
import './Comment.css';

// Timestamp formatting function
const timeSince = (date) => {
    if (!date || !date.toDate) return '...';
    const seconds = Math.floor((new Date() - date.toDate()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return "now";
};

// Reply Item Component
// ----- ReplyItem Component -----
const ReplyItem = ({ bookId, commentId, reply }) => {
    const { author } = reply;
    return (
        <div className="reply-item-container">
            {/* VVVV මෙතන වෙනස බලන්න VVVV */}
            <img 
                src={author?.photoURL || "https://firebasestorage.googleapis.com/v0/b/nisadas-mawatha.firebasestorage.app/o/webapp%2Fdefault-user.png?alt=media&token=a037895e-a611-4959-871d-c0f5f78c1874"} 
                alt={author?.displayName} 
                className="reply-avatar" 
                referrerPolicy="no-referrer" 
            />
            <div className="reply-content-wrapper">
                <div className="comment-author-info">
                    {/* VVVV මෙතනත් වෙනස බලන්න VVVV */}
                    <h5 className="comment-author-name">{author?.displayName}</h5>
                    <span className="comment-timestamp">{timeSince(reply.timestamp)}</span>
                </div>
                <p className="comment-content-text">{reply.content}</p>
                <div className="comment-actions">
                    <CommentReactionPanel
                        bookId={bookId}
                        commentId={commentId}
                        replyId={reply.id}
                        initialCounts={reply.reactionCounts}
                    />
                </div>
            </div>
        </div>
    );
};

// Main Comment Component
const Comment = ({ comment, onReplySubmit, bookId }) => {
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [showHeart, setShowHeart] = useState(false);
    const { currentUser } = useAuth();
    const { openLoginPrompt } = usePopup();
    
    const { author } = comment;

    const handleDoubleClick = async () => {
        if (!currentUser) {
            openLoginPrompt();
            return;
        }
        setShowHeart(true);
        setTimeout(() => setShowHeart(false), 1000);
        // Directly call the cloud function for an instant 'love' reaction
        try {
            const functions = getFunctions(getApp(), "us-central1");
            const toggleCommentReaction = httpsCallable(functions, 'toggleCommentReaction');
            await toggleCommentReaction({ bookId, commentId: comment.id, reactionType: 'love' });
        } catch (error) {
            console.error("Error on double-click reaction:", error);
        }
    };

    const handleReply = () => {
        if (replyText.trim()) {
            onReplySubmit(comment.id, replyText);
            setReplyText('');
            setIsReplying(false);
        }
    };
    
    return (
        <div className="comment-item-container group">
            <div className="ambient-glow"></div>
            {showHeart && (
                <div className="heart-animation-container">
                    <Heart className="heart-ping" size={48} />
                    <Heart className="heart-bounce" size={48} />
                </div>
            )}
            <div className="comment-main-content">
               <img 
                    src={author?.photoURL || "https://firebasestorage.googleapis.com/v0/b/nisadas-mawatha.firebasestorage.app/o/webapp%2Fdefault-user.png?alt=media&token=a037895e-a611-4959-871d-c0f5f78c1874"} 
                    alt={author?.displayName} 
                    className="comment-avatar" 
                    referrerPolicy="no-referrer" 
                />
                <div className="comment-body">
                    <div className="comment-author-info">
                        {/* VVVV මෙතනත් වෙනස බලන්න VVVV */}
                        <h4 className="comment-author-name">{author?.displayName}</h4>
                        <span className="comment-timestamp">{timeSince(comment.timestamp)}</span>
                        <MoreHorizontal className="comment-options-icon" size={16} />
                    </div>
                    <div className="comment-content-text" onDoubleClick={handleDoubleClick}>
                        {comment.content}
                    </div>

                    {comment.status && (
                        <div className={`comment-status ${comment.status}`}>
                            {comment.status === 'sending' && 'Sending...'}
                        </div>
                    )}
                    
                    <div className="comment-actions">
                        <CommentReactionPanel
                            bookId={bookId}
                            commentId={comment.id}
                            initialCounts={comment.reactionCounts}
                        />
                        <button onClick={() => setIsReplying(!isReplying)} className="reply-button">
                            <MessageCircle size={16} />
                            <span>Reply</span>
                        </button>
                    </div>

                    {isReplying && (
                        <div className="reply-input-section">
                           <CommentInput 
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                onSubmit={handleReply}
                                placeholder="Write a reply..."
                                isReply={true}
                                currentUser={currentUser}
                           />
                        </div>
                    )}

                    {comment.replies && comment.replies.length > 0 && (
                        <div className="replies-container">
                            {comment.replies.map(reply => (
                                <ReplyItem 
                                    key={reply.id} 
                                    reply={reply} 
                                    bookId={bookId} 
                                    commentId={comment.id}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Comment;