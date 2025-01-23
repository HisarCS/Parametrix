import React, { useState } from "react";

const Book3 = ({ initialPages }) => {
    const defaultPages = [
      `Page 1: Table Parts & Parameters 
   
   Every table begins with basic components:
   - A circular top
   - Four square legs
   - Precise positioning
   
   Core parameters you'll learn:
   1. Top: Radius determines size
   2. Legs: Width and position for support
   3. Height: Overall table elevation`,
   
      `Page 2: Planning Our Table
   
   Let's build a table with:
   - Top diameter: 30 units
   - Table height: 28 units
   - Leg size: 2x2 units
   - Leg placement: 2 units from edge
   
   Your first task: Think about how these parts will fit together.`,
   
      `Page 3: The Top Circle
   
   The table top needs:
   - Radius of 15 units (30 diameter)
   - Placement at height 28
   - Central position (0,0,28)
   
   This is our starting command:
   circle 15 on XYConstructionPlane at (0,0,28)`,
   
      `Page 4: Understanding The Top's JSON
   
   When we create the top, our system shows:
   {
    "shape": "circle",
    "parameters": {
      "radius": 15
    },
    "plane": "XYConstructionPlane",
    "coordinates": [0, 0, 28],
    "name": "circle_1",
    "extruded": true
   }
   
   Study each value - you'll use these patterns later.`,
   
      `Page 5: Planning Leg Positions
   
   For stable support, legs need:
   - Square arrangement
   - Equal distance from center
   - Proper inset from edge
   
   With 15 unit radius and 2 unit inset:
   15 - 2 = 13 units from center for each leg`,
   
      `Page 6: Leg Position Math
   
   Each leg center will be:
   Front-right: (13,13,0)
   Front-left: (-13,13,0)
   Back-right: (13,-13,0)
   Back-left: (-13,-13,0)
   
   This creates our stable base square.`,
   
      `Page 7: Building First Leg
   
   Let's create the front-right leg:
   
   Command:
   rectangle 2 2 on XYConstructionPlane at (13,13,0)
   
   This places a 2x2 leg at position (13,13,0).`,
   
      `Page 8: First Leg JSON
   
   System shows:
   {
    "shape": "rectangle",
    "parameters": {
      "width": 2,
      "height": 2
    },
    "plane": "XYConstructionPlane",
    "coordinates": [13, 13, 0],
    "name": "rectangle_1",
    "extruded": true
   }`,
   
      `Page 9: Building Remaining Legs
   
   Place other legs using:
   rectangle 2 2 on XYConstructionPlane at (-13,13,0)
   rectangle 2 2 on XYConstructionPlane at (13,-13,0)
   rectangle 2 2 on XYConstructionPlane at (-13,-13,0)
   
   Notice the coordinate pattern.`,
   
      `Page 10: Complete Build Sequence
   
   Full table requires five commands:
   
   1. Top:
   circle 15 on XYConstructionPlane at (0,0,28)
   
   2. Four legs:
   rectangle 2 2 on XYConstructionPlane at (13,13,0)
   rectangle 2 2 on XYConstructionPlane at (-13,13,0)
   rectangle 2 2 on XYConstructionPlane at (13,-13,0)
   rectangle 2 2 on XYConstructionPlane at (-13,-13,0)`,
   
      `Page 11: Understanding Support
   
   Our leg placement creates:
   - 26x26 unit base square
   - Equal weight distribution
   - Stable support structure
   - Balanced appearance`,
   
      `Page 12: Checking Your Work
   
   Verify these points:
   1. Top centered at (0,0,28)
   2. Legs at exact mirror positions
   3. All legs same size (2x2)
   4. All legs start at ground (z=0)`,
   
      `Page 13: Making Adjustments
   
   To modify table height:
   1. Change top Z coordinate
   2. Adjust leg extrusion height
   
   To modify table width:
   1. Change top radius
   2. Recalculate leg positions (radius - 2)`,
   
      `Page 14: Size Relationships
   
   Important ratios:
   - Top radius to height: 15:28
   - Leg inset to radius: 2:15
   - Leg width to height: 2:28
   - Base width to top: 26:30`,
   
      `Page 15: Practice Task
   
   Create a smaller table:
   - Top radius: 10 units
   - Height: 20 units
   - Legs: 1.5x1.5 units
   - Calculate new leg positions...`,
   
      `Page 16: Error Checking
   
   Common mistakes:
   1. Wrong leg coordinates
   2. Incorrect radius calculation
   3. Misplaced top height
   4. Uneven leg dimensions`,
   
      `Page 17: Fine Tuning
   
   Adjusting for stability:
   - Leg inset ratio: 0.13-0.15 of radius
   - Height ratio: 0.8-1.0 of diameter
   - Leg thickness: 0.06-0.08 of height`,
   
      `Page 18: Design Principles
   
   Key aspects:
   1. Symmetrical layout
   2. Equal support distribution
   3. Balanced proportions
   4. Clean geometry`,
   
      `Page 19: Advanced Practice
   
   Try these variations:
   1. Taller bar table
   2. Wider dining table
   3. Small side table
   4. Conference table`,
   
      `Page 20: Next Steps
   
   You've learned:
   - Basic parameter relationships
   - Position calculations
   - Support structures
   - Scaling principles`
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

export default Book3;
