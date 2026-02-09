// src/components/Providers.js
"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/context/ThemeContext";

/**
 * Providers is a client component wrapper that provides the NextAuth session context
 * and Theme context to the entire application.
 */
export default function Providers({ children }) {
  return (
    <SessionProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </SessionProvider>
  );
}
