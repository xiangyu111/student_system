import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Button, Typography } from 'antd';
import { 
  UserOutlined, 
  BookOutlined, 
  BarChartOutlined, 
  CalendarOutlined, 
  LogoutOutlined, 
  MenuUnfoldOutlined, 
  MenuFoldOutlined,
  SettingOutlined,
  DashboardOutlined
} from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../services/userService';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

interface StudentLayoutProps {
  children: React.ReactNode;
}

const StudentLayout: React.FC<StudentLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || '用户';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // 使用 items 属性替代 children
  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/student/dashboard">仪表盘</Link>,
    },
    {
      key: 'goals',
      icon: <BookOutlined />,
      label: <Link to="/student/goals">学习目标</Link>,
    },
    {
      key: 'activities',
      icon: <CalendarOutlined />,
      label: <Link to="/student/activities">学习活动</Link>,
    },
    {
      key: 'resources',
      icon: <BookOutlined />,
      label: <Link to="/student/resources">学习资源</Link>,
    },
    {
      key: 'analytics',
      icon: <BarChartOutlined />,
      label: <Link to="/student/analytics">数据分析</Link>,
    },
  ];

  // 使用 items 属性替代 overlay
  const dropdownItems = {
    items: [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: <Link to="/student/profile">个人信息</Link>,
      },
      {
        key: 'settings',
        icon: <SettingOutlined />,
        label: <Link to="/student/settings">设置</Link>,
      },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: <a onClick={handleLogout}>退出登录</a>,
      },
    ],
  };

  const selectedKey = location.pathname.split('/')[2] || 'dashboard';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" style={{ height: 64, padding: 16, color: 'white', textAlign: 'center' }}>
          <Title level={4} style={{ color: 'white', margin: 0 }}>
            {collapsed ? '学情' : '学情记录系统'}
          </Title>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
        />
      </Sider>
      <Layout className="site-layout">
        <Header style={{ padding: 0, background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          <div style={{ marginRight: 20 }}>
            <Dropdown menu={dropdownItems}>
              <span style={{ cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} style={{ marginRight: 8 }} />
                {username}
              </span>
            </Dropdown>
          </div>
        </Header>
        <Content style={{ 
          margin: '24px 16px', 
          padding: 24,
          minHeight: 'calc(100vh - 112px)',
          background: '#fff',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default StudentLayout;
