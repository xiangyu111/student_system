import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, message, Typography, Space, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { Option } = Select;

interface Teacher {
  id: number;
  username: string;
}

interface ClassData {
  id: number;
  className: string;
  teacherId: number;
  teacherName: string;
}

const AdminClasses: React.FC = () => {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingClass, setEditingClass] = useState<ClassData | null>(null);
  const navigate = useNavigate();
  
  const token = localStorage.getItem('token');
  
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    
    fetchClasses();
    fetchTeachers();
  }, [token, navigate]);
  
  const fetchClasses = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/class/list', {
        params: { token }
      });
      
      if (response.data.status === 200) {
        setClasses(response.data.classes);
      } else {
        message.error('获取班级列表失败');
      }
    } catch (error) {
      message.error('获取班级列表时发生错误');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchTeachers = async () => {
    try {
      const response = await axios.get('/api/admin/teachers', {
        params: { token }
      });
      
      if (response.data.status === 200) {
        setTeachers(response.data.teachers);
      } else {
        message.error('获取教师列表失败');
      }
    } catch (error) {
      message.error('获取教师列表时发生错误');
      console.error(error);
    }
  };
  
  const showAddModal = () => {
    setEditingClass(null);
    form.resetFields();
    setModalVisible(true);
  };
  
  const showEditModal = (record: ClassData) => {
    setEditingClass(record);
    form.setFieldsValue({
      className: record.className,
      teacherId: record.teacherId
    });
    setModalVisible(true);
  };
  
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingClass) {
        // 更新班级
        const response = await axios.put(`/api/admin/class/${editingClass.id}/update`, {
          token,
          className: values.className,
          teacherId: values.teacherId
        });
        
        if (response.data.status === 200) {
          message.success('班级更新成功');
          setModalVisible(false);
          fetchClasses();
        } else {
          message.error('班级更新失败');
        }
      } else {
        // 添加班级
        const response = await axios.post('/api/admin/class/add', {
          token,
          className: values.className,
          teacherId: values.teacherId
        });
        
        if (response.data.status === 200) {
          message.success('班级添加成功');
          setModalVisible(false);
          fetchClasses();
        } else {
          message.error('班级添加失败');
        }
      }
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };
  
  const handleDelete = async (id: number) => {
    try {
      const response = await axios.delete(`/api/admin/class/${id}/delete`, {
        params: { token }
      });
      
      if (response.data.status === 200) {
        message.success('班级删除成功');
        fetchClasses();
      } else {
        message.error('班级删除失败');
      }
    } catch (error) {
      message.error('删除班级时发生错误');
      console.error(error);
    }
  };
  
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '班级名称',
      dataIndex: 'className',
      key: 'className',
    },
    {
      title: '教师',
      dataIndex: 'teacherName',
      key: 'teacherName',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: ClassData) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => showEditModal(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个班级吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  
  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>班级管理</Title>
      
      <Card>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={showAddModal}
          style={{ marginBottom: '20px' }}
        >
          添加班级
        </Button>
        
        <Table
          columns={columns}
          dataSource={classes}
          rowKey="id"
          loading={loading}
        />
      </Card>
      
      <Modal
        title={editingClass ? '编辑班级' : '添加班级'}
        open={modalVisible}
        onOk={handleOk}
        onCancel={() => setModalVisible(false)}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="className"
            label="班级名称"
            rules={[{ required: true, message: '请输入班级名称' }]}
          >
            <Input placeholder="请输入班级名称" />
          </Form.Item>
          
          <Form.Item
            name="teacherId"
            label="分配教师"
            rules={[{ required: true, message: '请选择教师' }]}
          >
            <Select placeholder="请选择教师">
              {teachers.map(teacher => (
                <Option key={teacher.id} value={teacher.id}>{teacher.username}</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminClasses; 