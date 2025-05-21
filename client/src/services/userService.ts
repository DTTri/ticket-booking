import axios from 'axios';

// Define backend API base URL
const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8081/api'; // Replace with your actual backend URL

const authService = {
  login: async (credentials: any) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || error.message;
    }
  },

  signup: async (userData: any) => {
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, userData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || error.message;
    }
  },

  forgotPassword: async (email: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || error.message;
    }
  },
};

export default authService;