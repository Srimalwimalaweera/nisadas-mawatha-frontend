// src/components/page_layouts/BasicPdfLayout.jsx (STABLE VERSION)

import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import { BsArrowLeftCircleFill, BsArrowRightCircleFill } from "react-icons/bs";
import './BasicPdfLayout.css';

function BasicPdfLayout({ pdfUrl }) {
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setError(null); // Clear previous errors on new PDF load
  }

  const onDocumentLoadError = () => {
    setError('Failed to load the PDF file. Please check the file URL or try again.');
  };

  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, numPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  
  return (
    <div className="basic-layout-container">
      <div className="page-view-area">
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={<div className="layout-status">Loading PDF...</div>}
        >
          {/* Only render page if document loaded successfully */}
          {!error && <Page pageNumber={currentPage} className="pdf-page-render" />}
        </Document>
      </div>

      {numPages && !error && (
        <div className="controls-bar">
          <button onClick={prevPage} disabled={currentPage <= 1}><BsArrowLeftCircleFill /></button>
          <span>Page {currentPage} of {numPages}</span>
          <button onClick={nextPage} disabled={currentPage >= numPages}><BsArrowRightCircleFill /></button>
        </div>
      )}
      {error && <div className="layout-status error">{error}</div>}
    </div>
  );
}

export default BasicPdfLayout;