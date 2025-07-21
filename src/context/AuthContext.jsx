import React, { useContext, useState, useEffect, createContext } from 'react';
import { 
  getAuth, 
  onAuthStateChanged, 
  signOut, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore'; // <-- Firestore functions
import { db } from '../firebase'; // <-- අපේ db config

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  // User log වුණාම හෝ log out වුණාම මේක දුවනවා
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User කෙනෙක් ඉන්නවා නම්, එයාගේ UID එකෙන් Firestore එකේ profile එක හොයනවා
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          // Auth data ටිකයි, Firestore data (role එක වගේ) ටිකයි එකතු කරලා user object එක හදනවා
          setCurrentUser({ ...user, ...docSnap.data() });
        } else {
          // Firestore එකේ profile එකක් නැත්නම්, Auth data විතරක් තියනවා
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [auth]);

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }
  
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  }
  
  function logout() {
    return signOut(auth);
  }
  
  function updateUserProfile(profileData) {
    return updateProfile(auth.currentUser, profileData);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  const value = {
    currentUser,
    logout,
    signup,
    signInWithGoogle,
    login,
    updateUserProfile,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}