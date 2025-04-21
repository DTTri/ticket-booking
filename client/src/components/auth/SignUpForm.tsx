import React, { useState } from "react";
import { TextField } from "../ui/textinput";
import Link from "next/link";

export default function SignUpForm({
    onSignUp,
    }: {
    onSignUp: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value);
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);

  return (
    <div className="w-[400px] p-8 rounded-lg shadow-lg bg-white">
      <h2 className="text-sm font-semibold text-gray-500 mb-2">LET'S GET YOU STARTED</h2>
      <h1 className="text-2xl font-bold mb-6">Create an Account</h1>

      <form className="flex flex-col gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Your Name
          </label>
          <TextField
            placeholder="Name"
            id="name"
            className="mt-1"
            value={name}
            onChange={handleNameChange}
          />
        </div>

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

        <button
          type="submit"
          className="w-full bg-[#2ECC71] text-white font-bold py-2 rounded-md hover:bg-[#28b767] transition"
        >
          GET STARTED
        </button>
      </form>

      <div className="flex items-center my-4">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="px-2 text-sm text-gray-500">OR</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-black font-bold hover:underline">
          LOGIN HERE
        </Link>
      </p>
    </div>
  );
}
