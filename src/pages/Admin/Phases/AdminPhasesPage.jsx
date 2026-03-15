// src/pages/admin/AdminPhasesPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './AdminPhasesPage.module.css';

const AdminPhasesPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [phases, setPhases] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [expandedPhase, setExpandedPhase] = useState(null);
  
  // Modal states
  const [showPhaseModal, setShowPhaseModal] = useState(false);
  const [showWeekModal, setShowWeekModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  
  // Form states
  const [phaseForm, setPhaseForm] = useState({
    course_id: courseId,
    name: '',
    description: '',
    order_num: 1
  });
  
  const [weekForm, setWeekForm] = useState({
    phase_id: '',
    week_number: 1,
    title: '',
    video_url: '',
    notes_url: '',
    exercise: '',
    order_num: 1
  });
  
  const [videoForm, setVideoForm] = useState({
    week_id: '',
    title: '',
    youtube_url: '',
    duration_seconds: '',
    order_num: 1
  });

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails();
      fetchPhases();
    }
  }, [courseId]);

  // ========== FETCH COURSE DETAILS ==========
  const fetchCourseDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/courses/${courseId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setCourse(data);
    } catch (error) {
      console.error('Error fetching course:', error);
    }
  };

  // ========== PHASES ==========
  const fetchPhases = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/courses/${courseId}/phases`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setPhases(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching phases:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSinglePhase = async (phaseId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/phases/${phaseId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching phase:', error);
      return null;
    }
  };

  const handleCreatePhase = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/phases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(phaseForm)
      });

      if (response.ok) {
        alert('Phase created successfully!');
        setShowPhaseModal(false);
        setPhaseForm({
          course_id: courseId,
          name: '',
          description: '',
          order_num: phases.length + 1
        });
        fetchPhases();
      }
    } catch (error) {
      console.error('Error creating phase:', error);
    }
  };

  const handleUpdatePhase = async (phaseId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/phases/${phaseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(phaseForm)
      });

      if (response.ok) {
        alert('Phase updated successfully!');
        setShowPhaseModal(false);
        setSelectedPhase(null);
        fetchPhases();
      }
    } catch (error) {
      console.error('Error updating phase:', error);
    }
  };

  const handleDeletePhase = async (phaseId) => {
    if (!window.confirm('Are you sure you want to delete this phase? All weeks in this phase will be deleted.')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/phases/${phaseId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('Phase deleted successfully!');
        if (expandedPhase === phaseId) {
          setExpandedPhase(null);
          setWeeks([]);
        }
        fetchPhases();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete phase');
      }
    } catch (error) {
      console.error('Error deleting phase:', error);
    }
  };

  // ========== WEEKS ==========
  const fetchWeeks = async (phaseId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/phases/${phaseId}/weeks`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setWeeks(Array.isArray(data) ? data : []);
      setExpandedPhase(phaseId);
    } catch (error) {
      console.error('Error fetching weeks:', error);
    }
  };

  const fetchSingleWeek = async (weekId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/weeks/${weekId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching week:', error);
      return null;
    }
  };

  const handleCreateWeek = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/weeks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(weekForm)
      });

      if (response.ok) {
        alert('Week created successfully!');
        setShowWeekModal(false);
        setWeekForm({
          phase_id: weekForm.phase_id,
          week_number: weeks.length + 1,
          title: '',
          video_url: '',
          notes_url: '',
          exercise: '',
          order_num: weeks.length + 1
        });
        fetchWeeks(weekForm.phase_id);
      }
    } catch (error) {
      console.error('Error creating week:', error);
    }
  };

  const handleUpdateWeek = async (weekId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/weeks/${weekId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(weekForm)
      });

      if (response.ok) {
        alert('Week updated successfully!');
        setShowWeekModal(false);
        setSelectedWeek(null);
        fetchWeeks(weekForm.phase_id);
      }
    } catch (error) {
      console.error('Error updating week:', error);
    }
  };

  const handleDeleteWeek = async (weekId, phaseId) => {
    if (!window.confirm('Are you sure you want to delete this week?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/weeks/${weekId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('Week deleted successfully!');
        fetchWeeks(phaseId);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete week');
      }
    } catch (error) {
      console.error('Error deleting week:', error);
    }
  };

  // ========== VIDEOS ==========
  const fetchVideos = async (weekId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/weeks/${weekId}/videos`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setVideos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  const handleCreateVideo = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(videoForm)
      });

      if (response.ok) {
        alert('Video created successfully!');
        setShowVideoModal(false);
        setVideoForm({
          week_id: videoForm.week_id,
          title: '',
          youtube_url: '',
          duration_seconds: '',
          order_num: videos.length + 1
        });
        fetchVideos(videoForm.week_id);
      }
    } catch (error) {
      console.error('Error creating video:', error);
    }
  };

  const handleDeleteVideo = async (videoId, weekId) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/videos/${videoId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('Video deleted successfully!');
        fetchVideos(weekId);
      }
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  };

  const openVideoModal = (week) => {
    setSelectedWeek(week);
    setVideoForm({
      week_id: week.id,
      title: '',
      youtube_url: '',
      duration_seconds: '',
      order_num: 1
    });
    fetchVideos(week.id);
    setShowVideoModal(true);
  };

  if (loading) {
    return <div className={styles.loading}>Loading phases...</div>;
  }

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <button 
            onClick={() => navigate('/admin/courses')}
            className={styles.backBtn}
          >
            ← Back to Courses
          </button>
          <h1>{course?.name || 'Course'} - Phases & Weeks</h1>
        </div>
        <p className={styles.courseDescription}>{course?.description}</p>
        
        <button 
          onClick={() => {
            setPhaseForm({
              course_id: courseId,
              name: '',
              description: '',
              order_num: phases.length + 1
            });
            setSelectedPhase(null);
            setShowPhaseModal(true);
          }}
          className={styles.createBtn}
        >
          + New Phase
        </button>
      </header>

      {/* Phases List */}
      <div className={styles.phasesContainer}>
        {phases.length === 0 ? (
          <div className={styles.noData}>
            <p>No phases created yet. Click "New Phase" to get started.</p>
          </div>
        ) : (
          phases.map(phase => (
            <div key={phase.id} className={styles.phaseCard}>
              <div className={styles.phaseHeader}>
                <div 
                  className={styles.phaseTitle}
                  onClick={() => expandedPhase === phase.id ? setExpandedPhase(null) : fetchWeeks(phase.id)}
                >
                  <span className={styles.expandIcon}>
                    {expandedPhase === phase.id ? '▼' : '▶'}
                  </span>
                  <h3>
                    Phase {phase.order_num}: {phase.name}
                    <span className={styles.weekCount}>
                      ({phase.weeks_count || 0} weeks)
                    </span>
                  </h3>
                </div>
                <div className={styles.phaseActions}>
                  <button 
                    onClick={() => {
                      setWeekForm({
                        phase_id: phase.id,
                        week_number: (phase.weeks_count || 0) + 1,
                        title: '',
                        video_url: '',
                        notes_url: '',
                        exercise: '',
                        order_num: (phase.weeks_count || 0) + 1
                      });
                      setSelectedPhase(phase);
                      setShowWeekModal(true);
                    }}
                    className={styles.addWeekBtn}
                  >
                    + Add Week
                  </button>
                  <button 
                    onClick={() => {
                      setPhaseForm({
                        course_id: phase.course_id,
                        name: phase.name,
                        description: phase.description || '',
                        order_num: phase.order_num
                      });
                      setSelectedPhase(phase);
                      setShowPhaseModal(true);
                    }}
                    className={styles.editBtn}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeletePhase(phase.id)}
                    className={styles.deleteBtn}
                  >
                    Delete
                  </button>
                </div>
              </div>

              <p className={styles.phaseDescription}>{phase.description}</p>

              {/* Weeks for this phase */}
              {expandedPhase === phase.id && (
                <div className={styles.weeksContainer}>
                  <h4>Weeks</h4>
                  {weeks.length === 0 ? (
                    <p className={styles.noWeeks}>No weeks yet. Click "Add Week" to create one.</p>
                  ) : (
                    weeks.map(week => (
                      <div key={week.id} className={styles.weekCard}>
                        <div className={styles.weekHeader}>
                          <div 
                            className={styles.weekTitle}
                            onClick={() => {
                              if (selectedWeek?.id === week.id) {
                                setSelectedWeek(null);
                                setVideos([]);
                              } else {
                                setSelectedWeek(week);
                                fetchVideos(week.id);
                              }
                            }}
                          >
                            <span className={styles.expandIcon}>
                              {selectedWeek?.id === week.id ? '▼' : '▶'}
                            </span>
                            <h5>Week {week.week_number}: {week.title}</h5>
                          </div>
                          <div className={styles.weekActions}>
                            <button 
                              onClick={() => openVideoModal(week)}
                              className={styles.addVideoBtn}
                            >
                              + Add Video
                            </button>
                            <button 
                              onClick={() => {
                                setWeekForm({
                                  phase_id: week.phase_id,
                                  week_number: week.week_number,
                                  title: week.title,
                                  video_url: week.video_url,
                                  notes_url: week.notes_url || '',
                                  exercise: week.exercise || '',
                                  order_num: week.order_num
                                });
                                setSelectedWeek(week);
                                setShowWeekModal(true);
                              }}
                              className={styles.editBtn}
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteWeek(week.id, phase.id)}
                              className={styles.deleteBtn}
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        {/* Videos for this week */}
                        {selectedWeek?.id === week.id && (
                          <div className={styles.videosContainer}>
                            <h6>Videos</h6>
                            {videos.length === 0 ? (
                              <p className={styles.noVideos}>No videos yet. Click "Add Video" to create one.</p>
                            ) : (
                              videos.map(video => (
                                <div key={video.id} className={styles.videoItem}>
                                  <div className={styles.videoInfo}>
                                    <span className={styles.videoTitle}>{video.title}</span>
                                    <a 
                                      href={video.youtube_url} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className={styles.videoLink}
                                    >
                                      Watch Video
                                    </a>
                                    {video.duration_seconds && (
                                      <span className={styles.videoDuration}>
                                        {Math.floor(video.duration_seconds / 60)}:{(video.duration_seconds % 60).toString().padStart(2, '0')}
                                      </span>
                                    )}
                                  </div>
                                  <button 
                                    onClick={() => handleDeleteVideo(video.id, week.id)}
                                    className={styles.deleteVideoBtn}
                                  >
                                    ×
                                  </button>
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* ========== PHASE MODAL ========== */}
      {showPhaseModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>{selectedPhase ? 'Edit Phase' : 'Create New Phase'}</h2>
            <form onSubmit={selectedPhase ? (e) => {
              e.preventDefault();
              handleUpdatePhase(selectedPhase.id);
            } : handleCreatePhase}>
              <div className={styles.formGroup}>
                <label>Phase Name *</label>
                <input
                  type="text"
                  value={phaseForm.name}
                  onChange={(e) => setPhaseForm({...phaseForm, name: e.target.value})}
                  placeholder="e.g., HTML Fundamentals"
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea
                  value={phaseForm.description}
                  onChange={(e) => setPhaseForm({...phaseForm, description: e.target.value})}
                  placeholder="Describe what this phase covers..."
                  rows="3"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Order Number</label>
                <input
                  type="number"
                  value={phaseForm.order_num}
                  onChange={(e) => setPhaseForm({...phaseForm, order_num: parseInt(e.target.value)})}
                  min="1"
                  required
                />
              </div>
              
              <div className={styles.modalActions}>
                <button type="submit">
                  {selectedPhase ? 'Update Phase' : 'Create Phase'}
                </button>
                <button type="button" onClick={() => {
                  setShowPhaseModal(false);
                  setSelectedPhase(null);
                }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========== WEEK MODAL ========== */}
      {showWeekModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>{selectedWeek ? 'Edit Week' : 'Create New Week'}</h2>
            <form onSubmit={selectedWeek ? (e) => {
              e.preventDefault();
              handleUpdateWeek(selectedWeek.id);
            } : handleCreateWeek}>
              <div className={styles.formGroup}>
                <label>Week Number *</label>
                <input
                  type="number"
                  value={weekForm.week_number}
                  onChange={(e) => setWeekForm({...weekForm, week_number: parseInt(e.target.value)})}
                  min="1"
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Week Title *</label>
                <input
                  type="text"
                  value={weekForm.title}
                  onChange={(e) => setWeekForm({...weekForm, title: e.target.value})}
                  placeholder="e.g., Introduction to HTML"
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Video URL *</label>
                <input
                  type="url"
                  value={weekForm.video_url}
                  onChange={(e) => setWeekForm({...weekForm, video_url: e.target.value})}
                  placeholder="https://youtube.com/watch?v=..."
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Notes URL (Google Drive)</label>
                <input
                  type="url"
                  value={weekForm.notes_url}
                  onChange={(e) => setWeekForm({...weekForm, notes_url: e.target.value})}
                  placeholder="https://drive.google.com/..."
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Exercise Instructions</label>
                <textarea
                  value={weekForm.exercise}
                  onChange={(e) => setWeekForm({...weekForm, exercise: e.target.value})}
                  placeholder="Describe the exercise for this week..."
                  rows="3"
                />
              </div>
              
              <div className={styles.modalActions}>
                <button type="submit">
                  {selectedWeek ? 'Update Week' : 'Create Week'}
                </button>
                <button type="button" onClick={() => {
                  setShowWeekModal(false);
                  setSelectedWeek(null);
                }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========== VIDEO MODAL ========== */}
      {showVideoModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Add Video to Week {selectedWeek?.week_number}</h2>
            <form onSubmit={handleCreateVideo}>
              <div className={styles.formGroup}>
                <label>Video Title *</label>
                <input
                  type="text"
                  value={videoForm.title}
                  onChange={(e) => setVideoForm({...videoForm, title: e.target.value})}
                  placeholder="e.g., HTML Basics Part 1"
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>YouTube URL *</label>
                <input
                  type="url"
                  value={videoForm.youtube_url}
                  onChange={(e) => setVideoForm({...videoForm, youtube_url: e.target.value})}
                  placeholder="https://youtube.com/watch?v=..."
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Duration (seconds)</label>
                <input
                  type="number"
                  value={videoForm.duration_seconds}
                  onChange={(e) => setVideoForm({...videoForm, duration_seconds: e.target.value})}
                  placeholder="3600"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Order Number</label>
                <input
                  type="number"
                  value={videoForm.order_num}
                  onChange={(e) => setVideoForm({...videoForm, order_num: parseInt(e.target.value)})}
                  min="1"
                />
              </div>
              
              <div className={styles.modalActions}>
                <button type="submit">Add Video</button>
                <button type="button" onClick={() => {
                  setShowVideoModal(false);
                  setSelectedWeek(null);
                  setVideos([]);
                }}>
                  Cancel
                </button>
              </div>
            </form>

            {/* Show existing videos */}
            {videos.length > 0 && (
              <div className={styles.existingVideos}>
                <h3>Existing Videos in this Week</h3>
                <ul>
                  {videos.map(video => (
                    <li key={video.id}>
                      <span>{video.title}</span>
                      <button onClick={() => handleDeleteVideo(video.id, selectedWeek?.id)}>
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AdminPhasesPage;