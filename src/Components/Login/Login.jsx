// src/pages/Login.jsx - COMPLETE WORKING VERSION
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Login.module.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // ✅ EXACT match with your backend
      const response = await fetch('https://ethiocoder-backned.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // ✅ Shows exact error from backend
        throw new Error(data.error || 'Login failed');
      }

      // ✅ Save auth data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // ✅ Redirect based on role
      if (data.user.role === 'admin') {
        navigate('/admin');
      } 
      
      else if (data.user.role === 'ta') {
        navigate('/ta');
      } 
      else {
        navigate('/student');
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <div className={styles.logo}>
          <div className={styles.logoMark}>EC</div>
          <span>EthioCoders</span>
        </div>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Continue your coding journey</p>
      </div>

      <div className={styles.rightPanel}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2>Sign In</h2>
          
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.field}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className={styles.field}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className={styles.link}>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;