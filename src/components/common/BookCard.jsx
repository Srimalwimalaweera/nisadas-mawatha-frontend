import React from 'react';
import './BookCard.css';

function BookCard({ book }) {
  return (
    <div className="book-card">
      <img src={book.coverImageUrl} alt={book.title} className="book-card-image" />
      <div className="book-card-content">
        <h3 className="book-card-title">{book.title}</h3>
        <p className="book-card-author">{book.author}</p>
      </div>
    </div>
  );
}

export default BookCard;