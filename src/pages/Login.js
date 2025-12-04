import { useState } from "react";
import api from "../api/axiosConfig";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  // const handleKeyDown = (e) => {
  //   if (e.key === "Enter") handleLogin();
  // };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/User/login", { name, password });

      localStorage.setItem("name", res.data.name);
      localStorage.setItem("token", res.data.token);

      navigate("/Dashboard");
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 p-4">
      <div className="w-full max-w-sm bg-white shadow-lg rounded-xl p-5">
        <h1 className="text-xl font-bold text-center mb-5 text-blue-800"> Smart Spend</h1>
        <h2 className="text-xl font-bold text-center mb-5 text-gray-800">
          Login
        </h2>
<form onSubmit={handleLogin}>
        <input
          placeholder="Name"
          value={name}
 onChange={(e) => setName(e.target.value)}
          // onKeyDown={handleKeyDown}
          className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
     <input
          type="password"
  placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
          // onKeyDown={handleKeyDown}
          className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />

        <button
          // onClick={handleLogin} disabled={!name || !password}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold
                     hover:bg-blue-700 disabled:bg-gray-400 transition"
        >
          Login
        </button>

        <p className="text-center text-sm mt-3 text-gray-600">
          New user?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
