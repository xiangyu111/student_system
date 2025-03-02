import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import StudentLayout from '../layouts/StudentLayout';
import TeacherLayout from '../layouts/TeacherLayout';
import AdminLayout from '../layouts/AdminLayout';

interface PrivateRouteProps {
  role: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ role }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (userRole && userRole !== role) {
    return <Navigate to={`/${userRole}/dashboard`} />;
  }

  const LayoutComponent = ({
    student: StudentLayout,
    teacher: TeacherLayout,
    admin: AdminLayout
  }[role] as React.FC<{ children?: React.ReactNode }>);

  return (
    <LayoutComponent>
      <Outlet />
    </LayoutComponent>
  );
};

export default PrivateRoute;
