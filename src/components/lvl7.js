// LevelView.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ThreeDView from "./ThreeDView.js";
import CoordinatePlane from "./CoordinatePlane.js";
import axios from "axios";
import Book from "./levels/book7.js";

const COLORS = {
  primary: "#f4e2cc",      // Light beige background
  secondary: "#996633",    // Brown
  borders: "#996633",      // Brown borders
  text: "#996633",         // Brown text
  button: "#996633"        // Brown buttons
};

const PAGES = [
  {
    id: 'intro',
    title: 'Welcome to Parametrix Tutorial',
    content: 'Building Simple Rectangle\n\nHere at Parametrix we\'ll learn how to create basic shapes through parameters and controls.',
    pageType: 'CONTENT',
    difficulty: 'BEGINNER',
    requiredTime: 5
  },
  {
    id: 'workspace',
    title: 'Understanding Our Building Space',
    content: 'XY Plane is like a piece of paper:\n- X: Left/Right\n- Y: Forward/Back\n- Z: Up/Down\n\nThis is where we\'ll start building.',
    pageType: 'CONTENT',
    difficulty: 'BEGINNER',
    requiredTime: 10
  },
  {
    id: 'rectangle-params',
    title: 'Parameters for a Rectangle',
    content: 'A rectangle needs:\n- Width (how long)\n- Height (how tall)\n- Position (where to place it)\n- Plane (which surface to draw on)',
    pageType: 'EXERCISE',
    difficulty: 'BEGINNER',
    requiredTime: 15
  }
];



