import axios from 'axios';

// Define backend API base URL

class AuthService {
  API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8083/api'; // Replace with your actual backend URL
  
  async login(credentials: any) {
    try {
      const response = await axios.post(`${this.API_URL}/auth/login`, credentials);
      return response.data;
    } catch (error: any) {
      console.log("Fetch user error: " + error.response?.data?.message || error.message);
      throw error;
    }
  }

  async signup(userData: any) {
    try {
      const response = await axios.post(`${this.API_URL}/auth/signup`, userData);
      return response.data;
    } catch (error: any) {
      console.log("Fetch user error: " + error.response?.data?.message || error.message);
      throw error;
    }
  }

  async forgotPassword(email: string) {
    try {
      const response = await axios.post(`${this.API_URL}/auth/forgot-password`, { email });
      return response.data;
    } catch (error: any) {
      console.log("Fetch user error: " + error.response?.data?.message || error.message);
      throw error;
    }
  }
}

const authService = new AuthService();

export default authService;