import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useAuth } from '../../context/AuthContext';
import { usePopup } from '../../context/PopupContext';

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
    const [isPanelVisible, setIsPanelVisible] = useState(false);
    const [userReaction, setUserReaction] = useState(null);
    const [totalReactions, setTotalReactions] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isReactorListOpen, setIsReactorListOpen] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [topReactions, setTopReactions] = useState([]);
    const [isPanelPinned, setIsPanelPinned] = useState(false);
    
    const panelTimerRef = useRef(null);
    const animationTimerRef = useRef(null);
    const longPressTimerRef = useRef(null);
    const containerRef = useRef(null);

    // useEffect to fetch and listen for real-time reaction data
    useEffect(() => {
        if (!bookId) return;

const reactionRef = doc(db, 'reactions', bookId);
        const unsubscribeReactions = onSnapshot(reactionRef, (doc) => {
            if (doc.exists()) {
                const counts = doc.data();
                // වැඩිම reactions ඇති 3 තෝරාගැනීම
                const sortedReactions = Object.entries(counts)
                    .filter(([, count]) => count > 0) // count එක 0 ට වඩා වැඩි ඒවා පමණක් තෝරාගැනීම
                    .sort(([, a], [, b]) => b - a) // වැඩිම count එක අනුව sort කිරීම
                    .slice(0, 3) // පළමු 3 තෝරාගැනීම
                    .map(([id]) => id); // reaction id එක පමණක් ලබාගැනීම
                setTopReactions(sortedReactions);
            } else {
                setTopReactions([]);
            }
        });

        // Listener for total reaction counts from the 'books' collection
        const bookRef = doc(db, 'books', bookId);
        const unsubscribeBook = onSnapshot(bookRef, (doc) => {
            if (doc.exists()) {
                setTotalReactions(doc.data().totalReactions || 0);
            }
        });

        // Listener for the CURRENT user's reaction from 'reaction-manager'
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
            // If user logs out, clear their reaction state
            setUserReaction(null);
        }

        // Cleanup listeners on component unmount
        return () => {
            unsubscribeBook();
            unsubscribeReactions();
            if (unsubscribeUserReaction) {
                unsubscribeUserReaction();
            }
            
        };
    }, [bookId, currentUser]);


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsPanelVisible(false);
                setIsPanelPinned(false);
            }
        };

        if (isPanelVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isPanelVisible]);


    // Function to handle reaction selection
    const handleReactionSelect = async (newReactionId) => {
    if (!currentUser) {
        openLoginPrompt();
        return;
    }
    if (isLoading) return;
    
    const currentReactionId = userReaction;
    
    // --- Optimistic UI Update ---
    // Backend එකට යැවීමට පෙර, UI එක ක්ෂණිකව යාවත්කාලීන කිරීම
    setUserReaction(newReactionId === currentReactionId ? null : newReactionId);
    setIsPanelVisible(false);
    
    // Backend call එක වෙනම ක්‍රියාත්මක වීමට ඉඩ හැරීම
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
        setUserReaction(currentReactionId); // දෝෂයක් ඇති වුවහොත්, පැරණි reaction එකටම UI එක නැවත සකස් කිරීම
    } finally {
        setIsLoading(false);
    }
};

    // --- UPDATED LOGIC ---
    const handleMainIconClick = () => {
        const reactionToSend = userReaction ? userReaction : 'love';
        handleReactionSelect(reactionToSend);
    };

    const showPanel = () => {
        clearTimeout(panelTimerRef.current);
        setIsPanelVisible(true);
    };
    const hidePanelWithDelay = () => {
        panelTimerRef.current = setTimeout(() => {
            if (!isPanelPinned) { // Only hide if not pinned by long press
                setIsPanelVisible(false);
            }
        }, 3000); // 3-second delay
    };
    
    // --- UPDATED LOGIC FOR LONG PRESS ---
    const handleMouseDown = () => {
        longPressTimerRef.current = setTimeout(() => {
            showPanel();
            setIsPanelPinned(true); // Pin the panel open on long press
        }, 500); // 500ms for long press
    };

    const handleMouseUp = () => clearTimeout(longPressTimerRef.current);

    const handleAllReactionsClick = () => {
         // Only open the list if long press timer didn't fire
        if(!isPanelVisible) {
            setIsReactorListOpen(true)
        }
    }

    const selectedReactionObj = reactions.find(r => r.id === userReaction);
    const MainIcon = selectedReactionObj ? selectedReactionObj.Icon : DefaultReactionIcon;

    return (
        <>
            <div 
                ref={containerRef} // Add ref to the main container
                className="reaction-container"
                onMouseEnter={showPanel}
                onMouseLeave={hidePanelWithDelay}
            >
                {isPanelVisible && (
                    <div 
                        className="reaction-popup"
                        onMouseEnter={showPanel} // Keep panel open when mouse enters it
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
                    >
                        <MainIcon isAnimating={isAnimating} className={`main-icon ${selectedReactionObj ? 'reacted' : 'default'}`} />
                        {selectedReactionObj ? (
        <span className="main-text reacted">{selectedReactionObj.name}</span>
    ) : (
        <span className="main-text add-reaction-prompt">Add Reaction</span>
    )}
</button>
                    
                    {/* --- UPDATED TO ALWAYS SHOW "ALL REACTIONS" --- */}
                    <button 
                        className="main-text" 
                        onClick={handleAllReactionsClick}
                        onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}
                        onTouchStart={handleMouseDown} onTouchEnd={handleMouseUp}
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

