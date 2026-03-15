// src/pages/StudentDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './StudentDashboard.module.css';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    // if (parsedUser.role !== 'student') {
    //   navigate('/student');
    //   return;
    // }

    setUser(parsedUser);
    fetchStudentData();
    setLoading(false);
  }, [navigate]);

  const fetchStudentData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Mock data for now - replace with actual API calls
      setCourses([
        {
          id: 1,
          name: 'Web Development Fundamentals',
          progress: 45,
          phases: ['HTML', 'CSS', 'Bootstrap', 'JavaScript'],
          currentPhase: 'CSS'
        }
      ]);

      setRecentActivity([
        { id: 1, type: 'video', description: 'Watched: HTML Introduction', time: '2 hours ago' },
        { id: 2, type: 'homework', description: 'Submitted: Week 1 Homework', time: 'Yesterday' },
        { id: 3, type: 'achievement', description: 'Completed: HTML Basics', time: '3 days ago' }
      ]);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <div className={styles.logoMark}>EC</div>
          <span>EthioCoders</span>
        </div>

        <nav className={styles.nav}>
          <a href="#" className={`${styles.navItem} ${styles.active}`}>
            📊 Dashboard
          </a>
          <a href="#" className={styles.navItem}>
            📚 My Courses
          </a>
          <a href="#" className={styles.navItem}>
            📝 Homework
          </a>
          <a href="#" className={styles.navItem}>
            👥 Community
          </a>
          <a href="#" className={styles.navItem}>
            ⚙️ Settings
          </a>
        </nav>

        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>
            {user?.name?.charAt(0) || 'S'}
          </div>
          <div className={styles.userDetails}>
            <p className={styles.userName}>{user?.name}</p>
            <p className={styles.userRole}>Student</p>
          </div>
        </div>

        <button onClick={handleLogout} className={styles.logoutBtn}>
          🚪 Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Welcome Header */}
        <header className={styles.header}>
          <div>
            <h1>Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
            <p className={styles.headerSubtitle}>Continue your learning journey</p>
          </div>
          <div className={styles.streakBadge}>
            <span className={styles.streakIcon}>🔥</span>
            <span>7 day streak</span>
          </div>
        </header>

        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📚</div>
            <div>
              <h3>Courses</h3>
              <p className={styles.statNumber}>{courses.length}</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📝</div>
            <div>
              <h3>Homework</h3>
              <p className={styles.statNumber}>3 pending</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>⏳</div>
            <div>
              <h3>Progress</h3>
              <p className={styles.statNumber}>45%</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>🏆</div>
            <div>
              <h3>Points</h3>
              <p className={styles.statNumber}>1,250</p>
            </div>
          </div>
        </div>

        {/* Current Course */}
        <section className={styles.section}>
          <h2>Continue Learning</h2>
          {courses.map(course => (
            <div key={course.id} className={styles.courseCard}>
              <div className={styles.courseHeader}>
                <h3>{course.name}</h3>
                <span className={styles.courseProgress}>{course.progress}%</span>
              </div>
              
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill} 
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>

              <div className={styles.phasesGrid}>
                {course.phases.map((phase, index) => (
                  <div key={index} className={styles.phaseItem}>
                    <div className={`${styles.phaseDot} ${index === 1 ? styles.activePhase : ''}`}></div>
                    <span className={index === 1 ? styles.activePhaseText : ''}>{phase}</span>
                  </div>
                ))}
              </div>

              <div className={styles.currentPhase}>
                <p>Current: <strong>{course.currentPhase}</strong></p>
                <button className={styles.continueBtn}>Continue →</button>
              </div>
            </div>
          ))}
        </section>

        {/* Two Column Layout */}
        <div className={styles.twoColumn}>
          {/* Recent Activity */}
          <section className={styles.section}>
            <h2>Recent Activity</h2>
            <div className={styles.activityList}>
              {recentActivity.map(activity => (
                <div key={activity.id} className={styles.activityItem}>
                  <div className={styles.activityIcon}>
                    {activity.type === 'video' && '📺'}
                    {activity.type === 'homework' && '📝'}
                    {activity.type === 'achievement' && '🏆'}
                  </div>
                  <div className={styles.activityContent}>
                    <p>{activity.description}</p>
                    <span className={styles.activityTime}>{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Upcoming Deadlines */}
          <section className={styles.section}>
            <h2>Upcoming Deadlines</h2>
            <div className={styles.deadlineList}>
              <div className={styles.deadlineItem}>
                <div className={styles.deadlineDate}>
                  <span className={styles.deadlineDay}>15</span>
                  <span className={styles.deadlineMonth}>MAR</span>
                </div>
                <div className={styles.deadlineContent}>
                  <h4>CSS Layout Homework</h4>
                  <p>Week 4 Assignment</p>
                </div>
                <span className={styles.deadlineBadge}>2 days left</span>
              </div>

              <div className={styles.deadlineItem}>
                <div className={styles.deadlineDate}>
                  <span className={styles.deadlineDay}>18</span>
                  <span className={styles.deadlineMonth}>MAR</span>
                </div>
                <div className={styles.deadlineContent}>
                  <h4>JavaScript Quiz</h4>
                  <p>Week 5 Assessment</p>
                </div>
                <span className={styles.deadlineBadge}>5 days left</span>
              </div>

              <div className={styles.deadlineItem}>
                <div className={styles.deadlineDate}>
                  <span className={styles.deadlineDay}>22</span>
                  <span className={styles.deadlineMonth}>MAR</span>
                </div>
                <div className={styles.deadlineContent}>
                  <h4>Final Project Proposal</h4>
                  <p>Week 6 Submission</p>
                </div>
                <span className={styles.deadlineBadge}>9 days left</span>
              </div>
            </div>
          </section>
        </div>

        {/* Quick Actions */}
        <section className={styles.section}>
          <h2>Quick Actions</h2>
          <div className={styles.quickActions}>
            <button className={styles.quickActionBtn}>
              <span>📺</span>
              Watch Next Video
            </button>
            <button className={styles.quickActionBtn}>
              <span>📝</span>
              Submit Homework
            </button>
            <button className={styles.quickActionBtn}>
              <span>💬</span>
              Join Discussion
            </button>
            <button className={styles.quickActionBtn}>
              <span>👥</span>
              Find Study Partner
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default StudentDashboard;