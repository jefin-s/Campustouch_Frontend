import axios from 'axios';

const BASE_URL = 'https://localhost:7284/api';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Required for HttpOnly cookies
});

let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

// Request interceptor to add the access token to headers
api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 error and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call refresh endpoint
        const response = await axios.post(`${BASE_URL}/Auth/refresh`, {}, { withCredentials: true });
        const { token } = response.data;

        setAccessToken(token);
        originalRequest.headers.Authorization = `Bearer ${token}`;

        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear token and redirect to login if needed
        setAccessToken(null);
        window.location.href = '/auth';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
