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
import {
    FileText, X, Plus, Trash2, Users, Trophy, Layout, Palette, Quote, Calendar, Image as ImageIcon, Pencil,
    Cpu, Settings, CheckCircle2, List, Sparkles, HelpCircle,
    ArrowLeftRight, Code2,
    GripVertical, TrendingUp, Layers, GitMerge, Lightbulb,
    UserSearch, Network, Gauge, Terminal
} from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from '@/components/admin/SortableItem';

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
    processSteps: z.array(z.object({ title: z.string(), description: z.string().optional(), icon: z.string().optional() })).optional(),
    techStack: z.array(z.object({ name: z.string(), icon: z.string().optional(), level: z.string().optional() })).optional(),
    features: z.array(z.object({ title: z.string(), description: z.string().optional() })).optional(),
    userPersonas: z.array(z.object({ name: z.string(), role: z.string(), bio: z.string(), goals: z.string().optional(), pains: z.string().optional(), avatar: z.string().optional() })).optional(),
    comparison: z.array(z.object({ before: z.string(), after: z.string(), caption: z.string().optional() })).optional(),
    roadmap: z.array(z.object({ title: z.string(), date: z.string(), status: z.enum(['Planned', 'In Progress', 'Completed']), description: z.string().optional() })).optional(),
    reflections: z.array(z.object({ title: z.string(), content: z.string(), icon: z.string().optional() })).optional(),
    technicalDeepDive: z.array(z.object({ title: z.string(), description: z.string(), code: z.string().optional(), language: z.string().optional() })).optional(),
    architecture: z.array(z.object({ title: z.string(), description: z.string(), image: z.string().optional() })).optional(),
    perfSeo: z.object({ performance: z.number(), accessibility: z.number(), bestPractices: z.number(), seo: z.number() }).optional(),
    faq: z.array(z.object({ question: z.string(), answer: z.string() })).optional(),
    designDecisions: z.array(z.object({ title: z.string(), choice: z.string(), rationale: z.string() })).optional(),
    successMetrics: z.array(z.object({ label: z.string(), value: z.string(), trend: z.enum(['up', 'down', 'neutral']), goal: z.string().optional() })).optional(),
    visibility: z.object({
        showStats: z.boolean().default(false),
        showChallengeSolution: z.boolean().default(false),
        showTeam: z.boolean().default(false),
        showMilestones: z.boolean().default(false),
        showDesignTokens: z.boolean().default(false),
        showTestimonials: z.boolean().default(false),
        showProcess: z.boolean().default(false),
        showTech: z.boolean().default(false),
        showFeatures: z.boolean().default(false),
        showUserPersonas: z.boolean().default(false),
        showComparison: z.boolean().default(false),
        showRoadmap: z.boolean().default(false),
        showReflections: z.boolean().default(false),
        showTechnicalDeepDive: z.boolean().default(false),
        showArchitecture: z.boolean().default(false),
        showPerfSeo: z.boolean().default(false),
        showFaq: z.boolean().default(false),
        showDesignDecisions: z.boolean().default(false),
        showSuccessMetrics: z.boolean().default(false),
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
        // Section Titles
        statsTitle: z.string().optional(),
        challengeTitle: z.string().optional(),
        solutionTitle: z.string().optional(),
        milestonesTitle: z.string().optional(),
        designTokensTitle: z.string().optional(),
        testimonialsTitle: z.string().optional(),
        processTitle: z.string().optional(),
        techStackTitle: z.string().optional(),
        featuresTitle: z.string().optional(),
        userPersonasTitle: z.string().optional(),
        comparisonTitle: z.string().optional(),
        roadmapTitle: z.string().optional(),
        reflectionsTitle: z.string().optional(),
        technicalDeepDiveTitle: z.string().optional(),
        architectureTitle: z.string().optional(),
        perfSeoTitle: z.string().optional(),
        faqTitle: z.string().optional(),
        designDecisionsTitle: z.string().optional(),
        successMetricsTitle: z.string().optional(),
    }).optional(),
});

interface ProjectFormProps {
    initialData?: Project;
    onSubmit: (data: any) => Promise<void>;
    onCancel: () => void;
}

