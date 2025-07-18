import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // URL එකෙන් parameter ගන්න hook එක
import { doc, getDoc } from 'firebase/firestore'; // Firebase එකෙන් එක document එකක් ගන්න functions
import { db } from '../firebase'; // අපේ Firebase config
import './BookDetailsPage.css'; // මේ CSS file එක ඊළඟට හදමු

function BookDetailsPage() {
  const { bookId } = useParams(); // URL එකෙන් :bookId කියන කොටස ගන්නවා
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // මේ function එකෙන් තමයි අදාළ පොතේ දත්ත ගන්නේ
    const fetchBook = async () => {
      setLoading(true);
      // 'books' collection එකේ, 'bookId' එකට අදාළ document එකට reference එක හදාගන්නවා
      const bookRef = doc(db, 'books', bookId);
      const bookSnap = await getDoc(bookRef); // ඒ document එකේ දත්ත ගන්නවා

      if (bookSnap.exists()) {
        setBook({ id: bookSnap.id, ...bookSnap.data() });
      } else {
        console.log("No such document!");
        setBook(null); // පොතක් හම්බවුනේ නැත්නම් state එක null කරනවා
      }
      setLoading(false);
    };

    fetchBook();
  }, [bookId]); // bookId එක වෙනස් වෙන හැම වෙලාවකම මේ useEffect එක ආයෙත් දුවනවා

  // දත්ත load වෙනකම් මේක පෙන්නනවා
  if (loading) {
    return <p>Loading book details...</p>;
  }

  // පොතක් හම්බවුනේ නැත්නම් මේක පෙන්නනවා
  if (!book) {
    return <h1>Book not found!</h1>;
  }

  // පොත හම්බවුණාම, විස්තර ටික පෙන්නනවා
  return (
    <div className="book-details-container">
      <img src={book.coverImageUrl} alt={book.title} className="book-details-cover" />
      <div className="book-details-info">
        <h1 className="book-details-title">{book.title}</h1>
        <h2 className="book-details-author">by {book.author}</h2>
        <p className="book-details-price">Price: LKR {book.price}</p>
        <p className="book-details-description">{book.description}</p>
        <button className="buy-now-btn">Buy Now</button>
      </div>
    </div>
  );
}

export default BookDetailsPage;