"use client";

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  loginUser,
  signupUser,
  logout as logoutActionCreator,
  requestPasswordReset,
  resetForgotPasswordState as resetForgotPasswordStateActionCreator,
} from "@/store/user/userSlice";
import {
  selectAuthUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  selectForgotPasswordStatus,
  selectForgotPasswordError,
} from "@/store/user/userSelector";
import type { LoginCredentials } from "@/models/User";
import type { UserSignupDTO } from "@/models/DTO/UserDTO";

/**
 * Hook to get current authentication session data.
 */
export const useAuthSession = () => {
  const user = useAppSelector(selectAuthUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  return { user, isAuthenticated };
};

/**
 * Hook for handling user login.
 * Returns a login function and the current loading/error/authentication state.
 */
export const useLogin = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      // .unwrap() will return a promise that either resolves with the action.payload or rejects with action.payload or action.error
      return dispatch(loginUser(credentials)).unwrap();
    },
    [dispatch]
  );

  return { login, isLoading, error, isAuthenticated };
};

/**
 * Hook for handling user signup.
 * Returns a signup function and the current loading/error state.
 */
export const useSignup = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  const signup = useCallback(
    async (userData: UserSignupDTO) => {
      return dispatch(signupUser(userData)).unwrap();
    },
    [dispatch]
  );

  return { signup, isLoading, error };
};

/**
 * Hook for handling user logout.
 */
export const useLogout = () => {
  const dispatch = useAppDispatch();
  const logout = useCallback(() => {
    dispatch(logoutActionCreator());
  }, [dispatch]);

  return { logout };
};

/**
 * Hook for handling forgot password functionality.
 */
export const useForgotPassword = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectForgotPasswordStatus);
  const error = useAppSelector(selectForgotPasswordError);

  const submitForgotPasswordRequest = useCallback(
    async (email: string) => {
      return dispatch(requestPasswordReset(email)).unwrap();
    },
    [dispatch]
  );

  const resetForgotPasswordFlow = useCallback(() => {
    dispatch(resetForgotPasswordStateActionCreator());
  }, [dispatch]);

  return {
    request: submitForgotPasswordRequest,
    resetState: resetForgotPasswordFlow,
    status,
    error,
  };
};
