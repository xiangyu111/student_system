import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Modal, 
  Form, 
  Input, 
  Select, 
  message, 
  Popconfirm,
  Tag
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getAllUsers, addUser, updateUser, deleteUser } from '../../services/userService';

const { Option } = Select;

interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>('添加用户');
  const [form] = Form.useForm();
  const [editingUserId, setEditingUserId] = useState<number | null>(null);

  useEffect(() => {
    // 模拟数据加载
    setTimeout(() => {
      setUsers([
        {
          id: 1,
          username: 'admin',
          name: '管理员',
          email: 'admin@example.com',
          role: 'admin',
          status: 'active'
        },
        {
          id: 2,
          username: 'teacher1',
          name: '张老师',
          email: 'teacher1@example.com',
          role: 'teacher',
          status: 'active'
        },
        {
          id: 3,
          username: 'student1',
          name: '李同学',
          email: 'student1@example.com',
          role: 'student',
          status: 'active'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAdd = () => {
    setModalTitle('添加用户');
    setEditingUserId(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (user: User) => {
    setModalTitle('编辑用户');
    setEditingUserId(user.id);
    form.setFieldsValue({
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    // 模拟删除操作
    setUsers(users.filter(user => user.id !== id));
    message.success('删除用户成功');
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingUserId === null) {
        // 模拟添加用户
        const newUser = {
          id: Math.max(...users.map(u => u.id), 0) + 1,
          ...values
        };
        setUsers([...users, newUser]);
        message.success('添加用户成功');
      } else {
        // 模拟更新用户
        const updatedUsers = users.map(user => 
          user.id === editingUserId 
            ? { ...user, ...values } 
            : user
        );
        setUsers(updatedUsers);
        message.success('更新用户成功');
      }
      
      setModalVisible(false);
    } catch (error) {
      console.error('提交表单出错:', error);
      message.error('操作失败，请稍后重试');
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
  };

  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => {
        let color = 'blue';
        let text = '未知';
        switch (role) {
          case 'admin':
            color = 'red';
            text = '管理员';
            break;
          case 'teacher':
            color = 'green';
            text = '教师';
            break;
          case 'student':
            color = 'blue';
            text = '学生';
            break;
        }
        return <Tag color={color}>{text}</Tag>;
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'active' ? 'green' : 'red';
        const text = status === 'active' ? '活跃' : '禁用';
        return <Tag color={color}>{text}</Tag>;
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: User) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除该用户吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="primary" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card
        title="用户管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加用户
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={modalTitle}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select>
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
            <Select>
              <Option value="active">活跃</Option>
              <Option value="inactive">禁用</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="password"
            label="密码"
            rules={[
              { 
                required: editingUserId === null, 
                message: '请输入密码' 
              }
            ]}
          >
            <Input.Password placeholder={editingUserId !== null ? '不修改请留空' : ''} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Users; 