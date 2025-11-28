import { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import { useNavigate, Link } from "react-router-dom";

const Register=()=> {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    setName("");
    setPassword("");
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/User/Register", {
        name,
        password,
      });

      localStorage.setItem("token", res.data.token);

      alert("Registered Successfully");
      navigate("/login");
    } catch (err) {
      console.log("ERR:", err);
      alert(err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 p-4">
      <div className="w-full max-w-sm bg-white shadow-lg rounded-xl p-6">
         <h1 className="text-xl font-bold text-center mb-5 text-blue-800"> Smart Spend</h1>
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Register
        </h2>

        <input
          placeholder="Name"
          className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleRegister}
          disabled={!name || !password}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold 
                     hover:bg-blue-700 disabled:bg-blue-400 transition"
        >
          Register
        </button>

        <p className="text-center text-sm mt-4 text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};
export default Register;