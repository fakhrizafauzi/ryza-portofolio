import { db } from "../lib/firebase";
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp
} from "firebase/firestore";
import { type Experience } from "../types";

export const experienceService = {
    async createExperience(data: Omit<Experience, "id" | "createdAt" | "updatedAt">) {
        return addDoc(collection(db, "experiences"), {
            ...data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
    },

    async updateExperience(id: string, data: Partial<Experience>) {
        const docRef = doc(db, "experiences", id);
        return updateDoc(docRef, {
            ...data,
            updatedAt: serverTimestamp(),
        });
    },

    async deleteExperience(id: string) {
        const docRef = doc(db, "experiences", id);
        return deleteDoc(docRef);
    }
};
