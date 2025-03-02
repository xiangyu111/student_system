import React, { useState, useEffect } from 'react';
import { 
  Card, 
  List, 
  Tag, 
  Space, 
  Input, 
  Select, 
  message, 
  Typography, 
  Divider, 
  Button 
} from 'antd';
import { SearchOutlined, BookOutlined, FileTextOutlined, LinkOutlined } from '@ant-design/icons';
import { getAllResources, searchResources } from '../../services/resourceService';
import { getRecommendations, getPopularResources, getRecentResources } from '../../services/recommendationService';
import ResourceFeedback from '../../components/ResourceFeedback';

const { Title, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

interface Resource {
  resourceId: number;
  resourceName: string;
  resourceType: string;
  description: string;
  link: string;
}

const Resources: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [recommendations, setRecommendations] = useState<Resource[]>([]);
  const [popularResources, setPopularResources] = useState<Resource[]>([]);
  const [recentResources, setRecentResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [resourceType, setResourceType] = useState<string>('all');
  const [feedbackVisible, setFeedbackVisible] = useState<boolean>(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  useEffect(() => {
    fetchResources();
    fetchRecommendations();
    fetchPopularResources();
    fetchRecentResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('请先登录');
        return;
      }

      const response = await getAllResources(token);
      if (response.status === 200) {
        setResources(response.resources);
      } else {
        message.error(response.message || '获取资源列表失败');
      }
    } catch (error) {
      console.error('获取资源列表出错:', error);
      message.error('获取资源列表失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await getRecommendations(token);
      if (response.status === 200) {
        setRecommendations(response.recommendations);
      }
    } catch (error) {
      console.error('获取推荐资源出错:', error);
    }
  };

  const fetchPopularResources = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await getPopularResources(token);
      if (response.status === 200) {
        setPopularResources(response.resources);
      }
    } catch (error) {
      console.error('获取热门资源出错:', error);
    }
  };

  const fetchRecentResources = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await getRecentResources(token);
      if (response.status === 200) {
        setRecentResources(response.resources);
      }
    } catch (error) {
      console.error('获取最新资源出错:', error);
    }
  };

  const handleSearch = async (value: string) => {
    if (!value.trim()) {
      fetchResources();
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('请先登录');
        return;
      }

      const response = await searchResources(token, value);
      if (response.status === 200) {
        setResources(response.resources);
      } else {
        message.error(response.message || '搜索资源失败');
      }
    } catch (error) {
      console.error('搜索资源出错:', error);
      message.error('搜索资源失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (value: string) => {
    setResourceType(value);
  };

  const handleFeedback = (resource: Resource) => {
    setSelectedResource(resource);
    setFeedbackVisible(true);
  };

  const handleFeedbackClose = () => {
    setFeedbackVisible(false);
    setSelectedResource(null);
  };

  const getResourceTypeTag = (type: string) => {
    switch (type) {
      case 'course':
        return <Tag color="blue">课程</Tag>;
      case 'article':
        return <Tag color="green">文章</Tag>;
      case 'teaching':
        return <Tag color="orange">教学资源</Tag>;
      case 'research':
        return <Tag color="purple">研究资源</Tag>;
      default:
        return <Tag>其他</Tag>;
    }
  };

  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case 'course':
        return <BookOutlined />;
      case 'article':
        return <FileTextOutlined />;
      default:
        return <LinkOutlined />;
    }
  };

  const filteredResources = resourceType === 'all' 
    ? resources 
    : resources.filter(resource => resource.resourceType === resourceType);

  return (
    <div className="resources-container">
      <Card>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Space style={{ marginBottom: 16 }}>
            <Search
              placeholder="搜索资源"
              allowClear
              enterButton={<SearchOutlined />}
              onSearch={handleSearch}
              style={{ width: 300 }}
            />
            <Select 
              defaultValue="all" 
              style={{ width: 120 }} 
              onChange={handleTypeChange}
            >
              <Option value="all">全部类型</Option>
              <Option value="course">课程</Option>
              <Option value="article">文章</Option>
              <Option value="teaching">教学资源</Option>
              <Option value="research">研究资源</Option>
            </Select>
          </Space>

          <Divider orientation="left">为您推荐</Divider>
          <List
            grid={{ gutter: 16, column: 3 }}
            dataSource={recommendations}
            renderItem={item => (
              <List.Item>
                <Card 
                  hoverable
                  title={item.resourceName}
                  extra={getResourceTypeTag(item.resourceType)}
                  actions={[
                    <a href={item.link} target="_blank" rel="noopener noreferrer">查看资源</a>,
                    <a onClick={() => handleFeedback(item)}>提供反馈</a>
                  ]}
                >
                  <Paragraph ellipsis={{ rows: 2 }}>
                    {item.description}
                  </Paragraph>
                </Card>
              </List.Item>
            )}
          />

          <Divider orientation="left">所有资源</Divider>
          <List
            loading={loading}
            itemLayout="horizontal"
            dataSource={filteredResources}
            renderItem={item => (
              <List.Item
                actions={[
                  <a href={item.link} target="_blank" rel="noopener noreferrer">查看</a>,
                  <a onClick={() => handleFeedback(item)}>反馈</a>
                ]}
              >
                <List.Item.Meta
                  avatar={getResourceTypeIcon(item.resourceType)}
                  title={<a href={item.link} target="_blank" rel="noopener noreferrer">{item.resourceName}</a>}
                  description={
                    <Space>
                      {getResourceTypeTag(item.resourceType)}
                      <span>{item.description}</span>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />

          <Divider orientation="left">热门资源</Divider>
          <List
            grid={{ gutter: 16, column: 4 }}
            dataSource={popularResources}
            renderItem={item => (
              <List.Item>
                <Card 
                  hoverable
                  title={item.resourceName}
                  extra={getResourceTypeTag(item.resourceType)}
                  actions={[
                    <a href={item.link} target="_blank" rel="noopener noreferrer">查看资源</a>,
                    <a onClick={() => handleFeedback(item)}>提供反馈</a>
                  ]}
                >
                  <Paragraph ellipsis={{ rows: 2 }}>
                    {item.description}
                  </Paragraph>
                </Card>
              </List.Item>
            )}
          />

          <Divider orientation="left">最新资源</Divider>
          <List
            grid={{ gutter: 16, column: 4 }}
            dataSource={recentResources}
            renderItem={item => (
              <List.Item>
                <Card 
                  hoverable
                  title={item.resourceName}
                  extra={getResourceTypeTag(item.resourceType)}
                  actions={[
                    <a href={item.link} target="_blank" rel="noopener noreferrer">查看资源</a>,
                    <a onClick={() => handleFeedback(item)}>提供反馈</a>
                  ]}
                >
                  <Paragraph ellipsis={{ rows: 2 }}>
                    {item.description}
                  </Paragraph>
                </Card>
              </List.Item>
            )}
          />
        </Space>
      </Card>

      {selectedResource && (
        <ResourceFeedback
          visible={feedbackVisible}
          onClose={handleFeedbackClose}
          resourceId={selectedResource.resourceId}
          resourceName={selectedResource.resourceName}
        />
      )}
    </div>
  );
};

export default Resources; 