import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { type Project } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { FileUploader } from "./FileUploader";
import { FileText, X, Plus, Trash2, Users, Trophy, Layout, Milestone, Palette, Quote, ArrowUp, ArrowDown } from "lucide-react";

const projectSchema = z.object({
    title: z.string().min(2, "Title is required"),
    description: z.string().min(5, "Description is too short"),
    content: z.string().optional(),
    embedUrl: z.string().optional(),
    embedScript: z.string().optional(),
    role: z.string().optional(),
    category: z.string().optional(),
    portfolioImages: z.array(z.string()).min(1, "At least one image is required"),
    documents: z.array(z.object({ name: z.string(), url: z.string() })).default([]),
    tags: z.string().transform((val) => val.split(",").map(v => v.trim()).filter(Boolean)),
    github: z.string().optional(),
    link: z.string().optional(),
    order: z.coerce.number().default(0),
    isPublished: z.boolean().default(true),
    // Premium Sections
    stats: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
    challengeTitle: z.string().optional(),
    challengeContent: z.string().optional(),
    solutionTitle: z.string().optional(),
    solutionContent: z.string().optional(),
    teamMembers: z.array(z.object({ name: z.string(), role: z.string(), avatar: z.string().optional(), url: z.string().optional() })).optional(),
    milestones: z.array(z.object({ date: z.string(), label: z.string(), description: z.string().optional() })).optional(),
    designTokens: z.object({
        colors: z.array(z.object({ name: z.string(), hex: z.string() })).optional(),
        fonts: z.array(z.object({ name: z.string(), family: z.string() })).optional(),
    }).optional(),
    testimonials: z.array(z.object({ quote: z.string(), author: z.string(), role: z.string().optional(), avatar: z.string().optional() })).optional(),
    visibility: z.object({
        showStats: z.boolean().default(false),
        showChallengeSolution: z.boolean().default(false),
        showTeam: z.boolean().default(false),
        showMilestones: z.boolean().default(false),
        showDesignTokens: z.boolean().default(false),
        showTestimonials: z.boolean().default(false),
    }).optional(),
    status: z.enum(['Finished', 'In Development', 'Blueprint', 'Maintained', 'Archived']).default('Finished'),
    sectionOrder: z.array(z.string()).default(['stats', 'challenge_solution', 'embeds', 'content', 'milestones', 'design_tokens', 'gallery', 'testimonials', 'team']),
    customLabels: z.object({
        backText: z.string().optional(),
        roleLabel: z.string().optional(),
        techLabel: z.string().optional(),
        linksLabel: z.string().optional(),
        galleryTitle: z.string().optional(),
        gallerySubtitle: z.string().optional(),
        demoTitle: z.string().optional(),
        interactiveTitle: z.string().optional(),
        aboutTitle: z.string().optional(),
        dateLabel: z.string().optional(),
        resourcesTitle: z.string().optional(),
        githubButton: z.string().optional(),
        demoButton: z.string().optional(),
        nextProjectLabel: z.string().optional(),
    }).optional(),
});

interface ProjectFormProps {
    initialData?: Project;
    onSubmit: (data: any) => Promise<void>;
    onCancel: () => void;
}

