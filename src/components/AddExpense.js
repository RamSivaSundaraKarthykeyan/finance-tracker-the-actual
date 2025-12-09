"use client";
import React, { useState } from "react";
import { IoIosClose } from "react-icons/io";
import Modal from "./Modal";

const AddExpense = ({ onSaveSuccess }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    source: "",
    date: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = () => {
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

    const newExpense = {
      id: Date.now(),
      amount: parsedAmount,
      source: formData.source,
      date: formData.date,
      description: formData.description,
      type: "expense", // CRITICAL: Set type to 'expense'
    };

    const existingData =
      JSON.parse(localStorage.getItem("financeTrackerData")) || [];

    existingData.push(newExpense);
    localStorage.setItem("financeTrackerData", JSON.stringify(existingData));

    // Reset form and close modal
    setFormData({ source: "", amount: "", date: "", description: "" });
    setOpen(false);

    if (onSaveSuccess) {
      onSaveSuccess();
    }
  };

  return (
    <div>
      {/* Use expense color (red) for the button */}
      <button
        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
        onClick={() => setOpen(true)}
      >
        + Add Expense
      </button>

      {/* The Modal component should handle high Z-index for its overlay */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <div
          // Z-INDEX FIX: Adding z-50 to ensure the modal content sits above the graph
          className="bg-white rounded-xl shadow-2xl overflow-hidden w-[500px] z-50 relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="border-b border-gray-200 flex justify-between items-center py-4 px-6 mb-6">
            <p className="font-semibold text-gray-800 text-2xl">Add Expense</p>
            <IoIosClose
              color="black"
              size="36"
              className="cursor-pointer hover:text-red-500"
              onClick={() => setOpen(false)}
            />
          </div>

          {/* Form Fields */}
          <div className="px-6 pb-6 space-y-4">
            {/* 1. Expense Source */}
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
                // TEXT COLOR FIX
                className="w-full border border-gray-300 p-2 rounded-md focus:ring-lightBlue focus:border-lightBlue text-gray-900"
              />
            </div>

            {/* 2. Amount */}
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
                // TEXT COLOR FIX
                className="w-full border border-gray-300 p-2 rounded-md focus:ring-lightBlue focus:border-lightBlue text-gray-900"
              />
            </div>

            {/* 3. Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date:
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                // TEXT COLOR FIX
                className="w-full border border-gray-300 p-2 rounded-md focus:ring-lightBlue focus:border-lightBlue text-gray-900"
              />
            </div>

            {/* 4. Description */}
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
                // TEXT COLOR FIX
                className="w-full border border-gray-300 p-2 rounded-md focus:ring-lightBlue focus:border-lightBlue text-gray-900"
              />
            </div>

            {/* Footer/Action Buttons */}
            <div className="flex justify-end pt-4 space-x-3">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                // BUTTON COLOR FIX: Using inline styles for specified hex codes for expenses (e.g., Red)
                style={{ backgroundColor: "#2566b1" }} // Using the blue theme color for consistency in modal button style
                className="px-4 py-2 text-white rounded-lg transition-colors hover:bg-[#141e59]"
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
