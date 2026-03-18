// src/pages/admin/AdminCohortsPage.jsx
import React, { useEffect, useState } from 'react';
import styles from './AdminCohortsPage.module.css';

const AdminCohortsPage = () => {
  const [cohorts, setCohorts] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCohortModal, setShowCohortModal] = useState(false);
  const [selectedCohortDetail, setSelectedCohortDetail] = useState(null);

  // Form states
  const [cohortForm, setCohortForm] = useState({
    name: '',
    course_id: '',
    start_date: '',
    end_date: '',
    is_active: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const [cohortsRes, coursesRes] = await Promise.all([
        fetch('https://ethiocoder-backned.onrender.com/api/admin/cohorts', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('https://ethiocoder-backned.onrender.com/api/admin/courses', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const cohortsData = await cohortsRes.json();
      const coursesData = await coursesRes.json();

      setCohorts(Array.isArray(cohortsData) ? cohortsData : []);
      setCourses(Array.isArray(coursesData) ? coursesData : []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCohortDetails = async (cohortId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://ethiocoder-backned.onrender.com/api/admin/cohorts/${cohortId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setSelectedCohortDetail(data);
      setShowCohortModal(true);
    } catch (error) {
      console.error('Error fetching cohort details:', error);
    }
  };

  const handleCreateCohort = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://ethiocoder-backned.onrender.com/api/admin/cohorts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(cohortForm)
      });

      if (response.ok) {
        alert('Cohort created successfully!');
        setCohortForm({
          name: '',
          course_id: '',
          start_date: '',
          end_date: '',
          is_active: true
        });
        setShowCohortModal(false);
        fetchData();
      }
    } catch (error) {
      console.error('Error creating cohort:', error);
    }
  };

  const handleUpdateCohort = async (cohortId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://ethiocoder-backned.onrender.com/api/admin/cohorts/${cohortId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(cohortForm)
      });

      if (response.ok) {
        alert('Cohort updated successfully!');
        setShowCohortModal(false);
        setSelectedCohortDetail(null);
        fetchData();
      }
    } catch (error) {
      console.error('Error updating cohort:', error);
    }
  };

  const handleDeleteCohort = async (cohortId) => {
    if (!window.confirm('Are you sure you want to delete this cohort?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://ethiocoder-backned.onrender.com/api/admin/cohorts/${cohortId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('Cohort deleted successfully!');
        fetchData();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete cohort');
      }
    } catch (error) {
      console.error('Error deleting cohort:', error);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading cohorts...</div>;
  }

  return (
    <>
      <header className={styles.header}>
        <h1>Cohorts</h1>
        <button 
          onClick={() => {
            setCohortForm({
              name: '',
              course_id: courses[0]?.id || '',
              start_date: '',
              end_date: '',
              is_active: true
            });
            setSelectedCohortDetail(null);
            setShowCohortModal(true);
          }}
          className={styles.createBtn}
        >
          + New Cohort
        </button>
      </header>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Course</th>
              <th>Students</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cohorts.map(cohort => (
              <tr key={cohort.id}>
                <td>
                  <button 
                    className={styles.linkBtn}
                    onClick={() => fetchCohortDetails(cohort.id)}
                  >
                    {cohort.name}
                  </button>
                </td>
                <td>{cohort.course_name}</td>
                <td>{cohort.student_count || 0}</td>
                <td>{new Date(cohort.start_date).toLocaleDateString()}</td>
                <td>{cohort.end_date ? new Date(cohort.end_date).toLocaleDateString() : 'Ongoing'}</td>
                <td>
                  <span className={`${styles.statusBadge} ${cohort.is_active ? styles.approved : ''}`}>
                    {cohort.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className={styles.actions}>
                  <button 
                    onClick={() => {
                      setCohortForm({
                        name: cohort.name,
                        course_id: cohort.course_id,
                        start_date: cohort.start_date?.split('T')[0] || '',
                        end_date: cohort.end_date?.split('T')[0] || '',
                        is_active: cohort.is_active
                      });
                      setSelectedCohortDetail(cohort);
                      setShowCohortModal(true);
                    }}
                    className={styles.editBtn}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteCohort(cohort.id)}
                    className={styles.deleteBtn}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cohort Modal */}
      {showCohortModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>{selectedCohortDetail ? 'Edit Cohort' : 'Create Cohort'}</h2>
            <form onSubmit={selectedCohortDetail ? (e) => {
              e.preventDefault();
              handleUpdateCohort(selectedCohortDetail.id);
            } : handleCreateCohort}>
              <div className={styles.formGroup}>
                <label>Name:</label>
                <input
                  type="text"
                  value={cohortForm.name}
                  onChange={(e) => setCohortForm({...cohortForm, name: e.target.value})}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Course:</label>
                <select
                  value={cohortForm.course_id}
                  onChange={(e) => setCohortForm({...cohortForm, course_id: e.target.value})}
                  required
                >
                  <option value="">Select Course</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Start Date:</label>
                <input
                  type="date"
                  value={cohortForm.start_date}
                  onChange={(e) => setCohortForm({...cohortForm, start_date: e.target.value})}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>End Date (optional):</label>
                <input
                  type="date"
                  value={cohortForm.end_date}
                  onChange={(e) => setCohortForm({...cohortForm, end_date: e.target.value})}
                />
              </div>
              <div className={styles.formGroup}>
                <label>
                  <input
                    type="checkbox"
                    checked={cohortForm.is_active}
                    onChange={(e) => setCohortForm({...cohortForm, is_active: e.target.checked})}
                  />
                  Active
                </label>
              </div>
              <div className={styles.modalActions}>
                <button type="submit">
                  {selectedCohortDetail ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={() => {
                  setShowCohortModal(false);
                  setSelectedCohortDetail(null);
                }}>
                  Cancel
                </button>
              </div>
            </form>

            {/* Show students in cohort if viewing details */}
            {selectedCohortDetail && selectedCohortDetail.students && (
              <div className={styles.cohortStudents}>
                <h3>Students in this Cohort ({selectedCohortDetail.students.length})</h3>
                <ul>
                  {selectedCohortDetail.students.map(student => (
                    <li key={student.id}>
                      {student.name} - {student.email}
                      <span className={`${styles.statusBadge} ${styles[student.status]}`}>
                        {student.status}
                      </span>
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

export default AdminCohortsPage;