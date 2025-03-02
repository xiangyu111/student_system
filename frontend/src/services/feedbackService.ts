import axios from 'axios';

const API_URL = '/api';

// 提交反馈
export const submitFeedback = async (token: string, feedback: string) => {
  const response = await axios.post(`${API_URL}/feedback/submit`, {
    token,
    feedback
  });
  return response.data;
};

// 获取我的反馈列表
export const getMyFeedbacks = async (token: string) => {
  const response = await axios.get(`${API_URL}/feedback/list`, {
    params: { token }
  });
  return response.data;
};

// 获取学生反馈列表（教师用）
export const getStudentFeedbacks = async (token: string, studentId: number) => {
  const response = await axios.get(`${API_URL}/teacher/student/${studentId}/feedbacks`, {
    params: { token }
  });
  return response.data;
};

// 回复反馈
export const respondToFeedback = async (token: string, feedbackId: number, response: string) => {
  const res = await axios.post(`${API_URL}/feedback/${feedbackId}/respond`, {
    token,
    response
  });
  return res.data;
}; 