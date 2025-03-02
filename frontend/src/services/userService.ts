import axios from 'axios';

const API_URL = '/api';

// 登录接口
export const login = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/user/login`, { username, password });
    return response.data; // 返回完整的响应数据，包括 token
  } catch (error) {
    console.error('登录请求失败:', error);
    throw error;
  }
};

// 获取用户信息
export const getUserInfo = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/user/info`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('获取用户信息失败:', error);
    throw error;
  }
};

// 注册接口
export const register = async (username: string, password: string, role: string) => {
  try {
    const response = await axios.post(`${API_URL}/user/register`, { username, password, role });
    return response.data;
  } catch (error) {
    console.error('注册请求失败:', error);
    throw error;
  }
};

// 退出登录
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userRole');
  localStorage.removeItem('username');
};

// 更新用户信息
export const updateUserInfo = async (token: string, avatar: string) => {
  const response = await axios.put(`${API_URL}/user/update`, {
    token,
    avatar
  });
  return response.data;
};

// 获取所有用户
export const getAllUsers = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('获取用户列表出错:', error);
    return {
      status: 500,
      message: '获取用户列表失败，请稍后重试'
    };
  }
};

// 添加用户
export const addUser = async (token: string, userData: any) => {
  try {
    const response = await axios.post(`${API_URL}/users`, userData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('添加用户出错:', error);
    return {
      status: 500,
      message: '添加用户失败，请稍后重试'
    };
  }
};

// 更新用户
export const updateUser = async (token: string, userId: number, userData: any) => {
  try {
    const response = await axios.put(`${API_URL}/users/${userId}`, userData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('更新用户出错:', error);
    return {
      status: 500,
      message: '更新用户失败，请稍后重试'
    };
  }
};

// 删除用户
export const deleteUser = async (token: string, userId: number) => {
  try {
    const response = await axios.delete(`${API_URL}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('删除用户出错:', error);
    return {
      status: 500,
      message: '删除用户失败，请稍后重试'
    };
  }
};

// 获取用户数量
export const getUserCount = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/users/count`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('获取用户数量出错:', error);
    return {
      status: 500,
      message: '获取用户数量失败，请稍后重试',
      count: 0
    };
  }
}; 