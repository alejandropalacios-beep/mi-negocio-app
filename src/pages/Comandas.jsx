import useUSBBarcodeReader from 'src/hooks/useUSBBarcodeReader.js';

// Additional state for barcode reading
const [lastScannedCode, setLastScannedCode] = useState(null);
const [pendingScannedProduct, setPendingScannedProduct] = useState(null);

const handleBarcodeScan = (codigoBarras) => {
    if (!selectedComanda || isModalOpen) return; // Ignore scans when no comanda is selected or other modals are open
    const foundProduct = products.find(product => product.codigoBarras === codigoBarras);
    if (foundProduct) {
        setPendingScannedProduct(foundProduct);
        // Open confirmation modal with product details
        openConfirmationModal(foundProduct);
    } else {
        alert('Producto no registrado');
        openProductSelectionModal(); // Open the ProductSelectionModal
    }
};

const onConfirmProductSelection = () => {
    handleSelectProduct(pendingScannedProduct, 1);
    closeModal(); // Close modal after confirming selection
};

// Existing functionality remains unchanged