import React, { useState } from 'react';
import { getFunctions, httpsCallable } from "firebase/functions";
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import './Form.css';
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function SignupPage({ onNavigateToLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('reader');
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return setError('Passwords do not match');
    if (!termsAccepted) return setError('You must accept the Terms & Conditions.');

    try {
      setError('');
      setLoading(true);
      const functions = getFunctions();
      // 'registerUser' cloud function එකට role එකත් යැවීම
      const registerUser = httpsCallable(functions, 'registerUser');
      await registerUser({ email: email, password: password, role: role });
      
      navigate('/login', { state: { message: 'Account created successfully! Please log in.' } });
    } catch (err) {
      setError(err.message || 'Failed to create an account.');
    }
    setLoading(false);
  };

  // --- 1. Google Sign-In Function එක සම්පූර්ණ කිරීම ---
  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      await signInWithGoogle();
      navigate('/'); // සාර්ථක නම්, homepage එකට redirect කරනවා
    } catch (err) {
      setError('Failed to sign in with Google. Please try again.');
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="page-form-wrapper">
      <form onSubmit={handleSubmit}>
        <h2>Create an Account</h2>
        {error && <p className="error-message">{error}</p>}

        <div className="form-group">
          <label>Email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Account For</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="reader">Reader</option>
            <option value="writer">Writer</option>
            <option value="photographer">Photographer</option>
            <option value="student">Student</option>
          </select>
        </div>
        <p className="form-info-text">Create your account as a Reader, Writer, Photographer, or Student.</p>

        <div className="form-group">
          <label>Password (at least 6 characters)</label>
          <div className="password-wrapper">
            <input 
              type={showPassword ? "text" : "password"} 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
            <button type="button" className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </div>

        <div className="form-group-checkbox">
          <input type="checkbox" id="terms" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} />
          <label htmlFor="terms">I agree to the <Link to="/terms" target="_blank">Terms & Conditions</Link></label>
        </div>

        <button disabled={loading} type="submit" className="form-button">
          {loading ? 'Creating...' : 'Sign Up with Email'}
        </button>
      </form>
      
      <div className="form-divider"><span>OR</span></div>
      <button disabled={loading} onClick={handleGoogleSignIn} className="google-signin-button">
        <FcGoogle size={22} />
        <span>Sign Up with Google</span>
      </button>
      <div className="form-link">
        Already registered? 
        <button type="button" onClick={onNavigateToLogin} className="link-button"> Login now.</button>
      </div>
    </div>
  );
}
export default SignupPage;