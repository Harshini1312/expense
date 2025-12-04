import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import { Bar, Doughnut } from "react-chartjs-2";
import { Link } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
 // PointElement,
 // LineElement
);

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);


  const [filterCategory, setFilterCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

 
  const [trendYear, setTrendYear] = useState("");
const token=localStorage.getItem("token")
  useEffect(() => {
    fetchExpenses();
    fetchCategories();

    window.history.pushState(null, null, window.location.href);
    window.onpopstate = function () {
      window.history.pushState(null, null, window.location.href);
    };
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await api.get("/Expense/GetUserExpenses",{headers:{Authorization:`Bearer ${token}`,},});
      setExpenses(res.data);
    } catch (err) {
      console.error("Error loading expenses:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/Category/GetAllCategories",{headers:{Authorization:`Bearer ${token}`,},});
      setCategories(res.data);
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

//filter by category and date
  const filteredExpenses = expenses.filter((exp) => {
    let match = true;
    if (filterCategory) match = match && exp.categoryName === filterCategory;
    const expDate = exp.spendDate.split("T")[0];
    if (startDate) match = match && expDate >= startDate;
    if (endDate) match = match && expDate <= endDate;
    return match;
  });

// total expense
  const totalExpense = filteredExpenses.reduce(
    (sum, e) => sum + e.amountSpent,
    0
  );

 
  const categoryTotals = filteredExpenses.reduce((acc, item) => {
    acc[item.categoryName] =
      (acc[item.categoryName] || 0) + item.amountSpent;
    return acc;
  }, {});
//pie chart
  const pieData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: [
          "#FF6384",
       "#36A2EB", "#FFCE56",  "#4CAF50", "#9966FF","#FF9F40",
        ],},],
  };


  const availableYears = [...new Set(expenses.map((e) => new Date(e.spendDate).getFullYear()))].sort();

  
  const trendFiltered = trendYear
    ? expenses.filter(
        (e) => new Date(e.spendDate).getFullYear() === Number(trendYear)
      )
    : expenses;

 
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
//Monthly trend for particular category
  const monthlyTotals = trendFiltered.reduce((acc, exp) => {
    if (filterCategory && exp.categoryName !== filterCategory) return acc;
    const d = new Date(exp.spendDate);
    const month = monthNames[d.getMonth()];
    acc[month] = (acc[month] || 0) + exp.amountSpent;
    return acc;
  }, {});
//Bar Chart
  const monthlyTrendData = {
    labels: Object.keys(monthlyTotals),
    datasets: [
      {
        label: "Monthly Expense",
        data: Object.values(monthlyTotals),
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
      },
    ],
  };

  const clearFilters = () => {
    setFilterCategory("");
    setStartDate("");
    setEndDate("");
    setTrendYear("");
  };

  const username = localStorage.getItem("name");

  return (
    <div className="p-6 space-y-6">

     
      <div className="flex justify-between items-center mb-6 p-4 bg-gray-200 shadow rounded-xl">
        <h1 className="text-2xl font-bold">
          {username ? `${username}'s Dashboard` : "Dashboard"}
        </h1>

        <div className="flex items-center gap-4">
          <Link to="/Expense" className="text-black hover:underline text-blue-700">
            + Add Expense
          </Link>

          <Link
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-xl shadow hover:bg-red-600 transition"
            to="/login"
          >
            <FiLogOut className="text-lg" /> Logout
          </Link>
        </div>
      </div>

     
      <div className="bg-gray-200 p-4 rounded shadow grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <p className="font-medium mb-1">Category</p>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.categoryId} value={c.categoryName}>
                {c.categoryName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="font-medium mb-1">From Date</p>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <p className="font-medium mb-1">End Date</p>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        <div className="flex items-end">
          <button
            className="bg-red-600 text-white p-2 rounded w-full"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        </div>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 <div className="bg-gray-100 p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total Expense</h2>
    <p className="text-3xl font-bold text-blue-600 mt-2">₹{totalExpense}</p>
        </div>

<div className="bg-gray-100 p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Category Breakdown</h2>
                       <div className="h-40">
            <Doughnut data={pieData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
  <div className="bg-gray-100 p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Monthly Trend</h2>

          
   <div className="mb-3">
            <select
              value={trendYear}
              onChange={(e) => setTrendYear(e.target.value)}
              className="border p-2 rounded w-full"
            >
              <option value="">All Years</option>  {availableYears.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
 </select>
          </div>
          <div className="h-48">
            <Bar data={monthlyTrendData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
     
      <div className="bg-gray-200 p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Expenses</h2>
    <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2">Date</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map((e) => (
              <tr key={e.expenseId} className="border-b text-gray-700">
                <td className="py-2">{e.spendDate.split("T")[0]}</td>
                <td>{e.categoryName}</td>
                <td>₹{e.amountSpent}</td>
                <td>{e.description}</td>
              </tr>
            ))}
            {filteredExpenses.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-3 text-gray-500">No expenses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
             </div>
         </div>
  );
};

export default Dashboard;
