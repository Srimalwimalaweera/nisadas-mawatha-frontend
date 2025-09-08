import React, { createContext, useContext, useState, useCallback } from 'react';
import { db } from '../firebase';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';

const CommentContext = createContext();

export const useComments = () => useContext(CommentContext);

// User data cache එක, නැවත නැවත user data fetch කිරීම වැළැක්වීමට
const userCache = new Map();
const fetchUserData = async (userId) => {
    if (userCache.has(userId)) return userCache.get(userId);
    const defaultUser = { 
        displayName: 'User', 
        photoURL: "https://firebasestorage.googleapis.com/v0/b/nisadas-mawatha.firebasestorage.app/o/webapp%2Fdefault-user.png?alt=media&token=a037895e-a611-4959-871d-c0f5f78c1874" 
    };

    try {
        const userSnap = await getDoc(doc(db, 'users', userId));
        if (userSnap.exists()) {
            const userData = userSnap.data();
            // Userට photoURL එකක් නැත්නම්, default URL එක යෙදීම
            const finalUserData = {
                ...userData,
                photoURL: userData.photoURL || defaultUser.photoURL
            };
            userCache.set(userId, finalUserData);
            return finalUserData;
        }
        return defaultUser; // Userව සොයාගත නොහැකි නම් default user return කිරීම
    } catch (error) {
        console.error("Error fetching user data:", error);
        return defaultUser; // Error එකක් ඇති වුවහොත් default user return කිරීම
    }
};

// Comment සහ replies වලට author details එකතු කරන function එක
const enrichWithAuthors = async (items) => {
    return Promise.all(items.map(async (item) => {
        const author = await fetchUserData(item.userId);
        let repliesWithAuthors = [];
        if (item.replies && item.replies.length > 0) {
            repliesWithAuthors = await enrichWithAuthors(item.replies);
        }
        return { ...item, author, replies: repliesWithAuthors };
    }));
};

export const CommentProvider = ({ children }) => {
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Real-time listener එක සකස් කරන function එක
    const listenToComments = useCallback((bookId) => {
        if (!bookId) return () => {};
        
        setIsLoading(true);
        const commentRef = doc(db, "comments", bookId);
        
        const unsubscribe = onSnapshot(commentRef, async (docSnap) => {
            if (docSnap.exists()) {
                const threads = docSnap.data().threads || [];
                const commentsWithAuthors = await enrichWithAuthors(threads);
                commentsWithAuthors.sort((a, b) => b.timestamp.toDate() - a.timestamp.toDate());
                setComments(commentsWithAuthors);
            } else {
                setComments([]);
            }
            setIsLoading(false);
        }, (error) => {
            console.error("Error listening to comments:", error);
            setIsLoading(false);
        });

        return unsubscribe; // Cleanup function එක return කිරීම
    }, []);

    const clearComments = useCallback(() => {
        setComments([]);
        userCache.clear();
    }, []);

    // Optimistic update සඳහා function එක
    const addCommentOptimistically = useCallback((newComment) => {
        setComments(prevComments => [newComment, ...prevComments]);
    }, []);

    const value = {
        comments,
        isLoading,
        listenToComments,
        clearComments,
        addCommentOptimistically,
    };

    return (
        <CommentContext.Provider value={value}>
            {children}
        </CommentContext.Provider>
    );
};