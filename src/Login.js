import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    // Automatically authenticate without checking credentials
    localStorage.setItem("isAuthenticated", "true");
    navigate("/summarizer"); // Redirect to Summarizer page after login
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-800">
      <div className="w-full max-w-sm px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-4">Login</h1>

        {/* Image reference */}
        <img
          src="/images/light.jpg"
          alt="Light"
          className="w-full h-auto mt-4"
        />

        <div className="mb-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-6">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleLogin}
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:opacity-80"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
