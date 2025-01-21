import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Wildcard = () => {
  const navigate = useNavigate();
  const [circles, setCircles] = useState([]);

  useEffect(() => {
    // Generate random positions for circles at the start
    const newCircles = [
      { id: 1, text: "Laser Cutter" }
    ].map((circle) => ({
      ...circle,
      top: `${Math.random() * 70 + 10}%`, // Random position between 10% and 80% height
      left: `${Math.random() * 70 + 10}%`, // Random position between 10% and 80% width
    }));

    setCircles(newCircles);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        backgroundColor: "#F5F5F5", // Mild white background
        fontFamily: "'Press Start 2P', cursive",
        color: "silver",
        overflow: "hidden",
      }}
    >
      <h1
        style={{
          position: "absolute",
          top: "5%",
          textAlign: "center",
          width: "100%",
          fontSize: "2.5rem",
        }}
      >
        Wildcard Selection
      </h1>

      {/* Render scattered circles */}
      {circles.map((circle) => (
        <div
          key={circle.id}
          style={{
            position: "absolute",
            top: circle.top,
            left: circle.left,
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            backgroundColor: "#AF8636",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1rem",
            textAlign: "center",
            cursor: "pointer",
            border: "3px solid silver",
            transition: "transform 0.3s, box-shadow 0.3s",
          }}
          onMouseOver={(e) => {
            e.target.style.boxShadow = "0 0 15px silver";
            e.target.style.transform = "scale(1.1)";
          }}
          onMouseOut={(e) => {
            e.target.style.boxShadow = "none";
            e.target.style.transform = "scale(1)";
          }}
          onClick={() => navigate(`/wildcard/${circle.text.toLowerCase().replace(" ", "-")}`)}
        >
          {circle.text}
        </div>
      ))}

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          position: "absolute",
          bottom: "5%",
          left: "50%",
          transform: "translateX(-50%)",
          padding: "15px 30px",
          fontSize: "1.2rem",
          color: "silver",
          backgroundColor: "transparent",
          border: "2px solid silver",
          cursor: "pointer",
          textTransform: "uppercase",
          fontFamily: "'Press Start 2P', cursive",
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
        onMouseOver={(e) => {
          e.target.style.boxShadow = "0 0 10px silver";
          e.target.style.transform = "scale(1.1)";
        }}
        onMouseOut={(e) => {
          e.target.style.boxShadow = "none";
          e.target.style.transform = "scale(1)";
        }}
      >
        Back
      </button>
    </div>
  );
};

export default Wildcard;
