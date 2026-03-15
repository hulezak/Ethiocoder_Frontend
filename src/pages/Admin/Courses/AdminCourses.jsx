// src/pages/admin/AdminCoursesPage.jsx
import React, { useEffect, useState } from 'react';
import styles from './AdminCoursesPage.module.css';

import { useNavigate, Link } from 'react-router-dom';

const AdminCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [selectedCourseDetail, setSelectedCourseDetail] = useState(null);
  const navigate = useNavigate();
  // Form states
  const [courseForm, setCourseForm] = useState({
    name: '',
    slug: '',
    description: '',
    duration_weeks: 8,
    is_active: true
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/courses', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setCourses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseDetails = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/courses/${courseId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setSelectedCourseDetail(data);
      setShowCourseModal(true);
    } catch (error) {
      console.error('Error fetching course details:', error);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(courseForm)
      });

      if (response.ok) {
        alert('Course created successfully!');
        setCourseForm({
          name: '',
          slug: '',
          description: '',
          duration_weeks: 8,
          is_active: true
        });
        setShowCourseModal(false);
        fetchCourses();
      }
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  const handleUpdateCourse = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/courses/${courseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(courseForm)
      });

      if (response.ok) {
        alert('Course updated successfully!');
        setShowCourseModal(false);
        setSelectedCourseDetail(null);
        fetchCourses();
      }
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading courses...</div>;
  }

  return (
    <>
      <header className={styles.header}>
        <h1>Courses</h1>
        <button 
          onClick={() => {
            setCourseForm({
              name: '',
              slug: '',
              description: '',
              duration_weeks: 8,
              is_active: true
            });
            setSelectedCourseDetail(null);
            setShowCourseModal(true);
          }}
          className={styles.createBtn}
        >
          + New Course
        </button>
      </header>

      <div className={styles.courseGrid}>
        {courses.map(course => (
          <div key={course.id} className={styles.courseCard}>
            <h3>{course.name}</h3>
            <p className={styles.courseDescription}>{course.description}</p>
            <div className={styles.courseStats}>
              <span>📚 {course.phases_count || 0} phases</span>
              <span>🎯 {course.cohorts_count || 0} cohorts</span>
              <span>📅 {course.duration_weeks} weeks</span>
            </div>
            <div className={styles.courseActions}>
              <span className={`${styles.statusBadge} ${course.is_active ? styles.approved : ''}`}>
                {course.is_active ? 'Active' : 'Inactive'}
              </span>
              <button 
                onClick={() => fetchCourseDetails(course.id)}
                className={styles.viewBtn}
              >
                EDIT Course
              </button>
<br />
              <Link
  to={`/admin/courses/${course.id}/phases`}
  className={styles.viewPhaseslink}
>
  Manage Phases 
</Link>
            </div>
          </div>
        ))}
      </div>

      {/* Course Modal */}
      {showCourseModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>{selectedCourseDetail ? 'Edit Course' : 'Create Course'}</h2>
            <form onSubmit={selectedCourseDetail ? (e) => {
              e.preventDefault();
              handleUpdateCourse(selectedCourseDetail.id);
            } : handleCreateCourse}>
              <div className={styles.formGroup}>
                <label>Name:</label>
                <input
                  type="text"
                  value={courseForm.name}
                  onChange={(e) => setCourseForm({...courseForm, name: e.target.value})}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Slug:</label>
                <input
                  type="text"
                  value={courseForm.slug}
                  onChange={(e) => setCourseForm({...courseForm, slug: e.target.value})}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Description:</label>
                <textarea
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({...courseForm, description: e.target.value})}
                  rows="3"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Duration (weeks):</label>
                <input
                  type="number"
                  value={courseForm.duration_weeks}
                  onChange={(e) => setCourseForm({...courseForm, duration_weeks: parseInt(e.target.value)})}
                  min="1"
                  max="52"
                />
              </div>
              <div className={styles.formGroup}>
                <label>
                  <input
                    type="checkbox"
                    checked={courseForm.is_active}
                    onChange={(e) => setCourseForm({...courseForm, is_active: e.target.checked})}
                  />
                  Active
                </label>
              </div>
              <div className={styles.modalActions}>
                <button type="submit">
                  {selectedCourseDetail ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={() => {
                  setShowCourseModal(false);
                  setSelectedCourseDetail(null);
                }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminCoursesPage;