// src/components/common/ReaderHeader.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './ReaderHeader.css';

function ReaderHeader({ bookTitle, bookId }) {
  return (
    <header className="reader-header-new">
      <Link to={`/books/${bookId}`} className="reader-back-link">
        &larr; Back to Details
      </Link>
      <h1 className="reader-title">{bookTitle}</h1>
      <div className="reader-header-placeholder"></div>
    </header>
  );
}

export default ReaderHeader;