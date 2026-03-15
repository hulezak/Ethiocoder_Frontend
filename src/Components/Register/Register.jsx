// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Register.module.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'student'  // Default role
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          role: formData.role  // Send role to backend
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setSuccess('Registration successful! Please wait for admin approval.');
      
      // Clear form
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'student'
      });

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);

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
        
        <h1 className={styles.title}>Start Your Journey</h1>
        <p className={styles.subtitle}>Join Ethiopia's coding community</p>
        
        <div className={styles.features}>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>✓</span>
            <span>100% Free - Always</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>✓</span>
            <span>Learn on your phone</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>✓</span>
            <span>Get certified</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>✓</span>
            <span>Join 80+ students</span>
          </div>
        </div>
      </div>

      <div className={styles.rightPanel}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2>Create Account</h2>
          
          {error && <div className={styles.error}>{error}</div>}
          {success && <div className={styles.success}>{success}</div>}

          <div className={styles.field}>
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Abebe Kebede"
              required
              disabled={loading}
            />
          </div>

          <div className={styles.field}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              disabled={loading}
            />
          </div>

          <div className={styles.field}>
            <label>Phone (optional)</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+251 91 234 5678"
              disabled={loading}
            />
          </div>

          {/* Role Selection */}
          <div className={styles.field}>
            <label>I want to register as</label>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={formData.role === 'student'}
                  onChange={handleChange}
                  disabled={loading}
                />
                <span>Student</span>
              </label>
              
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="role"
                  value="ta"
                  checked={formData.role === 'ta'}
                  onChange={handleChange}
                  disabled={loading}
                />
                <span>Teaching Assistant (TA)</span>
              </label>
            </div>
            <small className={styles.roleHint}>
              {formData.role === 'ta' 
                ? 'TA accounts require admin approval and coding experience'
                : 'Students get access to all courses and community'}
            </small>
          </div>

          <div className={styles.field}>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              disabled={loading}
              minLength="6"
            />
          </div>

          <div className={styles.field}>
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className={styles.button}
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>

          <p className={styles.link}>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;