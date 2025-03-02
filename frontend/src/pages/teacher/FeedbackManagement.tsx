import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Typography, Space, Tag, Card, Avatar } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface Feedback {
  id: number;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  content: string;
  date: string;
  type: string;
}

const FeedbackManagement: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingFeedback, setEditingFeedback] = useState<Feedback | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 模拟获取反馈数据
    setTimeout(() => {
      setFeedbacks([
        {
          id: 1,
          studentId: '2025001',
          studentName: '张三',
          studentAvatar: 'https://randomuser.me/api/portraits/men/1.jpg',
          content: '你的Java编程作业完成得很好，特别是在面向对象设计方面展现了很好的理解。建议可以进一步学习设计模式，提升代码质量。',
          date: '2025-03-15',
          type: 'praise'
        },
        {
          id: 2,
          studentId: '2025002',
          studentName: '李四',
          studentAvatar: 'https://randomuser.me/api/portraits/women/2.jpg',
          content: '你的数据库设计需要改进，特别是在关系模型的设计上。建议重新学习ER图和范式理论。',
          date: '2025-03-14',
          type: 'suggestion'
        },
        {
          id: 3,
          studentId: '2025004',
          studentName: '赵六',
          studentAvatar: 'https://randomuser.me/api/portraits/women/4.jpg',
          content: '你最近的出勤率较低，请注意按时参加课程和实验。',
          date: '2025-03-10',
          type: 'warning'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAdd = () => {
    setEditingFeedback(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Feedback) => {
    setEditingFeedback(record);
    form.setFieldsValue({
      studentId: record.studentId,
      content: record.content,
      type: record.type
    });
    setModalVisible(true);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条反馈吗？',
      onOk() {
        setFeedbacks(feedbacks.filter(feedback => feedback.id !== id));
      }
    });
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      const student = {
        '2025001': { name: '张三', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
        '2025002': { name: '李四', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
        '2025003': { name: '王五', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
        '2025004': { name: '赵六', avatar: 'https://randomuser.me/api/portraits/women/4.jpg' }
      }[values.studentId];
      
      const formattedValues = {
        ...values,
        studentName: student.name,
        studentAvatar: student.avatar,
        date: new Date().toISOString().split('T')[0]
      };
      
      if (editingFeedback) {
        // 更新现有反馈
        setFeedbacks(feedbacks.map(feedback => 
          feedback.id === editingFeedback.id ? { ...feedback, ...formattedValues } : feedback
        ));
      } else {
        // 添加新反馈
        const newFeedback = {
          id: Math.max(0, ...feedbacks.map(f => f.id)) + 1,
          ...formattedValues
        };
        setFeedbacks([...feedbacks, newFeedback]);
      }
      
      setModalVisible(false);
    });
  };

  const columns = [
    {
      title: '学生',
      key: 'student',
      render: (_, record: Feedback) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar src={record.studentAvatar} icon={<UserOutlined />} style={{ marginRight: 8 }} />
          <div>
            <div>{record.studentName}</div>
            <div style={{ fontSize: '12px', color: '#999' }}>学号: {record.studentId}</div>
          </div>
        </div>
      ),
    },
    {
      title: '反馈内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeMap: Record<string, { color: string, text: string }> = {
          praise: { color: 'success', text: '表扬' },
          suggestion: { color: 'processing', text: '建议' },
          warning: { color: 'warning', text: '警告' }
        };
        const { color, text } = typeMap[type] || { color: 'default', text: '其他' };
        return <Tag color={color}>{text}</Tag>;
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Feedback) => (
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
        <Title level={3}>反馈管理</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          添加反馈
        </Button>
      </div>
      
      <Card>
        <Table 
          columns={columns} 
          dataSource={feedbacks} 
          rowKey="id" 
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
      
      <Modal
        title={editingFeedback ? '编辑反馈' : '添加反馈'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="studentId"
            label="学生"
            rules={[{ required: true, message: '请选择学生' }]}
          >
            <Select placeholder="请选择学生">
              <Option value="2025001">张三 (2025001)</Option>
              <Option value="2025002">李四 (2025002)</Option>
              <Option value="2025003">王五 (2025003)</Option>
              <Option value="2025004">赵六 (2025004)</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="content"
            label="反馈内容"
            rules={[{ required: true, message: '请输入反馈内容' }]}
          >
            <TextArea rows={4} placeholder="请输入反馈内容" />
          </Form.Item>
          
          <Form.Item
            name="type"
            label="反馈类型"
            rules={[{ required: true, message: '请选择反馈类型' }]}
          >
            <Select placeholder="请选择反馈类型">
              <Option value="praise">表扬</Option>
              <Option value="suggestion">建议</Option>
              <Option value="warning">警告</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FeedbackManagement; 