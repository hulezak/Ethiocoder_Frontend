// src/pages/admin/AdminLayout.jsx
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import styles from './AdminLayout.module.css';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);

  // Get current path to determine active tab
  const currentPath = location.pathname.split('/').pop() || 'dashboard';

  useEffect(() => {
    // Check if user is admin
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    setUser(parsedUser);
    fetchPendingCount();
  }, [navigate]);

  const fetchPendingCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://ethiocoder-backned.onrender.com/api/admin/students/pending', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setPendingCount(Array.isArray(data) ? data.length : 0);
    } catch (error) {
      console.error('Error fetching pending count:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { path: '/admin', label: '📊 Dashboard', key: 'dashboard' },
    { path: '/admin/approvals', label: '⏳ Pending Approvals', key: 'approvals', badge: pendingCount },
    { path: '/admin/students', label: '👥 Students', key: 'students' },
    { path: '/admin/courses', label: '📚 Courses', key: 'courses' },
    { path: '/admin/cohorts', label: '🎯 Cohorts', key: 'cohorts' }
  ];

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <div className={styles.logoMark}>EC</div>
          <span>Admin Panel</span>
        </div>

        <nav className={styles.nav}>
          {navItems.map(item => (
            <button
              key={item.key}
              onClick={() => navigate(item.path)}
              className={`${styles.navItem} ${currentPath === item.key ? styles.active : ''}`}
            >
              {item.label}
              {item.badge > 0 && (
                <span className={styles.badge}>{item.badge}</span>
              )}
            </button>
          ))}
        </nav>

        <div className={styles.adminInfo}>
          <div className={styles.adminAvatar}>
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className={styles.adminDetails}>
            <p className={styles.adminName}>{user?.name}</p>
            <p className={styles.adminRole}>Administrator</p>
          </div>
        </div>

        <button onClick={handleLogout} className={styles.logoutBtn}>
          🚪 Logout
        </button>
      </aside>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;