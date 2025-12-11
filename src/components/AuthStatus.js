// src/components/AuthStatus.js
"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function AuthStatus() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading authentication status...</div>;
  }

  if (session) {
    return (
      <div
        style={{ padding: "10px", border: "1px solid green", margin: "20px" }}
      >
        <p>
          ✅ Logged in as: <strong>{session.user.email}</strong>
        </p>
        <p>Status: Authenticated</p>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "10px", border: "1px solid red", margin: "20px" }}>
      <p>❌ Not logged in.</p>
      {/* signIn('google') tells NextAuth to start the Google OAuth flow */}
      <button onClick={() => signIn("google")}>Sign in with Google</button>
    </div>
  );
}
