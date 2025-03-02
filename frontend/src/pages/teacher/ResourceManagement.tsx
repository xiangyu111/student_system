import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  Table, 
  Tag, 
  Space, 
  Modal, 
  Form, 
  Input, 
  Select, 
  message, 
  Popconfirm,
  Upload
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  UploadOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { 
  getAllResources, 
  addResource, 
  updateResource, 
  deleteResource, 
  searchResources 
} from '../../services/resourceService';

const { Option } = Select;
const { TextArea } = Input;
const { Search } = Input;

interface Resource {
  id: number;
  resourceName: string;
  resourceType: string;
  description: string;
  resourceUrl: string;
  createdAt: string;
  createdBy: string;
}

const ResourceManagement: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>('添加资源');
  const [form] = Form.useForm();
  const [editingResourceId, setEditingResourceId] = useState<number | null>(null);

  useEffect(() => {
    fetchResources();
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

  const handleAdd = () => {
    setModalTitle('添加资源');
    setEditingResourceId(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (resource: Resource) => {
    setModalTitle('编辑资源');
    setEditingResourceId(resource.id);
    form.setFieldsValue({
      resourceName: resource.resourceName,
      resourceType: resource.resourceType,
      description: resource.description,
      resourceUrl: resource.resourceUrl
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

      const response = await deleteResource(token, id);
      if (response.status === 200) {
        message.success('资源删除成功');
        fetchResources();
      } else {
        message.error(response.message || '资源删除失败');
      }
    } catch (error) {
      console.error('删除资源出错:', error);
      message.error('删除资源失败，请稍后重试');
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

      if (editingResourceId === null) {
        // 添加资源
        const response = await addResource(token, {
          resourceName: values.resourceName,
          resourceType: values.resourceType,
          description: values.description,
          resourceUrl: values.resourceUrl
        });
        
        if (response.status === 200) {
          message.success('资源添加成功');
          fetchResources();
          setModalVisible(false);
        } else {
          message.error(response.message || '添加资源失败');
        }
      } else {
        // 更新资源
        const response = await updateResource(token, editingResourceId, {
          resourceName: values.resourceName,
          resourceType: values.resourceType,
          description: values.description,
          resourceUrl: values.resourceUrl
        });
        
        if (response.status === 200) {
          message.success('资源更新成功');
          fetchResources();
          setModalVisible(false);
        } else {
          message.error(response.message || '更新资源失败');
        }
      }
    } catch (error) {
      console.error('表单验证或提交出错:', error);
      message.error('操作失败，请检查表单并重试');
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
  };

  const getResourceTypeTag = (type: string) => {
    switch (type) {
      case 'course':
        return <Tag color="blue">课程</Tag>;
      case 'article':
        return <Tag color="green">文章</Tag>;
      case 'teaching':
        return <Tag color="purple">教学资源</Tag>;
      case 'research':
        return <Tag color="orange">研究资源</Tag>;
      default:
        return <Tag>{type}</Tag>;
    }
  };

  const columns = [
    {
      title: '资源名称',
      dataIndex: 'resourceName',
      key: 'resourceName',
    },
    {
      title: '资源类型',
      dataIndex: 'resourceType',
      key: 'resourceType',
      render: (text: string) => getResourceTypeTag(text),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '链接',
      dataIndex: 'resourceUrl',
      key: 'resourceUrl',
      render: (text: string) => (
        <a href={text} target="_blank" rel="noopener noreferrer">
          查看资源
        </a>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '创建者',
      dataIndex: 'createdBy',
      key: 'createdBy',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Resource) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除该资源吗？"
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
    <div className="resource-management-container">
      <Card 
        title="资源管理" 
        extra={
          <Space>
            <Search
              placeholder="搜索资源"
              allowClear
              enterButton={<SearchOutlined />}
              onSearch={handleSearch}
              style={{ width: 250 }}
            />
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleAdd}
            >
              添加资源
            </Button>
          </Space>
        }
      >
        <Table 
          columns={columns} 
          dataSource={resources} 
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
            name="resourceName"
            label="资源名称"
            rules={[{ required: true, message: '请输入资源名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="resourceType"
            label="资源类型"
            rules={[{ required: true, message: '请选择资源类型' }]}
          >
            <Select placeholder="选择资源类型">
              <Option value="course">课程</Option>
              <Option value="article">文章</Option>
              <Option value="teaching">教学资源</Option>
              <Option value="research">研究资源</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="description"
            label="资源描述"
            rules={[{ required: true, message: '请输入资源描述' }]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="resourceUrl"
            label="资源链接"
            rules={[
              { required: true, message: '请输入资源链接' },
              { type: 'url', message: '请输入有效的URL' }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="resourceFile"
            label="上传资源文件（可选）"
          >
            <Upload>
              <Button icon={<UploadOutlined />}>选择文件</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ResourceManagement; 