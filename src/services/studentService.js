import api from './api';

export const getStudents = async (pageNumber = 1, pageSize = 10) => {
  try {
    const response = await api.get(`/Student?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getStudentById = async (id) => {
  try {
    const response = await api.get(`/Student/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createStudent = async (formData) => {
  try {
    const response = await api.post('/Student', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateStudent = async (id, formData) => {
  try {
    const response = await api.put(`/Student/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteStudent = async (id) => {
  try {
    const response = await api.delete(`/Student?id=${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const approveStudent = async (id) => {
  try {
    const response = await api.post('/Student/approve-student', { id });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getStudentProfile = async () => {
  try {
    const response = await api.get('/Student/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
