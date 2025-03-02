import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { 
  UserOutlined, 
  TeamOutlined, 
  SettingOutlined, 
  DashboardOutlined,
  ClockCircleOutlined,
  BookOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import DashboardLayout from '../../components/DashboardLayout';
import UserManagement from './UserManagement';
import ClassManagement from './ClassManagement';
import SystemSettings from './SystemSettings';
import Profile from './Profile';
import { Card, Row, Col, Statistic, List, Typography, Divider } from 'antd';
import { getUserCount } from '../../services/userService';
import { getResourceCount } from '../../services/resourceService';
import { getActivityCount } from '../../services/activityService';

const { Title } = Typography;

interface RecentActivity {
  id: number;
  username: string;
  activityType: string;
  timestamp: string;
}

const AdminDashboard: React.FC = () => {
  const [userCount, setUserCount] = useState<number>(0);
  const [resourceCount, setResourceCount] = useState<number>(0);
  const [activityCount, setActivityCount] = useState<number>(0);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // 获取用户数量
      const userResponse = await getUserCount(token);
      if (userResponse.status === 200) {
        setUserCount(userResponse.count);
      }

      // 获取资源数量
      const resourceResponse = await getResourceCount(token);
      if (resourceResponse.status === 200) {
        setResourceCount(resourceResponse.count);
      }

      // 获取活动数量
      const activityResponse = await getActivityCount(token);
      if (activityResponse.status === 200) {
        setActivityCount(activityResponse.count);
        setRecentActivities(activityResponse.recentActivities || []);
      }
    } catch (error) {
      console.error('获取统计数据出错:', error);
    }
  };

  const menuItems = [
    { key: 'users', label: '用户管理', icon: <UserOutlined /> },
    { key: 'classes', label: '班级管理', icon: <TeamOutlined /> },
    { key: 'settings', label: '系统设置', icon: <SettingOutlined /> },
    { key: 'profile', label: '个人信息', icon: <UserOutlined /> },
  ];

  return (
    <DashboardLayout
      menuItems={menuItems}
      defaultSelectedKey="dashboard"
      title="管理员控制台"
      basePath="/admin"
    >
      <Routes>
        <Route path="users" element={<UserManagement />} />
        <Route path="classes" element={<ClassManagement />} />
        <Route path="settings" element={<SystemSettings />} />
        <Route path="profile" element={<Profile />} />
      </Routes>

      <Title level={2}>管理员仪表盘</Title>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="用户总数"
              value={userCount}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="资源总数"
              value={resourceCount}
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="活动总数"
              value={activityCount}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Divider orientation="left">最近活动</Divider>
      <Card>
        <List
          itemLayout="horizontal"
          dataSource={recentActivities}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                avatar={<ClockCircleOutlined />}
                title={`${item.username} - ${item.activityType}`}
                description={item.timestamp}
              />
            </List.Item>
          )}
        />
      </Card>
    </DashboardLayout>
  );
};

export default AdminDashboard; 