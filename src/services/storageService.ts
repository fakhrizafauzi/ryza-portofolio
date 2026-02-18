import { storage } from "../lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const storageService = {
    async uploadFile(file: File, path: string): Promise<string> {
        const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        return getDownloadURL(snapshot.ref);
    }
};