const LevelView6 = ({ level = 7 }) => {
  const [shapes, setShapes] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [history, setHistory] = useState([]);
  const [jsonList, setJsonList] = useState([]);
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [activeTab, setActiveTab] = useState("2D");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedJsons = JSON.parse(localStorage.getItem("jsonList")) || [];
    setJsonList(storedJsons);
    setShapes(storedJsons);
  }, []);

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

      setHistory(prev => [...prev, `AI: ${JSON.stringify(shapeData, null, 2)}`]);
    } catch (error) {
      console.error("Error:", error);
      setHistory(prev => [...prev, "Error: Failed to connect to backend."]);
    }

    setPrompt("");
  };

  const handleClear = () => {
    setShapes([]);
    setHistory([]);
    setJsonList([]);
    localStorage.removeItem("jsonList");
  };

  const handleBack = () => {
    handleClear();
    navigate("/levelselection");
  };

  const handleGenerateSTL = async () => {
    if (!jsonList.length) {
      setHistory(prev => [...prev, "Error: No shapes to convert"]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8080/generate_stl",
        { shapes: jsonList },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "shapes.stl");
      document.body.appendChild(link);
      link.click();
      link.remove();

      setHistory(prev => [...prev, "STL file generated successfully."]);
    } catch (error) {
      console.error("Error:", error);
      setHistory(prev => [...prev, "Error: Failed to generate STL."]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateDXF = async () => {
    if (!jsonList.length) {
      setHistory(prev => [...prev, "Error: No shapes to convert"]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8080/generate_dxf",
        { shapes: jsonList },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "shapes.dxf");
      document.body.appendChild(link);
      link.click();
      link.remove();

      setHistory(prev => [...prev, "DXF file generated successfully."]);
    } catch (error) {
      console.error("Error:", error);
      setHistory(prev => [...prev, "Error: Failed to generate DXF."]);
    } finally {
      setIsLoading(false);
    }
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
      extrusionAmount: updatedJsonList[index].extrusionAmount || 1,
    };

    setJsonList(updatedJsonList);
    setShapes(updatedJsonList);
    localStorage.setItem("jsonList", JSON.stringify(updatedJsonList));
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      fontFamily: "'Press Start 2P', cursive",
      backgroundColor: COLORS.primary,
      color: COLORS.text
    }}>
      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "15px",
        backgroundColor: COLORS.primary,
        borderBottom: `2px solid ${COLORS.secondary}`
      }}>
        <h1 style={{ fontSize: "1.2rem", color: COLORS.text }}>Level {level}</h1>
        <div style={{ display: "flex", gap: "15px" }}>
          <button
            onClick={handleGenerateDXF}
            disabled={isLoading}
            style={{
              padding: "10px 20px",
              backgroundColor: "transparent",
              color: COLORS.secondary,
              border: `2px solid ${COLORS.secondary}`,
              cursor: isLoading ? "not-allowed" : "pointer",
              fontFamily: "'Press Start 2P', cursive",
              fontSize: "0.8rem"
            }}
          >
            DXF
          </button>
          <button
            onClick={handleGenerateSTL}
            disabled={isLoading}
            style={{
              padding: "10px 20px",
              backgroundColor: "transparent",
              color: COLORS.secondary,
              border: `2px solid ${COLORS.secondary}`,
              cursor: isLoading ? "not-allowed" : "pointer",
              fontFamily: "'Press Start 2P', cursive",
              fontSize: "0.8rem"
            }}
          >
            STL
          </button>
          <button
            onClick={() => setShowJsonModal(true)}
            style={{
              padding: "10px 20px",
              backgroundColor: "transparent",
              color: COLORS.secondary,
              border: `2px solid ${COLORS.secondary}`,
              cursor: "pointer",
              fontFamily: "'Press Start 2P', cursive",
              fontSize: "0.8rem"
            }}
          >
            📄
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ display: "flex", flex: 1 }}>
        {/* Left Panel - Commands */}
        <div style={{
          width: "45%",
          padding: "20px",
          borderRight: `2px solid ${COLORS.secondary}`,
          display: "flex",
          flexDirection: "column"
        }}>
          <h2 style={{ marginBottom: "15px", color: COLORS.text }}>Commands</h2>
          <div style={{
            flex: 1,
            overflowY: "auto",
            border: `2px solid ${COLORS.secondary}`,
            padding: "15px",
            marginBottom: "15px",
            backgroundColor: "rgba(255, 255, 255, 0.1)"
          }}>
            {history.map((item, index) => (
              <div 
                key={index} 
                style={{ 
                  marginBottom: "10px", 
                  whiteSpace: "pre-wrap",
                  color: item.startsWith('You:') ? COLORS.accent : COLORS.text
                }}
              >
                {item}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendPrompt()}
              style={{
                flex: 1,
                padding: "10px",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                border: `2px solid ${COLORS.secondary}`,
                color: COLORS.text,
                fontFamily: "'Press Start 2P', cursive",
                fontSize: "0.8rem"
              }}
              placeholder="Type command..."
            />
            <button
              onClick={handleSendPrompt}
              disabled={isLoading}
              style={{
                padding: "10px 20px",
                backgroundColor: "transparent",
                color: COLORS.secondary,
                border: `2px solid ${COLORS.secondary}`,
                cursor: isLoading ? "not-allowed" : "pointer",
                fontFamily: "'Press Start 2P', cursive"
              }}
            >
              Send
            </button>
            <button
              onClick={handleClear}
              style={{
                padding: "10px 20px",
                backgroundColor: "transparent",
                color: COLORS.text,
                border: "2px solid #996633",
                cursor: "pointer",
                fontFamily: "'Press Start 2P', cursive"
              }}
            >
              Clear
            </button>
          </div>
        </div>

        {/* Right Panel - Views */}
        <div style={{ flex: 1, padding: "20px" }}>
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "15px",
            marginBottom: "20px"
          }}>
            <button
              onClick={() => setActiveTab("2D")}
              style={{
                padding: "10px 20px",
                backgroundColor: activeTab === "2D" ? "rgba(255, 255, 255, 0.2)" : "transparent",
                color: COLORS.secondary,
                border: `2px solid ${COLORS.secondary}`,
                cursor: "pointer",
                fontFamily: "'Press Start 2P', cursive"
              }}
            >
              2D View
            </button>
            <button
              onClick={() => setActiveTab("3D")}
              style={{
                backgroundColor: activeTab === "3D" ? "rgba(255, 255, 255, 0.2)" : "transparent",
                color: COLORS.secondary,
                border: `2px solid ${COLORS.secondary}`,
                cursor: "pointer",
                fontFamily: "'Press Start 2P', cursive"
              }}
            >
              3D View
            </button>
            <button
              onClick={() => setActiveTab("Book")}
              style={{
                padding: "10px 20px",
                backgroundColor: activeTab === "Book" ? "rgba(255, 255, 255, 0.2)" : "transparent",
                color: COLORS.secondary,
                border: `2px solid ${COLORS.secondary}`,
                cursor: "pointer",
                fontFamily: "'Press Start 2P', cursive"
              }}
            >
              Instructions
            </button>
          </div>

          <div style={{ 
            height: "calc(90% - 70px)",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            padding: "20px",
            border: `2px solid ${COLORS.secondary}`,
            overflow: "hidden"
          }}>
            {activeTab === "2D" && <CoordinatePlane shapes={shapes} />}
            {activeTab === "3D" && (
              <div style={{ height: "97%", width: "97%" }}>
                <ThreeDView shapes={shapes} />
              </div>
            )}
            {activeTab === "Book" && <Book pages={PAGES} />}
          </div>
        </div>
      </div>

      {/* Back Button */}
      <button
        onClick={handleBack}
        style={{
          position: "fixed",
          bottom: "5px",
          right: "20px",
          padding: "10px 20px",
          backgroundColor: "transparent",
          color: COLORS.secondary,
          border: `2px solid ${COLORS.secondary}`,
          cursor: "pointer",
          fontFamily: "'Press Start 2P', cursive",
          transition: "all 0.3s ease"
        }}
      >
        Back
      </button>

      {/* JSON Modal */}
      {showJsonModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: COLORS.modalBg,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{
            width: "80%",
            maxHeight: "80vh",
            backgroundColor: COLORS.primary,
            border: `2px solid ${COLORS.secondary}`,
            padding: "25px",
            borderRadius: "8px",
            overflow: "auto"
          }}>
            <h2 style={{ marginBottom: "20px", color: COLORS.text }}>JSON Data</h2>
            {jsonList.map((json, index) => (
              <div key={index} style={{ marginBottom: "20px" }}>
                {editIndex === index ? (
                  <div>
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      style={{
                        width: "100%",
                        minHeight: "150px",
                        padding: "10px",
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        border: `2px solid ${COLORS.secondary}`,
                        color: COLORS.text,
                        fontFamily: "monospace",
                        marginBottom: "10px"
                      }}
                    />
                    <button
                      onClick={handleSaveJson}
                      style={{
                        padding: "8px 16px",
                        backgroundColor: "transparent",
                        color: COLORS.secondary,
                        border: `2px solid ${COLORS.secondary}`,
                        cursor: "pointer",
                        fontFamily: "'Press Start 2P', cursive"
                      }}
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div>
                    <pre style={{
                      padding: "15px",
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      border: `2px solid ${COLORS.secondary}`,
                      color: COLORS.text,
                      overflow: "auto"
                    }}>
                      {JSON.stringify(json, null, 2)}
                    </pre>
                    <div style={{ 
                      display: "flex", 
                      gap: "10px",
                      marginTop: "10px" 
                    }}>
                      <button
                        onClick={() => handleEditJson(index)}
                        style={{
                          padding: "8px 16px",
                          backgroundColor: "transparent",
                          color: COLORS.secondary,
                          border: `2px solid ${COLORS.secondary}`,
                          cursor: "pointer",
                          fontFamily: "'Press Start 2P', cursive"
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleExtrude(index)}
                        style={{
                          padding: "8px 16px",
                          backgroundColor: "transparent",
                          color: COLORS.secondary,
                          border: `2px solid ${COLORS.secondary}`,
                          cursor: "pointer",
                          fontFamily: "'Press Start 2P', cursive"
                        }}
                      >
                        Extrude
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <button
              onClick={() => setShowJsonModal(false)}
              style={{
                padding: "10px 20px",
                backgroundColor: "transparent",
                color: COLORS.secondary,
                border: `2px solid ${COLORS.secondary}`,
                cursor: "pointer",
                fontFamily: "'Press Start 2P', cursive",
                display: "block",
                margin: "20px auto 0"
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,255,0.3)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 2000
        }}>
          <div style={{
            color: COLORS.text,
            fontFamily: "'Press Start 2P', cursive",
            fontSize: "1.2rem"
          }}>
            Processing...
          </div>
        </div>
      )}
    </div>
  );
};

export default LevelView6;
