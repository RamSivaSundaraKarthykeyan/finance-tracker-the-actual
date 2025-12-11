import connectDB from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const connection = await connectDB();

    // Check if the connection is successful and ready
    if (connection.connections[0].readyState === 1) {
      console.log("✅ Database connection successful!");
      return NextResponse.json({
        message: "Database connection successful!",
        status: connection.connections[0].readyState,
      });
    } else {
      throw new Error("Database not ready.");
    }
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return NextResponse.json(
      {
        message: "Database connection failed",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
