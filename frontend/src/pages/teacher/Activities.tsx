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
  InputNumber
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getAllActivities, addActivity, updateActivity, deleteActivity } from '../../services/activityService';
import { getStudents } from '../../services/studentService';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface Activity {
  id: number;
  studentId: number;
  studentName: string;
  activityType: string;
  activityName: string;
  description: string;
  startTime: string;
  endTime: string;
  duration: number;
  location: string;
  status: string;
}

interface Student {
  id: number;
  name: string;
}

const Activities: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>('添加活动');
  const [form] = Form.useForm();
  const [editingActivityId, setEditingActivityId] = useState<number | null>(null);

  useEffect(() => {
    fetchActivities();
    fetchStudents();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('请先登录');
        return;
      }

      const response = await getAllActivities(token);
      if (response.status === 200) {
        setActivities(response.activities);
      } else {
        message.error(response.message || '获取活动列表失败');
      }
    } catch (error) {
      console.error('获取活动列表出错:', error);
      message.error('获取活动列表失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await getStudents(token);
      if (response.status === 200) {
        setStudents(response.students);
      }
    } catch (error) {
      console.error('获取学生列表出错:', error);
    }
  };

  const handleAdd = () => {
    setModalTitle('添加活动');
    setEditingActivityId(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (activity: Activity) => {
    setModalTitle('编辑活动');
    setEditingActivityId(activity.id);
    form.setFieldsValue({
      studentId: activity.studentId,
      activityType: activity.activityType,
      activityName: activity.activityName,
      description: activity.description,
      timeRange: [moment(activity.startTime), moment(activity.endTime)],
      location: activity.location,
      status: activity.status
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

      const response = await deleteActivity(token, id);
      if (response.status === 200) {
        message.success('删除活动成功');
        fetchActivities();
      } else {
        message.error(response.message || '删除活动失败');
      }
    } catch (error) {
      console.error('删除活动出错:', error);
      message.error('删除活动失败，请稍后重试');
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

      // 处理时间范围
      const startTime = values.timeRange[0].format('YYYY-MM-DD HH:mm:ss');
      const endTime = values.timeRange[1].format('YYYY-MM-DD HH:mm:ss');
      const duration = values.timeRange[1].diff(values.timeRange[0], 'minutes');

      const activityData = {
        ...values,
        startTime,
        endTime,
        duration,
        token
      };
      delete activityData.timeRange;

      if (editingActivityId === null) {
        // 添加活动
        const response = await addActivity(activityData);
        if (response.status === 200) {
          message.success('添加活动成功');
          setModalVisible(false);
          fetchActivities();
        } else {
          message.error(response.message || '添加活动失败');
        }
      } else {
        // 更新活动
        const response = await updateActivity(editingActivityId, activityData);
        if (response.status === 200) {
          message.success('更新活动成功');
          setModalVisible(false);
          fetchActivities();
        } else {
          message.error(response.message || '更新活动失败');
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
      title: '学生',
      dataIndex: 'studentName',
      key: 'studentName',
    },
    {
      title: '活动类型',
      dataIndex: 'activityType',
      key: 'activityType',
      render: (type: string) => {
        let color = 'blue';
        switch (type) {
          case 'reading':
            color = 'green';
            break;
          case 'course':
            color = 'blue';
            break;
          case 'research':
            color = 'purple';
            break;
          case 'practice':
            color = 'orange';
            break;
          default:
            color = 'default';
        }
        return <Tag color={color}>{type}</Tag>;
      }
    },
    {
      title: '活动名称',
      dataIndex: 'activityName',
      key: 'activityName',
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
      title: '时长(分钟)',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: '地点',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'completed' ? 'green' : status === 'ongoing' ? 'blue' : 'orange'}>
          {status === 'completed' ? '已完成' : status === 'ongoing' ? '进行中' : '计划中'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Activity) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除该活动吗？"
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
        title="活动管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加活动
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={activities}
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
            name="activityType"
            label="活动类型"
            rules={[{ required: true, message: '请选择活动类型' }]}
          >
            <Select placeholder="选择活动类型">
              <Option value="reading">阅读</Option>
              <Option value="course">课程</Option>
              <Option value="research">研究</Option>
              <Option value="practice">实践</Option>
              <Option value="other">其他</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="activityName"
            label="活动名称"
            rules={[{ required: true, message: '请输入活动名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="活动描述"
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="timeRange"
            label="活动时间"
            rules={[{ required: true, message: '请选择活动时间' }]}
          >
            <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
          </Form.Item>
          <Form.Item
            name="location"
            label="活动地点"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="status"
            label="活动状态"
            rules={[{ required: true, message: '请选择活动状态' }]}
          >
            <Select placeholder="选择活动状态">
              <Option value="planned">计划中</Option>
              <Option value="ongoing">进行中</Option>
              <Option value="completed">已完成</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Activities; 