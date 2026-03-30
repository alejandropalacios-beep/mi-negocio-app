// src/hooks/useUSBBarcodeReader.js

import { useState, useEffect, useCallback } from 'react';

export const useUSBBarcodeReader = () => {
  const [lastScannedCode, setLastScannedCode] = useState(null);
  const [error, setError] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let barcodeBuffer = '';
    let scanTimeout;

    const handleKeyPress = (event) => {
      // Ignorar si está escribiendo en input no relacionado al escaneo
      if (
        event.target.tagName === 'INPUT' &&
        !event.target.classList.contains('barcode-input') &&
        !event.target.classList.contains('scanner-active')
      ) {
        return;
      }

      // Detectar Enter (final del código)
      if (event.key === 'Enter' && barcodeBuffer.length > 0) {
        event.preventDefault();

        if (barcodeBuffer.length >= 5) {
          const cleanCode = barcodeBuffer.trim();
          setLastScannedCode(cleanCode);
          setScanHistory((prev) => [
            { code: cleanCode, timestamp: new Date().toLocaleTimeString() },
            ...prev.slice(0, 19),
          ]);
          setError(null);
          barcodeBuffer = '';
        } else {
          setError('❌ Código muy corto (mínimo 5 caracteres)');
        }

        clearTimeout(scanTimeout);
      } else if (event.key.length === 1 && event.key.match(/[0-9a-zA-Z\-\*]/)) {
        // Acumular caracteres válidos
        barcodeBuffer += event.key;
        clearTimeout(scanTimeout);

        // Timeout de 2 segundos sin Enter
        scanTimeout = setTimeout(() => {
          if (barcodeBuffer.length > 0) {
            const cleanCode = barcodeBuffer.trim();
            if (cleanCode.length >= 5) {
              setLastScannedCode(cleanCode);
              setScanHistory((prev) => [
                {
                  code: cleanCode,
                  timestamp: new Date().toLocaleTimeString(),
                },
                ...prev.slice(0, 19),
              ]);
              setError(null);
            } else {
              setError('❌ Código muy corto');
            }
            barcodeBuffer = '';
          }
        }, 2000);
      }
    };

    document.addEventListener('keypress', handleKeyPress);
    setIsActive(true);

    return () => {
      document.removeEventListener('keypress', handleKeyPress);
      clearTimeout(scanTimeout);
      setIsActive(false);
    };
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const resetLastCode = useCallback(() => {
    setLastScannedCode(null);
  }, []);

  return {
    lastScannedCode,
    setLastScannedCode,
    error,
    setError,
    clearError,
    resetLastCode,
    scanHistory,
    isActive,
  };
};
