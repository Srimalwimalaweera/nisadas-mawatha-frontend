import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { getFunctions, httpsCallable } from "firebase/functions";
import { useAuth } from '../../context/AuthContext';
import { usePopup } from '../../context/PopupContext';
import { useComments } from '../../context/CommentContext';
import { getApp } from 'firebase/app';

import Comment from '../ui/Comment';
import CommentInput from '../ui/CommentInput';
import CommentPlaceholder from '../ui/CommentPlaceholder';
import './CommentSection.css';

const CommentSection = ({ bookId }) => {
  const [newComment, setNewComment] = useState('');
  const { currentUser, appConfig } = useAuth();
  const { openLoginPrompt } = usePopup();

  // 1. useComments hook එක එක වරක් පමණක් call කර, අවශ්‍ය සියල්ල ලබා ගැනීම
  const { 
    comments, 
    isLoading, 
    hasMore, 
    loadMoreComments, 
    addCommentOptimistically 
  } = useComments();

  // Setup for infinite scroll
  const { ref, inView } = useInView({ threshold: 0.5 });

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      loadMoreComments();
    }
  }, [inView, hasMore, isLoading, loadMoreComments]);

  // Cloud function call helper
  const callFunction = async (functionName, data) => {
    if (!currentUser) {
      openLoginPrompt();
      return;
    }
    try {
      const functions = getFunctions(getApp(), "us-central1");
      const callableFunction = httpsCallable(functions, functionName);
      await callableFunction(data);
    } catch (error) {
      console.error(`Error calling function ${functionName}:`, error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleAddComment = async () => { // Make the function async
    if (!newComment.trim() || !currentUser) return;

    const tempId = `temp_${Date.now()}`;
    const commentText = newComment; // Save text before clearing the input

    const optimisticComment = {
      id: tempId,
      userId: currentUser.uid,
      author: {
        displayName: currentUser.displayName,
        photoURL: currentUser.photoURL,
      },
      content: commentText,
      likes: [],
      replies: [],
      timestamp: { toDate: () => new Date() },
      status: 'sending' // 1. Initial status
    };

    // Add to UI instantly with "Sending..." status
    addCommentOptimistically(optimisticComment);
    setNewComment('');

    // Call cloud function and wait for the result
    // ----- යාවත්කාලීන කළ යුතු ආකාරය -----
await callFunction('addComment', { bookId, content: commentText });

    // The real-time listener will replace the temp comment with the real one from Firestore.
    // We don't need to manage success/error status on the optimistic comment itself
    // because the listener will provide the true state of the database.
    // This simplifies the logic greatly.
  };

  // 2. මෙම functions දෙක අලුතින් නිර්මාණය කිරීම
  const handleAddReply = (commentId, content) => {
      callFunction('addReply', { bookId, commentId, content });
  };

  const handleToggleLike = (commentId, replyId = null) => {
      // අපි ඊළඟට reaction system එක හදන විට මෙය වෙනස් කරමු
      callFunction('toggleCommentLike', { bookId, commentId, replyId });
  };

  return (
    <div className="comment-section-container">
      <div className="comment-section-header">
        <h1>Comments</h1>
        <p>Join the conversation</p>
      </div>

      {currentUser && (
        <div className="main-comment-input-area">
          <CommentInput
            id="main-comment-input"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onSubmit={handleAddComment}
            currentUser={currentUser}
            charLimit={appConfig.commentLength}
          />
        </div>
      )}

      <div className="comments-list-wrapper">
        <div className="comments-list">
          {isLoading ? (
            <CommentPlaceholder />
          ) : comments.length > 0 ? (
            comments.map(comment => (
              <Comment
                key={comment.id}
                comment={comment}
                onLike={handleToggleLike}
                onReplySubmit={handleAddReply}
                bookId={bookId}
              />
            ))
          ) : (
            <p className="no-comments-text">No comments yet. Be the first to share your thoughts!</p>
          )}

          {hasMore && (
            <div ref={ref} className="scroll-trigger">
              {/* isLoadingMore state එක context එකෙන් ගෙන මෙහි loader එකක් පෙන්විය හැක */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentSection;