// import React, { useState, useEffect } from "react";
// import api from "../api/axiosConfig";
// import "./Expense.css";
// import { FaTrash,FaPencilAlt} from "react-icons/fa";
// import { FiLogOut} from "react-icons/fi";
// import { useNavigate,Link } from "react-router-dom";
// import { Doughnut} from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   ArcElement,
//   Tooltip,
//   Legend
// } from "chart.js";


// ChartJS.register(ArcElement, Tooltip, Legend);

// const Expense = () => {
//   const [amount, setAmount] = useState("");
//   const [category, setCategory] = useState("");
//   const [date, setDate] = useState("");
//   const [desc, setDesc] = useState("");

//   const [expenses, setExpenses] = useState([]);
//   const [editId, setEditId] = useState(null);
//   const[categories,setCategories]=useState([])
//   const [showAddCategory, setShowAddCategory] = useState(false);
//   const [newCategory, setNewCategory] = useState("");
//   const [filterCategory, setFilterCategory] = useState("");
// const [filterDate, setFilterDate] = useState("");
// const [showCategoryFilter, setShowCategoryFilter] = useState(false);
// const [showDateFilter, setShowDateFilter] = useState(false);
// const [filterMonth, setFilterMonth] = useState("");
// // Group by category
// const grouped = expenses.reduce((acc, exp) => {
//   if (!acc[exp.categoryName]) {
//     acc[exp.categoryName] = 0;
//   }
//   acc[exp.categoryName] += exp.amountSpent;
//   return acc;
// }, {});


// const chartData = {
//   labels: Object.keys(grouped),
//   datasets: [
//     {
//       data: Object.values(grouped),
//       backgroundColor: [
//         "#FF6384",
//         "#36A2EB",
//         "#f7d786ff",
//         "#4BC0C0",
//         "#9966FF",
//         "#FF9F40",
//       ],
//     },
//   ],
// };

// const fetchCategories = async () => {
//   try {
//     const res = await api.get("Category/GetAllCategories"); 
//     setCategories(res.data);
//   } catch (error) {
//     console.error("Error loading categories:", error);
//   }
// };

// useEffect(() => {
//   fetchCategories();
// }, []);

// const handleCategoryChange = (e) => {
//   const value = e.target.value;

//   if (value === "add") {
//     setShowAddCategory(true);
//     setCategory(""); 
//   } else {
//     setCategory(value);
//   }
// };

// const handleAddCategory = async () => {
//   if (!newCategory.trim()) {
//     alert("Enter valid category name");
//     return;
//   }

//   try {
//     const response = await api.post("Category/AddCategory", {
//       categoryName: newCategory
//     });

//     alert("Category added successfully!");

//     setShowAddCategory(false);
//     setNewCategory("");

//     await fetchCategories(); // refresh dropdown

//   } catch (error) {
//     console.error("Error adding category:", error);
//     alert("Failed to add category");
//   }
// };

//   // Total Expense
//   const totalExpense = expenses.reduce((sum, exp) => sum + exp.amountSpent, 0);

//   // Fetch Expenses
//   const fetchExpenses = async () => {
//     try {
//       const res = await api.get("/Expense/GetUserExpenses");
//       setExpenses(res.data);
//     } catch (error) {
//       console.error("Error loading expenses:", error);
//     }
//   };

//   useEffect(() => {
//     fetchExpenses();
//   }, []);

