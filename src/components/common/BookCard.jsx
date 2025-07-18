import React from 'react';
import './BookCard.css';
import { Link } from 'react-router-dom'; // <-- අලුතෙන් import කරගන්න

function BookCard({ book }) {
  return (
    <Link to={`/books/${book.id}`} className="book-card-link"> {/* <-- Link එක එකතු කිරීම */}
      <div className="book-card">
        <img src={book.coverImageUrl} alt={book.title} className="book-card-image" />
        <div className="book-card-content">
          <h3 className="book-card-title">{book.title}</h3>
          <p className="book-card-author">{book.author}</p>
        </div>
      </div>
    </Link>
  );
}

export default BookCard;