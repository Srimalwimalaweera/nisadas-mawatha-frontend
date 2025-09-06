import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { IoClose } from 'react-icons/io5';
import './ReactionListPopup.css';

// Reaction icons නැවත import කරගැනීම
import IconLove from '../ui/reaction-icons/IconLove';
import IconLike from '../ui/reaction-icons/IconLike';
import IconFire from '../ui/reaction-icons/IconFire';
import IconHaha from '../ui/reaction-icons/IconHaha';
import IconAngry from '../ui/reaction-icons/IconAngry';
import IconSad from '../ui/reaction-icons/IconSad';
// Default profile icon
import { FaUserCircle } from 'react-icons/fa';

// Reaction type එකට අදාළ icon component එක ලබා දෙන object එකක්
const reactionComponents = {
    love: IconLove, like: IconLike, fire: IconFire,
    haha: IconHaha, angry: IconAngry, sad: IconSad
};

function ReactionListPopup({ bookId, onClose }) {
    const [reactors, setReactors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReactors = async () => {
            if (!bookId) return;
            setLoading(true);
            try {
                // 1. 'reaction-manager' එකෙන් අදාළ පොතේ document එක ගන්නවා
                const reactionManagerRef = doc(db, 'reaction-manager', bookId);
                const reactionManagerSnap = await getDoc(reactionManagerRef);

                if (reactionManagerSnap.exists()) {
                    const userReactions = reactionManagerSnap.data();
                    
                    // 2. Reaction දැමූ එක් එක් user id එකට අදාළව, 'users' collection එකෙන් ඔවුන්ගේ විස්තර ගන්නවා
                    const userPromises = Object.keys(userReactions).map(async (userId) => {
                        const userRef = doc(db, 'users', userId);
                        const userSnap = await getDoc(userRef);
                        if (userSnap.exists()) {
                            // Userගේ විස්තර සහ ඔවුන් දැමූ reaction type එක එකතු කරනවා
                            return {
                                uid: userId,
                                ...userSnap.data(),
                                reactionType: userReactions[userId]
                            };
                        }
                        return null;
                    });
                    
                    const usersData = (await Promise.all(userPromises)).filter(Boolean);
                    setReactors(usersData);
                }
            } catch (error) {
                console.error("Error fetching reaction list:", error);
            }
            setLoading(false);
        };
        fetchReactors();
    }, [bookId]);

    // Reaction type එකට අදාළ Icon component එක return කරන function එකක්
    const ReactionIcon = ({ type }) => {
        const Icon = reactionComponents[type];
        return Icon ? <Icon className="reactor-reaction-icon" /> : null;
    };

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-content rlp-content" onClick={(e) => e.stopPropagation()}>
                <button className="popup-close-btn" onClick={onClose}>
                    <IoClose />
                </button>
                <h2>All Reactions</h2>
                
                <div className="reactors-list">
                    {loading ? (
                        <p className="rlp-status">Loading...</p>
                    ) : reactors.length > 0 ? (
                        reactors.map((user) => (
                            <div key={user.uid} className="reactor-item">
                                <div className="reactor-avatar-wrapper">
                                    {user.photoURL ? (
                                        <img src={user.photoURL} alt={user.displayName} className="reactor-avatar" referrerPolicy="no-referrer" />
                                    ) : (
                                        <FaUserCircle className="reactor-avatar default-avatar" />
                                    )}
                                    <div className="reactor-reaction-badge">
                                        <ReactionIcon type={user.reactionType} />
                                    </div>
                                </div>
                                <div className="reactor-info">
                                    <span className="reactor-name">{user.displayName}</span>
                                    <span className="reactor-role">{user.role}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="rlp-status">No reactions yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ReactionListPopup;