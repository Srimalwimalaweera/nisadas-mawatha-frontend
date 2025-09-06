// src/pages/BookDetailsPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './BookDetailsPage.css'; // New CSS file will be used
import PdfViewer from '../components/common/PdfViewer'; // Import our new PDF viewer
import { FaStar, FaCommentDots, FaShareAlt } from 'react-icons/fa';
import ReactionPanel from '../components/common/ReactionPanel';


function BookDetailsPage() {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPdfViewer, setShowPdfViewer] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      const bookRef = doc(db, 'books', bookId);
      const bookSnap = await getDoc(bookRef);

      if (bookSnap.exists()) {
        setBook({ id: bookSnap.id, ...bookSnap.data() });
      } else {
        console.log("No such document!");
        setBook(null);
      }
      setLoading(false);
    };

    fetchBook();
  }, [bookId]);

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
<div className="bd-mobile-actions-bar"  onContextMenu={(e) => e.preventDefault()}>
  <div className="bd-action-icon"> {/* ReactionPanel එක div එකක් තුළට දැමීම */}
    <ReactionPanel bookId={bookId} />
    <span>Reaction</span> {/* ඊට යටින් නම එක් කිරීම */}
  </div>
            <div className="bd-action-icon">
              <FaStar />
              <span>Rate</span>
            </div>
            <div className="bd-action-icon">
              <FaCommentDots />
              <span>Comment</span>
            </div>
            <div className="bd-action-icon">
              <FaShareAlt />
              <span>Share</span>
            </div>
          </div>

          <div className="bd-description">
            <h3>Description</h3>
            <p>{book.description || 'No description available.'}</p>
          </div>
          
          <div className="bd-comments-placeholder">
            <h3>Comments & Reviews</h3>
            <p>Comments feature will be available soon.</p>
          </div>
        </div>
      </div>

      {showPdfViewer && (
        <PdfViewer pdfUrl={book.ebookFileUrl} onClose={() => setShowPdfViewer(false)} />
      )}
    </>
  );
}

export default BookDetailsPage;