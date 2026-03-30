// src/components/BarcodeReaderStatus.jsx

import React from 'react';
import './BarcodeReaderStatus.css';

const BarcodeReaderStatus = ({ isActive, lastScanned, error, onClearError }) => {
  return (
    <div className="barcode-status-container">
      <div className={`reader-status ${isActive ? 'active' : 'inactive'}`}>
        <span className="status-indicator">
          {isActive ? '🔴' : '⚫'}
        </span>
        <span className="status-text">
          {isActive ? 'Lector USB Activo' : 'Lector Inactivo'}
        </span>
      </div>

      {lastScanned && (
        <div className="last-scanned-badge">
          📱 Último código: <strong>{lastScanned}</strong>
        </div>
      )}

      {error && (
        <div className="error-alert">
          <span>{error}</span>
          <button onClick={onClearError} className="close-error-btn">
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default BarcodeReaderStatus;
