import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    return response.data;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    const res = error.response;
    if (res.status === 401) {
      // Handle unauthorized access
      console.log('Unauthorized access');
    } else if (res.status === 404) {
      // Handle not found
      console.log('Resource not found');
    } else if (res.status === 500) {
      // Handle server error
      console.log('Server error');
    }
    return Promise.reject(error);
  }
);

export default api;