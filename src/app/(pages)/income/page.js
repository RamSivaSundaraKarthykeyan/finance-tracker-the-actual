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
import { useSession } from "next-auth/react";
import {
  getTransactions,
  deleteTransaction,
} from "@/actions/transactionActions"; // REAL BACKEND IMPORT

const BAR_WIDTH = 100;
const PADDING_FOR_MAX = 1.2;

const Income = () => {
  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [yAxisDomain, setYAxisDomain] = useState([0, 100]);
  const scrollContainerRef = useRef(null);
  const { data: session, status } = useSession();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const isValidIncome = (item) => {
    return (
      item.type === "income" &&
      item.source &&
      !isNaN(parseFloat(item.amount)) &&
      parseFloat(item.amount) > 0 &&
      !isNaN(new Date(item.date))
    );
  };

  const processChartData = useCallback((data) => {
    const groupedByDay = {};
    data.forEach((item) => {
      const amount = parseFloat(item.amount);
      const dateObj = new Date(item.date);
      const day = dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      if (!groupedByDay[day]) groupedByDay[day] = 0;
      groupedByDay[day] += amount;
    });

    const chartArray = Object.keys(groupedByDay).map((key) => ({
      day: key,
      amount: groupedByDay[key],
    }));

    setChartData(chartArray);

    if (chartArray.length > 0) {
      const maxAmount = Math.max(...chartArray.map((d) => d.amount));
      const maxDomain = Math.ceil((maxAmount * PADDING_FOR_MAX) / 1000) * 1000;
      setYAxisDomain([0, maxDomain]);
    } else {
      setYAxisDomain([0, 100]);
    }
  }, []);

  const loadData = useCallback(async () => {
    if (status === "loading") return;

    let incomes = [];

    if (session) {
      // 1. LOGGED IN: Fetch from DB
      const response = await getTransactions();
      if (response.success && Array.isArray(response.data)) {
        incomes = response.data.filter(isValidIncome);
      } else {
        console.error("DB Fetch Error:", response.error);
      }
    } else {
      // 2. LOGGED OUT: Fetch from Local Storage
      const savedData =
        JSON.parse(localStorage.getItem("financeTrackerData")) || [];
      incomes = savedData.filter(isValidIncome);
    }

    incomes.sort((a, b) => new Date(a.date) - new Date(b.date));
    setTransactions(incomes);
    processChartData(incomes);
  }, [session, status, processChartData]);

  const handleDelete = async (id) => {
    if (session) {
      // 1. LOGGED IN: Delete from DB
      if (!confirm("Delete this record from the cloud?")) return;
      const response = await deleteTransaction(id);
      if (response.success) {
        loadData();
      } else {
        alert(`Failed to delete: ${response.error}`);
      }
    } else {
      // 2. LOGGED OUT: Delete from Local Storage
      if (!confirm("Delete this record from local storage?")) return;
      const existingData =
        JSON.parse(localStorage.getItem("financeTrackerData")) || [];
      const updatedData = existingData.filter((item) => item.id !== id);
      localStorage.setItem("financeTrackerData", JSON.stringify(updatedData));
      loadData();
    }
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft =
        scrollContainerRef.current.scrollWidth;
    }
  }, [chartData]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-md rounded-md text-sm">
          <p className="font-semibold text-black">{label}</p>
          <p className="text-green-600 font-bold">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const getStatusBadge = (item, index) => {
    const reversedTransactions = transactions.slice().reverse();
    const originalIndex = transactions.length - 1 - index;

    if (originalIndex === 0) {
      return (
        <span className="bg-gray-100 border border-gray-300 px-4 py-1 rounded-full text-sm font-semibold text-gray-600 shadow-sm">
          New Entry
        </span>
      );
    }

    const currentAmount = parseFloat(item.amount) || 0;
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Income Overview</h1>
          <p className="text-gray-500">Track your earnings over time</p>
        </div>
        <AddIncome onSaveSuccess={loadData} />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-500 mb-8">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Analytics</h2>
        </div>
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto pb-4 scrollbar-hide"
          style={{ cursor: "pointer" }}
        >
          {chartData.length === 0 ? (
            <div className="text-center py-20 bg-gray-100 rounded-lg">
              <p className="text-gray-600 text-xl font-medium">
                Enter new data to get started and view your earning trends!
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
                padding: "20px",
                borderRadius: "16px",
                background: "#f2ffee",
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barSize={60}>
                  <YAxis
                    domain={yAxisDomain}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => formatCurrency(value)}
                  />
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
                    fill="#10b981"
                    radius={[10, 10, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-500">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Income History
        </h2>
        {transactions.length > 0 && (
          <div className="grid grid-cols-5 text-gray-400 font-medium mb-4 px-4">
            <span>Source</span>
            <span>Date</span>
            <span>Amount</span>
            <span className="text-right">Status (% vs Previous)</span>
            <span className="text-right">Actions</span>
          </div>
        )}
        <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {transactions.length === 0 ? (
            <p className="text-center text-gray-400 py-10">
              No valid income records found.
            </p>
          ) : (
            transactions
              .slice()
              .reverse()
              .map((item, index) => (
                <div
                  key={item._id || item.id}
                  className="grid grid-cols-5 items-center bg-gray-50 p-4 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <FaMoneyBillWave />
                    </div>
                    <span className="font-bold text-gray-700 capitalize">
                      {item.source}
                    </span>
                  </div>
                  <span className="text-gray-500 font-medium">
                    {new Date(item.date).toLocaleDateString()}
                  </span>
                  <span className="font-bold text-green-600">
                    {formatCurrency(item.amount || 0)}
                  </span>
                  <div className="text-right">
                    {getStatusBadge(item, index)}
                  </div>
                  <div className="text-right">
                    <button
                      onClick={() => handleDelete(item._id || item.id)}
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