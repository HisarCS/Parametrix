import React, { useState } from "react";

const BookView = ({ initialPages }) => {
    const defaultPages = [
        // Page 1: Introduction
        `Page 1: Welcome to Parametrix!\n\nParametrix is a parametric design tool where you define shapes using dynamic parameters. 
      In this tutorial, you’ll learn to:\n- Define a rectangle.\n- Position it in 3D space.\n- Extrude it into a 3D shape.\n\nLet’s start!`,
      
        // Page 2: Understanding the Rectangle
        `Page 2: What is a Rectangle?\n\nA rectangle is a 2D shape with:\n1. **Width**: The horizontal size.\n2. **Height**: The vertical size.\n3. **Position**: Where it sits in 3D space.\n4. **Plane**: The surface it lies on (e.g., YZConstructionPlane).\n\nBefore we define the rectangle, think:\n- How wide and tall should your rectangle be?\n- Where should it be placed in 3D space?\nWrite down your ideas before continuing.`,
      
        // Page 3: How to Define a Rectangle in JSON
        `Page 3: JSON for a Rectangle\n\nIn Parametrix, a rectangle is defined like this:\n{\n  "coordinates": [1, 2, 0],\n  "parameters": {\n    "height": 6,\n    "width": 4\n  },\n  "plane": "YZConstructionPlane",\n  "shape": "rectangle",\n  "name": "rectangle_1",\n  "extruded": false,\n  "extrusionAmount": null\n}\n\n**Breakdown:**\n- **coordinates**: The rectangle’s 3D position.\n- **parameters**: Height and width.\n- **plane**: Which construction plane it belongs to.\n- **extruded**: Whether it’s a flat shape or has been extruded.\n\nNext, we’ll position this rectangle.`,
      
        // Page 4: Positioning the Rectangle (Logic)
        `Page 4: Positioning the Rectangle\n\nThe rectangle is positioned at coordinates (1, 2, 0) on the YZConstructionPlane.\n**Logic:**\n- '1' specifies its position along the X-axis.\n- '2' specifies its position along the Y-axis.\n- '0' specifies its position along the Z-axis.\n\nThink:\n- What would happen if you moved the rectangle to (2, 3, 1)?\n- How would the rectangle look if it were on a different plane?\nWrite your thoughts before continuing.`,
      
        // Page 5: Positioning the Rectangle (JSON Update)
        `Page 5: Positioning the Rectangle (JSON Update)\n\nIf you move the rectangle to (2, 3, 1), the JSON becomes:\n{\n  "coordinates": [2, 3, 1],\n  "parameters": {\n    "height": 6,\n    "width": 4\n  },\n  "plane": "YZConstructionPlane",\n  "shape": "rectangle",\n  "name": "rectangle_1",\n  "extruded": false,\n  "extrusionAmount": null\n}\n\nNotice how only the 'coordinates' field changes. Let’s move on to extruding the rectangle.`,
      
        // Page 6: What is Extrusion?
        `Page 6: Understanding Extrusion\n\nExtrusion transforms a flat 2D shape into a 3D object by adding depth.\n**Example:** A rectangle extruded by 1 unit becomes a rectangular prism.\n\nQuestion:\n- If your rectangle has a height of 6 and a width of 4, what will the final shape look like after extrusion?\nWrite down your guess before continuing.`,
      
        // Page 7: Extrusion Process
        `Page 7: How to Extrude the Rectangle\n\nIn Parametrix, you extrude a shape using the 'Extrude' button in the JSON viewer. Once extruded:\n- The 'extruded' property changes to 'true'.\n- An 'extrusionAmount' is added, defining the depth.\n\nClick the 'Extrude' button to apply extrusion!`,
      
        // Page 8: Extrusion JSON (Post-Extrusion)
        `Page 8: Extruded Rectangle (JSON Form)\n\nAfter extrusion, the rectangle’s JSON looks like this:\n{\n  "coordinates": [2, 3, 1],\n  "parameters": {\n    "height": 6,\n    "width": 4\n  },\n  "plane": "YZConstructionPlane",\n  "shape": "rectangle",\n  "name": "rectangle_1",\n  "extruded": true,\n  "extrusionAmount": 1\n}\n\nNotice:\n- 'extruded' is now 'true'.\n- 'extrusionAmount' is set to 1 (the depth of extrusion).`,
      
        // Page 9: Experimenting with Dimensions
        `Page 9: Modify Dimensions\n\nLet’s modify the dimensions of your rectangle dynamically:\n- Change 'width' to 5.\n- Change 'height' to 8.\n- Keep the same 'coordinates' and 'plane'.\n\nThink:\n- How will this change the shape?\n- What happens if you modify 'coordinates' at the same time?\nWrite your guesses before continuing.`,
      
        // Page 10: Modified Rectangle (JSON Example)
        `Page 10: Modified Rectangle (JSON Form)\n\nAfter modifying dimensions, the JSON becomes:\n{\n  "coordinates": [2, 3, 1],\n  "parameters": {\n    "height": 8,\n    "width": 5\n  },\n  "plane": "YZConstructionPlane",\n  "shape": "rectangle",\n  "name": "rectangle_1",\n  "extruded": true,\n  "extrusionAmount": 1\n}\n\nNotice how the dimensions update dynamically while keeping the rectangle extruded.`,
      
        // Page 11: Conclusion
        `Page 11: Congratulations!\n\nYou’ve successfully created and modified a parametric rectangle in Parametrix. You:\n- Defined the rectangle’s dimensions and position.\n- Placed it on the YZConstructionPlane.\n- Extruded it into a 3D shape.\n\nNow, try experimenting with other shapes and planes to explore parametric design further. The possibilities are endless!`
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

export default BookView;
