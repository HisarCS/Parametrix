import React, { useState } from "react";

const Book4 = ({ initialPages }) => {
    const defaultPages = [
        // Page 1: Introduction
        `Page 1: Shape!`
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
