// Custom hook for USB barcode reader
import { useEffect, useState } from 'react';

const useUSBBarcodeReader = (onScan) => {
    const [barcode, setBarcode] = useState('');

    useEffect(() => {
        const handleBarcode = (event) => {
            setBarcode(event.key);
            if (onScan) onScan(event.key);
        };

        window.addEventListener('keypress', handleBarcode);

        return () => {
            window.removeEventListener('keypress', handleBarcode);
        };
    }, [onScan]);

    return barcode;
};

export default useUSBBarcodeReader;