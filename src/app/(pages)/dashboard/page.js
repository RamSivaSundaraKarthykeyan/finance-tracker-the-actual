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
import { useSession } from "next-auth/react"; // Import for auth status
import { getTransactions } from "@/actions/transactionActions"; // Import database action

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

// Helper for validating and parsing transaction data consistently
const isValidTransaction = (t) => {
  const d = new Date(t.date);
  const amt = parseFloat(t.amount);
  return !(isNaN(d.getTime()) || isNaN(amt) || amt <= 0 || !t.type);
};

const Dashboard = () => {
  // --- Auth & State ---
  const { data: session, status } = useSession();
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

  // --- Load Data (Unified Database/Local Storage) ---
  const loadData = useCallback(async () => {
    if (status === "loading") return;

    let allTransactions = [];

    if (session) {
      // 1. LOGGED IN: Fetch from DB
      const response = await getTransactions();
      if (response.success && Array.isArray(response.data)) {
        allTransactions = response.data;
      } else {
        console.warn(
          "DB Fetch Error:",
          response.error || "Unknown DB error. Falling back to Local Storage."
        );
        // Fallback to local storage if DB fetch fails for a logged-in user
        const savedData =
          JSON.parse(localStorage.getItem("financeTrackerData")) || [];
        allTransactions = savedData;
      }
    } else {
      // 2. LOGGED OUT: Fetch from Local Storage
      const savedData =
        JSON.parse(localStorage.getItem("financeTrackerData")) || [];
      allTransactions = savedData;
    }

    // Filter and sort the final dataset
    const validTransactions = allTransactions.filter(isValidTransaction);
    // Sort by date (newest first for history)
    const sorted = validTransactions.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    setTransactions(sorted);
  }, [session, status]);

  useEffect(() => {
    loadData();
  }, [loadData]); // Runs on mount and when session status changes

  // --- Filtered Data based on Search (skip invalid entries) ---
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      // Data is already validated by loadData, but keeping a quick check
      if (!isValidTransaction(t)) return false;

      // Apply search filter
      const searchTermLower = searchTerm.toLowerCase();
      const matchSearch =
        t.source.toLowerCase().includes(searchTermLower) ||
        (t.description &&
          t.description.toLowerCase().includes(searchTermLower));
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
      const amt = parseFloat(t.amount); // amount is already safe to parse after loadData

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

    // Ensure a minimum size and scale based on proportions
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
    const lastYear = thisMonth === 0 ? currentYear - 1 : currentYear;

    const stats = {
      thisMonth: { income: 0, expense: 0 },
      lastMonth: { income: 0, expense: 0 },
    };

    transactions.forEach((t) => {
      const d = new Date(t.date);
      const amt = parseFloat(t.amount);

      if (d.getFullYear() === currentYear && d.getMonth() === thisMonth) {
        // Current Month transactions
        if (t.type === "income") stats.thisMonth.income += amt;
        else if (t.type === "expense") stats.thisMonth.expense += amt;
      } else if (d.getFullYear() === lastYear && d.getMonth() === lastMonth) {
        // Last Month transactions
        if (t.type === "income") stats.lastMonth.income += amt;
        else if (t.type === "expense") stats.lastMonth.expense += amt;
      }
    });

    setComparisonStats([
      {
        name: MONTHS[lastMonth],
        income: stats.lastMonth.income,
        expense: stats.lastMonth.expense,
      },
      {
        name: MONTHS[thisMonth],
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

        // Filter by current year
        if (d.getFullYear() !== currentYear) {
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

        // Filter by current year and selected month
        if (
          d.getFullYear() !== currentYear ||
          d.getMonth() !== selectedMonthIndex
        ) {
          return;
        }

        const day = d.getDate();
        if (dataMap[day]) {
          if (t.type === "income") dataMap[day].income += amt;
          else if (t.type === "expense") dataMap[day].expense += amt;
        }
      });
    }

    const formattedData = Object.values(dataMap).map((item) => ({
      ...item,
      balance: item.income - item.expense,
    }));

    setChartData(formattedData);
  }, [transactions, selectedMonthIndex]);

  // --- Custom Tooltip (Remains unchanged) ---
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
            className={`font-semibold ${data.balance >= 0 ? "text-green-600" : "text-red-600"
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
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* --- LEFT SIDEBAR (Month Selector) - Desktop --- */}
      <div className="w-24 bg-white border-r border-gray-200 flex flex-col items-center py-6 gap-2 sticky top-0 h-screen overflow-y-auto hidden md:flex">
        <button
          onClick={() => setSelectedMonthIndex(null)}
          className={`w-16 py-2 rounded-xl text-sm font-semibold transition-all ${selectedMonthIndex === null
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
            className={`w-16 py-3 rounded-xl text-sm font-medium transition-all ${selectedMonthIndex === i
              ? "bg-blue-100 text-blue-700 border-2 border-blue-200"
              : "text-gray-500 hover:bg-gray-50"
              }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* --- MOBILE MONTH SELECTOR --- */}
      <div className="md:hidden bg-white border-b border-gray-200 p-4 sticky top-0 z-30">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setSelectedMonthIndex(null)}
            className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${selectedMonthIndex === null
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-500"
              }`}
          >
            Year
          </button>
          {MONTHS.map((m, i) => (
            <button
              key={m}
              onClick={() => setSelectedMonthIndex(i)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedMonthIndex === i
                ? "bg-blue-100 text-blue-700 border border-blue-200"
                : "bg-gray-100 text-gray-500"
                }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 p-4 md:p-8 overflow-x-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>

          {/* Top Tabs & Search Bar */}
          <div className="w-full sm:w-auto flex bg-blue-500 p-1 rounded-lg">
            <div className="relative flex-1 sm:flex-initial flex items-center">
              <input
                type="text"
                placeholder="Search transactions..."
                className="pl-10 pr-4 py-2 rounded-lg border-none focus:ring-2 placeholder-white/70 focus:ring-blue-300 outline-none w-full sm:w-64 text-sm text-white bg-blue-600/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 text-white" />
            </div>
          </div>
        </div>

        {/* --- TOP STATS CARDS --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          {/* Income Card */}
          <div className="bg-white rounded-2xl p-6 flex flex-col justify-between h-32 relative overflow-hidden border border-gray-200 shadow-sm transition-transform hover:scale-[1.02]">
            <div className="flex items-center gap-2 z-10">
              <div className="p-2 bg-blue-500 rounded-full text-white">
                <FaWallet />
              </div>
              <span className="font-semibold text-gray-600">Income</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 z-10">
              {formatCurrency(summaryStats.income)}
            </h2>
            <div className="absolute right-0 bottom-0 opacity-10 text-blue-500">
              <FaArrowUp size={80} />
            </div>
          </div>

          {/* Expense Card */}
          <div className="bg-white rounded-2xl p-6 flex flex-col justify-between h-32 relative overflow-hidden border border-gray-200 shadow-sm transition-transform hover:scale-[1.02]">
            <div className="flex items-center gap-2 z-10">
              <div className="p-2 bg-red-500 rounded-full text-white">
                <FaWallet />
              </div>
              <span className="font-semibold text-gray-600">Expense</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 z-10">
              {formatCurrency(summaryStats.expense)}
            </h2>
            <div className="absolute right-0 bottom-0 opacity-10 text-red-500">
              <FaArrowDown size={80} />
            </div>
          </div>

          {/* Balance Card */}
          <div className="bg-white rounded-2xl p-6 flex flex-col justify-between h-32 relative overflow-hidden border border-gray-200 shadow-sm sm:col-span-2 lg:col-span-1 transition-transform hover:scale-[1.02]">
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
          <div className="lg:col-span-2 bg-white rounded-2xl p-4 md:p-6 border border-gray-200 shadow-sm flex flex-col min-h-[400px]">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              Overview
              <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                {selectedMonthIndex === null
                  ? "Yearly View"
                  : MONTHS[selectedMonthIndex]}
              </span>
            </h2>

            {/* Chart container with fixed height and width */}
            <div className="flex-1 overflow-x-auto pb-2 scrollbar-hide">
              <div
                style={{
                  width: "100%",
                  minWidth: selectedMonthIndex !== null ? "800px" : "100%",
                  height: "300px",
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
                      tick={{ fill: "#6b7280", fontSize: 10 }}
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
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm h-[300px] relative flex justify-center items-center overflow-hidden">
              <h2 className="absolute top-4 left-6 text-lg font-bold text-gray-800">
                Activity
              </h2>

              <div className="relative w-full h-full flex justify-center items-center scale-75 md:scale-100">
                {/* Income Sphere */}
                <div
                  className="rounded-full bg-blue-500 text-white flex flex-col justify-center items-center absolute shadow-lg transition-all duration-500 opacity-90"
                  style={{
                    width: sphereSizes.income,
                    height: sphereSizes.income,
                    top: "15%",
                    right: "5%",
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
                    left: "5%",
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
                  className="rounded-full bg-gray-100 text-gray-700 border-2 border-white flex flex-col justify-center items-center absolute shadow-xl transition-all duration-500"
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
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm h-[250px] flex flex-col">
              <h2 className="text-sm font-bold text-gray-800 mb-4">
                Comparison (Month)
              </h2>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="80%">
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
        <div className="bg-white rounded-2xl p-4 md:p-6 border border-gray-200 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-lg font-bold text-gray-800">
              Transaction History
            </h2>
            <div className="w-full sm:w-60 flex bg-gray-100 p-1 rounded-lg">
              <div className="relative flex-1 flex items-center">
                <input
                  type="text"
                  placeholder="Filter by source..."
                  className="pl-10 pr-4 py-2 rounded-lg border-none focus:ring-2 placeholder-gray-400 focus:ring-blue-300 outline-none w-full text-sm text-gray-700 bg-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-3 text-gray-400" />
              </div>
            </div>
          </div>

          {/* History table */}
          <div className="overflow-x-auto -mx-4 md:mx-0">
            <div className="min-w-[600px] px-4 md:px-0">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 text-[10px] md:text-xs text-gray-500 uppercase tracking-wider sticky top-0 bg-white shadow-[0_1px_0_rgba(0,0,0,0.05)]">
                    <th className="pb-4 pl-4 font-semibold">Description</th>
                    <th className="pb-4 font-semibold">Date</th>
                    <th className="pb-4 font-semibold">Type</th>
                    <th className="pb-4 text-right pr-4 font-semibold">Amount</th>
                  </tr>
                </thead>
                <tbody className="text-xs md:text-sm text-gray-700">
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-12 text-gray-400">
                        <div className="flex flex-col items-center gap-2">
                          <FaSearch size={24} className="opacity-20" />
                          <p>No transactions found matching your search.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((t, index) => (
                      <tr
                        key={t._id || `${t.source}-${t.type}-${index}`}
                        className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="py-4 pl-4 flex items-center gap-3">
                          <div
                            className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-[10px] md:text-xs font-bold ${t.type === "income" ? "bg-blue-500" : "bg-red-400"
                              }`}
                          >
                            {t.source.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{t.source}</p>
                            {t.description && (
                              <p className="text-gray-400 text-[10px] md:text-xs truncate max-w-[150px] md:max-w-xs">
                                {t.description}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="py-4 text-gray-500 whitespace-nowrap">
                          {new Date(t.date).toLocaleDateString()}
                        </td>
                        <td className="py-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] md:text-xs font-bold border ${t.type === "income"
                                ? "bg-blue-50 text-blue-600 border-blue-100"
                                : "bg-red-50 text-red-500 border-red-100"
                              }`}
                          >
                            {t.type.toUpperCase()}
                          </span>
                        </td>
                        <td className={`py-4 text-right pr-4 font-bold ${t.type === 'income' ? 'text-blue-600' : 'text-gray-900'}`}>
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
    </div>
  );
};
export default Dashboard;
