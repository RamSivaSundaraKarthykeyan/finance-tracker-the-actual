import mongoose from "mongoose";

// Destructure Schema for cleaner code
const { Schema, models, model } = mongoose;

const TransactionSchema = new Schema(
  {
    // The link to the user, crucial for multi-user architecture.
    // This will store the email from the NextAuth session (session.user.email).
    userId: {
      type: String,
      required: true,
      index: true, // Indexing this field dramatically speeds up queries (e.g., fetching all transactions for a user)
    },
    // Required fields for the financial record
    source: {
      type: String,
      required: [true, "Source is required (e.g., Salary, Rent)"],
      trim: true,
      maxlength: 100,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount must be a positive value"],
    },
    // The core field to distinguish Income vs. Expense
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    // Optional field
    description: {
      type: String,
      trim: true,
      maxlength: 200,
    },
  },
  {
    // Mongoose option to automatically add 'createdAt' and 'updatedAt' timestamps
    timestamps: true,
  }
);

// We export the model using 'models.Transaction' or creating a new one.
// This prevents Mongoose from trying to re-register the model on hot reload.
export default models.Transaction || model("Transaction", TransactionSchema);
