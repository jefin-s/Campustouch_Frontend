import axios from 'axios';

const BASE_URL = 'https://localhost:7284/api';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Required for HttpOnly cookies
});

let accessToken = localStorage.getItem('accessToken') || null;

export const setAccessToken = (token) => {
  accessToken = token;
  if (token) {
    localStorage.setItem('accessToken', token);
  } else {
    localStorage.removeItem('accessToken');
  }
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
    const authEndpoints = ['/Auth/login', '/Auth/register', '/Auth/refresh', '/ExternalAuth/google-login'];
    const isAuthRequest = authEndpoints.some(endpoint => originalRequest.url?.includes(endpoint));

    // If 401 error, not an auth request, and not already retrying
    if (error.response?.status === 401 && !isAuthRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call refresh endpoint
        const response = await axios.post(`${BASE_URL}/Auth/refresh`, {}, { withCredentials: true });
        const { token } = response.data.data || response.data;

        setAccessToken(token);
        originalRequest.headers.Authorization = `Bearer ${token}`;

        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear token and redirect to login if needed
        setAccessToken(null);
        // Only redirect if we're not already on the auth page
        if (!window.location.pathname.includes('/auth')) {
          window.location.href = '/auth';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