export function ProjectForm({ initialData, onSubmit, onCancel }: ProjectFormProps) {
    const [loading, setLoading] = useState(false);
    const [showBlueprintPicker, setShowBlueprintPicker] = useState(false);
    const [expandedSection, setExpandedSection] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

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
                showTechnicalDeepDive: initialData?.visibility?.showTechnicalDeepDive ?? false,
                showArchitecture: initialData?.visibility?.showArchitecture ?? false,
                showPerfSeo: initialData?.visibility?.showPerfSeo ?? false,
                showFaq: initialData?.visibility?.showFaq ?? false,
                showDesignDecisions: initialData?.visibility?.showDesignDecisions ?? false,
                showSuccessMetrics: initialData?.visibility?.showSuccessMetrics ?? false,
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
                // Section Titles
                statsTitle: initialData?.customLabels?.statsTitle || "Quantitative Metrics",
                challengeTitle: initialData?.customLabels?.challengeTitle || "The Challenge",
                solutionTitle: initialData?.customLabels?.solutionTitle || "The Solution",
                milestonesTitle: initialData?.customLabels?.milestonesTitle || "Project Milestones",
                designTokensTitle: initialData?.customLabels?.designTokensTitle || "Design DNA",
                testimonialsTitle: initialData?.customLabels?.testimonialsTitle || "User Feedback",
                processTitle: initialData?.customLabels?.processTitle || "Execution Strategy",
                techStackTitle: initialData?.customLabels?.techStackTitle || "Technology Core",
                featuresTitle: initialData?.customLabels?.featuresTitle || "Core Capabilities",
                userPersonasTitle: initialData?.customLabels?.userPersonasTitle || "Understanding Users",
                comparisonTitle: initialData?.customLabels?.comparisonTitle || "Measure of Success",
                roadmapTitle: initialData?.customLabels?.roadmapTitle || "Evolutionary Roadmap",
                reflectionsTitle: initialData?.customLabels?.reflectionsTitle || "Deep Reflections",
                technicalDeepDiveTitle: initialData?.customLabels?.technicalDeepDiveTitle || "Technical Core",
                architectureTitle: initialData?.customLabels?.architectureTitle || "System Architecture",
                perfSeoTitle: initialData?.customLabels?.perfSeoTitle || "Performance & Core Web Vitals",
                faqTitle: initialData?.customLabels?.faqTitle || "Frequently Asked Questions",
                designDecisionsTitle: initialData?.customLabels?.designDecisionsTitle || "Key Design Decisions",
                successMetricsTitle: initialData?.customLabels?.successMetricsTitle || "Success Metrics & KPIs",
            },
            processSteps: initialData?.processSteps || [],
            techStack: initialData?.techStack || [],
            features: initialData?.features || [],
            userPersonas: initialData?.userPersonas || [],
            comparison: initialData?.comparison || [],
            roadmap: initialData?.roadmap || [],
            reflections: initialData?.reflections || [],
            technicalDeepDive: initialData?.technicalDeepDive || [],
            architecture: initialData?.architecture || [],
            perfSeo: initialData?.perfSeo || { performance: 90, accessibility: 90, bestPractices: 90, seo: 90 },
            faq: initialData?.faq || [],
            designDecisions: initialData?.designDecisions || [],
            successMetrics: initialData?.successMetrics || [],
        },
    });

    const sectionOrder = watch("sectionOrder") || [];



    const SECTION_BLUEPRINTS = [
        { id: 'stats', label: 'Quantitative Metrics', description: 'Highlight key achievements with numbers.', icon: Trophy, category: 'results' },
        { id: 'comparison', label: 'Impact & Comparison', description: 'Showcase "Before vs After" or key comparative data.', icon: ArrowLeftRight, category: 'results' },
        { id: 'success_metrics', label: 'Success Metrics', description: 'KPI cards with trend indicators and goals.', icon: TrendingUp, category: 'results' },
        { id: 'challenge_solution', label: 'Problem & Solution', description: 'Define the challenge and your creative fix.', icon: Sparkles, category: 'process' },
        { id: 'process_steps', label: 'Phased Workflow', description: 'Step-by-step breakdown of your execution.', icon: Layers, category: 'process' },
        { id: 'milestones', label: 'Project Timeline', description: 'Key dates and project milestones.', icon: Calendar, category: 'process' },
        { id: 'roadmap', label: 'Project Roadmap', description: 'Visualize future phases and developments.', icon: GitMerge, category: 'process' },
        { id: 'design_decisions', label: 'Design Decisions', description: 'Rationale behind key architectural or UI choices.', icon: Lightbulb, category: 'process' },
        { id: 'embeds', label: 'Interactive Demos', description: 'Live previews, YouTube, or Figma embeds.', icon: Layout, category: 'content' },
        { id: 'content', label: 'Detailed Case Study', description: 'Long-form narrative with rich text.', icon: FileText, category: 'content' },
        { id: 'feature_list', label: 'Key Features', description: 'List of main functionalities built.', icon: List, category: 'content' },
        { id: 'user_personas', label: 'User Personas', description: 'Document target audience and user goals.', icon: UserSearch, category: 'content' },
        { id: 'faq', label: 'Project FAQ', description: 'Address common questions or technical edge cases.', icon: HelpCircle, category: 'content' },
        { id: 'tech_stack', label: 'Technology Core', description: 'Showcase the tools and languages used.', icon: Cpu, category: 'dna' },
        { id: 'design_tokens', label: 'Design DNA', description: 'Colors and typography used in the project.', icon: Palette, category: 'dna' },
        { id: 'architecture', label: 'Architecture & Scalability', description: 'Technical diagrams and structural breakdown.', icon: Network, category: 'dna' },
        { id: 'perf_seo', label: 'Performance & SEO', description: 'Lighthouse-style metrics and optimization results.', icon: Gauge, category: 'dna' },
        { id: 'gallery', label: 'Visual Showcase', description: 'Auto-generated high-res image gallery.', icon: ImageIcon, category: 'assets' },
        { id: 'testimonials', label: 'User Feedback', description: 'Quotes from clients or team members.', icon: Quote, category: 'social' },
        { id: 'team', label: 'Project Contributors', description: 'The people who made it happen.', icon: Users, category: 'team' },
        { id: 'reflections', label: 'Learning & Reflections', description: 'Detailed insights and personal takeaways.', icon: Lightbulb, category: 'insights' },
        { id: 'tech_deep_dive', label: 'Technical Deep-Dive', description: 'In-depth look at a specific architectural challenge.', icon: Code2, category: 'dev' },
    ];

    const addSection = (sectionId: string) => {
        if (!sectionOrder.includes(sectionId)) {
            setValue("sectionOrder", [...sectionOrder, sectionId]);
            // Automatically enable visibility when adding
            const visibilityMap: Record<string, string> = {
                stats: "showStats",
                challenge_solution: "showChallengeSolution",
                team: "showTeam",
                milestones: "showMilestones",
                design_tokens: "showDesignTokens",
                testimonials: "showTestimonials",
                process_steps: "showProcess",
                tech_stack: "showTech",
                feature_list: "showFeatures",
                user_personas: "showUserPersonas",
                comparison: "showComparison",
                roadmap: "showRoadmap",
                reflections: "showReflections",
                tech_deep_dive: "showTechnicalDeepDive",
                architecture: "showArchitecture",
                perf_seo: "showPerfSeo",
                faq: "showFaq",
                design_decisions: "showDesignDecisions",
                success_metrics: "showSuccessMetrics",
            };
            if (visibilityMap[sectionId]) {
                (setValue as any)(`visibility.${visibilityMap[sectionId]}`, true);
            }
            setShowBlueprintPicker(false);
        }
    };

    const removeSection = (sectionId: string) => {
        setValue("sectionOrder", sectionOrder.filter(id => id !== sectionId));
    };

    const { fields: statFields, append: appendStat, remove: removeStat } = useFieldArray({ control, name: "stats" });
    const { fields: teamFields, append: appendTeam, remove: removeTeam } = useFieldArray({ control, name: "teamMembers" });
    const { fields: milestoneFields, append: appendMilestone, remove: removeMilestone } = useFieldArray({ control, name: "milestones" });
    const { fields: colorFields, append: appendColor, remove: removeColor } = useFieldArray({ control, name: "designTokens.colors" });
    const { fields: fontFields, append: appendFont, remove: removeFont } = useFieldArray({ control, name: "designTokens.fonts" });
    const { fields: testimonialFields, append: appendTestimonial, remove: removeTestimonial } = useFieldArray({ control, name: "testimonials" });
    const { fields: processFields, append: appendProcess, remove: removeProcess } = useFieldArray({ control, name: "processSteps" });
    const { fields: techFields, append: appendTech, remove: removeTech } = useFieldArray({ control, name: "techStack" });
    const { fields: featureFields, append: appendFeature, remove: removeFeature } = useFieldArray({ control, name: "features" });
    const { fields: personaFields, append: appendPersona, remove: removePersona } = useFieldArray({ control, name: "userPersonas" });
    const { fields: comparisonFields, append: appendComparison, remove: removeComparison } = useFieldArray({ control, name: "comparison" });
    const { fields: roadmapFields, append: appendRoadmap, remove: removeRoadmap } = useFieldArray({ control, name: "roadmap" });
    const { fields: reflectionFields, append: appendReflection, remove: removeReflection } = useFieldArray({ control, name: "reflections" });
    const { fields: deepDiveFields, append: appendDeepDive, remove: removeDeepDive } = useFieldArray({ control, name: "technicalDeepDive" });
    const { fields: architectureFields, append: appendArchitecture, remove: removeArchitecture } = useFieldArray({ control, name: "architecture" });
    const { fields: faqFields, append: appendFaq, remove: removeFaq } = useFieldArray({ control, name: "faq" });
    const { fields: decisionFields, append: appendDecision, remove: removeDecision } = useFieldArray({ control, name: "designDecisions" });
    const { fields: metricFields, append: appendMetric, remove: removeMetric } = useFieldArray({ control, name: "successMetrics" });

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

            {/* --- MODULAR SECTIONS --- */}
            <div className="space-y-12 border-t pt-10">
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h3 className="text-xl font-black tracking-tighter flex items-center gap-2">
                                <Layout className="w-6 h-6 text-primary" /> Showcase Modules
                            </h3>
                            <p className="text-sm text-muted-foreground font-medium">Add and arrange specific details for this case study.</p>
                        </div>
                        <Button
                            type="button"
                            onClick={() => setShowBlueprintPicker(!showBlueprintPicker)}
                            variant={showBlueprintPicker ? "secondary" : "default"}
                            className={`rounded-[2rem] px-8 py-7 text-sm font-black transition-all duration-500 shadow-xl ${showBlueprintPicker ? 'bg-secondary' : 'bg-primary text-primary-foreground shadow-primary/20 hover:scale-105'}`}
                        >
                            {showBlueprintPicker ? <X className="w-5 h-5 mr-3" /> : <Plus className="w-5 h-5 mr-3" />}
                            {showBlueprintPicker ? "Close Gallery" : "Add Content Module"}
                        </Button>
                    </div>

                    {showBlueprintPicker && (
                        <div className="p-6 rounded-[2rem] bg-secondary/10 border-2 border-primary/20 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                            <h4 className="font-bold text-sm tracking-tight mb-4">Select Content Module</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                                {SECTION_BLUEPRINTS.map(b => {
                                    const BlueprintIcon = b.icon;
                                    const isUsed = sectionOrder.includes(b.id);
                                    return (
                                        <button
                                            key={b.id}
                                            type="button"
                                            disabled={isUsed}
                                            onClick={() => addSection(b.id)}
                                            className={`group p-4 rounded-3xl border transition-all duration-300 flex flex-col items-center justify-center gap-3 relative overflow-hidden backdrop-blur-sm shadow-sm ${isUsed ? 'opacity-50 grayscale cursor-not-allowed bg-muted/30 border-muted' : 'bg-background hover:bg-card hover:border-primary/50 hover:shadow-md active:scale-95'}`}
                                        >
                                            <div className={`p-3 rounded-2xl transition-colors ${isUsed ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground shadow-inner'}`}>
                                                <BlueprintIcon className="w-5 h-5" />
                                            </div>
                                            <div className="font-bold text-[11px] leading-tight text-center px-1 whitespace-pre-wrap">{b.label}</div>
                                            {isUsed && (
                                                <div className="absolute top-2 right-2 p-1 bg-background rounded-full shadow-sm"><CheckCircle2 className="w-3 h-3 text-emerald-500" /></div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(event: DragEndEvent) => {
                    const { active, over } = event;
                    if (active && over && active.id !== over.id) {
                        const oldIndex = sectionOrder.indexOf(active.id as string);
                        const newIndex = sectionOrder.indexOf(over.id as string);
                        setValue("sectionOrder", arrayMove(sectionOrder, oldIndex, newIndex));
                    }
                }}>
                    <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
                        <div className="space-y-8">
                            {sectionOrder.map((sectionId) => {
                                const blueprint = SECTION_BLUEPRINTS.find(b => b.id === sectionId);
                                if (!blueprint) return null;
                                const Icon = blueprint.icon;

                                return (
                                    <SortableItem key={sectionId} id={sectionId} dragHandle={true} disabled={expandedSection === sectionId}>

                                        <div className="flex flex-col gap-2 w-full">
                                            <div className="bg-white border rounded-[2rem] p-4 flex justify-between items-center shadow-sm w-full">
                                                <div className="flex items-center gap-4 pl-2">
                                                    <div className="p-2 border border-muted/60 rounded-full flex items-center justify-center bg-background shrink-0 text-slate-400">
                                                        <GripVertical className="w-5 h-5" />
                                                    </div>
                                                    <div className="p-2 border border-muted/60 rounded-full flex items-center justify-center bg-background shrink-0">
                                                        <Icon className="w-5 h-5 text-slate-800" strokeWidth={1.5} />
                                                    </div>
                                                    <span className="font-black text-xs uppercase tracking-[0.15em] text-slate-900 truncate pr-4">{blueprint.label}</span>
                                                </div>
                                                <div className="flex items-center gap-1 pr-2 shrink-0 pointer-events-auto relative z-50">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setExpandedSection(expandedSection === sectionId ? null : sectionId);
                                                        }}
                                                        onPointerDown={(e) => e.stopPropagation()}
                                                        className="rounded-full w-9 h-9 text-slate-400 hover:text-slate-900 border border-transparent hover:border-slate-200 transition-colors"
                                                    >
                                                        <Pencil className="w-[18px] h-[18px]" strokeWidth={2} />
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            removeSection(sectionId);
                                                        }}
                                                        onPointerDown={(e) => e.stopPropagation()}
                                                        className="rounded-full w-9 h-9 text-red-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                                    >
                                                        <X className="w-5 h-5" strokeWidth={2} />
                                                    </Button>
                                                </div>
                                            </div>

                                            {expandedSection === sectionId && (
                                                <div className="p-6 bg-card border rounded-[2rem] shadow-inner ml-6 sm:ml-12 mt-2 space-y-6">
                                                    {/* Render specific fields based on sectionId */}
                                                    {sectionId === 'stats' && (
                                                        <div className="space-y-4">
                                                            {statFields.map((field, index) => (
                                                                <div key={field.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-secondary/5 rounded-2xl relative group border">
                                                                    <button type="button" onClick={() => removeStat(index)} className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
                                                                    <div className="space-y-2">
                                                                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Value</Label>
                                                                        <Input {...register(`stats.${index}.value` as const)} placeholder="50%" />
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Label</Label>
                                                                        <Input {...register(`stats.${index}.label` as const)} placeholder="Faster load time" />
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            <Button type="button" variant="outline" size="sm" onClick={() => appendStat({ value: "+50%", label: "Faster load time" })} className="w-full border-dashed rounded-xl"><Plus className="w-4 h-4 mr-2" /> Add Metric</Button>
                                                        </div>
                                                    )}

                                                    {sectionId === 'challenge_solution' && (
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            <div className="space-y-4 p-4 border rounded-2xl bg-muted/20">
                                                                <div className="space-y-2"><Label>Challenge Title</Label><Input {...register("challengeTitle")} /></div>
                                                                <div className="space-y-2"><Label>Challenge Content</Label><Textarea {...register("challengeContent")} className="h-32" /></div>
                                                            </div>
                                                            <div className="space-y-4 p-4 border rounded-2xl bg-muted/20">
                                                                <div className="space-y-2"><Label>Solution Title</Label><Input {...register("solutionTitle")} /></div>
                                                                <div className="space-y-2"><Label>Solution Content</Label><Textarea {...register("solutionContent")} className="h-32" /></div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {sectionId === 'embeds' && (
                                                        <div className="space-y-4">
                                                            <div className="space-y-2"><Label>Embed URL</Label><Input {...register("embedUrl")} /></div>
                                                            <div className="space-y-2"><Label>Custom Script</Label><Textarea {...register("embedScript")} className="font-mono text-xs" /></div>
                                                        </div>
                                                    )}

                                                    {sectionId === 'content' && (
                                                        <div className="space-y-2"><Label>Long-form Content</Label><Textarea {...register("content")} className="min-h-[300px]" /></div>
                                                    )}

                                                    {sectionId === 'milestones' && (
                                                        <div className="space-y-3">
                                                            {milestoneFields.map((field, index) => (
                                                                <div key={field.id} className="p-4 bg-secondary/5 rounded-2xl border relative group space-y-3">
                                                                    <button type="button" onClick={() => removeMilestone(index)} className="absolute top-2 right-2 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button>
                                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                        <div className="space-y-1"><Label className="text-[10px] uppercase font-bold text-muted-foreground">Date</Label><Input {...register(`milestones.${index}.date` as const)} /></div>
                                                                        <div className="md:col-span-2 space-y-1"><Label className="text-[10px] uppercase font-bold text-muted-foreground">Label</Label><Input {...register(`milestones.${index}.label` as const)} /></div>
                                                                    </div>
                                                                    <div className="space-y-1"><Label className="text-[10px] uppercase font-bold text-muted-foreground">Description</Label><Input {...register(`milestones.${index}.description` as const)} /></div>
                                                                </div>
                                                            ))}
                                                            <Button type="button" variant="outline" size="sm" onClick={() => appendMilestone({ date: "Jan 2024", label: "Project Kickoff", description: "Initial research and planning phase." })} className="w-full border-dashed rounded-xl"><Plus className="w-4 h-4 mr-2" /> Add Milestone</Button>
                                                        </div>
                                                    )}

                                                    {sectionId === 'team' && (
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            {teamFields.map((field, index) => (
                                                                <div key={field.id} className="p-4 bg-muted/10 rounded-2xl border space-y-3 relative group">
                                                                    <button type="button" onClick={() => removeTeam(index)} className="absolute top-2 right-2 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button>
                                                                    <Input {...register(`teamMembers.${index}.name` as const)} placeholder="Name" />
                                                                    <Input {...register(`teamMembers.${index}.role` as const)} placeholder="Role" />
                                                                </div>
                                                            ))}
                                                            <Button type="button" variant="outline" size="sm" onClick={() => appendTeam({ name: "John Doe", role: "UI/UX Designer", avatar: "", url: "" })} className="w-full border-dashed rounded-xl"><Plus className="w-4 h-4 mr-2" /> Add Member</Button>
                                                        </div>
                                                    )}

                                                    {sectionId === 'design_tokens' && (
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                            <div className="space-y-4">
                                                                <Label>Colors</Label>
                                                                {colorFields.map((field, index) => (
                                                                    <div key={field.id} className="flex gap-2 items-center"><input type="color" {...register(`designTokens.colors.${index}.hex` as const)} className="w-8 h-8" /><Input {...register(`designTokens.colors.${index}.name` as const)} className="h-8" /><button type="button" onClick={() => removeColor(index)}><X className="w-3 h-3" /></button></div>
                                                                ))}
                                                                <Button type="button" variant="ghost" onClick={() => appendColor({ name: "Brand Accent", hex: "#3B82F6" })} className="text-xs">Add Color</Button>
                                                            </div>
                                                            <div className="space-y-4">
                                                                <Label>Typography</Label>
                                                                {fontFields.map((field, index) => (
                                                                    <div key={field.id} className="flex gap-2 items-center"><Input {...register(`designTokens.fonts.${index}.name` as const)} className="h-8" /><Input {...register(`designTokens.fonts.${index}.family` as const)} className="h-8" /><button type="button" onClick={() => removeFont(index)}><X className="w-3 h-3" /></button></div>
                                                                ))}
                                                                <Button type="button" variant="ghost" onClick={() => appendFont({ name: "Headings", family: "Inter, sans-serif" })} className="text-xs">Add Font</Button>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {sectionId === 'testimonials' && (
                                                        <div className="space-y-4">
                                                            {testimonialFields.map((field, index) => (
                                                                <div key={field.id} className="p-4 bg-primary/5 rounded-2xl border relative group">
                                                                    <button type="button" onClick={() => removeTestimonial(index)} className="absolute top-2 right-2 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button>
                                                                    <Textarea {...register(`testimonials.${index}.quote` as const)} placeholder="Quote" />
                                                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                                                        <Input {...register(`testimonials.${index}.author` as const)} placeholder="Author" />
                                                                        <Input {...register(`testimonials.${index}.role` as const)} placeholder="Role" />
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            <Button type="button" variant="outline" size="sm" onClick={() => appendTestimonial({ quote: "Absolutely fantastic work. Exceeded all our expectations.", author: "Jane Smith", role: "Product Manager", avatar: "" })} className="w-full border-dashed rounded-xl"><Plus className="w-4 h-4 mr-2" /> Add Testimonial</Button>
                                                        </div>
                                                    )}

                                                    {sectionId === 'gallery' && (
                                                        <p className="text-sm text-muted-foreground italic text-center py-4 border-2 border-dashed rounded-[2rem]">Additional images uploaded in "Media Assets" will appear here automatically.</p>
                                                    )}

                                                    {sectionId === 'process_steps' && (
                                                        <div className="space-y-4">
                                                            {processFields.map((field, index) => (
                                                                <div key={field.id} className="p-6 bg-secondary/5 rounded-3xl border relative group space-y-4">
                                                                    <button type="button" onClick={() => removeProcess(index)} className="absolute top-4 right-4 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button>
                                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                        <div className="space-y-2">
                                                                            <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Step Title</Label>
                                                                            <Input {...register(`processSteps.${index}.title` as const)} placeholder="e.g. Discovery & Research" />
                                                                        </div>
                                                                        <div className="space-y-2">
                                                                            <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Icon Name (Optional)</Label>
                                                                            <div className="flex gap-2">
                                                                                <div className="p-2 bg-background rounded-lg border flex items-center justify-center shrink-0">
                                                                                    <Settings className="w-4 h-4 text-primary" />
                                                                                </div>
                                                                                <Input {...register(`processSteps.${index}.icon` as const)} placeholder="e.g. Search, Code, Cpu" />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Detailed Description</Label>
                                                                        <Textarea {...register(`processSteps.${index}.description` as const)} placeholder="Describe the activities performed in this phase..." className="h-20" />
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            <Button type="button" variant="outline" onClick={() => appendProcess({ title: "Discovery & Research", description: "Deep dive into user requirements and initial exploration.", icon: "Search" })} className="w-full border-dashed rounded-2xl py-6 hover:bg-primary/5 hover:border-primary/20"><Plus className="w-4 h-4 mr-2" /> Add Phase</Button>
                                                        </div>
                                                    )}

                                                    {sectionId === 'tech_stack' && (
                                                        <div className="space-y-6">
                                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                                {techFields.map((field, index) => (
                                                                    <div key={field.id} className="p-4 bg-muted/10 rounded-2xl border relative group text-center space-y-3">
                                                                        <button type="button" onClick={() => removeTech(index)} className="absolute top-2 right-2 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
                                                                        <div className="w-10 h-10 mx-auto bg-background rounded-xl border flex items-center justify-center">
                                                                            <Cpu className="w-5 h-5 text-primary" />
                                                                        </div>
                                                                        <div className="space-y-2">
                                                                            <Input {...register(`techStack.${index}.name` as const)} placeholder="Tool/Lang" className="h-7 text-[10px] text-center font-black" />
                                                                            <select {...register(`techStack.${index}.level` as const)} className="w-full text-[9px] bg-background border rounded px-1 h-6">
                                                                                <option value="Primary">Primary</option>
                                                                                <option value="Secondary">Secondary</option>
                                                                                <option value="Expertise">Expertise</option>
                                                                            </select>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <Button type="button" variant="outline" onClick={() => appendTech({ name: "React Framework", icon: "Code2", level: "Primary" })} className="w-full border-dashed rounded-2xl py-6"><Plus className="w-4 h-4 mr-2" /> Add Tool</Button>
                                                        </div>
                                                    )}

                                                    {sectionId === 'feature_list' && (
                                                        <div className="space-y-4">
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                {featureFields.map((field, index) => (
                                                                    <div key={field.id} className="p-5 bg-primary/5 rounded-[2rem] border relative group space-y-2">
                                                                        <button type="button" onClick={() => removeFeature(index)} className="absolute top-4 right-4 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button>
                                                                        <div className="flex items-center gap-3">
                                                                            <CheckCircle2 className="w-5 h-5 text-primary" />
                                                                            <Input {...register(`features.${index}.title` as const)} placeholder="Feature Title" className="h-8 font-bold border-none bg-transparent p-0" />
                                                                        </div>
                                                                        <Textarea {...register(`features.${index}.description` as const)} placeholder="Small description..." className="h-16 text-xs bg-background/50" />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <Button type="button" variant="outline" onClick={() => appendFeature({ title: "Real-time Sync", description: "Changes are reflected instantly across all connected devices." })} className="w-full border-dashed rounded-2xl py-6"><Plus className="w-4 h-4 mr-2" /> Add Key Feature</Button>
                                                        </div>
                                                    )}

                                                    {sectionId === 'comparison' && (
                                                        <div className="space-y-4">
                                                            {comparisonFields.map((field, index) => (
                                                                <div key={field.id} className="p-6 bg-primary/5 rounded-[2.5rem] border-2 border-primary/10 relative group space-y-4">
                                                                    <button type="button" onClick={() => removeComparison(index)} className="absolute top-4 right-4 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button>
                                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                        <div className="space-y-2">
                                                                            <Label className="text-[10px] uppercase font-bold tracking-widest opacity-60">Before / Challenge State</Label>
                                                                            <Textarea {...register(`comparison.${index}.before` as const)} placeholder="Initial problem or state..." className="h-24 bg-background/50" />
                                                                        </div>
                                                                        <div className="space-y-2">
                                                                            <Label className="text-[10px] uppercase font-bold tracking-widest text-primary">After / Improved State</Label>
                                                                            <Textarea {...register(`comparison.${index}.after` as const)} placeholder="Result or improvement..." className="h-24 bg-primary/[0.02]" />
                                                                        </div>
                                                                    </div>
                                                                    <Input {...register(`comparison.${index}.caption` as const)} placeholder="Small caption or context (Optional)" className="h-8 text-xs italic bg-transparent border-dashed" />
                                                                </div>
                                                            ))}
                                                            <Button type="button" variant="outline" onClick={() => appendComparison({ before: "Slow, manual data entry processes.", after: "Automated tracking and synchronization.", caption: "Reduced processing time by 80%" })} className="w-full border-dashed rounded-2xl py-6"><Plus className="w-4 h-4 mr-2" /> Add Comparison Pair</Button>
                                                        </div>
                                                    )}

                                                    {sectionId === 'user_personas' && (
                                                        <div className="space-y-4">
                                                            {personaFields.map((field, index) => (
                                                                <div key={field.id} className="p-6 bg-secondary/5 rounded-[2.5rem] border relative group space-y-4">
                                                                    <button type="button" onClick={() => removePersona(index)} className="absolute top-4 right-4 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button>
                                                                    <div className="flex gap-4 items-start">
                                                                        <div className="w-16 h-16 rounded-2xl bg-primary/10 border flex items-center justify-center shrink-0">
                                                                            <UserSearch className="w-8 h-8 text-primary" />
                                                                        </div>
                                                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                            <Input {...register(`userPersonas.${index}.name` as const)} placeholder="Persona Name (e.g. Remote Designer)" className="font-black" />
                                                                            <Input {...register(`userPersonas.${index}.role` as const)} placeholder="Primary Role" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <Label className="text-[10px] uppercase font-bold tracking-widest opacity-60">Background Bio</Label>
                                                                        <Textarea {...register(`userPersonas.${index}.bio` as const)} placeholder="Quick overview of the user..." className="h-20" />
                                                                    </div>
                                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                        <div className="space-y-2">
                                                                            <Label className="text-[10px] uppercase font-bold tracking-widest text-primary">Goals & Needs</Label>
                                                                            <Textarea {...register(`userPersonas.${index}.goals` as const)} placeholder="What do they want to achieve?" className="h-20 text-xs" />
                                                                        </div>
                                                                        <div className="space-y-2">
                                                                            <Label className="text-[10px] uppercase font-bold tracking-widest text-destructive">Frustrations & Pains</Label>
                                                                            <Textarea {...register(`userPersonas.${index}.pains` as const)} placeholder="What are their current struggles?" className="h-20 text-xs" />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            <Button type="button" variant="outline" onClick={() => appendPersona({ name: "Sarah the Executive", role: "Marketing Director", bio: "A busy executive who needs quick insights.", goals: "Increase overall ROI and efficiency.", pains: "Too many disjointed tools limiting productivity." })} className="w-full border-dashed rounded-2xl py-6 hover:bg-primary/5 active:scale-95 transition-all"><Plus className="w-4 h-4 mr-2" /> Add User Persona</Button>
                                                        </div>
                                                    )}

                                                    {sectionId === 'roadmap' && (
                                                        <div className="space-y-4">
                                                            {roadmapFields.map((field, index) => (
                                                                <div key={field.id} className="p-6 bg-card rounded-[2rem] border relative group flex gap-6 items-center">
                                                                    <div className="shrink-0 flex flex-col items-center gap-2">
                                                                        <div className="w-10 h-10 rounded-full bg-primary/10 border flex items-center justify-center">
                                                                            <GitMerge className="w-5 h-5 text-primary" />
                                                                        </div>
                                                                        <div className="w-0.5 h-12 bg-primary/10" />
                                                                    </div>
                                                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                        <Input {...register(`roadmap.${index}.title` as const)} placeholder="Phase Name" className="font-bold border-none bg-transparent p-0" />
                                                                        <Input {...register(`roadmap.${index}.date` as const)} placeholder="Timeline (e.g. Q4 2026)" className="text-xs bg-muted/50 rounded-xl" />
                                                                        <select {...register(`roadmap.${index}.status` as const)} className="bg-background border rounded-xl px-2 h-9 text-xs">
                                                                            <option value="Planned">Planned</option>
                                                                            <option value="In Progress">In Progress</option>
                                                                            <option value="Completed">Completed</option>
                                                                        </select>
                                                                    </div>
                                                                    <button type="button" onClick={() => removeRoadmap(index)} className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button>
                                                                </div>
                                                            ))}
                                                            <Button type="button" variant="outline" onClick={() => appendRoadmap({ title: "Version 2.0 Launch", date: "Q4 2024", status: "Planned", description: "Major UI overhaul and performance pass." })} className="w-full border-dashed rounded-2xl py-6"><Plus className="w-4 h-4 mr-2" /> Add Roadmap Item</Button>
                                                        </div>
                                                    )}

                                                    {sectionId === 'reflections' && (
                                                        <div className="space-y-4">
                                                            {reflectionFields.map((field, index) => (
                                                                <div key={field.id} className="p-6 bg-yellow-500/5 rounded-[2.5rem] border-2 border-yellow-500/10 relative group space-y-4">
                                                                    <div className="flex items-center gap-4">
                                                                        <div className="p-3 bg-yellow-500/10 rounded-2xl text-yellow-600">
                                                                            <Lightbulb className="w-6 h-6" />
                                                                        </div>
                                                                        <Input {...register(`reflections.${index}.title` as const)} placeholder="Insight Topic (e.g. Scalability Lessons)" className="font-black text-lg border-none bg-transparent p-0" />
                                                                    </div>
                                                                    <Textarea {...register(`reflections.${index}.content` as const)} placeholder="What did you learn from this specific part of the project?" className="min-h-[120px] bg-background/50 border-none shadow-inner" />
                                                                    <button type="button" onClick={() => removeReflection(index)} className="absolute top-4 right-4 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button>
                                                                </div>
                                                            ))}
                                                            <Button type="button" variant="outline" onClick={() => appendReflection({ title: "Scalability Challenges", content: "Learned the importance of early database indexing to prevent future bottlenecks.", icon: "Lightbulb" })} className="w-full border-dashed border-yellow-500/30 text-yellow-700 rounded-2xl py-6 hover:bg-yellow-500/5"><Plus className="w-4 h-4 mr-2" /> Add Reflection</Button>
                                                        </div>
                                                    )}

                                                    {sectionId === 'tech_deep_dive' && (
                                                        <div className="space-y-4">
                                                            {deepDiveFields.map((field, index) => (
                                                                <div key={field.id} className="p-8 bg-slate-950 rounded-[3rem] border-slate-800 text-slate-200 relative group space-y-6">
                                                                    <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
                                                                        <Terminal className="w-6 h-6 text-blue-400" />
                                                                        <Input {...register(`technicalDeepDive.${index}.title` as const)} placeholder="Technical Challenge Name" className="font-black text-xl border-none bg-transparent p-0 text-slate-100" />
                                                                    </div>
                                                                    <div className="space-y-3">
                                                                        <Label className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Problem Description</Label>
                                                                        <Textarea {...register(`technicalDeepDive.${index}.description` as const)} placeholder="Explain the technical hurdle..." className="bg-slate-900 border-slate-800 text-slate-300 h-24" />
                                                                    </div>
                                                                    <div className="space-y-3">
                                                                        <div className="flex justify-between items-center">
                                                                            <Label className="text-[10px] uppercase font-bold tracking-widest text-blue-400">Solution Implementation</Label>
                                                                            <Input {...register(`technicalDeepDive.${index}.language` as const)} placeholder="Language (e.g. typescript)" className="w-32 h-6 text-[10px] bg-slate-900 border-none" />
                                                                        </div>
                                                                        <Textarea {...register(`technicalDeepDive.${index}.code` as const)} placeholder="// Insert code snippet or architecture explanation..." className="font-mono text-xs bg-slate-900 border-slate-800 text-green-400 h-48" />
                                                                    </div>
                                                                    <button type="button" onClick={() => removeDeepDive(index)} className="absolute top-6 right-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-5 h-5" /></button>
                                                                </div>
                                                            ))}
                                                            <Button type="button" variant="outline" onClick={() => appendDeepDive({ title: "Optimizing the Render Cycle", description: "Faced significant UI lag with large lists. Solved using virtual scrolling.", code: "const Row = ({ index, style }) => (\n  <div style={style}>Row {index}</div>\n);", language: "tsx" })} className="w-full border-dashed bg-slate-950 border-slate-800 text-slate-400 rounded-2xl py-8 hover:bg-slate-900 hover:text-slate-200 transition-all font-mono text-xs"><Plus className="w-4 h-4 mr-2" /> Initialize Tech Deep-Dive</Button>
                                                        </div>
                                                    )}
                                                    {sectionId === 'architecture' && (
                                                        <div className="space-y-4">
                                                            {architectureFields.map((field, index) => (
                                                                <div key={field.id} className="p-6 bg-primary/[0.02] rounded-[2.5rem] border-2 border-primary/10 relative group space-y-4">
                                                                    <button type="button" onClick={() => removeArchitecture(index)} className="absolute top-4 right-4 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button>
                                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                        <div className="space-y-4">
                                                                            <div className="space-y-2">
                                                                                <Label className="text-[10px] uppercase font-bold tracking-widest opacity-60">Diagram Title</Label>
                                                                                <Input {...register(`architecture.${index}.title` as const)} placeholder="e.g. Microservices Architecture" className="bg-background/50" />
                                                                            </div>
                                                                            <div className="space-y-2">
                                                                                <Label className="text-[10px] uppercase font-bold tracking-widest opacity-60">Key Details</Label>
                                                                                <Textarea {...register(`architecture.${index}.description` as const)} placeholder="Explain the structural choices..." className="h-32 bg-background/50" />
                                                                            </div>
                                                                        </div>
                                                                        <div className="space-y-2">
                                                                            <Label className="text-[10px] uppercase font-bold tracking-widest opacity-60">Diagram / Visual</Label>
                                                                            <FileUploader
                                                                                folder="projects/architecture"
                                                                                onUploadSuccess={(url) => setValue(`architecture.${index}.image` as const, url)}
                                                                                label="Upload Architecture Diagram"
                                                                            />
                                                                            {watch(`architecture.${index}.image`) && (
                                                                                <div className="mt-2 rounded-2xl overflow-hidden border bg-background aspect-video flex items-center justify-center">
                                                                                    <img src={watch(`architecture.${index}.image`)} alt="Preview" className="max-h-full object-contain" />
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            <Button type="button" variant="outline" onClick={() => appendArchitecture({ title: "Microservices Architecture", description: "Separating concerns into independent, scalable services to improve maintainability and deployment speed.", image: "" })} className="w-full border-dashed rounded-2xl py-6 hover:bg-primary/5"><Plus className="w-4 h-4 mr-2" /> Add Architecture Module</Button>
                                                        </div>
                                                    )}

                                                    {sectionId === 'perf_seo' && (
                                                        <div className="p-8 bg-emerald-500/[0.02] rounded-[3rem] border-2 border-emerald-500/10 space-y-8">
                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                                                <div className="space-y-3 text-center">
                                                                    <div className="p-3 bg-emerald-500/10 rounded-2xl w-fit mx-auto text-emerald-600"><Gauge className="w-6 h-6" /></div>
                                                                    <Label className="text-[10px] font-black uppercase tracking-widest">Performance</Label>
                                                                    <Input type="number" {...register("perfSeo.performance", { valueAsNumber: true })} className="text-center font-black text-xl bg-transparent border-none focus-visible:ring-0" />
                                                                    <div className="h-1 w-full bg-emerald-500/10 rounded-full overflow-hidden">
                                                                        <div className="h-full bg-emerald-500 transition-all" style={{ width: `${watch("perfSeo.performance")}%` }} />
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-3 text-center">
                                                                    <div className="p-3 bg-blue-500/10 rounded-2xl w-fit mx-auto text-blue-600"><Users className="w-6 h-6" /></div>
                                                                    <Label className="text-[10px] font-black uppercase tracking-widest">Accessibility</Label>
                                                                    <Input type="number" {...register("perfSeo.accessibility", { valueAsNumber: true })} className="text-center font-black text-xl bg-transparent border-none focus-visible:ring-0" />
                                                                    <div className="h-1 w-full bg-blue-500/10 rounded-full overflow-hidden">
                                                                        <div className="h-full bg-blue-500 transition-all" style={{ width: `${watch("perfSeo.accessibility")}%` }} />
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-3 text-center">
                                                                    <div className="p-3 bg-purple-500/10 rounded-2xl w-fit mx-auto text-purple-600"><CheckCircle2 className="w-6 h-6" /></div>
                                                                    <Label className="text-[10px] font-black uppercase tracking-widest">Best Practices</Label>
                                                                    <Input type="number" {...register("perfSeo.bestPractices", { valueAsNumber: true })} className="text-center font-black text-xl bg-transparent border-none focus-visible:ring-0" />
                                                                    <div className="h-1 w-full bg-purple-500/10 rounded-full overflow-hidden">
                                                                        <div className="h-full bg-purple-500 transition-all" style={{ width: `${watch("perfSeo.bestPractices")}%` }} />
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-3 text-center">
                                                                    <div className="p-3 bg-amber-500/10 rounded-2xl w-fit mx-auto text-amber-600"><TrendingUp className="w-6 h-6" /></div>
                                                                    <Label className="text-[10px] font-black uppercase tracking-widest">SEO</Label>
                                                                    <Input type="number" {...register("perfSeo.seo", { valueAsNumber: true })} className="text-center font-black text-xl bg-transparent border-none focus-visible:ring-0" />
                                                                    <div className="h-1 w-full bg-amber-500/10 rounded-full overflow-hidden">
                                                                        <div className="h-full bg-amber-500 transition-all" style={{ width: `${watch("perfSeo.seo")}%` }} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {sectionId === 'faq' && (
                                                        <div className="space-y-4">
                                                            {faqFields.map((field, index) => (
                                                                <div key={field.id} className="p-6 bg-secondary/5 rounded-3xl border relative group space-y-3">
                                                                    <button type="button" onClick={() => removeFaq(index)} className="absolute top-4 right-4 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button>
                                                                    <div className="flex gap-4 items-center">
                                                                        <div className="p-2 bg-primary/10 rounded-xl text-primary"><HelpCircle className="w-4 h-4" /></div>
                                                                        <Input {...register(`faq.${index}.question` as const)} placeholder="Common question or edge case insight?" className="font-bold border-none bg-transparent p-0" />
                                                                    </div>
                                                                    <Textarea {...register(`faq.${index}.answer` as const)} placeholder="Provide a detailed technical or strategic answer..." className="min-h-[80px] text-xs bg-background/50 border-none shadow-inner" />
                                                                </div>
                                                            ))}
                                                            <Button type="button" variant="outline" onClick={() => appendFaq({ question: "Why choose React over Vue?", answer: "The team's extensive experience and the robust ecosystem required for this scale of application." })} className="w-full border-dashed rounded-2xl py-6"><Plus className="w-4 h-4 mr-2" /> Add FAQ Entry</Button>
                                                        </div>
                                                    )}

                                                    {sectionId === 'design_decisions' && (
                                                        <div className="space-y-4">
                                                            {decisionFields.map((field, index) => (
                                                                <div key={field.id} className="grid grid-cols-1 md:grid-cols-2 gap-px bg-primary/10 rounded-[2.5rem] overflow-hidden border relative group">
                                                                    <button type="button" onClick={() => removeDecision(index)} className="absolute top-4 right-4 z-10 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button>
                                                                    <div className="p-8 bg-background space-y-4">
                                                                        <Label className="text-[10px] uppercase font-black tracking-widest text-primary">Challenge / Decision Context</Label>
                                                                        <Input {...register(`designDecisions.${index}.title` as const)} placeholder="Process Title (e.g. State Management)" className="font-black text-lg border-none bg-transparent p-0" />
                                                                        <Textarea {...register(`designDecisions.${index}.rationale` as const)} placeholder="Why was this decision made?" className="h-24 text-xs bg-secondary/5 border-none" />
                                                                    </div>
                                                                    <div className="p-8 bg-secondary/5 space-y-4">
                                                                        <Label className="text-[10px] uppercase font-black tracking-widest opacity-40">Final Choice / Outcome</Label>
                                                                        <Textarea {...register(`designDecisions.${index}.choice` as const)} placeholder="e.g. Optimized with Redux ToolKit" className="h-40 font-bold text-sm bg-transparent border-dashed ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            <Button type="button" variant="outline" onClick={() => appendDecision({ title: "State Management Selection", choice: "Zustand over Redux", rationale: "We needed a lighter, more straightforward solution without the excessive Redux boilerplate." })} className="w-full border-dashed rounded-2xl py-6"><Plus className="w-4 h-4 mr-2" /> Document Design Decision</Button>
                                                        </div>
                                                    )}

                                                    {sectionId === 'success_metrics' && (
                                                        <div className="space-y-4">
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                {metricFields.map((field, index) => (
                                                                    <div key={field.id} className="p-6 bg-emerald-500/[0.03] rounded-3xl border-2 border-emerald-500/10 relative group space-y-4">
                                                                        <button type="button" onClick={() => removeMetric(index)} className="absolute top-4 right-4 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button>
                                                                        <div className="flex justify-between items-end gap-4">
                                                                            <div className="space-y-1 flex-1">
                                                                                <Label className="text-[10px] uppercase font-bold opacity-40">Metric Label</Label>
                                                                                <Input {...register(`successMetrics.${index}.label` as const)} placeholder="Conversion Rate" className="font-bold border-none bg-transparent p-0 h-8" />
                                                                            </div>
                                                                            <div className="space-y-1 w-24">
                                                                                <Label className="text-[10px] uppercase font-bold text-center w-full opacity-40">Trend</Label>
                                                                                <select {...register(`successMetrics.${index}.trend` as const)} className="w-full bg-background border rounded-lg h-8 text-xs px-1">
                                                                                    <option value="up">UP</option>
                                                                                    <option value="down">DOWN</option>
                                                                                    <option value="neutral">NEUTRAL</option>
                                                                                </select>
                                                                            </div>
                                                                        </div>
                                                                        <div className="grid grid-cols-2 gap-4 pt-2">
                                                                            <div className="space-y-1">
                                                                                <Label className="text-[10px] uppercase font-bold text-emerald-600">Current Value</Label>
                                                                                <Input {...register(`successMetrics.${index}.value` as const)} placeholder="+450%" className="text-xl font-black bg-emerald-500/5 border-none" />
                                                                            </div>
                                                                            <div className="space-y-1">
                                                                                <Label className="text-[10px] uppercase font-bold opacity-40">Primary Goal</Label>
                                                                                <Input {...register(`successMetrics.${index}.goal` as const)} placeholder="Target: 300%" className="text-sm font-medium bg-transparent border-dashed" />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <Button type="button" variant="outline" onClick={() => appendMetric({ label: "Conversion Rate", value: "+450%", trend: "up", goal: "Target: 300%" })} className="w-full border-dashed rounded-2xl py-6 hover:bg-emerald-500/5 text-emerald-700 border-emerald-500/20"><Plus className="w-4 h-4 mr-2" /> Add Success Metric Case</Button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </SortableItem>
                                );
                            })}
                        </div>
                    </SortableContext>
                </DndContext>

            </div>

            {/* --- Project Page Options (Labels & UI) --- */}
            <div className="border-t pt-12 space-y-8">
                <div>
                    <h3 className="text-xl font-black tracking-tighter flex items-center gap-2 text-primary">
                        <Pencil className="w-5 h-5" /> Personalization
                    </h3>
                    <p className="text-sm text-muted-foreground font-medium">Fine-tune the labels and visibility for this project page.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4 p-6 bg-secondary/5 rounded-[2rem] border">
                        <Label className="font-black text-xs uppercase tracking-widest opacity-60">Global Link Labels</Label>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1"><Label className="text-[10px] font-bold">Back Text</Label><Input {...register("customLabels.backText")} className="h-8 text-xs" /></div>
                            <div className="space-y-1"><Label className="text-[10px] font-bold">Role Label</Label><Input {...register("customLabels.roleLabel")} className="h-8 text-xs" /></div>
                            <div className="space-y-1"><Label className="text-[10px] font-bold">Tech Label</Label><Input {...register("customLabels.techLabel")} className="h-8 text-xs" /></div>
                            <div className="space-y-1"><Label className="text-[10px] font-bold">Links Label</Label><Input {...register("customLabels.linksLabel")} className="h-8 text-xs" /></div>
                        </div>
                    </div>

                    <div className="space-y-4 p-6 bg-secondary/5 rounded-[2rem] border col-span-full">
                        <Label className="font-black text-xs uppercase tracking-widest opacity-60">Section Specifics</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {sectionOrder.includes('stats') && <div className="space-y-1"><Label className="text-[10px] font-bold">Stats</Label><Input {...register("customLabels.statsTitle")} className="h-8 text-xs" /></div>}
                            {sectionOrder.includes('challenge_solution') && (
                                <>
                                    <div className="space-y-1"><Label className="text-[10px] font-bold">Challenge</Label><Input {...register("customLabels.challengeTitle")} className="h-8 text-xs" /></div>
                                    <div className="space-y-1"><Label className="text-[10px] font-bold">Solution</Label><Input {...register("customLabels.solutionTitle")} className="h-8 text-xs" /></div>
                                </>
                            )}
                            {sectionOrder.includes('milestones') && <div className="space-y-1"><Label className="text-[10px] font-bold">Milestones</Label><Input {...register("customLabels.milestonesTitle")} className="h-8 text-xs" /></div>}
                            {sectionOrder.includes('design_tokens') && <div className="space-y-1"><Label className="text-[10px] font-bold">Design DNA</Label><Input {...register("customLabels.designTokensTitle")} className="h-8 text-xs" /></div>}
                            {sectionOrder.includes('testimonials') && <div className="space-y-1"><Label className="text-[10px] font-bold">Testimonials</Label><Input {...register("customLabels.testimonialsTitle")} className="h-8 text-xs" /></div>}
                            {sectionOrder.includes('process_steps') && <div className="space-y-1"><Label className="text-[10px] font-bold">Process</Label><Input {...register("customLabels.processTitle")} className="h-8 text-xs" /></div>}
                            {sectionOrder.includes('tech_stack') && <div className="space-y-1"><Label className="text-[10px] font-bold">Tech Stack</Label><Input {...register("customLabels.techStackTitle")} className="h-8 text-xs" /></div>}
                            {sectionOrder.includes('feature_list') && <div className="space-y-1"><Label className="text-[10px] font-bold">Features</Label><Input {...register("customLabels.featuresTitle")} className="h-8 text-xs" /></div>}
                            {sectionOrder.includes('user_personas') && <div className="space-y-1"><Label className="text-[10px] font-bold">Personas</Label><Input {...register("customLabels.userPersonasTitle")} className="h-8 text-xs" /></div>}
                            {sectionOrder.includes('comparison') && <div className="space-y-1"><Label className="text-[10px] font-bold">Comparison</Label><Input {...register("customLabels.comparisonTitle")} className="h-8 text-xs" /></div>}
                            {sectionOrder.includes('roadmap') && <div className="space-y-1"><Label className="text-[10px] font-bold">Roadmap</Label><Input {...register("customLabels.roadmapTitle")} className="h-8 text-xs" /></div>}
                            {sectionOrder.includes('reflections') && <div className="space-y-1"><Label className="text-[10px] font-bold">Reflections</Label><Input {...register("customLabels.reflectionsTitle")} className="h-8 text-xs" /></div>}
                            {sectionOrder.includes('technical_deep_dive') && <div className="space-y-1"><Label className="text-[10px] font-bold">Deep-Dive</Label><Input {...register("customLabels.technicalDeepDiveTitle")} className="h-8 text-xs" /></div>}
                            {sectionOrder.includes('architecture') && <div className="space-y-1"><Label className="text-[10px] font-bold">Architecture</Label><Input {...register("customLabels.architectureTitle")} className="h-8 text-xs" /></div>}
                            {sectionOrder.includes('perf_seo') && <div className="space-y-1"><Label className="text-[10px] font-bold">Perf & SEO</Label><Input {...register("customLabels.perfSeoTitle")} className="h-8 text-xs" /></div>}
                            {sectionOrder.includes('faq') && <div className="space-y-1"><Label className="text-[10px] font-bold">FAQ</Label><Input {...register("customLabels.faqTitle")} className="h-8 text-xs" /></div>}
                            {sectionOrder.includes('design_decisions') && <div className="space-y-1"><Label className="text-[10px] font-bold">Decisions</Label><Input {...register("customLabels.designDecisionsTitle")} className="h-8 text-xs" /></div>}
                            {sectionOrder.includes('success_metrics') && <div className="space-y-1"><Label className="text-[10px] font-bold">Success Metrics</Label><Input {...register("customLabels.successMetricsTitle")} className="h-8 text-xs" /></div>}
                            {sectionOrder.includes('gallery') && <div className="space-y-1"><Label className="text-[10px] font-bold">Gallery</Label><Input {...register("customLabels.galleryTitle")} className="h-8 text-xs" /></div>}
                            {sectionOrder.includes('embeds') && <div className="space-y-1"><Label className="text-[10px] font-bold">Demo</Label><Input {...register("customLabels.demoTitle")} className="h-8 text-xs" /></div>}
                            <div className="space-y-1"><Label className="text-[10px] font-bold">Resources</Label><Input {...register("customLabels.resourcesTitle")} className="h-8 text-xs" /></div>
                            <div className="space-y-1"><Label className="text-[10px] font-bold">Next Proj</Label><Input {...register("customLabels.nextProjectLabel")} className="h-8 text-xs" /></div>
                        </div>
                    </div>

                </div>
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
