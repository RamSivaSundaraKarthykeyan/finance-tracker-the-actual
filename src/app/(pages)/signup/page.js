"use client";

import { FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc"; // Google Icon

const SignupPage = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-100 border border-lightBlue rounded-xl justify-center items-center flex flex-col p-10 mt-32 mx-auto shadow-lg/50">
        <p className="text-darkBlue text-2xl font-semibold">SignUp</p>

        {/* --- Static Email/Password Form (Future Implementation) --- */}
        <div className="mt-6">
          <p className="text-black font-medium text-lg">Name:</p>
          <input
            placeholder="Enter Your Name"
            className="text-black placeholder-#[#7c7c7c] border-2 rounded-lg border-lightBlue w-80 h-10 pl-4 mt-2"
          ></input>
        </div>
        <div className="mt-6">
          <p className="text-black font-medium text-lg">Email:</p>
          <input
            placeholder="Enter Your Email"
            className="text-black placeholder-#[#7c7c7c] border-2 rounded-lg border-lightBlue w-80 h-10 pl-4 mt-2"
          ></input>
        </div>
        <div className="mt-4 pl-6">
          <p className="text-black font-medium text-lg">Password:</p>
          <div className="flex items-center">
            <input
              placeholder="Password"
              type="password"
              className="text-black placeholder-#[#7c7c7c] border-2 rounded-lg border-lightBlue w-80 h-10 pl-4 mt-2"
            ></input>
            <FaEyeSlash
              color="#7c7c7c"
              className="relative top-1 right-8 size-6"
            />
          </div>
        </div>
        <div className="mt-4">
          <p className="text-black font-medium text-lg">Confirm Password:</p>
          <div className="flex items-center">
            <input
              placeholder="Enter your password again"
              type="password"
              className="text-black placeholder-#[#7c7c7c] border-2 rounded-lg border-lightBlue w-80 h-10 pl-4 mt-2"
            ></input>
          </div>
        </div>
        <button className="bg-lightBlue w-80 rounded-lg h-10 text-lg font-semibold text-white hover:bg-darkBlue transition duration-300 shadow-md/50 mt-4">
          SighUp
        </button>
        {/* --- END Static Form --- */}

        {/* Divider */}
        <div className="w-80 flex items-center mt-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-500 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Google Sign-In Button */}
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })} // Redirects to Dashboard after successful sign-up/login
          className="bg-white w-80 rounded-lg h-10 text-lg font-semibold text-black border border-gray-300 hover:border-black hover:text-white hover:bg-black transition duration-300 shadow-md/50 mt-4 flex items-center justify-center gap-3"
        >
          <FcGoogle className="size-5" />
          Continue with Google
        </button>

        <div className="flex gap-1.5 mt-6">
          <p className="font-semibold text-black">Already have an account?</p>
          <Link
            href="/login"
            className="text-darkBlue font-bold hover:underline transition duration-900"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
