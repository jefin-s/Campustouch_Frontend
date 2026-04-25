import api from './api';

export const markAttendance = async (attendanceData) => {
  try {
    const response = await api.post('/Attendence/mark', attendanceData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getAttendanceReport = async (filters) => {
  try {
    const response = await api.get('/Attendence/report', { params: filters });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
