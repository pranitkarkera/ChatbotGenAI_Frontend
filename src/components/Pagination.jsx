// Pagination.jsx
import React from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Pagination = ({ currentPage, onNextPage, onPreviousPage }) => {
  return (
    <div className="flex justify-between mb-4">
      <button
        onClick={onPreviousPage}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
      >
        <ArrowBackIcon />
      </button>
      <span>Page {currentPage}</span>
      <button
        onClick={onNextPage}
        className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
      >
        <ArrowForwardIcon />
      </button>
    </div>
  );
};

export default Pagination;
