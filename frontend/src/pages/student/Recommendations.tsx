import React, { useState, useEffect } from 'react';
import { Card, List, Rate, Input, Button, message, Typography, Tag, Space, Modal } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;

const StudentRecommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [currentResource, setCurrentResource] = useState<any>(null);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const token = localStorage.getItem('token');
  
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    
    fetchRecommendations();
  }, [token, navigate]);
  
  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/recommendation/get', {
        params: { token }
      });
      
      if (response.data.status === 200) {
        setRecommendations(response.data.recommendations);
      } else {
        message.error('获取推荐资源失败');
      }
    } catch (error) {
      message.error('获取推荐资源时发生错误');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleFeedback = (resource: any) => {
    setCurrentResource(resource);
    setFeedbackVisible(true);
    setFeedback('');
    setRating(0);
  };
  
  const submitFeedback = async () => {
    if (rating === 0) {
      message.warning('请先进行评分');
      return;
    }
    
    setSubmitting(true);
    try {
      const response = await axios.post('/api/recommendation/feedback', {
        token,
        resourceId: currentResource.resourceId,
        feedback,
        rating
      });
      
      if (response.data.status === 200) {
        message.success('反馈提交成功');
        setFeedbackVisible(false);
        fetchRecommendations();
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
  
  const getResourceTypeColor = (type: string) => {
    switch (type) {
      case '视频':
        return 'blue';
      case '文章':
        return 'green';
      case '课程':
        return 'purple';
      default:
        return 'default';
    }
  };
  
  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>个性化学习推荐</Title>
      
      <List
        grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 3, xl: 3, xxl: 4 }}
        dataSource={recommendations}
        loading={loading}
        renderItem={(item) => (
          <List.Item>
            <Card
              title={item.resourceName}
              extra={<Tag color={getResourceTypeColor(item.resourceType)}>{item.resourceType}</Tag>}
              actions={[
                <Button type="link" href={item.link} target="_blank" icon={<LinkOutlined />}>访问资源</Button>,
                <Button type="link" onClick={() => handleFeedback(item)}>提交反馈</Button>
              ]}
            >
              <Paragraph ellipsis={{ rows: 3, expandable: true, symbol: '更多' }}>
                {item.description}
              </Paragraph>
            </Card>
          </List.Item>
        )}
        locale={{ emptyText: '暂无推荐资源' }}
      />
      
      <Modal
        title="资源反馈"
        open={feedbackVisible}
        onCancel={() => setFeedbackVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setFeedbackVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" loading={submitting} onClick={submitFeedback}>
            提交
          </Button>
        ]}
      >
        {currentResource && (
          <>
            <div style={{ marginBottom: '16px' }}>
              <Text strong>资源名称：</Text> {currentResource.resourceName}
            </div>
            <div style={{ marginBottom: '16px' }}>
              <Text strong>评分：</Text>
              <Rate value={rating} onChange={setRating} />
            </div>
            <div>
              <Text strong>反馈内容：</Text>
              <TextArea
                rows={4}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="请输入您对该资源的反馈..."
                style={{ marginTop: '8px' }}
              />
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default StudentRecommendations; 