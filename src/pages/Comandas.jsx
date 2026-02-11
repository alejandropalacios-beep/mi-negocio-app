import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { deleteDoc, updateDoc, onSnapshot } from 'firebase/firestore';

const Comandas = () => {
    const [canchas, setCanchas] = useState([]);
    const [comandasAbiertas, setComandasAbiertas] = useState([]);

    useEffect(() => {
        const unsubscribeCanchas = onSnapshot(collection(db, 'canchas'), (snapshot) => {
            setCanchas(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        const unsubscribeComandas = onSnapshot(collection(db, 'comandas_abiertas'), (snapshot) => {
            setComandasAbiertas(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => {
            unsubscribeCanchas();
            unsubscribeComandas();
        };
    }, []);

    const deleteComanda = async (id) => {
        await deleteDoc(doc(db, 'comandas_abiertas', id));
    };

    const updateComanda = async (id, data) => {
        await updateDoc(doc(db, 'comandas_abiertas', id), data);
    };

    return (
        <div>
            <h1>Canchas</h1>
            {canchas.map(cancha => ( <div key={cancha.id}>{cancha.name}</div> ))}
            <h1>Comandas Abiertas</h1>
            {comandasAbiertas.map(comanda => ( 
                <div key={comanda.id}>
                    {comanda.detail}
                    <button onClick={() => deleteComanda(comanda.id)}>Delete</button>
                </div> 
            ))}
        </div>
    );
};

export default Comandas;