//   // Add / Update Expense
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const expenseData = {
//       amountSpent: Number(amount),
//       categoryId: Number(category),
//       spendDate: date,
//       description: desc,
//     };

//     try {
//       let res;

//       if (editId === null) {
//         // ADD expense
//         res = await api.post("/Expense/AddExpense", expenseData);
//        await fetchExpenses();
//         // setExpenses((prev) => [...prev, res.data]);
//         alert("Expense Added!");
//       } else {
//         // UPDATE expense
//         res = await api.put(`/Expense/UpdateExpense/${editId}`, expenseData);

//         /* setExpenses((prev) =>
//           prev.map((exp) => (exp.expenseId === editId ? res.data : exp))
//         ); */
//         await fetchExpenses();

//         alert("Expense Updated!");
//         setEditId(null);
//       }

//       // Clear Form
//       setAmount("");
//       setCategory("");
//       setDate("");
//       setDesc("");

//     } catch (error) {
//       alert("Error while saving expense");
//     }
//   };

//   // Edit Expense - load data into form
//   const handleEdit = (exp) => {
//     setEditId(exp.expenseId);
//     setAmount(exp.amountSpent);
//     setCategory(exp.categoryId);
//     setDate(exp.spendDate.split("T")[0]);
//     setDesc(exp.description);
//   };

//   // Delete Expense
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete?")) return;

//     try {
//       await api.delete(`/Expense/DeleteExpense/${id}`);
//       setExpenses((prev) => prev.filter((exp) => exp.expenseId !== id));
//       alert("Expense Deleted!");
//     } catch (error) {
//       alert("Error deleting expense");
//     }
//   };

// const filteredExpenses = expenses.filter((exp) => {
//   let cond = true;

//   // Category filter
//   if (filterCategory) {
//     cond = cond && exp.categoryName === filterCategory;
//   }
// if (filterDate) {
//     const expDate = exp.spendDate.split("T")[0]; // format YYYY-MM-DD
//     cond = cond && expDate === filterDate;
//   }
  

//   return cond;
// });
// const navigate = useNavigate();

// const handleLogout = () => {
//   localStorage.removeItem("token");
//   localStorage.removeItem("name");
//   navigate("/login");   // redirects to login page
// };
// const username = localStorage.getItem("name");
//   return (
    
//     <div className="Expense-Container">
// <div className="flex justify-between items-center mb-6 p-4 bg-white shadow rounded-xl">
// <h1 className="text-2xl font-bold">
// {username ? `${username}'s Expenses` : "Dashboard"}
// </h1>


// <div className="flex items-center gap-4">
// {/* Add Expense as Nav Link */}
// <Link
// to="/Dashboard"
// className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 transition"
// >
// View Dashboard
// </Link>


// {/* Logout Button */}
// <button
// className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-xl shadow hover:bg-red-600 transition"
// onClick={handleLogout}
// >
// <FiLogOut className="text-lg" /> Logout
// </button>
// </div>
// </div>
// <div className="Expense-Body">
//   <div className="Expense-Left">
//       {/* Form */}
//       <form className="Expense-Form" onSubmit={handleSubmit}>
//         <label>Amount Spent</label>
//         <input
//           type="number"
//           min="1"
//           value={amount}
//           placeholder="Enter Amount"
//           onChange={(e) => setAmount(e.target.value)}
//           required
//         />

//         <label>Category</label>
// <select
//   value={category}
//   onChange={handleCategoryChange}
//   required
// >
//   <option value="">Select Category</option>

//   {categories.map((cat) => (
//     <option key={cat.categoryId} value={cat.categoryId}>
//       {cat.categoryName}
//     </option>
//   ))}

//   {/* Option to add new category */}
//   <option value="add">+ Add New Category</option>
// </select>

// {/* Add Category Popup Box */}
// {showAddCategory && (
//   <div className="add-category-popup">
//     <input
//       type="text"
//       value={newCategory}
//       placeholder="Enter New Category"
//       onChange={(e) => setNewCategory(e.target.value)}
//     />
//     <button type="button" onClick={handleAddCategory}className="AddCatBtn">Add</button>
//     <button
//       type="button"
//       onClick={() => {
//         setShowAddCategory(false);
//         setNewCategory("");
//       }}
//       className="CancelCatBtn"
//     >
//       Cancel
//     </button>
//   </div>
// )}


//         <label>Date</label>
//         <input
//           type="date"
//           value={date}
//           required
//           onChange={(e) => setDate(e.target.value)}
//         />

//         <label>Description</label>
//         <input
//           type="text"
//           value={desc}
//           placeholder="Enter Description"
//           onChange={(e) => setDesc(e.target.value)}
//         />

//         <button type="submit" className="Submit-Btn">
//           {editId === null ? "Add Expense" : "Update Expense"}
//         </button>
//       </form>

//       <h2>Total Expense: ₹{totalExpense}</h2>

// </div>
//  <div className="Expense-Right">
//       <h2>Expense Chart</h2>
//       <Doughnut data={chartData} />
//     </div>
//     </div>
//       {/* Display Expenses */}
//       <div className="Expense-List">
//         <h2>Your Expenses</h2>

//         {expenses.length === 0 ? (
//           <p >No expenses added yet.</p>
//         ) : (
//           <table className="Expense-Table">
//             <thead>
//               <tr>
                
//                 <th>Description</th>
//               <th style={{ cursor: "pointer", width: "150px" }}>
//   {!showCategoryFilter ? (
//     // When NOT clicked → show plain heading
//     <span onClick={() => setShowCategoryFilter(true)}>
//       Category ▼
//     </span>
//   ) : (
//     // When clicked → show dropdown IN PLACE OF HEADING
//     <select
//       autoFocus
//       value={filterCategory}
//       onChange={(e) => {
//         setFilterCategory(e.target.value);
//         setShowCategoryFilter(false);
//       }}
//       onBlur={() => setShowCategoryFilter(false)} // closes when clicked outside
//       style={{ width: "100%" }}
//     >
//       <option value="">All</option>
//       {categories.map((cat) => (
//         <option key={cat.categoryId} value={cat.categoryName}>
//           {cat.categoryName}
//         </option>
//       ))}
//     </select>
//   )}
// </th>


//                 <th style={{ cursor: "pointer", width: "150px" }}>
//   {!showDateFilter ? (
//     <span onClick={() => setShowDateFilter(true)}>
//       Date / Month ▼
//     </span>
//   ) : (
//     <div style={{ display: "flex", flexDirection: "column" }}>
//       {/* Exact date filter */}
//       <input
//         type="date"
//         autoFocus
//         value={filterDate}
//         onChange={(e) => {
//           setFilterDate(e.target.value);
//           setShowDateFilter(false);
//         }}
//         style={{ width: "100%", marginBottom: "4px" }}
//       />

//       {/* Month filter */}
//       <input
//         type="month"
//         value={filterMonth}
//         onChange={(e) => {
//           setFilterMonth(e.target.value);
//           setShowDateFilter(false);
//         }}
//         style={{ width: "100%" }}
//       />
//     </div>
//   )}
// </th>

//                 <th>Amount</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {filteredExpenses.map((exp) => (
//                 <tr key={exp.expenseId}>
                 
//                   <td>{exp.description}</td>
                  

  
//   <td>{exp.categoryName}
// </td>
//                   <td>{new Date(exp.spendDate).toLocaleDateString()}</td>
//                    <td>Rs.{exp.amountSpent}</td>
//                   <td>
//                     <button
//                       className="Edit-Btn"
//                       onClick={() => handleEdit(exp)}
//                     >
//                      <FaPencilAlt/>
//                     </button>



//                     <button
//                       className="Delete-Btn"
//                       onClick={() => handleDelete(exp.expenseId)}
//                     >
//                      <FaTrash/>
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>

//     </div>
//   );
// };

// export default Expense;

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
      const res = await api.get("/Expense/GetUserExpenses");
      setExpenses(res.data);
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

      {/* Form + Table Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* FORM */}
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

        {/* TABLE */}
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
