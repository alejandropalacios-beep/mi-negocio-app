import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, deleteDoc, updateDoc } from 'firebase/firestore';

const Comandas = () => {
  const [canchas, setCanchas] = useState([]);
  const [openOrders, setOpenOrders] = useState([]);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const canchasCollection = collection(db, 'canchas');
    const openOrdersCollection = collection(db, 'openOrders');
    const clientsCollection = collection(db, 'clients');
    const productsCollection = collection(db, 'products');
    const paymentsCollection = collection(db, 'payments');

    const unsubscribeCanchas = onSnapshot(canchasCollection, (snapshot) => {
      setCanchas(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))); 
    });

    const unsubscribeOpenOrders = onSnapshot(openOrdersCollection, (snapshot) => {
      setOpenOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))); 
    });

    const unsubscribeClients = onSnapshot(clientsCollection, (snapshot) => {
      setClients(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))); 
    });

    const unsubscribeProducts = onSnapshot(productsCollection, (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))); 
    });

    const unsubscribePayments = onSnapshot(paymentsCollection, (snapshot) => {
      setPayments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))); 
    });

    // Clean up subscription on unmount.
    return () => {
      unsubscribeCanchas();
      unsubscribeOpenOrders();
      unsubscribeClients();
      unsubscribeProducts();
      unsubscribePayments();
    };
  }, []);

  const handleAddProduct = async (newProduct) => {
    await addDoc(collection(db, 'products'), newProduct);
  };

  const handleUpdateProduct = async (id, updatedData) => {
    const productRef = doc(db, 'products', id);
    await updateDoc(productRef, updatedData);
  };

  const handleDeleteProduct = async (id) => {
    await deleteDoc(doc(db, 'products', id));
  };

  return (
    <div>
      <h1>Comandas</h1>
      {/* UI for canchas, openOrders, clients, products, payments goes here */}
    </div>
  );
};

export default Comandas;