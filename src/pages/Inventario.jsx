// src/pages/Inventario.jsx

import React from 'react';

function Inventario() {
  return (
    <div>
      <h1>Página de Inventario</h1>
      <p>Aquí se gestionan todos los productos y el stock del restaurante.</p>
    </div>
  );
}

export default Inventario; // <-- This is the key line

// En tu componente de Inventario
import InventoryBarcodeEditor from '../components/InventoryBarcodeEditor';

export default function Inventario() {
  return (
    <div>
      {/* Tu código existente */}
      
      {/* Agregar el editor de códigos */}
      <InventoryBarcodeEditor />
    </div>
  );
}
