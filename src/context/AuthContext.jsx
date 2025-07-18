import React, { useContext, useState, useEffect, createContext } from 'react';
import { 
  getAuth, 
  onAuthStateChanged, 
  signOut, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  updateProfile // <-- අලුතෙන් import කරනවා
} from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

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
  
  // User profile එකේ නම වගේ දේවල් Auth system එකේ update කරන function එක
  function updateUserProfile(profileData) { // <-- අලුත් function එක
    return updateProfile(auth.currentUser, profileData);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, [auth]);

  const value = {
    currentUser,
    logout,
    signup,
    signInWithGoogle,
    login,
    updateUserProfile // <-- අලුත් function එක export කරනවා
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}