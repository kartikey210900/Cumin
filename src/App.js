import { useEffect, useState } from "react";
import { FiCopy, FiTrash } from "react-icons/fi"; // Import icons

function App() {
  const [value, setValue] = useState(""); // User input
  const [data, setData] = useState([]); // Store summaries
  const [submitting, setSubmitting] = useState(false); // For showing submit loading
  const [isCopy, setIsCopy] = useState(false); // For copy status (global)

  // Handle form submission for summary generation
  const handlesubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
  
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(process.env.REACT_APP_OPENAI_KEY),
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // Use the correct model for chat-based completions
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: value + "\n\nTl;dr" }, // The prompt with the user content
        ],
        temperature: 0.1,
        max_tokens: Math.floor(value.length / 2) || 150, // Safe default for max tokens
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0.5,
      }),
    };
  
    const retryRequest = async (retryCount = 0) => {
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", requestOptions);
        const data = await response.json();
  
        if (response.status === 429) {
          // If rate-limited, retry after delay
          const retryAfter = response.headers.get("Retry-After") || 1; // Get retry time if specified
          console.log(`Rate limit exceeded. Retrying after ${retryAfter} seconds.`);
          setTimeout(() => retryRequest(retryCount + 1), retryAfter * 1000);
          return;
        }
  
        console.log("API Response:", data);
        const text = data?.choices?.[0]?.message?.content?.trim();
        if (text) {
          setData([text]); // Store the result directly
        } else {
          console.log("No summary text in API response");
        }
        setSubmitting(false);
  
      } catch (error) {
        console.log("API Error:", error);
        setSubmitting(false);
      }
    };
  
    retryRequest(); // Start the initial request
  };
  

  // Fetch stored summaries from localStorage when component mounts
  const fetchLocalStorage = () => {
    const result = localStorage.getItem("summary");
    console.log("Fetched from localStorage:", result); // Debugging log
    if (result) {
      setData(JSON.parse(result).reverse()); // Reverse the summaries for latest first
    } else {
      console.log("No summaries found in localStorage");
    }
  };

  // Copy text to clipboard function
  async function copyTextToClipboard(text) {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    }
  }

  // Handle copying a summary to clipboard
  const handleCopy = (txt) => {
    copyTextToClipboard(txt)
      .then(() => {
        setIsCopy(true); // Show copied status
        setTimeout(() => setIsCopy(false), 1500); // Reset copied status after 1.5s
      })
      .catch((err) => console.log("Clipboard error:", err));
  };

  // Handle deletion of a summary
  const handleDelete = (txt) => {
    const filtered = data.filter((d) => d !== txt); // Remove selected summary
    setData(filtered); // Update state
    localStorage.setItem("summary", JSON.stringify(filtered)); // Store updated data in localStorage
  };

  // Run fetchLocalStorage when component mounts to load stored data
  useEffect(() => {
    fetchLocalStorage();
  }, []); // Empty dependency means it runs once after the first render

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 py-8 px-4 md:px-20 animate-gradient">
      <div className="w-full">
        <header className="flex justify-between items-center w-full h-10 px-5 2xl:px-40">
          <h3 className="cursor-pointer text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 animate-pulse">
            Cumin
          </h3>
        </header>

        <main className="flex flex-col items-center mt-8 p-4">
          <h1 className="text-5xl text-white text-center font-bold tracking-wide">
            Summarize with <span className="text-cyan-400">Cumin</span>
          </h1>
          <p className="mt-5 text-lg text-gray-400 sm:text-xl text-center max-w-2xl leading-relaxed">
            Upload your document or paste content to get a concise summary powered by AI.
          </p>

          <textarea
            placeholder="Paste doc content here ..."
            rows={6}
            className="w-full md:w-[650px] mt-6 p-4 rounded-lg bg-gray-800 text-white border border-gray-700 shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none transition duration-150 ease-in-out transform hover:scale-105"
            onChange={(e) => setValue(e.target.value)} // Update value state
          ></textarea>

          {value.length > 0 &&
            (submitting ? (
              <p className="text-lg text-cyan-400 mt-5">Please wait...</p>
            ) : (
              <button
                className="mt-5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-blue-600 hover:to-cyan-600 px-6 py-3 text-white text-lg font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                onClick={handlesubmit} // Trigger submit on button click
              >
                Summarize
              </button>
            ))}
        </main>
      </div>

      <section className="w-full mt-10 flex flex-col gap-5 items-center">
      {data?.length > 0 && (
  <>
    <h2 className="text-white font-semibold text-xl">Summary History</h2>
    {data.map((d, index) => (
      <div key={index} className="max-w-2xl w-full bg-gray-800 p-5 rounded-lg shadow-md transition duration-200 hover:bg-gray-700">
        <p className="text-gray-300 text-lg leading-relaxed">{d}</p>
        <div className="flex gap-5 items-center justify-end mt-3">
          <button className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1" onClick={() => handleCopy(d)}>
            <FiCopy /> {isCopy ? "Copied" : "Copy"}
          </button>
          <button className="text-red-400 hover:text-red-300 flex items-center gap-1" onClick={() => handleDelete(d)}>
            <FiTrash /> Delete
          </button>
        </div>
      </div>
    ))}
  </>
)}

      </section>
    </div>
  );
}

export default App;
