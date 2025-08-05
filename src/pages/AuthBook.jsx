import React, { useState, useRef, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import './AuthBook.css';

// අපේ පරණ page components import කරගන්නවා
import SignupPage from './SignupPage';
import LoginPage from './LoginPage';
import TermsPage from './TermsPage';
import PrivacyPolicyPage from './PrivacyPolicyPage';
import AboutPage from './AboutPage';

// Icons import කරගන්නවා
import { BsArrowLeftCircleFill, BsArrowRightCircleFill } from "react-icons/bs";

// Page සහ Cover components කලින් වගේමයි
const Page = React.forwardRef((props, ref) => {
    return (
        <div className="auth-page" ref={ref}>
            <div className="page-content">
                {props.children}
            </div>
        </div>
    );
});

const Cover = React.forwardRef((props, ref) => {
    return (
        <div className="book-cover" ref={ref} data-density="hard">
            <div className="cover-content">
                {props.children}
            </div>
        </div>
    );
});


function AuthBook() {
    const bookRef = useRef(null);
    const [currentPage, setCurrentPage] = useState(0);
    const totalPages = 6; // Cover + 5 Pages + Back Cover

    // තත්පර 15කින් පොත ඉබේම open වෙන logic එක
    useEffect(() => {
        const timer = setTimeout(() => {
            if (bookRef.current && currentPage === 0) {
                bookRef.current.pageFlip().flipNext();
            }
        }, 15000);
        return () => clearTimeout(timer); // Cleanup timer
    }, [currentPage]);

    const onPage = (e) => {
        setCurrentPage(e.data);
    };

    const goNextPage = () => bookRef.current?.pageFlip().flipNext();
    const goPrevPage = () => bookRef.current?.pageFlip().flipPrev();

    return (
        <div className="auth-book-container">
            {/* Animated particles සඳහා divs */}
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>

            <div className="book-wrapper">
                <HTMLFlipBook
                    width={450}
                    height={660}
                    size="stretch"
                    minWidth={450}
                    maxWidth={800}
                    minHeight={600}
                    maxHeight={2000}
                    maxShadowOpacity={0.5}
                    showCover={true}
                    mobileScrollSupport={true}
                    onFlip={onPage}
                    ref={bookRef}
                    className="auth-book"
                >
                    <Cover>
        <div className="cover-design-new">
            {/* මෙතනට ඔබ හදාගත් "නිසඳැස් මාවත" PNG එකේ direct link එක දාන්න */}
            <img src="https://firebasestorage.googleapis.com/v0/b/nisadas-mawatha.firebasestorage.app/o/webapp%2FNisadas%20Mawatha%20Logo.png?alt=media&token=bba44519-77de-48fb-a048-941625ac3e93" alt="Nisadas Mawatha" className="cover-title-image" />
            
            <p className="cover-subtitle">Registration Book</p>
            <p className="cover-open-prompt">Click to open</p>
        </div>
    </Cover>
                    
                    <Page><SignupPage /></Page>
                    <Page><LoginPage /></Page>
                    <Page><TermsPage /></Page>
                    <Page><PrivacyPolicyPage /></Page>
                    <Page><AboutPage /></Page>

                    <Cover>
                        <div className="back-cover-design"></div>
                    </Cover>
                </HTMLFlipBook>
            </div>
            
            <div className="book-navigation">
                <button onClick={goPrevPage} disabled={currentPage === 0} aria-label="Previous Page">
                    <BsArrowLeftCircleFill />
                </button>
                <span>Page {currentPage} of {totalPages - 1}</span>
                <button onClick={goNextPage} disabled={currentPage >= 5} aria-label="Next Page">
                    <BsArrowRightCircleFill />
                </button>
            </div>
        </div>
    );
}

export default AuthBook;