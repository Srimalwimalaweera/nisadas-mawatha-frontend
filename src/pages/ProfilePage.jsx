import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './ProfilePage.css';

function ProfilePage() {
  const { currentUser, updateUserProfile } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Edit කරන දත්ත තාවකාලිකව තියාගන්න state
  const [editData, setEditData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  // Firestore එකෙන් profile දත්ත මුලින්ම ගේන function එක
  useEffect(() => {
    const fetchProfileData = async () => {
      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          setProfileData(docSnap.data());
        }
      }
      setLoading(false);
    };
    fetchProfileData();
  }, [currentUser]);

  // Edit කරන්න පටන් ගන්නකොට
  const handleEdit = (field) => {
    setEditData({ ...editData, [field]: profileData[field] });
    setIsEditing(true);
  };

  // Input field එකක type කරනකොට
  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };
  
  // Cancel කරනකොට
  const handleCancel = () => {
    setEditData({});
    setIsEditing(false);
  };

  // Save කරනකොට
  const handleSave = async () => {
    if (!currentUser) return;
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, editData); // Firestore එක update කරනවා

      // Auth එකේ displayName එක update කරනවා (වෙනස් කරලා තියෙනවා නම්)
      if (editData.displayName) {
        await updateUserProfile({ displayName: editData.displayName });
      }

      setProfileData({ ...profileData, ...editData }); // Local state එක update කරනවා
      handleCancel(); // Editing mode එකෙන් අයින් වෙනවා
    } catch (error) {
      console.error("Error updating profile: ", error);
      // Тут можна показати повідомлення про помилку користувачу
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (!currentUser || !profileData) return <h1>Please log in to see your profile.</h1>;



  return (
    <div className="profile-container">
      {/* Save/Cancel Bar එක එහෙමමයි */}
      {isEditing && (
        <div className="save-bar">
          <span>You have unsaved changes</span>
          <div>
            <button onClick={handleCancel} className="cancel-btn">Cancel</button>
            <button onClick={handleSave} className="save-btn">Save</button>
          </div>
        </div>
      )}

      <h2>My Profile</h2>
      <div className="profile-details">
        {/* Display Name - අලුත් විදිහ */}
        <div className="profile-field">
          <strong>Name:</strong>
          {isEditing && editData.hasOwnProperty('displayName') ? (
            <input type="text" name="displayName" value={editData.displayName} onChange={handleChange} />
          ) : (
            <span>{profileData.displayName} <i className='bx bxs-edit-alt pencil-icon' onClick={() => handleEdit('displayName')}></i></span>
          )}
        </div>

        {/* Email - අලුත් විදිහ */}
        <p className="email-field"><strong>Email:</strong> {profileData.email}</p>

        {/* Membership - අලුත් විදිහ */}
        <p><strong>Membership:</strong> {profileData.role}</p>
        
        {/* Phone Number - අලුත් විදිහ */}
        <div className="profile-field">
          <strong>Phone:</strong>
          {isEditing && editData.hasOwnProperty('phone') ? (
            <input type="tel" name="phone" value={editData.phone || ''} onChange={handleChange} placeholder="e.g., 0771234567" />
          ) : (
            <span>{profileData.phone || 'Not set'} <i className='bx bxs-edit-alt pencil-icon' onClick={() => handleEdit('phone')}></i></span>
          )}
        </div>
        
        <button className="form-button">Change Password</button>
      </div>
    </div>
  );
}

export default ProfilePage;