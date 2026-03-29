import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Transforms a Google Drive share link into a direct view or image source link.
 */
export function transformGoogleDriveUrl(url: string, mode: 'image' | 'view' = 'view'): string {
    if (!url || !url.includes('drive.google.com')) return url;

    // Extract file ID
    const match = url.match(/\/d\/([^/?]+)/) || url.match(/id=([^&]+)/);
    const fileId = match?.[1];

    if (!fileId) return url;

    if (mode === 'image') {
        return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }

    return `https://drive.google.com/file/d/${fileId}/view`;
}
