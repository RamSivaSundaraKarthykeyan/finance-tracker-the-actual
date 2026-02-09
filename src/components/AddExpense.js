"use client";
import React, { useState } from "react";
import { FaPlus, FaTimes, FaWallet, FaCalendar } from "react-icons/fa";
import Modal from "./Modal";
import { useSession } from "next-auth/react";
import { addTransaction } from "@/actions/transactionActions";

const AddExpense = ({ onSaveSuccess }) => {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    source: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const parsedAmount = parseFloat(formData.amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert("Please enter a valid amount.");
      setLoading(false);
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

    try {
      if (session) {
        const result = await addTransaction(transactionData);
        if (result.success) {
          saveSuccessful = true;
        } else {
          alert("Failed to save expense: " + result.error);
        }
      } else {
        const newTransaction = {
          ...transactionData,
          id: Date.now(),
        };
        const existingData = JSON.parse(localStorage.getItem("financeTrackerData")) || [];
        existingData.push(newTransaction);
        localStorage.setItem("financeTrackerData", JSON.stringify(existingData));
        saveSuccessful = true;
      }

      if (saveSuccessful) {
        setFormData({
          source: "",
          amount: "",
          date: new Date().toISOString().split("T")[0],
          description: "",
        });
        setIsModalOpen(false);
        if (onSaveSuccess) onSaveSuccess();
      }
    } catch (error) {
      console.error("Error saving expense:", error);
      alert("An error occurred while saving.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full sm:w-auto">
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-red-600 hover:bg-red-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-red-200 active:scale-95 text-sm md:text-base w-full justify-center sm:w-auto"
      >
        <FaPlus /> <span>Add Expense</span>
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">New Expense Entry</h2>
            <button
              onClick={() => setIsModalOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <label className="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Expense Source
                </label>
                <div className="relative group">
                  <FaWallet className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="e.g. Rent, Grocery"
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl py-3 pl-12 pr-4 focus:bg-white focus:border-red-500 outline-none transition-all placeholder:text-gray-300 text-sm md:text-base text-black"
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Amount
                </label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400 group-focus-within:text-red-500">
                    ₹
                  </span>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl py-3 pl-10 pr-4 focus:bg-white focus:border-red-500 outline-none transition-all placeholder:text-gray-300 text-sm md:text-base text-black font-bold"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    step="0.01"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Date
              </label>
              <div className="relative group">
                <FaCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                <input
                  type="date"
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl py-3 pl-12 pr-4 focus:bg-white focus:border-red-500 outline-none transition-all text-sm md:text-base text-black"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Description (Optional)
              </label>
              <textarea
                placeholder="What was this for?"
                rows="3"
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl py-3 px-4 focus:bg-white focus:border-red-500 outline-none transition-all placeholder:text-gray-300 text-sm md:text-base text-black"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              ></textarea>
            </div>

            <div className="pt-4 flex flex-col md:flex-row gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors order-2 md:order-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-red-200 active:scale-95 disabled:opacity-50 disabled:scale-100 order-1 md:order-2"
              >
                {loading ? "Saving..." : "Save Expense"}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default AddExpense;
