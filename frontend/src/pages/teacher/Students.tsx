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
import { getStudents, addStudent, updateStudent, deleteStudent } from '../../services/studentService';

const { Option } = Select;

interface Student {
  id: number;
  username: string;
  name: string;
  email: string;
  studentId: string;
  grade: string;
  major: string;
  status: string;
}

const Students: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>('添加学生');
  const [form] = Form.useForm();
  const [editingStudentId, setEditingStudentId] = useState<number | null>(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('请先登录');
        return;
      }

      const response = await getStudents(token);
      if (response.status === 200) {
        setStudents(response.students);
      } else {
        message.error(response.message || '获取学生列表失败');
      }
    } catch (error) {
      console.error('获取学生列表出错:', error);
      message.error('获取学生列表失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setModalTitle('添加学生');
    setEditingStudentId(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (student: Student) => {
    setModalTitle('编辑学生');
    setEditingStudentId(student.id);
    form.setFieldsValue({
      username: student.username,
      name: student.name,
      email: student.email,
      studentId: student.studentId,
      grade: student.grade,
      major: student.major,
      status: student.status
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('请先登录');
        return;
      }

      const response = await deleteStudent(token, id);
      if (response.status === 200) {
        message.success('删除学生成功');
        fetchStudents();
      } else {
        message.error(response.message || '删除学生失败');
      }
    } catch (error) {
      console.error('删除学生出错:', error);
      message.error('删除学生失败，请稍后重试');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('请先登录');
        return;
      }

      if (editingStudentId === null) {
        // 添加学生
        const response = await addStudent(token, values);
        if (response.status === 200) {
          message.success('添加学生成功');
          setModalVisible(false);
          fetchStudents();
        } else {
          message.error(response.message || '添加学生失败');
        }
      } else {
        // 更新学生
        const response = await updateStudent(token, editingStudentId, values);
        if (response.status === 200) {
          message.success('更新学生成功');
          setModalVisible(false);
          fetchStudents();
        } else {
          message.error(response.message || '更新学生失败');
        }
      }
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
      title: '学号',
      dataIndex: 'studentId',
      key: 'studentId',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '年级',
      dataIndex: 'grade',
      key: 'grade',
    },
    {
      title: '专业',
      dataIndex: 'major',
      key: 'major',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '活跃' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Student) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除该学生吗？"
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
        title="学生管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加学生
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={students}
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
            name="studentId"
            label="学号"
            rules={[{ required: true, message: '请输入学号' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="grade"
            label="年级"
            rules={[{ required: true, message: '请输入年级' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="major"
            label="专业"
            rules={[{ required: true, message: '请输入专业' }]}
          >
            <Input />
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
        </Form>
      </Modal>
    </div>
  );
};

export default Students; 