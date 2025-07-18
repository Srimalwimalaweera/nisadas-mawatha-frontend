import React, { useContext, useState, useEffect, createContext } from 'react';
import { 
  getAuth, 
  onAuthStateChanged, 
  signOut, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword // <-- අලුතෙන් import කරනවා
} from 'firebase/auth';

const AuthContext = createContext();
// ... (useAuth function එක කලින් වගේමයි)
export function useAuth() { return useContext(AuthContext); }

export function AuthProvider({ children }) {
  // ... (useState and auth ටික කලින් වගේමයි)
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }
  
  // Login function එක
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

  // ... (useEffect එක කලින් වගේමයි)
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
    login // <-- අලුත් function එක export කරනවා
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}