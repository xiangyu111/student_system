import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Divider, Typography, Progress, List, Tag } from 'antd';
import { BookOutlined, ClockCircleOutlined, TrophyOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { getProgress } from '../../services/activityService';

const { Title, Paragraph } = Typography;

interface ActivityData {
  type: string;
  count: number;
  hours: number;
}

interface GoalData {
  id: number;
  name: string;
  progress: number;
  status: string;
}

const Analytics: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [totalHours, setTotalHours] = useState<number>(0);
  const [totalActivities, setTotalActivities] = useState<number>(0);
  const [goals, setGoals] = useState<GoalData[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await getProgress(token);
      if (response.status === 200) {
        // 处理活动数据
        setActivityData(response.activityData || []);
        setTotalHours(response.totalHours || 0);
        setTotalActivities(response.totalActivities || 0);
        
        // 处理目标数据
        setGoals(response.goals || []);
      }
    } catch (error) {
      console.error('获取数据出错:', error);
    } finally {
      setLoading(false);
    }
  };

  // 模拟数据（如果后端未提供）
  useEffect(() => {
    if (!loading && activityData.length === 0) {
      setActivityData([
        { type: '阅读', count: 12, hours: 24 },
        { type: '课程', count: 8, hours: 16 },
        { type: '研究', count: 5, hours: 15 },
        { type: '实践', count: 7, hours: 21 }
      ]);
      setTotalHours(76);
      setTotalActivities(32);
      
      setGoals([
        { id: 1, name: '完成Java课程学习', progress: 75, status: 'in_progress' },
        { id: 2, name: '阅读5本专业书籍', progress: 40, status: 'in_progress' },
        { id: 3, name: '完成数据库实验', progress: 100, status: 'completed' }
      ]);
    }
  }, [loading, activityData]);

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'completed':
        return <Tag color="success">已完成</Tag>;
      case 'in_progress':
        return <Tag color="processing">进行中</Tag>;
      case 'not_started':
        return <Tag color="default">未开始</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  return (
    <>
      <Title level={2}>学习数据分析</Title>
      
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="总学习时长"
              value={totalHours}
              suffix="小时"
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="学习活动数"
              value={totalActivities}
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="完成目标数"
              value={goals.filter(g => g.status === 'completed').length}
              prefix={<TrophyOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Divider orientation="left">学习活动分布</Divider>
      <Row gutter={16}>
        {activityData.map((item, index) => (
          <Col span={6} key={index}>
            <Card>
              <Statistic
                title={`${item.type}活动`}
              
                value={item.count}
                suffix="次"
              />
              <Paragraph style={{ marginTop: 10 }}>
                总时长: {item.hours} 小时
              </Paragraph>
            </Card>
          </Col>
        ))}
      </Row>

      <Divider orientation="left">学习目标进度</Divider>
      <List
        bordered
        dataSource={goals}
        renderItem={item => (
          <List.Item>
            <div style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{item.name}</span>
                {getStatusTag(item.status)}
              </div>
              <Progress percent={item.progress} status={item.status === 'completed' ? 'success' : 'active'} />
            </div>
          </List.Item>
        )}
      />
   </>
  );
};

export default Analytics; 