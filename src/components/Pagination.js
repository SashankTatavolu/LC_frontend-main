import React from "react";
import leftArrow from "../images/leftArrow.png";
import rightArrow from "../images/rightArrow.png";

function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="chapterPagination">
      <img
        src={leftArrow}
        alt="left_arrow"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="arrowButton"
      />
      {Array.from({ length: totalPages }).map((_, index) => (
        <button
          key={index}
          onClick={() => onPageChange(index + 1)}
          className={currentPage === index + 1 ? "activePage" : ""}
        >
          {index + 1}
        </button>
      ))}
      <img
        src={rightArrow}
        alt="right_arrow"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="arrowButton"
      />
    </div>
  );
}

export default Pagination;
