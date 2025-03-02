import axios from 'axios';

const API_URL = '/api';

// 添加学习目标
export const addGoal = async (
  token: string, 
  goalName: string, 
  goalDescription: string, 
  dueDate: string, 
  priority: number
) => {
  const response = await axios.post(`${API_URL}/goal/add`, {
    token,
    goalName,
    goalDescription,
    dueDate,
    priority
  });
  return response.data;
};

// 获取学习目标列表
export const getGoals = async (token: string) => {
  const response = await axios.get(`${API_URL}/goal/list`, {
    params: { token }
  });
  return response.data;
};

// 获取学生学习目标列表（教师用）
export const getStudentGoals = async (token: string, studentId: number) => {
  const response = await axios.get(`${API_URL}/teacher/student/${studentId}/goals`, {
    params: { token }
  });
  return response.data;
};

// 更新学习目标
export const updateGoal = async (
  token: string,
  goalId: number,
  goalName: string,
  goalDescription: string,
  dueDate: string,
  priority: number
) => {
  const response = await axios.put(`${API_URL}/goal/${goalId}/update`, {
    token,
    goalName,
    goalDescription,
    dueDate,
    priority
  });
  return response.data;
};

// 删除学习目标
export const deleteGoal = async (token: string, goalId: number) => {
  const response = await axios.delete(`${API_URL}/goal/${goalId}/delete`, {
    params: { token }
  });
  return response.data;
};

// 更新学习目标状态
export const updateGoalStatus = async (token: string, goalId: number, status: string) => {
  const response = await axios.put(`${API_URL}/goal/${goalId}/status`, {
    token,
    status
  });
  return response.data;
}; 