import axios from 'axios';

const API_URL = '/api';

// 获取所有资源
export const getAllResources = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/resources`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('获取资源列表出错:', error);
    return {
      status: 500,
      message: '获取资源列表失败，请稍后重试'
    };
  }
};

// 添加资源
export const addResource = async (token: string, resourceData: any) => {
  try {
    const response = await axios.post(`${API_URL}/resources`, resourceData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('添加资源出错:', error);
    return {
      status: 500,
      message: '添加资源失败，请稍后重试'
    };
  }
};

// 更新资源
export const updateResource = async (token: string, resourceId: number, resourceData: any) => {
  try {
    const response = await axios.put(`${API_URL}/resources/${resourceId}`, resourceData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('更新资源出错:', error);
    return {
      status: 500,
      message: '更新资源失败，请稍后重试'
    };
  }
};

// 删除资源
export const deleteResource = async (token: string, resourceId: number) => {
  try {
    const response = await axios.delete(`${API_URL}/resources/${resourceId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('删除资源出错:', error);
    return {
      status: 500,
      message: '删除资源失败，请稍后重试'
    };
  }
};

// 搜索资源
export const searchResources = async (token: string, keyword: string) => {
  try {
    const response = await axios.get(`${API_URL}/resources/search`, {
      params: { keyword },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('搜索资源出错:', error);
    return {
      status: 500,
      message: '搜索资源失败，请稍后重试'
    };
  }
};

// 获取资源数量
export const getResourceCount = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/resources/count`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('获取资源数量出错:', error);
    return {
      status: 500,
      message: '获取资源数量失败，请稍后重试',
      count: 0
    };
  }
};

// 获取资源详情
export const getResourceById = async (token: string, resourceId: number) => {
  try {
    const response = await axios.get(`${API_URL}/resources/${resourceId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('获取资源详情出错:', error);
    return {
      status: 500,
      message: '获取资源详情失败，请稍后重试'
    };
  }
};

// 获取推荐资源
export const getRecommendedResources = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/recommendations/resources`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('获取推荐资源出错:', error);
    return {
      status: 500,
      message: '获取推荐资源失败，请稍后重试'
    };
  }
};

// 提交资源反馈
export const submitResourceFeedback = async (token: string, resourceId: number, rating: number, comment: string) => {
  try {
    const response = await axios.post(`${API_URL}/resources/${resourceId}/feedback`, {
      rating,
      comment
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('提交资源反馈出错:', error);
    return {
      status: 500,
      message: '提交资源反馈失败，请稍后重试'
    };
  }
}; 