import React, { useState, useEffect } from 'react';
import { Card, Progress as AntProgress, Row, Col, Statistic, Typography, List, Tag, Spin, message } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, TrophyOutlined, BookOutlined } from '@ant-design/icons';
import { getProgress } from '../../services/activityService';

const { Title } = Typography;

interface ProgressData {
  overallProgress: number;
  totalActivities: number;
  completedActivities: number;
  totalGoals: number;
  completedGoals: number;
  recentActivities: Array<{
    id: number;
    name: string;
    type: string;
    startTime: string;
    endTime: string;
    status: string;
  }>;
  pendingGoals: Array<{
    id: number;
    name: string;
    description: string;
    dueDate: string;
    status: string;
    priority: number;
  }>;
}

const Progress: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [progressData, setProgressData] = useState<ProgressData | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          message.error('请先登录');
          return;
        }

        const response = await getProgress(token);
        if (response.status === 200) {
          setProgressData(response.data);
        } else {
          message.error(response.message || '获取进度数据失败');
        }
      } catch (error) {
        console.error('获取进度数据出错:', error);
        message.error('获取进度数据失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'completed':
        return <Tag color="success">已完成</Tag>;
      case 'in_progress':
        return <Tag color="processing">进行中</Tag>;
      case 'pending':
        return <Tag color="warning">待开始</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  const getPriorityTag = (priority: number) => {
    switch (priority) {
      case 1:
        return <Tag color="red">高</Tag>;
      case 2:
        return <Tag color="orange">中</Tag>;
      case 3:
        return <Tag color="blue">低</Tag>;
      default:
        return <Tag color="default">普通</Tag>;
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Title level={2}>学习进度</Title>
      
      <Card className="dashboard-card">
        <Row gutter={24}>
          <Col span={8}>
            <Card>
              <Statistic
                title="总体完成进度"
                value={progressData?.overallProgress || 0}
                suffix="%"
                valueStyle={{ color: '#3f8600' }}
              />
              <AntProgress percent={progressData?.overallProgress || 0} status="active" />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="学习活动"
                value={progressData?.completedActivities || 0}
                suffix={`/ ${progressData?.totalActivities || 0}`}
                valueStyle={{ color: '#1890ff' }}
                prefix={<BookOutlined />}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="学习目标"
                value={progressData?.completedGoals || 0}
                suffix={`/ ${progressData?.totalGoals || 0}`}
                valueStyle={{ color: '#722ed1' }}
                prefix={<TrophyOutlined />}
              />
            </Card>
          </Col>
        </Row>
      </Card>
      
      <Row gutter={24}>
        <Col span={12}>
          <Card title="最近活动" className="dashboard-card">
            <List
              dataSource={progressData?.recentActivities || []}
              renderItem={item => (
                <List.Item
                  actions={[getStatusTag(item.status)]}
                >
                  <List.Item.Meta
                    title={item.name}
                    description={`类型: ${item.type} | 开始时间: ${new Date(item.startTime).toLocaleString()}`}
                  />
                </List.Item>
              )}
              locale={{ emptyText: '暂无活动记录' }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="待完成目标" className="dashboard-card">
            <List
              dataSource={progressData?.pendingGoals || []}
              renderItem={item => (
                <List.Item
                  actions={[
                    getPriorityTag(item.priority),
                    getStatusTag(item.status)
                  ]}
                >
                  <List.Item.Meta
                    title={item.name}
                    description={`截止日期: ${new Date(item.dueDate).toLocaleDateString()} | ${item.description}`}
                  />
                </List.Item>
              )}
              locale={{ emptyText: '暂无待完成目标' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Progress; 