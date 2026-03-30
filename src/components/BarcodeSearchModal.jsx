// src/components/BarcodeSearchModal.jsx

import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import './BarcodeSearchModal.css';

const BarcodeSearchModal = ({ 
  isOpen, 
  onClose, 
  onProductFound, 
  scannedCode,
  products 
}) => {
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [manualCode, setManualCode] = useState(scannedCode || '');

  useEffect(() => {
    if (scannedCode && isOpen) {
      searchProductByBarcode(scannedCode);
    }
  }, [scannedCode, isOpen]);

  const searchProductByBarcode = async (code) => {
    setLoading(true);
    setError(null);
    setSearchResult(null);

    try {
      // Buscar en Firestore
      const q = query(
        collection(db, 'inventario'),
        where('codigoBarras', '==', code)
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setError(`❌ Producto con código ${code} no encontrado`);
        return;
      }

      const productData = snapshot.docs[0].data();
      const productId = snapshot.docs[0].id;

      // Validar inventario disponible
      if (productData.cantidad <= 0) {
        setError(`❌ ${productData.nombre} no tiene stock disponible`);
        return;
      }

      setSearchResult({
        id: productId,
        ...productData,
      });
    } catch (err) {
      console.error('Error buscando producto:', err);
      setError('Error al buscar el producto');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    if (searchResult) {
      onProductFound({
        id: searchResult.id,
        nombre: searchResult.nombre,
        cantidad: 1,
        precio: searchResult.costoVenta,
        costoCompra: searchResult.costoCompra,
      });
      setSearchResult(null);
      setManualCode('');
      onClose();
    }
  };

  const handleManualSearch = () => {
    if (manualCode.trim()) {
      searchProductByBarcode(manualCode);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="barcode-modal-overlay">
      <div className="barcode-modal">
        <div className="barcode-modal-header">
          <h3>🔍 Buscar Producto por Código</h3>
          <button onClick={onClose} className="modal-close-btn">
            ✕
          </button>
        </div>

        <div className="barcode-modal-content">
          {/* Manual input */}
          <div className="manual-input-section">
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleManualSearch()}
              placeholder="Ingresa código de barras manualmente..."
              className="barcode-input scanner-active"
              autoFocus
            />
            <button onClick={handleManualSearch} className="search-btn">
              Buscar
            </button>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="loading-spinner">
              ⏳ Buscando producto...
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="search-error">
              {error}
            </div>
          )}

          {/* Success state */}
          {searchResult && (
            <div className="product-found">
              <div className="product-card">
                <h4>{searchResult.nombre}</h4>
                <div className="product-details">
                  <p>
                    <strong>Código:</strong> {searchResult.codigoBarras}
                  </p>
                  <p>
                    <strong>Precio Venta:</strong> Bs. {searchResult.costoVenta.toFixed(2)}
                  </p>
                  <p>
                    <strong>Stock Disponible:</strong> {searchResult.cantidad} unidades
                  </p>
                  {searchResult.descripcion && (
                    <p>
                      <strong>Descripción:</strong> {searchResult.descripcion}
                    </p>
                  )}
                </div>

                <div className="product-actions">
                  <button
                    onClick={handleAddProduct}
                    className="add-product-btn"
                  >
                    ✅ Agregar a Comanda
                  </button>
                  <button
                    onClick={() => {
                      setSearchResult(null);
                      setManualCode('');
                    }}
                    className="cancel-btn"
                  >
                    Buscar Otro
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* No search yet */}
          {!loading && !error && !searchResult && (
            <div className="no-search">
              <p>Escanea un código o ingresa manualmente para buscar un producto</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BarcodeSearchModal;
