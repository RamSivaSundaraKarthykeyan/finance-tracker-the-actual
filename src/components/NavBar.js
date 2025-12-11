"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

const NavBar = () => {
  const { data: session } = useSession();

  const AuthButtons = () => {
    if (session) {
      return (
        <button
          onClick={() => signOut({ callbackUrl: "/login" })} // Redirect to /login after logout
          className="bg-red-500 py-1 px-6 rounded-md text-white font-semibold hover:bg-red-600 transition duration-300"
        >
          Logout
        </button>
      );
    } else {
      return (
        <>
          <Link
            href="/login"
            className="bg-lightBlue py-1 px-6 rounded-md hover:mt-2 transition duration-300"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="bg-lightBlue py-1 px-6 rounded-md hover:mt-2 transition duration-300"
          >
            Sign up
          </Link>
        </>
      );
    }
  };

  return (
    <div className="text-white">
      {" "}
      {/* Ensure text color is white for visibility */}
      <div className="bg-darkBlue flex justify-between items-center h-20">
        {/* Left Side: Logo */}
        <Link href="/" className="font-bold text-xl pl-12">
          Finance Tracker
        </Link>

        {/* Center: Navigation Links */}
        <div className="flex justify-center gap-10 text-lg">
          {" "}
          {/* Adjusted gap for better spacing */}
          <Link
            href="/dashboard"
            className="hover:text-lightBlue transition duration-300"
          >
            Dashboard
          </Link>
          <Link
            href="/income"
            className="hover:text-lightBlue transition duration-300"
          >
            Income
          </Link>
          <Link
            href="/expense"
            className="hover:text-lightBlue transition duration-300"
          >
            Expense
          </Link>
        </div>

        {/* Right Side: Conditional Auth Buttons */}
        <div className="flex gap-10 justify-end pr-12">
          <AuthButtons />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
