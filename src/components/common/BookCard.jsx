import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa'; // Star icon එකට
import './BookCard.css';

function BookCard({ book }) {
  // Placeholder image එකක්, cover image එකක් නැති වුණොත් පෙන්වන්න
  const coverImage = book.coverImageUrl || `https://placehold.co/300x450/2a3a38/ffffff?text=${encodeURIComponent(book.title)}`;

  return (
    <Link to={`/books/${book.id}`} className="book-card-link-wrapper">
      <div className="book-card-container">
        <div className="book-card-image-container">
          <img
            src={coverImage}
            alt={book.title}
            className="book-card-image"
          />
        </div>
        <div className="book-card-content">
          <h3 className="book-card-title">{book.title}</h3>
          <p className="book-card-author">{book.author}</p>
        </div>
        <div className="book-card-footer">
          <div className="book-card-badges">
            {book.category && <span className="book-card-badge-secondary">{book.category}</span>}
          </div>
          {book.averageRating && (
            <div className="book-card-rating">
              <FaStar fill="currentColor" />
              <span>{book.averageRating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default BookCard;