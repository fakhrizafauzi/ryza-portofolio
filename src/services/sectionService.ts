import { db } from "../lib/firebase";
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp,
    getDocs,
    query,
    orderBy
} from "firebase/firestore";
import { type PageSection } from "../types";

export const sectionService = {
    async getAllSections(): Promise<PageSection[]> {
        const q = query(collection(db, "sections"), orderBy("order", "asc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PageSection));
    },

    async createSection(data: Omit<PageSection, "id" | "createdAt" | "updatedAt">) {
        return addDoc(collection(db, "sections"), {
            ...data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
    },

    async updateSection(id: string, data: Partial<PageSection>) {
        const docRef = doc(db, "sections", id);
        return updateDoc(docRef, {
            ...data,
            updatedAt: serverTimestamp(),
        });
    },

    async deleteSection(id: string) {
        const docRef = doc(db, "sections", id);
        return deleteDoc(docRef);
    },

    async reorderSections(sections: { id: string, order: number }[]) {
        const promises = sections.map(s =>
            updateDoc(doc(db, "sections", s.id), { order: s.order, updatedAt: serverTimestamp() })
        );
        return Promise.all(promises);
    }
};
