import api from './api';

export const getStudents = async (pageNumber = 1, pageSize = 10, search = '') => {
  try {
    const query = new URLSearchParams({
      pageNumber: String(pageNumber),
      pageSize: String(pageSize),
    });

    const trimmedSearch = search?.trim();
    if (trimmedSearch) {
      query.set('Search', trimmedSearch);
    }

    const response = await api.get(`/Student?${query.toString()}`);
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

export const approveStudent = async (payload) => {
  try {
    // If payload is already an object, send it as is. 
    // If it's just an ID (number/string), wrap it in an object for backward compatibility.
    const body = typeof payload === 'object' ? payload : { id: payload };
    const response = await api.post('/Student/approve-student', body);
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
