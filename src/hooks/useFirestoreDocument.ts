import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function useFirestoreDocument<T>(collectionName: string, docId: string) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        setLoading(true);
        const docRef = doc(db, collectionName, docId);

        const unsubscribe = onSnapshot(
            docRef,
            (snapshot) => {
                if (snapshot.exists()) {
                    setData({ id: snapshot.id, ...snapshot.data() } as T);
                } else {
                    setData(null);
                }
                setLoading(false);
            },
            (err) => {
                console.error(`Error fetching document ${collectionName}/${docId}:`, err);
                setError(err as Error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [collectionName, docId]);

    return { data, loading, error };
}
