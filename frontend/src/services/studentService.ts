import axios from 'axios';

const API_URL = '/api';

// 获取学生列表
export const getStudents = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/students`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('获取学生列表出错:', error);
    return {
      status: 500,
      message: '获取学生列表失败，请稍后重试'
    };
  }
};

// 添加学生
export const addStudent = async (token: string, studentData: any) => {
  try {
    const response = await axios.post(`${API_URL}/students`, studentData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('添加学生出错:', error);
    return {
      status: 500,
      message: '添加学生失败，请稍后重试'
    };
  }
};

// 更新学生
export const updateStudent = async (token: string, studentId: number, studentData: any) => {
  try {
    const response = await axios.put(`${API_URL}/students/${studentId}`, studentData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('更新学生出错:', error);
    return {
      status: 500,
      message: '更新学生失败，请稍后重试'
    };
  }
};

// 删除学生
export const deleteStudent = async (token: string, studentId: number) => {
  try {
    const response = await axios.delete(`${API_URL}/students/${studentId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('删除学生出错:', error);
    return {
      status: 500,
      message: '删除学生失败，请稍后重试'
    };
  }
};

// 获取学生详情
export const getStudentDetail = async (token: string, studentId: number) => {
  try {
    const response = await axios.get(`${API_URL}/students/${studentId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('获取学生详情出错:', error);
    return {
      status: 500,
      message: '获取学生详情失败，请稍后重试'
    };
  }
}; 