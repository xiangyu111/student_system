import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, message } from 'antd';
import { 
  DashboardOutlined, 
  TeamOutlined, 
  ScheduleOutlined, 
  FlagOutlined, 
  AreaChartOutlined, 
  BookOutlined, 
  LogoutOutlined 
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { getUserInfo } from '../services/userService';

const { Header, Sider, Content } = Layout;

const TeacherLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      message.error('请先登录');
      navigate('/login');
      return;
    }

    // 获取用户信息
    getUserInfo(token)
      .then(response => {
        if (response.status === 200) {
          setUsername(response.data.username);
          // 检查用户角色
          if (response.data.role !== 'teacher') {
            message.error('无权访问教师页面');
            navigate('/login');
          }
        } else {
          message.error(response.message || '获取用户信息失败');
          navigate('/login');
        }
      })
      .catch(error => {
        console.error('获取用户信息出错:', error);
        message.error('获取用户信息失败，请重新登录');
        navigate('/login');
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    message.success('退出登录成功');
    navigate('/login');
  };

  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.includes('/teacher/dashboard')) return '1';
    if (path.includes('/teacher/students')) return '2';
    if (path.includes('/teacher/activities')) return '3';
    if (path.includes('/teacher/goals')) return '4';
    if (path.includes('/teacher/analytics')) return '5';
    if (path.includes('/teacher/resources')) return '6';
    return '1';
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div className="logo" style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.3)' }} />
        <Menu theme="dark" mode="inline" selectedKeys={[getSelectedKey()]}>
          <Menu.Item key="1" icon={<DashboardOutlined />} onClick={() => navigate('/teacher/dashboard')}>
            仪表盘
          </Menu.Item>
          <Menu.Item key="2" icon={<TeamOutlined />} onClick={() => navigate('/teacher/students')}>
            学生管理
          </Menu.Item>
          <Menu.Item key="3" icon={<ScheduleOutlined />} onClick={() => navigate('/teacher/activities')}>
            活动管理
          </Menu.Item>
          <Menu.Item key="4" icon={<FlagOutlined />} onClick={() => navigate('/teacher/goals')}>
            目标管理
          </Menu.Item>
          <Menu.Item key="5" icon={<AreaChartOutlined />} onClick={() => navigate('/teacher/analytics')}>
            数据分析
          </Menu.Item>
          <Menu.Item key="6" icon={<BookOutlined />} onClick={() => navigate('/teacher/resources')}>
            资源管理
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0, background: '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingRight: 24 }}>
            <span style={{ marginRight: 12 }}>欢迎，{username}</span>
            <Button icon={<LogoutOutlined />} onClick={handleLogout}>
              退出登录
            </Button>
          </div>
        </Header>
        <Content style={{ margin: '16px' }}>
          <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default TeacherLayout; 