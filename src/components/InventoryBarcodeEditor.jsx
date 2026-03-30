// src/components/InventoryBarcodeEditor.jsx

import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
} from 'firebase/firestore';
import './InventoryBarcodeEditor.css';

const InventoryBarcodeEditor = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editingCode, setEditingCode] = useState('');
  const [filter, setFilter] = useState(''); // Para filtrar sin código
  const [saveMessage, setSaveMessage] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const snapshot = await getDocs(collection(db, 'inventario'));
      const productsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsData);
    } catch (error) {
      console.error('Error cargando productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCode = async (productId) => {
    if (!editingCode.trim()) {
      alert('El código no puede estar vacío');
      return;
    }

    try {
      await updateDoc(doc(db, 'inventario', productId), {
        codigoBarras: editingCode.trim(),
      });

      // Actualizar estado local
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, codigoBarras: editingCode.trim() } : p
        )
      );

      setSaveMessage('✅ Código guardado exitosamente');
      setTimeout(() => setSaveMessage(null), 3000);
      setEditingId(null);
      setEditingCode('');
    } catch (error) {
      console.error('Error guardando código:', error);
      alert('Error al guardar el código');
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setEditingCode(product.codigoBarras || '');
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingCode('');
  };

  // Productos sin código de barras
  const productsWithoutCode = products.filter((p) => !p.codigoBarras);
  
  // Aplicar filtro
  const filteredProducts = filter === 'sin-codigo'
    ? productsWithoutCode
    : products;

  if (loading) {
    return <div className="loading-container">⏳ Cargando inventario...</div>;
  }

  return (
    <div className="inventory-barcode-editor">
      <div className="editor-header">
        <h2>📦 Gestor de Códigos de Barras</h2>
        <p className="subtitle">
          Edita los códigos de barras de tus productos
        </p>
      </div>

      {saveMessage && (
        <div className="save-message">
          {saveMessage}
        </div>
      )}

      <div className="editor-controls">
        <div className="filter-buttons">
          <button
            onClick={() => setFilter('')}
            className={`filter-btn ${filter === '' ? 'active' : ''}`}
          >
            Todos ({products.length})
          </button>
          <button
            onClick={() => setFilter('sin-codigo')}
            className={`filter-btn warning ${filter === 'sin-codigo' ? 'active' : ''}`}
          >
            Sin Código ({productsWithoutCode.length})
          </button>
        </div>

        <button onClick={loadProducts} className="reload-btn">
          🔄 Recargar
        </button>
      </div>

      <div className="products-table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>Nombre del Producto</th>
              <th>Código Actual</th>
              <th>Precio Venta</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-data">
                  {filter === 'sin-codigo'
                    ? 'Todos los productos tienen código ✅'
                    : 'No hay productos'}
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.id} className={!product.codigoBarras ? 'no-code' : ''}>
                  <td className="product-name">
                    <span>{product.nombre}</span>
                    {!product.codigoBarras && (
                      <span className="no-code-badge">Sin código</span>
                    )}
                  </td>
                  <td className="code-cell">
                    {editingId === product.id ? (
                      <input
                        type="text"
                        value={editingCode}
                        onChange={(e) => setEditingCode(e.target.value)}
                        className="code-input barcode-input scanner-active"
                        placeholder="Escanea o ingresa código..."
                        autoFocus
                      />
                    ) : (
                      <code className="code-display">
                        {product.codigoBarras || '-'}
                      </code>
                    )}
                  </td>
                  <td>Bs. {product.costoVenta?.toFixed(2) || '-'}</td>
                  <td>{product.cantidad || 0}</td>
                  <td className="actions-cell">
                    {editingId === product.id ? (
                      <div className="action-buttons">
                        <button
                          onClick={() => handleSaveCode(product.id)}
                          className="save-code-btn"
                        >
                          ✅ Guardar
                        </button>
                        <button
                          onClick={handleCancel}
                          className="cancel-code-btn"
                        >
                          ✕ Cancelar
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEdit(product)}
                        className="edit-code-btn"
                      >
                        ✏️ Editar
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="editor-stats">
        <div className="stat">
          <strong>{products.filter((p) => p.codigoBarras).length}</strong>
          <span>Productos con código</span>
        </div>
        <div className="stat warning">
          <strong>{productsWithoutCode.length}</strong>
          <span>Productos sin código</span>
        </div>
        <div className="stat">
          <strong>{products.length}</strong>
          <span>Total de productos</span>
        </div>
      </div>
    </div>
  );
};

export default InventoryBarcodeEditor;
