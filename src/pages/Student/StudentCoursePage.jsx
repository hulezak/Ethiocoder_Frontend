// src/pages/student/StudentCoursePage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BookOpen, ChevronRight, ChevronDown, Play, 
  FileText, Download, Clock, Users, Layers,
  Calendar, Video, Award, ExternalLink, Maximize2,
  CheckCircle, Circle, X, Menu, Grid, List,
  CheckSquare
} from 'lucide-react';
import './StudentCoursePage.css';
import Navbar from '../../components/nav/Navbar';
import Footer from '../../components/footer/Footer';




// API Base URL - change this to your server URL
const API_BASE_URL = 'https://ethiocoder-backned.onrender.com';

const StudentCoursePage = () => {
  // ========== STATE MANAGEMENT ==========
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [expandedWeeks, setExpandedWeeks] = useState({});
  const [weeksData, setWeeksData] = useState({}); // Store fetched week details by weekId
  const [loading, setLoading] = useState({ courses: false, course: false, phase: false, week: false });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [courseProgress, setCourseProgress] = useState(null);

  // ========== PLACEHOLDERS (when backend doesn't provide images) ==========
  const placeholders = {
    course: "https://via.placeholder.com/600x400?text=Course",
    phase: "https://via.placeholder.com/400x200?text=Phase",
    week: "https://via.placeholder.com/80x60?text=Week",
    video: "https://via.placeholder.com/160x90?text=Video"
  };

  // ========== API CALLS USING YOUR BACKEND ==========
  useEffect(() => { 
    fetchEnrolledCourses(); 
  }, []);

  // 1. GET /api/student/my-courses - Show courses student is enrolled in
  const fetchEnrolledCourses = async () => {
    setLoading(prev => ({ ...prev, courses: true }));
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/student/my-courses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const coursesWithProgress = await Promise.all(
        response.data.map(async (course) => {
          try {
            const progressRes = await axios.get(`${API_BASE_URL}/api/student/courses/${course.id}/progress`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            return { 
              ...course, 
              progress: progressRes.data.percent_complete || 0,
              thumbnail: placeholders.course
            };
          } catch (error) {
            return { ...course, progress: 0, thumbnail: placeholders.course };
          }
        })
      );
      
      setEnrolledCourses(coursesWithProgress);
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
    } finally {
      setLoading(prev => ({ ...prev, courses: false }));
    }
  };

  // 2. GET /api/student/courses/:id - Show course with its phases
  const fetchCourseDetails = async (courseId) => {
    setLoading(prev => ({ ...prev, course: true }));
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/student/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const progressRes = await axios.get(`${API_BASE_URL}/api/student/courses/${courseId}/progress`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourseProgress(progressRes.data);
      
      setSelectedCourse(response.data);
      setSelectedPhase(null);
      setSelectedWeek(null);
      setExpandedWeeks({});
      setWeeksData({});
    } catch (error) {
      console.error('Error fetching course details:', error);
    } finally {
      setLoading(prev => ({ ...prev, course: false }));
    }
  };

  // 3. GET /api/student/phases/:id - Show phase with weeks
  const fetchPhaseDetails = async (phaseId) => {
    setLoading(prev => ({ ...prev, phase: true }));
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/student/phases/${phaseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const weeksWithMeta = response.data.weeks.map(week => ({
        ...week,
        video_count: 0,
        completed: false,
        thumbnail: placeholders.week
      }));
      
      setSelectedPhase({
        phase: response.data.phase,
        weeks: weeksWithMeta
      });
      setSelectedWeek(null);
      setExpandedWeeks({});
      setWeeksData({});
    } catch (error) {
      console.error('Error fetching phase details:', error);
    } finally {
      setLoading(prev => ({ ...prev, phase: false }));
    }
  };

  // 4. GET /api/student/weeks/:id - Get week with its videos
  const fetchWeekDetails = async (weekId) => {
    setLoading(prev => ({ ...prev, week: true }));
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/student/weeks/${weekId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Store fetched data
      setWeeksData(prev => ({ ...prev, [weekId]: response.data }));
    } catch (error) {
      console.error('Error fetching week details:', error);
    } finally {
      setLoading(prev => ({ ...prev, week: false }));
    }
  };

  // 5. POST /api/student/video/progress - Track video progress
  const updateVideoProgress = async (videoId, progressData) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/student/video/progress`, 
        { video_id: videoId, ...progressData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('Error updating video progress:', error);
    }
  };

  // ========== HANDLER FUNCTIONS ==========
  const handleCourseClick = (courseId) => {
    fetchCourseDetails(courseId);
    setMobileMenuOpen(false);
  };

  const handlePhaseClick = (phaseId) => {
    fetchPhaseDetails(phaseId);
  };

  const handleWeekClick = async (weekId) => {
    // Toggle expanded state
    setExpandedWeeks(prev => ({
      ...prev,
      [weekId]: !prev[weekId]
    }));

    // If expanding and data not yet fetched, fetch it
    if (!expandedWeeks[weekId] && !weeksData[weekId]) {
      await fetchWeekDetails(weekId);
    }
  };

  const handlePlayVideo = (video) => {
    setPlayingVideo(video);
    updateVideoProgress(video.id, {
      seconds_watched: video.progress?.last_position || 0,
      percent_watched: video.progress?.percent_watched || 0,
      completed: video.progress?.completed || false,
      last_position: video.progress?.last_position || 0
    });
  };

  const closeVideoPlayer = () => {
    setPlayingVideo(null);
  };

  const goBack = () => {
    if (selectedWeek) {
      setSelectedWeek(null);
    } else if (selectedPhase) {
      setSelectedPhase(null);
    } else if (selectedCourse) {
      setSelectedCourse(null);
      setCourseProgress(null);
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // ========== RENDER MODULES ==========

  // Module 1: Loading Spinner
  const LoadingSpinner = () => (
    <div className="loading-spinner-container">
      <div className="loading-spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <BookOpen className="loading-icon" />
      </div>
      <p className="loading-text">Loading your content...</p>
    </div>
  );

  // Module 2: Header
  const Header = () => (
    <header className="learning-header">
      <div className="header-container">
        <div className="header-left">
        
          <h1 className="header-title">
            {selectedCourse ? selectedCourse.course.name : 'My Learning Hub'}
          </h1>
          {selectedCourse && (
            <button onClick={goBack} className="back-btn">
              ← Back to Courses
            </button>
          )}
        </div>
        <div className="header-right">
          {courseProgress && (
            <div className="progress-badge-header">
              <span>{courseProgress.percent_complete}% Complete</span>
            </div>
          )}
      
        </div>
      </div>
    </header>
  );

  // Module 3: Mobile Navigation
  const MobileNav = () => (
    <div className={`mobile-nav ${mobileMenuOpen ? 'open' : ''}`}>
      <div className="mobile-nav-header">
        <h3>My Courses</h3>
      
      </div>
      <div className="mobile-nav-items">
        {enrolledCourses.map(course => (
          <button
            key={course.id}
            className={`mobile-nav-item ${selectedCourse?.course.id === course.id ? 'active' : ''}`}
            onClick={() => handleCourseClick(course.id)}
          >
            <BookOpen size={18} />
            <span>{course.name}</span>
            <div className="mobile-progress">
              <div className="progress-bar" style={{ width: `${course.progress}%` }}></div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  // Module 4: Course Grid (Horizontal Card)
  const CourseGrid = () => {
    if (!enrolledCourses || enrolledCourses.length === 0) {
      return (
        <div className="courses-section">
          <h2 className="section-title">My Course</h2>
          <div className="empty-state">
            <BookOpen size={48} />
            <p>No enrolled courses yet</p>
          </div>
        </div>
      );
    }

    return (
      <div className="courses-section">
        <h2 className="section-title">My Course</h2>
        {enrolledCourses.map(course => (
          <div
            key={course.id}
            className="course-card-horizontal"
            onClick={() => handleCourseClick(course.id)}
          >
            <div className="course-image-container">
              <img src={course.photo_url || placeholders.course} alt={course.name} />
              <div className="image-overlay"></div>
              <span className="cohort-badge">{course.cohort_name}</span>
            </div>
            <div className="course-content">
              <h3 className="course-name">{course.name}</h3>
              <p className="course-description">{course.description}</p>
              
              <div className="course-meta">
                <span className="meta-item">
                  <Clock size={18} />
                  Enrolled: {new Date(course.enrolled_at).toLocaleDateString()}
                </span>
              </div>
              
              <div className="course-progress">
                <div className="progress-header">
                  <span className="progress-label">Overall Progress</span>
                  <span className="progress-value">{course.progress}%</span>
                </div>
                <div className="progress-bar-container">
                  <div className="progress-bar-fill" style={{ width: `${course.progress}%` }}></div>
                </div>
              </div>
              
              <button className="continue-btn">
                Continue Learning <ChevronRight size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Module 5: Phase List
  const PhaseList = () => (
    <div className="phases-section">
      <div className="phases-header">
        <h2 className="section-title">Course Curriculum</h2>
        <p className="course-description">{selectedCourse.course.description}</p>
        {courseProgress && (
          <div className="course-stats">
            <span>{courseProgress.videos_completed} of {courseProgress.total_videos} videos completed</span>
          </div>
        )}
      </div>
      <div className={`phases-grid ${viewMode}`}>
        {selectedCourse.phases.map((phase, index) => (
          <div
            key={phase.id}
            className={`phase-card ${selectedPhase?.phase.id === phase.id ? 'selected' : ''}`}
            onClick={() => handlePhaseClick(phase.id)}
          >
            <div className="phase-image">
              <img src={phase.photo_url || placeholders.phase} alt={phase.name} />
              <div className="phase-overlay">
                <span className="phase-number">Phase {index + 1}</span>
              </div>
            </div>
            <div className="phase-content">
              <h3 className="phase-name">{phase.name}</h3>
              <p className="phase-description">{phase.description}</p>
              <button className="view-phase-btn">
                View Phase <ChevronRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Module 6: Week List (with multiple expandable weeks)
  const WeekList = () => (
    <div className="weeks-section">
      <div className="weeks-header">
        <button className="back-to-phases" onClick={() => setSelectedPhase(null)}>
          ← Back to Phases
        </button>
        <h2 className="section-title">{selectedPhase.phase.name}</h2>
        <p className="phase-description">{selectedPhase.phase.description}</p>
      </div>
      <div className="weeks-container">
        {selectedPhase.weeks.map(week => (
          <div key={week.id} className="week-item">
            {/* Week Header */}
            <div 
              className={`week-header ${expandedWeeks[week.id] ? 'expanded' : ''}`}
              onClick={() => handleWeekClick(week.id)}
            >
              <div className="week-info">
                <div className="week-icon">
                  {week.completed ? (
                    <CheckCircle className="completed-icon" size={20} />
                  ) : (
                    <Circle className="pending-icon" size={20} />
                  )}
                </div>
                <div>
                  <span className="week-number">Week {week.week_number}</span>
                  <h4 className="week-title">{week.title}</h4>
                </div>
              </div>
              <div className="week-meta">
                <ChevronDown 
                  className={`expand-icon ${expandedWeeks[week.id] ? 'rotated' : ''}`} 
                  size={20}
                />
              </div>
            </div>

            {/* Expanded Week Details */}
            {expandedWeeks[week.id] && weeksData[week.id] && (
              <div className="week-details">
                {/* Videos Section */}
                <div className="details-section">
                  <h5 className="section-subtitle">
                    <Video size={18} /> Videos
                  </h5>
                  <div className="videos-list-compact">
                    {weeksData[week.id].videos.map(video => (
                      <div key={video.id} className="video-item-compact">
                        <button 
                          className="video-play-icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlayVideo(video);
                          }}
                        >
                          <Play size={16} />
                        </button>
                        <div className="video-info-compact">
                          <span className="video-title-compact">{video.title}</span>
                          <span className="video-duration-compact">
                            {formatDuration(video.duration_seconds)}
                          </span>
                        </div>
                        {video.progress?.completed && (
                          <CheckCircle size={16} className="completed-check" />
                        )}
                        {video.progress?.percent_watched > 0 && !video.progress.completed && (
                          <span className="progress-percent">{video.progress.percent_watched}%</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Short Notes Section */}
                {weeksData[week.id].week.notes_url && (
                  <div className="details-section">
                    <h5 className="section-subtitle">
                      <FileText size={18} /> Short Notes
                    </h5>
                    <div className="notes-link">
                      <a 
                        href={weeksData[week.id].week.notes_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="resource-link-compact"
                      >
                        <FileText size={16} />
                        Week {week.week_number} Notes
                        <Download size={14} className="download-icon" />
                      </a>
                    </div>
                  </div>
                )}

                {/* Exercise Section */}
                {weeksData[week.id].week.exercise && (
                  <div className="details-section">
                    <h5 className="section-subtitle">
                      <Award size={18} /> Exercise
                    </h5>
                    <div className="exercise-compact">
                      <p className="exercise-text-compact">{weeksData[week.id].week.exercise}</p>
                      <button className="exercise-btn-compact">
                        Start Exercise <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Checklist Link */}
                <div className="details-section">
                  <h5 className="section-subtitle">
                    <CheckSquare size={18} /> Checklist
                  </h5>
                  <button 
                    className="checklist-link"
                    onClick={() => {
                      // Navigate to checklist page – you need to implement routing
                      console.log(`Navigate to checklist for week ${week.id}`);
                      // e.g., navigate(`/checklist/${week.id}`);
                    }}
                  >
                    View Week {week.week_number} Checklist <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
// Helper function to convert YouTube URL to embed URL
const getYouTubeEmbedUrl = (url, startSeconds = 0) => {
  if (!url) return '';
  
  // Extract video ID from various YouTube URL formats
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?]+)/,
    /youtube\.com\/embed\/([^?]+)/,
    /youtube\.com\/v\/([^?]+)/
  ];
  
  let videoId = null;
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      videoId = match[1];
      break;
    }
  }
  
  if (!videoId) {
    console.warn('Could not extract video ID from URL:', url);
    return url; // fallback to original if not recognized
  }
  
  // Build clean embed URL - strip out all playlist parameters
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&start=${startSeconds}`;
};
// Module 7: Video Player Modal
const VideoPlayerModal = () => {
  const [currentTime, setCurrentTime] = useState(playingVideo.progress?.last_position || 0);
  
  return (
    <div className="video-modal" onClick={closeVideoPlayer}>
      <div className="video-modal-content" onClick={e => e.stopPropagation()}>
        <div className="video-modal-header">
          <h3>{playingVideo.title}</h3>
          <button className="close-btn" onClick={closeVideoPlayer}>
            <X size={24} />
          </button>
        </div>
        <div className="video-container">
          <iframe
            src={getYouTubeEmbedUrl(playingVideo.youtube_url, currentTime)}
            title={playingVideo.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};
  // ========== MAIN RENDER ==========
  if (loading.courses) return <LoadingSpinner />;

  return (
    <div className="learning-hub">
      <Navbar />
      <Header />
      <MobileNav />
      <main className="main-content">
        {!selectedCourse && <CourseGrid />}
        
        {selectedCourse && !selectedPhase && <PhaseList />}
        
        {selectedPhase && !selectedWeek && <WeekList />}
        
        {/* Note: selectedWeek is no longer used; we now manage expansion via expandedWeeks */}
      </main>

      {playingVideo && <VideoPlayerModal />}
      <Footer/>
    </div>
  );
};

export default StudentCoursePage;

