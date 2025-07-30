import { User } from "@/models/User";
import authService from "@/services/authService";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ErrorHandler } from "@/utils/errorHandler";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { UserRole } from "@/constants";
import { LoginDTO, SignupDTO, LoginResponse } from "@/services/types/authTypes";
import userService from "@/services/userService";

interface JWTPayload {
  sub: string; // User ID
  email: string;
  jti: string; // JWT ID
  role: string; // Role as string
  nbf: number; // Not before
  exp: number; // Expiration
  iat: number; // Issued at
}

interface UserState {
  user: User | null;
  users: User[];
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  forgotPasswordStatus: "idle" | "loading" | "succeeded" | "failed";
  forgotPasswordError: string | null;
}

const initialState: UserState = {
  user: null,
  users: [],
  isLoading: false,
  error: null,
  isAuthenticated: false,
  forgotPasswordStatus: "idle",
  forgotPasswordError: null,
};

export const loginUser = createAsyncThunk<LoginResponse, LoginDTO>(
  "user/login",
  async (credentials: LoginDTO, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response;
    } catch (error) {
      return rejectWithValue(ErrorHandler.handleAsyncThunkErrorFromCatch(error));
    }
  }
);

export const signupUser = createAsyncThunk(
  "auth/signup",
  async (userData: SignupDTO, { rejectWithValue }) => {
    try {
      const data = await authService.signup(userData);
      return data as User;
    } catch (error) {
      return rejectWithValue(ErrorHandler.handleAsyncThunkErrorFromCatch(error));
    }
  }
);

export const requestPasswordReset = createAsyncThunk(
  "auth/forgotPassword",
  async (email: string, { rejectWithValue }) => {
    try {
      const data = await authService.forgotPassword(email);
      return data;
    } catch (error) {
      return rejectWithValue(ErrorHandler.handleAsyncThunkErrorFromCatch(error));
    }
  }
);

export const getAllUsers = createAsyncThunk("user/getAllUsers", async (_, { rejectWithValue }) => {
  try {
    const response = await userService.getAllUsers();
    return response;
  } catch (error) {
    return rejectWithValue(ErrorHandler.handleAsyncThunkErrorFromCatch(error));
  }
});

export const getUserById = createAsyncThunk(
  "user/getAllUsers",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await userService.getUserById(id);
      return response;
    } catch (error) {
      return rejectWithValue(ErrorHandler.handleAsyncThunkErrorFromCatch(error));
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: state => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      // Clear token from cookies
      Cookies.remove("token");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
    // Reset forgot password state
    resetForgotPasswordState: state => {
      state.forgotPasswordStatus = "idle";
      state.forgotPasswordError = null;
    },
    setSession: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
  },
  extraReducers: builder => {
    builder
      // Handle login thunk
      .addCase(loginUser.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.isLoading = false;

        const { token, expiration } = action.payload;

        const expirationDate = new Date(expiration);
        Cookies.set("token", token, {
          expires: expirationDate,
        });

        try {
          const decoded: JWTPayload = jwtDecode(token);

          // Map role string to UserRole enum
          const mapRole = (roleString: string): UserRole => {
            switch (roleString.toUpperCase()) {
              case "USER":
                return UserRole.USER;
              case "ORGANIZER":
                return UserRole.ORGANIZER;
              case "ADMIN":
                return UserRole.ADMIN;
              default:
                return UserRole.USER;
            }
          };

          const user: User = {
            userId: decoded.sub,
            userName: decoded.email.split("@")[0], // Extract username from email
            email: decoded.email,
            firstName: "",
            lastName: "",
            role: mapRole(decoded.role),
          };
          console.log(user);

          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("token", token);
          localStorage.setItem("expiration", expiration);

          state.user = user;
          state.isAuthenticated = true;
          state.error = null;
        } catch (error) {
          console.error("Failed to decode JWT token:", error);
          state.error = "Failed to process login response";
          state.isAuthenticated = false;
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = (action.payload as string) || "Login failed";
      })
      .addCase(getAllUsers.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.isLoading = false;
        state.error = null;
        state.users = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Failed to fetch users";
      })
      .addCase(signupUser.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.error = null; // Clear any previous errors
        state.user = action.payload;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Signup failed";
      })
      // Handle forgot password thunk
      .addCase(requestPasswordReset.pending, state => {
        state.forgotPasswordStatus = "loading";
        state.forgotPasswordError = null;
      })
      .addCase(requestPasswordReset.fulfilled, state => {
        state.forgotPasswordStatus = "succeeded";
        state.forgotPasswordError = null;
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.forgotPasswordStatus = "failed";
        state.forgotPasswordError = (action.payload as string) || "Failed to send reset link";
      });
  },
});

export const { logout, resetForgotPasswordState, setSession } = userSlice.actions;

export default userSlice.reducer;
