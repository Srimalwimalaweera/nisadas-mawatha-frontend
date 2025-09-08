import React, { useState, useEffect, useRef,useMemo } from 'react';
import { db } from '../../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getApp } from 'firebase/app';
import { useAuth } from '../../context/AuthContext';
import { usePopup } from '../../context/PopupContext';

// Import all reaction icons
import IconLove from './reaction-icons/IconLove';
import IconLike from './reaction-icons/IconLike';
import IconFire from './reaction-icons/IconFire';
import IconHaha from './reaction-icons/IconHaha';
import IconAngry from './reaction-icons/IconAngry';
import IconSad from './reaction-icons/IconSad';
import { Heart } from 'lucide-react'; // Default icon
import { usePopupManager } from '../../context/PopupManagerContext';
// Reuse the same CSS file from the book reaction panel
import '../common/ReactionPanel.css';

const reactions = [
    { id: 'love', name: 'Love', Icon: IconLove },
    { id: 'like', name: 'Like', Icon: IconLike },
    { id: 'fire', name: 'Fire', Icon: IconFire },
    { id: 'haha', name: 'Haha', Icon: IconHaha },
    { id: 'sad', name: 'Sad', Icon: IconSad },
    { id: 'angry', name: 'Angry', Icon: IconAngry },
];

const CommentReactionPanel = ({ bookId, commentId, replyId, initialCounts }) => {
    const { currentUser } = useAuth();
    const { openLoginPrompt } = usePopup();
    const { activePanelId, openPanel, closeAllPanels } = usePopupManager();

    const [isPanelPinned, setIsPanelPinned] = useState(false); 
    const [userReaction, setUserReaction] = useState(null);
    const [totalReactions, setTotalReactions] = useState(0);
    const [topReactions, setTopReactions] = useState([]);
    const [isClosing, setIsClosing] = useState(false)
    const panelId = useMemo(() => `comment-reaction-panel-${commentId}-${replyId}-${Math.random()}`, [commentId, replyId]);
    const isPanelVisible = activePanelId === panelId;

    const panelTimerRef = useRef(null);
    
    const containerRef = useRef(null);

    // Update totals and top reactions from the prop
    useEffect(() => {
        const counts = initialCounts || {};
        const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
        setTotalReactions(total);

        const sorted = Object.entries(counts)
            .filter(([, count]) => count > 0)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([id]) => id);
        setTopReactions(sorted);
    }, [initialCounts]);

     // Listen for the current user's reaction
     useEffect(() => {
        if (!currentUser) {
            setUserReaction(null);
            return;
        }
        const reactionDocId = replyId ? `${bookId}_${commentId}_${replyId}` : `${bookId}_${commentId}`;
        const reactionRef = doc(db, 'commentReactions', reactionDocId);

        const unsubscribe = onSnapshot(reactionRef, (doc) => {
            if (doc.exists() && doc.data()[currentUser.uid]) {
                setUserReaction(doc.data()[currentUser.uid]);
            } else {
                setUserReaction(null);
            }
        });
        return () => unsubscribe();
    }, [bookId, commentId, replyId, currentUser]);

     useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsClosing(true);
                setTimeout(() => {
                    closeAllPanels();
                    setIsClosing(false);
                    setIsPanelPinned(false);
                }, 300);
            }
        };
        if (isPanelVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isPanelVisible, closeAllPanels]);


    useEffect(() => {
        if (isPanelPinned && isPanelVisible) {
            const timer = setTimeout(() => {
                setIsClosing(true);
                setTimeout(() => {
                    closeAllPanels();
                    setIsClosing(false);
                    setIsPanelPinned(false);
                }, 300);
            }, 15000); // තත්පර 15

            return () => clearTimeout(timer); // Cleanup timer
        }
    }, [isPanelPinned, isPanelVisible, closeAllPanels]);


    const handleReactionSelect = async (reactionType) => {
        if (!currentUser) {
            openLoginPrompt();
            return;
        }
        setIsPanelPinned(false);
        closeAllPanels();

        // Call cloud function to handle the logic
        try {
            const functions = getFunctions(getApp(), "us-central1");
            const toggleCommentReaction = httpsCallable(functions, 'toggleCommentReaction');
            await toggleCommentReaction({ bookId, commentId, replyId, reactionType });
        } catch (error) {
            console.error("Error toggling comment reaction:", error);
            alert("Couldn't save reaction. Please try again.");
        }
    };

    // UI helper functions
      const showPanel = (pin = false) => {
        clearTimeout(panelTimerRef.current);
        if (pin) {
            setIsPanelPinned(true);
        }
        openPanel(panelId);
    };

    const hidePanel = () => {
        panelTimerRef.current = setTimeout(() => {
            // Pin කර නොමැතිනම් පමණක් auto-close වීම
            if (!isPanelPinned) {
                setIsClosing(true);
                setTimeout(() => {
                    closeAllPanels();
                    setIsClosing(false);
                }, 300);
            }
        }, 500);
    };

    const handleMouseDown = () => {
        // Long press එකක් සඳහා timer එකක් තබා, showPanel(true) ලෙස call කිරීම
        const longPressTimer = setTimeout(() => {
            showPanel(true); // Pin the panel
        }, 400); // 400ms for long press

        // Mouse up කළ විට timer එක clear කිරීම
        containerRef.current.addEventListener('mouseup', () => clearTimeout(longPressTimer), { once: true });
        containerRef.current.addEventListener('mouseleave', () => clearTimeout(longPressTimer), { once: true });
    };

    const ReactionIcon = userReaction ? reactions.find(r => r.id === userReaction)?.Icon : Heart;
    

    return (
        <div 
            ref={containerRef} 
            className="reaction-container"
            onMouseEnter={() => showPanel(false)} // Hover is not a pin
            onMouseLeave={hidePanel}
        >
            {isPanelVisible && (
                <div className={`reaction-popup ${isClosing ? 'closing' : ''}`}>
                    {reactions.map(r => (
                        <button key={r.id} className="reaction-button" onClick={() => handleReactionSelect(r.id)}>
                            <r.Icon className="reaction-icon" isAnimating={true} />
                            <span className="reaction-tooltip">{r.name}</span>
                        </button>
                    ))}
                </div>
            )}
            <div className="main-reaction-button-wrapper">
                <button 
                    className={`main-reaction-button icon-only ${userReaction ? 'reacted' : ''}`}
                    onClick={() => handleReactionSelect(userReaction || 'love')}
                    onMouseDown={handleMouseDown} // Long press සඳහා
                    onContextMenu={(e) => e.preventDefault()}
                    onTouchStart={handleMouseDown} // Mobile long press සඳහා
                >
                    {ReactionIcon && <ReactionIcon className={`main-icon ${userReaction || ''}`} />}
                </button>
                
                <div className="top-reactions-summary">
                    {topReactions.map((reactionId, index) => {
                        const reaction = reactions.find(r => r.id === reactionId);
                        if (!reaction) return null;
                        return (
                            <div key={reactionId} className="top-reaction-icon" style={{ zIndex: 3 - index }}>
                                <reaction.Icon isAnimating={false} />
                            </div>
                        );
                    })}
                </div>
                {totalReactions > 0 && <span className="reaction-count">{totalReactions}</span>}
            </div>
        </div>
    );
};

export default CommentReactionPanel;