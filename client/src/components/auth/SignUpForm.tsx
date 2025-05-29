"use client";

import React, { useEffect, useState } from "react";
import { TextField } from "../ui/textinput";
import Link from "next/link";
import { Button } from "../ui/button";
import { useAuthSession, useSignup } from "@/hooks/useUser";
import { UserSignupDTO } from "@/models/DTO/UserDTO";
import LoadingSpinner from "../ui/loading";
import { UserRole } from "@/constants";

export default function SignUpForm({ onSignUp }: { onSignUp: () => void }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>(UserRole.USER);
  const { user } = useAuthSession();
  const { signup, error: _error, isLoading } = useSignup();

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setUsername(e.target.value);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const signupData: UserSignupDTO = {
      email,
      password,
      username,
      role,
    };
    signup(signupData);
  };

  useEffect(() => {
    if (user) {
      onSignUp();
    }
  }, [user, onSignUp]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="w-[400px] p-8 rounded-lg shadow-lg bg-white">
      <h2 className="text-sm font-semibold text-gray-500 mb-2">LETS GET YOU STARTED</h2>
      <h1 className="text-2xl font-bold mb-6">Create an Account</h1>

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

        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <TextField
            placeholder="Username"
            id="username"
            className="mt-1"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <select
            id="role"
            className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            value={role}
            onChange={e => setRole(Number(e.target.value) as UserRole)}
          >
            <option value={UserRole.USER}>User</option>
            <option value={UserRole.ORGANIZER}>Organizer</option>
          </select>
        </div>

        <Button onClick={handleSubmit} type="submit" disabled={isLoading}>
          {isLoading ? "CREATING ACCOUNT..." : "GET STARTED"}
        </Button>
      </form>

      <div className="flex items-center my-4">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="px-2 text-sm text-gray-500">OR</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-black font-bold hover:underline">
          LOGIN
        </Link>
      </p>
    </div>
  );
}
