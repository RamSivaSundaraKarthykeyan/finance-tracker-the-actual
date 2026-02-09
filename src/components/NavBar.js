"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { FaSun, FaMoon } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";

const NavBar = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  const toggleMenu = () => setIsOpen(!isOpen);

  const ThemeToggle = () => (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-white/10 transition-colors text-xl"
      aria-label="Toggle Theme"
    >
      {isDarkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-300" />}
    </button>
  );

  const AuthButtons = ({ isMobile }) => {
    // ... existing AuthButtons logic ...
    // (I'll keep the logic same but it needs to be accessible inside the component)
    if (session) {
      return (
        <button
          onClick={() => {
            signOut({ callbackUrl: "/login" });
            if (isMobile) setIsOpen(false);
          }}
          className={`${isMobile ? "w-full" : ""
            } bg-red-500 py-1 px-6 rounded-md text-white font-semibold hover:bg-red-600 transition duration-300`}
        >
          Logout
        </button>
      );
    } else {
      return (
        <>
          <Link
            href="/login"
            onClick={() => isMobile && setIsOpen(false)}
            className={`${isMobile ? "w-full text-center" : ""
              } bg-lightBlue py-1 px-6 rounded-md hover:bg-lightBlue/80 transition duration-300`}
          >
            Login
          </Link>
          <Link
            href="/signup"
            onClick={() => isMobile && setIsOpen(false)}
            className={`${isMobile ? "w-full text-center" : ""
              } bg-lightBlue py-1 px-6 rounded-md hover:bg-lightBlue/80 transition duration-300 text-white`}
          >
            Sign up
          </Link>
        </>
      );
    }
  };

  return (
    <nav className="text-white bg-darkBlue relative z-50">
      <div className="bg-darkBlue flex justify-between items-center h-20 px-6 md:px-12">
        {/* Left Side: Logo */}
        <Link href="/" className="font-bold text-xl">
          Finance Tracker
        </Link>

        {/* Center: Navigation Links (Desktop Only) */}
        <div className="hidden md:flex flex-1 justify-center gap-10 text-lg">
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

        {/* Right Side: Theme Toggle & Auth (Desktop Only) */}
        <div className="hidden md:flex items-center gap-4 lg:gap-8 justify-end">
          <ThemeToggle />
          <AuthButtons isMobile={false} />
        </div>

        {/* Mobile: Hamburger & Theme Toggle */}
        <div className="md:hidden flex items-center gap-4">
          <ThemeToggle />
          <button
            onClick={toggleMenu}
            className="text-3xl focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu (Overlay) */}
      <div
        className={`${isOpen ? "flex" : "hidden"
          } md:hidden flex-col bg-darkBlue absolute top-20 left-0 w-full p-6 space-y-4 shadow-xl border-t border-white/10`}
      >
        <Link
          href="/dashboard"
          onClick={toggleMenu}
          className="text-lg hover:text-lightBlue transition duration-300"
        >
          Dashboard
        </Link>
        <Link
          href="/income"
          onClick={toggleMenu}
          className="text-lg hover:text-lightBlue transition duration-300"
        >
          Income
        </Link>
        <Link
          href="/expense"
          onClick={toggleMenu}
          className="text-lg hover:text-lightBlue transition duration-300"
        >
          Expense
        </Link>
        <hr className="border-white/10" />
        <div className="flex flex-col gap-4">
          <AuthButtons isMobile={true} />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
