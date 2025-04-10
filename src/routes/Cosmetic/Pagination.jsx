// Pagination.js
import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="flex justify-center mt-4">
      <button
        onClick={handlePrevious}
        className="px-4 py-2 bg-blue-500 text-white rounded-l-md cursor-pointer"
        disabled={currentPage === 1}
      >
        이전
      </button>
      <span className="px-4 py-2">{`${currentPage} / ${totalPages}`}</span>
      <button
        onClick={handleNext}
        className="px-4 py-2 bg-blue-500 text-white rounded-r-md cursor-pointer"
        disabled={currentPage === totalPages}
      >
        다음
      </button>
    </div>
  );
};

export default Pagination;
