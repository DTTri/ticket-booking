import { ErrorHandler } from "@/utils/errorHandler";
import { User } from "@/models/User";
import BaseService from "./BaseService";

class UserService extends BaseService {
  constructor() {
    super("/", {
      baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8082/api",
      enableAuth: false,
    });
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const response = await this.get<User[]>("/users");
      return response.data;
    } catch (error) {
      ErrorHandler.handleServiceErrorFromCatch(error, "Get all users");
    }
  }

  async getUserById(userId: string): Promise<User> {
    try {
      const response = await this.get<User>(`/users/${userId}`);
      return response.data;
    } catch (error) {
      ErrorHandler.handleServiceErrorFromCatch(error, "Get user by ID");
    }
  }
}

const userService = new UserService();

export default userService;
