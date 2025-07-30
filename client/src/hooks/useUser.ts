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
  selectAllUsers,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  selectForgotPasswordStatus,
  selectForgotPasswordError,
} from "@/store/user/userSelector";
import { LoginDTO, SignupDTO } from "@/services/types/authTypes";

/**
 * Hook to get current authentication session data.
 */
export const useAuthSession = () => {
  const user = useAppSelector(selectAuthUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  return { user, isAuthenticated };
};

export const useUsers = () => {
  const users = useAppSelector(selectAllUsers);
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  return { users, isLoading, error };
};


export const useLogin = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const login = useCallback(
    async (credentials: LoginDTO) => {
      return dispatch(loginUser(credentials)).unwrap();
    },
    [dispatch]
  );

  return { login, isLoading, error, isAuthenticated };
};

export const useSignup = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  const signup = useCallback(
    async (userData: SignupDTO) => {
      return dispatch(signupUser(userData)).unwrap();
    },
    [dispatch]
  );

  return { signup, isLoading, error };
};

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const logout = useCallback(() => {
    dispatch(logoutActionCreator());
  }, [dispatch]);

  return { logout };
};

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
