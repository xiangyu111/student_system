import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, Typography, Card, message, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface Class {
  id: number;
  className: string;
  description: string;
  teacherId: string;
  teacherName: string;
  studentCount: number;
  createdAt: string;
  status: string;
}

const ClassManagement: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingClass, setEditingClass] = useState<Class | null>(null);

  useEffect(() => {
    // 模拟获取班级数据
    setTimeout(() => {
      setClasses([
        {
          id: 1,
          className: '计算机科学1班',
          description: '计算机科学与技术专业2025级1班',
          teacherId: '1001',
          teacherName: '张老师',
          studentCount: 30,
          createdAt: '2025-01-01',
          status: 'active'
        },
        {
          id: 2,
          className: '软件工程2班',
          description: '软件工程专业2025级2班',
          teacherId: '1002',
          teacherName: '李老师',
          studentCount: 25,
          createdAt: '2025-01-05',
          status: 'active'
        },
        {
          id: 3,
          className: '数据科学1班',
          description: '数据科学与大数据技术专业2025级1班',
          teacherId: '1003',
          teacherName: '王老师',
          studentCount: 28,
          createdAt: '2025-01-10',
          status: 'inactive'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAdd = () => {
    setEditingClass(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Class) => {
    setEditingClass(record);
    form.setFieldsValue({
      className: record.className,
      description: record.description,
      teacherId: record.teacherId,
      status: record.status
    });
    setModalVisible(true);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个班级吗？',
      onOk() {
        setClasses(classes.filter(cls => cls.id !== id));
        message.success('班级已删除');
      }
    });
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      const teacher = {
        '1001': '张老师',
        '1002': '李老师',
        '1003': '王老师',
        '1004': '赵老师'
      }[values.teacherId];
      
      const formattedValues = {
        ...values,
        teacherName: teacher
      };
      
      if (editingClass) {
        // 更新现有班级
        setClasses(classes.map(cls => 
          cls.id === editingClass.id ? { ...cls, ...formattedValues } : cls
        ));
        message.success('班级已更新');
      } else {
        // 添加新班级
        const newClass = {
          id: Math.max(0, ...classes.map(c => c.id)) + 1,
          ...formattedValues,
          studentCount: 0,
          createdAt: new Date().toISOString().split('T')[0]
        };
        setClasses([...classes, newClass]);
        message.success('班级已添加');
      }
      
      setModalVisible(false);
    });
  };

  const columns = [
    {
      title: '班级名称',
      dataIndex: 'className',
      key: 'className',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '教师',
      dataIndex: 'teacherName',
      key: 'teacherName',
    },
    {
      title: '学生数量',
      dataIndex: 'studentCount',
      key: 'studentCount',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
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
      title: '操作',
      key: 'action',
      render: (_: any, record: Class) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={3}>班级管理</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          添加班级
        </Button>
      </div>
      
      <Card>
        <Table 
          columns={columns} 
          dataSource={classes} 
          rowKey="id" 
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
      
      <Modal
        title={editingClass ? '编辑班级' : '添加班级'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="className"
            label="班级名称"
            rules={[{ required: true, message: '请输入班级名称' }]}
          >
            <Input placeholder="请输入班级名称" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="班级描述"
          >
            <TextArea rows={3} placeholder="请输入班级描述" />
          </Form.Item>
          
          <Form.Item
            name="teacherId"
            label="班级教师"
            rules={[{ required: true, message: '请选择班级教师' }]}
          >
            <Select placeholder="请选择班级教师">
              <Option value="1001">张老师</Option>
              <Option value="1002">李老师</Option>
              <Option value="1003">王老师</Option>
              <Option value="1004">赵老师</Option>
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

export default ClassManagement; 