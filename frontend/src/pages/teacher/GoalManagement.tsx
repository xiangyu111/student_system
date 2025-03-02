import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, DatePicker, Typography, Space, Tag, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface Goal {
  id: number;
  goalName: string;
  description: string;
  dueDate: string;
  targetStudents: string[];
  status: string;
}

const GoalManagement: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  useEffect(() => {
    // 模拟获取目标数据
    setTimeout(() => {
      setGoals([
        {
          id: 1,
          goalName: '完成Java基础课程',
          description: '所有学生需要完成Java基础课程的学习和测验',
          dueDate: '2025-04-15',
          targetStudents: ['全部'],
          status: 'in_progress'
        },
        {
          id: 2,
          goalName: '数据库设计项目',
          description: '完成一个简单的数据库设计项目，包括ER图和SQL实现',
          dueDate: '2025-05-01',
          targetStudents: ['2025001', '2025002', '2025003'],
          status: 'pending'
        },
        {
          id: 3,
          goalName: 'Web开发基础',
          description: '学习HTML、CSS和JavaScript基础',
          dueDate: '2025-03-30',
          targetStudents: ['2025004'],
          status: 'completed'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAdd = () => {
    setEditingGoal(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Goal) => {
    setEditingGoal(record);
    form.setFieldsValue({
      ...record,
      dueDate: moment(record.dueDate),
      targetStudents: record.targetStudents
    });
    setModalVisible(true);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个学习目标吗？',
      onOk() {
        setGoals(goals.filter(goal => goal.id !== id));
      }
    });
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      const formattedValues = {
        ...values,
        dueDate: values.dueDate.format('YYYY-MM-DD')
      };
      
      if (editingGoal) {
        // 更新现有目标
        setGoals(goals.map(goal => 
          goal.id === editingGoal.id ? { ...goal, ...formattedValues } : goal
        ));
      } else {
        // 添加新目标
        const newGoal = {
          id: Math.max(0, ...goals.map(g => g.id)) + 1,
          ...formattedValues
        };
        setGoals([...goals, newGoal]);
      }
      
      setModalVisible(false);
    });
  };

  const columns = [
    {
      title: '目标名称',
      dataIndex: 'goalName',
      key: 'goalName',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '截止日期',
      dataIndex: 'dueDate',
      key: 'dueDate',
    },
    {
      title: '目标学生',
      dataIndex: 'targetStudents',
      key: 'targetStudents',
      render: (students: string[]) => (
        <>
          {students.map(student => (
            <Tag key={student}>{student}</Tag>
          ))}
        </>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap: Record<string, { color: string, text: string }> = {
          pending: { color: 'default', text: '未开始' },
          in_progress: { color: 'processing', text: '进行中' },
          completed: { color: 'success', text: '已完成' },
          overdue: { color: 'error', text: '已逾期' }
        };
        const { color, text } = statusMap[status] || { color: 'default', text: '未知' };
        return <Tag color={color}>{text}</Tag>;
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Goal) => (
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
        <Title level={3}>目标管理</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          添加目标
        </Button>
      </div>
      
      <Card>
        <Table 
          columns={columns} 
          dataSource={goals} 
          rowKey="id" 
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
      
      <Modal
        title={editingGoal ? '编辑学习目标' : '添加学习目标'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="goalName"
            label="目标名称"
            rules={[{ required: true, message: '请输入目标名称' }]}
          >
            <Input placeholder="请输入目标名称" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="目标描述"
          >
            <TextArea rows={4} placeholder="请输入目标描述" />
          </Form.Item>
          
          <Form.Item
            name="dueDate"
            label="截止日期"
            rules={[{ required: true, message: '请选择截止日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            name="targetStudents"
            label="目标学生"
            rules={[{ required: true, message: '请选择目标学生' }]}
          >
            <Select 
              mode="multiple" 
              placeholder="请选择目标学生"
              optionLabelProp="label"
            >
              <Option value="全部" label="全部学生">全部学生</Option>
              <Option value="2025001" label="张三 (2025001)">张三 (2025001)</Option>
              <Option value="2025002" label="李四 (2025002)">李四 (2025002)</Option>
              <Option value="2025003" label="王五 (2025003)">王五 (2025003)</Option>
              <Option value="2025004" label="赵六 (2025004)">赵六 (2025004)</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择状态">
              <Option value="pending">未开始</Option>
              <Option value="in_progress">进行中</Option>
              <Option value="completed">已完成</Option>
              <Option value="overdue">已逾期</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default GoalManagement; 