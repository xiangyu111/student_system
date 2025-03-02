import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Modal, Form, Input, DatePicker, Select, Typography, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface Activity {
  id: number;
  activityName: string;
  activityType: string;
  description: string;
  startTime: string;
  endTime: string;
  status: string;
}

const Activities: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  // 模拟获取活动数据
  useEffect(() => {
    setLoading(true);
    // 这里应该是从API获取数据
    setTimeout(() => {
      setActivities([
        {
          id: 1,
          activityName: '参加Java编程比赛',
          activityType: 'competition',
          description: '参加校级Java编程比赛，获得二等奖',
          startTime: '2025-03-15 09:00',
          endTime: '2025-03-15 17:00',
          status: 'completed'
        },
        {
          id: 2,
          activityName: '数据库实验课程',
          activityType: 'course',
          description: '完成数据库实验课程的所有实验',
          startTime: '2025-03-01 14:00',
          endTime: '2025-05-30 16:00',
          status: 'in_progress'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAdd = () => {
    setEditingActivity(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Activity) => {
    setEditingActivity(record);
    form.setFieldsValue({
      ...record,
      startTime: moment(record.startTime),
      endTime: moment(record.endTime)
    });
    setModalVisible(true);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个学习活动吗？',
      onOk() {
        setActivities(activities.filter(activity => activity.id !== id));
      }
    });
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      const formattedValues = {
        ...values,
        startTime: values.startTime.format('YYYY-MM-DD HH:mm'),
        endTime: values.endTime.format('YYYY-MM-DD HH:mm')
      };
      
      if (editingActivity) {
        // 更新现有活动
        setActivities(activities.map(activity => 
          activity.id === editingActivity.id ? { ...activity, ...formattedValues } : activity
        ));
      } else {
        // 添加新活动
        const newActivity = {
          id: Math.max(0, ...activities.map(a => a.id)) + 1,
          ...formattedValues
        };
        setActivities([...activities, newActivity]);
      }
      
      setModalVisible(false);
    });
  };

  const columns = [
    {
      title: '活动名称',
      dataIndex: 'activityName',
      key: 'activityName',
    },
    {
      title: '活动类型',
      dataIndex: 'activityType',
      key: 'activityType',
      render: (type: string) => {
        const typeMap: Record<string, { color: string, text: string }> = {
          course: { color: 'blue', text: '课程' },
          competition: { color: 'green', text: '比赛' },
          project: { color: 'purple', text: '项目' },
          other: { color: 'default', text: '其他' }
        };
        const { color, text } = typeMap[type] || { color: 'default', text: '未知' };
        return <Tag color={color}>{text}</Tag>;
      }
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
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
          cancelled: { color: 'error', text: '已取消' }
        };
        const { color, text } = statusMap[status] || { color: 'default', text: '未知' };
        return <Tag color={color}>{text}</Tag>;
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Activity) => (
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
        <Title level={3}>学习活动</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          添加活动
        </Button>
      </div>
      
      <Table 
        columns={columns} 
        dataSource={activities} 
        rowKey="id" 
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
      
      <Modal
        title={editingActivity ? '编辑学习活动' : '添加学习活动'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="activityName"
            label="活动名称"
            rules={[{ required: true, message: '请输入活动名称' }]}
          >
            <Input placeholder="请输入活动名称" />
          </Form.Item>
          
          <Form.Item
            name="activityType"
            label="活动类型"
            rules={[{ required: true, message: '请选择活动类型' }]}
          >
            <Select placeholder="请选择活动类型">
              <Option value="course">课程</Option>
              <Option value="competition">比赛</Option>
              <Option value="project">项目</Option>
              <Option value="other">其他</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="description"
            label="活动描述"
          >
            <TextArea rows={4} placeholder="请输入活动描述" />
          </Form.Item>
          
          <Form.Item
            name="startTime"
            label="开始时间"
            rules={[{ required: true, message: '请选择开始时间' }]}
          >
            <DatePicker showTime style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            name="endTime"
            label="结束时间"
            rules={[{ required: true, message: '请选择结束时间' }]}
          >
            <DatePicker showTime style={{ width: '100%' }} />
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
              <Option value="cancelled">已取消</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Activities; 