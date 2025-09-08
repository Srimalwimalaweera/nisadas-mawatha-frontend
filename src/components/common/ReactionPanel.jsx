import React, { useState, useEffect, useRef, useMemo } from 'react';
import { db } from '../../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useAuth } from '../../context/AuthContext';
import { usePopup } from '../../context/PopupContext';
import { usePopupManager } from '../../context/PopupManagerContext';

import IconLove from '../ui/reaction-icons/IconLove';
import IconLike from '../ui/reaction-icons/IconLike';
import IconFire from '../ui/reaction-icons/IconFire';
import IconHaha from '../ui/reaction-icons/IconHaha';
import IconAngry from '../ui/reaction-icons/IconAngry';
import IconSad from '../ui/reaction-icons/IconSad';
import DefaultReactionIcon from '../ui/reaction-icons/DefaultReaction';
import ReactionListPopup from './ReactionListPopup';
import './ReactionPanel.css';

const reactions = [
    { id: 'love', name: 'Love', Icon: IconLove }, { id: 'like', name: 'Like', Icon: IconLike },
    { id: 'fire', name: 'Fire', Icon: IconFire }, { id: 'haha', name: 'Haha', Icon: IconHaha },
    { id: 'sad', name: 'Sad', Icon: IconSad }, { id: 'angry', name: 'Angry', Icon: IconAngry },
];

