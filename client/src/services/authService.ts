import { ErrorHandler } from "@/utils/errorHandler";
import { User } from "@/models/User";
import BaseService from "./baseService";
import { LoginDTO, LoginResponse, SignupDTO } from "./types/authTypes";

class AuthService extends BaseService {
  constructor() {
    super("/auth", {
      baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8082/api",
      enableAuth: false,
    });
  }

  async login(credentials: LoginDTO): Promise<LoginResponse> {
    try {
      const response = await this.post<LoginResponse>("/login", credentials);
      return response.data;
    } catch (error) {
      ErrorHandler.handleServiceErrorFromCatch(error, "Login");
    }
  }

  async signup(userData: SignupDTO): Promise<User> {
    try {
      const response = await this.post<User>("/register", userData);
      return response.data;
    } catch (error) {
      ErrorHandler.handleServiceErrorFromCatch(error, "Signup");
    }
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    try {
      const response = await this.post<{ message: string }>("/forgot-password", { email });
      return response.data;
    } catch (error) {
      ErrorHandler.handleServiceErrorFromCatch(error, "Forgot password");
    }
  }
}

const authService = new AuthService();

export default authService;
