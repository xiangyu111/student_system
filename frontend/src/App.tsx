import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/student/Dashboard';
import StudentGoals from './pages/student/Goals';
import StudentActivities from './pages/student/Activities';
import StudentResources from './pages/student/Resources';
import StudentAnalytics from './pages/student/Analytics';
import StudentFeedback from './pages/student/Feedback';
import StudentRecommendations from './pages/student/Recommendations';
import TeacherDashboard from './pages/teacher/Dashboard';
import TeacherGoals from './pages/teacher/Goals';
import TeacherActivities from './pages/teacher/Activities';
import TeacherStudents from './pages/teacher/Students';
import TeacherAnalytics from './pages/teacher/Analytics';
import TeacherResourceManagement from './pages/teacher/ResourceManagement';
import TeacherFeedback from './pages/teacher/Feedback';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminAnalytics from './pages/admin/Analytics';
import AdminSettings from './pages/admin/Settings';
import AdminClasses from './pages/admin/Classes';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* 学生路由 */}
        <Route path="/student/*" element={<PrivateRoute role="student" />}>
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="goals" element={<StudentGoals />} />
          <Route path="activities" element={<StudentActivities />} />
          <Route path="resources" element={<StudentResources />} />
          <Route path="analytics" element={<StudentAnalytics />} />
          <Route path="feedback" element={<StudentFeedback />} />
          <Route path="recommendations" element={<StudentRecommendations />} />
        </Route>

        {/* 教师路由 */}
        <Route path="/teacher/*" element={<PrivateRoute role="teacher" />}>
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="goals" element={<TeacherGoals />} />
          <Route path="activities" element={<TeacherActivities />} />
          <Route path="students" element={<TeacherStudents />} />
          <Route path="analytics" element={<TeacherAnalytics />} />
          <Route path="resources" element={<TeacherResourceManagement />} />
          <Route path="feedback" element={<TeacherFeedback />} />
        </Route>

        {/* 管理员路由 */}
        <Route path="/admin/*" element={<PrivateRoute role="admin" />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="classes" element={<AdminClasses />} />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
