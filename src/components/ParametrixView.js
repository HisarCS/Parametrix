import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CoordinatePlane from "./CoordinatePlane"; // Ensure you have this component

const ParametrixView = () => {
  const [shapes, setShapes] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [history, setHistory] = useState([]);
  const navigate = useNavigate(); // Hook to handle navigation

  // Handle sending commands
  const handleSendPrompt = async () => {
    if (!prompt.trim()) return;

    setHistory([...history, `You: ${prompt}`]);

    try {
      const response = await axios.post("http://127.0.0.1:5001/process", { command: prompt });
      setHistory((prev) => [...prev, `AI: ${JSON.stringify(response.data, null, 2) || "Error"}`]);
      setShapes((prev) => [...prev, response.data]);
    } catch (error) {
      console.error("Error communicating with backend:", error);
      setHistory((prev) => [...prev, "Error: Failed to connect to backend."]);
    }

    setPrompt("");
  };

  // Handle clearing shapes and history
  const handleClear = () => {
    setShapes([]);
    setHistory([]);
  };

  // Handle back button click to navigate to /split
  const handleBack = () => {
    navigate("/split");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", fontFamily: "'Press Start 2P'", backgroundColor: "#f4e2cc" }}>
      {/* Main Interface */}
      <div style={{ display: "flex", flex: 1 }}>
        {/* Left Panel */}
        <div style={{ flex: 1, padding: "20px", borderRight: "2px solid #996633" }}>
          <h1 style={{ fontSize: "1.2rem", marginBottom: "10px" }}>Parametrix Interface</h1>
          <div
            style={{
              flexGrow: 1,
              overflowY: "auto",
              marginBottom: "20px",
              border: "2px solid #996633",
              padding: "10px",
              height: "60vh",
            }}
          >
            {history.map((item, index) => (
              <div key={index} style={{ marginBottom: "10px", whiteSpace: "pre-wrap" }}>
                {item}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              style={{
                flex: 1,
                padding: "10px",
                fontSize: "1rem",
                border: "2px solid #996633",
                backgroundColor: "#f4e2cc",
              }}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Type your command..."
            />
            <button
              style={{
                padding: "10px 20px",
                fontSize: "1rem",
                backgroundColor: "#996633",
                color: "#f4e2cc",
                border: "2px solid #996633",
                cursor: "pointer",
              }}
              onClick={handleSendPrompt}
            >
              Send
            </button>
            <button
              style={{
                padding: "10px 20px",
                fontSize: "1rem",
                backgroundColor: "#cc3333",
                color: "#f4e2cc",
                border: "2px solid #cc3333",
                cursor: "pointer",
              }}
              onClick={handleClear}
            >
              Clear
            </button>
          </div>
        </div>

        {/* Right Panel */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f4e2cc",
          }}
        >
          <CoordinatePlane shapes={shapes} />
        </div>
      </div>

      {/* Back Button */}
      <button
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          padding: "10px 20px",
          fontSize: "1rem",
          color: "#996633",
          backgroundColor: "transparent",
          border: "3px solid #996633",
          textTransform: "uppercase",
          fontFamily: "'Press Start 2P', cursive",
          cursor: "pointer",
          transition: "transform 0.2s, background-color 0.3s, box-shadow 0.3s",
        }}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = "#f4e2cc";
          e.target.style.color = "black";
          e.target.style.boxShadow = "0 0 10px #996633";
          e.target.style.transform = "scale(1.1)";
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = "transparent";
          e.target.style.color = "#996633";
          e.target.style.boxShadow = "none";
          e.target.style.transform = "scale(1)";
        }}
        onClick={handleBack}
      >
        Back
      </button>
    </div>
  );
};

export default ParametrixView;
