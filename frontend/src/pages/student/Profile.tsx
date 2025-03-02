import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Upload, message, Avatar, Typography } from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import { getUserInfo, updateUserInfo } from '../../services/userService';

const { Title } = Typography;

const Profile: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [avatar, setAvatar] = useState<string>('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const info = await getUserInfo(token);
          setUserInfo(info);
          setAvatar(info.avatar || '');
          form.setFieldsValue({
            username: info.username,
            role: info.role,
          });
        }
      } catch (error) {
        console.error('获取用户信息失败:', error);
        message.error('获取用户信息失败');
      }
    };

    fetchUserInfo();
  }, [form]);

  const handleUpdateProfile = async (values: any) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await updateUserInfo(token, avatar);
        message.success('个人资料更新成功');
      }
    } catch (error) {
      console.error('更新个人资料失败:', error);
      message.error('更新个人资料失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (info: any) => {
    if (info.file.status === 'done') {
      // 这里应该是从后端获取上传后的URL
      // 现在我们只是模拟一下
      setAvatar(`https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 100)}.jpg`);
      message.success('头像上传成功');
    } else if (info.file.status === 'error') {
      message.error('头像上传失败');
    }
  };

  return (
    <div>
      <Title level={3}>个人资料</Title>
      <Card style={{ maxWidth: 600, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Avatar 
            size={100} 
            icon={<UserOutlined />} 
            src={avatar} 
          />
          <div style={{ marginTop: 16 }}>
            <Upload 
              name="avatar"
              action="/api/upload" // 这里应该是你的上传API
              showUploadList={false}
              onChange={handleAvatarChange}
            >
              <Button icon={<UploadOutlined />}>更换头像</Button>
            </Upload>
          </div>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdateProfile}
        >
          <Form.Item
            name="username"
            label="用户名"
          >
            <Input disabled />
          </Form.Item>
          
          <Form.Item
            name="role"
            label="角色"
          >
            <Input disabled />
          </Form.Item>
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              style={{ width: '100%' }}
            >
              保存修改
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Profile; 