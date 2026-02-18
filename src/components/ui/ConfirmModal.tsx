import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Info } from "lucide-react";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "primary";
    isLoading?: boolean;
}

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "primary",
    isLoading = false,
}: ConfirmModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px] rounded-[2rem] p-8 gap-6 border-none shadow-2xl">
                <DialogHeader className="gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${variant === 'danger' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'
                        }`}>
                        {variant === 'danger' ? <AlertTriangle className="w-6 h-6" /> : <Info className="w-6 h-6" />}
                    </div>
                    <DialogTitle className="text-2xl font-bold tracking-tight">{title}</DialogTitle>
                    <DialogDescription className="text-base text-muted-foreground leading-relaxed">
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-start gap-3 pt-4">
                    <Button
                        type="button"
                        variant={variant === 'danger' ? 'destructive' : 'default'}
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="rounded-full px-8 h-12 font-bold transition-all hover:scale-[1.02]"
                    >
                        {isLoading ? "Processing..." : confirmText}
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onClose}
                        disabled={isLoading}
                        className="rounded-full px-8 h-12 font-bold"
                    >
                        {cancelText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
