import React, { useState } from "react";

const Book1 = ({ initialPages }) => {
    const defaultPages = [
      `Page 1: Welcome to Parametrix Tutorial - Building Simple Rectangle
   
   Here at Parametrix we'll learn how to create basic shapes through parameters and controls. We'll start by building a simple rectangle.
   
   First, let's understand what parameters are:
   - Numbers that control dimensions
   - Values that set positions  
   - Settings that define orientation`,
   
      `Page 2: Understanding Our Building Space
   
   Before we draw anything, let's understand our workspace:
   
   XY Plane is like a piece of paper:
   - X: Left/Right
   - Y: Forward/Back
   - Z: Up/Down
   
   This is where we'll start building.`,
   
      `Page 3: Parameters for a Rectangle
   
   A rectangle needs:
   - Width (how long)
   - Height (how tall)
   - Position (where to place it)
   - Plane (which surface to draw on)
   
   Think: What values would you use to make a 3x3 rectangle at the center?`,
   
      `Page 4: Writing Your First Command 
   
   Your Challenge:
   Create a rectangle that is:
   - 3 units wide
   - 3 units tall 
   - On the XY plane
   - At center point (0,0,0)
   
   Try writing the command before continuing...`,
   
      `Page 5: The Command Structure
   
   Here's our basic command:
   rectangle <width> <height> on <plane> at (<x>,<y>,<z>)
   
   For our 3x3 rectangle at center, we need:
   rectangle 3 3 on XYConstructionPlane at (0,0,0)`,
   
      `Page 6: Understanding the Response
   
   When we enter that command, the system creates this data:
   {
    "shape": "rectangle",
    "parameters": {
      "width": 3, 
      "height": 3
    },
    "plane": "XYConstructionPlane",
    "coordinates": [0, 0, 0],
    "name": "rectangle_1",
    "extruded": true
   }`,
   
      `Page 7: Breaking Down the Response
   
   Let's understand each part:
   
   1. Shape Info:
   - Type: rectangle
   - Name: rectangle_1 (automatic)
   
   2. Parameters:
   - Width: 3 units
   - Height: 3 units
   
   3. Position:
   - Plane: XY
   - Location: (0,0,0)`,
   
      `Page 8: Practice Time!
   
   Your Turn:
   Create a rectangle that is:
   - 5 units wide
   - 2 units tall
   - On XY plane
   - 3 units up from center
   
   Write your command to the prompting space on the left.)`,
   
      `Page 9: Solution Check
   
   The command should be:
   rectangle 5 2 on XYConstructionPlane at (0,0,3)
   
   The response will show:
   {
    "shape": "rectangle",
    "parameters": {
      "width": 5,
      "height": 2
    },
    "plane": "XYConstructionPlane", 
    "coordinates": [0, 0, 3],
    "name": "rectangle_1",
    "extruded": true
   }`,
   
      `Page 10: What We Learned
   
   Congratulations! You now understand:
   - Basic parameters
   - Command structure
   - Position system
   - Response format
   
   Ready for the next tutorial? We'll learn about circles!`
    ];
   
      
      
  const [pages, setPages] = useState(initialPages || defaultPages);
  const [currentPage, setCurrentPage] = useState(0);

  const handleNextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageChange = (e) => {
    const updatedPages = [...pages];
    updatedPages[currentPage] = e.target.value;
    setPages(updatedPages);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "black",
        color: "white",
        fontFamily: "'Press Start 2P', cursive",
      }}
    >
      {/* Book Container */}
      <div
        style={{
          width: "400px",
          height: "500px",
          backgroundColor: "white",
          border: "5px solid black",
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
        }}
      >
        {/* Page Indicator */}
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            fontSize: "14px",
            fontWeight: "bold",
          }}
        >
          Page {currentPage + 1} of {pages.length}
        </div>

        {/* Editable Page Content */}
        <textarea
          style={{
            flex: 1,
            padding: "10px",
            fontSize: "16px",
            fontFamily: "'Press Start 2P', cursive",
            overflowY: "auto",
            border: "2px dashed black",
            borderRadius: "5px",
            backgroundColor: "#fdfdfd",
            resize: "none",
            whiteSpace: "pre-wrap",
          }}
          value={pages[currentPage]}
          onChange={handlePageChange}
        />

        {/* Navigation Buttons */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button
            style={{
              padding: "10px 20px",
              fontSize: "14px",
              fontFamily: "'Press Start 2P', cursive",
              backgroundColor: currentPage === 0 ? "white" : "gray",
              color: currentPage === 0 ? "black" : "black",
              border: "2px solid black",
              cursor: currentPage > 0 ? "pointer" : "not-allowed",
              transition: "transform 0.2s",
            }}
            onClick={handlePreviousPage}
            disabled={currentPage === 0}
          >
            Previous
          </button>
          <button
            style={{
              padding: "10px 20px",
              fontSize: "14px",
              fontFamily: "'Press Start 2P', cursive",
              backgroundColor: currentPage === pages.length - 1 ? "white" : "gray",
              color: currentPage === pages.length - 1 ? "black" : "black",
              border: "2px solid black",
              cursor: currentPage < pages.length - 1 ? "pointer" : "not-allowed",
              transition: "transform 0.2s",
            }}
            onClick={handleNextPage}
            disabled={currentPage === pages.length - 1}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Book1;
