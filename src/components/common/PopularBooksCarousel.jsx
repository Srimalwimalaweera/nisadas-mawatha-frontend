import React from 'react';
import BookCard from './BookCard';
import './PopularBooksCarousel.css';

function PopularBooksCarousel({ books }) {
  if (!books || books.length === 0) {
    return null;
  }

  return (
    <div className="carousel-container">
      <h2 className="carousel-title">Popular Reads</h2>
      <div className="carousel-wrapper">
        <div className="carousel-track">
          {books.map((book) => (
            <div key={book.id} className="carousel-item">
              <BookCard book={book} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PopularBooksCarousel;