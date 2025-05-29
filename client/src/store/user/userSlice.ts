import { UserSignupDTO } from "@/models/DTO/UserDTO";
import { LoginCredentials, User } from "@/models/User";
import authService from "@/services/userService";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ErrorHandler } from "@/utils/errorHandler";

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  forgotPasswordStatus: "idle" | "loading" | "succeeded" | "failed";
  forgotPasswordError: string | null;
}

const initialState: UserState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  forgotPasswordStatus: "idle",
  forgotPasswordError: null,
};

export const loginUser = createAsyncThunk(
  "user/login",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
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
  async (userData: UserSignupDTO, { rejectWithValue }) => {
    try {
      const data = await authService.signup(userData);
      // TODO: Handle the response as needed
      return data as User;
    } catch (error) {
      //The error handling is done in the slice
      //error will be passed to the ActionPayload
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

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: state => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      // localStorage.removeItem('user'); // Clear local storage
    },
    // Reset forgot password state
    resetForgotPasswordState: state => {
      state.forgotPasswordStatus = "idle";
      state.forgotPasswordError = null;
    },
  },
  extraReducers: builder => {
    builder
      // Handle login thunk
      .addCase(loginUser.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload || "Login failed";
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
      .addCase(signupUser.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.isLoading = false;
        state.error = action.payload || "Signup failed";
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
      .addCase(
        requestPasswordReset.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.forgotPasswordStatus = "failed";
          state.forgotPasswordError = action.payload || "Failed to send reset link";
        }
      );
  },
});

export const { logout, resetForgotPasswordState } = userSlice.actions;

export default userSlice.reducer;
