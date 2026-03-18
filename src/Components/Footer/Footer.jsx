// src/components/Navbar.jsx
// src/components/Footer.jsx
import React from 'react';
import styles from './Footer.module.css';  // Import as styles object
import Logo from '../../assets/icon.png';
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer} id="contact">
      <div className={styles.footerContent}>
        {/* About Section */}
        <div className={styles.footerAbout}>
          <div className={styles.footerLogo}>
            <img src={Logo} alt="EthioCoders Academy Logo" className={styles.logoImage} />
            <div className={styles.footerLogoText}>EthioCoders Academy</div>
          </div>
          <p>
            Building Ethiopia's next generation of digital builders — one student at a time.
          </p>
          <div className={styles.socialLinks}>
            <a href="#" className={styles.socialLink} aria-label="Twitter">⌘</a>
            <a href="#" className={styles.socialLink} aria-label="Telegram">◉</a>
            <a href="#" className={styles.socialLink} aria-label="LinkedIn">◎</a>
            <a href="#" className={styles.socialLink} aria-label="GitHub">◈</a>
          </div>
        </div>

        {/* Program Column */}
        <div className={styles.footerColumn}>
          <h4>Program</h4>
          <ul className={styles.footerLinks}>
            <li><a href="#curriculum">Curriculum</a></li>
            <li><a href="#why-learn">Why Learn</a></li>
            <li><a href="https://forms.gle/ADzMxmg8mFbehgqv8" target="_blank" rel="noopener noreferrer">Apply</a></li>
            <li><a href="#faq">FAQ</a></li>
          </ul>
        </div>

        {/* Community Column */}
        <div className={styles.footerColumn}>
          <h4>Community</h4>
          <ul className={styles.footerLinks}>
            <li><a href="#teaching-team">Teaching Team</a></li>
            <li><a href="#alumni">Alumni</a></li>
            <li><a href="#mentors">Mentors</a></li>
            <li><a href="#events">Events</a></li>
          </ul>
        </div>

        {/* Connect Column */}
        <div className={styles.footerColumn}>
          <h4>Connect</h4>
          <ul className={styles.footerLinks}>
            <li><a href="mailto:hello@ethiocoders.org">hello@ethiocoders.org</a></li>
            <li><a href="#" target="_blank" rel="noopener noreferrer">Telegram</a></li>
            <li><span className={styles.footerAddress}>Addis Ababa</span></li>
            <li><a href="#press">Press</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.footerBottom}>
        <p>© {currentYear} EthioCoders Academy</p>
        <p>100% Free · 100% Ethiopian · 100% Possible</p>
      </div>
    </footer>
  );
};

export default Footer;