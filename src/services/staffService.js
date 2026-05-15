import api from './api';

export const getAllStaff = async (pageNumber = 1, pageSize = 10, search = '') => {
  try {
    const query = new URLSearchParams({
      pageNumber: String(pageNumber),
      pageSize: String(pageSize),
    });

    const trimmedSearch = search?.trim();
    if (trimmedSearch) {
      query.set('Search', trimmedSearch);
    }

    const response = await api.get(`/Staff/Getallstaff?${query.toString()}`);
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

export const assignSubjects = async (staffId, subjectId) => {
  try {
    // Backend expects an AssignSubjectCommand object
    const payload = {
      staffId: Number(staffId),
      subjectIds: [Number(subjectId)]
    };
    const response = await api.post(`/staff/${staffId}/subjects`, payload);
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
