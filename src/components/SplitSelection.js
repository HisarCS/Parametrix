import React from "react";
import { useNavigate } from "react-router-dom";

const SplitSelection = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "'Press Start 2P'",
      }}
    >
      {/* Left Side: Parametrix */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f4e2cc", // Beige background
          borderRight: "2px solid black",
        }}
      >
        <button
          style={{
            fontSize: "2rem",
            fontFamily: "'Press Start 2P'",
            color: "#996633", // Brown text color
            backgroundColor: "#f4e2cc", // Match the background color
            border: "3px solid #996633",
            padding: "20px 40px",
            cursor: "pointer",
            transition: "transform 0.3s, background-color 0.3s, color 0.3s",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#996633";
            e.target.style.color = "#f4e2cc";
            e.target.style.transform = "scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#f4e2cc";
            e.target.style.color = "#996633";
            e.target.style.transform = "scale(1)";
          }}
          onClick={() => navigate("/parametrix")} // Navigate to Parametrix view
        >
          Parametrix
        </button>
      </div>

      {/* Right Side: Tutorials */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "black",
          position: "relative", // Enables absolute positioning for the Back button
        }}
      >
        <button
          style={{
            fontSize: "2rem",
            fontFamily: "'Press Start 2P'",
            color: "white",
            backgroundColor: "black",
            border: "3px solid white",
            padding: "20px 40px",
            cursor: "pointer",
            transition: "transform 0.3s, background-color 0.3s, color 0.3s",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "white";
            e.target.style.color = "black";
            e.target.style.transform = "scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "black";
            e.target.style.color = "white";
            e.target.style.transform = "scale(1)";
          }}
          onClick={() => alert("Tutorials Selected")}
        >
          Tutorials
        </button>

        {/* Back Button */}
        <button
          style={{
            position: "absolute", // Absolute positioning
            bottom: "20px", // Positioned at the bottom
            right: "20px", // Positioned at the right
            fontSize: "1rem",
            fontFamily: "'Press Start 2P'",
            color: "black",
            backgroundColor: "white",
            border: "3px solid white",
            padding: "10px 20px",
            cursor: "pointer",
            transition: "transform 0.3s, background-color 0.3s, color 0.3s",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "cyan";
            e.target.style.color = "black";
            e.target.style.transform = "scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "white";
            e.target.style.color = "black";
            e.target.style.transform = "scale(1)";
          }}
          onClick={() => navigate("/")} // Navigate back to the start page
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default SplitSelection;
