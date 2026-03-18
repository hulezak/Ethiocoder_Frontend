import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import styles from './StudentLayout.module.css';
import Navbar from '../../../Components/Nav/Navbar'
import Footer from '../../../Components/Footer/Footer'

const StudentLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const menuItems = [
    { path: '/student/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/student/my-courses', icon: '📚', label: 'My Courses' },
    { path: '/student/courses', icon: '🔍', label: 'Browse Courses' },
    { path: '/student/profile', icon: '👤', label: 'Profile' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className={styles.container}>
{/* <Navbar/> */}

      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <h2>EthioCoders</h2>
          <p>Learning Platform</p>
        </div>

        <nav className={styles.nav}>
          {menuItems.map(item => (
            <button
              key={item.path}
              className={`${styles.navItem} ${location.pathname === item.path ? styles.active : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navLabel}>{item.label}</span>
            </button>
          ))}
        </nav>

        {user && (
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              {user.name?.charAt(0) || 'U'}
            </div>
            <div className={styles.userDetails}>
              <p className={styles.userName}>{user.name}</p>
              <p className={styles.userEmail}>{user.email}</p>
            </div>
            <button onClick={handleLogout} className={styles.logoutBtn} title="Logout">
              ⏻
            </button>
          </div>
        )}
      </aside>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};

export default StudentLayout;