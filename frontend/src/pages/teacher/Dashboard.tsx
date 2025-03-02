import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { TeamOutlined, FlagOutlined, CommentOutlined, SettingOutlined } from '@ant-design/icons';
import DashboardLayout from '../../components/DashboardLayout';
import StudentList from './StudentList';
import GoalManagement from './GoalManagement';
import FeedbackManagement from './FeedbackManagement';
import Profile from './Profile';

const TeacherDashboard: React.FC = () => {
  const menuItems = [
    { key: 'students', label: '学生管理', icon: <TeamOutlined /> },
    { key: 'goals', label: '目标管理', icon: <FlagOutlined /> },
    { key: 'feedback', label: '反馈管理', icon: <CommentOutlined /> },
    { key: 'settings', label: '教学设置', icon: <SettingOutlined /> },
  ];

  return (
    <DashboardLayout
      menuItems={menuItems}
      defaultSelectedKey="students"
      title="学情记录分析系统 - 教师端"
      basePath="/teacher/dashboard"
    >
      <Routes>
        <Route path="/" element={<StudentList />} />
        <Route path="students" element={<StudentList />} />
        <Route path="goals" element={<GoalManagement />} />
        <Route path="feedback" element={<FeedbackManagement />} />
        <Route path="settings" element={<div>教学设置页面</div>} />
        <Route path="profile" element={<Profile />} />
      </Routes>
    </DashboardLayout>
  );
};

export default TeacherDashboard; 