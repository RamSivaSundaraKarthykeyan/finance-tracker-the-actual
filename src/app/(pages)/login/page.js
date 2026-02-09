"use client";

import AuthStatus from "@/components/AuthStatus";
import Link from "next/link";
import { FaEyeSlash } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

const LoginPage = () => {
  return (
    <div className="flex flex-col items-center px-4">
      {/* Login Form Container */}
      <div className="w-full max-w-md border border-lightBlue rounded-xl justify-center items-center flex flex-col p-6 md:p-10 mt-16 md:mt-32 mx-auto shadow-lg bg-white">
        <p className="text-darkBlue text-xl md:text-2xl font-semibold">
          Login To Continue
        </p>

        {/* --- Static Email/Password Form (Future Implementation) --- */}
        <div className="mt-6 w-full">
          <p className="text-black font-medium text-base md:text-lg">Email:</p>
          <input
            placeholder="Enter Your Email"
            className="text-black placeholder-gray-400 border-2 rounded-lg border-lightBlue w-full h-10 pl-4 mt-2 focus:ring-2 focus:ring-lightBlue outline-none"
          ></input>
        </div>
        <div className="mt-4 w-full">
          <p className="text-black font-medium text-base md:text-lg">Password:</p>
          <div className="flex items-center relative">
            <input
              placeholder="Password"
              type="password"
              className="text-black placeholder-gray-400 border-2 rounded-lg border-lightBlue w-full h-10 pl-4 mt-2 focus:ring-2 focus:ring-lightBlue outline-none"
            ></input>
            <FaEyeSlash
              color="#7c7c7c"
              className="absolute right-4 top-4 size-5"
            />
          </div>
        </div>
        <button className="bg-lightBlue w-full rounded-lg h-10 text-base md:text-lg font-semibold text-white hover:bg-darkBlue transition duration-300 shadow-md mt-6">
          Login
        </button>
        {/* --- END Static Form --- */}

        {/* Divider */}
        <div className="w-full flex items-center mt-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-500 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Google Sign-In Button */}
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })} // Redirects to Dashboard after successful sign-in
          className="bg-white w-full rounded-lg h-10 text-base md:text-lg font-semibold text-black border border-gray-300 hover:border-black transition duration-300 shadow-sm mt-6 flex items-center justify-center gap-3"
        >
          <FcGoogle className="size-5" />
          Continue with Google
        </button>

        <div className="flex gap-1.5 mt-8 items-center">
          <p className="text-sm md:text-base text-gray-600">
            Don&apos;t have an account?
          </p>
          <Link
            href="/signup"
            className="text-darkBlue font-bold hover:underline transition duration-300 text-sm md:text-base"
          >
            SignUp
          </Link>
        </div>
      </div>
      {/* Removed AuthStatus as its primary function is now handled by the login flow */}
    </div>
  );
};

export default LoginPage;
