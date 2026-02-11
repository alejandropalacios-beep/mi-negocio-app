import React, { useState, useEffect } from 'react';

function App() {
    // Initialize state from localStorage
    const [comandas, setComandas] = useState(() => JSON.parse(localStorage.getItem('comandas')) || []);
    const [openOrders, setOpenOrders] = useState(() => JSON.parse(localStorage.getItem('openOrders')) || []);
    const [canchasAccesorios, setCanchasAccesorios] = useState(() => JSON.parse(localStorage.getItem('canchasAccesorios')) || []);
    const [openVentasAccesorios, setOpenVentasAccesorios] = useState(() => JSON.parse(localStorage.getItem('openVentasAccesorios')) || []);

    // Effect to save comandas to localStorage
    useEffect(() => {
        localStorage.setItem('comandas', JSON.stringify(comandas));
    }, [comandas]);

    // Effect to save openOrders to localStorage
    useEffect(() => {
        localStorage.setItem('openOrders', JSON.stringify(openOrders));
    }, [openOrders]);

    // Effect to save canchasAccesorios to localStorage
    useEffect(() => {
        localStorage.setItem('canchasAccesorios', JSON.stringify(canchasAccesorios));
    }, [canchasAccesorios]);

    // Effect to save openVentasAccesorios to localStorage
    useEffect(() => {
        localStorage.setItem('openVentasAccesorios', JSON.stringify(openVentasAccesorios));
    }, [openVentasAccesorios]);

    return (
        <div>
            <h1>Mi Negocio App</h1>
            {/* Your existing app components go here */}
        </div>
    );
}

export default App;