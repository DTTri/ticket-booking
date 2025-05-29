import axios from "axios";
import { ErrorHandler } from "@/utils/errorHandler";

// Define backend API base URL

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupData {
  email: string;
  password: string;
  username: string;
  role: number;
}

class AuthService {
  API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:8082/api"; // Replace with your actual backend URL

  async login(credentials: LoginCredentials) {
    try {
      const response = await axios.post(`${this.API_URL}/auth/login`, credentials);
      return response.data;
    } catch (error) {
      ErrorHandler.handleServiceErrorFromCatch(error, "Login");
    }
  }

  async signup(userData: SignupData) {
    try {
      const response = await axios.post(`${this.API_URL}/auth/register`, userData);
      return response.data;
    } catch (error) {
      ErrorHandler.handleServiceErrorFromCatch(error, "Signup");
    }
  }

  async forgotPassword(email: string) {
    try {
      const response = await axios.post(`${this.API_URL}/auth/forgot-password`, { email });
      return response.data;
    } catch (error) {
      ErrorHandler.handleServiceErrorFromCatch(error, "Forgot password");
    }
  }
}

const authService = new AuthService();

export default authService;
