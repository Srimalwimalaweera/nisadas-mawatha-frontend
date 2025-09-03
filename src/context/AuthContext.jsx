import React, { useContext, useState, useEffect, createContext, useRef } from 'react';
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
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';


// --- 1. Preload කළ යුතු image URLs ලැයිස්තුව ---
const criticalImageUrls = [
  'https://firebasestorage.googleapis.com/v0/b/nisadas-mawatha.firebasestorage.app/o/webapp%2FNisadas%20Mawatha%20Logo.png?alt=media&token=bba44519-77de-48fb-a048-941625ac3e93', // Logo
  'https://firebasestorage.googleapis.com/v0/b/nisadas-mawatha.firebasestorage.app/o/webapp%2Fbg.png?alt=media&token=59d695bf-5ccb-445c-bd0d-beab5de956a5', // AuthBook Background
  'https://firebasestorage.googleapis.com/v0/b/nisadas-mawatha.firebasestorage.app/o/webapp%2FCover%20img.png?alt=media&token=22f6dc23-e636-4293-9677-54f154a13323'  // AuthBook Cover
];

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  // --- 2. Image loading තත්ත්වය සහ Auth check තත්ත්වය මතක තබාගැනීමට Refs ---
  const authStatusChecked = useRef(false);
  const imagesPreloaded = useRef(false);

  // --- 3. Auth check සහ Image load යන දෙකම අවසන් දැයි පරීක්ෂා කිරීම ---
  const checkLoadingStatus = () => {
    if (authStatusChecked.current && imagesPreloaded.current) {
      setLoading(false);
    }
  };

  // User log වුණාම හෝ log out වුණාම මේක දුවනවා
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          setCurrentUser({ ...user, ...docSnap.data() });
        } else {
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
      }
      // --- 4. Auth check එක අවසන් වූ බව සටහන් කරගැනීම ---
      authStatusChecked.current = true;
      checkLoadingStatus(); // Check if everything is done
    });
    return unsubscribe;
  }, [auth]);

  // --- 5. App එක පූරණය වෙද්දී අත්‍යවශ්‍ය images ටික preload කිරීම ---
  useEffect(() => {
    const preloadImages = (urls) => {
      const promises = urls.map(url => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = url;
          img.onload = resolve;
          img.onerror = resolve; // Error වුණත් loading screen එක නවතින්නේ නැතිව ඉන්න resolve කරනවා
        });
      });
      return Promise.all(promises);
    };

    preloadImages(criticalImageUrls).finally(() => {
      imagesPreloaded.current = true;
      checkLoadingStatus(); // Check if everything is done
    });
  }, []);


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
    loading,
    logout,
    signup,
    signInWithGoogle,
    login,
    updateUserProfile,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}