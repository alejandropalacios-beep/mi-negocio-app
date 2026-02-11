// import necessary libraries and components
import React, { useEffect } from 'react';
import { db } from '../firebase'; // Assume db is your configured Firestore
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

    const handleDeleteOrder = async (orderId) => {
        const orderRef = doc(db, 'comandas_abiertas', orderId);
        await deleteDoc(orderRef);
    };

    return (
        <div>
            {/* Your component's original render logic goes here */}
            <h1>Comandas</h1>
            {/* Render canchas and open orders, along with handlers for updates and deletes */}
        </div>
    );
};

export default Comandas;
