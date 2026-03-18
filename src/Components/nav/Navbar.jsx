// src/components/Navbar.jsx (keep your existing JSX, it's fine)
import React, { useState, useEffect } from 'react';
import styles from './Navbar.module.css';
import Logo from '../../assets/icon.png';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        setIsLoggedIn(true);
        setUser(JSON.parse(userData));
      }
    };
    
    checkAuth();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    window.location.href = '/';
  };

  const getUserInitials = () => {
    if (!user || !user.name) return 'U';
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    switch(user.role) {
      case 'admin': return '/admin';
      case 'ta': return '/ta';
      default: return '/student';
    }
  };

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.navbarContainer}>
        {/* Logo */}
        <a href="/" className={styles.logo}>
          <img src={Logo} alt="EthioCoders Academy Logo" className={styles.logoImage} />
          <div className={styles.logoText}>
            EthioCoders<span className={styles.logoTextAcademy}>Academy</span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <div className={`${styles.navLinks} ${styles.desktopNav}`}>
          <a href="#why-learn" className={styles.navLink}>Why Learn</a>
          <a href="#program" className={styles.navLink}>Program</a>
          <a href="#team" className={styles.navLink}>Teaching Team</a>
          <a href="#contact" className={styles.navLink}>Connect</a>
          
          {isLoggedIn ? (
            <>
              <a href={getDashboardLink()} className={styles.navLink}>Dashboard</a>
              <div className={styles.userMenu}>
                <div className={styles.userAvatar} title={user?.name}>
                  {getUserInitials()}
                </div>
                <button onClick={handleLogout} className={styles.logoutBtn}>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <a href="/login" className={styles.navLink}>Login</a>
              <a href="/register" className={styles.registerBtn}>Register</a>
            </>
          )}
          
          <a 
            href="https://forms.gle/ADzMxmg8mFbehgqv8" 
            className={styles.applyBtn}
            target="_blank" 
            rel="noopener noreferrer"
          >
            Apply Now
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className={styles.mobileMenuBtn}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Mobile Navigation */}
        <div className={`${styles.mobileNav} ${mobileMenuOpen ? styles.open : ''}`}>
          <a href="#why-learn" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>Why Learn</a>
          <a href="#program" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>Program</a>
          <a href="#team" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>Teaching Team</a>
          <a href="#contact" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>Connect</a>
          
          {isLoggedIn ? (
            <>
              <a href={getDashboardLink()} className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>
                Dashboard
              </a>
              <div className={styles.mobileUserInfo}>
                <div className={styles.mobileUserAvatar}>{getUserInitials()}</div>
                <span className={styles.mobileUserName}>{user?.name}</span>
              </div>
              <button onClick={handleLogout} className={styles.mobileLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <a href="/login" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>Login</a>
              <a href="/register" className={styles.mobileRegister} onClick={() => setMobileMenuOpen(false)}>Register</a>
            </>
          )}
          
          <a 
            href="https://forms.gle/ADzMxmg8mFbehgqv8" 
            className={styles.mobileApply}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileMenuOpen(false)}
          >
            Apply Now
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;