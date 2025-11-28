import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 p-6">
      <div className="bg-white p-10 rounded-2xl shadow-lg max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-4">Wanna manage expenses?</h1>
        <p className="text-gray-600 mb-8">
          Try <span className="font-semibold text-indigo-600">Smart Spend</span>, a simple and smart expense tracker.
        </p>
        <button
          onClick={handleRedirect}
          className="px-6 py-3 bg-indigo-600 text-white text-lg rounded-xl hover:bg-indigo-700 transition flex items-center justify-center gap-2 w-full"
        >
          Get Started →
        </button>
      </div>
    </div>
  );
};

export default HomePage;
