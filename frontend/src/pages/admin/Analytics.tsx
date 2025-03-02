import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Divider, Typography, Table, Tag } from 'antd';
import { UserOutlined, BookOutlined, FileTextOutlined, TeamOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface ActivityRecord {
  id: number;
  studentName: string;
  activityType: string;
  activityName: string;
  startTime: string;
  duration: number;
}

const Analytics: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [activityRecords, setActivityRecords] = useState<ActivityRecord[]>([]);

  useEffect(() => {
    // 模拟数据加载
    setTimeout(() => {
      setActivityRecords([
        {
          id: 1,
          studentName: '张三',
          activityType: 'reading',
          activityName: '阅读《Java编程思想》',
          startTime: '2023-01-15 14:30',
          duration: 120
        },
        {
          id: 2,
          studentName: '李四',
          activityType: 'course',
          activityName: '参加数据库课程',
          startTime: '2023-01-16 09:00',
          duration: 90
        },
        {
          id: 3,
          studentName: '王五',
          activityType: 'research',
          activityName: '参与机器学习研究',
          startTime: '2023-01-17 13:00',
          duration: 180
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

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
        let text = '未知';
        switch (type) {
          case 'reading':
            color = 'green';
            text = '阅读';
            break;
          case 'course':
            color = 'blue';
            text = '课程';
            break;
          case 'research':
            color = 'purple';
            text = '研究';
            break;
          case 'practice':
            color = 'orange';
            text = '实践';
            break;
        }
        return <Tag color={color}>{text}</Tag>;
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
      title: '时长(分钟)',
      dataIndex: 'duration',
      key: 'duration',
    }
  ];

  return (
    <div>
      <Card title="系统数据分析">
        <Row gutter={16}>
          <Col span={6}>
            <Statistic
              title="用户总数"
              value={256}
              prefix={<UserOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="学生数量"
              value={200}
              prefix={<TeamOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="资源总数"
              value={120}
              prefix={<BookOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="活动记录"
              value={1580}
              prefix={<FileTextOutlined />}
            />
          </Col>
        </Row>

        <Divider orientation="left">系统概况</Divider>
        <Paragraph>
          本系统目前共有256名用户，其中包括200名学生、50名教师和6名管理员。系统中共有120个学习资源，
          涵盖课程、文章、研究资料等多种类型。学生们共记录了1580条学习活动，平均每名学生有7.9条记录。
        </Paragraph>

        <Divider orientation="left">最近活动记录</Divider>
        <Table
          columns={columns}
          dataSource={activityRecords}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default Analytics; 