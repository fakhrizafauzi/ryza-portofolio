import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { type Skill } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { FileUploader } from "./FileUploader";

const skillSchema = z.object({
    title: z.string().min(1, "Title is required"),
    category: z.string().min(1, "Category is required"),
    description: z.string().optional(),
    icon: z.string().optional(),
    order: z.coerce.number().default(0),
    isPublished: z.boolean().default(true),
});

interface SkillFormProps {
    initialData?: Skill;
    onSubmit: (data: any) => Promise<void>;
    onCancel: () => void;
}

export function SkillForm({ initialData, onSubmit, onCancel }: SkillFormProps) {
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        resolver: zodResolver(skillSchema),
        defaultValues: {
            title: initialData?.title || "",
            category: initialData?.category || "Frontend",
            description: initialData?.description || "",
            icon: initialData?.icon || "",
            order: initialData?.order || 0,
            isPublished: initialData?.isPublished ?? true,
        },
    });

    const icon = watch("icon");

    const handleFormSubmit = async (data: any) => {
        setLoading(true);
        try {
            await onSubmit(data);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 py-4">
            <div className="space-y-2">
                <Label htmlFor="title">Skill Name</Label>
                <Input id="title" {...register("title")} placeholder="e.g. React" />
                {errors.title && <p className="text-xs text-destructive">{errors.title.message as string}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" {...register("category")} placeholder="e.g. Frontend, Language, Backend" />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input id="description" {...register("description")} placeholder="Short description..." />
            </div>

            <div className="space-y-4">
                <Label>Skill Icon (URL or Upload)</Label>
                <div className="flex items-center gap-4">
                    <Input id="icon" {...register("icon")} placeholder="Icon URL" />
                    {icon && (
                        <div className="w-10 h-10 rounded-lg border bg-muted flex items-center justify-center overflow-hidden">
                            <img src={icon} className="w-full h-full object-contain" />
                        </div>
                    )}
                </div>
                <FileUploader
                    folder="skills/icons"
                    onUploadSuccess={(url) => setValue("icon", url)}
                    label="Upload Icon"
                    accept="image/*"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="order">Display Order</Label>
                <Input id="order" type="number" {...register("order")} />
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
                    Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : initialData ? "Update Skill" : "Create Skill"}
                </Button>
            </div>
        </form>
    );
}
