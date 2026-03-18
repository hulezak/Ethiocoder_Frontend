// src/pages/admin/AdminApprovalsPage.jsx
import React, { useEffect, useState } from 'react';
import styles from './AdminApprovalsPage.module.css';

const AdminApprovalsPage = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [cohorts, setCohorts] = useState([]);
  const [selectedApprovalCourse, setSelectedApprovalCourse] = useState({});
  const [selectedApprovalCohort, setSelectedApprovalCohort] = useState({});
  const [loading, setLoading] = useState(true);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const [pendingRes, coursesRes, cohortsRes] = await Promise.all([
        fetch('https://ethiocoder-backned.onrender.com/api/admin/students/pending', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('https://ethiocoder-backned.onrender.com/api/admin/courses', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('https://ethiocoder-backned.onrender.com/api/admin/cohorts', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const pendingData = await pendingRes.json();
      const coursesData = await coursesRes.json();
      const cohortsData = await cohortsRes.json();

      setPendingUsers(Array.isArray(pendingData) ? pendingData : []);
      setCourses(Array.isArray(coursesData) ? coursesData : []);
      setCohorts(Array.isArray(cohortsData) ? cohortsData : []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentDetails = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://ethiocoder-backned.onrender.com/api/admin/students/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setSelectedUser(data);
      setShowUserModal(true);
    } catch (error) {
      console.error('Error fetching student details:', error);
    }
  };

  const handleApprove = async (userId) => {
    const courseId = selectedApprovalCourse[userId];
    const cohortId = selectedApprovalCohort[userId];

    if (!courseId || !cohortId) {
      alert('Please select both course and cohort');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://ethiocoder-backned.onrender.com/api/admin/students/${userId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          course_id: parseInt(courseId), 
          cohort_id: parseInt(cohortId) 
        })
      });

      if (response.ok) {
        alert('Student approved successfully!');
        fetchData();
        setSelectedApprovalCourse({});
        setSelectedApprovalCohort({});
      }
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  const handleReject = async (userId) => {
    if (!window.confirm('Are you sure you want to reject this student?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://ethiocoder-backned.onrender.com/api/admin/students/${userId}/reject`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('Student rejected successfully!');
        fetchData();
      }
    } catch (error) {
      console.error('Error rejecting user:', error);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading pending approvals...</div>;
  }

  return (
    <>
      <header className={styles.header}>
        <h1>Pending Approvals</h1>
        <p>{pendingUsers.length} users waiting for approval</p>
      </header>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Registered</th>
              <th>Course</th>
              <th>Cohort</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingUsers.map(user => (
              <tr key={user.id}>
                <td>
                  <button 
                    className={styles.linkBtn}
                    onClick={() => fetchStudentDetails(user.id)}
                  >
                    {user.name}
                  </button>
                </td>
                <td>{user.email}</td>
                <td>{user.phone || '-'}</td>
                <td>{new Date(user.created_at).toLocaleDateString()}</td>
                <td>
                  <select 
                    className={styles.select}
                    value={selectedApprovalCourse[user.id] || ''}
                    onChange={(e) => setSelectedApprovalCourse({
                      ...selectedApprovalCourse,
                      [user.id]: e.target.value
                    })}
                  >
                    <option value="">Select Course</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select 
                    className={styles.select}
                    value={selectedApprovalCohort[user.id] || ''}
                    onChange={(e) => setSelectedApprovalCohort({
                      ...selectedApprovalCohort,
                      [user.id]: e.target.value
                    })}
                  >
                    <option value="">Select Cohort</option>
                    {cohorts
                      .filter(c => c.course_id == selectedApprovalCourse[user.id])
                      .map(cohort => (
                        <option key={cohort.id} value={cohort.id}>
                          {cohort.name}
                        </option>
                      ))}
                  </select>
                </td>
                <td className={styles.actions}>
                  <button 
                    onClick={() => handleApprove(user.id)}
                    className={styles.approveBtn}
                    disabled={!selectedApprovalCourse[user.id] || !selectedApprovalCohort[user.id]}
                  >
                    ✓ Approve
                  </button>
                  <button 
                    onClick={() => handleReject(user.id)}
                    className={styles.rejectBtn}
                  >
                    ✗ Reject
                  </button>
                </td>
              </tr>
            ))}
            {pendingUsers.length === 0 && (
              <tr>
                <td colSpan="7" className={styles.noData}>
                  No pending approvals
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Student Detail Modal */}
      {showUserModal && selectedUser && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Student Details</h2>
            <div className={styles.modalBody}>
              <p><strong>Name:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Phone:</strong> {selectedUser.phone || '-'}</p>
              <p><strong>Status:</strong> {selectedUser.status}</p>
              <p><strong>Cohort:</strong> {selectedUser.cohort_name || 'Not assigned'}</p>
              <p><strong>Course:</strong> {selectedUser.course_name || 'Not assigned'}</p>
              <p><strong>Joined:</strong> {new Date(selectedUser.created_at).toLocaleDateString()}</p>
              {selectedUser.approved_at && (
                <p><strong>Approved:</strong> {new Date(selectedUser.approved_at).toLocaleDateString()}</p>
              )}
            </div>
            <div className={styles.modalActions}>
              <button onClick={() => setShowUserModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminApprovalsPage;