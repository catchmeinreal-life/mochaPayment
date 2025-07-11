import axios from 'axios'; //handling payment with MochaApi

//axios instance with base URL

const MochaApi = axios.create({
    baseURL: import.meta.env.VITE_MOCHA_API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_MOCHA_API_KEY}`,
    },
})

MochaApi.interceptors.request.use(
    (config) => {
        // ✅ If the request is successful, just pass it through.
        return config;
    },
    (error) => {
        // 🛑 Handle request errors
        console.error('Request error:', error);
        return Promise.reject(error);
    }
)

// Inside errorHandler:

// We check error.response to ensure it’s a real server response and not a network error.

// Based on the status, we trigger different flows:

// 401: token expired or invalid → log out the user and redirect.

// 403: forbidden access → show a polite denial alert.

// 500: something blew up → log the server error for debugging.

MochaApi.interceptors.response.use(
    (response) => {
      // ✅ If the response is successful, just pass it through.
      return response;
    },
    (error) => {
      // 🛑 Handle specific error cases
      if (error.response) {
        const { status } = error.response;
  
        // 🔒 Token expired or unauthorized
        if (status === 401) {
          // Optionally: Remove token, redirect, or trigger re-auth
          localStorage.removeItem('token');
          window.location.href = '/login'; // Or use a router push
        }
  
        // 🔐 Forbidden access
        if (status === 403) {
          alert('Access denied. You don’t have permission to do that.');
        }
  
        // 💥 Server error
        if (status === 500) {
          console.error('Server error:', error.response.data);
        }
      }
  
      return Promise.reject(error);
    }
  );

 // Auth API services
export const authService = {
    // Register a new user
    register: async (userData) => {
      console.log(userData);
      const response = await MochaApi.post('/auth/signup',userData);
      return response.data;
    },
  
    // Login user
    login: async (credentials) => {
      const response = await MochaApi.post('/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    },

    signIn: async () => {
        const response = await MochaApi.get('/auth/login');
        return response;
    },
  
    // verify user
    verify: async (token) => {
      const response = await MochaApi.get(`auth/verify/${token}`);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', response.data.user);
      }
      return response.data;
    },
  
    // Logout user
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  
    // Get current user
    getCurrentUser: () => {
      const user = localStorage.getItem('user');
      return user ? user : null;
    },
  };
  
export default MochaApi;  