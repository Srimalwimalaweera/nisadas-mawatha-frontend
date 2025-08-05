import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import BookCard from '../components/common/BookCard.jsx'; // <-- අපේ පරණ BookCard එකමයි
import './Homepage.css'; // <-- Homepage එකේ CSS එකම පාවිච්චි කරමු

function MyLibraryPage() {
  const { currentUser } = useAuth();
  const [purchasedBooks, setPurchasedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchasedBooks = async () => {
      if (currentUser) {
        try {
          // 1. Userගේ purchasedBooks sub-collection එකෙන් පොත් ID ටික ගන්නවා
          const purchasedBooksRef = collection(db, 'users', currentUser.uid, 'purchasedBooks');
          const purchasedSnapshot = await getDocs(purchasedBooksRef);
          const bookIds = purchasedSnapshot.docs.map(doc => doc.id);

          if (bookIds.length > 0) {
            // 2. ඒ ID ටික පාවිච්චි කරලා, 'books' collection එකෙන් පොත්වල විස්තර ගන්නවා
            const bookPromises = bookIds.map(id => getDoc(doc(db, 'books', id)));
            const bookDocs = await Promise.all(bookPromises);

            const booksData = bookDocs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            setPurchasedBooks(booksData);
          }
        } catch (error) {
          console.error("Error fetching purchased books: ", error);
        }
      }
      setLoading(false);
    };

    fetchPurchasedBooks();
  }, [currentUser]);

  if (loading) {
    return <p>Loading your library...</p>;
  }

  return (
    <div>
      <h1>My Library</h1>
      {purchasedBooks.length === 0 ? (
        <p>You haven't purchased any books yet.</p>
      ) : (
        <div className="books-grid">
          {purchasedBooks.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}

export default MyLibraryPage;