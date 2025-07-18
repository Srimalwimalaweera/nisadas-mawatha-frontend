import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import './Form.css'; // අපි Signup එකට හදපු CSS එකම පාවිච්චි කරනවා!

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, signInWithGoogle } = useAuth(); // AuthContext එකෙන් login function එක ගන්නවා
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/'); // සාර්ථක නම්, homepage එකට redirect කරනවා
    } catch (err) {
      setError('Failed to log in. Please check your email and password.');
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      await signInWithGoogle();
      navigate('/');
    } catch (err) {
      setError('Failed to sign in with Google.');
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label>Email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button disabled={loading} type="submit" className="form-button">
          {loading ? 'Logging In...' : 'Login'}
        </button>
      </form>
      <div className="form-divider"><span>OR</span></div>
      <button disabled={loading} onClick={handleGoogleSignIn} className="google-signin-button">
        Sign In with Google
      </button>
      <div className="form-link">
        Need an account? <Link to="/signup">Sign Up</Link>
      </div>
    </div>
  );
}

export default LoginPage;