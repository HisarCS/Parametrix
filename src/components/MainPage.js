import React from "react";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const navigate = useNavigate();

  return React.createElement(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "black",
        color: "white",
        fontFamily: "'Press Start 2P'",
        textAlign: "center",
      },
    },
    // Title
    React.createElement(
      "h1",
      {
        style: {
          fontSize: "4rem",
          textTransform: "uppercase",
          marginBottom: "40px",
          letterSpacing: "2px",
        },
      },
      React.createElement("span", { style: { color: "#FFA500" } }, "PARAMETRI"),
      "X"
    ),
    // Start Button
    React.createElement(
      "button",
      {
        style: {
          fontSize: "1rem",
          textTransform: "uppercase",
          fontFamily: "'Press Start 2P'",
          backgroundColor: "black",
          color: "white",
          border: "2px solid white",
          padding: "10px 20px",
          cursor: "pointer",
          transition: "transform 0.2s, background-color 0.2s",
        },
        onClick: () => navigate("/split"), // Navigate to SplitSelection
        onMouseEnter: (e) => {
          e.target.style.backgroundColor = "#FFA500";
          e.target.style.color = "black";
          e.target.style.transform = "scale(1.1)";
        },
        onMouseLeave: (e) => {
          e.target.style.backgroundColor = "black";
          e.target.style.color = "white";
          e.target.style.transform = "scale(1)";
        },
      },
      "Start"
    ),
    // Blinking Text
    React.createElement(
      "p",
      {
        style: {
          marginTop: "30px",
          fontSize: "0.7rem",
          color: "#bbb",
          textTransform: "uppercase",
          fontFamily: "'Press Start 2P'",
          animation: "blink 2s infinite",
        },
      },
      "Press Start to Enter"
    )
  );
};

export default MainPage;