export function ProjectForm({ initialData, onSubmit, onCancel }: ProjectFormProps) {
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, setValue, watch, control, formState: { errors } } = useForm({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            title: initialData?.title || "",
            description: initialData?.description || "",
            content: initialData?.content || "",
            embedUrl: initialData?.embedUrl || "",
            embedScript: initialData?.embedScript || "",
            role: initialData?.role || "",
            category: initialData?.category || "",
            portfolioImages: initialData?.portfolioImages || [],
            documents: initialData?.documents || [],
            tags: initialData?.tags?.join(", ") || "",
            github: initialData?.github || "",
            link: initialData?.link || "",
            order: initialData?.order || 0,
            isPublished: initialData?.isPublished ?? true,
            stats: initialData?.stats || [],
            challengeTitle: initialData?.challengeTitle || "The Challenge",
            challengeContent: initialData?.challengeContent || "",
            solutionTitle: initialData?.solutionTitle || "The Solution",
            solutionContent: initialData?.solutionContent || "",
            teamMembers: initialData?.teamMembers || [],
            milestones: initialData?.milestones || [],
            designTokens: {
                colors: initialData?.designTokens?.colors || [],
                fonts: initialData?.designTokens?.fonts || [],
            },
            testimonials: initialData?.testimonials || [],
            visibility: {
                showStats: initialData?.visibility?.showStats ?? false,
                showChallengeSolution: initialData?.visibility?.showChallengeSolution ?? false,
                showTeam: initialData?.visibility?.showTeam ?? false,
                showMilestones: initialData?.visibility?.showMilestones ?? false,
                showDesignTokens: initialData?.visibility?.showDesignTokens ?? false,
                showTestimonials: initialData?.visibility?.showTestimonials ?? false,
            },
            status: initialData?.status || "Finished",
            sectionOrder: initialData?.sectionOrder || ['stats', 'challenge_solution', 'embeds', 'content', 'milestones', 'design_tokens', 'gallery', 'testimonials', 'team'],
            customLabels: {
                backText: initialData?.customLabels?.backText || "Back to Portfolio",
                roleLabel: initialData?.customLabels?.roleLabel || "My Role",
                techLabel: initialData?.customLabels?.techLabel || "Tech Stack",
                linksLabel: initialData?.customLabels?.linksLabel || "Project Links",
                galleryTitle: initialData?.customLabels?.galleryTitle || "Project Gallery",
                gallerySubtitle: initialData?.customLabels?.gallerySubtitle || "Visualizing Innovation",
                demoTitle: initialData?.customLabels?.demoTitle || "Live Demo / Preview",
                interactiveTitle: initialData?.customLabels?.interactiveTitle || "Interactive Content",
                aboutTitle: initialData?.customLabels?.aboutTitle || "About Project",
                dateLabel: initialData?.customLabels?.dateLabel || "Date",
                resourcesTitle: initialData?.customLabels?.resourcesTitle || "Resources",
                githubButton: initialData?.customLabels?.githubButton || "GitHub",
                demoButton: initialData?.customLabels?.demoButton || "Live Demo",
                nextProjectLabel: initialData?.customLabels?.nextProjectLabel || "Next Project",
            },
        },
    });

    const { fields: statFields, append: appendStat, remove: removeStat } = useFieldArray({ control, name: "stats" });
    const { fields: teamFields, append: appendTeam, remove: removeTeam } = useFieldArray({ control, name: "teamMembers" });
    const { fields: milestoneFields, append: appendMilestone, remove: removeMilestone } = useFieldArray({ control, name: "milestones" });
    const { fields: colorFields, append: appendColor, remove: removeColor } = useFieldArray({ control, name: "designTokens.colors" });
    const { fields: fontFields, append: appendFont, remove: removeFont } = useFieldArray({ control, name: "designTokens.fonts" });
    const { fields: testimonialFields, append: appendTestimonial, remove: removeTestimonial } = useFieldArray({ control, name: "testimonials" });

    const portfolioImages = watch("portfolioImages");
    const documents = watch("documents") || [];

    const handleAddImage = (url: string) => {
        setValue("portfolioImages", [...portfolioImages, url]);
    };

    const handleRemoveImage = (index: number) => {
        setValue("portfolioImages", portfolioImages.filter((_, i) => i !== index));
    };

    const handleAddDocument = (url: string, name: string) => {
        setValue("documents", [...(documents || []), { name, url }]);
    };

    const handleRemoveDocument = (index: number) => {
        setValue("documents", (documents || []).filter((_: any, i: number) => i !== index));
    };

    const handleFormSubmit = async (data: any) => {
        setLoading(true);
        try {
            await onSubmit(data);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" {...register("title")} placeholder="My Awesome Project" />
                    {errors.title && <p className="text-xs text-destructive">{errors.title.message as string}</p>}
                </div>
                <div className="flex items-center gap-4 pt-8">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" {...register("isPublished")} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                        <span className="text-sm font-medium">Published</span>
                    </label>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Short Description</Label>
                <Textarea id="description" {...register("description")} placeholder="Describe what you built..." />
                {errors.description && <p className="text-xs text-destructive">{errors.description.message as string}</p>}
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input id="category" {...register("category")} placeholder="Web Application" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="status">Project Status</Label>
                    <select
                        id="status"
                        {...register("status")}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                        <option value="Blueprint">Blueprint (Planning)</option>
                        <option value="In Development">In Development</option>
                        <option value="Finished">Finished</option>
                        <option value="Maintained">Maintained</option>
                        <option value="Archived">Archived</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="role">Your Role (Global)</Label>
                    <Input id="role" {...register("role")} placeholder="Lead Developer" />
                </div>
            </div>

            <div className="space-y-4">
                <Label>Portfolio Images</Label>
                <div className="flex flex-wrap gap-4 mb-4">
                    {portfolioImages.map((img: string, i: number) => (
                        <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border group">
                            <img src={img} className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => handleRemoveImage(i)}
                                className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col gap-4">
                    <FileUploader
                        folder="projects/images"
                        onUploadSuccess={handleAddImage}
                        label="Upload Images"
                        accept="image/*"
                        multiple
                    />
                    <div className="flex gap-2">
                        <Input
                            placeholder="Or paste direct image URL here..."
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    const val = (e.target as HTMLInputElement).value;
                                    if (val) {
                                        handleAddImage(val);
                                        (e.target as HTMLInputElement).value = '';
                                    }
                                }
                            }}
                        />
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={(e) => {
                                const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                                if (input.value) {
                                    handleAddImage(input.value);
                                    input.value = '';
                                }
                            }}
                        >
                            Add URL
                        </Button>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <Label>Shared Documents (PDF, etc.)</Label>
                <div className="space-y-2">
                    {(documents || []).map((doc: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl border">
                            <div className="flex items-center gap-2 truncate">
                                <FileText className="w-4 h-4 text-primary" />
                                <span className="text-sm truncate">{doc.name}</span>
                            </div>
                            <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveDocument(i)}>
                                <X className="w-4 h-4 text-destructive" />
                            </Button>
                        </div>
                    ))}
                </div>
                <FileUploader
                    folder="projects/docs"
                    onUploadSuccess={handleAddDocument}
                    label="Upload Documents"
                    accept=".pdf,.doc,.docx,.txt"
                    multiple
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="tags">Tags (Comma separated)</Label>
                    <Input id="tags" {...register("tags")} placeholder="React, Firebase, TS" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="order">Display Order</Label>
                    <Input id="order" type="number" {...register("order")} />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="github">GitHub URL</Label>
                    <Input id="github" {...register("github")} placeholder="https://github.com/..." />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="link">Live Demo URL</Label>
                    <Input id="link" {...register("link")} placeholder="https://example.com" />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="embedUrl">Embed URL (YouTube, Figma, Loom)</Label>
                <Input id="embedUrl" {...register("embedUrl")} placeholder="https://www.youtube.com/embed/..." />
            </div>

            <div className="space-y-2">
                <Label htmlFor="embedScript">Custom Embed Script (HTML/JS)</Label>
                <Textarea
                    id="embedScript"
                    {...register("embedScript")}
                    placeholder="<iframe ...></iframe> or <script ...></script>"
                    className="font-mono text-xs"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="content">Case Study Content (Markdown/Long Text)</Label>
                <Textarea
                    id="content"
                    {...register("content")}
                    placeholder="Detailed explanation of the project..."
                    className="min-h-[200px]"
                />
            </div>

            {/* --- PREMIUM SECTIONS --- */}

            {/* Impact & Results */}
            <div className="border-t pt-6 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-primary" /> Impact & Results (Stats)
                        </h3>
                        <p className="text-xs text-muted-foreground">Add quantifiable achievements or key metrics.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Label htmlFor="showStats" className="text-xs">Show Section</Label>
                        <input type="checkbox" id="showStats" {...register("visibility.showStats")} className="w-4 h-4 rounded border-gray-300 text-primary" />
                    </div>
                </div>

                <div className="space-y-4">
                    {statFields.map((field, index) => (
                        <div key={field.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-secondary/20 rounded-xl relative group">
                            <button
                                type="button"
                                onClick={() => removeStat(index)}
                                className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-3 h-3" />
                            </button>
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Value (e.g. 50%, 10k+)</Label>
                                <Input {...register(`stats.${index}.value` as const)} placeholder="50%" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Label (e.g. Performance Boost)</Label>
                                <Input {...register(`stats.${index}.label` as const)} placeholder="Faster load time" />
                            </div>
                        </div>
                    ))}
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendStat({ value: "", label: "" })}
                        className="w-full border-dashed"
                    >
                        <Plus className="w-4 h-4 mr-2" /> Add Metric
                    </Button>
                </div>
            </div>

            {/* Execution & Process */}
            <div className="border-t pt-6 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <Milestone className="w-5 h-5 text-primary" /> Execution & Process
                        </h3>
                        <p className="text-xs text-muted-foreground">Problem/Solution and project milestones.</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2">
                            <Label htmlFor="showChallengeSolution" className="text-xs">Show Challenge/Solution</Label>
                            <input type="checkbox" id="showChallengeSolution" {...register("visibility.showChallengeSolution")} className="w-4 h-4 rounded border-gray-300 text-primary" />
                        </div>
                        <div className="flex items-center gap-2">
                            <Label htmlFor="showMilestones" className="text-xs">Show Milestones</Label>
                            <input type="checkbox" id="showMilestones" {...register("visibility.showMilestones")} className="w-4 h-4 rounded border-gray-300 text-primary" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4 p-4 border rounded-2xl bg-muted/30">
                        <div className="space-y-2">
                            <Label>Challenge Title</Label>
                            <Input {...register("challengeTitle")} />
                        </div>
                        <div className="space-y-2">
                            <Label>Challenge Content</Label>
                            <Textarea {...register("challengeContent")} placeholder="What problems did you face?" className="h-32" />
                        </div>
                    </div>
                    <div className="space-y-4 p-4 border rounded-2xl bg-muted/30">
                        <div className="space-y-2">
                            <Label>Solution Title</Label>
                            <Input {...register("solutionTitle")} />
                        </div>
                        <div className="space-y-2">
                            <Label>Solution Content</Label>
                            <Textarea {...register("solutionContent")} placeholder="How did you solve them?" className="h-32" />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <Label>Project Milestones</Label>
                    <div className="space-y-3">
                        {milestoneFields.map((field, index) => (
                            <div key={field.id} className="p-4 bg-secondary/10 rounded-xl border relative group space-y-3">
                                <button
                                    type="button"
                                    onClick={() => removeMilestone(index)}
                                    className="absolute top-2 right-2 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-1">
                                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Date (e.g. Jan 2024)</Label>
                                        <Input {...register(`milestones.${index}.date` as const)} />
                                    </div>
                                    <div className="md:col-span-2 space-y-1">
                                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Label (e.g. Prototype Ready)</Label>
                                        <Input {...register(`milestones.${index}.label` as const)} />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Description (Optional)</Label>
                                    <Input {...register(`milestones.${index}.description` as const)} />
                                </div>
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => appendMilestone({ date: "", label: "", description: "" })}
                            className="w-full border-dashed"
                        >
                            <Plus className="w-4 h-4 mr-2" /> Add Milestone
                        </Button>
                    </div>
                </div>
            </div>

            {/* Team & Social Proof */}
            <div className="border-t pt-6 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <Users className="w-5 h-5 text-primary" /> Team & Social Proof
                        </h3>
                        <p className="text-xs text-muted-foreground">Contributors and testimonials.</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2">
                            <Label htmlFor="showTeam" className="text-xs">Show Team</Label>
                            <input type="checkbox" id="showTeam" {...register("visibility.showTeam")} className="w-4 h-4 rounded border-gray-300 text-primary" />
                        </div>
                        <div className="flex items-center gap-2">
                            <Label htmlFor="showTestimonials" className="text-xs">Show Testimonials</Label>
                            <input type="checkbox" id="showTestimonials" {...register("visibility.showTestimonials")} className="w-4 h-4 rounded border-gray-300 text-primary" />
                        </div>
                    </div>
                </div>

                {/* Team Members */}
                <div className="space-y-4">
                    <Label>Team Members</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {teamFields.map((field, index) => (
                            <div key={field.id} className="p-4 bg-muted/30 rounded-2xl border space-y-3 relative group">
                                <button type="button" onClick={() => removeTeam(index)} className="absolute top-2 right-2 text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-secondary border flex items-center justify-center overflow-hidden shrink-0">
                                        {watch(`teamMembers.${index}.avatar`) ? (
                                            <img src={watch(`teamMembers.${index}.avatar`)} className="w-full h-full object-cover" />
                                        ) : (
                                            <Users className="w-6 h-6 text-muted-foreground/40" />
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <Input {...register(`teamMembers.${index}.name` as const)} placeholder="Name" className="h-8 text-sm" />
                                        <Input {...register(`teamMembers.${index}.role` as const)} placeholder="Role (e.g. Designer)" className="h-8 text-sm" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Avatar URL / Profile Link</Label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Input {...register(`teamMembers.${index}.avatar` as const)} placeholder="Avatar URL" className="h-7 text-xs" />
                                        <Input {...register(`teamMembers.${index}.url` as const)} placeholder="Profile URL" className="h-7 text-xs" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={() => appendTeam({ name: "", role: "", avatar: "", url: "" })} className="w-full border-dashed">
                        <Plus className="w-4 h-4 mr-2" /> Add Member
                    </Button>
                </div>

                {/* Testimonials */}
                <div className="space-y-4">
                    <Label>Testimonials / Client Quotes</Label>
                    <div className="space-y-4">
                        {testimonialFields.map((field, index) => (
                            <div key={field.id} className="p-6 bg-primary/5 rounded-[2rem] border relative group space-y-4">
                                <button type="button" onClick={() => removeTestimonial(index)} className="absolute top-4 right-4 text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                <div className="flex items-start gap-4">
                                    <Quote className="w-8 h-8 text-primary/20 shrink-0" />
                                    <Textarea {...register(`testimonials.${index}.quote` as const)} placeholder="What did they say?" className="bg-transparent border-dashed min-h-[100px]" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4 border-dashed">
                                    <div className="space-y-1">
                                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Author Name</Label>
                                        <Input {...register(`testimonials.${index}.author` as const)} className="h-8 text-sm" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Title / Company</Label>
                                        <Input {...register(`testimonials.${index}.role` as const)} className="h-8 text-sm" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Avatar URL</Label>
                                        <Input {...register(`testimonials.${index}.avatar` as const)} className="h-8 text-sm" />
                                    </div>
                                </div>
                            </div>
                        ))}
                        <Button type="button" variant="outline" size="sm" onClick={() => appendTestimonial({ quote: "", author: "", role: "", avatar: "" })} className="w-full border-dashed">
                            <Plus className="w-4 h-4 mr-2" /> Add Testimonial
                        </Button>
                    </div>
                </div>
            </div>

            {/* Design Tokens */}
            <div className="border-t pt-6 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <Palette className="w-5 h-5 text-primary" /> Design Tokens (UI Details)
                        </h3>
                        <p className="text-xs text-muted-foreground">Color palette and typography used.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Label htmlFor="showDesignTokens" className="text-xs">Show Section</Label>
                        <input type="checkbox" id="showDesignTokens" {...register("visibility.showDesignTokens")} className="w-4 h-4 rounded border-gray-300 text-primary" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Colors */}
                    <div className="space-y-4">
                        <Label>Color Palette</Label>
                        <div className="space-y-2">
                            {colorFields.map((field, index) => (
                                <div key={field.id} className="flex items-center gap-2 bg-muted/30 p-2 rounded-lg relative group">
                                    <input type="color" {...register(`designTokens.colors.${index}.hex` as const)} className="w-8 h-8 rounded border-none bg-transparent cursor-pointer" />
                                    <Input {...register(`designTokens.colors.${index}.name` as const)} placeholder="Primary" className="h-8 text-xs flex-1" />
                                    <Input {...register(`designTokens.colors.${index}.hex` as const)} placeholder="#000000" className="h-8 text-xs w-24 font-mono uppercase" />
                                    <button type="button" onClick={() => removeColor(index)} className="p-1 text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                            <Button type="button" variant="ghost" size="sm" onClick={() => appendColor({ name: "", hex: "#000000" })} className="w-full text-[10px] h-7 border border-dashed rounded-lg">
                                <Plus className="w-3 h-3 mr-1" /> Add Color
                            </Button>
                        </div>
                    </div>

                    {/* Fonts */}
                    <div className="space-y-4">
                        <Label>Typography</Label>
                        <div className="space-y-2">
                            {fontFields.map((field, index) => (
                                <div key={field.id} className="flex items-center gap-2 bg-muted/30 p-2 rounded-lg relative group">
                                    <div className="flex-1 grid grid-cols-2 gap-2">
                                        <Input {...register(`designTokens.fonts.${index}.name` as const)} placeholder="Heading" className="h-8 text-xs font-semibold" />
                                        <Input {...register(`designTokens.fonts.${index}.family` as const)} placeholder="Inter, sans-serif" className="h-8 text-xs" />
                                    </div>
                                    <button type="button" onClick={() => removeFont(index)} className="p-1 text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                            <Button type="button" variant="ghost" size="sm" onClick={() => appendFont({ name: "", family: "" })} className="w-full text-[10px] h-7 border border-dashed rounded-lg">
                                <Plus className="w-3 h-3 mr-1" /> Add Font
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Labels (Original) */}
            <div className="border-t pt-6 space-y-4">
                <h3 className="text-lg font-bold">Custom Interface Labels</h3>
                <p className="text-xs text-muted-foreground">Override the default UI text for this project.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="backText">Back Button Text</Label>
                        <Input id="backText" {...register("customLabels.backText")} />
                    </div>
                    {/* ... (rest of labels) ... */}
                    <div className="space-y-2">
                        <Label htmlFor="roleLabel">Role Label</Label>
                        <Input id="roleLabel" {...register("customLabels.roleLabel")} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="techLabel">Tech Stack Label</Label>
                        <Input id="techLabel" {...register("customLabels.techLabel")} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="linksLabel">Project Links Label</Label>
                        <Input id="linksLabel" {...register("customLabels.linksLabel")} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="galleryTitle">Gallery Title</Label>
                        <Input id="galleryTitle" {...register("customLabels.galleryTitle")} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="gallerySubtitle">Gallery Subtitle</Label>
                        <Input id="gallerySubtitle" {...register("customLabels.gallerySubtitle")} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="demoTitle">Demo Section Title</Label>
                        <Input id="demoTitle" {...register("customLabels.demoTitle")} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="interactiveTitle">Interactive Section Title</Label>
                        <Input id="interactiveTitle" {...register("customLabels.interactiveTitle")} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="aboutTitle">Sidebar "About" Title</Label>
                        <Input id="aboutTitle" {...register("customLabels.aboutTitle")} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="dateLabel">Sidebar "Date" Label</Label>
                        <Input id="dateLabel" {...register("customLabels.dateLabel")} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="resourcesTitle">Sidebar "Resources" Title</Label>
                        <Input id="resourcesTitle" {...register("customLabels.resourcesTitle")} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="githubButton">GitHub Button Text</Label>
                        <Input id="githubButton" {...register("customLabels.githubButton")} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="demoButton">Demo Button Text</Label>
                        <Input id="demoButton" {...register("customLabels.demoButton")} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="nextProjectLabel">Footer "Next Project" Label</Label>
                        <Input id="nextProjectLabel" {...register("customLabels.nextProjectLabel")} />
                    </div>
                </div>
            </div>

            {/* --- Layout Reordering --- */}
            <div className="border-t pt-6 space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2 text-primary">
                    <Layout className="w-5 h-5" /> Flexible Content Layout
                </h3>
                <p className="text-xs text-muted-foreground">Drag and drop? No, even simpler. Use the arrows to arrange the main content blocks.</p>

                <div className="space-y-2 max-w-md">
                    {(watch("sectionOrder") || []).map((sectionId: string, index: number) => {
                        const sectionLabels: Record<string, string> = {
                            stats: "Impact & Results (Stats)",
                            challenge_solution: "Execution & Process (Challenge/Solution)",
                            embeds: "Live Preview / Embeds",
                            content: "Case Study Text (Markdown)",
                            milestones: "Project Milestones (Timeline)",
                            design_tokens: "Design DNA (Tokens)",
                            gallery: "Project Gallery",
                            testimonials: "Social Proof (Testimonials)",
                            team: "Collaborative Force (Team)"
                        };

                        const moveSection = (dir: 'up' | 'down') => {
                            const currentOrder = [...(watch("sectionOrder") || [])];
                            const newIndex = dir === 'up' ? index - 1 : index + 1;
                            if (newIndex < 0 || newIndex >= currentOrder.length) return;

                            const temp = currentOrder[index];
                            currentOrder[index] = currentOrder[newIndex];
                            currentOrder[newIndex] = temp;
                            setValue("sectionOrder", currentOrder);
                        };

                        return (
                            <div key={sectionId} className="flex items-center justify-between p-3 bg-secondary/30 border rounded-xl group transition-all hover:border-primary/50">
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-black text-muted-foreground/50 w-4">{index + 1}</span>
                                    <span className="text-sm font-semibold">{sectionLabels[sectionId] || sectionId}</span>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        disabled={index === 0}
                                        onClick={() => moveSection('up')}
                                    >
                                        <ArrowUp className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        disabled={index === (watch("sectionOrder") || []).length - 1}
                                        onClick={() => moveSection('down')}
                                    >
                                        <ArrowDown className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <p className="text-[10px] text-muted-foreground italic mt-2">Note: Sections will only appear if they have data and are toggled "Show" above.</p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
                    Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : initialData ? "Update Project" : "Create Project"}
                </Button>
            </div>
        </form>
    );
}
