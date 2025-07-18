import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // අපේ Firebase config import කරගන්නවා
import { collection, getDocs } from 'firebase/firestore'; // Firestore වලින් දත්ත ගන්න functions
import BookCard from '../components/common/BookCard.jsx'; // BookCard එක import කරගන්නවා
import './Homepage.css'; // මේ CSS file එක හදමු

function Homepage() {
  // පොත් ලැයිස්තුව තියාගන්න state එකක්
  const [books, setBooks] = useState([]); 
  // දත්ත load වෙනවද බලන්න state එකක්
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    // මේ function එක component එක මුලින්ම render වුණාට පස්සේ එක පාරක් දුවනවා
    const fetchBooks = async () => {
      try {
        const booksCollection = collection(db, 'books'); // 'books' collection එකට reference එකක්
        const bookSnapshot = await getDocs(booksCollection); // collection එකේ documents ඔක්කොම ගන්නවා
        const booksList = bookSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBooks(booksList); // ගත්ත පොත් ටික state එකට දානවා
      } catch (error) {
        console.error("Error fetching books: ", error);
      } finally {
        setLoading(false); // loading ඉවරයි කියලා state එක update කරනවා
      }
    };

    fetchBooks();
  }, []); // [] හිස් array එක නිසා මේක දුවන්නේ එකම එක පාරයි.

  if (loading) {
    return <p>Loading books...</p>;
  }

  return (
    <div>
      <h1>අලුතෙන්ම එකතු වූ පොත්</h1>
      <div className="books-grid">
        {books.map(book => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}

export default Homepage;