import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useComments } from '../context/CommentContext';
import { useAuth } from '../context/AuthContext';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getApp } from 'firebase/app';

import './BookDetailsPage.css';
import { FaStar, FaCommentDots, FaShareAlt } from 'react-icons/fa';
import ReactionPanel from '../components/common/ReactionPanel';
import CommentSection from '../components/common/CommentSection';
import CommentInput from '../components/ui/CommentInput';

function BookDetailsPage() {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { currentUser } = useAuth();
  const { listenToComments, clearComments } = useComments();
  
  const commentsRef = useRef(null);
  const [showMobileCommentInput, setShowMobileCommentInput] = useState(false);
  const [mobileCommentText, setMobileCommentText] = useState('');

  useEffect(() => {
    let unsubscribeFromComments = () => {};

    const fetchBookAndInitComments = async () => {
      if (!bookId) return;
      setLoading(true);
      
      const bookRef = doc(db, 'books', bookId);
      const bookSnap = await getDoc(bookRef);

      if (bookSnap.exists()) {
        setBook({ id: bookSnap.id, ...bookSnap.data() });
      } else {
        setBook(null);
      }
      
      // Setup the comments listener and get the unsubscribe function
      unsubscribeFromComments = listenToComments(bookId);
      
      setLoading(false);
    };

    fetchBookAndInitComments();

    // Cleanup function: runs when the component is unmounted
    return () => {
      clearComments();
      unsubscribeFromComments(); // Unsubscribe from the real-time listener
    };
  }, [bookId, listenToComments, clearComments]);

  const handleMobileCommentClick = () => {
    const newShowState = !showMobileCommentInput;
    setShowMobileCommentInput(newShowState);
    if (newShowState) {
      setTimeout(() => {
        commentsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const handleMobileCommentSubmit = async () => {
    if (!mobileCommentText.trim() || !currentUser) return;
    try {
      const functions = getFunctions(getApp(), "us-central1");
      const addComment = httpsCallable(functions, 'addComment');
      await addComment({ bookId, content: mobileCommentText });
      setMobileCommentText('');
      setShowMobileCommentInput(false);
    } catch (error) {
      console.error("Error submitting comment from mobile:", error);
      alert("Failed to submit comment.");
    }
  };

  if (loading) {
    return <div className="bd-loading">Loading book details...</div>;
  }

  if (!book) {
    return <h1 className="bd-not-found">Book not found!</h1>;
  }

  const coverImage = book.coverImageUrl || `https://placehold.co/400x600/2a3a38/ffffff?text=${encodeURIComponent(book.title)}`;

  return (
    <>
      <div className="bd-container">
        <div className="bd-hero-section" style={{ backgroundImage: `url(${coverImage})` }}>
          <div className="bd-hero-overlay">
            <div className="bd-hero-content">
              <div className="bd-cover-container">
                <img src={coverImage} alt={book.title} className="bd-cover-image" />
              </div>
              <div className="bd-main-info">
                <div className="bd-meta">
                  <span>{book.category}</span>
                  <span>&bull;</span>
                  <span>{book.language}</span>
                </div>
                <h1 className="bd-title">{book.title}</h1>
                <h2 className="bd-author">by {book.authorName}</h2>
                <div className="bd-ratings-placeholder">
                  <FaStar color="#f5c518" size={24} />
                  <span><strong className="bd-rating-value">N/A</strong> / 10</span>
                </div>
                {book.isForSale ? (
                  <Link to={`/purchase/${book.id}`} className="bd-action-btn buy-btn">
                    Buy Now (LKR {book.price})
                  </Link>
                ) : (
                  <Link to={`/read/${book.id}`} className="bd-action-btn read-btn">
                    Read Now
                  </Link>
                )}
                <div className="bd-reactions-section">
                  <ReactionPanel bookId={bookId} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bd-details-section">
          <div className="bd-mobile-actions-bar" onContextMenu={(e) => e.preventDefault()}>
            <div className="bd-action-icon">
              <ReactionPanel bookId={bookId} />
              <span>Reaction</span>
            </div>
            <div className="bd-action-icon">
              <FaStar />
              <span>Rate</span>
            </div>
            <div className="bd-action-icon" onClick={handleMobileCommentClick}>
              <FaCommentDots />
              <span>Comment</span>
            </div>
            <div className="bd-action-icon">
              <FaShareAlt />
              <span>Share</span>
            </div>
          </div>
          
          {showMobileCommentInput && (
            <div className="mobile-comment-input-wrapper">
              <CommentInput
                onSubmit={handleMobileCommentSubmit}
                placeholder="Write a comment..."
                value={mobileCommentText}
                onChange={(e) => setMobileCommentText(e.target.value)}
                isReply={false}
                currentUser={currentUser}
              />
            </div>
          )}

          <div className="bd-description">
            <h3>Description</h3>
            <p>{book.description || 'No description available.'}</p>
          </div>
          
          <div className="bd-comments-section" ref={commentsRef}>
            <CommentSection bookId={bookId} />
          </div>
        </div>
      </div>
    </>
  );
}

export default BookDetailsPage;