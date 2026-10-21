import axios from 'axios';
import Cookies from 'js-cookie';

// Laravel API root. Override with VITE_API_BASE_URL in .env (see .env.example).
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://backend.spaalita.intellimanagement.com').replace(/\/+$/, '');

// Server root that serves uploaded files ("/uploads/...").
export const API_ORIGIN = API_BASE_URL.replace(/\/api$/, '');

// Message to show for a failed request: the API's own message when it sent one.
export const getErrorMessage = (error, fallback = 'Something went wrong') =>
  error?.response?.data?.message || error?.message || fallback;

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 50000,
  headers: {
    Accept: 'application/json',
  },
});


instance.interceptors.request.use(function (config) {
  let token;
  if (Cookies.get('userToken')) {
    token = JSON.parse(Cookies.get('userToken')).token; // Ensure you're accessing the correct field
  }
  const isAuthenticated = sessionStorage.getItem('authToken');
  // Remove quotes if present (e.g., if token is stored as '"tokenstring"')
  const cleanToken = isAuthenticated ? isAuthenticated.replace(/^"|"$/g, '') : '';
  
  if (isAuthenticated && !config.headers['Authorization']) {
    config.headers['Authorization'] = `Bearer ${cleanToken}`;
  }

  return config;
}, function (error) {
  // Handle request errors
  return Promise.reject(error);
});

// Response Interceptor
instance.interceptors.response.use(
  response => response, // If response is successful, return it
  error => {
    // Missing, invalid or expired token ("No token provided..." / "Invalid or expired token")
    if (error.response?.status === 401 && !error.config?.url?.includes('/admin/login')) {
      // Clear the session (token in sessionStorage, logged-in flag in localStorage)
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('user');
      localStorage.removeItem('user');
      // Redirect to login screen
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

const responseBody = (response) => response.data;

const requests = {
  get: (url, body, headers) =>
    instance.get(url, body, headers).then(responseBody),

  post: (url, body) => instance.post(url, body).then(responseBody),

  uploadPosts: (url, body) => instance.post(url, body, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then(responseBody),

  customPost: (url, body, token) => {
    return instance.post(url, body, {
      headers: {
        "Content-Type": "multipart/form-data",
        'Authorization': `Bearer ${token}`,
      }
    }).then(responseBody);
  },

  put: (url, body) => instance.put(url, body).then(responseBody),

  patch: (url, body) => instance.patch(url, body).then(responseBody),

  delete: (url, body) => instance.delete(url, body).then(responseBody),
  
  upload: (url, formData) =>
    instance.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(responseBody),
};

export default requests;
