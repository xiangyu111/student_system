import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  Table, 
  Tag, 
  Space, 
  Modal, 
  Form, 
  Input, 
  DatePicker, 
  Select, 
  message, 
  Popconfirm 
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons';
import moment from 'moment';
import { getGoals, addGoal, updateGoal, deleteGoal, updateGoalStatus } from '../../services/goalService';

const { Option } = Select;
const { TextArea } = Input;

interface Goal {
  id: number;
  goalName: string;
  goalDescription: string;
  dueDate: string;
  status: string;
  priority: number;
}

const Goals: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('请先登录');
        return;
      }

      const response = await getGoals(token);
      if (response.status === 200) {
        setGoals(response.goals);
      } else {
        message.error(response.message || '获取学习目标失败');
      }
    } catch (error) {
      console.error('获取学习目标出错:', error);
      message.error('获取学习目标失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = () => {
    form.resetFields();
    setEditingGoal(null);
    setModalVisible(true);
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    form.setFieldsValue({
      goalName: goal.goalName,
      goalDescription: goal.goalDescription,
      dueDate: moment(goal.dueDate),
      priority: goal.priority,
    });
    setModalVisible(true);
  };

  const handleDeleteGoal = async (goalId: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('请先登录');
        return;
      }

      const response = await deleteGoal(token, goalId);
      if (response.status === 200) {
        message.success('删除学习目标成功');
        fetchGoals();
      } else {
        message.error(response.message || '删除学习目标失败');
      }
    } catch (error) {
      console.error('删除学习目标出错:', error);
      message.error('删除学习目标失败，请稍后重试');
    }
  };

  const handleCompleteGoal = async (goalId: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('请先登录');
        return;
      }

      const response = await updateGoalStatus(token, goalId, 'completed');
      if (response.status === 200) {
        message.success('标记学习目标为已完成');
        fetchGoals();
      } else {
        message.error(response.message || '更新学习目标状态失败');
      }
    } catch (error) {
      console.error('更新学习目标状态出错:', error);
      message.error('更新学习目标状态失败，请稍后重试');
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

      if (editingGoal) {
        // 更新目标
        const response = await updateGoal(
          token,
          editingGoal.id,
          values.goalName,
          values.goalDescription,
          values.dueDate.format('YYYY-MM-DD'),
          values.priority
        );
        if (response.status === 200) {
          message.success('更新学习目标成功');
          setModalVisible(false);
          fetchGoals();
        } else {
          message.error(response.message || '更新学习目标失败');
        }
      } else {
        // 添加目标
        const response = await addGoal(
          token,
          values.goalName,
          values.goalDescription,
          values.dueDate.format('YYYY-MM-DD'),
          values.priority
        );
        if (response.status === 200) {
          message.success('添加学习目标成功');
          setModalVisible(false);
          fetchGoals();
        } else {
          message.error(response.message || '添加学习目标失败');
        }
      }
    } catch (error) {
      console.error('提交学习目标出错:', error);
    }
  };

  const columns = [
    {
      title: '目标名称',
      dataIndex: 'goalName',
      key: 'goalName',
    },
    {
      title: '描述',
      dataIndex: 'goalDescription',
      key: 'goalDescription',
      ellipsis: true,
    },
    {
      title: '截止日期',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (text: string) => moment(text).format('YYYY-MM-DD'),
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: number) => {
        let color = 'blue';
        let text = '低';
        if (priority === 1) {
          color = 'red';
          text = '高';
        } else if (priority === 2) {
          color = 'orange';
          text = '中';
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'default';
        let text = status;
        if (status === 'completed') {
          color = 'success';
          text = '已完成';
        } else if (status === 'pending') {
          color = 'warning';
          text = '待完成';
        } else if (status === 'in_progress') {
          color = 'processing';
          text = '进行中';
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Goal) => (
        <Space size="middle">
          {record.status !== 'completed' && (
            <Button 
              type="link" 
              icon={<CheckOutlined />} 
              onClick={() => handleCompleteGoal(record.id)}
            >
              完成
            </Button>
          )}
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => handleEditGoal(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个学习目标吗？"
            onConfirm={() => handleDeleteGoal(record.id)}
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
    <div className="goals-container">
      <Card 
        title="我的学习目标" 
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleAddGoal}
          >
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
        title={editingGoal ? '编辑学习目标' : '添加学习目标'}
        visible={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        okText="保存"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="goalName"
            label="目标名称"
            rules={[{ required: true, message: '请输入目标名称' }]}
          >
            <Input placeholder="请输入目标名称" />
          </Form.Item>
          <Form.Item
            name="goalDescription"
            label="目标描述"
            rules={[{ required: true, message: '请输入目标描述' }]}
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
            name="priority"
            label="优先级"
            rules={[{ required: true, message: '请选择优先级' }]}
          >
            <Select placeholder="请选择优先级">
              <Option value={1}>高</Option>
              <Option value={2}>中</Option>
              <Option value={3}>低</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Goals; 