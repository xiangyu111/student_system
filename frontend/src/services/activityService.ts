import axios from 'axios';

const API_URL = '/api';

// 获取所有活动
export const getAllActivities = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/activities`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('获取活动列表出错:', error);
    return {
      status: 500,
      message: '获取活动列表失败，请稍后重试'
    };
  }
};

// 添加活动
export const addActivity = async (token: string, activityData: any) => {
  try {
    const response = await axios.post(`${API_URL}/activities`, activityData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('添加活动出错:', error);
    return {
      status: 500,
      message: '添加活动失败，请稍后重试'
    };
  }
};

// 更新活动
export const updateActivity = async (token: string, activityId: number, activityData: any) => {
  try {
    const response = await axios.put(`${API_URL}/activities/${activityId}`, activityData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('更新活动出错:', error);
    return {
      status: 500,
      message: '更新活动失败，请稍后重试'
    };
  }
};

// 删除活动
export const deleteActivity = async (token: string, activityId: number) => {
  try {
    const response = await axios.delete(`${API_URL}/activities/${activityId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('删除活动出错:', error);
    return {
      status: 500,
      message: '删除活动失败，请稍后重试'
    };
  }
};

// 获取活动数量
export const getActivityCount = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/activities/count`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('获取活动数量出错:', error);
    return {
      status: 500,
      message: '获取活动数量失败，请稍后重试',
      count: 0
    };
  }
};

// 更新学习进度
export const updateProgress = async (token: string, activityId: number, progress: number) => {
  const response = await axios.put(`${API_URL}/progress/update`, {
    token,
    activityId,
    progress
  });
  return response.data;
};

// 获取学习进度
export const getProgress = async (token: string) => {
  const response = await axios.get(`${API_URL}/progress/get`, {
    params: { token }
  });
  return response.data;
}; 