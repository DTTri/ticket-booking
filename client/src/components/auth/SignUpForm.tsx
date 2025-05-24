"use client";

import React, { useEffect, useState } from "react";
import { TextField } from "../ui/textinput";
import Link from "next/link";
import { Button } from "../ui/button";
import { useAuthSession, useSignup } from "@/hooks/useUser";
import { UserSignupDTO } from "@/models/DTO/UserDTO";
import LoadingSpinner from "../ui/loading";

export default function SignUpForm({ onSignUp }: { onSignUp: () => void }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { user } = useAuthSession();
  const { signup, error: _error, isLoading } = useSignup();

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFirstName(e.target.value);
  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setLastName(e.target.value);
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const signupData: UserSignupDTO = {
        email,
        password,
        firstName,
        lastName,
      };
      await signup(signupData);
    } catch (signupError: any) {
      console.error("Signup failed: ", signupError.message || signupError);
    }
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
      <h2 className="text-sm font-semibold text-gray-500 mb-2">LET'S GET YOU STARTED</h2>
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
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <TextField
            placeholder="First name"
            id="firstName"
            className="mt-1"
            value={firstName}
            onChange={handleFirstNameChange}
          />
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <TextField
            placeholder="Last Name"
            id="lastName"
            className="mt-1"
            value={lastName}
            onChange={handleLastNameChange}
          />
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
