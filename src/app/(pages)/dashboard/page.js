"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import { FaSearch, FaWallet, FaArrowUp, FaArrowDown } from "react-icons/fa";

// --- Constants ---
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const COLORS = {
  income: "#4286f2", // Blue
  expense: "#ef4444", // Red
  balance: "#10b981", // Green
};

// --- Helper Functions ---
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const Dashboard = () => {
  // --- State ---
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(null); // null = Year View, 0-11 = Month View
  const [chartData, setChartData] = useState([]);
  const [summaryStats, setSummaryStats] = useState({
    income: 0,
    expense: 0,
    balance: 0,
  });
  const [comparisonStats, setComparisonStats] = useState([]);

  // --- Load Data ---
  const loadData = useCallback(() => {
    const savedData =
      JSON.parse(localStorage.getItem("financeTrackerData")) || [];
    // Sort by date (newest first for history)
    const sorted = savedData.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    setTransactions(sorted);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // --- Filtered Data based on Search (skip invalid entries) ---
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      // Skip invalid date or amount or missing type
      const d = new Date(t.date);
      const amt = parseFloat(t.amount);
      if (isNaN(d.getTime()) || isNaN(amt) || amt <= 0 || !t.type) {
        return false;
      }
      // Apply search filter
      const matchSearch =
        t.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.description &&
          t.description.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchSearch;
    });
  }, [transactions, searchTerm]);

  // --- Calculations for Top Cards (Current Month) ---
  useEffect(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let inc = 0;
    let exp = 0;

    transactions.forEach((t) => {
      const d = new Date(t.date);
      const amt = parseFloat(t.amount);

      // Safety checks: Skip invalid or malformed entries
      if (isNaN(d.getTime()) || isNaN(amt) || amt <= 0 || !t.type) return;

      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        if (t.type === "income") inc += amt;
        if (t.type === "expense") exp += amt;
      }
    });

    setSummaryStats({
      income: inc,
      expense: exp,
      balance: inc - exp,
    });
  }, [transactions]);

  // --- Calculations for Activity Sphere (Dynamic Sizing) ---
  const sphereSizes = useMemo(() => {
    const total =
      summaryStats.income +
      summaryStats.expense +
      Math.abs(summaryStats.balance);
    if (total === 0) return { income: 80, expense: 80, balance: 80 };

    const scale = 120; // Max px size

    const incSize = Math.max(60, (summaryStats.income / total) * scale + 40);
    const balSize = Math.max(
      50,
      (Math.abs(summaryStats.balance) / total) * scale + 40
    );
    const expSize = Math.max(50, (summaryStats.expense / total) * scale + 40);

    return { income: incSize, expense: expSize, balance: balSize };
  }, [summaryStats]);

  // --- Calculations for Comparison Graph (Last vs Current Month) ---
  useEffect(() => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const currentYear = now.getFullYear();

    const stats = {
      thisMonth: { income: 0, expense: 0 },
      lastMonth: { income: 0, expense: 0 },
    };

    transactions.forEach((t) => {
      const d = new Date(t.date);
      const amt = parseFloat(t.amount);

      // Safety checks: Skip invalid or malformed entries
      if (isNaN(d.getTime()) || isNaN(amt) || amt <= 0 || !t.type) return;

      if (d.getFullYear() === currentYear) {
        if (d.getMonth() === thisMonth) {
          if (t.type === "income") stats.thisMonth.income += amt;
          else stats.thisMonth.expense += amt;
        } else if (d.getMonth() === lastMonth) {
          if (t.type === "income") stats.lastMonth.income += amt;
          else stats.lastMonth.expense += amt;
        }
      }
    });

    setComparisonStats([
      {
        name: "Last Month",
        income: stats.lastMonth.income,
        expense: stats.lastMonth.expense,
      },
      {
        name: "This Month",
        income: stats.thisMonth.income,
        expense: stats.thisMonth.expense,
      },
    ]);
  }, [transactions]);

  // --- Calculations for Overview Graph (Year View vs Month View) ---
  useEffect(() => {
    const dataMap = {};
    const currentYear = new Date().getFullYear();

    if (selectedMonthIndex === null) {
      // YEAR VIEW (12 Months)
      MONTHS.forEach((m, i) => {
        // Initialize all 12 months
        dataMap[i] = { name: m, income: 0, expense: 0, balance: 0 };
      });

      transactions.forEach((t) => {
        const d = new Date(t.date);
        const amt = parseFloat(t.amount);

        // Skip invalid, zero/negative, or non-current year transactions
        if (
          isNaN(d.getTime()) ||
          isNaN(amt) ||
          amt <= 0 ||
          !t.type ||
          d.getFullYear() !== currentYear
        ) {
          return;
        }

        const mIndex = d.getMonth();
        if (dataMap[mIndex]) {
          if (t.type === "income") dataMap[mIndex].income += amt;
          else if (t.type === "expense") dataMap[mIndex].expense += amt;
        }
      });
    } else {
      // MONTH VIEW (Daily)
      const daysInMonth = new Date(
        currentYear,
        selectedMonthIndex + 1,
        0
      ).getDate();

      for (let i = 1; i <= daysInMonth; i++) {
        dataMap[i] = { name: i.toString(), income: 0, expense: 0, balance: 0 };
      }

      transactions.forEach((t) => {
        const d = new Date(t.date);
        const amt = parseFloat(t.amount);

        // Skip invalid, zero/negative, or non-current year transactions
        if (
          isNaN(d.getTime()) ||
          isNaN(amt) ||
          amt <= 0 ||
          !t.type ||
          d.getFullYear() !== currentYear
        ) {
          return;
        }

        if (d.getMonth() === selectedMonthIndex) {
          const day = d.getDate();
          if (dataMap[day]) {
            if (t.type === "income") dataMap[day].income += amt;
            else if (t.type === "expense") dataMap[day].expense += amt;
          }
        }
      });
    }

    const formattedData = Object.values(dataMap).map((item) => ({
      ...item,
      balance: item.income - item.expense,
    }));

    setChartData(formattedData);
  }, [transactions, selectedMonthIndex]);

  // --- Custom Tooltip ---
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-lg text-sm z-50">
          <p className="font-bold text-gray-800 mb-2">
            {selectedMonthIndex === null
              ? label
              : `${MONTHS[selectedMonthIndex]} ${label}`}
          </p>
          <p className="text-blue-600">Income: {formatCurrency(data.income)}</p>
          <p className="text-red-500">
            Expense: {formatCurrency(data.expense)}
          </p>
          <div className="border-t my-1"></div>
          <p
            className={`font-semibold ${
              data.balance >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            Balance: {formatCurrency(data.balance)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* --- LEFT SIDEBAR (Month Selector) --- */}
      <div className="w-24 bg-white border-r border-gray-200 flex flex-col items-center py-6 gap-2 sticky top-0 h-screen overflow-y-auto hidden md:flex">
        <button
          onClick={() => setSelectedMonthIndex(null)}
          className={`w-16 py-2 rounded-xl text-sm font-semibold transition-all ${
            selectedMonthIndex === null
              ? "bg-blue-600 text-white shadow-md"
              : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          Year
        </button>
        <div className="w-10 border-b border-gray-200 my-2"></div>
        {MONTHS.map((m, i) => (
          <button
            key={m}
            onClick={() => setSelectedMonthIndex(i)}
            className={`w-16 py-3 rounded-xl text-sm font-medium transition-all ${
              selectedMonthIndex === i
                ? "bg-blue-100 text-blue-700 border-2 border-blue-200"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 p-4 md:p-8 overflow-x-hidden">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

          {/* Top Tabs & Search Bar */}
          <div className="flex bg-blue-500 p-1 rounded-lg">
            <div className="relative ml-4 flex items-center">
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 rounded-lg border-none focus:ring-2 placeholder-[#ffffff] focus:ring-blue-300 outline-none w-64 text-sm text-gray-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 text-white" />
            </div>
          </div>
        </div>

        {/* --- TOP STATS CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Income Card */}
          <div className="bg-gray-200 rounded-2xl p-6 flex flex-col justify-between h-32 relative overflow-hidden border border-gray-300">
            <div className="flex items-center gap-2 z-10">
              <div className="p-2 bg-blue-500 rounded-full text-white">
                <FaWallet />
              </div>
              <span className="font-semibold text-gray-600">Income</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 z-10">
              {formatCurrency(summaryStats.income)}
            </h2>
            <div className="absolute right-0 bottom-0 opacity-10">
              <FaArrowUp size={100} />
            </div>
          </div>

          {/* Expense Card */}
          <div className="bg-gray-200 rounded-2xl p-6 flex flex-col justify-between h-32 relative overflow-hidden border border-gray-300">
            <div className="flex items-center gap-2 z-10">
              <div className="p-2 bg-red-500 rounded-full text-white">
                <FaWallet />
              </div>
              <span className="font-semibold text-gray-600">Expense</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 z-10">
              {formatCurrency(summaryStats.expense)}
            </h2>
            <div className="absolute right-0 bottom-0 opacity-10">
              <FaArrowDown size={100} />
            </div>
          </div>

          {/* Balance Card */}
          <div className="bg-gray-200 rounded-2xl p-6 flex flex-col justify-between h-32 relative overflow-hidden border border-gray-300">
            <div className="flex items-center gap-2 z-10">
              <div className="p-2 bg-green-500 rounded-full text-white">
                <FaWallet />
              </div>
              <span className="font-semibold text-gray-600">Total Balance</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 z-10">
              {formatCurrency(summaryStats.balance)}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* --- OVERVIEW GRAPH (Main - Left 2/3) --- */}
          <div className="lg:col-span-2 bg-gray-100 rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Overview{" "}
              <span className="text-sm font-normal text-gray-500 ml-2">
                (
                {selectedMonthIndex === null
                  ? "Yearly View"
                  : MONTHS[selectedMonthIndex]}
                )
              </span>
            </h2>

            {/* Chart container with fixed height and width */}
            <div className="flex-1 overflow-x-auto pb-2 scrollbar-hide h-300 ">
              <div
                style={{
                  width: "100%",
                  minWidth: selectedMonthIndex !== null ? "1200px" : "100%",
                  height: "100%",
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} barGap={4}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e5e7eb"
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#6b7280", fontSize: 12 }}
                    />
                    <YAxis hide />
                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={{ fill: "transparent" }}
                    />
                    {/* Income Bar */}
                    <Bar
                      dataKey="income"
                      fill={COLORS.income}
                      radius={[4, 4, 4, 4]}
                      barSize={selectedMonthIndex === null ? 12 : 8}
                      isAnimationActive={false}
                    />
                    {/* Expense Bar */}
                    <Bar
                      dataKey="expense"
                      fill={COLORS.expense}
                      radius={[4, 4, 4, 4]}
                      barSize={selectedMonthIndex === null ? 12 : 8}
                      isAnimationActive={false}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN (Activity & Comparison) --- */}
          <div className="flex flex-col gap-6">
            {/* Activity Sphere */}
            <div className="bg-gray-100 rounded-2xl p-6 border border-gray-200 shadow-sm h-[300px] relative flex justify-center items-center">
              <h2 className="absolute top-4 left-6 text-lg font-bold text-gray-800">
                Activity
              </h2>

              <div className="relative w-full h-full flex justify-center items-center">
                {/* Income Sphere */}
                <div
                  className="rounded-full bg-blue-500 text-white flex flex-col justify-center items-center absolute shadow-lg transition-all duration-500 opacity-90"
                  style={{
                    width: sphereSizes.income,
                    height: sphereSizes.income,
                    top: "20%",
                    right: "10%",
                    zIndex: 10,
                  }}
                >
                  <span className="text-xs font-semibold">Income</span>
                  <span className="text-[10px]">
                    {formatCurrency(summaryStats.income)}
                  </span>
                </div>

                {/* Expense Sphere */}
                <div
                  className="rounded-full bg-red-400 text-white flex flex-col justify-center items-center absolute shadow-lg transition-all duration-500 opacity-90"
                  style={{
                    width: sphereSizes.expense,
                    height: sphereSizes.expense,
                    top: "10%",
                    left: "10%",
                    zIndex: 5,
                  }}
                >
                  <span className="text-xs font-semibold">Expense</span>
                  <span className="text-[10px]">
                    {formatCurrency(summaryStats.expense)}
                  </span>
                </div>

                {/* Balance Sphere */}
                <div
                  className="rounded-full bg-gray-200 text-gray-700 border-2 border-white flex flex-col justify-center items-center absolute shadow-xl transition-all duration-500"
                  style={{
                    width: sphereSizes.balance,
                    height: sphereSizes.balance,
                    bottom: "10%",
                    zIndex: 20,
                  }}
                >
                  <span className="text-xs font-bold">Balance</span>
                  <span className="text-[10px] font-semibold">
                    {formatCurrency(summaryStats.balance)}
                  </span>
                </div>
              </div>
            </div>

            {/* Comparison Graph */}
            <div className="bg-gray-100 rounded-2xl p-6 border border-gray-200 shadow-sm h-[200px] flex flex-col">
              <h2 className="text-sm font-bold text-gray-800 mb-2">
                Comparison (Month)
              </h2>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={comparisonStats}>
                    <defs>
                      <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#4286f2"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#4286f2"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#ef4444"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#ef4444"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="income"
                      stroke="#4286f2"
                      fillOpacity={1}
                      fill="url(#colorInc)"
                    />
                    <Area
                      type="monotone"
                      dataKey="expense"
                      stroke="#ef4444"
                      fillOpacity={1}
                      fill="url(#colorExp)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* --- TRANSACTION HISTORY --- */}
        <div className="bg-gray-100 rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800 mb-6">
              Transaction History
            </h2>
            <div className="flex bg-blue-500 p-1 rounded-lg w-60">
              <div className="relative ml-4 flex items-center">
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-10 pr-4 py-2 rounded-lg border-none focus:ring-2 placeholder-[#ffffff] focus:ring-blue-300 outline-none w-54 text-sm text-gray-700"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-3 text-white" />
              </div>
            </div>
          </div>

          {/* History table */}
          <div className="overflow-x-auto max-h-96 overflow-y-scroll">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-300 text-xs text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-100">
                  <th className="pb-4 pl-4">Description</th>
                  <th className="pb-4">Date</th>
                  <th className="pb-4">Type</th>
                  <th className="pb-4 text-right pr-4">Amount</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-gray-400">
                      No transactions found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((t, index) => (
                    <tr
                      key={`${t.id}-${t.type}-${index}`}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 pl-4 flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs ${
                            t.type === "income" ? "bg-blue-400" : "bg-red-400"
                          }`}
                        >
                          {t.source.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold">{t.source}</span>
                        {t.description && (
                          <span className="text-gray-400 text-xs hidden sm:inline">
                            - {t.description}
                          </span>
                        )}
                      </td>
                      <td className="py-4">
                        {new Date(t.date).toLocaleDateString()}
                      </td>
                      <td className="py-4 capitalize">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            t.type === "income"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {t.type}
                        </span>
                      </td>
                      <td className="py-4 text-right pr-4 font-bold">
                        {t.type === "income" ? "+" : "-"}
                        {formatCurrency(t.amount)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
