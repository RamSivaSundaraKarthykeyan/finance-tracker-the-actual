"use server";

import connectDB from "@/lib/db";
import Transaction from "@/models/Transaction";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // You might need to export authOptions from the route file

async function getUserId() {
  const session = await getServerSession(authOptions);
  // Return the user's email, which we use as the unique userId
  return session?.user?.email;
}

export async function addTransaction(formData) {
  const userId = await getUserId();

  if (!userId) {
    return { error: "Not authenticated. Cannot save to database." };
  }

  // NOTE: You should pass the data object, not the FormData object, from the client

  try {
    await connectDB();

    // DATA VALIDATION (Mongoose schema provides most of this, but basic check is good)
    const { source, amount, date, type, description } = formData;
    if (!source || amount === undefined || !date || !type) {
      return { error: "Missing required transaction fields." };
    }

    // CREATE LOGIC
    const newTransaction = await Transaction.create({
      userId: userId, // Securely link the record
      source,
      amount: parseFloat(amount),
      date: new Date(date),
      type,
      description,
    });

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newTransaction)),
    };
  } catch (error) {
    // Mongoose validation errors or database connection errors
    console.error("Database Save Error:", error.message);
    return { error: `Failed to add transaction: ${error.message}` };
  }
}

export async function getTransactions() {
  const userId = await getUserId();

  if (!userId) {
    // If no user is logged in, we return an error indicating the need
    // to fall back to local storage (handled by the frontend component)
    return { error: "User not authenticated. Use local storage instead." };
  }

  try {
    await connectDB();

    // FETCH LOGIC: Only retrieve transactions matching the current userId
    const transactions = await Transaction.find({ userId }).sort({
      date: -1,
      createdAt: -1,
    }); // Sort newest first

    // Mongoose objects are complex. We must serialize them before sending
    // them to the client to avoid errors.
    return {
      success: true,
      data: JSON.parse(JSON.stringify(transactions)),
    };
  } catch (error) {
    console.error("Database Fetch Error:", error);
    return { error: "Failed to fetch transactions from database." };
  }
}

export async function deleteTransaction(transactionId) {
  const userId = await getUserId();

  if (!userId) {
    return { error: "Not authenticated. Cannot delete from database." };
  }

  try {
    await connectDB();

    // DELETE LOGIC: Find and delete the transaction ONLY IF it matches BOTH the _id AND the userId
    const result = await Transaction.findOneAndDelete({
      _id: transactionId,
      userId: userId,
    });

    if (!result) {
      // This means the transaction ID was valid, but didn't belong to the user (or was already deleted)
      return {
        error: "Transaction not found or unauthorized deletion attempt.",
      };
    }

    return { success: true, message: "Transaction successfully deleted." };
  } catch (error) {
    console.error("Database Delete Error:", error);
    return { error: "Failed to delete transaction." };
  }
}
