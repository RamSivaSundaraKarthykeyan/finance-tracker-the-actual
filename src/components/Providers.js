// src/components/Providers.js
"use client";

import { SessionProvider } from "next-auth/react";

/**
 * Providers is a client component wrapper that provides the NextAuth session context
 * to the entire application.
 */
export default function Providers({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
