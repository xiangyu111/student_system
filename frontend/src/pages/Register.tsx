import React, { useState } from 'react';
import { Form, Input, Button, Card, Radio, message, Upload } from 'antd';
import { UserOutlined, LockOutlined, UploadOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/userService';
import '../styles/Register.css';

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const navigate = useNavigate();

  const onFinish = async (values: { 
    username: string; 
    password: string; 
    confirmPassword: string;
    role: string;
  }) => {
    if (values.password !== values.confirmPassword) {
      message.error('两次输入的密码不一致');
      return;
    }
    
    setLoading(true);
    try {
      const response = await register(
        values.username, 
        values.password, 
        values.role, 
        avatarUrl
      );
      
      if (response.status === 200) {
        message.success('注册成功');
        navigate('/login');
      }
    } catch (error) {
      console.error('注册失败:', error);
      message.error('注册失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = (info: any) => {
    if (info.file.status === 'done') {
      setAvatarUrl(info.file.response.url);
      message.success('头像上传成功');
    } else if (info.file.status === 'error') {
      message.error('头像上传失败');
    }
  };

  return (
    <div className="register-container">
      <Card title="注册账号" className="register-card">
        <Form
          name="register"
          initialValues={{ role: 'student' }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入学号!' },
              { len: 10, message: '学号必须为10位数字!' },
              { pattern: /^\d+$/, message: '学号只能包含数字!' }
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="学号 (10位数字)" />
          </Form.Item>
          
          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码!' },
              { min: 6, message: '密码长度不能少于6位!' }
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>
          
          <Form.Item
            name="confirmPassword"
            rules={[{ required: true, message: '请确认密码!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="确认密码" />
          </Form.Item>
          
          <Form.Item name="role" rules={[{ required: true }]}>
            <Radio.Group>
              <Radio value="student">学生</Radio>
              <Radio value="teacher">教师</Radio>
            </Radio.Group>
          </Form.Item>
          
          <Form.Item name="avatar">
            <Upload
              name="avatar"
              action="/api/upload/avatar"
              onChange={handleAvatarUpload}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>上传头像</Button>
            </Upload>
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              注册
            </Button>
            <div className="login-link">
              已有账号？<Link to="/login">立即登录</Link>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Register; 