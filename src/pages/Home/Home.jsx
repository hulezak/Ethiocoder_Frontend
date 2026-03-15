// src/pages/HomePage.jsx
import React, { useEffect } from 'react';
import Navbar from './../../Components/nav/Navbar';
import Footer from './../../components/Footer/Footer';
import styles from './HomePage.module.css';

const Home = () => {
  useEffect(() => {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }, []);

  return (
    <div className={styles.homepage}>
      <Navbar />

      {/* Hero Section - Cinematic Experience */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.bgVideoTexture}></div>
          <div className={styles.floatingShapes}>
            <div className={`${styles.shape} ${styles.shape1}`}></div>
            <div className={`${styles.shape} ${styles.shape2}`}></div>
            <div className={`${styles.shape} ${styles.shape3}`}></div>
          </div>
          <div className={styles.gridPattern}></div>
        </div>
        
        <div className={styles.heroContent}>
          <div className={styles.heroLeft}>
            <div className={styles.heroTag}>
              <span>⚡ Ethiopia's Premier Coding Academy</span>
              <div className={styles.heroTagGlow}></div>
            </div>
            <h1>
              Learn to Code.
              <span className={styles.heroGradientText}>Build Without Limits.</span>
            </h1>
            <p className={styles.heroDescription}>
              Eight weeks. Zero cost. No laptop required. Join Ethiopia's most ambitious young developers — from absolute beginner to deploying your first live website.
            </p>
            <div className={styles.heroStats}>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>8</span>
                <span className={styles.statLabel}>Weeks</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>4</span>
                <span className={styles.statLabel}>Technologies</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>∞</span>
                <span className={styles.statLabel}>Possibilities</span>
              </div>
            </div>
            <div className={styles.heroButtons}>
              <a href="https://forms.gle/ADzMxmg8mFbehgqv8" className={styles.btnPrimary}>Secure Your Spot</a>
              <a href="#curriculum" className={styles.btnSecondary}>Explore Curriculum</a>
            </div>
          </div>
          <div className={styles.heroRight}>
            <div className={styles.premiumCard}>
              <div className={styles.cardHeader}>
                <h3>First Build</h3>
                <div className={styles.liveBadge}>
                  <span className={styles.liveDot}></span>
                  <span>Live Preview</span>
                </div>
              </div>
              <div className={styles.codeWindow}>
                <div className={styles.codeHeader}>
                  <div className={`${styles.codeDot} ${styles.red}`}></div>
                  <div className={`${styles.codeDot} ${styles.yellow}`}></div>
                  <div className={`${styles.codeDot} ${styles.green}`}></div>
                </div>
                <div className={styles.codeContent}>
                  <span className={styles.codeTag}>&lt;!DOCTYPE html&gt;</span><br />
                  <span className={styles.codeTag}>&lt;html&gt;</span><br />
                  <span className={styles.codeTag}>&lt;head&gt;</span><br />
                  &nbsp;&nbsp;<span className={styles.codeTag}>&lt;title&gt;</span><span className={styles.codeText}>EthioCoders</span><span className={styles.codeTag}>&lt;/title&gt;</span><br />
                  <span className={styles.codeTag}>&lt;/head&gt;</span><br />
                  <span className={styles.codeTag}>&lt;body&gt;</span><br />
                  &nbsp;&nbsp;<span className={styles.codeTag}>&lt;h1&gt;</span><span className={styles.codeText}>Made in Ethiopia</span><span className={styles.codeTag}>&lt;/h1&gt;</span><br />
                  &nbsp;&nbsp;<span className={styles.codeTag}>&lt;p&gt;</span><span className={styles.codeText}>From my phone. 100% free.</span><span className={styles.codeTag}>&lt;/p&gt;</span><br />
                  <span className={styles.codeTag}>&lt;/body&gt;</span><br />
                  <span className={styles.codeTag}>&lt;/html&gt;</span>
                </div>
              </div>
              <div className={styles.studentProfiles}>
                <div className={styles.avatarGroup}>
                  <div className={styles.avatar}>S1</div>
                  <div className={styles.avatar}>S2</div>
                  <div className={styles.avatar}>S3</div>
                  <div className={styles.avatar}>+</div>
                </div>
                <div className={styles.profileText}>
                  <span className={styles.profileCount}>80+ students</span>
                  <span className={styles.profileLabel}>already building</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <div className={styles.trustBar}>
        <div className={styles.trustContainer}>
          <div className={styles.trustItem}>
            <div className={styles.trustIcon}>⚡</div>
            <div className={styles.trustText}>
              <strong>100% Free</strong>
              <span>Zero cost forever</span>
            </div>
          </div>
          <div className={styles.trustItem}>
            <div className={styles.trustIcon}>📱</div>
            <div className={styles.trustText}>
              <strong>Mobile-First</strong>
              <span>No laptop needed</span>
            </div>
          </div>
          <div className={styles.trustItem}>
            <div className={styles.trustIcon}>🎓</div>
            <div className={styles.trustText}>
              <strong>Certificate</strong>
              <span>Industry recognized</span>
            </div>
          </div>
          <div className={styles.trustItem}>
            <div className={styles.trustIcon}>🤝</div>
            <div className={styles.trustText}>
              <strong>Community</strong>
              <span>Lifetime access</span>
            </div>
          </div>
        </div>
      </div>

      {/* Why Learn Section */}
      <section className={styles.whyLearn} id="why-learn">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTag}>
            <span>🌟 Why Join EthioCoders</span>
          </div>
          <h2>Your Future as a Developer<br />Starts Here</h2>
          <p>We built this for students who have nothing but ambition. Here's what you gain.</p>
        </div>
        <div className={styles.benefitsGrid}>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>🚀</div>
            <h3>Real-World Skills</h3>
            <p>Not just theory. You'll build actual websites you can show employers — HTML, CSS, Bootstrap, JavaScript — all on your phone.</p>
          </div>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>💼</div>
            <h3>Job-Ready Portfolio</h3>
            <p>Graduate with a live portfolio site. Start freelancing, apply for internships, or build for local businesses immediately.</p>
          </div>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>🌍</div>
            <h3>Global Opportunities</h3>
            <p>Join a network of Ethiopian developers working remotely for companies worldwide. Your location is no longer a limit.</p>
          </div>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>👥</div>
            <h3>Peer Network</h3>
            <p>Connect with 80+ motivated students. Collaborate on projects, find co-founders, and grow together.</p>
          </div>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>⚡</div>
            <h3>Fast-Track Learning</h3>
            <p>8-week intensive structure. No dragging. No filler. Just what you need to start building.</p>
          </div>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>🎯</div>
            <h3>Mentor Guidance</h3>
            <p>Learn from teaching assistants who walked the same path. Get unstuck fast with 1:1 support.</p>
          </div>
        </div>
      </section>

      {/* Teaching Assistants Section */}
      <section className={styles.assistants} id="assistants">
        <div className={styles.assistantsGrid}>
          <div className={styles.assistantsLeft}>
            <div className={styles.assistantsTag}>
              <span>👥 Meet Your Guides</span>
            </div>
            <h2>Learn from Coders<br />Who Walked the Path</h2>
            <p>Our teaching assistants are recent graduates who started exactly where you are. They know the struggle because they lived it.</p>
            <div className={styles.assistantList}>
              <div className={styles.assistantItem}>
                <div className={styles.assistantCheck}>✓</div>
                <span>1-on-1 support when you're stuck</span>
              </div>
              <div className={styles.assistantItem}>
                <div className={styles.assistantCheck}>✓</div>
                <span>Code reviews on all your projects</span>
              </div>
              <div className={styles.assistantItem}>
                <div className={styles.assistantCheck}>✓</div>
                <span>Weekly live Q&A sessions</span>
              </div>
              <div className={styles.assistantItem}>
                <div className={styles.assistantCheck}>✓</div>
                <span>Portfolio feedback and career guidance</span>
              </div>
            </div>
            <a href="https://forms.gle/ADzMxmg8mFbehgqv8" className={styles.assistantBtn}>Apply Now — Free</a>
          </div>
          <div className={styles.assistantsRight}>
            <div className={styles.assistantCard}>
              <div className={styles.assistantAvatar}>S1</div>
              <h4>Abebe K.</h4>
              <div className={styles.assistantRole}>Lead TA</div>
              <div className={styles.assistantBadge}>Cohort 1</div>
            </div>
            <div className={styles.assistantCard}>
              <div className={styles.assistantAvatar}>H2</div>
              <h4>Hirut T.</h4>
              <div className={styles.assistantRole}>JavaScript TA</div>
              <div className={styles.assistantBadge}>Cohort 1</div>
            </div>
            <div className={styles.assistantCard}>
              <div className={styles.assistantAvatar}>M3</div>
              <h4>Meron G.</h4>
              <div className={styles.assistantRole}>CSS TA</div>
              <div className={styles.assistantBadge}>Cohort 2</div>
            </div>
            <div className={styles.assistantCard}>
              <div className={styles.assistantAvatar}>T4</div>
              <h4>Tigist F.</h4>
              <div className={styles.assistantRole}>HTML TA</div>
              <div className={styles.assistantBadge}>Cohort 2</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta} id="apply">
        <div className={styles.ctaBackground}></div>
        <div className={styles.ctaContent}>
          <h2>Your Future Starts Now</h2>
          <p>Eight weeks from curious to capable. 100% free, always.</p>
          <div className={styles.ctaButtons}>
            <a href="https://forms.gle/ADzMxmg8mFbehgqv8" className={styles.ctaButtonPrimary}>Apply for Next Cohort</a>
            <a href="#" className={styles.ctaButtonSecondary}>Sponsor a Student</a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;