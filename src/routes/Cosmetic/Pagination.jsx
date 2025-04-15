// Pagination.js
import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // 이전 페이지 버튼 클릭 핸들러
  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  // 다음 페이지 버튼 클릭 핸들러
  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  // 페이지 번호 범위 계산
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center mt-4 mr-4 items-center">
      <button
        onClick={handlePrevious}
        className="px-4 py-2 bg-blue-500 text-white rounded-l-md cursor-pointer mr-4"
        disabled={currentPage === 1}
      >
        이전
      </button>

      {/* 페이지 번호 리스트 표시 */}
      <div className="flex space-x-2">
        {pageNumbers.map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            className={`px-4 py-2 ${currentPage === pageNumber ? "bg-blue-700 text-white" : "bg-white text-blue-500"} rounded-md cursor-pointer`}
          >
            {pageNumber}
          </button>
        ))}
      </div>

      <button
        onClick={handleNext}
        className="px-4 py-2 bg-blue-500 text-white rounded-r-md cursor-pointer ml-4"
        disabled={currentPage === totalPages}
      >
        다음
      </button>
    </div>
  );
};

export default Pagination;
