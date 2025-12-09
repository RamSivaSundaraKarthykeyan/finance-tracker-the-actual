"use client";
import { IoIosClose } from "react-icons/io";
import { useState } from "react";
import Modal from "./Modal";

const AddIncome = () => {
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
    if (!formData.source || !formData.amount || !formData.date) {
      alert("Please fill in all required fields.");
      return;
    }

    const newIncome = {
      id: Date.now(),
      amount: parseFloat(formData.amount),
      source: formData.source,
      date: formData.date,
      description: formData.description,
      type: "income",
    };

    const existingData =
      JSON.parse(localStorage.getItem("financeTrackerData")) || [];

    existingData.push(newIncome);
    localStorage.setItem("financeTrackerData", JSON.stringify(existingData));

    setFormData({ source: "", amount: "", date: "", description: "" });
    setOpen(false);

    console.log("Data saved:", newIncome);
  };

  return (
    <div>
      <button
        className="bg-lightBlue text-white px-4 py-2 rounded-md hover:bg-darkBlue transition-colors"
        onClick={() => {
          setOpen(true);
        }}
      >
        + Add income
      </button>
      <Modal open={open} onClose={() => setOpen(false)}>
        {/* Modal Content Wrapper - This replaces the placeholder button */}
        <div
          className="bg-white rounded-xl shadow-2xl overflow-hidden w-[500px]"
          onClick={(e) => e.stopPropagation()} // Stop propagation to prevent closing on content click
        >
          {/* Modal Header */}
          <div className="border-b border-darkBlue flex justify-between items-center py-4 px-6 mb-6">
            <p className="font-semibold text-gray-800 text-2xl ">Add Income</p>
            <IoIosClose
              color="black"
              size="36"
              className="cursor-pointer hover:text-red-500"
              onClick={() => setOpen(false)}
            />
          </div>

          {/* Form Fields */}
          <div className="px-6 pb-6 space-y-4">
            {/* 1. Income Source */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Income Source:
              </label>
              <input
                type="text"
                name="source"
                value={formData.source}
                onChange={handleChange}
                placeholder="e.g., Salary, Freelance"
                className="w-full border text-black border-darkBlue p-2 rounded-md focus:ring-lightBlue focus:border-lightBlue"
              />
            </div>

            {/* 2. Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount ($):
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="e.g., 5000"
                className="w-full border text-black border-gray-300 p-2 rounded-md focus:ring-lightBlue focus:border-lightBlue"
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
                className="w-full border text-black border-gray-300 p-2 rounded-md focus:ring-lightBlue focus:border-lightBlue"
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
                className="px-4 py-2 bg-lightBlue text-white rounded-lg hover:bg-darkBlue transition-colors"
              >
                Save Income
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AddIncome;