const ReactionPanel = ({ bookId }) => {
    const { currentUser } = useAuth();
    const { openLoginPrompt } = usePopup();
    const { activePanelId, openPanel, closeAllPanels } = usePopupManager();
    
    const [userReaction, setUserReaction] = useState(null);
    const [totalReactions, setTotalReactions] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isReactorListOpen, setIsReactorListOpen] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [topReactions, setTopReactions] = useState([]);
    const [isClosing, setIsClosing] = useState(false);
    
    const panelId = useMemo(() => `reaction-panel-${bookId}-${Math.random()}`, [bookId]);
    const isPanelVisible = activePanelId === panelId;
    
    const panelTimerRef = useRef(null);
    const animationTimerRef = useRef(null);
    const longPressTimerRef = useRef(null);
    const containerRef = useRef(null);

    // Fetches and listens for real-time reaction data
    useEffect(() => {
        if (!bookId) return;

        const reactionRef = doc(db, 'reactions', bookId);
        const unsubscribeReactions = onSnapshot(reactionRef, (doc) => {
            if (doc.exists()) {
                const counts = doc.data();
                const sortedReactions = Object.entries(counts)
                    .filter(([, count]) => count > 0)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 3)
                    .map(([id]) => id);
                setTopReactions(sortedReactions);
            } else {
                setTopReactions([]);
            }
        });

        const bookRef = doc(db, 'books', bookId);
        const unsubscribeBook = onSnapshot(bookRef, (doc) => {
            if (doc.exists()) {
                setTotalReactions(doc.data().totalReactions || 0);
            }
        });

        let unsubscribeUserReaction;
        if (currentUser) {
            const reactionManagerRef = doc(db, 'reaction-manager', bookId);
            unsubscribeUserReaction = onSnapshot(reactionManagerRef, (doc) => {
                if (doc.exists() && doc.data()[currentUser.uid]) {
                    setUserReaction(doc.data()[currentUser.uid]);
                } else {
                    setUserReaction(null);
                }
            });
        } else {
            setUserReaction(null);
        }

        return () => {
            unsubscribeBook();
            unsubscribeReactions();
            if (unsubscribeUserReaction) {
                unsubscribeUserReaction();
            }
        };
    }, [bookId, currentUser]);

    // Handles closing the panel when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
               // Close with animation
                setIsClosing(true);
                setTimeout(() => {
                    closeAllPanels();
                    setIsClosing(false);
                }, 300); // Animation එකේ කාලයට සමාන විය යුතුය
            }
        };
        if (isPanelVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isPanelVisible, closeAllPanels]);

    const handleReactionSelect = async (newReactionId) => {
        if (!currentUser) {
            openLoginPrompt();
            closeAllPanels();
            return;
        }
        if (isLoading) return;

        const currentReactionId = userReaction;
        
        // Optimistic UI Update
        setUserReaction(newReactionId === currentReactionId ? null : newReactionId);
        closeAllPanels(); // Close panel using context
        
        setIsLoading(true);
        clearTimeout(animationTimerRef.current);
        
        try {
            const functions = getFunctions();
            const updateReaction = httpsCallable(functions, 'updateReaction');
            await updateReaction({
                bookId: bookId,
                newReactionId: newReactionId,
            });
            
            setIsAnimating(true);
            animationTimerRef.current = setTimeout(() => setIsAnimating(false), 2000);
        } catch (e) {
            console.error("Error calling cloud function: ", e);
            setUserReaction(currentReactionId); // Revert on error
        } finally {
            setIsLoading(false);
        }
    };

    const handleMainIconClick = () => {
        const reactionToSend = userReaction ? userReaction : 'love';
        handleReactionSelect(reactionToSend);
    };

    // UI helper functions now use the context
    const showPanel = () => { clearTimeout(panelTimerRef.current); openPanel(panelId); };
    const hidePanelWithDelay = () => { panelTimerRef.current = setTimeout(() => {
            setIsClosing(true);
            setTimeout(() => {
                closeAllPanels();
                setIsClosing(false);
            }, 300);
        }, 300); 
    };
    const handleMouseDown = () => { longPressTimerRef.current = setTimeout(showPanel, 500); };
    const handleMouseUp = () => clearTimeout(longPressTimerRef.current);

    const handleAllReactionsClick = () => {
       if(!isPanelVisible) {
           setIsReactorListOpen(true);
       }
    }

    const selectedReactionObj = reactions.find(r => r.id === userReaction);
    const MainIcon = selectedReactionObj ? selectedReactionObj.Icon : DefaultReactionIcon;

    return (
        <>
            <div 
                ref={containerRef}
                className="reaction-container"
            >
                {isPanelVisible && (
                    <div 
                        className={`reaction-popup ${isClosing ? 'closing' : ''}`}
                        onMouseEnter={showPanel}
                        onMouseLeave={hidePanelWithDelay}
                    >
                        {reactions.map((reaction) => (
                            <button key={reaction.id} className="reaction-button" onClick={() => handleReactionSelect(reaction.id)}>
                                <reaction.Icon className="reaction-icon" isAnimating={true} />
                                <span className="reaction-tooltip">{reaction.name}</span>
                            </button>
                        ))}
                    </div>
                )}
                
                <div className="main-reaction-button-wrapper">
                    <button 
                        className="main-reaction-button icon-only" 
                        onClick={handleMainIconClick}
                        onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}
                        onTouchStart={handleMouseDown} onTouchEnd={handleMouseUp}
                        onContextMenu={(e) => e.preventDefault()}
                        disabled={isLoading}
                        onMouseEnter={showPanel}    
                        onMouseLeave={hidePanelWithDelay} 
                    >
                        <MainIcon isAnimating={isAnimating} className={`main-icon ${selectedReactionObj ? 'reacted' : 'default'}`} />
                        {selectedReactionObj ? (
                            <span className="main-text reacted">{selectedReactionObj.name}</span>
                        ) : (
                            <span className="main-text add-reaction-prompt">Add Reaction</span>
                        )}
                    </button>
                    
                    <button 
                        className="main-text" 
                        onClick={handleAllReactionsClick}
                        onContextMenu={(e) => e.preventDefault()}
                    >
                        <div className="top-reactions-summary">
                            {topReactions.map((reactionId, index) => {
                                const reaction = reactions.find(r => r.id === reactionId);
                                if (!reaction) return null;
                                return (
                                    <div key={reactionId} className="top-reaction-icon" style={{ zIndex: 3 - index }}>
                                        <reaction.Icon isAnimating={true} />
                                    </div>
                                );
                            })}
                        </div>
                        
                        {totalReactions > 0 && (
                            <>
                                <span className="reaction-count">{totalReactions}</span>
                                <span>&bull;</span>
                            </>
                        )}
                        <span>All Reactions</span>
                    </button>
                </div>
            </div>

            {isReactorListOpen && <ReactionListPopup bookId={bookId} onClose={() => setIsReactorListOpen(false)} />}
        </>
    );
};

export default ReactionPanel;