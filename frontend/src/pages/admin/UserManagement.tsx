import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, Tag, Typography, Card, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

interface User {
  id: number;
  username: string;
  role: string;
  status: string;
  createdAt: string;
  lastLogin: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    // 模拟获取用户数据
    setTimeout(() => {
      setUsers([
        {
          id: 1,
          username: 'admin',
          role: 'admin',
          status: 'active',
          createdAt: '2025-01-01',
          lastLogin: '2025-03-15'
        },
        {
          id: 2,
          username: 'teacher1',
          role: 'teacher',
          status: 'active',
          createdAt: '2025-01-05',
          lastLogin: '2025-03-14'
        },
        {
          id: 3,
          username: 'student1',
          role: 'student',
          status: 'active',
          createdAt: '2025-01-10',
          lastLogin: '2025-03-15'
        },
        {
          id: 4,
          username: 'student2',
          role: 'student',
          status: 'inactive',
          createdAt: '2025-01-15',
          lastLogin: '2025-02-20'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: User) => {
    setEditingUser(record);
    form.setFieldsValue({
      username: record.username,
      role: record.role,
      status: record.status
    });
    setModalVisible(true);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个用户吗？',
      onOk() {
        setUsers(users.filter(user => user.id !== id));
        message.success('用户已删除');
      }
    });
  };

  const toggleUserStatus = (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    setUsers(users.map(user => 
      user.id === id ? { ...user, status: newStatus } : user
    ));
    message.success(`用户状态已更新为${newStatus === 'active' ? '启用' : '禁用'}`);
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (editingUser) {
        // 更新现有用户
        setUsers(users.map(user => 
          user.id === editingUser.id ? { ...user, ...values } : user
        ));
        message.success('用户已更新');
      } else {
        // 添加新用户
        const newUser = {
          id: Math.max(0, ...users.map(u => u.id)) + 1,
          ...values,
          createdAt: new Date().toISOString().split('T')[0],
          lastLogin: '-'
        };
        setUsers([...users, newUser]);
        message.success('用户已添加');
      }
      
      setModalVisible(false);
    });
  };

  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => {
        const roleMap: Record<string, { color: string, text: string }> = {
          admin: { color: 'red', text: '管理员' },
          teacher: { color: 'blue', text: '教师' },
          student: { color: 'green', text: '学生' }
        };
        const { color, text } = roleMap[role] || { color: 'default', text: '未知' };
        return <Tag color={color}>{text}</Tag>;
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        return status === 'active' ? 
          <Tag color="success">启用</Tag> : 
          <Tag color="error">禁用</Tag>;
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '最后登录',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: User) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={record.status === 'active' ? <LockOutlined /> : <UnlockOutlined />} 
            onClick={() => toggleUserStatus(record.id, record.status)}
          />
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={3}>用户管理</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          添加用户
        </Button>
      </div>
      
      <Card>
        <Table 
          columns={columns} 
          dataSource={users} 
          rowKey="id" 
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
      
      <Modal
        title={editingUser ? '编辑用户' : '添加用户'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          
          {!editingUser && (
            <Form.Item
              name="password"
              label="密码"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password placeholder="请输入密码" />
            </Form.Item>
          )}
          
          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select placeholder="请选择角色">
              <Option value="admin">管理员</Option>
              <Option value="teacher">教师</Option>
              <Option value="student">学生</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择状态">
              <Option value="active">启用</Option>
              <Option value="inactive">禁用</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement; 