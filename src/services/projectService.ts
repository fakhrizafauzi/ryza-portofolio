import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { type Project } from "@/types";

const COLLECTION_NAME = "projects";

export const projectService = {
    async createProject(project: Omit<Project, "id" | "createdAt" | "updatedAt">) {
        const colRef = collection(db, COLLECTION_NAME);
        return await addDoc(colRef, {
            ...project,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
    },

    async updateProject(id: string, updates: Partial<Project>) {
        const docRef = doc(db, COLLECTION_NAME, id);
        return await updateDoc(docRef, {
            ...updates,
            updatedAt: serverTimestamp(),
        });
    },

    async deleteProject(id: string) {
        const docRef = doc(db, COLLECTION_NAME, id);
        return await deleteDoc(docRef);
    }
};
