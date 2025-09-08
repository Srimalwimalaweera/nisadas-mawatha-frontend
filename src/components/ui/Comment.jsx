import React, { useState } from 'react';
import { MessageCircle, MoreHorizontal, Heart } from 'lucide-react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getApp } from 'firebase/app';
import { useAuth } from '../../context/AuthContext';
import { usePopup } from '../../context/PopupContext';
import { useComments } from '../../context/CommentContext';

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
const ReplyItem = ({ bookId, commentId, reply, onDoubleClick }) => {
    const { author } = reply;
    return (
        <div className="reply-item-container">
            <img 
                src={author?.photoURL || "https://firebasestorage.googleapis.com/v0/b/nisadas-mawatha.firebasestorage.app/o/webapp%2Fdefault-user.png?alt=media&token=a037895e-a611-4959-871d-c0f5f78c1874"} 
                alt={author?.displayName} 
                className="reply-avatar" 
                referrerPolicy="no-referrer" 
            />
            <div className="reply-content-wrapper">
                <div className="comment-author-info">
                    <h5 className="comment-author-name">{author?.displayName || 'User'}</h5>
                    <span className="comment-timestamp">{timeSince(reply.timestamp)}</span>
                </div>
                <p className="comment-content-text" onDoubleClick={() => onDoubleClick(reply.id)}>
                    {reply.content}
                </p>
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
    const { addReplyOptimistically } = useComments();
    const { currentUser } = useAuth();
    const { openLoginPrompt } = usePopup();
    
    const { author } = comment;

    const callReactionFunction = async (replyId = null) => {
        if (!currentUser) {
            openLoginPrompt();
            return;
        }
        setShowHeart(true);
        setTimeout(() => setShowHeart(false), 1000);
        try {
            const functions = getFunctions(getApp(), "us-central1");
            const toggleCommentReaction = httpsCallable(functions, 'toggleCommentReaction');
            await toggleCommentReaction({ bookId, commentId: comment.id, replyId: replyId, reactionType: 'love' });
        } catch (error) {
            console.error("Error on double-click reaction:", error);
        }
    };

    const handleReply = () => {
        if (replyText.trim() && currentUser) {
            const replyContent = replyText;
            const optimisticReply = {
                id: `temp_${Date.now()}`,
                userId: currentUser.uid,
                author: {
                    displayName: currentUser.displayName,
                    photoURL: currentUser.photoURL,
                },
                content: replyContent,
                reactionCounts: {},
                timestamp: { toDate: () => new Date() },
                status: 'sending'
            };
            addReplyOptimistically(comment.id, optimisticReply);
            onReplySubmit(comment.id, replyContent);
            setReplyText('');
            setIsReplying(false);
        }
    };
    
    return (
        <div className="comment-item-container group" onContextMenu={(e) => e.preventDefault()}>
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
                        <h4 className="comment-author-name">{author?.displayName || 'User'}</h4>
                        <span className="comment-timestamp">{timeSince(comment.timestamp)}</span>
                        <MoreHorizontal className="comment-options-icon" size={16} />
                    </div>
                    <div className="comment-content-text" onDoubleClick={() => callReactionFunction(null)}>
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
                                    onDoubleClick={callReactionFunction}
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