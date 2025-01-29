import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import feedbackImage from "./assets/feedback.jpg"; // Adjust the path according to your project structure

const Feedback = () => {
  const [feedback, setFeedback] = useState(""); // Feedback state
  const [submitted, setSubmitted] = useState(false); // To track feedback submission
  const navigate = useNavigate();

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();

    if (feedback.trim()) {
      console.log("Feedback submitted:", feedback); // Replace with backend call if needed
      setSubmitted(true);
      setTimeout(() => {
        navigate("/summarizer"); // Redirect to Summarizer page after a delay
      }, 1500);
    } else {
      alert("Please enter your feedback before submitting.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-800">
      <div className="w-full max-w-2xl px-4 py-8">
        {/* Image Section */}
        <img
          src={feedbackImage}
          alt="Feedback"
          className="w-full h-auto mb-6 rounded-lg shadow-lg"
        />

        <h1 className="text-3xl font-bold mb-4 text-center">
          We Value Your Feedback
        </h1>

        {!submitted ? (
          <form onSubmit={handleFeedbackSubmit}>
            <textarea
              className="w-full p-4 border-2 border-gray-300 dark:border-gray-600 mb-4 resize-none text-lg rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="6"
              placeholder="Enter your feedback here..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            ></textarea>
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:opacity-80"
            >
              Submit Feedback
            </button>
          </form>
        ) : (
          <div className="p-6 bg-green-100 dark:bg-green-600 text-green-600 dark:text-white rounded-lg shadow-md">
            <p>Thank you for your feedback!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feedback;
