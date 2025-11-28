

import React, { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import { FaTrash, FaPencilAlt } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";

const Expense = () => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [desc, setDesc] = useState("");

  const [expenses, setExpenses] = useState([]);
const [editId, setEditId] = useState(null);
const [categories, setCategories] = useState([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");

const [amountError, setAmountError] = useState("");
const fetchCategories = async () => {
    try {
      const res = await api.get("Category/GetAllCategories");
setCategories(res.data);
    } 
    catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
     fetchExpenses();
    window.history.pushState(null, null, window.location.href);
  window.onpopstate = function () {
    window.history.pushState(null, null, window.location.href);
  };
  }, []);

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (value === "add") {
      setShowAddCategory(true);
      setCategory("");
    } else setCategory(value);
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return alert("Enter valid category name");
    try {
      await api.post("Category/AddCategory", { categoryName: newCategory });
      alert("Category added successfully!");
   setShowAddCategory(false);
      setNewCategory("");
      await fetchCategories();
    } catch {
      alert("Failed to add category");
    }
  };

  const fetchExpenses = async () => {
    try {
      const res = await api.get("/Expense/GetUserExpenses");    setExpenses(res.data);
    } catch {
      console.error("Error loading expenses");
    }
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const expenseData = {
      amountSpent: Number(amount),
      categoryId: Number(category),
      spendDate: date,
      description: desc,
    };

    try {
      if (editId === null) {
 await api.post("/Expense/AddExpense", expenseData);
        alert("Expense Added!");
      } else {
        await api.put(`/Expense/UpdateExpense/${editId}`, expenseData);
  alert("Expense Updated!");
        setEditId(null);
      }
      await fetchExpenses();
      setAmount("");
      setCategory("");
      setDate("");
      setDesc("");
    } catch {
      alert("Error while saving expense");
    }
  };

  const handleEdit = (exp) => {
    setEditId(exp.expenseId);
    setAmount(exp.amountSpent);
    setCategory(exp.categoryId);
    setDate(exp.spendDate.split("T")[0]);
    setDesc(exp.description);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await api.delete(`/Expense/DeleteExpense/${id}`);
      setExpenses((prev) => prev.filter((exp) => exp.expenseId !== id));
  alert("Deleted");
    } catch {
      alert("Error deleting expense");
    }
  };

  const navigate = useNavigate();
  const handleLogout = () => {
localStorage.removeItem("token");
    localStorage.removeItem("name");
    navigate("/login");
    window.location.href = "/";
  };

  const username = localStorage.getItem("name");

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6 p-4 bg-gray shadow rounded-xl">
 <h1 className="text-2xl font-bold">{username ? `${username}'s Expenses` : "Dashboard"}</h1>
        <div className="flex items-center gap-4">
          <Link to="/Dashboard" className="text-black  hover:underline text-blue-800">Dashboard</Link>
  <button className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-xl" onClick={handleLogout}><FiLogOut /> Logout</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
        <div className="bg-white p-6 shadow rounded-xl">
          <form className="space-y-4" onSubmit={handleSubmit}>
           <div>
    <label className="font-semibold">Amount Spent</label>

    <input
      type="number"
      className="w-full p-2 border rounded mt-1"
      value={amount}
      onChange={(e) => {
        const value = e.target.value;

        if (value  <= 0 || value === "") {
          setAmountError("Amount must be greater than 0");
        } else {
          setAmountError("");
        }

        setAmount(value);
      }}
      required
    />

    {amountError && (
      <p className="text-red-500 text-sm mt-1">{amountError}</p>
    )}
  </div>

            <div>
              <label className="font-semibold">Category</label>
              <select className="w-full p-2 border rounded mt-1" value={category} onChange={handleCategoryChange} required>
    <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
                ))}
                <option value="add">+ Add New Category</option>
              </select>

              {showAddCategory && (
                <div className="mt-2 bg-gray-50 p-3 rounded border">
        <input className="w-full p-2 border rounded" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
          <div className="flex gap-2 mt-2">
                    <button type="button" onClick={handleAddCategory} className="bg-green-600 text-white px-3 py-1 rounded">Add</button>
                    <button type="button" onClick={() => setShowAddCategory(false)} className="bg-gray-400 text-white px-3 py-1 rounded">Cancel</button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="font-semibold">Date</label>
      <input type="date" className="w-full p-2 border rounded mt-1" value={date} required onChange={(e) => setDate(e.target.value)} />
            </div>

            <div>
              <label className="font-semibold">Description</label>
              <input className="w-full p-2 border rounded mt-1" value={desc} onChange={(e) => setDesc(e.target.value)} />
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg">{editId ? "Update" : "Add"} Expense</button>
          </form>
        </div>

        <div className="bg-white p-6 shadow rounded-xl overflow-auto">
         <div className="mb-4 flex justify-between items-center">
    <h2 className="text-xl font-bold">Your Expenses</h2>
    <p className="text-lg font-semibold text-blue-600">
      Total: ₹{expenses.reduce((sum, e) => sum + e.amountSpent, 0)}
    </p>
  </div>
      
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2">Description</th>
                <th className="p-2">Category</th>
                <th className="p-2">Date</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr key={exp.expenseId} className="border-b">
                  <td className="p-2">{exp.description}</td>
                  <td className="p-2">{exp.categoryName}</td>
                  <td className="p-2">{new Date(exp.spendDate).toLocaleDateString()}</td>
                  <td className="p-2 font-semibold">₹{exp.amountSpent}</td>
                  <td className="p-2 flex gap-3">
                    <button onClick={() => handleEdit(exp)} className="text-blue-600 text-xl"><FaPencilAlt /></button>
                    <button onClick={() => handleDelete(exp.expenseId)} className="text-red-600 text-xl"><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Expense;
