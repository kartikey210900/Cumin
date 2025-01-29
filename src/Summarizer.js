import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles.css"; // Importing custom CSS file

const Summarizer = () => {
  const [text, setText] = useState(""); // Input text
  const [summary, setSummary] = useState(""); // Summarized output
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error state
  const [isDarkMode, setIsDarkMode] = useState(false); // Dark mode toggle
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is authenticated
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated || isAuthenticated !== "true") {
      navigate("/"); // Redirect to Login page if not authenticated
    }
  }, [navigate]);

  const handleSummarize = async () => {
    setLoading(true);
    setSummary(""); // Clear previous summary
    setError(""); // Clear previous error

    try {
      // Send the text to the Flask backend for summarization
      const response = await axios.post("http://127.0.0.1:5000/summarize", {
        text,
      });

      // Set the summary in the state
      setSummary(response.data.summary);
    } catch (error) {
      console.error("Error during summarization:", error);
      setError("An error occurred while summarizing the text.");
    }

    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated"); // Remove authentication data
    navigate("/"); // Redirect to Login page
  };

  const handleFeedbackClick = () => {
    navigate("/feedback"); // Navigate to feedback page
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-center items-center ${
        isDarkMode ? "dark" : ""
      }`}
    >
      <div className="w-full max-w-2xl px-6 py-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        {/* Image */}
        <div className="text-center mb-6">
          <img
            src="/images/light.jpg" // Update to the correct path in the public folder
            alt="Light"
            className="w-full h-auto mt-4"
          />
        </div>

        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 mb-6">
            CUMIN - Text Summarizer
          </h1>
          <button
            className="mb-6 py-2 px-4 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white rounded-full hover:bg-gradient-to-l"
            onClick={() => setIsDarkMode(!isDarkMode)}
          >
            Toggle {isDarkMode ? "Light" : "Dark"} Mode
          </button>
        </div>

        <textarea
          className="w-full p-4 border-2 border-gray-300 dark:border-gray-600 mb-4 resize-none text-lg rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="6"
          placeholder="Enter text to summarize..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>

        <button
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg shadow-md disabled:opacity-50 hover:opacity-80"
          onClick={handleSummarize}
          disabled={loading || !text.trim()}
        >
          {loading ? "Summarizing..." : "Summarize"}
        </button>

        {summary && (
          <div className="mt-6 p-6 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg shadow-md">
            <h3 className="font-bold text-xl text-blue-500">Summary:</h3>
            <p>{summary}</p>
          </div>
        )}

        {error && (
          <div className="mt-6 p-6 bg-red-100 dark:bg-red-600 text-red-600 dark:text-white rounded-lg shadow-md">
            <p>{error}</p>
          </div>
        )}

        {/* Feedback Button */}
        <div className="mt-6">
          <button
            onClick={handleFeedbackClick}
            className="py-2 px-6 bg-gradient-to-r from-orange-400 via-yellow-500 to-red-600 text-white font-semibold rounded-lg shadow-md hover:opacity-80"
          >
            Give Feedback
          </button>
        </div>

        {/* Logout Button */}
        <div className="mt-4">
          <button
            onClick={handleLogout}
            className="py-2 px-6 bg-gradient-to-r from-red-400 via-pink-500 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:opacity-80"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Summarizer;
