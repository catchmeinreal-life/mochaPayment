import axios from 'axios'; //handling payment with MochaApi

//axios instance with base URL
const MochaApi = axios.create({
  baseURL: import.meta.env.VITE_MOCHA_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

MochaApi.interceptors.request.use(
  (config) => {
    // Add token to requests if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

MochaApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status } = error.response;

      // Token expired or unauthorized
      if (status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        window.location.href = '/login';
      }

      // Forbidden access
      if (status === 403) {
        alert('Access denied. You don\'t have permission to do that.');
      }

      // Server error
      if (status === 500) {
        console.error('Server error:', error.response.data);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API services
export const authService = {
  // Greet User
  greetUser: async () => {
    const response = await MochaApi.get('/api/auth/message');
    return response.data;
  },
  // Register a new user
  register: async (userData) => {
    const response = await MochaApi.post('/api/auth/signup', userData);
    
    if (response.data.success && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('isAuthenticated', 'true');
    }
    
    return response.data;
  },

  login: async (credentials) => {
    const response = await MochaApi.post('/api/auth/login', credentials);

    if (response.data.success && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('isAuthenticated', 'true');
    }

    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    window.location.href = '/login';
  },

  checkIsAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  verifyToken: async () => {
    const token = localStorage.getItem('token');
    if (!token) return { verified: false };

    try {
      const response = await MochaApi.get(`/api/auth/verify/${token}`);
      return response.data;
    } catch (err) {
      console.error('Token verification failed:', err);
      return { verified: false };
    }
  }

}


export const walletService = {
  getWalletBalance: async () => {
    const res = await MochaApi.get('/api/wallet/balance');
    return res.data.data; // returns { accountId, balance, ... }
  },

  getTransactions: async () => {
    const res = await MochaApi.get('/api/wallet/transactions');
    return res.data.data.transactions;
  }
};