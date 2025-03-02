import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { login, getUserInfo } from '../services/userService';
import '../styles/Login.css';

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      // 登录获取 token
      const response = await login(values.username, values.password);
      
      if (response && response.token) {
        // 存储 token
        localStorage.setItem('token', response.token);
        
        try {
          // 获取用户信息
          const userInfo = await getUserInfo(response.token);
          
          // 存储用户信息
          localStorage.setItem('userRole', userInfo.role);
          localStorage.setItem('username', userInfo.username);
          
          // 显示成功消息
          message.success('登录成功');
          
          console.log('用户角色:', userInfo.role);
          console.log('准备导航到:', `/${userInfo.role}/dashboard`);
          
          // 根据角色导航
          switch (userInfo.role) {
            case 'admin':
              navigate('/admin/dashboard');
              break;
            case 'teacher':
              navigate('/teacher/dashboard');
              break;
            case 'student':
              navigate('/student/dashboard');
              break;
            default:
              navigate('/dashboard');
          }
        } catch (infoError) {
          console.error('获取用户信息失败:', infoError);
          message.error('获取用户信息失败');
          // 清除 token
          localStorage.removeItem('token');
        }
      } else {
        message.error('登录失败，服务器返回格式不正确');
      }
    } catch (loginError) {
      console.error('登录失败:', loginError);
      message.error('登录失败，请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Card title="用户登录" className="login-card">
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              登录
            </Button>
          </Form.Item>
          <div className="register-link">
            <Link to="/register">没有账号？立即注册</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login; 