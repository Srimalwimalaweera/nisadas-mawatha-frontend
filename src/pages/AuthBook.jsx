import React, { useState, useRef, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import './AuthBook.css';

import SignupPage from './SignupPage';
import LoginPage from './LoginPage';
import TermsPage from './TermsPage';
import PrivacyPolicyPage from './PrivacyPolicyPage';
import AboutPage from './AboutPage';

import { BsArrowLeftCircleFill, BsArrowRightCircleFill } from "react-icons/bs";

const Page = React.forwardRef(({ children, allowScroll = false }, ref) => {
    return (
        <div className="auth-page" ref={ref}>
            <div 
                className={`page-content-wrapper ${allowScroll ? 'scrollable' : ''}`}
                onMouseDown={(e) => e.stopPropagation()}
            >
                {children}
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
    const totalPages = 6; 

    useEffect(() => {
        const timer = setTimeout(() => {
            if (bookRef.current && currentPage === 0) {
                bookRef.current.pageFlip().flipNext();
            }
        }, 15000);
        return () => clearTimeout(timer);
    }, [currentPage]);

    const onPage = (e) => {
        setCurrentPage(e.data);
    };
    
    const goNextPage = () => {
      if (bookRef.current) {
        bookRef.current.pageFlip().flipNext();
      }
    };

    const goPrevPage = () => {
      if (bookRef.current && bookRef.current.pageFlip()) {
        bookRef.current.pageFlip().flipPrev();
      }
    };

    return (
        <div className="auth-book-container">
            <div className="book-wrapper">
                <HTMLFlipBook
                    width={500}
                    height={700}
                    size="stretch"
                    minWidth={300}
                    maxWidth={800}
                    minHeight={420}
                    maxHeight={1120}
                    maxShadowOpacity={0.5}
                    showCover={true}
                   
                    onFlip={onPage}
                    ref={bookRef}
                    className="auth-book"
                    disableFlipByClick={false}
                    useMouseEvents={false}
                    swipeEvents={false}
                >
                    <Cover>
                        <div className="cover-design-new">
                            <img src="https://firebasestorage.googleapis.com/v0/b/nisadas-mawatha.firebasestorage.app/o/webapp%2FNisadas%20Mawatha%20Logo.png?alt=media&token=bba44519-77de-48fb-a048-941625ac3e93" alt="Nisadas Mawatha" className="cover-title-image" />
                            <p className="cover-subtitle">Registration Book</p>
                            <p className="cover-open-prompt">Click to open</p>
                        </div>
                    </Cover>
                    
                    {/* ඔබගේ ඉල්ලීම පරිදි සියලුම පිටු scrollable ලෙස තැබුවා */}
                    <Page allowScroll={true}><SignupPage /></Page>
                    <Page allowScroll={true}><LoginPage /></Page>
                    <Page allowScroll={true}><TermsPage /></Page>
                    <Page allowScroll={true}><PrivacyPolicyPage /></Page>
                    <Page allowScroll={true}><AboutPage /></Page>

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
                <button onClick={goNextPage} disabled={currentPage >= totalPages - 1} aria-label="Next Page">
                    <BsArrowRightCircleFill />
                </button>
            </div>
        </div>
    );
}

export default AuthBook;