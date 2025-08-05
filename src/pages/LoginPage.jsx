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
      // Firebase වලින් එන error codes බලලා, userට තේරෙන message එකක් දෙමු
      if (err.code === 'auth/invalid-credential') {
         setError('Failed to log in. Please check your email and password.');
      } else {
         setError('Failed to log in. Please try again later.');
      }
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
    <div className="page-form-wrapper login-layout"> {/* <-- ප්‍රධාන wrapper එකට අලුත් class එකක් දුන්නා */}
      <h2>Login to Your Account</h2>

      {/* ඉතුරු ඔක්කොම ටික මේ අලුත් div එක ඇතුළට දැම්මා */}
      <div className="form-content-bottom">
        <form onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-link" style={{textAlign: 'right', marginTop: '-0.5rem', marginBottom: '1rem'}}>
              <Link to="/forgot-password">Forgot Password?</Link>
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
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;