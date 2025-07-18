import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import './Form.css';

function SignupPage() {
  // ... (කලින් තිබුණු useState ටික මෙතන තියෙනවා)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signup, signInWithGoogle } = useAuth(); // <-- signInWithGoogle මෙතනට ගන්නවා
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    // ... (මේ function එක කලින් වගේමයි, වෙනසක් නෑ)
    e.preventDefault();
    if (password !== confirmPassword) { return setError('Passwords do not match'); }
    try {
      setError(''); setLoading(true);
      await signup(email, password);
      navigate('/');
    } catch (err) { setError('Failed to create an account. ' + err.message); }
    setLoading(false);
  };

  // Google Sign-in වලට අලුත් function එකක්
  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      await signInWithGoogle();
      navigate('/');
    } catch (err) {
      setError('Failed to sign in with Google. ' + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>Create an Account</h2>
        {error && <p className="error-message">{error}</p>}
        {/* ... (Email, Password, Confirm Password fields ටික කලින් වගේම) ... */}
        <div className="form-group">
          <label>Email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </div>
        <button disabled={loading} type="submit" className="form-button">
          {loading ? 'Creating...' : 'Sign Up'}
        </button>
      </form>

      {/* අලුතෙන් එකතු කරන කොටස */}
      <div className="form-divider">
        <span>OR</span>
      </div>
      <button disabled={loading} onClick={handleGoogleSignIn} className="google-signin-button">
        Sign Up with Google
      </button>
    </div>
  );
}

export default SignupPage;