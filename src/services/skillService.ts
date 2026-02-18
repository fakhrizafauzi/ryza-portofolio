import { db } from "../lib/firebase";
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp
} from "firebase/firestore";
import { type Skill } from "../types";

export const skillService = {
    async createSkill(data: Omit<Skill, "id" | "createdAt" | "updatedAt">) {
        return addDoc(collection(db, "skills"), {
            ...data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
    },

    async updateSkill(id: string, data: Partial<Skill>) {
        const docRef = doc(db, "skills", id);
        return updateDoc(docRef, {
            ...data,
            updatedAt: serverTimestamp(),
        });
    },

    async deleteSkill(id: string) {
        const docRef = doc(db, "skills", id);
        return deleteDoc(docRef);
    }
};
