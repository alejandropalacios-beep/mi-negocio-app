// import necessary libraries and components
import React, { useEffect } from 'react';
import { db } from '../firebaseConfig'; // Assume db is your configured Firestore
import { onSnapshot, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const Comandas = ({ canchas, setCanchas, openOrders, setOpenOrders }) => {

    useEffect(() => {
        // Subscribe to changes in canchas collection
        const unsubscribeCanchas = onSnapshot(db.collection('canchas'), (snapshot) => {
            const newCanchas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCanchas(newCanchas);
        });

        // Subscribe to changes in comandas_abiertas collection
        const unsubscribeOpenOrders = onSnapshot(db.collection('comandas_abiertas'), (snapshot) => {
            const newOpenOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setOpenOrders(newOpenOrders);
        });

        // Cleanup on unmount
        return () => {
            unsubscribeCanchas();
            unsubscribeOpenOrders();
        };
    }, [setCanchas, setOpenOrders]);

    const handleUpdateOrder = async (orderId, updatedData) => {
        const orderRef = doc(db, 'comandas_abiertas', orderId);
        await updateDoc(orderRef, updatedData);
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
