import api, { setAccessToken } from './api';

export const login = async (email, password) => {
  try {
    const response = await api.post('/Auth/login', { 
      Email: email, 
      Password: password 
    });
    // Correctly extract from the nested 'data' property based on your backend response
    const { token, roles } = response.data.data;
    setAccessToken(token);
    
    // Return the nested data object which contains token, email, roles, etc.
    return response.data.data;

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

export const initiateGoogleLogin = () => {
  const loginUrl = 'https://localhost:7284/api/ExternalAuth/google-login';
  // Use window.location.href for standard redirects
  // If in a frame (like IDE preview), we might need to target the top window
  if (window.self !== window.top) {
    window.top.location.href = loginUrl;
  } else {
    window.location.href = loginUrl;
  }
};
