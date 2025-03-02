import React, { useState } from 'react';
import { Card, Form, Input, Button, Switch, Select, Divider, message, Row, Col } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

const { Option } = Select;

const Settings: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      // 模拟保存操作
      setTimeout(() => {
        console.log('保存设置:', values);
        message.success('设置保存成功');
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('保存设置出错:', error);
      message.error('保存设置失败，请稍后重试');
    }
  };

  return (
    <div>
      <Card title="系统设置">
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            siteName: '大学生课外学情记录分析系统',
            siteDescription: '帮助大学生记录和分析课外学习情况的系统',
            emailNotification: true,
            defaultLanguage: 'zh_CN',
            pageSize: 10,
            dataRetentionDays: 365,
            enableRegistration: true,
            requireEmailVerification: true,
            enableActivityReminders: true
          }}
        >
          <Divider orientation="left">基本设置</Divider>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="siteName"
                label="系统名称"
                rules={[{ required: true, message: '请输入系统名称' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="siteDescription"
                label="系统描述"
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="defaultLanguage"
                label="默认语言"
                rules={[{ required: true, message: '请选择默认语言' }]}
              >
                <Select>
                  <Option value="zh_CN">简体中文</Option>
                  <Option value="en_US">English (US)</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="pageSize"
                label="默认分页大小"
                rules={[{ required: true, message: '请选择默认分页大小' }]}
              >
                <Select>
                  <Option value={10}>10条/页</Option>
                  <Option value={20}>20条/页</Option>
                  <Option value={50}>50条/页</Option>
                  <Option value={100}>100条/页</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">数据设置</Divider>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="dataRetentionDays"
                label="数据保留天数"
                rules={[{ required: true, message: '请输入数据保留天数' }]}
              >
                <Input type="number" min={30} />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">用户设置</Divider>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="enableRegistration"
                label="允许用户注册"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="requireEmailVerification"
                label="要求邮箱验证"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="emailNotification"
                label="启用邮件通知"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">活动设置</Divider>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="enableActivityReminders"
                label="启用活动提醒"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button 
              type="primary" 
              icon={<SaveOutlined />} 
              onClick={handleSave}
              loading={loading}
            >
              保存设置
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Settings; 