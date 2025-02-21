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

  const API_BASE_URL = 'http://127.0.0.1:5001';

  const checkBackendHealth = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/health`);
      return response.data.status === "ok";
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  };
  
  const loadStoredData = () => {
    try {
      const stored = localStorage.getItem('jsonList');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load stored data:', error);
      return [];
    }
  };
  
  const saveToStorage = (data) => {
    try {
      localStorage.setItem('jsonList', JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Failed to save data:', error);
      return false;
    }
  };
  
  const generateUniqueName = (baseShape, existingShapes) => {
    const count = existingShapes.filter(shape => shape.shape === baseShape).length;
    return `${baseShape}_${count + 1}`;
  };
  
  const getErrorMessage = (error) => {
    if (error.response) {
      return error.response.data?.error || 
             error.response.data || 
             `Server error: ${error.response.status}`;
    }
    if (error.request) {
      return 'No response from server. Please check your connection.';
    }
    return error.message || 'An unexpected error occurred';
  };
  
  // State Management Functions
  const updateShapesAndStorage = (shapes, setJsonList, setShapes) => {
    setJsonList(shapes);
    setShapes(shapes);
    saveToStorage(shapes);
  };

  const handleConvertToDXF = async () => {
    if (jsonList.length === 0) {
      setHistory(prev => [...prev, "Error: No shapes to convert"]);
      return;
    }
  
    setIsLoading(true);
    try {
      const response = await axios({
        method: 'post',
        url: 'http://127.0.0.1:8080/generate_dxf',
        data: { shapes: jsonList },
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*'
        },
        responseType: 'blob',
        timeout: 30000, // Increased timeout
        withCredentials: false // Important for CORS
      });
  
      // Handle the downloaded file
      const blob = new Blob([response.data], { 
        type: 'application/octet-stream' 
      });
      
      // Create download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      // Get filename from headers or generate one
      const filename = response.headers['content-disposition']
        ? response.headers['content-disposition'].split('filename=')[1].replace(/"/g, '')
        : `parametrix_shapes_${Date.now()}.dxf`;
        
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
  
      setHistory(prev => [...prev, "Successfully converted shapes to DXF"]);
    } catch (error) {
      console.error('DXF conversion error:', error);
      let errorMessage = "Failed to convert to DXF: ";
      
      if (error.response) {
        // Server responded with error
        errorMessage += error.response.data?.error || error.response.statusText;
      } else if (error.request) {
        // No response received
        errorMessage += "No response from server. Please check your connection.";
      } else {
        // Request setup error
        errorMessage += error.message;
      }
      
      setHistory(prev => [...prev, `Error: ${errorMessage}`]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConvertToSTL = async () => {
    if (jsonList.length === 0) {
      setHistory(prev => [...prev, "Error: No shapes to convert"]);
      return;
    }
  
    setIsLoading(true);
    try {
      // Transform the data to match Julia's expectations AND wrap in shapes object
      const transformedShapes = {
        shapes: jsonList.map(shape => ({
          ...shape,
          extrusion_amount: shape.extrusionAmount,
          coordinates: shape.coordinates,
          parameters: shape.parameters,
          shape: shape.shape
        }))
      };
  
      // Log the transformed data for debugging
      console.log('Sending data:', JSON.stringify(transformedShapes, null, 2));
  
      const response = await axios({
        method: 'post',
        url: 'http://127.0.0.1:8080/generate_stl',
        data: transformedShapes,  // Now properly wrapped in {shapes: [...]}
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*'
        },
        responseType: 'blob',
        timeout: 30000
      });
  
      const blob = new Blob([response.data], { 
        type: 'application/octet-stream'
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      const filename = `parametrix_shapes_${Date.now()}.stl`;
      
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
  
      setHistory(prev => [...prev, "Successfully converted shapes to STL"]);
    } catch (error) {
      console.error('STL conversion error:', error);
      let errorMessage = "Failed to convert to STL: ";
      
      if (error.response) {
        errorMessage += error.response.data?.error || error.response.statusText;
      } else if (error.request) {
        errorMessage += "No response from server. Please check your connection.";
      } else {
        errorMessage += error.message;
      }
      
      setHistory(prev => [...prev, `Error: ${errorMessage}`]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handler Functions
  const handleSendPrompt = async () => {
    if (!prompt || !prompt.trim()) return;
  
    setIsLoading(true);
    setHistory(prev => [...prev, `You: ${prompt}`]);
  
    try {
      const response = await axios.post(
        `${API_BASE_URL}/process`,
        { command: prompt },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000,
        }
      );
  
      console.log('Backend response:', response.data);
  
      if (response.data.error) {
        throw new Error(response.data.error);
      }
  
      const shapeData = response.data;
      if (!shapeData.shape) {
        throw new Error('Invalid shape data received');
      }
  
      const shapeName = generateUniqueName(shapeData.shape, jsonList);
      const newShape = {
        ...shapeData,
        name: shapeName,
        extruded: false,
        extrusionAmount: null,
        created: new Date().toISOString()
      };
  
      const updatedShapes = [...jsonList, newShape];
      updateShapesAndStorage(updatedShapes, setJsonList, setShapes);
  
      setHistory(prev => [
        ...prev,
        `AI: Successfully created ${shapeName}`,
        `Data: ${JSON.stringify(shapeData, null, 2)}`
      ]);
  
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error('Command processing failed:', errorMessage);
      setHistory(prev => [...prev, `Error: ${errorMessage}`]);
    } finally {
      setIsLoading(false);
      setPrompt('');
    }
  };
  
  // Add isLoading state
  const [isLoading, setIsLoading] = useState(false);
  const handleKeyPress = (event, handleSendPrompt) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendPrompt();
    }
  };
  
 
  
  const useInitializeComponent = (setHistory, setJsonList, setShapes) => {
    useEffect(() => {
      const initComponent = async () => {
        const isHealthy = await checkBackendHealth();
        if (!isHealthy) {
          setHistory(['Warning: Backend service not available']);
        }
  
        const storedData = loadStoredData();
        setJsonList(storedData);
        setShapes(storedData);
      };
  
      initComponent();
    }, [setHistory, setJsonList, setShapes]);
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
        <h1 style={{ fontSize: "1.2rem", color: "#f4e2cc" }}>Parametrix</h1>
        <div style={{justifyContent: "space-between"}}>
          <button
            style={{
              fontFamily: "'Press Start 2P', cursive",
              padding: "10px 20px",
              fontSize: "1rem",
              backgroundColor: "transparent",
              color: "#f4e2cc",
              border: "2px solid #f4e2cc",
              cursor: "pointer",
              marginRight: "5px"
            }}
          >
            3D
          </button>
          
          <button
            style={{
              fontFamily: "'Press Start 2P', cursive",
              padding: "10px 20px",
              fontSize: "1rem",
              backgroundColor: "transparent",
              color: "#f4e2cc",
              border: "2px solid #f4e2cc",
              cursor: isLoading ? "not-allowed" : "pointer",
              opacity: isLoading ? 0.7 : 1,
              marginRight: "5px"
            }}
            onClick={handleConvertToDXF}
            disabled={isLoading}
            title="Convert all shapes to DXF"
          >
            {isLoading ? "Converting..." : "DXF"}
          </button>
          
          <button
            style={{
              fontFamily: "'Press Start 2P', cursive",
              padding: "10px 20px",
              fontSize: "1rem",
              backgroundColor: "transparent",
              color: "#f4e2cc",
              border: "2px solid #f4e2cc",
              cursor: isLoading ? "not-allowed" : "pointer",
              opacity: isLoading ? 0.7 : 1,
              marginRight: "5px"
            }}
            onClick={handleConvertToSTL}
            disabled={isLoading}
            title="Convert all shapes to STL"
          >
            {isLoading ? "Converting..." : "STL"}
          </button>
          
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
                fontFamily: "'Press Start 2P', cursive"
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
                fontFamily: "'Press Start 2P', cursive"
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
