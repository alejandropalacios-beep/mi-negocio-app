import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig'; // Adjust the path as necessary
import { collection, addDoc, onSnapshot } from 'firebase/firestore';

const Comandas = () => {
  const [canchas, setCanchas] = useState([]);
  const [openOrders, setOpenOrders] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  
  useEffect(() => {
    const unsubscribeCanchas = onSnapshot(collection(db, 'canchas'), (snapshot) => {
      const canchasData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCanchas(canchasData);
    });

    const unsubscribeOrders = onSnapshot(collection(db, 'openOrders'), (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOpenOrders(ordersData);
    });

    return () => {
      unsubscribeCanchas();
      unsubscribeOrders();
    };
  }, []);

  const addProduct = (product) => {
    setSelectedProducts((prev) => [...prev, product]);
  };

  const processPayment = async () => {
    if (!selectedClient || selectedProducts.length === 0) return;

    const newOrder = {
      client: selectedClient,
      products: selectedProducts,
      date: new Date().toISOString(),
    };

    try {
      await addDoc(collection(db, 'openOrders'), newOrder);
      resetOrder();
    } catch (error) {
      console.error("Error processing payment: ", error);
    }
  };

  const resetOrder = () => {
    setSelectedClient('');
    setSelectedProducts([]);
  };

  return (
    <div>
      <h1>Comandas</h1>
      <select onChange={(e) => setSelectedClient(e.target.value)} value={selectedClient}>
        <option value="">Select Client</option>
        {/* Add options dynamically based on your client data */}
      </select>
      <div>
        <h2>Products</h2>
        {canchas.map(product => (
          <div key={product.id}>
            <span>{product.name}</span>
            <button onClick={() => addProduct(product)}>Add</button>
          </div>
        ))}
      </div>
      <div>
        <h2>Selected Products</h2>
        {selectedProducts.map((product, index) => (
          <div key={index}>{product.name}</div>
        ))}
      </div>
      <button onClick={processPayment}>Process Payment</button>
    </div>
  );
};

export default Comandas;
