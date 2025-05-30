"use client";

import { useState } from "react";
import { TextField } from "../ui/textinput";
import Link from "next/link";
import { Button } from "../ui/button";
import { useLogin } from "@/hooks/useUser";

export default function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);

  const {
    login: _login,
    isLoading: _isLoading,
    error: _error,
    isAuthenticated: _isAuthenticated,
  } = useLogin();

  // Use the variables to avoid lint errors
  void _isLoading;
  void _error;
  void _isAuthenticated;

  const _handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    _login({ email, password });
    onLogin();
  };

  return (
    <div className="w-[400px] p-8 rounded-lg shadow-lg bg-white">
      <h2 className="text-sm font-semibold text-gray-500 mb-2">LET&apos;S GET YOU STARTED</h2>
      <h1 className="text-2xl font-bold mb-6">Login</h1>

      <form className="flex flex-col gap-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <TextField
            placeholder="Email"
            id="email"
            className="mt-1"
            value={email}
            onChange={handleEmailChange}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <TextField
            placeholder="Password"
            id="password"
            type="password"
            className="mt-1"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>

        <Button type="submit" onClick={_handleSubmit}>
          LOGIN
        </Button>
      </form>

      <div className="flex items-center my-4">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="px-2 text-sm text-gray-500">OR</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <p className="text-center text-sm text-gray-500">
        <Link href="/auth/signup" className="text-black font-bold hover:underline">
          SIGN UP
        </Link>{" "}
        OR{" "}
        <Link href="/auth/forgot-password" className="text-black font-bold hover:underline">
          FORGOT PASSWORD
        </Link>
      </p>
    </div>
  );
}
