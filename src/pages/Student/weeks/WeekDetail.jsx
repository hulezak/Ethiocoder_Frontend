import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './WeekDetail.module.css';

const WeekDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [week, setWeek] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    fetchWeekDetails();
  }, [id]);

  const fetchWeekDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/student/weeks/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setWeek(data.week);
      setVideos(data.videos);
      if (data.videos.length > 0) {
        setActiveVideo(data.videos[0]);
      }
    } catch (error) {
      console.error('Error fetching week:', error);
    } finally {
      setLoading(false);
    }
  };

  const trackProgress = async (videoId, seconds, duration) => {
    const percent = Math.min(100, Math.round((seconds / duration) * 100));
    const completed = percent >= 90;

    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:5000/api/student/video/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          video_id: videoId,
          seconds_watched: seconds,
          percent_watched: percent,
          completed: completed,
          last_position: seconds
        })
      });

      // Update local state
      setVideos(prev => prev.map(v => 
        v.id === videoId 
          ? { ...v, progress: { ...v.progress, percent_watched: percent, completed } }
          : v
      ));
    } catch (error) {
      console.error('Error tracking progress:', error);
    }
  };

  const getYoutubeId = (url) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  };

  if (loading) return <div className={styles.loading}>Loading week...</div>;

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        ← Back to Course
      </button>

      <h1 className={styles.weekTitle}>Week {week?.week_number}: {week?.title}</h1>

      {activeVideo && (
        <div className={styles.videoPlayer}>
          <iframe
            src={`https://www.youtube.com/embed/${getYoutubeId(activeVideo.youtube_url)}`}
            title={activeVideo.title}
            allowFullScreen
          />
        </div>
      )}

      <div className={styles.videosList}>
        <h2>Lesson Videos</h2>
        {videos.map(video => (
          <div 
            key={video.id} 
            className={`${styles.videoCard} ${activeVideo?.id === video.id ? styles.active : ''}`}
            onClick={() => setActiveVideo(video)}
          >
            <div className={styles.videoInfo}>
              <h3>{video.title}</h3>
              <p>{Math.floor(video.duration_seconds / 60)}:{String(video.duration_seconds % 60).padStart(2, '0')}</p>
            </div>
            <div className={styles.progressSection}>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill} 
                  style={{ width: `${video.progress?.percent_watched || 0}%` }}
                />
              </div>
              <span>{video.progress?.percent_watched || 0}%</span>
              {!video.progress?.completed && (
                <button 
                  className={styles.markBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    trackProgress(video.id, video.duration_seconds || 100, video.duration_seconds || 100);
                  }}
                >
                  ✓
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {week?.notes_url && (
        <div className={styles.resources}>
          <h2>Resources</h2>
          <a href={week.notes_url} target="_blank" rel="noopener noreferrer" className={styles.resourceLink}>
            📄 Class Notes
          </a>
        </div>
      )}

      {week?.exercise && (
        <div className={styles.exercise}>
          <h2>Exercise</h2>
          <p>{week.exercise}</p>
        </div>
      )}
    </div>
  );
};

export default WeekDetail;