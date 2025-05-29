"use client";

import React, { useState } from "react";
import { TextField } from "../ui/textinput";
import Link from "next/link";
import { Button } from "../ui/button";
import { useForgotPassword } from "@/hooks/useUser";

export default function ForgotPasswordForm({
  onResetRequest: _onResetRequest,
}: {
  onResetRequest: (_email: string) => void;
}) {
  // Use the callback to avoid lint errors
  void _onResetRequest;
  const [email, setEmail] = useState("");

  const { request, resetState, status, error: forgotPasswordErrorHook } = useForgotPassword();
  const isSubmitted = status === "succeeded";

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      try {
        await request(email);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error("Forgot password request failed: ", errorMessage);
      }
    }
  };

  return (
    <div className="w-[400px] p-8 rounded-lg shadow-lg bg-white">
      {!isSubmitted ? (
        <>
          <h2 className="text-sm font-semibold text-gray-500 mb-2">PASSWORD RECOVERY</h2>
          <h1 className="text-2xl font-bold mb-2">Forgot Password</h1>
          <p className="text-gray-600 text-sm mb-6">
            Enter your email address and we&apos;ll send you a link to reset your password
          </p>

          <form className="flex flex-col gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <TextField
                placeholder="Enter your email"
                id="email"
                type="email"
                className="mt-1"
                value={email}
                onChange={handleEmailChange}
                required
              />
            </div>
            <Button
              type="submit"
              onClick={handleSubmit}
              className="w-full mt-4"
              disabled={status === "loading"}
            >
              SEND RESET LINK
            </Button>
          </form>
        </>
      ) : (
        <div className="text-center py-4">
          <div className="mb-4 mx-auto w-16 h-16 bg-[#E8F5E9] rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-[#2ECC71]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2">Check your inbox</h2>
          <p className="text-gray-600 mb-4">
            We&apos;ve sent a password reset link to: <br />
            <span className="font-semibold">{email}</span>
          </p>
          <p className="text-sm text-gray-500">
            Didn&apos;t receive the email? Check your spam folder or{" "}
            <button
              onClick={resetState}
              className="text-[#2ECC71] hover:underline cursor-pointer font-semibold"
            >
              try again
            </button>
          </p>
        </div>
      )}

      <div className="flex items-center my-4">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="px-2 text-sm text-gray-500">OR</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <p className="text-center text-sm text-gray-500">
        <Link href="/auth/login" className="text-black font-bold hover:underline">
          LOGIN
        </Link>{" "}
        OR{" "}
        <Link href="/auth/signup" className="text-black font-bold hover:underline">
          SIGN UP
        </Link>
        {status === "failed" && forgotPasswordErrorHook && (
          <p className="text-red-500 text-sm text-center mt-4">{forgotPasswordErrorHook}</p>
        )}
      </p>
    </div>
  );
}
