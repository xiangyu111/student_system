import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// 创建 mock 实例
const mock = new MockAdapter(axios, { delayResponse: 1000 });

// 模拟登录接口
mock.onPost('/api/user/login').reply((config) => {
  const { username, password } = JSON.parse(config.data);
  
  if (username && password) {
    return [200, {
      status: 200,
      message: '登录成功',
      token: 'mock-token-' + username,
      role: username === 'admin' ? 'admin' : (username === 'teacher' ? 'teacher' : 'student')
    }];
  } else {
    return [400, { status: 400, message: '用户名或密码不能为空' }];
  }
});

// 模拟获取用户信息接口
mock.onGet('/api/user/info').reply((config) => {
  const token = config.headers?.Authorization?.replace('Bearer ', '');
  
  if (token) {
    const username = token.replace('mock-token-', '');
    const role = username === 'admin' ? 'admin' : (username === 'teacher' ? 'teacher' : 'student');
    
    return [200, {
      status: 200,
      username,
      role,
      name: username === 'admin' ? '管理员' : (username === 'teacher' ? '教师' : '学生'),
      avatar: 'https://joeschmoe.io/api/v1/' + username
    }];
  } else {
    return [401, { status: 401, message: '未授权，请重新登录' }];
  }
});

// 模拟获取目标列表接口
mock.onGet('/api/goal/list').reply(200, {
  status: 200,
  goals: [
    {
      id: 1,
      goalName: '完成Java课程学习',
      description: '学习Java基础知识和面向对象编程',
      startDate: '2023-01-01',
      endDate: '2023-03-31',
      priority: 'high',
      status: 'in_progress',
      progress: 60
    },
    {
      id: 2,
      goalName: '阅读5本专业书籍',
      description: '阅读与专业相关的书籍，提升理论知识',
      startDate: '2023-02-01',
      endDate: '2023-06-30',
      priority: 'medium',
      status: 'in_progress',
      progress: 40
    }
  ]
});

export default mock; 