// src/pages/admin/AdminDashboardPage.jsx
import React, { useEffect, useState } from 'react';
import styles from './AdminDashboardPage.module.css';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    pendingApprovals: 0,
    activeCohorts: 0,
    totalCourses: 0,
    homeworkPending: 0,
    recentActivity: []
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    setUser(JSON.parse(userData));
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/dashboard/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading dashboard...</div>;
  }

  return (
    <>
      <header className={styles.header}>
        <h1>Admin Dashboard</h1>
        <p>Welcome back, {user?.name}</p>
      </header>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>👥</div>
          <div>
            <h3>Total Students</h3>
            <p className={styles.statNumber}>{stats.totalStudents || 0}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>⏳</div>
          <div>
            <h3>Pending Approvals</h3>
            <p className={styles.statNumber}>{stats.pendingApprovals || 0}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🎯</div>
          <div>
            <h3>Active Cohorts</h3>
            <p className={styles.statNumber}>{stats.activeCohorts || 0}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📚</div>
          <div>
            <h3>Total Courses</h3>
            <p className={styles.statNumber}>{stats.totalCourses || 0}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboardPage;