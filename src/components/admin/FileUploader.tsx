import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { storageService } from "@/services/storageService";
import { Upload, Loader2, Link as LinkIcon } from "lucide-react";

interface FileUploaderProps {
    onUploadSuccess: (url: string, name: string) => void;
    folder: string;
    accept?: string;
    label?: string;
    multiple?: boolean;
    showUrlInput?: boolean;
}

export function FileUploader({ onUploadSuccess, folder, accept, label, multiple, showUrlInput = true }: FileUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [urlInput, setUrlInput] = useState("");
    const [nameInput, setNameInput] = useState("");
    const [mode, setMode] = useState<'upload' | 'url'>('upload');

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        setError(null);

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const url = await storageService.uploadFile(file, folder);
                onUploadSuccess(url, file.name);
            }
        } catch (err) {
            setError("Upload failed. Check your connection and try again.");
            console.error(err);
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    };

    const handleUrlSubmit = () => {
        if (!urlInput.trim()) return;
        const name = nameInput.trim() || urlInput.split('/').pop() || 'Link';
        onUploadSuccess(urlInput.trim(), name);
        setUrlInput("");
        setNameInput("");
    };

    return (
        <div className="space-y-3 p-4 border-2 border-dashed rounded-2xl bg-muted/30">
            {showUrlInput && (
                <div className="flex gap-1 bg-muted/50 rounded-lg p-0.5">
                    <button
                        type="button"
                        onClick={() => setMode('upload')}
                        className={`flex-1 text-xs font-semibold py-1.5 rounded-md transition-all ${mode === 'upload' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        <Upload className="w-3 h-3 inline mr-1" />Upload
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('url')}
                        className={`flex-1 text-xs font-semibold py-1.5 rounded-md transition-all ${mode === 'url' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        <LinkIcon className="w-3 h-3 inline mr-1" />URL
                    </button>
                </div>
            )}

            {mode === 'upload' ? (
                <div className="flex flex-col items-center justify-center gap-2">
                    <Upload className="w-8 h-8 text-muted-foreground" />
                    <div className="text-center">
                        <p className="text-sm font-semibold">{label || "Click to upload files"}</p>
                        <p className="text-xs text-muted-foreground">Images, PDFs, or documents</p>
                    </div>
                    <Input
                        type="file"
                        className="hidden"
                        id={`file-upload-${folder}`}
                        onChange={handleFileChange}
                        accept={accept}
                        multiple={multiple}
                        disabled={uploading}
                    />
                    <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        disabled={uploading}
                    >
                        <Label htmlFor={`file-upload-${folder}`}>
                            {uploading ? (
                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...</>
                            ) : (
                                "Select Files"
                            )}
                        </Label>
                    </Button>
                </div>
            ) : (
                <div className="space-y-2">
                    <div className="flex flex-col gap-2">
                        <Input
                            placeholder="Display name (optional)"
                            value={nameInput}
                            onChange={(e) => setNameInput(e.target.value)}
                        />
                        <div className="flex gap-2">
                            <Input
                                placeholder="https://example.com/file.pdf"
                                value={urlInput}
                                onChange={(e) => setUrlInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleUrlSubmit())}
                                className="flex-1"
                            />
                            <Button type="button" size="sm" onClick={handleUrlSubmit} disabled={!urlInput.trim()}>
                                Add
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            {error && <p className="text-xs text-destructive text-center">{error}</p>}
        </div>
    );
}
