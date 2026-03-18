// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home/Home';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import './App.css';

// Admin imports
import AdminLayout from './pages/Admin/AdminLayout';
import AdminDashboardPage from './pages/Admin/AdminDashboard';
import AdminApprovalsPage from './pages/Admin/Approval/AdminApprovals';
import AdminStudentsPage from './pages/Admin/Student_management/AdminStudents';
import AdminCoursesPage from './pages/admin/Courses/AdminCourses';
import AdminCohortsPage from './pages/admin/Cohorts/AdminCohorts';
import AdminPhasesPage from './pages/admin/Phases/AdminPhasesPage';

// Student imports
import StudentCoursePage from './pages/student/StudentCoursePage';
// import StudentCourseDetail from './pages/student/StudentCourseDetail'; // We'll create this

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Student routes */}
          <Route path="/student">
            <Route index element={<StudentCoursePage />} />
          </Route>
          
          {/* Admin routes with layout */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="approvals" element={<AdminApprovalsPage />} />
            <Route path="students" element={<AdminStudentsPage />} />
            <Route path="courses" element={<AdminCoursesPage />} />
            <Route path="courses/:courseId/phases" element={<AdminPhasesPage />} />
            <Route path="cohorts" element={<AdminCohortsPage />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;