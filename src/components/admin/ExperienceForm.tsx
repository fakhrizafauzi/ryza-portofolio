import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { type Experience } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const experienceSchema = z.object({
    company: z.string().min(1, "Company is required"),
    position: z.string().min(1, "Position is required"),
    duration: z.string().min(1, "Duration is required"),
    location: z.string().optional(),
    description: z.string().min(5, "Description is too short"),
    order: z.coerce.number().default(0),
    isPublished: z.boolean().default(true),
});

interface ExperienceFormProps {
    initialData?: Experience;
    onSubmit: (data: any) => Promise<void>;
    onCancel: () => void;
}

export function ExperienceForm({ initialData, onSubmit, onCancel }: ExperienceFormProps) {
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(experienceSchema),
        defaultValues: {
            company: initialData?.company || "",
            position: initialData?.position || "",
            duration: initialData?.duration || "",
            location: initialData?.location || "",
            description: initialData?.description || "",
            order: initialData?.order || 0,
            isPublished: initialData?.isPublished ?? true,
        },
    });

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
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" {...register("company")} placeholder="e.g. Tech Corp" />
                    {errors.company && <p className="text-xs text-destructive">{errors.company.message as string}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input id="position" {...register("position")} placeholder="e.g. Web Developer" />
                    {errors.position && <p className="text-xs text-destructive">{errors.position.message as string}</p>}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input id="duration" {...register("duration")} placeholder="e.g. 2022 - Present" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" {...register("location")} placeholder="e.g. New York, Remote" />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" {...register("description")} placeholder="Key responsibilities and achievements..." />
                {errors.description && <p className="text-xs text-destructive">{errors.description.message as string}</p>}
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
                    {loading ? "Saving..." : initialData ? "Update Experience" : "Create Experience"}
                </Button>
            </div>
        </form>
    );
}
