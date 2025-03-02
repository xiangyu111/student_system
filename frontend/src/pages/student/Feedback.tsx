import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, List, message, Typography, Divider } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;
const { Title, Text } = Typography;

const StudentFeedback: React.FC = () => {
  const [form] = Form.useForm();
  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const token = localStorage.getItem('token');
  
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    
    fetchFeedbackList();
  }, [token, navigate]);
  
  const fetchFeedbackList = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/feedback/list', {
        params: { token }
      });
      
      if (response.data.status === 200) {
        setFeedbackList(response.data.feedbackList);
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
  
  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      const response = await axios.post('/api/feedback/submit', {
        token,
        feedback: values.feedback
      });
      
      if (response.data.status === 200) {
        message.success('反馈提交成功');
        form.resetFields();
        fetchFeedbackList();
      } else {
        message.error('反馈提交失败');
      }
    } catch (error) {
      message.error('提交反馈时发生错误');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>学习反馈</Title>
      
      <Card title="提交反馈" style={{ marginBottom: '20px' }}>
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="feedback"
            label="反馈内容"
            rules={[{ required: true, message: '请输入反馈内容' }]}
          >
            <TextArea rows={4} placeholder="请输入您的学习反馈..." />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={submitting}>
              提交反馈
            </Button>
          </Form.Item>
        </Form>
      </Card>
      
      <Divider />
      
      <Card title="历史反馈">
        <List
          loading={loading}
          dataSource={feedbackList}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={<Text strong>{new Date(item.timestamp).toLocaleString()}</Text>}
                description={item.feedback}
              />
            </List.Item>
          )}
          pagination={{
            pageSize: 5,
            simple: true
          }}
          locale={{ emptyText: '暂无反馈记录' }}
        />
      </Card>
    </div>
  );
};

export default StudentFeedback; 