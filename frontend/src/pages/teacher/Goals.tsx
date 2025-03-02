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
  DatePicker, 
  message, 
  Popconfirm,
  Tag,
  Progress
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface Goal {
  id: number;
  studentId: number;
  studentName: string;
  goalName: string;
  description: string;
  startDate: string;
  endDate: string;
  priority: string;
  status: string;
  progress: number;
}

interface Student {
  id: number;
  name: string;
}

const Goals: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>('添加目标');
  const [form] = Form.useForm();
  const [editingGoalId, setEditingGoalId] = useState<number | null>(null);

  useEffect(() => {
    // 模拟数据加载
    setLoading(false);
    setGoals([
      {
        id: 1,
        studentId: 1,
        studentName: '张三',
        goalName: '完成Java课程学习',
        description: '学习Java基础知识和高级特性',
        startDate: '2023-01-01',
        endDate: '2023-03-31',
        priority: 'high',
        status: 'in_progress',
        progress: 60
      },
      {
        id: 2,
        studentId: 2,
        studentName: '李四',
        goalName: '完成数据库课程',
        description: '学习SQL和数据库设计',
        startDate: '2023-02-01',
        endDate: '2023-04-30',
        priority: 'medium',
        status: 'not_started',
        progress: 0
      }
    ]);
    
    setStudents([
      { id: 1, name: '张三' },
      { id: 2, name: '李四' },
      { id: 3, name: '王五' }
    ]);
  }, []);

  const handleAdd = () => {
    setModalTitle('添加目标');
    setEditingGoalId(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (goal: Goal) => {
    setModalTitle('编辑目标');
    setEditingGoalId(goal.id);
    form.setFieldsValue({
      studentId: goal.studentId,
      goalName: goal.goalName,
      description: goal.description,
      dateRange: [moment(goal.startDate), moment(goal.endDate)],
      priority: goal.priority,
      status: goal.status,
      progress: goal.progress
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    // 模拟删除操作
    setGoals(goals.filter(goal => goal.id !== id));
    message.success('删除目标成功');
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      // 处理日期范围
      const startDate = values.dateRange[0].format('YYYY-MM-DD');
      const endDate = values.dateRange[1].format('YYYY-MM-DD');
      
      const goalData = {
        ...values,
        startDate,
        endDate
      };
      delete goalData.dateRange;
      
      // 模拟添加或更新操作
      if (editingGoalId === null) {
        // 添加目标
        const newGoal = {
          id: Math.max(...goals.map(g => g.id), 0) + 1,
          ...goalData,
          studentName: students.find(s => s.id === goalData.studentId)?.name || ''
        };
        setGoals([...goals, newGoal]);
        message.success('添加目标成功');
      } else {
        // 更新目标
        const updatedGoals = goals.map(goal => 
          goal.id === editingGoalId 
            ? { 
                ...goal, 
                ...goalData,
                studentName: students.find(s => s.id === goalData.studentId)?.name || goal.studentName
              } 
            : goal
        );
        setGoals(updatedGoals);
        message.success('更新目标成功');
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
      title: '学生',
      dataIndex: 'studentName',
      key: 'studentName',
    },
    {
      title: '目标名称',
      dataIndex: 'goalName',
      key: 'goalName',
    },
    {
      title: '开始日期',
      dataIndex: 'startDate',
      key: 'startDate',
    },
    {
      title: '结束日期',
      dataIndex: 'endDate',
      key: 'endDate',
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => {
        let color = 'blue';
        let text = '普通';
        switch (priority) {
          case 'high':
            color = 'red';
            text = '高';
            break;
          case 'medium':
            color = 'orange';
            text = '中';
            break;
          case 'low':
            color = 'green';
            text = '低';
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
        let color = 'blue';
        let text = '未知';
        switch (status) {
          case 'completed':
            color = 'green';
            text = '已完成';
            break;
          case 'in_progress':
            color = 'blue';
            text = '进行中';
            break;
          case 'not_started':
            color = 'orange';
            text = '未开始';
            break;
        }
        return <Tag color={color}>{text}</Tag>;
      }
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress: number) => <Progress percent={progress} size="small" />,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Goal) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除该目标吗？"
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
        title="目标管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加目标
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={goals}
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
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="studentId"
            label="学生"
            rules={[{ required: true, message: '请选择学生' }]}
          >
            <Select placeholder="选择学生">
              {students.map(student => (
                <Option key={student.id} value={student.id}>{student.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="goalName"
            label="目标名称"
            rules={[{ required: true, message: '请输入目标名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="目标描述"
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="dateRange"
            label="目标时间范围"
            rules={[{ required: true, message: '请选择目标时间范围' }]}
          >
            <RangePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item
            name="priority"
            label="优先级"
            rules={[{ required: true, message: '请选择优先级' }]}
          >
            <Select placeholder="选择优先级">
              <Option value="high">高</Option>
              <Option value="medium">中</Option>
              <Option value="low">低</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="选择状态">
              <Option value="not_started">未开始</Option>
              <Option value="in_progress">进行中</Option>
              <Option value="completed">已完成</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="progress"
            label="进度"
            rules={[{ required: true, message: '请输入进度' }]}
          >
            <Progress
              type="line"
              percent={form.getFieldValue('progress') || 0}
              style={{ marginBottom: 10 }}
            />
            <Input
              type="range"
              min={0}
              max={100}
              value={form.getFieldValue('progress') || 0}
              onChange={(e) => form.setFieldsValue({ progress: parseInt(e.target.value) })}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Goals; 