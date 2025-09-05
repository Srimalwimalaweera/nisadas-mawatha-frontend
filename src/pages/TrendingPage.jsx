import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import './TrendingPage.css';
import LoadingScreen from '../components/common/LoadingScreen';
import { FaStar } from 'react-icons/fa'; // Rating සඳහා icon එකක්

const TrendingPage = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openCardId, setOpenCardId] = useState(null);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const booksCollection = collection(db, 'books');
                const q = query(booksCollection, orderBy('publishedAt', 'desc'), limit(15));
                const querySnapshot = await getDocs(q);
                const booksData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                setBooks(booksData);

                // Default ලෙස පළමු පොත open කර පෙන්වමු
                if (booksData.length > 0) {
                    setOpenCardId(booksData[0].id);
                }
            } catch (error) {
                console.error("Error fetching trending books: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    const handleCardClick = (bookId) => {
        setOpenCardId(openCardId === bookId ? null : bookId);
    };

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <div className='trending-container'>
            <div className='trending-list-wrapper'>
                <div className='trending-header'>
                    <h1>Trending Books</h1>
                    <p>Discover the most recently published stories on Nisadas Mawatha.</p>
                </div>
                <div className='trending-list'>
                    {books.map(book => (
                        <div
                            key={book.id}
                            className={`card flex-row ${openCardId === book.id ? 'open' : ''}`}
                            onClick={() => handleCardClick(book.id)}
                        >
                            <div className='cover-and-rating'>
            <img src={book.coverImageUrl} alt={book.title} className='book-cover-img' />
            <div className='rating'>
                <FaStar className='star-icon' />
                <span className='rate-value'>{book.rate ? book.rate.toFixed(1) : 'N/A'}</span>
            </div>
        </div>
                            <div className='flex-column info'>
                                <div className='title'>{book.title}</div>
                                <div className='author'>by {book.authorName}</div>
                                <div className='hidden bottom summary'>
                                    {book.description ? `${book.description.substring(0, 150)}...` : 'No description available.'}
                                </div>
                            </div>
                            <div className='flex-column group'>
                                
                                <div className='hidden bottom'>
                                    <Link to={`/books/${book.id}`} onClick={(e) => e.stopPropagation()}>
                                        <button className='simple'>Read Now</button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TrendingPage;