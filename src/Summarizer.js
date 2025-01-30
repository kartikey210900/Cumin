import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");

  // Handle input change
  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(""); // Reset any previous error

      // Make POST request to backend (Render API URL)
      const response = await axios.post(
        "https://cumin-1.onrender.com/summarize",
        {
          text: text,
        }
      );

      // Set the summary in state
      setSummary(response.data.summary);
    } catch (err) {
      // Handle error
      setError("Error: Could not fetch summary");
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Text Summarizer</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={handleTextChange}
          placeholder="Enter text to summarize"
          rows="5"
          cols="50"
        />
        <br />
        <button type="submit">Summarize</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {summary && (
        <div>
          <h3>Summary:</h3>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
};

export default App;
