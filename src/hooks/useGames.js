import { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../firebase';

const GAMES_COL = 'games';

export function useGames() {
  const [games, setGames]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  // ── Realtime listener ─────────────────────────────
  useEffect(() => {
    const q = query(collection(db, GAMES_COL), orderBy('createdAt', 'desc'));

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setGames(list);
        setLoading(false);
      },
      (err) => {
        console.error('Firestore error:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsub(); // cleanup on unmount
  }, []);

  // ── Add ───────────────────────────────────────────
  const addGame = async (data) => {
    await addDoc(collection(db, GAMES_COL), {
      ...data,
      createdAt: serverTimestamp(),
    });
  };

  // ── Update ────────────────────────────────────────
  const updateGame = async (id, data) => {
    await updateDoc(doc(db, GAMES_COL, id), data);
  };

  // ── Remove ────────────────────────────────────────
  const removeGame = async (id) => {
    await deleteDoc(doc(db, GAMES_COL, id));
  };

  return { games, loading, error, addGame, updateGame, removeGame };
}
