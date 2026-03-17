import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './CourseBrowser.module.css';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const CourseBrowser = () => {
  const [view, setView] = useState('courses');
  const [courses, setCourses] = useState([]);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [currentPhase, setCurrentPhase] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(null);
  const [phases, setPhases] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const [videos, setVideos] = useState([]);
  const [expandedWeeks, setExpandedWeeks] = useState({});
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({});
  const [activeVideo, setActiveVideo] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Sample images for courses (you can replace with actual course images)
  const courseImages = {
    default: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400',
    javascript: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400',
    python: 'https://images.unsplash.com/photo-1526379095098-4000743e1b9b?w=400',
    database: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400',
    react: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=400',
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await API.get('/student/courses');
      setCourses(res.data);
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
    setLoading(false);
  };

  const fetchCoursePhases = async (courseId) => {
    setLoading(true);
    try {
      const res = await API.get(`/student/courses/${courseId}`);
      setCurrentCourse(res.data.course);
      setPhases(res.data.phases);
      setView('phases');
    } catch (err) {
      console.error('Error fetching phases:', err);
    }
    setLoading(false);
  };

  const fetchPhaseWeeks = async (phaseId, phase) => {
    setLoading(true);
    try {
      const res = await API.get(`/student/phases/${phaseId}`);
      setCurrentPhase(phase);
      setWeeks(res.data.weeks);
      setView('weeks');
    } catch (err) {
      console.error('Error fetching weeks:', err);
    }
    setLoading(false);
  };

  const fetchWeekVideos = async (weekId, week) => {
    setLoading(true);
    try {
      const res = await API.get(`/student/weeks/${weekId}`);
      setCurrentWeek(week);
      setVideos(res.data.videos);
      if (res.data.videos.length > 0) {
        setActiveVideo(res.data.videos[0]);
      }
      
      const progressMap = {};
      res.data.videos.forEach(video => {
        if (video.progress) {
          progressMap[video.id] = video.progress;
        }
      });
      setProgress(progressMap);
      
      setView('videos');
    } catch (err) {
      console.error('Error fetching videos:', err);
    }
    setLoading(false);
  };

  const trackProgress = async (videoId, seconds, duration) => {
    const percent = Math.min(100, Math.round((seconds / duration) * 100));
    const completed = percent >= 90;
    
    try {
      await API.post('/student/video/progress', {
        video_id: videoId,
        seconds_watched: seconds,
        percent_watched: percent,
        completed: completed,
        last_position: seconds
      });
      
      setProgress(prev => ({
        ...prev,
        [videoId]: {
          ...prev[videoId],
          seconds_watched: seconds,
          percent_watched: percent,
          completed: completed,
          last_position: seconds
        }
      }));
    } catch (err) {
      console.error('Error tracking progress:', err);
    }
  };

  const toggleWeek = (weekId) => {
    setExpandedWeeks(prev => ({
      ...prev,
      [weekId]: !prev[weekId]
    }));
  };

  const goBack = () => {
    if (view === 'videos') {
      setView('weeks');
      setActiveVideo(null);
    } else if (view === 'weeks') {
      setView('phases');
      setExpandedWeeks({});
    } else if (view === 'phases') {
      setView('courses');
      setCurrentCourse(null);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getCourseImage = (courseName) => {
    const name = courseName?.toLowerCase() || '';
    if (name.includes('javascript')) return courseImages.javascript;
    if (name.includes('python')) return courseImages.python;
    if (name.includes('database')) return courseImages.database;
    if (name.includes('react')) return courseImages.react;
    return courseImages.default;
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className={styles.container}>
      {/* Animated Background */}
      <div className={styles.background}>
        <div className={styles.gradient1}></div>
        <div className={styles.gradient2}></div>
      </div>

      {/* Header with Glass Effect */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          {view !== 'courses' && (
            <button className={styles.backButton} onClick={goBack}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back
            </button>
          )}
          
          <div className={styles.titleSection}>
            <h1 className={styles.title}>
              {view === 'courses' && '✨ Discover Your Path'}
              {view === 'phases' && currentCourse?.name}
              {view === 'weeks' && currentPhase?.name}
              {view === 'videos' && currentWeek?.title}
            </h1>
            <p className={styles.subtitle}>
              {view === 'courses' && 'Choose your learning journey'}
              {view === 'phases' && `${phases.length} phases • Start your journey`}
              {view === 'weeks' && `${weeks.length} weeks of content`}
              {view === 'videos' && `${videos.length} videos • ${videos.filter(v => progress[v.id]?.completed).length} completed`}
            </p>
          </div>

          {/* Search Bar - Only on Courses View */}
          {view === 'courses' && (
            <div className={styles.searchContainer}>
              <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>
          )}
        </div>
      </div>

      {/* Loading Animation */}
      {loading && (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading amazing content...</p>
        </div>
      )}

      {/* Main Content */}
      <div className={styles.content}>
        {/* COURSES VIEW - Beautiful Cards with Images */}
        {view === 'courses' && !loading && (
          <div className={styles.coursesGrid}>
            {filteredCourses.map((course, index) => (
              <div
                key={course.id}
                className={styles.courseCard}
                onClick={() => fetchCoursePhases(course.id)}
                onMouseEnter={() => setHoveredItem(course.id)}
                onMouseLeave={() => setHoveredItem(null)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={styles.courseImageContainer}>
                  <img 
                    src={getCourseImage(course.name)} 
                    alt={course.name}
                    className={styles.courseImage}
                  />
                  <div className={`${styles.courseOverlay} ${hoveredItem === course.id ? styles.visible : ''}`}>
                    <span className={styles.exploreBtn}>Explore Course →</span>
                  </div>
                </div>
                <div className={styles.courseInfo}>
                  <h3>{course.name}</h3>
                  <p>{course.description?.substring(0, 80)}...</p>
                  <div className={styles.courseMeta}>
                    <span className={styles.duration}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                        <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      {course.duration_weeks} weeks
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PHASES VIEW - Beautiful with Photos from Database */}
        {view === 'phases' && !loading && (
          <div className={styles.phasesContainer}>
            {phases.map((phase, index) => (
              <div
                key={phase.id}
                className={styles.phaseCard}
                onClick={() => fetchPhaseWeeks(phase.id, phase)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={styles.phaseImageContainer}>
                  <img 
                    src={phase.photo_url || `https://images.unsplash.com/photo-${
                      ['1517694712202-14dd9538aa97', '1526379095098-4000743e1b9b', '1544383835-bda2bc66a55d', '1633356122102-3fe601e05bd2'][index % 4]
                    }?w=400`} 
                    alt={phase.name}
                    className={styles.phaseImage}
                  />
                  <div className={styles.phaseBadge}>Phase {index + 1}</div>
                </div>
                <div className={styles.phaseInfo}>
                  <h3>{phase.name}</h3>
                  <p>{phase.description}</p>
                  <button className={styles.phaseBtn}>Start Phase →</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* WEEKS VIEW - Collapsible & Beautiful */}
        {view === 'weeks' && !loading && (
          <div className={styles.weeksContainer}>
            {weeks.map((week, index) => (
              <div key={week.id} className={styles.weekWrapper}>
                <div
                  className={`${styles.weekHeader} ${expandedWeeks[week.id] ? styles.expanded : ''}`}
                  onClick={() => toggleWeek(week.id)}
                >
                  <div className={styles.weekHeaderLeft}>
                    <span className={styles.weekNumber}>Week {week.week_number}</span>
                    <h4>{week.title}</h4>
                  </div>
                  <div className={styles.weekHeaderRight}>
                    {progress[week.id]?.completed && (
                      <span className={styles.completedBadge}>✓ Completed</span>
                    )}
                    <svg 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none"
                      className={`${styles.chevron} ${expandedWeeks[week.id] ? styles.rotated : ''}`}
                    >
                      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                </div>
                
                {expandedWeeks[week.id] && (
                  <div className={styles.weekContent}>
                    {week.exercise && (
                      <div className={styles.exerciseSection}>
                        <h5>📝 Exercise</h5>
                        <p>{week.exercise}</p>
                      </div>
                    )}
                    <button 
                      className={styles.watchButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        fetchWeekVideos(week.id, week);
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                        <path d="M10 8L16 12L10 16V8Z" fill="currentColor"/>
                      </svg>
                      Watch Videos ({week.video_count || 0})
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* VIDEOS VIEW - Premium Player Experience */}
        {view === 'videos' && !loading && activeVideo && (
          <div className={styles.videosContainer}>
            {/* Main Video Player */}
            <div className={styles.mainPlayer}>
              <div className={styles.videoWrapper}>
                <iframe
                  src={`https://www.youtube.com/embed/${getYoutubeId(activeVideo.youtube_url)}?autoplay=1`}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className={styles.videoInfo}>
                <h2>{activeVideo.title}</h2>
                <div className={styles.videoMeta}>
                  <span>{formatTime(activeVideo.duration_seconds)}</span>
                  {progress[activeVideo.id]?.completed && (
                    <span className={styles.completedTag}>✓ Completed</span>
                  )}
                </div>
              </div>
            </div>

            {/* Video Playlist */}
            <div className={styles.playlist}>
              <h3>📋 Course Content</h3>
              <div className={styles.playlistItems}>
                {videos.map(video => (
                  <div
                    key={video.id}
                    className={`${styles.playlistItem} ${activeVideo.id === video.id ? styles.active : ''}`}
                    onClick={() => setActiveVideo(video)}
                  >
                    <div className={styles.playlistItemLeft}>
                      <span className={styles.playlistNumber}>
                        {videos.indexOf(video) + 1}
                      </span>
                      <div className={styles.playlistInfo}>
                        <h4>{video.title}</h4>
                        <span className={styles.playlistDuration}>
                          {formatTime(video.duration_seconds)}
                        </span>
                      </div>
                    </div>
                    <div className={styles.playlistProgress}>
                      {progress[video.id]?.percent_watched > 0 && (
                        <div className={styles.progressCircle}>
                          <svg viewBox="0 0 36 36">
                            <path
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="#e0e0e0"
                              strokeWidth="3"
                            />
                            <path
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke={progress[video.id]?.completed ? '#4caf50' : '#2196f3'}
                              strokeWidth="3"
                              strokeDasharray={`${progress[video.id]?.percent_watched || 0}, 100`}
                            />
                          </svg>
                          <span>{progress[video.id]?.percent_watched || 0}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Progress Controls */}
              <div className={styles.quickControls}>
                <h4>Quick Actions</h4>
                <div className={styles.controlButtons}>
                  <button 
                    className={styles.controlBtn}
                    onClick={() => activeVideo && trackProgress(
                      activeVideo.id,
                      (progress[activeVideo.id]?.last_position || 0) + 30,
                      activeVideo.duration_seconds || 100
                    )}
                  >
                    ⏩ +30s
                  </button>
                  <button 
                    className={styles.controlBtn}
                    onClick={() => activeVideo && trackProgress(
                      activeVideo.id,
                      activeVideo.duration_seconds || 100,
                      activeVideo.duration_seconds || 100
                    )}
                  >
                    ✓ Mark Completed
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const getYoutubeId = (url) => {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : '';
};

export default CourseBrowser;