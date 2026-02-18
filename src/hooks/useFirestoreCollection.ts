import { useState, useEffect } from 'react';
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    QueryConstraint
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function useFirestoreCollection<T>(
    collectionName: string,
    constraints: QueryConstraint[] = []
) {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        setLoading(true);
        const colRef = collection(db, collectionName);
        const q = query(colRef, ...constraints, orderBy('order', 'asc'));

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const results: T[] = [];
                snapshot.forEach((doc) => {
                    results.push({ id: doc.id, ...doc.data() } as T);
                });
                setData(results);
                setLoading(false);
            },
            (err) => {
                console.error(`Error fetching ${collectionName}:`, err);
                setError(err as Error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [collectionName, JSON.stringify(constraints)]); // Stringify constraints to avoid re-run on every render if passed as literal array

    return { data, loading, error };
}
