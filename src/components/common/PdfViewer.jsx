// src/components/common/PdfViewer.jsx (Corrected Worker Path)

import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import './PdfViewer.css';

// --- VVVV PDF.js worker configure කරන පේළිය මෙසේ වෙනස් කරන්න VVVV ---
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

function PdfViewer({ pdfUrl, onClose }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  function goToPrevPage() {
    setPageNumber(prevPage => Math.max(prevPage - 1, 1));
  }

  function goToNextPage() {
    setPageNumber(prevPage => Math.min(prevPage + 1, numPages));
  }

  return (
    <div className="pdf-viewer-overlay" onClick={onClose}>
      <div className="pdf-viewer-container" onClick={(e) => e.stopPropagation()}>
        <button className="pdf-close-btn" onClick={onClose}>&times;</button>
        <div className="pdf-document-wrapper">
          <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
            <Page pageNumber={pageNumber} /> 
          </Document>
        </div>
        <div className="pdf-controls">
          <button onClick={goToPrevPage} disabled={pageNumber <= 1}>
            Previous
          </button>
          <p>Page {pageNumber} of {numPages || '--'}</p>
          <button onClick={goToNextPage} disabled={pageNumber >= numPages}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default PdfViewer;