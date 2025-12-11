"use client";
import React, { useState } from "react";
import { IoIosClose } from "react-icons/io";
import Modal from "./Modal";
import { useSession } from "next-auth/react";
import { addTransaction } from "@/actions/transactionActions";

const AddExpense = ({ onSaveSuccess }) => {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    source: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    // Basic Validation
    if (!formData.source || !formData.amount || !formData.date) {
      alert("Please fill in all required fields.");
      return;
    }
    const parsedAmount = parseFloat(formData.amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    const transactionData = {
      amount: parsedAmount,
      source: formData.source,
      date: formData.date,
      description: formData.description,
      type: "expense",
    };

    let saveSuccessful = false;

    if (session) {
      // 1. LOGGED IN: Save to MongoDB via Server Action
      console.log("Saving expense to MongoDB...");
      const result = await addTransaction(transactionData);

      if (result.success) {
        saveSuccessful = true;
      } else {
        alert("Failed to save expense to the cloud: " + result.error);
      }
    } else {
      // 2. LOGGED OUT: Save to Local Storage
      console.log("Saving expense to Local Storage...");
      const newTransaction = {
        ...transactionData,
        id: Date.now(),
      };

      const existingData =
        JSON.parse(localStorage.getItem("financeTrackerData")) || [];

      existingData.push(newTransaction);
      localStorage.setItem("financeTrackerData", JSON.stringify(existingData));
      saveSuccessful = true;
    }

    if (saveSuccessful) {
      // Reset form and close modal
      setFormData({
        source: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        description: "",
      });
      setOpen(false);

      if (onSaveSuccess) {
        onSaveSuccess();
      }
    }
  };

  return (
    <div>
      <button
        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
        onClick={() => setOpen(true)}
      >
        + Add Expense
      </button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <div
          className="bg-white rounded-xl shadow-2xl overflow-hidden w-[500px] z-50 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="border-b border-gray-200 flex justify-between items-center py-4 px-6 mb-6">
            <p className="font-semibold text-gray-800 text-2xl">Add Expense</p>
            <IoIosClose
              color="black"
              size="36"
              className="cursor-pointer hover:text-red-500"
              onClick={() => setOpen(false)}
            />
          </div>

          <div className="px-6 pb-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expense Source:
              </label>
              <input
                type="text"
                name="source"
                value={formData.source}
                onChange={handleChange}
                placeholder="e.g., Groceries, Rent, Fuel"
                className="w-full border border-gray-300 p-2 rounded-md focus:ring-red-500 focus:border-red-500 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (₹):
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="e.g., 5000"
                className="w-full border border-gray-300 p-2 rounded-md focus:ring-red-500 focus:border-red-500 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date:
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-md focus:ring-red-500 focus:border-red-500 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional):
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="e.g., Monthly utility payment"
                className="w-full border border-gray-300 p-2 rounded-md focus:ring-red-500 focus:border-red-500 text-gray-900"
              />
            </div>

            <div className="flex justify-end pt-4 space-x-3">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-white rounded-lg transition-colors bg-red-500 hover:bg-red-700"
              >
                Save Expense
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AddExpense;
