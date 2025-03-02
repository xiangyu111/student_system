import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Goals from './Goals';
import Activities from './Activities';
import Progress from './Progress';
import Feedback from './Feedback';
import Recommendations from './Recommendations';
import Profile from './Profile';

const StudentDashboard: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Goals />} />
      <Route path="goals" element={<Goals />} />
      <Route path="activities" element={<Activities />} />
      <Route path="progress" element={<Progress />} />
      <Route path="feedback" element={<Feedback />} />
      <Route path="recommendations" element={<Recommendations />} />
      <Route path="profile" element={<Profile />} />
    </Routes>
  );
};

export default StudentDashboard;
