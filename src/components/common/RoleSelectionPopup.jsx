import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './RoleSelectionPopup.css';

// Icons (You can use your own or install a library like react-icons)
const ReaderIcon = () => <span>📖</span>;
const WriterIcon = () => <span>✍️</span>;
const PhotographerIcon = () => <span>📷</span>;
const StudentIcon = () => <span>🎓</span>;

const roles = [
  { name: 'reader', label: 'Reader', icon: <ReaderIcon /> },
  { name: 'writer', label: 'Writer', icon: <WriterIcon /> },
  { name: 'photographer', label: 'Photographer', icon: <PhotographerIcon /> },
  { name: 'student', label: 'Student', icon: <StudentIcon /> },
];

function RoleSelectionPopup() {
  const [selectedRole, setSelectedRole] = useState(null);
  const { submitUserRole, currentUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selectedRole) {
      alert("Please select a role to continue.");
      return;
    }
    setLoading(true);
    try {
      await submitUserRole(selectedRole);
      // The context will handle closing the popup on success
    } catch (error) {
      alert(`An error occurred: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="role-popup-overlay">
      <div className="role-popup-content">
        <h2>Welcome, {currentUser.displayName}!</h2>
        <p>Please select your primary role on our platform to continue.</p>
        <div className="role-cards-container">
          {roles.map(role => (
            <div
              key={role.name}
              className={`role-card ${selectedRole === role.name ? 'selected' : ''}`}
              onClick={() => setSelectedRole(role.name)}
            >
              <div className="role-icon">{role.icon}</div>
              <div className="role-label">{role.label}</div>
            </div>
          ))}
        </div>
        <button 
          className="submit-role-btn" 
          onClick={handleSubmit}
          disabled={!selectedRole || loading}
        >
          {loading ? 'Saving...' : 'Submit and Continue'}
        </button>
      </div>
    </div>
  );
}

export default RoleSelectionPopup;