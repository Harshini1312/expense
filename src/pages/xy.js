import React, { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import { FaTrash, FaPencilAlt } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { Doughnut } from "react-chartjs-2";
import { Link, useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Expense({ username, handleLogout }) {
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [desc, setDesc] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [editId, setEditId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [filterMonth, setFilterMonth] = useState("");

  useEffect(() => {
    fetchExpenses();
    fetchCategories();
  }, []);

  const fetchExpenses = async () => {
    const res = await api.get("/Expense/GetUserExpenses");
    setExpenses(res.data);
  };

  const fetchCategories = async () => {
    const res = await api.get("/Category/GetAllCategories");
    console.log("Categories API:", res.data);
    setCategories(res.data);
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    await api.post("/Category/Addcategory", { name: newCategory });
    setNewCategory("");
    setShowAddCategory(false);
    fetchCategories();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = { amount, category, date, desc };

    if (editId) await api.put(`/Expense/UpdateExpense${editId}`, data);
    else await api.post("/Expense/AddExpense", data);

    setAmount("");
    setCategory("");
    setDate("");
    setDesc("");
    setEditId(null);
    fetchExpenses();
  };

  const handleDelete = async (id) => {
    await api.delete(`/Expense/DeleteExpense/${id}`);
    fetchExpenses();
  };

  const filteredExpenses = expenses.filter((exp) => {
    return (
      (!filterCategory || exp.category === filterCategory) &&
      (!filterDate || exp.date === filterDate) &&
      (!filterMonth || exp.date.slice(0, 7) === filterMonth)
    );
  });

  const chartData = {
    labels: categories.map((c) => c.name),
    datasets: [
      {
        data: categories.map(
          (c) => filteredExpenses.filter((e) => e.category === c.name).length
        ),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-4 shadow rounded-xl mb-6">
        <h1 className="text-2xl font-bold">
          {username ? `${username}'s Expenses` : "Expense Tracker"}
        </h1>

        <div className="flex items-center gap-4">
          <Link
            to="/Dashboard"
            className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 transition"
          >
            View Dashboard
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-xl shadow hover:bg-red-600 transition"
          >
            <FiLogOut className="text-lg" /> Logout
          </button>
        </div>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Add / Edit Expense</h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
{/* Category Dropdown */}
<select
  value={category}
  onChange={(e) => setCategory(e.target.value)}
  className="w-full p-2 border rounded bg-white text-gray-800"
  required
>
  <option value="">Select Category</option>
  {categories.map((c) => (
    <option key={c._id} value={c.name} className="text-gray-800">
      {c.name}
    </option>
  ))}
</select>

{/* Add Category Section */}
{showAddCategory && (
  <div className="flex gap-2 mt-2">
    <input
      type="text"
      placeholder="New Category"
      value={newCategory}
      onChange={(e) => setNewCategory(e.target.value)}
      className="flex-1 p-2 border rounded bg-white text-gray-800"
    />

    <button
      type="button"
      onClick={async () => {
        if (!newCategory.trim()) return;
        await api.post("/Category/AddCategory", { name: newCategory });
        setCategory(newCategory);
        setNewCategory("");
        setShowAddCategory(false);
        fetchCategories();
      }}
      className="bg-green-600 text-white px-4 py-2 rounded"
    >
      Add
    </button>

    <button
      type="button"
      onClick={() => {
        setShowAddCategory(false);
        setNewCategory("");
      }}
      className="bg-gray-400 text-white px-4 py-2 rounded"
    >
      Cancel
    </button>
  </div>
)}

<button
  type="button"
  onClick={() => setShowAddCategory(!showAddCategory)}
  className="text-blue-600 underline mt-2"
>
  + Add Category
</button>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />

            <input
              type="text"
              placeholder="Description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full p-2 border rounded"
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
            >
              {editId ? "Update Expense" : "Add Expense"}
            </button>
          </form>
        </div>

        {/* Table */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Your Expenses</h2>

          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2">Amount</th>
                <th className="p-2">Category</th>
                <th className="p-2">Date</th>
                <th className="p-2">Description</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredExpenses.map((e) => (
                <tr key={e._id} className="border-b">
                  <td className="p-2">₹{e.amount}</td>
                  <td className="p-2">{e.category}</td>
                  <td className="p-2">{e.date}</td>
                  <td className="p-2">{e.desc}</td>
                  <td className="p-2 flex gap-3">
                    <FaPencilAlt
                      onClick={() => {
                        setEditId(e._id);
                        setAmount(e.amount);
                        setCategory(e.category);
                        setDate(e.date);
                        setDesc(e.desc);
                      }}
                      className="text-blue-600 cursor-pointer"
                    />
                    <FaTrash
                      onClick={() => handleDelete(e._id)}
                      className="text-red-600 cursor-pointer"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
