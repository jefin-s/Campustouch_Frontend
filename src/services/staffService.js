import api from './api';

export const getAllStaff = async () => {
  try {
    const response = await api.get('/Staff/Getallstaff');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getStaffById = async (id) => {
  try {
    const response = await api.get(`/Staff/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createStaff = async (staffData) => {
  try {
    const response = await api.post('/Staff', staffData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateStaff = async (id, staffData) => {
  try {
    const response = await api.put(`/Staff/${id}`, staffData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteStaff = async (id) => {
  try {
    const response = await api.delete(`/Staff/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const assignSubjects = async (staffId, subjectIds) => {
  try {
    // Note: The body format provided is { staffId: 1, subjectIds: [2] }
    const response = await api.post(`/staff/${staffId}/subjects`, { staffId, subjectIds });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getStaffSubjects = async (staffId) => {
  try {
    const response = await api.get(`/staff/${staffId}/subjects`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const removeSubjectFromStaff = async (staffId, subjectId) => {
  try {
    const response = await api.delete(`/staff/${staffId}/subjects/${subjectId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
