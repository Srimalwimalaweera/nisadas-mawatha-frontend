import React, { useContext, useState, useEffect, createContext, useRef } from 'react';
import { getAuth, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { getFunctions, httpsCallable } from "firebase/functions";
import { db } from '../firebase';
import RoleSelectionPopup from '../components/common/RoleSelectionPopup';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRoleSelectionRequired, setIsRoleSelectionRequired] = useState(false);
  const auth = getAuth();
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists() && docSnap.data().role) {
          setCurrentUser({ ...user, ...docSnap.data() });
          setIsRoleSelectionRequired(false);
        } else {
          // User exists in Auth, but not in Firestore or has no role
          setCurrentUser(user); // Set basic user object
          // This check prevents the popup for email signups who are waiting for their doc to be created
          if (user.providerData.some(p => p.providerId === 'google.com')) {
             setIsRoleSelectionRequired(true);
          }
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [auth]);

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };
  
  const submitUserRole = async (role) => {
    try {
      const functions = getFunctions();
      const setGoogleUserRole = httpsCallable(functions, 'setGoogleUserRole');
      await setGoogleUserRole({ role: role });

      // Manually refresh user data to get the new role
      const userDocRef = doc(db, 'users', currentUser.uid);
      const docSnap = await getDoc(userDocRef);
      if(docSnap.exists()){
        setCurrentUser(prev => ({ ...prev, ...docSnap.data() }));
      }
      setIsRoleSelectionRequired(false);
    } catch (error) {
      console.error("Error submitting role:", error);
      throw error;
    }
  };

  const value = {
    currentUser,
    loading,
    logout: () => signOut(auth),
    signInWithGoogle,
    login: (email, password) => signInWithEmailAndPassword(auth, email, password),
    updateUserProfile: (profileData) => updateProfile(auth.currentUser, profileData),
    resetPassword: (email) => sendPasswordResetEmail(auth, email),
    submitUserRole,
    promptRoleSelection: () => setIsRoleSelectionRequired(true),
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && isRoleSelectionRequired && <RoleSelectionPopup />}
      {children}
    </AuthContext.Provider>
  );
}