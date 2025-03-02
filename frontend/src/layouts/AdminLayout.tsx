import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, message } from 'antd';
import { 
  DashboardOutlined, 
  TeamOutlined, 
  AreaChartOutlined, 
  SettingOutlined, 
  LogoutOutlined 
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { getUserInfo } from '../services/userService';

const { Header, Sider, Content } = Layout;

const AdminLayout: React.FC = () => {
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
          if (response.data.role !== 'admin') {
            message.error('无权访问管理员页面');
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
    if (path.includes('/admin/dashboard')) return '1';
    if (path.includes('/admin/users')) return '2';
    if (path.includes('/admin/analytics')) return '3';
    if (path.includes('/admin/settings')) return '4';
    return '1';
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div className="logo" style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.3)' }} />
        <Menu theme="dark" mode="inline" selectedKeys={[getSelectedKey()]}>
          <Menu.Item key="1" icon={<DashboardOutlined />} onClick={() => navigate('/admin/dashboard')}>
            仪表盘
          </Menu.Item>
          <Menu.Item key="2" icon={<TeamOutlined />} onClick={() => navigate('/admin/users')}>
            用户管理
          </Menu.Item>
          <Menu.Item key="3" icon={<AreaChartOutlined />} onClick={() => navigate('/admin/analytics')}>
            数据分析
          </Menu.Item>
          <Menu.Item key="4" icon={<SettingOutlined />} onClick={() => navigate('/admin/settings')}>
            系统设置
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

export default AdminLayout; 