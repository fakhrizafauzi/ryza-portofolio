import {
    doc,
    setDoc,
    getDoc,
    serverTimestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { type SiteSettings } from "@/types";

const COLLECTION_NAME = "settings";
const SETTINGS_DOC_ID = "global";

export const settingsService = {
    async getSettings(): Promise<SiteSettings | null> {
        const docRef = doc(db, COLLECTION_NAME, SETTINGS_DOC_ID);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
            return { id: snapshot.id, ...snapshot.data() } as SiteSettings;
        }
        return null;
    },

    async updateSettings(updates: Partial<SiteSettings>) {
        const docRef = doc(db, COLLECTION_NAME, SETTINGS_DOC_ID);
        return await setDoc(docRef, {
            ...updates,
            updatedAt: serverTimestamp(),
        }, { merge: true });
    }
};
