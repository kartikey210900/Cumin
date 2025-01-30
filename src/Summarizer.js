import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // New loading state

  // Handle input change
  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error
    setSummary(""); // Clear previous summary

    // Trim whitespace and validate input
    const trimmedText = text.trim();
    if (!trimmedText) {
      setError("Please enter some text to summarize.");
      return;
    }

    setLoading(true); // Start loading state

    try {
      // Make POST request to backend (Render API URL)
      const response = await axios.post(
        "https://cumin-1.onrender.com/summarize",
        { text: trimmedText }
      );

      // Set the summary in state
      setSummary(response.data.summary);
    } catch (err) {
      // Handle error and display the actual error message
      setError(
        err.response?.data?.error ||
          "Error: Could not fetch summary. Try again later."
      );
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>AI Text Summarizer</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={handleTextChange}
          placeholder="Enter text to summarize..."
          rows="5"
          cols="50"
          style={{ padding: "10px", fontSize: "16px", width: "80%" }}
        />
        <br />
        <button
          type="submit"
          disabled={loading}
          style={{ padding: "10px", marginTop: "10px" }}
        >
          {loading ? "Summarizing..." : "Summarize"}
        </button>
      </form>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

      {summary && (
        <div
          style={{
            marginTop: "20px",
            backgroundColor: "#f3f3f3",
            padding: "15px",
            borderRadius: "5px",
          }}
        >
          <h3>Summary:</h3>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
};

export default App;
