import React, { useState } from 'react';
import { getFunctions, httpsCallable } from "firebase/functions";
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import './Form.css';
import { FcGoogle } from "react-icons/fc"; // Google Icon
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Eye Icons

function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('reader');
  const [termsAccepted, setTermsAccepted] = useState(true); // Default tick කරලා
  const [showPassword, setShowPassword] = useState(false); // Password පේනවද නැද්ද බලන්න
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
      const registerUser = httpsCallable(functions, 'registerUser');
      await registerUser({ email: email, password: password, role: role });
      
      // සාර්ථකව හැදුවම, login page එකට message එකක් එක්ක යවනවා
      navigate('/login', { state: { message: 'Account created successfully! Please log in.' } });
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => { /* ... කලින් වගේම ... */ };

  return (
    <div className="page-form-wrapper"> {/* <-- අලුත් div එක */}
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
    </div>
  );
}
export default SignupPage;