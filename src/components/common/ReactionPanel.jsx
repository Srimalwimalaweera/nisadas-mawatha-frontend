import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../firebase';
import { doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';

// Import all the icons we created
import IconLove from '../ui/reaction-icons/IconLove';
import IconLike from '../ui/reaction-icons/IconLike';
import IconFire from '../ui/reaction-icons/IconFire';
import IconHaha from '../ui/reaction-icons/IconHaha';
import IconAngry from '../ui/reaction-icons/IconAngry';
import IconSad from '../ui/reaction-icons/IconSad';

import './ReactionPanel.css';

const reactions = [
    { id: 'love', name: 'Love', Icon: IconLove, color: 'text-red-500' },
    { id: 'like', name: 'Like', Icon: IconLike, color: 'text-blue-500' },
    { id: 'fire', name: 'Fire', Icon: IconFire, color: 'text-orange-500' },
    { id: 'haha', name: 'Haha', Icon: IconHaha, color: 'text-yellow-500' },
    { id: 'sad', name: 'Sad', Icon: IconSad, color: 'text-yellow-600' },
    { id: 'angry', name: 'Angry', Icon: IconAngry, color: 'text-red-700' },
];

const ReactionPanel = ({ bookId }) => {
    const { currentUser } = useAuth();
    const [isPanelVisible, setIsPanelVisible] = useState(false);
    const [userReaction, setUserReaction] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const timerRef = useRef(null);
    const panelRef = useRef(null);

    // This is a simplified handler. In a real app, you would fetch and subscribe to live data.
    const handleReactionSelect = async (newReactionId) => {
        if (!currentUser || isLoading) return;
        setIsLoading(true);

        const currentReactionId = userReaction;
        
        // Optimistically update UI
        setUserReaction(newReactionId === currentReactionId ? null : newReactionId);
        setIsPanelVisible(false);

        try {
            await runTransaction(db, async (transaction) => {
                const bookRef = doc(db, 'books', bookId);
                const reactionRef = doc(db, 'reactions', bookId);

                const bookDoc = await transaction.get(bookRef);
                const reactionDoc = await transaction.get(reactionRef);

                if (!bookDoc.exists()) {
                    throw "Book does not exist!";
                }

                let currentCounts = reactionDoc.exists() ? reactionDoc.data() : { love: 0, like: 0, fire: 0, haha: 0, sad: 0, angry: 0 };
                let currentTotal = bookDoc.data().totalReactions || 0;
                
                // Firestore doesn't create a document on get, so we handle initial state
                if (!reactionDoc.exists()) {
                    transaction.set(reactionRef, currentCounts);
                }

                // Logic to update counts
                // 1. User is removing their reaction
                if (newReactionId === currentReactionId) {
                    currentCounts[currentReactionId] = Math.max(0, currentCounts[currentReactionId] - 1);
                    currentTotal = Math.max(0, currentTotal - 1);
                } 
                // 2. User is changing their reaction
                else if (currentReactionId) {
                    currentCounts[currentReactionId] = Math.max(0, currentCounts[currentReactionId] - 1);
                    currentCounts[newReactionId] = (currentCounts[newReactionId] || 0) + 1;
                    // Total doesn't change here
                } 
                // 3. User is adding a new reaction
                else {
                    currentCounts[newReactionId] = (currentCounts[newReactionId] || 0) + 1;
                    currentTotal += 1;
                }

                // Update documents
                transaction.update(reactionRef, currentCounts);
                transaction.update(bookRef, { totalReactions: currentTotal });
            });
            console.log("Transaction successfully committed!");
        } catch (e) {
            console.error("Transaction failed: ", e);
            // Revert optimistic UI update on failure
            setUserReaction(currentReactionId);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSingleClick = () => {
        // Default single click action is 'love'
        handleReactionSelect('love');
    };

    const showPanel = () => {
        clearTimeout(timerRef.current);
        setIsPanelVisible(true);
    };

    const hidePanel = () => {
        timerRef.current = setTimeout(() => {
            setIsPanelVisible(false);
        }, 300); // A small delay to allow moving mouse to the panel
    };
    
    const selectedReactionObj = reactions.find(r => r.id === userReaction);

    return (
        <div 
            className="reaction-container"
            onMouseEnter={showPanel}
            onMouseLeave={hidePanel}
        >
            {isPanelVisible && (
                <div className="reaction-popup" ref={panelRef}>
                    {reactions.map((reaction) => (
                        <button 
                            key={reaction.id} 
                            className="reaction-button"
                            onClick={() => handleReactionSelect(reaction.id)}
                        >
                            <reaction.Icon className="reaction-icon" />
                            <span className="reaction-tooltip">{reaction.name}</span>
                        </button>
                    ))}
                </div>
            )}
            
            <button className="main-reaction-button" onClick={handleSingleClick}>
                {selectedReactionObj ? (
                    <selectedReactionObj.Icon className={`main-icon ${selectedReactionObj.color}`} />
                ) : (
                    <IconLove className="main-icon default" />
                )}
                <span className={`main-text ${selectedReactionObj ? selectedReactionObj.color : ''}`}>
                    {selectedReactionObj ? selectedReactionObj.name : 'Love'}
                </span>
            </button>
        </div>
    );
};

export default ReactionPanel;
