import React, { useState } from "react";

const Book2 = ({ initialPages }) => {
   const defaultPages = [
     `Page 1: Welcome to Parametrix Tutorial - Creating Circles
  
  In this chapter, we'll learn how to create circles using parameters. Circles are fundamental shapes that need different parameters than rectangles.`,
  
     `Page 2: Circle Parameters
  
  A circle needs just one main dimension:
  - Radius (distance from center to edge)
  
  This is simpler than rectangles which needed width and height. But we still need:
  - Position (where to place it)
  - Plane (which surface to draw on)`,
  
     `Page 3: Understanding Radius
  
  Radius determines circle size:
  - Larger radius = bigger circle
  - Smaller radius = smaller circle
  
  Think: How would you make a circle with radius 5 units?`,
  
     `Page 4: Writing Circle Commands
  
  The basic circle command structure:
  circle <radius> on <plane> at (<x>,<y>,<z>)
  
  Example making a circle:
  - Radius: 5 units
  - XY plane
  - At center (0,0,0)
  
  Try writing this command...`,
  
     `Page 5: The Circle Command
  
  Here's the command:
  circle 5 on XYConstructionPlane at (0,0,0)
  
  Notice:
  - Only one number for radius
  - Same plane system as rectangle
  - Same position system as rectangle`,
  
     `Page 6: System Response
  
  When we create this circle, the system responds:
  {
   "shape": "circle",
   "parameters": {
     "radius": 5
   },
   "plane": "XYConstructionPlane",
   "coordinates": [0, 0, 0],
   "name": "circle_1",
   "extruded": true
  }`,
  
     `Page 7: Breaking Down Circle JSON
  
  Let's analyze each part:
  
  Shape Info:
  - Type is now "circle"
  - Gets unique name "circle_1"
  
  Parameters:
  - Single "radius" value
  - No width/height needed
  
  Position:
  - Same XY plane
  - Same coordinate system`,
  
     `Page 8: Practice Task
  
  Your turn! Create:
  - Circle with radius 3
  - On XY plane
  - 2 units up from center
  
  Write your command before continuing...`,
  
     `Page 9: Practice Solution
  
  Command should be:
  circle 3 on XYConstructionPlane at (0,0,2)
  
  System response:
  {
   "shape": "circle",
   "parameters": {
     "radius": 3
   },
   "plane": "XYConstructionPlane",
   "coordinates": [0, 0, 2],
   "name": "circle_1",
   "extruded": true
  }`,
  
     `Page 10: Circle vs Rectangle
  
  Key differences learned:
  - Circle uses radius instead of width/height
  - Circle commands are shorter
  - Circle JSON has simpler parameters
  - Both use same plane and position system
  
  Ready to combine shapes in next tutorial!`
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

export default Book2;
