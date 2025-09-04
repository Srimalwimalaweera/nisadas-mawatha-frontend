// src/pages/PdfReaderPage.jsx (STABLE VERSION)

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import BasicPdfLayout from '../components/page_layouts/BasicPdfLayout';
import './PdfReaderPage.css'; 

function PdfReaderPage() {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [loadingBook, setLoadingBook] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    // This flag prevents state updates on an unmounted component
    let isMounted = true; 

    const fetchBook = async () => {
      try {
        const bookRef = doc(db, 'books', bookId);
        const bookSnap = await getDoc(bookRef);

        if (!isMounted) return; // Stop if component unmounted

        if (bookSnap.exists()) {
          setBook({ id: bookSnap.id, ...bookSnap.data() });
        } else {
          setFetchError("The book you are looking for does not exist.");
        }
      } catch (e) {
        if (isMounted) {
            setFetchError("Failed to fetch book details.");
        }
      } finally {
        if (isMounted) {
            setLoadingBook(false);
        }
      }
    };

    fetchBook();

    return () => {
      // Cleanup function to set the flag when component unmounts
      isMounted = false;
    };
  }, [bookId]);

  if (loadingBook) {
    return <div className="reader-status">Loading Book Information...</div>;
  }
  
  if (fetchError) {
    return <div className="reader-status">{fetchError}</div>;
  }

  // Render the layout only when book data is available
  return (
    <div className="reader-container-new">
       <header className="reader-header">
            <Link to={`/books/${bookId}`} className="back-link">&larr; Back to Details</Link>
            <h1>{book.title}</h1>
            <span style={{flex: 1}}></span>
        </header>
        <main className="reader-main">
            <BasicPdfLayout pdfUrl={book.ebookFileUrl} />
        </main>
    </div>
  );
}

export default PdfReaderPage;