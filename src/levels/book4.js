import React, { useState } from "react";

const Book4 = ({ initialPages }) => {
  const defaultPages = [
    `Page 1: Modern Parametric Bookshelf Design

We'll create a wall-mounted bookshelf with:
- 3 main shelves
- 6 vertical dividers
- Clean floating appearance
- Standard book depths
- Load-bearing capacity`,

    `Page 2: Bookshelf Core Parameters

Base dimensions:
- Total width: 60 units
- Height: 40 units
- Depth: 12 units
- Shelf thickness: 2 units
- Divider thickness: 2 units

These measurements accommodate standard book sizes.`,

    `Page 3: Main Back Panel

Starting with supporting back:

Command:
rectangle 60 40 on YZConstructionPlane at (0,0,0)

Creates the wall-mounting surface and main structural support.`,

    `Page 4: Understanding Back Panel JSON

System creates:
{
  "shape": "rectangle",
  "parameters": {
    "width": 60,
    "height": 40
  },
  "plane": "YZConstructionPlane",
  "coordinates": [0, 0, 0],
  "name": "rectangle_1",
  "extruded": true
}`,

    `Page 5: Horizontal Shelf Planning

Three shelves needed:
- Bottom: 12 units from ground
- Middle: 24 units high
- Top: 36 units high

Each shelf:
- Width: 60 units
- Depth: 12 units
- Thickness: 2 units`,

    `Page 6: Creating Bottom Shelf

Command:
rectangle 60 12 on XYConstructionPlane at (0,0,12)

This creates our first horizontal surface.
Extrusion will create 2-unit thickness.`,

    `Page 7: Middle and Top Shelves

Commands:
Middle:
rectangle 60 12 on XYConstructionPlane at (0,0,24)

Top:
rectangle 60 12 on XYConstructionPlane at (0,0,36)

Creates even spacing between shelves.`,

    `Page 8: Vertical Divider Planning

Six dividers create seven sections:
- Width between dividers: 8 units
- Height: 38 units (between shelves)
- Depth: 12 units (matches shelves)
- Spacing: 10 units apart`,

    `Page 9: Divider Positioning

Divider positions from left:
1. X = -25
2. X = -15
3. X = -5
4. X = 5
5. X = 15
6. X = 25

Each is centered between shelves.`,

    `Page 10: Creating Dividers

Commands for dividers:
rectangle 2 38 on XZConstructionPlane at (-25,12,1)
rectangle 2 38 on XZConstructionPlane at (-15,12,1)
rectangle 2 38 on XZConstructionPlane at (-5,12,1)
rectangle 2 38 on XZConstructionPlane at (5,12,1)
rectangle 2 38 on XZConstructionPlane at (15,12,1)
rectangle 2 38 on XZConstructionPlane at (25,12,1)`,

    `Page 11: Complete Build Sequence

1. Back panel
2. Three horizontal shelves
3. Six vertical dividers

Total: 10 geometric elements
Each with specific position and purpose`,

    `Page 12: Load Calculations

Each section can support:
- Standard books (10-15 units)
- Back panel provides main support
- Dividers prevent shelf sagging
- Even weight distribution`,

    `Page 13: Compartment Usage

Created spaces:
- 7 sections per shelf
- 21 total compartments
- Each 8 units wide
- Perfect for standard books
- Flexible storage options`,

    `Page 14: Aesthetic Proportions

Design ratios:
- Height to width: 2:3
- Depth to width: 1:5
- Section width to height: 1:5
- Shelf spacing: Equal thirds`,

    `Page 15: Structural Integrity

Support system:
- Back panel anchors to wall
- Shelves bond to back
- Dividers connect all layers
- Forces distribute evenly`,

    `Page 16: Customization Options

Modify design by:
1. Changing total width
2. Adjusting height
3. Varying compartment sizes
4. Adding/removing dividers`,

    `Page 17: Common Modifications

Popular changes:
1. Deeper shelves (14 units)
2. Higher spacing (15 units)
3. Fewer dividers
4. Thicker shelves (3 units)`,

    `Page 18: Error Prevention

Check for:
1. Aligned dividers
2. Level shelves
3. Proper spacing
4. Even distributions`,

    `Page 19: Advanced Features

Consider adding:
1. Bottom support feet
2. Top crown molding
3. Integrated lighting
4. Cable management`,

    `Page 20: Final Review

You've learned:
- Multi-component construction
- Structural support systems
- Space division
- Load distribution
- Modular design principles`
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

export default Book4;
