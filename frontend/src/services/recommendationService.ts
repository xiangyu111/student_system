import axios from 'axios';

const API_URL = '/api';

// 获取推荐资源
export const getRecommendations = async (token: string) => {
  const response = await axios.get(`${API_URL}/recommendation/get`, {
    params: { token }
  });
  return response.data;
};

// 提交推荐反馈
export const submitRecommendationFeedback = async (
  token: string,
  resourceId: number,
  feedback: string,
  rating: number
) => {
  const response = await axios.post(`${API_URL}/recommendation/feedback`, {
    token,
    resourceId,
    feedback,
    rating
  });
  return response.data;
};

// 获取热门资源
export const getPopularResources = async (token: string) => {
  const response = await axios.get(`${API_URL}/recommendation/popular`, {
    params: { token }
  });
  return response.data;
};

// 获取最新资源
export const getRecentResources = async (token: string) => {
  const response = await axios.get(`${API_URL}/recommendation/recent`, {
    params: { token }
  });
  return response.data;
}; 