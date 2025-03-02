import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Select, DatePicker, Button, Spin, Divider, Typography } from 'antd';
import { Line, Pie, Bar } from '@ant-design/charts';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title, Paragraph } = Typography;

const Analytics: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedStudent, setSelectedStudent] = useState<string>('all');
  const [selectedDateRange, setSelectedDateRange] = useState<any>(null);

  useEffect(() => {
    // 模拟数据加载
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleStudentChange = (value: string) => {
    setSelectedStudent(value);
  };

  const handleDateRangeChange = (dates: any) => {
    setSelectedDateRange(dates);
  };

  const handleFilter = () => {
    setLoading(true);
    // 模拟数据加载
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  // 活动时长统计数据
  const activityData = [
    { type: '阅读', value: 120 },
    { type: '课程', value: 80 },
    { type: '研究', value: 60 },
    { type: '实践', value: 40 },
    { type: '其他', value: 20 },
  ];

  // 活动趋势数据
  const trendData = [
    { date: '2023-01-01', value: 10 },
    { date: '2023-01-02', value: 15 },
    { date: '2023-01-03', value: 12 },
    { date: '2023-01-04', value: 18 },
    { date: '2023-01-05', value: 20 },
    { date: '2023-01-06', value: 22 },
    { date: '2023-01-07', value: 25 },
  ];

  // 学生参与度数据
  const studentData = [
    { name: '张三', value: 90 },
    { name: '李四', value: 75 },
    { name: '王五', value: 85 },
    { name: '赵六', value: 60 },
    { name: '钱七', value: 70 },
  ];

  // 图表配置
  const pieConfig = {
    data: activityData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [{ type: 'pie-legend-active' }, { type: 'element-active' }],
  };

  const lineConfig = {
    data: trendData,
    xField: 'date',
    yField: 'value',
    point: {
      size: 5,
      shape: 'diamond',
    },
    label: {
      style: {
        fill: '#aaa',
      },
    },
  };

  const barConfig = {
    data: studentData,
    xField: 'value',
    yField: 'name',
    seriesField: 'name',
    legend: { position: 'top-left' },
  };

  return (
    <div>
      <Card title="学习数据分析">
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Select
              style={{ width: '100%' }}
              placeholder="选择学生"
              onChange={handleStudentChange}
              value={selectedStudent}
            >
              <Option value="all">所有学生</Option>
              <Option value="1">张三</Option>
              <Option value="2">李四</Option>
              <Option value="3">王五</Option>
            </Select>
          </Col>
          <Col span={12}>
            <RangePicker
              style={{ width: '100%' }}
              onChange={handleDateRangeChange}
              value={selectedDateRange}
            />
          </Col>
          <Col span={4}>
            <Button type="primary" onClick={handleFilter} style={{ width: '100%' }}>
              筛选
            </Button>
          </Col>
        </Row>

        <Spin spinning={loading}>
          <Divider orientation="left">活动类型分布</Divider>
          <Paragraph>
            该图表展示了不同类型活动所占的时间比例，可以看出学生在各类学习活动上的时间分配情况。
          </Paragraph>
          <div style={{ height: 300 }}>
            <Pie {...pieConfig} />
          </div>

          <Divider orientation="left">活动时长趋势</Divider>
          <Paragraph>
            该图表展示了学生每日学习活动时长的变化趋势，可以观察学生的学习规律和持续性。
          </Paragraph>
          <div style={{ height: 300 }}>
            <Line {...lineConfig} />
          </div>

          <Divider orientation="left">学生参与度排名</Divider>
          <Paragraph>
            该图表展示了各学生的学习参与度得分，可以比较不同学生的学习投入情况。
          </Paragraph>
          <div style={{ height: 300 }}>
            <Bar {...barConfig} />
          </div>
        </Spin>
      </Card>
    </div>
  );
};

export default Analytics; 