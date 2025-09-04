import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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

const Cover = React.forwardRef(({ children, onCoverClick }, ref) => {
    return (
        <div className="book-cover" ref={ref} data-density="hard" onClick={onCoverClick}>
            <div className="cover-content">
                {children}
            </div>
        </div>
    );
});

function AuthBook() {
    const bookRef = useRef(null);
    const [currentPage, setCurrentPage] = useState(0);
    const totalPages = 6;
    const location = useLocation();
    const initialFlipDone = useRef(false);

    const pageRoutes = {
      '/signup': 0, '/login': 1, '/terms': 2,
      '/privacy-policy': 3, '/about': 4, '/Signup': 0, '/Login': 1, '/Terms': 2,
      '/Privacy-policy': 3, '/About': 4
    };

    // --- 1. දෝෂ සහිත function එක ඉවත් කර, නව, වඩාත් නිවැරදි function එකක් යෙදීම ---
    const flipToPage = (targetPage) => {
        if (!bookRef.current) return;

        const pageFlip = bookRef.current.pageFlip();

        // පිටු පෙරලීම සඳහා setInterval එකක් භාවිතා කිරීම වඩාත් ස්ථාවරයි
        const flipInterval = setInterval(() => {
            const currentPageIndex = pageFlip.getCurrentPageIndex();
            
            // අපිට අවශ්‍ය පිටුවට පැමිණි විට interval එක නවත්වනවා
            if (currentPageIndex >= targetPage) {
                clearInterval(flipInterval);
                return;
            }
            
            // අවශ්‍ය පිටුවට එනතුරු, එකින් එක පිටු පෙරළනවා
            pageFlip.flipNext();

        }, 500); // එක පිටුවක් පෙරළීමට ගතවන කාලය (milliseconds)
    };

    useEffect(() => {
        const path = location.pathname;
        const targetPage = pageRoutes[path];

        if (targetPage && bookRef.current && !initialFlipDone.current) {
            // --- 2. ඔබ ඉල්ලූ පරිදි ප්‍රමාදය තත්පර 3ක් ලෙස වෙනස් කිරීම ---
            const timer = setTimeout(() => {
                flipToPage(targetPage);
                initialFlipDone.current = true;
            }, 3000); // 3000ms = 3 seconds
            return () => clearTimeout(timer);
        } else if (path === '/auth','signup','Signup','Auth' && !initialFlipDone.current) {
             const autoOpenTimer = setTimeout(() => {
                if (bookRef.current && bookRef.current.pageFlip().getCurrentPageIndex() === 0) {
                    bookRef.current.pageFlip().flipNext();
                }
            }, 5000);
            return () => clearTimeout(autoOpenTimer);
        }
    }, [location.pathname]); // location.pathname යනු dependency එකයි

    const onPage = (e) => {
        setCurrentPage(e.data);
    };
    
    const goNextPage = () => { if (bookRef.current) bookRef.current.pageFlip().flipNext(); };
    const goPrevPage = () => { if (bookRef.current) bookRef.current.pageFlip().flipPrev(); };

    return (
        <div className="auth-book-container">
            <div className="book-wrapper">
                <HTMLFlipBook
                    width={500} height={700} size="stretch"
                    minWidth={300} maxWidth={800} minHeight={420} maxHeight={1120}
                    maxShadowOpacity={0.5} showCover={true} onFlip={onPage}
                    ref={bookRef} className="auth-book"
                    useMouseEvents={false} swipeEvents={false}
                    disableFlipByClick={false} 
                >
                    <Cover onCoverClick={goNextPage}>
                        <div className="cover-design-new">
                            <img src="https://firebasestorage.googleapis.com/v0/b/nisadas-mawatha.firebasestorage.app/o/webapp%2FNisadas%20Mawatha%20Logo.png?alt=media&token=bba44519-77de-48fb-a048-941625ac3e93" alt="Nisadas Mawatha" className="cover-title-image" />
                            <p className="cover-subtitle">Registration Book</p>
                            <p className="cover-open-prompt">Click to open</p>
                        </div>
                    </Cover>
                    
                    <Page allowScroll={true}><SignupPage onNavigateToLogin={goNextPage} /></Page>
                    <Page allowScroll={true}><LoginPage onNavigateToSignup={goPrevPage} /></Page>
                    <Page allowScroll={true}><TermsPage /></Page>
                    <Page allowScroll={true}><PrivacyPolicyPage /></Page>
                    <Page allowScroll={true}><AboutPage /></Page>

                    <Cover>
                        <div className="back-cover-design"></div>
                    </Cover>
                </HTMLFlipBook>
            </div>
            
            <div className={`book-navigation ${currentPage > 0 ? 'visible' : ''}`}>
                <button onClick={goPrevPage} disabled={currentPage === 0}>
                    <BsArrowLeftCircleFill />
                </button>
                <span>Page {currentPage} of {totalPages - 1}</span>
                <button onClick={goNextPage} disabled={currentPage >= totalPages - 1}>
                    <BsArrowRightCircleFill />
                </button>
            </div>
        </div>
    );
}

export default AuthBook;