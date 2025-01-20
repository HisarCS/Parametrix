import React from "react";
import { useNavigate } from "react-router-dom";

const Select = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "black",
        color: "white",
        fontFamily: "'Press Start 2P', cursive",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "2.5rem", marginBottom: "200px" }}>Select a Level</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
          width: "60%",
          maxWidth: "600px",
        }}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((level) => (
          <button
            key={level}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              padding: "20px 0",
              backgroundColor: "black",
              color: "white",
              border: "2px solid white",
              fontSize: "2rem",
              cursor: "pointer",
              fontFamily: "'Press Start 2P', cursive",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onClick={() => navigate(`/lvl${level}`)}
            onMouseOver={(e) => {
              e.target.style.boxShadow = "0 0 10px white";
              e.target.style.transform = "scale(1.1)";
            }}
            onMouseOut={(e) => {
              e.target.style.boxShadow = "none";
              e.target.style.transform = "scale(1)";
            }}
          >
            {level}
          </button>
        ))}
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          marginTop: "40px",
          padding: "10px 20px",
          fontSize: "1.2rem",
          color: "white",
          backgroundColor: "transparent",
          border: "2px solid white",
          cursor: "pointer",
          textTransform: "uppercase",
          fontFamily: "'Press Start 2P', cursive",
          transition: "transform 0.2s, box-shadow 0.2s",
          marginBottom: "200px",
        }}
        onMouseOver={(e) => {
          e.target.style.boxShadow = "0 0 10px white";
          e.target.style.transform = "scale(1.1)";
        }}
        onMouseOut={(e) => {
          e.target.style.boxShadow = "none";
          e.target.style.transform = "scale(1)";
        }}
      >
        Back
      </button>

      {/* Wildcard Button */}
      <button
        style={{
          marginTop: "0px", // Further below
          padding: "5px 10px",
          fontSize: "1.5rem",
          color: "white",
          backgroundColor: "#af8636",
          border: "2px solid white",
          cursor: "pointer",
          textTransform: "uppercase",
          fontFamily: "'Press Start 2P', cursive",
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
        onMouseOver={(e) => {
          e.target.style.boxShadow = "0 0 10px white";
          e.target.style.transform = "scale(1.1)";
        }}
        onMouseOut={(e) => {
          e.target.style.boxShadow = "none";
          e.target.style.transform = "scale(1)";
        }}
      >
        Wildcard
      </button>
    </div>
  );
};

export default Select;
