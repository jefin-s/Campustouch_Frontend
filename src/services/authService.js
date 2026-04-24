import api, { setAccessToken } from './api';

export const login = async (email, password) => {
  try {
    const response = await api.post('/Auth/login', { 
      Email: email, 
      Password: password 
    });
    const { token } = response.data;
    setAccessToken(token);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post('/Auth/register', {
      FullName: userData.fullName,
      Email: userData.email,
      Username: userData.username,
      Password: userData.password,
      PhoneNumber: userData.phoneNumber
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const logout = async () => {
  try {
    setAccessToken(null);
  } catch (error) {
    console.error('Logout error:', error);
  }
};
