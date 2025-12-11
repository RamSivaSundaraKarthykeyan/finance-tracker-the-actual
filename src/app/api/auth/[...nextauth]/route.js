import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Define the core options object which is also exported
export const authOptions = {
  // 1. Providers: Tells NextAuth which authentication services to use
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  // 2. Secret: Used to sign and encrypt the JWT and session cookie
  secret: process.env.NEXTAUTH_SECRET,

  // 3. Callbacks (Optional but useful for custom session data)
  callbacks: {
    // This callback is executed when a session is checked
    async session({ session, token }) {
      // If we were using an Adapter, we might pull a custom userId from the DB here.
      // Since we are linking data by email, we ensure the email is present.
      if (token && session.user) {
        session.user.id = token.sub; // token.sub is the unique ID from Google
      }
      return session;
    },
  },
};

// Create the handler that Next.js uses for GET and POST requests
const handler = NextAuth(authOptions);

// Export the handlers for Next.js App Router
export { handler as GET, handler as POST };
