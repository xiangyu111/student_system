import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Space, Tag, Typography, Card, Avatar, Tooltip } from 'antd';
import { SearchOutlined, UserOutlined, BarChartOutlined, MessageOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

interface Student {
  id: number;
  name: string;
  studentId: string;
  avatar: string;
  progress: number;
  lastActive: string;
  tags: string[];
}

const StudentList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // 模拟获取学生数据
    setTimeout(() => {
      setStudents([
        {
          id: 1,
          name: '张三',
          studentId: '2025001',
          avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
          progress: 85,
          lastActive: '2025-03-15',
          tags: ['优秀', '活跃']
        },
        {
          id: 2,
          name: '李四',
          studentId: '2025002',
          avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
          progress: 65,
          lastActive: '2025-03-14',
          tags: ['需要关注']
        },
        {
          id: 3,
          name: '王五',
          studentId: '2025003',
          avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
          progress: 92,
          lastActive: '2025-03-15',
          tags: ['优秀']
        },
        {
          id: 4,
          name: '赵六',
          studentId: '2025004',
          avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
          progress: 45,
          lastActive: '2025-03-10',
          tags: ['需要关注', '缺勤']
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredStudents = students.filter(
    student => 
      student.name.toLowerCase().includes(searchText.toLowerCase()) ||
      student.studentId.includes(searchText)
  );

  const columns = [
    {
      title: '学生',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Student) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar src={record.avatar} icon={<UserOutlined />} style={{ marginRight: 8 }} />
          <div>
            <div>{text}</div>
            <div style={{ fontSize: '12px', color: '#999' }}>学号: {record.studentId}</div>
          </div>
        </div>
      ),
    },
    {
      title: '学习进度',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress: number) => {
        let color = progress < 60 ? 'red' : progress < 80 ? 'orange' : 'green';
        return <Tag color={color}>{progress}%</Tag>;
      },
      sorter: (a: Student, b: Student) => a.progress - b.progress,
    },
    {
      title: '最近活动',
      dataIndex: 'lastActive',
      key: 'lastActive',
      sorter: (a: Student, b: Student) => new Date(a.lastActive).getTime() - new Date(b.lastActive).getTime(),
    },
    {
      title: '标签',
      key: 'tags',
      dataIndex: 'tags',
      render: (tags: string[]) => (
        <>
          {tags.map(tag => {
            let color = tag === '优秀' ? 'green' : tag === '需要关注' ? 'volcano' : tag === '活跃' ? 'geekblue' : 'red';
            return (
              <Tag color={color} key={tag}>
                {tag}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Student) => (
        <Space size="middle">
          <Tooltip title="查看详情">
            <Button 
              type="text" 
              icon={<BarChartOutlined />} 
              onClick={() => navigate(`/teacher/dashboard/student/${record.id}`)} 
            />
          </Tooltip>
          <Tooltip title="发送反馈">
            <Button 
              type="text" 
              icon={<MessageOutlined />} 
              onClick={() => navigate(`/teacher/dashboard/feedback/${record.id}`)} 
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={3}>学生管理</Title>
        <Input
          placeholder="搜索学生姓名或学号"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          style={{ width: 250 }}
        />
      </div>
      
      <Card>
        <Table 
          columns={columns} 
          dataSource={filteredStudents} 
          rowKey="id" 
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default StudentList; 