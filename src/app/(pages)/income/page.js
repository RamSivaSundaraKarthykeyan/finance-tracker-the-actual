"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import AddIncome from "@/components/AddIncome";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FaMoneyBillWave, FaTrash } from "react-icons/fa";

// Constants for Graph presentation
const BAR_WIDTH = 100;
const PADDING_FOR_MAX = 1.2;

const Income = () => {
  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [yAxisDomain, setYAxisDomain] = useState([0, 100]);
  const scrollContainerRef = useRef(null);

  // Helper function for Rupee formatting
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Helper to check if data item is valid
  const isValidIncome = (item) => {
    return (
      item.type === "income" &&
      item.source &&
      !isNaN(parseFloat(item.amount)) &&
      parseFloat(item.amount) > 0 &&
      !isNaN(new Date(item.date))
    );
  };

  // Memoized function for processing chart data
  const processChartData = useCallback((data) => {
    const groupedByDay = {};

    data.forEach((item) => {
      const amount = parseFloat(item.amount);
      const dateObj = new Date(item.date);

      const day = dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      if (!groupedByDay[day]) {
        groupedByDay[day] = 0;
      }
      groupedByDay[day] += amount;
    });

    const chartArray = Object.keys(groupedByDay).map((key) => ({
      day: key,
      amount: groupedByDay[key],
    }));

    setChartData(chartArray);

    // Calculate Y-axis domain
    if (chartArray.length > 0) {
      const maxAmount = Math.max(...chartArray.map((d) => d.amount));
      const maxDomain = Math.ceil((maxAmount * PADDING_FOR_MAX) / 1000) * 1000;
      setYAxisDomain([0, maxDomain]);
    } else {
      setYAxisDomain([0, 100]);
    }
  }, []);

  // Function to load and refresh data (called on mount and after save/delete)
  const loadData = useCallback(() => {
    const savedData =
      JSON.parse(localStorage.getItem("financeTrackerData")) || [];

    const incomes = savedData.filter(isValidIncome);

    // Sort by date (oldest to newest)
    incomes.sort((a, b) => new Date(a.date) - new Date(b.date));

    setTransactions(incomes);
    processChartData(incomes);
  }, [processChartData]);

  // Handle Deletion
  const handleDelete = (id) => {
    const existingData =
      JSON.parse(localStorage.getItem("financeTrackerData")) || [];

    const updatedData = existingData.filter((item) => item.id !== id);

    localStorage.setItem("financeTrackerData", JSON.stringify(updatedData));

    loadData();
  };

  // Initial Data Load and Refresh Handler
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Auto-scroll graph to the end (latest dates) on load/refresh
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft =
        scrollContainerRef.current.scrollWidth;
    }
  }, [chartData]);

  // Custom Tooltip for the Graph
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-md rounded-md text-sm">
          <p className="font-semibold text-black">{label}</p>
          <p className="text-blue-600 font-bold">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  // Logic to render the Status Badge (Percentage Difference from Previous Entry)
  const getStatusBadge = (item, index) => {
    // We reverse the array for display, so index 0 is the newest.
    // The previous item is at index + 1 in the *reversed* display list.
    const reversedTransactions = transactions.slice().reverse();
    const originalIndex = transactions.length - 1 - index;

    // The first item (newest) has no previous entry to compare against
    if (originalIndex === 0) {
      return (
        <span className="bg-gray-100 border border-gray-300 px-4 py-1 rounded-full text-sm font-semibold text-gray-600 shadow-sm">
          New Entry
        </span>
      );
    }

    const currentAmount = parseFloat(item.amount) || 0;
    // Get the chronologically previous item (transactions are sorted oldest to newest)
    const previousItem = transactions[originalIndex - 1];
    const previousAmount = parseFloat(previousItem?.amount) || 0;

    if (previousAmount === 0 || currentAmount === 0) {
      return (
        <span className="bg-gray-100 border border-gray-300 px-4 py-1 rounded-full text-sm font-semibold text-gray-600 shadow-sm">
          N/A
        </span>
      );
    }

    const difference = currentAmount - previousAmount;
    const percentageChange = (difference / previousAmount) * 100;

    const isIncrease = difference > 0;
    const isFlat = difference === 0;

    if (isFlat) {
      return (
        <span className="bg-gray-100 border border-gray-300 px-4 py-1 rounded-full text-sm font-semibold text-gray-600 shadow-sm">
          No Change
        </span>
      );
    }

    const badgeColor = isIncrease
      ? "bg-green-100 border-green-300 text-green-600"
      : "bg-red-100 border-red-300 text-red-600";
    const directionIcon = isIncrease ? "▲" : "▼";
    const formattedPercent = Math.abs(percentageChange).toFixed(1);

    return (
      <span
        className={`border ${badgeColor} px-4 py-1 rounded-full text-sm font-semibold shadow-sm`}
      >
        {directionIcon} {formattedPercent}%
      </span>
    );
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Income Overview</h1>
          <p className="text-gray-500">Track your earnings over time</p>
        </div>
        <AddIncome onSaveSuccess={loadData} />
      </div>

      {/* ------------------- 1. DYNAMIC GRAPH SECTION ------------------- */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-darkBlue mb-8">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Analytics</h2>
        </div>

        {/* Scrollable Container for Horizontal History */}
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto pb-4 scrollbar-hide"
          style={{ cursor: "pointer" }}
        >
          {chartData.length === 0 ? (
            // Empty State / No Data Message
            <div className="text-center py-20 bg-gray-100 rounded-lg">
              <p className="text-gray-600 text-xl font-medium">
                Enter new data to get started and view your income trends!
              </p>
              <p className="text-gray-400 mt-2">
                Click &apos;+ Add Income&apos; to create your first entry.
              </p>
            </div>
          ) : (
            <div
              style={{
                width: `${Math.max(800, chartData.length * BAR_WIDTH)}px`,
                height: "350px",
                paddingTop: "20px",
                paddingBottom: "20px",
                paddingLeft: "20px",
                paddingRight: "20px",
                borderRadius: "16px",
                background: "#f2eeee",
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barSize={60}>
                  {/* Y-Axis: Shows dynamic Rupee range */}
                  <YAxis
                    domain={yAxisDomain}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => formatCurrency(value)}
                  />
                  {/* X-Axis: Shows Date */}
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6B7280", fontSize: 14, dy: 10 }}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "transparent" }}
                  />
                  <Bar
                    dataKey="amount"
                    fill="#FF4D4D"
                    radius={[10, 10, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* ------------------- 2. INCOME LIST SECTION ------------------- */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-darkBlue">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Income History
        </h2>

        {/* Header Row */}
        {transactions.length > 0 && (
          <div className="grid grid-cols-5 text-gray-400 font-medium mb-4 px-4">
            <span>Source</span>
            <span>Date</span>
            <span>Amount</span>
            <span className="text-right">Status (% vs Previous)</span>
            <span className="text-right">Actions</span>
          </div>
        )}

        {/* Scrollable List Container (Vertical Scroll) */}
        <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {transactions.length === 0 ? (
            <p className="text-center text-gray-400 py-10">
              No valid income records found.
            </p>
          ) : (
            transactions
              .slice()
              .reverse() // Display newest first
              .map((item, index) => (
                <div
                  key={item.id}
                  className="grid grid-cols-5 items-center bg-gray-50 p-4 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  {/* Source & Icon */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <FaMoneyBillWave />
                    </div>
                    <span className="font-bold text-gray-700 capitalize">
                      {item.source}
                    </span>
                  </div>

                  {/* Date */}
                  <span className="text-gray-500 font-medium">
                    {new Date(item.date).toLocaleDateString()}
                  </span>

                  {/* Amount */}
                  <span className="font-bold text-gray-800">
                    {formatCurrency(item.amount || 0)}
                  </span>

                  {/* Status/Badge - NEW LOGIC (PoP) */}
                  <div className="text-right">
                    {getStatusBadge(item, index)}
                  </div>

                  {/* Delete Button */}
                  <div className="text-right">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                      aria-label="Delete Income"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Income;
