import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './ProfilePage.css';

function ProfilePage() {
  const { currentUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (currentUser) {
        // Auth context එකෙන් ලැබෙන userගේ UID එක පාවිච්චි කරලා,
        // 'users' collection එකේ අදාළ document එකට reference එකක් හදනවා.
        const userDocRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          setProfileData(docSnap.data());
        } else {
          console.log("No such profile document!");
        }
      }
      setLoading(false);
    };

    fetchProfileData();
  }, [currentUser]); // currentUser ඉන්නවද කියලා බලලා මේක දුවනවා

  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (!currentUser) {
    return <h1>Please log in to see your profile.</h1>;
  }

  return (
    <div className="profile-container">
      <h2>My Profile</h2>
      {profileData ? (
        <div className="profile-details">
          <p><strong>Name:</strong> {profileData.displayName}</p>
          <p><strong>Email:</strong> {profileData.email}</p>
          <p><strong>Role:</strong> {profileData.role}</p>
          <p><strong>Member Since:</strong> {new Date(profileData.createdAt.seconds * 1000).toLocaleDateString()}</p>
          {/* We will add an edit button later */}
        </div>
      ) : (
        <p>Could not load profile data.</p>
      )}
    </div>
  );
}

export default ProfilePage;