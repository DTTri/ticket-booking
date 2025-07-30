import { RootState } from "../store";

export const selectAuthUser = (state: RootState) => state.user.user;
export const selectAllUsers = (state: RootState) => state.user.users;
export const selectIsAuthenticated = (state: RootState) => state.user.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.user.isLoading;
export const selectAuthError = (state: RootState) => state.user.error;
export const selectForgotPasswordStatus = (state: RootState) => state.user.forgotPasswordStatus;
export const selectForgotPasswordError = (state: RootState) => state.user.forgotPasswordError;
