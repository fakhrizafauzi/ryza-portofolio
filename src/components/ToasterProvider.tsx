import { Toaster } from "sonner";

export function ToasterProvider() {
    return (
        <Toaster
            position="top-center"
            richColors
            closeButton
            theme="system"
            toastOptions={{
                style: {
                    borderRadius: "1.5rem",
                    padding: "1rem 1.5rem",
                },
            }}
        />
    );
}
