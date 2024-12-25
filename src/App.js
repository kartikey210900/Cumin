import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Summarizer from "./Summarizer"; // Import Summarizer page
import Feedback from "./Feedback"; // Import Feedback page
import Login from "./Login"; // Import Login page

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/summarizer" element={<Summarizer />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/" element={<Login />} /> {/* Default route to Login */}
      </Routes>
    </Router>
  );
};

export default App;
