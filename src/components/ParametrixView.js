import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ThreeDView from "./ThreeDView";
import CoordinatePlane from "./CoordinatePlane";
import axios from "axios";

const ParametrixView = () => {
  const [shapes, setShapes] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [history, setHistory] = useState([]);
  const [jsonList, setJsonList] = useState([]);
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [activeTab, setActiveTab] = useState("2D");
  const navigate = useNavigate();

  const handleSendPrompt = async () => {
    if (!prompt.trim()) return;

    setHistory([...history, `You: ${prompt}`]);

    try {
      const response = await axios.post("http://127.0.0.1:5001/process", { command: prompt });
      const shapeData = response.data;
      const shapeName = `${shapeData.shape}_${jsonList.filter(json => json.shape === shapeData.shape).length + 1}`;

      const newJson = { ...shapeData, name: shapeName, extruded: false, extrusionAmount: null };
      const updatedJsonList = [...jsonList, newJson];
      setJsonList(updatedJsonList);
      setShapes(updatedJsonList);
      localStorage.setItem("jsonList", JSON.stringify(updatedJsonList));

      setHistory((prev) => [...prev, `AI: ${JSON.stringify(shapeData, null, 2) || "Error"}`]);
    } catch (error) {
      console.error("Error communicating with backend:", error);
      setHistory((prev) => [...prev, "Error: Failed to connect to backend."]);
    }

    setPrompt("");
  };

  const handleClear = () => {
    setShapes([]);
    setHistory([]);
    setJsonList([]);
    localStorage.removeItem("jsonList");
  };

  useEffect(() => {
    const storedJsons = JSON.parse(localStorage.getItem("jsonList")) || [];
    setJsonList(storedJsons);
    setShapes(storedJsons);
  }, []);

  const openJsonModal = () => {
    setShowJsonModal(true);
  };

  const closeJsonModal = () => {
    setShowJsonModal(false);
    setEditIndex(null);
    setEditContent("");
  };

  const handleEditJson = (index) => {
    setEditIndex(index);
    setEditContent(JSON.stringify(jsonList[index], null, 2));
  };

  const handleSaveJson = () => {
    try {
      const updatedJson = JSON.parse(editContent);
      const updatedJsonList = [...jsonList];
      updatedJsonList[editIndex] = updatedJson;

      setJsonList(updatedJsonList);
      setShapes(updatedJsonList);
      localStorage.setItem("jsonList", JSON.stringify(updatedJsonList));
      setEditIndex(null);
      setEditContent("");
    } catch (error) {
      alert("Invalid JSON format. Please fix errors before saving.");
    }
  };

  const handleExtrude = (index) => {
    const updatedJsonList = [...jsonList];
    updatedJsonList[index] = {
      ...updatedJsonList[index],
      extruded: true,
      extrusionAmount: updatedJsonList[index].extrusionAmount || 1, // Default extrusion amount
    };

    setJsonList(updatedJsonList);
    setShapes(updatedJsonList);
    localStorage.setItem("jsonList", JSON.stringify(updatedJsonList));
  };

  const handleBack = () => {
    navigate("/split");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        fontFamily: "'Press Start 2P', cursive",
        backgroundColor: "#f4e2cc",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", padding: "10px", backgroundColor: "#996633" }}>
        <h1 style={{ fontSize: "1.2rem", color: "#f4e2cc" }}>Parametrix View</h1>
        <button
          style={{
            fontFamily: "'Press Start 2P', cursive",
            padding: "10px 20px",
            fontSize: "1rem",
            backgroundColor: "transparent",
            color: "#f4e2cc",
            border: "2px solid #f4e2cc",
            cursor: "pointer",
          }}
          onClick={openJsonModal}
        >
          📄
        </button>
      </div>

      <div style={{ display: "flex", flex: 1 }}>
        <div style={{ flex: 1, padding: "20px", borderRight: "2px solid #996633" }}>
          <h1 style={{ fontSize: "1.2rem", marginBottom: "10px" }}>Commands</h1>
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
                fontFamily: "'Press Start 2P', cursive",
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
                fontFamily: "'Press Start 2P', cursive",
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
                fontFamily: "'Press Start 2P', cursive",
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

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "#f4e2cc",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", margin: "10px 0" }}>
            <button
              style={{
                padding: "10px 20px",
                fontSize: "1rem",
                marginRight: "5px",
                backgroundColor: activeTab === "2D" ? "#996633" : "transparent",
                color: activeTab === "2D" ? "#f4e2cc" : "#996633",
                border: "2px solid #996633",
                cursor: "pointer",
              }}
              onClick={() => setActiveTab("2D")}
            >
              2D View
            </button>
            <button
              style={{
                padding: "10px 20px",
                fontSize: "1rem",
                backgroundColor: activeTab === "3D" ? "#996633" : "transparent",
                color: activeTab === "3D" ? "#f4e2cc" : "#996633",
                border: "2px solid #996633",
                cursor: "pointer",
              }}
              onClick={() => setActiveTab("3D")}
            >
              3D View
            </button>
          </div>
          {activeTab === "2D" ? (
            <CoordinatePlane shapes={shapes} />
          ) : (
            <ThreeDView shapes={shapes} />
          )}
        </div>
      </div>

      <button
        style={{
          fontFamily: "'Press Start 2P', cursive",
          position: "fixed",
          bottom: "20px",
          right: "20px",
          padding: "10px 20px",
          fontSize: "1rem",
          backgroundColor: "transparent",
          color: "#996633",
          border: "2px solid #996633",
          cursor: "pointer",
        }}
        onClick={handleBack}
      >
        Back
      </button>

      {showJsonModal && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            color: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h2 style={{ fontFamily: "'Press Start 2P', cursive" }}>Stored JSONs</h2>
          <div style={{ overflowY: "auto", maxHeight: "60vh", width: "80%", backgroundColor: "#333", padding: "20px" }}>
            {jsonList.map((json, index) => (
              <div key={index} style={{ marginBottom: "10px" }}>
                {editIndex === index ? (
                  <textarea
                    style={{
                      width: "100%",
                      height: "150px",
                      backgroundColor: "#222",
                      color: "#f4e2cc",
                      fontFamily: "'Press Start 2P', cursive",
                      padding: "10px",
                    }}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                  />
                ) : (
                  <pre
                    style={{
                      fontFamily: "'Press Start 2P', cursive",
                      textAlign: "left",
                      backgroundColor: "#444",
                      padding: "10px",
                    }}
                  >
                    {JSON.stringify(json, null, 2)}
                  </pre>
                )}
                {editIndex === index ? (
                  <button
                    style={{
                      fontFamily: "'Press Start 2P', cursive",
                      marginTop: "10px",
                      padding: "10px 20px",
                      backgroundColor: "#4caf50",
                      color: "#fff",
                      border: "2px solid #4caf50",
                      cursor: "pointer",
                    }}
                    onClick={handleSaveJson}
                  >
                    Save
                  </button>
                ) : (
                  <>
                    <button
                      style={{
                        fontFamily: "'Press Start 2P', cursive",
                        marginTop: "10px",
                        padding: "10px 20px",
                        backgroundColor: "#996633",
                        color: "#f4e2cc",
                        border: "2px solid #996633",
                        cursor: "pointer",
                      }}
                      onClick={() => handleEditJson(index)}
                    >
                      Edit
                    </button>
                    <button
                      style={{
                        fontFamily: "'Press Start 2P', cursive",
                        marginTop: "10px",
                        padding: "10px 20px",
                        backgroundColor: "#4caf50",
                        color: "#fff",
                        border: "2px solid #4caf50",
                        cursor: "pointer",
                      }}
                      onClick={() => handleExtrude(index)}
                    >
                      Extrude
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
          <button
            style={{
              fontFamily: "'Press Start 2P', cursive",
              marginTop: "20px",
              padding: "10px 20px",
              fontSize: "1rem",
              backgroundColor: "transparent",
              color: "#f4e2cc",
              border: "2px solid #f4e2cc",
              cursor: "pointer",
            }}
            onClick={closeJsonModal}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default ParametrixView;
