import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import BookCard from '../components/common/BookCard.jsx';
import PopularBooksCarousel from '../components/common/PopularBooksCarousel.jsx';
import { useFilters } from '../context/FilterContext.jsx';
import './Homepage.css';

function Homepage() {
  const [allBooks, setAllBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { searchQuery, filters } = useFilters();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const booksCollection = collection(db, 'books');
        const bookSnapshot = await getDocs(booksCollection);
        const booksList = bookSnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data(),
          // Mock data for new features if not in firestore
          averageRating: doc.data().averageRating || parseFloat((Math.random() * (5 - 3) + 3).toFixed(1)),
          category: doc.data().category || "Fiction",
        }));
        setAllBooks(booksList);
      } catch (error) {
        console.error("Error fetching books: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const filteredBooks = useMemo(() => {
    if (loading) return [];
    
    let booksToFilter = [...allBooks];

    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      booksToFilter = booksToFilter.filter(book => 
        book.title.toLowerCase().includes(lowercasedQuery) ||
        book.author.toLowerCase().includes(lowercasedQuery)
      );
    }
    
    // Add more filtering logic here for category, language etc. from filters object

    // Add sorting logic
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'rating':
          booksToFilter.sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0));
          break;
        // Add more sorting cases later (newest, popularity)
        default:
          break;
      }
    }

    return booksToFilter;
  }, [allBooks, searchQuery, filters, loading]);

  const popularBooks = useMemo(() => {
    // A simple logic for popular books, e.g., rating > 4.2
    return filteredBooks
      .filter(b => (b.averageRating || 0) > 4.2)
      .slice(0, 10);
  }, [filteredBooks]);

  if (loading) {
    return <p className="loading-text">Loading books...</p>;
  }

  return (
    <div className="homepage-container">
      <PopularBooksCarousel books={popularBooks} />
      
      <div className="separator"></div>

      <section>
        <h2 className="discover-title">Discover More</h2>
        {filteredBooks.length > 0 ? (
          <div className="books-grid">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
           <p className="no-books-message">No books match the current search or filters.</p>
        )}
      </section>
    </div>
  );
}

export default Homepage;