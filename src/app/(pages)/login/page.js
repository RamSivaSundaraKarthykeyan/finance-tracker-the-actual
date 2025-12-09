import Link from "next/link";
import React from "react";
import { FaEyeSlash } from "react-icons/fa";

const login = () => {
  return (
    <div>
      <div className="w-100 border border-lightBlue rounded-xl justify-center items-center flex flex-col p-10 mt-32 mx-auto shadow-lg/50">
        <p className="text-darkBlue text-2xl font-semibold">
          Login To Continue
        </p>
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
        <button className="bg-lightBlue w-80 rounded-lg h-10 text-lg font-semibold text-white hover:bg-darkBlue transition duration-300 shadow-md/50 mt-4">
          Login
        </button>
        <div className="flex gap-1.5 mt-6">
          <p className="font-semibold text-black">
            Don&apos;t have an account?
          </p>
          <Link
            href="/signup"
            className="text-lightBlue font-semibold hover:underline transistion duration-900"
          >
            SignUp
          </Link>
        </div>
      </div>
    </div>
  );
};

export default login;
