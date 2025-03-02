import React, { useState, useEffect } from 'react';
import { Card, List, Input, Button, message, Typography, Tabs, Select, Avatar, Divider, Space } from 'antd';
import { UserOutlined, CommentOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

interface Student {
  id: number;
  username: string;
  avatar: string;
}

interface Feedback {
  id: number;
  studentId: number;
  feedback: string;
  timestamp: string;
  teacherFeedback?: string;
}

const TeacherFeedback: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [replying, setReplying] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const token = localStorage.getItem('token');
  
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    
    fetchClasses();
  }, [token, navigate]);
  
  const fetchClasses = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/class/list', {
        params: { token }
      });
      
      if (response.data.status === 200) {
        setClasses(response.data.classes);
        if (response.data.classes.length > 0) {
          setSelectedClass(response.data.classes[0].id);
          fetchStudents(response.data.classes[0].id);
        }
      } else {
        message.error('获取班级列表失败');
      }
    } catch (error) {
      message.error('获取班级列表时发生错误');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchStudents = async (classId: number) => {
    setLoading(true);
    try {
      const response = await axios.get('/api/teacher/class/students', {
        params: { token, classId }
      });
      
      if (response.data.status === 200) {
        setStudents(response.data.students);
      } else {
        message.error('获取学生列表失败');
      }
    } catch (error) {
      message.error('获取学生列表时发生错误');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchFeedbacks = async (studentId: number) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/teacher/student/${studentId}/feedbacks`, {
        params: { token }
      });
      
      if (response.data.status === 200) {
        setFeedbacks(response.data.feedbacks);
      } else {
        message.error('获取反馈列表失败');
      }
    } catch (error) {
      message.error('获取反馈列表时发生错误');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleClassChange = (classId: number) => {
    setSelectedClass(classId);
    fetchStudents(classId);
    setFeedbacks([]);
  };
  
  const handleStudentSelect = (studentId: number) => {
    fetchFeedbacks(studentId);
  };
  
  const handleReply = (feedbackId: number) => {
    setReplying(feedbackId);
    setReplyContent('');
  };
  
  const submitReply = async (feedbackId: number, studentId: number) => {
    if (!replyContent.trim()) {
      message.warning('请输入回复内容');
      return;
    }
    
    setSubmitting(true);
    try {
      const response = await axios.post(`/api/teacher/student/${studentId}/feedback/${feedbackId}/reply`, {
        token,
        feedback: replyContent
      });
      
      if (response.data.status === 200) {
        message.success('回复提交成功');
        setReplying(null);
        fetchFeedbacks(studentId);
      } else {
        message.error('回复提交失败');
      }
    } catch (error) {
      message.error('提交回复时发生错误');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>学生反馈管理</Title>
      
      <Card style={{ marginBottom: '20px' }}>
        <Space>
          <Text strong>选择班级：</Text>
          <Select
            style={{ width: 200 }}
            value={selectedClass}
            onChange={handleClassChange}
            loading={loading}
          >
            {classes.map(cls => (
              <Option key={cls.id} value={cls.id}>{cls.className}</Option>
            ))}
          </Select>
        </Space>
      </Card>
      
      <div style={{ display: 'flex', gap: '20px' }}>
        <Card title="学生列表" style={{ width: 300 }}>
          <List
            loading={loading}
            dataSource={students}
            renderItem={student => (
              <List.Item 
                onClick={() => handleStudentSelect(student.id)}
                style={{ cursor: 'pointer' }}
              >
                <List.Item.Meta
                  avatar={student.avatar ? <Avatar src={student.avatar} /> : <Avatar icon={<UserOutlined />} />}
                  title={student.username}
                />
              </List.Item>
            )}
            locale={{ emptyText: '暂无学生' }}
          />
        </Card>
        
        <Card title="反馈列表" style={{ flex: 1 }}>
          <List
            loading={loading}
            dataSource={feedbacks}
            renderItem={item => (
              <Card style={{ marginBottom: 16 }}>
                <Paragraph>
                  <Text strong>反馈内容：</Text> {item.feedback}
                </Paragraph>
                <Text type="secondary">提交时间：{new Date(item.timestamp).toLocaleString()}</Text>
                
                {item.teacherFeedback && (
                  <div style={{ marginTop: 16, background: '#f5f5f5', padding: 12, borderRadius: 4 }}>
                    <Text strong>您的回复：</Text>
                    <Paragraph>{item.teacherFeedback}</Paragraph>
                  </div>
                )}
                
                {!item.teacherFeedback && (
                  <div style={{ marginTop: 16 }}>
                    {replying === item.id ? (
                      <>
                        <TextArea
                          rows={3}
                          value={replyContent}
                          onChange={e => setReplyContent(e.target.value)}
                          placeholder="输入回复内容..."
                        />
                        <div style={{ marginTop: 8, textAlign: 'right' }}>
                          <Button 
                            onClick={() => setReplying(null)}
                            style={{ marginRight: 8 }}
                          >
                            取消
                          </Button>
                          <Button 
                            type="primary"
                            loading={submitting}
                            onClick={() => submitReply(item.id, item.studentId)}
                          >
                            提交回复
                          </Button>
                        </div>
                      </>
                    ) : (
                      <Button 
                        type="link" 
                        icon={<CommentOutlined />}
                        onClick={() => handleReply(item.id)}
                      >
                        回复
                      </Button>
                    )}
                  </div>
                )}
              </Card>
            )}
            pagination={{
              pageSize: 5,
              simple: true
            }}
            locale={{ emptyText: '请选择学生查看反馈' }}
          />
        </Card>
      </div>
    </div>
  );
};

export default TeacherFeedback; 