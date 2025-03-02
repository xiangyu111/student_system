import React, { useState } from 'react';
import { Modal, Form, Input, Rate, Button, message } from 'antd';
import { submitRecommendationFeedback } from '../services/recommendationService';

const { TextArea } = Input;

interface ResourceFeedbackProps {
  visible: boolean;
  onClose: () => void;
  resourceId: number;
  resourceName: string;
}

const ResourceFeedback: React.FC<ResourceFeedbackProps> = ({ 
  visible, 
  onClose, 
  resourceId, 
  resourceName 
}) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('请先登录');
        return;
      }
      
      const response = await submitRecommendationFeedback(
        token,
        resourceId,
        values.feedback,
        values.rating
      );
      
      if (response.status === 200) {
        message.success('反馈提交成功');
        form.resetFields();
        onClose();
      } else {
        message.error(response.message || '反馈提交失败');
      }
    } catch (error) {
      console.error('提交反馈出错:', error);
      message.error('提交反馈失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title={`为 "${resourceName}" 提供反馈`}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          取消
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          loading={submitting} 
          onClick={handleSubmit}
        >
          提交反馈
        </Button>
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="rating"
          label="评分"
          rules={[{ required: true, message: '请给出评分' }]}
        >
          <Rate allowHalf />
        </Form.Item>
        <Form.Item
          name="feedback"
          label="反馈意见"
          rules={[{ required: true, message: '请输入反馈意见' }]}
        >
          <TextArea rows={4} placeholder="请输入您对该资源的反馈意见" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ResourceFeedback; 