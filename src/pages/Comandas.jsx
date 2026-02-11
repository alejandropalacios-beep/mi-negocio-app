import React, { useEffect, useState } from 'react';

const Comandas = () => {
    const [comandas, setComandas] = useState([]);

    useEffect(() => {
        const fetchComandas = async () => {
            try {
                const response = await fetch('/api/comandas');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setComandas(data);
            } catch (error) {
                console.error('Error fetching comandas:', error);
            }
        };
        fetchComandas();
    }, []);

    return (
        <div>
            <h1>Comandas</h1>
            <ul>
                {comandas.map(comanda => (
                    <li key={comanda.id}>{comanda.nombre}</li>
                ))}
            </ul>
        </div>
    );
};

export default Comandas;