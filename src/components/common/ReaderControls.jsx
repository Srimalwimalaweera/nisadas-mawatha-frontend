// src/components/common/ReaderControls.jsx

import React from 'react';
import { BsArrowLeftCircleFill, BsArrowRightCircleFill } from "react-icons/bs";
import './ReaderControls.css';

function ReaderControls({ goPrev, goNext, currentPage, totalPages }) {
  const startPage = currentPage * 2;
  const endPage = startPage + 1;

  return (
    <div className="reader-controls-new">
      <button onClick={goPrev} disabled={currentPage === 0}>
        <BsArrowLeftCircleFill />
      </button>
      <span>Page {startPage > totalPages ? totalPages : startPage}{endPage > totalPages ? '' : `-${endPage}`} of {totalPages}</span>
      <button onClick={goNext} disabled={endPage >= totalPages}>
        <BsArrowRightCircleFill />
      </button>
    </div>
  );
}

export default ReaderControls;