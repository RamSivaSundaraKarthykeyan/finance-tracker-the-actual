"use client";

import AuthStatus from "@/components/AuthStatus";
import Link from "next/link";
import { FaEyeSlash } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

const LoginPage = () => {
  return (
    <div className="flex flex-col items-center px-4 bg-background min-h-screen transition-colors duration-300">
      {/* Login Form Container */}
      <div className="w-full max-w-md border border-card-border rounded-xl justify-center items-center flex flex-col p-6 md:p-10 mt-16 md:mt-32 mx-auto shadow-lg bg-card-bg transition-colors">
        <p className="text-foreground text-xl md:text-2xl font-semibold">
          Login To Continue
        </p>

        {/* --- Static Email/Password Form --- */}
        <div className="mt-6 w-full">
          <p className="text-foreground font-medium text-base md:text-lg">Email:</p>
          <input
            placeholder="Enter Your Email"
            className="text-foreground placeholder-gray-500 border-2 rounded-lg border-card-border bg-input-bg w-full h-10 pl-4 mt-2 focus:ring-2 focus:ring-lightBlue outline-none transition-colors"
          ></input>
        </div>
        <div className="mt-4 w-full">
          <p className="text-foreground font-medium text-base md:text-lg">Password:</p>
          <div className="flex items-center relative">
            <input
              placeholder="Password"
              type="password"
              className="text-foreground placeholder-gray-500 border-2 rounded-lg border-card-border bg-input-bg w-full h-10 pl-4 mt-2 focus:ring-2 focus:ring-lightBlue outline-none transition-colors"
            ></input>
            <FaEyeSlash
              className="absolute right-4 top-4 size-5 text-gray-500"
            />
          </div>
        </div>
        <button className="bg-lightBlue w-full rounded-lg h-10 text-base md:text-lg font-semibold text-white hover:bg-darkBlue transition duration-300 shadow-md mt-6">
          Login
        </button>

        {/* Divider */}
        <div className="w-full flex items-center mt-6">
          <div className="flex-grow border-t border-card-border"></div>
          <span className="flex-shrink mx-4 text-gray-500 text-sm">OR</span>
          <div className="flex-grow border-t border-card-border"></div>
        </div>

        {/* Google Sign-In Button */}
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="bg-card-bg w-full rounded-lg h-10 text-base md:text-lg font-semibold text-foreground border border-card-border hover:border-lightBlue transition duration-300 shadow-sm mt-6 flex items-center justify-center gap-3"
        >
          <FcGoogle className="size-5" />
          Continue with Google
        </button>

        <div className="flex gap-1.5 mt-8 items-center">
          <p className="text-sm md:text-base text-gray-400">
            Don&apos;t have an account?
          </p>
          <Link
            href="/signup"
            className="text-lightBlue font-bold hover:underline transition duration-300 text-sm md:text-base"
          >
            SignUp
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
