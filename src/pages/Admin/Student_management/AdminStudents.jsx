// src/pages/admin/AdminStudentsPage.jsx
import React, { useEffect, useState, useCallback } from 'react';
import styles from './AdminStudentsPage.module.css';

const AdminStudentsPage = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Edit Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    cohort_id: '',
    course_id: ''
  });

  // Pagination states
  const [userPagination, setUserPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });

  // Filter states
  const [filters, setFilters] = useState({
    status: '',
    cohort: '',
    search: ''
  });

  useEffect(() => {
    fetchCourses();
    fetchCohorts();
    fetchAllUsers(1);
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://ethiocoder-backned.onrender.com/api/admin/courses', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setCourses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchCohorts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://ethiocoder-backned.onrender.com/api/admin/cohorts', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setCohorts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching cohorts:', error);
    }
  };

  const fetchAllUsers = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams({
        page,
        limit: userPagination.limit,
        ...(filters.status && { status: filters.status }),
        ...(filters.cohort && { cohort: filters.cohort }),
        ...(filters.search && { search: filters.search })
      });

      const response = await fetch(`https://ethiocoder-backned.onrender.com/api/admin/students?${queryParams}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      setAllUsers(data.students || []);
      setUserPagination(data.pagination || {
        page: 1,
        limit: 20,
        total: 0,
        pages: 0
      });
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, userPagination.limit]);

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

  const handleEditClick = (student) => {
    // Get current course and cohort IDs
    const currentCourseId = student.course_ids ? 
      (Array.isArray(student.course_ids) ? student.course_ids[0] : student.course_ids) : '';
    const currentCohortId = student.cohort_ids ? 
      (Array.isArray(student.cohort_ids) ? student.cohort_ids[0] : student.cohort_ids) : '';

    setEditStudent(student);
    setEditForm({
      name: student.name || '',
      email: student.email || '',
      phone: student.phone || '',
      cohort_id: currentCohortId || '',
      course_id: currentCourseId || ''
    });
    setShowEditModal(true);
  };

  // ✅ FIXED: Added parseInt() to convert strings to numbers
const handleEditSubmit = async (e) => {
  e.preventDefault();
  
  if (!editForm.course_id || !editForm.cohort_id) {
    alert('Please select both course and cohort');
    return;
  }
  
  try {
    const token = localStorage.getItem('token');
    const requestBody = {
      name: editForm.name,
      email: editForm.email,
      phone: editForm.phone,
      course_id: parseInt(editForm.course_id),
      cohort_id: parseInt(editForm.cohort_id)
    };
    
    const response = await fetch(`https://ethiocoder-backned.onrender.com/api/admin/students/${editStudent.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    
    if (response.ok) {
      alert('Student updated successfully!');
      setShowEditModal(false);
      fetchAllUsers(userPagination.page);
    } else {
      alert(data.error || 'Failed to update student');
    }
  } catch (error) {
    console.error('Error updating student:', error);
    alert('Error updating student');
  }
};
  const handleBlockStudent = async (userId) => {
    if (!window.confirm('Are you sure you want to block this student?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://ethiocoder-backned.onrender.com/api/admin/students/${userId}/block`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('Student blocked successfully!');
        fetchAllUsers(userPagination.page);
      }
    } catch (error) {
      console.error('Error blocking student:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    fetchAllUsers(1);
  };

  const resetFilters = () => {
    setFilters({
      status: '',
      cohort: '',
      search: ''
    });
    setTimeout(() => fetchAllUsers(1), 0);
  };

  if (loading) {
    return <div className={styles.loading}>Loading students...</div>;
  }

  return (
    <>
      <header className={styles.header}>
        <h1>All Students</h1>
        <div className={styles.filters}>
          <input
            type="text"
            name="search"
            placeholder="Search by name or email"
            value={filters.search}
            onChange={handleFilterChange}
            className={styles.searchInput}
          />
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className={styles.filterSelect}
          >
            <option value="">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            name="cohort"
            value={filters.cohort}
            onChange={handleFilterChange}
            className={styles.filterSelect}
          >
            <option value="">All Cohorts</option>
            {cohorts.map(cohort => (
              <option key={cohort.id} value={cohort.id}>
                {cohort.name}
              </option>
            ))}
          </select>
          <button onClick={applyFilters} className={styles.filterBtn}>
            Apply Filters
          </button>
          <button onClick={resetFilters} className={styles.resetBtn}>
            Reset
          </button>
        </div>
      </header>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Status</th>
              <th>Cohorts</th>
              <th>Courses</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {allUsers.map(user => (
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
                <td>
                  <span className={`${styles.roleBadge} ${styles[user.role]}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <span className={`${styles.statusBadge} ${styles[user.status]}`}>
                    {user.status}
                  </span>
                </td>
                <td>
                  {Array.isArray(user.cohort_names) 
                    ? user.cohort_names.join(', ') 
                    : user.cohort_names || 'Not assigned'}
                </td>
                <td>
                  {Array.isArray(user.course_names) 
                    ? user.course_names.join(', ') 
                    : 'Not assigned'}
                </td>
                <td>{new Date(user.created_at).toLocaleDateString()}</td>
                <td className={styles.actions}>
                  <button 
                    onClick={() => fetchStudentDetails(user.id)}
                    className={styles.viewBtn}
                    title="View Details"
                  >
                    👁️
                  </button>
                  <button 
                    onClick={() => handleEditClick(user)}
                    className={styles.editBtn}
                    title="Edit Student"
                  >
                    ✏️
                  </button>
                  {user.status === 'approved' && (
                    <button 
                      onClick={() => handleBlockStudent(user.id)}
                      className={styles.blockBtn}
                      title="Block Student"
                    >
                      🚫
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {userPagination.pages > 1 && (
          <div className={styles.pagination}>
            <button
              onClick={() => fetchAllUsers(userPagination.page - 1)}
              disabled={userPagination.page === 1}
            >
              Previous
            </button>
            <span>Page {userPagination.page} of {userPagination.pages}</span>
            <button
              onClick={() => fetchAllUsers(userPagination.page + 1)}
              disabled={userPagination.page === userPagination.pages}
            >
              Next
            </button>
          </div>
        )}
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

      {/* Edit Student Modal */}
      {showEditModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Edit Student: {editStudent?.name}</h2>
            <form onSubmit={handleEditSubmit}>
              <div className={styles.formGroup}>
                <label>Name *</label>
                <input
                  type="text"
                  value={editForm.name}
                  readOnly
                  className={styles.readonlyInput}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Email *</label>
                <input
                  type="email"
                  value={editForm.email}
                  readOnly
                  className={styles.readonlyInput}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Phone</label>
                <input
                  type="text"
                  value={editForm.phone}
                  readOnly
                  className={styles.readonlyInput}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Course</label>
                <select
                  value={editForm.course_id}
                  onChange={(e) => setEditForm({...editForm, course_id: e.target.value})}
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
                <label>Cohort</label>
                <select
                  value={editForm.cohort_id}
                  onChange={(e) => setEditForm({...editForm, cohort_id: e.target.value})}
                >
                  <option value="">Select Cohort</option>
                  {cohorts
                    .filter(cohort => !editForm.course_id || cohort.course_id == editForm.course_id)
                    .map(cohort => (
                      <option key={cohort.id} value={cohort.id}>
                        {cohort.name}
                      </option>
                    ))}
                </select>
              </div>
              
              <div className={styles.modalActions}>
                <button type="submit">Update Student</button>
                <button type="button" onClick={() => setShowEditModal(false)}>
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

export default AdminStudentsPage;