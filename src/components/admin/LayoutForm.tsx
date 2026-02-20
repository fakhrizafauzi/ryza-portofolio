import { useState, useEffect } from "react";
import { sectionService } from "@/services/sectionService";
import { toast } from "sonner";
import { type PageSection } from "@/types";
import { SECTION_TEMPLATES } from "@/lib/templates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Trash2,
    Plus,
    Pencil,
    ChevronRight,
    Layout,
    Check,
    CheckCircle2,
    Palette,
    Image as ImageIcon,
    Users,
    Briefcase,
    Code,
    Sparkles,
    Cpu,
    Layers,
    MessageSquare,
    HelpCircle,
    CreditCard,
    BarChart3,
    ArrowRightCircle,
    Phone,
    Globe
} from "lucide-react";
import { FileUploader } from "./FileUploader";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import { type Project } from "@/types";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";
import { Copy } from "lucide-react";

const CATEGORY_MAP: Record<string, { label: string, icon: any }> = {
    hero: { label: "Hero Sections", icon: Sparkles },
    projects: { label: "Project Showcases", icon: Briefcase },
    skills: { label: "Skills & Tech", icon: Code },
    experience: { label: "Work History", icon: Layers },
    services: { label: "Services", icon: Cpu },
    contact: { label: "Connect", icon: Phone },
    testimonials: { label: "Testimonials", icon: MessageSquare },
    pricing: { label: "Pricing Plans", icon: CreditCard },
    faq: { label: "FAQ", icon: HelpCircle },
    team: { label: "Our Team", icon: Users },
    stats: { label: "Metrics", icon: BarChart3 },
    gallery: { label: "Visual Gallery", icon: ImageIcon },
    cta: { label: "Call to Action", icon: ArrowRightCircle },
    custom: { label: "Specialty Sections", icon: Globe },
};

export function LayoutForm() {
    const { data: allProjects = [] } = useFirestoreCollection<Project>('projects');
    const [sections, setSections] = useState<PageSection[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingSection, setEditingSection] = useState<PageSection | null>(null);
    const [showTemplatePicker, setShowTemplatePicker] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState<{ id: string, title: string } | null>(null);

    useEffect(() => {
        loadSections();
    }, []);

    const loadSections = async () => {
        const data = await sectionService.getAllSections();
        setSections(data);
        setLoading(false);
    };

    const handleAddSection = async (templateId: string) => {
        const template = SECTION_TEMPLATES.find(t => t.id === templateId);
        if (!template) return;

        const newSection: Omit<PageSection, "id" | "createdAt" | "updatedAt"> = {
            type: template.type,
            title: template.name,
            subtitle: template.description,
            templateId: template.id,
            order: sections.length,
            isPublished: true,
            options: {}
        };

        try {
            await sectionService.createSection(newSection);
            toast.success(`Section "${template.name}" added!`);
            setShowTemplatePicker(false);
            loadSections();
        } catch (err) { toast.error("Failed to add section."); }
    };

    const handleDelete = async () => {
        if (!confirmDelete) return;
        try {
            await sectionService.deleteSection(confirmDelete.id);
            toast.success("Section removed.");
            loadSections();
        } catch (err) { toast.error("Delete failed."); }
        finally { setConfirmDelete(null); }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingSection) return;

        try {
            await sectionService.updateSection(editingSection.id, {
                title: editingSection.title,
                subtitle: editingSection.subtitle || "",
                options: editingSection.options || {},
                templateId: editingSection.templateId,
                type: editingSection.type,
                isPublished: editingSection.isPublished ?? true,
                navTitle: editingSection.navTitle || "",
                inNav: editingSection.inNav ?? false
            });

            toast.success("Layout changes saved successfully!");
            setEditingSection(null);
            loadSections();
        } catch (err) {
            toast.error("Error saving changes.");
            console.error(err);
        }
    };

    const updateOption = (key: string, value: any) => {
        if (!editingSection) return;
        setEditingSection({
            ...editingSection,
            options: {
                ...(editingSection.options || {}),
                [key]: value
            }
        });
    };

    const handleDuplicateSection = async (section: PageSection) => {
        const { id, createdAt, updatedAt, ...rest } = section;
        const duplicatedSection: Omit<PageSection, "id" | "createdAt" | "updatedAt"> = {
            ...rest,
            title: `${rest.title} (Copy)`,
            order: sections.length,
            isPublished: false
        };

        try {
            await sectionService.createSection(duplicatedSection);
            toast.success(`Section "${section.title}" duplicated!`);
            loadSections();
        } catch (err) { toast.error("Failed to duplicate section."); }
    };

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = sections.findIndex((s) => s.id === active.id);
            const newIndex = sections.findIndex((s) => s.id === over.id);

            const newSections = arrayMove(sections, oldIndex, newIndex);
            setSections(newSections);

            try {
                const orderUpdates = newSections.map((s, i) => ({ id: s.id, order: i }));
                await sectionService.reorderSections(orderUpdates);
            } catch (err) {
                toast.error("Failed to update order.");
                loadSections();
            }
        }
    };

    return (
        <div className="space-y-8" >
            <ConfirmModal
                isOpen={!!confirmDelete}
                onClose={() => setConfirmDelete(null)}
                onConfirm={handleDelete}
                title="Delete Section?"
                description={`This will permanently remove the "${confirmDelete?.title}" section from your landing page. This action cannot be undone.`}
                confirmText="Delete Section"
                variant="danger"
            />
            <div className="flex justify-between items-center bg-card p-6 rounded-3xl border shadow-sm">
                <div>
                    <h3 className="text-2xl font-bold tracking-tight">Landing Page Architecture</h3>
                    <p className="text-muted-foreground">Reorder and customize the structure of your main page.</p>
                </div>
                <Button onClick={() => setShowTemplatePicker(true)} className="rounded-full px-6 gap-2">
                    <Plus className="w-4 h-4" /> Add Section
                </Button>
            </div>

            {showTemplatePicker && (
                <div className="space-y-10 border-2 border-primary/20 p-8 rounded-[3rem] bg-primary/5 transition-all animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex justify-between items-center">
                        <div className="space-y-1">
                            <h4 className="text-xl font-black flex items-center gap-3 text-primary uppercase tracking-tighter">
                                <Layout className="w-6 h-6" /> Blueprint Gallery
                            </h4>
                            <p className="text-sm text-muted-foreground font-medium">Choose a structure to expand your digital experience.</p>
                        </div>
                        <Button variant="outline" className="rounded-full px-6 border-primary/20 hover:bg-primary/10 transition-colors" onClick={() => setShowTemplatePicker(false)}>Close Explorer</Button>
                    </div>

                    <div className="space-y-12">
                        {Object.entries(CATEGORY_MAP).map(([type, category]) => {
                            const templates = SECTION_TEMPLATES.filter(t => t.type === type);
                            if (templates.length === 0) return null;
                            const Icon = category.icon;

                            return (
                                <div key={type} className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <h5 className="font-black text-sm uppercase tracking-[0.2em] opacity-60">{category.label}</h5>
                                        <div className="h-px flex-1 bg-primary/10" />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                        {templates.map(t => (
                                            <button
                                                key={t.id}
                                                onClick={() => handleAddSection(t.id)}
                                                className="group p-6 rounded-3xl bg-card border-2 border-transparent hover:border-primary/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-500 text-left space-y-4 relative overflow-hidden"
                                            >
                                                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                                                    <div className="bg-primary text-white p-2 rounded-xl">
                                                        <Plus className="w-4 h-4" />
                                                    </div>
                                                </div>

                                                <div className="space-y-1 pr-8">
                                                    <div className="font-black text-lg tracking-tight group-hover:text-primary transition-colors">{t.name}</div>
                                                    <p className="text-xs text-muted-foreground leading-relaxed font-medium line-clamp-2">
                                                        {t.description}
                                                    </p>
                                                </div>

                                                <div className="flex items-center justify-between pt-2">
                                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 group-hover:text-primary/60 transition-colors">
                                                        {t.id}
                                                    </span>
                                                    <ChevronRight className="w-4 h-4 text-primary transform -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500" />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <div className="space-y-4">
                    {loading ? (
                        <p>Loading layout...</p>
                    ) : sections.length === 0 ? (
                        <div className="py-20 text-center border-4 border-dashed rounded-[3rem] text-muted-foreground">
                            No sections added yet. Build your layout!
                        </div>
                    ) : (
                        <SortableContext
                            items={sections.map(s => s.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {sections.map((section) => (
                                <SortableItem key={section.id} id={section.id} dragHandle={true} disabled={editingSection?.id === section.id}>

                                    <div className={`w-full group relative bg-card/50 hover:bg-card border rounded-3xl p-6 transition-all shadow-sm hover:shadow-md ${editingSection?.id === section.id ? 'ring-2 ring-primary ring-offset-4 bg-card' : ''}`}>
                                        {editingSection?.id === section.id ? (
                                            <form onSubmit={handleUpdate} className="space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>Section Title</Label>
                                                        <Input
                                                            value={editingSection.title}
                                                            onChange={e => setEditingSection({ ...editingSection, title: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Subtitle</Label>
                                                        <Input
                                                            value={editingSection.subtitle || ""}
                                                            onChange={e => setEditingSection({ ...editingSection, subtitle: e.target.value })}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                                                    <div className="space-y-2">
                                                        <Label>Primary Button Text</Label>
                                                        <Input
                                                            placeholder="e.g. View Projects"
                                                            value={editingSection.options?.primaryBtnText || ""}
                                                            onChange={e => updateOption("primaryBtnText", e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Primary Button URL</Label>
                                                        <Input
                                                            placeholder="e.g. #projects or https://..."
                                                            value={editingSection.options?.primaryBtnUrl || ""}
                                                            onChange={e => updateOption("primaryBtnUrl", e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Secondary Button Text</Label>
                                                        <Input
                                                            placeholder="e.g. Contact Me"
                                                            value={editingSection.options?.secondaryBtnText || ""}
                                                            onChange={e => updateOption("secondaryBtnText", e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Secondary Button URL</Label>
                                                        <Input
                                                            placeholder="e.g. #contact"
                                                            value={editingSection.options?.secondaryBtnUrl || ""}
                                                            onChange={e => updateOption("secondaryBtnUrl", e.target.value)}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                                                    <div className="space-y-2">
                                                        <Label className="flex items-center gap-2">
                                                            Navigation Label
                                                            <span className="text-[10px] text-muted-foreground font-normal">(Used in Menu)</span>
                                                        </Label>
                                                        <Input
                                                            placeholder="e.g. Services, About Me"
                                                            value={editingSection.navTitle || ""}
                                                            onChange={e => setEditingSection({ ...editingSection, navTitle: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="flex items-center gap-3 pt-8">
                                                        <input
                                                            type="checkbox"
                                                            id="inNav"
                                                            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                            checked={editingSection.inNav || false}
                                                            onChange={e => setEditingSection({ ...editingSection, inNav: e.target.checked })}
                                                        />
                                                        <Label htmlFor="inNav" className="cursor-pointer">Show in Navigation Menu</Label>
                                                    </div>
                                                </div>

                                                <div className="p-6 bg-secondary/10 rounded-3xl space-y-6">
                                                    <div className="flex justify-between items-center mb-4">
                                                        <h5 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                                                            <Palette className="w-4 h-4" /> Appearance & Style
                                                        </h5>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-[10px] h-7 px-2 text-muted-foreground hover:text-primary transition-colors"
                                                            onClick={() => {
                                                                const currentOptions = { ...(editingSection.options || {}) };
                                                                delete currentOptions.bgColor;
                                                                delete currentOptions.textColor;
                                                                delete currentOptions.accentColor;
                                                                setEditingSection({ ...editingSection, options: currentOptions });
                                                            }}
                                                        >
                                                            Reset to Default
                                                        </Button>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                        <div className="space-y-3">
                                                            <Label className="text-xs">Background Color</Label>
                                                            <div className="flex gap-2">
                                                                <Input
                                                                    type="color"
                                                                    className="w-12 h-10 p-1 rounded-lg border-2"
                                                                    value={editingSection.options?.bgColor || '#ffffff'}
                                                                    onChange={e => updateOption("bgColor", e.target.value)}
                                                                />
                                                                <Input
                                                                    type="text"
                                                                    placeholder="#FFFFFF"
                                                                    className="font-mono text-xs"
                                                                    value={editingSection.options?.bgColor || '#ffffff'}
                                                                    onChange={e => updateOption("bgColor", e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-3">
                                                            <Label className="text-xs">Text Color</Label>
                                                            <div className="flex gap-2">
                                                                <Input
                                                                    type="color"
                                                                    className="w-12 h-10 p-1 rounded-lg border-2"
                                                                    value={editingSection.options?.textColor || '#000000'}
                                                                    onChange={e => updateOption("textColor", e.target.value)}
                                                                />
                                                                <Input
                                                                    type="text"
                                                                    placeholder="#000000"
                                                                    className="font-mono text-xs"
                                                                    value={editingSection.options?.textColor || '#000000'}
                                                                    onChange={e => updateOption("textColor", e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-3">
                                                            <Label className="text-xs">Accent Color</Label>
                                                            <div className="flex gap-2">
                                                                <Input
                                                                    type="color"
                                                                    className="w-12 h-10 p-1 rounded-lg border-2"
                                                                    value={editingSection.options?.accentColor || '#3b82f6'}
                                                                    onChange={e => updateOption("accentColor", e.target.value)}
                                                                />
                                                                <Input
                                                                    type="text"
                                                                    placeholder="#3B82F6"
                                                                    className="font-mono text-xs"
                                                                    value={editingSection.options?.accentColor || '#3b82f6'}
                                                                    onChange={e => updateOption("accentColor", e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-primary/10">
                                                        <div className="space-y-2">
                                                            <Label>Preset Style</Label>
                                                            <select
                                                                className="w-full p-2 rounded-lg border bg-background text-sm"
                                                                value={editingSection.options?.style || 'default'}
                                                                onChange={e => updateOption("style", e.target.value)}
                                                            >
                                                                <option value="default">Default (Theme Balanced)</option>
                                                                <option value="muted">Muted (Soft Gray)</option>
                                                                <option value="accent">Accent (Primary Tint)</option>
                                                                <option value="glass">Glass (Blurry Translucent)</option>
                                                                <option value="custom">Custom (No Preset Styles)</option>
                                                            </select>
                                                            <p className="text-[10px] text-muted-foreground italic">Custom colors will override these presets.</p>
                                                        </div>

                                                        {editingSection.templateId === 'hero-gradient' && (
                                                            <div className="space-y-2 col-span-full">
                                                                <Label>Badge Text (Top Label)</Label>
                                                                <Input
                                                                    placeholder="Available for new projects"
                                                                    value={editingSection.options?.badgeText || ""}
                                                                    onChange={e => updateOption("badgeText", e.target.value)}
                                                                />
                                                            </div>
                                                        )}

                                                        {editingSection.templateId === 'about-card' && (
                                                            <>
                                                                <div className="space-y-2">
                                                                    <Label>Display Name</Label>
                                                                    <Input
                                                                        placeholder="e.g. FAKHR."
                                                                        value={editingSection.options?.userName || ""}
                                                                        onChange={e => updateOption("userName", e.target.value)}
                                                                    />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <Label>User Role/Bio</Label>
                                                                    <Input
                                                                        placeholder="e.g. Digital Artisan"
                                                                        value={editingSection.options?.userRole || ""}
                                                                        onChange={e => updateOption("userRole", e.target.value)}
                                                                    />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <Label>Experience Stat Label</Label>
                                                                    <Input
                                                                        placeholder="Years Experience"
                                                                        value={editingSection.options?.stat1Label || ""}
                                                                        onChange={e => updateOption("stat1Label", e.target.value)}
                                                                    />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <Label>Projects Stat Label</Label>
                                                                    <Input
                                                                        placeholder="Projects Delivered"
                                                                        value={editingSection.options?.stat2Label || ""}
                                                                        onChange={e => updateOption("stat2Label", e.target.value)}
                                                                    />
                                                                </div>
                                                            </>
                                                        )}

                                                        {editingSection.type === 'cta' && (
                                                            <div className="space-y-4 col-span-full py-4 border-t border-b border-primary/10 bg-primary/5 rounded-xl p-4">
                                                                <Label className="flex items-center gap-2 text-primary">
                                                                    <CheckCircle2 className="w-4 h-4" /> Call-to-Action Button
                                                                </Label>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    <div className="space-y-2">
                                                                        <Label className="text-xs">Button Label</Label>
                                                                        <Input
                                                                            placeholder="e.g. Get Started"
                                                                            value={editingSection.options?.btnText || ""}
                                                                            onChange={e => updateOption("btnText", e.target.value)}
                                                                        />
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <Label className="text-xs">Button URL / Redirect</Label>
                                                                        <Input
                                                                            placeholder="https://... or #contact"
                                                                            value={editingSection.options?.btnUrl || ""}
                                                                            onChange={e => updateOption("btnUrl", e.target.value)}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div className="space-y-2">
                                                            <Label>Section Content Alignment</Label>
                                                            <select
                                                                className="w-full p-2 rounded-lg border bg-background text-sm"
                                                                value={editingSection.options?.align || 'left'}
                                                                onChange={e => updateOption("align", e.target.value)}
                                                            >
                                                                <option value="left">Left</option>
                                                                <option value="center">Center</option>
                                                                <option value="right">Right</option>
                                                            </select>
                                                        </div>

                                                        {(editingSection.templateId === 'hero-split' || editingSection.templateId === 'hero-visual' || editingSection.type === 'custom' || editingSection.type === 'cta') && (
                                                            <div className="space-y-4 col-span-full pt-4 border-t border-primary/10">
                                                                <Label>Section Image / Media</Label>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    <div className="flex items-center gap-4">
                                                                        <div className="w-16 h-16 rounded-xl bg-muted border flex items-center justify-center overflow-hidden shrink-0">
                                                                            {editingSection.options?.image ? <img src={editingSection.options.image} className="w-full h-full object-cover" /> : <ImageIcon className="w-6 h-6 opacity-20" />}
                                                                        </div>
                                                                        <div className="flex-1 space-y-2">
                                                                            <FileUploader
                                                                                folder="sections"
                                                                                onUploadSuccess={(url) => updateOption("image", url)}
                                                                                label="Upload Image"
                                                                            />
                                                                            <p className="text-[10px] text-muted-foreground">Upload an image from your device.</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <Label className="text-xs">Or use Image URL</Label>
                                                                        <Input
                                                                            placeholder="https://images.unsplash.com/..."
                                                                            value={editingSection.options?.image || ""}
                                                                            onChange={e => updateOption("image", e.target.value)}
                                                                            className="h-9 text-xs"
                                                                        />
                                                                        <p className="text-[10px] text-muted-foreground italic">Past an external image link here.</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {editingSection.type === 'hero' && (
                                                            <div className="space-y-2">
                                                                <Label>Text Alignment</Label>
                                                                <select
                                                                    className="w-full p-2 rounded-lg border bg-background text-sm"
                                                                    value={editingSection.options?.align || 'left'}
                                                                    onChange={e => updateOption("align", e.target.value)}
                                                                >
                                                                    <option value="left">Left</option>
                                                                    <option value="center">Center</option>
                                                                    <option value="right">Right</option>
                                                                </select>
                                                            </div>
                                                        )}

                                                        <div className="space-y-2">
                                                            <Label>Background Style</Label>
                                                            <select
                                                                className="w-full p-2 rounded-lg border bg-background text-sm"
                                                                value={editingSection.options?.style || 'default'}
                                                                onChange={e => updateOption("style", e.target.value)}
                                                            >
                                                                <option value="default">Default</option>
                                                                <option value="muted">Muted</option>
                                                                <option value="accent">Accent</option>
                                                                <option value="glass">Glass</option>
                                                                <option value="custom">Custom</option>
                                                            </select>
                                                        </div>

                                                        {editingSection.type === 'projects' && (
                                                            <div className="space-y-4 col-span-full border-t pt-4">
                                                                <Label>Selection Mode</Label>
                                                                <select
                                                                    className="w-full p-2 rounded-lg border bg-background text-sm"
                                                                    value={editingSection.options?.mode || 'recent'}
                                                                    onChange={e => updateOption("mode", e.target.value)}
                                                                >
                                                                    <option value="recent">Show Recent Projects</option>
                                                                    <option value="manual">Manually Pick Projects</option>
                                                                </select>

                                                                <div className="pt-2">
                                                                    <Label>Display Style</Label>
                                                                    <select
                                                                        className="w-full p-2 rounded-lg border bg-background text-sm"
                                                                        value={editingSection.options?.displayMode || 'grid'}
                                                                        onChange={e => updateOption("displayMode", e.target.value)}
                                                                    >
                                                                        <option value="grid">Grid Layout</option>
                                                                        <option value="list">List Layout</option>
                                                                        <option value="slider">Interactive Slider</option>
                                                                    </select>
                                                                </div>

                                                                {editingSection.options?.mode === 'manual' ? (
                                                                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                                                                        {allProjects.map(p => {
                                                                            const isSelected = (editingSection.options?.selectedIds || []).includes(p.id);
                                                                            return (
                                                                                <button
                                                                                    key={p.id}
                                                                                    type="button"
                                                                                    onClick={() => {
                                                                                        const current = editingSection.options?.selectedIds || [];
                                                                                        const next = isSelected ? current.filter((id: string) => id !== p.id) : [...current, p.id];
                                                                                        updateOption("selectedIds", next);
                                                                                    }}
                                                                                    className={`text-left p-3 rounded-xl border text-xs transition-all ${isSelected ? 'border-primary bg-primary/10' : 'opacity-60'}`}
                                                                                >
                                                                                    {p.title}
                                                                                </button>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                ) : (
                                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                        <div className="space-y-2">
                                                                            <Label>Total Items to Show</Label>
                                                                            <select
                                                                                className="w-full p-2 rounded-lg border bg-background text-sm"
                                                                                value={editingSection.options?.limit || 'all'}
                                                                                onChange={e => updateOption("limit", e.target.value)}
                                                                            >
                                                                                <option value="all">Show All</option>
                                                                                <option value="3">Latest 3</option>
                                                                                <option value="6">Latest 6</option>
                                                                                <option value="9">Latest 9</option>
                                                                                <option value="12">Latest 12</option>
                                                                            </select>
                                                                        </div>
                                                                        <div className="space-y-2">
                                                                            <Label>Items Per Page (Pagination)</Label>
                                                                            <select
                                                                                className="w-full p-2 rounded-lg border bg-background text-sm"
                                                                                value={editingSection.options?.itemsPerPage || '6'}
                                                                                onChange={e => updateOption("itemsPerPage", e.target.value)}
                                                                                disabled={editingSection.options?.displayMode === 'slider'}
                                                                            >
                                                                                <option value="3">3 Items</option>
                                                                                <option value="4">4 Items</option>
                                                                                <option value="6">6 Items</option>
                                                                                <option value="8">8 Items</option>
                                                                                <option value="9">9 Items</option>
                                                                                <option value="12">12 Items</option>
                                                                                <option value="1000">Disable Pagination</option>
                                                                            </select>
                                                                            {editingSection.options?.displayMode === 'slider' && (
                                                                                <p className="text-[10px] text-muted-foreground italic">N/A for slider mode.</p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}

                                                        {(editingSection.type === 'skills' || editingSection.type === 'experience') && (
                                                            <div className="space-y-4 col-span-full border-t pt-4">
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    <div className="space-y-2">
                                                                        <Label>Display Style</Label>
                                                                        <select
                                                                            className="w-full p-2 rounded-lg border bg-background text-sm"
                                                                            value={editingSection.options?.displayMode || 'grid'}
                                                                            onChange={e => updateOption("displayMode", e.target.value)}
                                                                        >
                                                                            <option value="grid">Grid Layout</option>
                                                                            <option value="list">List Layout</option>
                                                                            <option value="slider">Interactive Slider</option>
                                                                        </select>
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <Label>Items to Show</Label>
                                                                        <select
                                                                            className="w-full p-2 rounded-lg border bg-background text-sm"
                                                                            value={editingSection.options?.limit || 'all'}
                                                                            onChange={e => updateOption("limit", e.target.value)}
                                                                        >
                                                                            <option value="all">Show All</option>
                                                                            <option value="4">Limit 4</option>
                                                                            <option value="8">Limit 8</option>
                                                                            <option value="12">Limit 12</option>
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {editingSection.type === 'services' && (
                                                            <div className="space-y-4 col-span-full border-t pt-4">
                                                                <div className="flex justify-between items-center">
                                                                    <Label>Manage Services</Label>
                                                                    <Button type="button" variant="outline" size="sm" onClick={() => {
                                                                        const current = editingSection.options?.services || [];
                                                                        updateOption("services", [...current, { title: "New Service", description: "Details..." }]);
                                                                    }}>
                                                                        Add Service
                                                                    </Button>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    {(editingSection.options?.services || []).map((svc: any, idx: number) => (
                                                                        <div key={idx} className="p-3 bg-background border rounded-xl space-y-2 relative group/item">
                                                                            <button type="button" className="absolute top-2 right-2 text-destructive opacity-0 group-hover/item:opacity-100" onClick={() => {
                                                                                const current = [...(editingSection.options?.services || [])];
                                                                                current.splice(idx, 1);
                                                                                updateOption("services", current);
                                                                            }}>
                                                                                <Trash2 className="w-3 h-3" />
                                                                            </button>
                                                                            <Input value={svc.title} className="h-8" onChange={e => {
                                                                                const current = [...(editingSection.options?.services || [])];
                                                                                current[idx].title = e.target.value;
                                                                                updateOption("services", current);
                                                                            }} />
                                                                            <Input value={svc.description} className="h-8 text-xs" onChange={e => {
                                                                                const current = [...(editingSection.options?.services || [])];
                                                                                current[idx].description = e.target.value;
                                                                                updateOption("services", current);
                                                                            }} />
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {editingSection.type === 'faq' && (
                                                            <div className="space-y-4 col-span-full border-t pt-4">
                                                                <div className="flex justify-between items-center">
                                                                    <Label>Manage FAQ Items</Label>
                                                                    <Button type="button" variant="outline" size="sm" onClick={() => {
                                                                        const current = editingSection.options?.questions || [];
                                                                        updateOption("questions", [...current, { q: "New Question", a: "Answer text..." }]);
                                                                    }}>
                                                                        Add Question
                                                                    </Button>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    {(editingSection.options?.questions || []).map((item: any, idx: number) => (
                                                                        <div key={idx} className="p-3 bg-background border rounded-xl space-y-2 relative group/item">
                                                                            <button type="button" className="absolute top-2 right-2 text-destructive opacity-0 group-hover/item:opacity-100" onClick={() => {
                                                                                const current = [...(editingSection.options?.questions || [])];
                                                                                current.splice(idx, 1);
                                                                                updateOption("questions", current);
                                                                            }}>
                                                                                <Trash2 className="w-3 h-3" />
                                                                            </button>
                                                                            <Input value={item.q} placeholder="Question" className="h-8 font-bold" onChange={e => {
                                                                                const current = [...(editingSection.options?.questions || [])];
                                                                                current[idx].q = e.target.value;
                                                                                updateOption("questions", current);
                                                                            }} />
                                                                            <Input value={item.a} placeholder="Answer" className="h-8 text-xs" onChange={e => {
                                                                                const current = [...(editingSection.options?.questions || [])];
                                                                                current[idx].a = e.target.value;
                                                                                updateOption("questions", current);
                                                                            }} />
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {editingSection.type === 'pricing' && (
                                                            <div className="space-y-4 col-span-full border-t pt-4">
                                                                <div className="flex justify-between items-center">
                                                                    <Label>Manage Pricing Tiers</Label>
                                                                    <Button type="button" variant="outline" size="sm" onClick={() => {
                                                                        const current = editingSection.options?.tiers || [];
                                                                        updateOption("tiers", [...current, { name: "Pro", price: "$19", button: "Get Started", features: ["Service 1", "Service 2"] }]);
                                                                    }}>
                                                                        Add Tier
                                                                    </Button>
                                                                </div>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    {(editingSection.options?.tiers || []).map((tier: any, idx: number) => (
                                                                        <div key={idx} className="p-4 bg-background border rounded-xl space-y-3 relative group/item">
                                                                            <div className="flex justify-between">
                                                                                <Input value={tier.name} placeholder="Tier Name" className="h-8 font-bold w-full" onChange={e => {
                                                                                    const current = [...(editingSection.options?.tiers || [])];
                                                                                    current[idx].name = e.target.value;
                                                                                    updateOption("tiers", current);
                                                                                }} />
                                                                                <button type="button" className="text-destructive ml-2" onClick={() => {
                                                                                    const current = [...(editingSection.options?.tiers || [])];
                                                                                    current.splice(idx, 1);
                                                                                    updateOption("tiers", current);
                                                                                }}>
                                                                                    <Trash2 className="w-3 h-3" />
                                                                                </button>
                                                                            </div>
                                                                            <div className="flex gap-2">
                                                                                <Input value={tier.price} placeholder="Price" className="h-8" onChange={e => {
                                                                                    const current = [...(editingSection.options?.tiers || [])];
                                                                                    current[idx].price = e.target.value;
                                                                                    updateOption("tiers", current);
                                                                                }} />
                                                                                <Input value={tier.button} placeholder="Button Text" className="h-8" onChange={e => {
                                                                                    const current = [...(editingSection.options?.tiers || [])];
                                                                                    current[idx].button = e.target.value;
                                                                                    updateOption("tiers", current);
                                                                                }} />
                                                                            </div>
                                                                            <div className="space-y-2">
                                                                                <Label className="text-[10px] opacity-70 uppercase tracking-widest">Features (comma separated)</Label>
                                                                                <Input
                                                                                    value={tier.features?.join(', ')}
                                                                                    placeholder="Feature 1, Feature 2..."
                                                                                    className="h-8 text-xs"
                                                                                    onChange={e => {
                                                                                        const current = [...(editingSection.options?.tiers || [])];
                                                                                        current[idx].features = e.target.value.split(',').map(s => s.trim());
                                                                                        updateOption("tiers", current);
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                            <div className="flex items-center gap-2">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={tier.featured || false}
                                                                                    onChange={e => {
                                                                                        const current = [...(editingSection.options?.tiers || [])];
                                                                                        current[idx].featured = e.target.checked;
                                                                                        updateOption("tiers", current);
                                                                                    }}
                                                                                />
                                                                                <Label className="text-xs">Mark as Featured</Label>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {editingSection.type === 'team' && (
                                                            <div className="space-y-4 col-span-full border-t pt-4">
                                                                <div className="flex justify-between items-center">
                                                                    <Label>Manage Team Members</Label>
                                                                    <Button type="button" variant="outline" size="sm" onClick={() => {
                                                                        const current = editingSection.options?.members || [];
                                                                        updateOption("members", [...current, { name: "Name", role: "Role", img: "" }]);
                                                                    }}>
                                                                        Add Member
                                                                    </Button>
                                                                </div>
                                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                    {(editingSection.options?.members || []).map((m: any, idx: number) => (
                                                                        <div key={idx} className="p-3 bg-background border rounded-xl space-y-2 relative group/item">
                                                                            <button type="button" className="absolute top-2 right-2 text-destructive opacity-0 group-hover/item:opacity-100" onClick={() => {
                                                                                const current = [...(editingSection.options?.members || [])];
                                                                                current.splice(idx, 1);
                                                                                updateOption("members", current);
                                                                            }}>
                                                                                <Trash2 className="w-3 h-3" />
                                                                            </button>
                                                                            <div className="flex items-center gap-2">
                                                                                <div className="w-8 h-8 rounded-full bg-muted overflow-hidden border">
                                                                                    {m.img && <img src={m.img} className="w-full h-full object-cover" />}
                                                                                </div>
                                                                                <FileUploader
                                                                                    folder="team"
                                                                                    onUploadSuccess={(url) => {
                                                                                        const current = [...(editingSection.options?.members || [])];
                                                                                        current[idx].img = url;
                                                                                        updateOption("members", current);
                                                                                    }}
                                                                                    label="Pic"
                                                                                />
                                                                            </div>
                                                                            <Input value={m.name} placeholder="Name" className="h-7 text-xs font-bold" onChange={e => {
                                                                                const current = [...(editingSection.options?.members || [])];
                                                                                current[idx].name = e.target.value;
                                                                                updateOption("members", current);
                                                                            }} />
                                                                            <Input value={m.role} placeholder="Role" className="h-7 text-[10px]" onChange={e => {
                                                                                const current = [...(editingSection.options?.members || [])];
                                                                                current[idx].role = e.target.value;
                                                                                updateOption("members", current);
                                                                            }} />
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {editingSection.templateId === 'tech-stack' && (
                                                            <div className="space-y-2 col-span-full border-t pt-4">
                                                                <Label>Tech Stack Items (comma separated)</Label>
                                                                <Input
                                                                    value={editingSection.options?.tech?.join(', ')}
                                                                    placeholder="React, TypeScript, Firebase..."
                                                                    onChange={e => updateOption("tech", e.target.value.split(',').map(s => s.trim()))}
                                                                />
                                                            </div>
                                                        )}

                                                        {editingSection.templateId === 'process-steps' && (
                                                            <div className="space-y-4 col-span-full border-t pt-4">
                                                                <div className="flex justify-between items-center">
                                                                    <Label>Manage Process Steps</Label>
                                                                    <Button type="button" variant="outline" size="sm" onClick={() => {
                                                                        const current = editingSection.options?.steps || [];
                                                                        updateOption("steps", [...current, { title: "Step", desc: "Description..." }]);
                                                                    }}>
                                                                        Add Step
                                                                    </Button>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    {(editingSection.options?.steps || []).map((step: any, idx: number) => (
                                                                        <div key={idx} className="p-3 bg-background border rounded-xl space-y-2 relative group/item">
                                                                            <button type="button" className="absolute top-2 right-2 text-destructive opacity-0 group-hover/item:opacity-100" onClick={() => {
                                                                                const current = [...(editingSection.options?.steps || [])];
                                                                                current.splice(idx, 1);
                                                                                updateOption("steps", current);
                                                                            }}>
                                                                                <Trash2 className="w-3 h-3" />
                                                                            </button>
                                                                            <Input value={step.title} placeholder="Step Title" className="h-8 font-bold" onChange={e => {
                                                                                const current = [...(editingSection.options?.steps || [])];
                                                                                current[idx].title = e.target.value;
                                                                                updateOption("steps", current);
                                                                            }} />
                                                                            <Input value={step.desc} placeholder="Step Description" className="h-8 text-xs" onChange={e => {
                                                                                const current = [...(editingSection.options?.steps || [])];
                                                                                current[idx].desc = e.target.value;
                                                                                updateOption("steps", current);
                                                                            }} />
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {editingSection.type === 'stats' && (
                                                            <div className="space-y-4 col-span-full border-t pt-4">
                                                                <div className="flex justify-between items-center">
                                                                    <Label>Manage Stats</Label>
                                                                    <Button type="button" variant="outline" size="sm" onClick={() => {
                                                                        const current = editingSection.options?.stats || [];
                                                                        updateOption("stats", [...current, { value: "0", label: "Label" }]);
                                                                    }}>
                                                                        Add Stat
                                                                    </Button>
                                                                </div>
                                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                                    {(editingSection.options?.stats || []).map((stat: any, idx: number) => (
                                                                        <div key={idx} className="p-3 bg-background border rounded-xl space-y-2 relative group/item">
                                                                            <button type="button" className="absolute top-2 right-2 text-destructive" onClick={() => {
                                                                                const current = [...(editingSection.options?.stats || [])];
                                                                                current.splice(idx, 1);
                                                                                updateOption("stats", current);
                                                                            }}>
                                                                                <Trash2 className="w-3 h-3" />
                                                                            </button>
                                                                            <Input value={stat.value} placeholder="Value" className="h-8 text-center font-black" onChange={e => {
                                                                                const current = [...(editingSection.options?.stats || [])];
                                                                                current[idx].value = e.target.value;
                                                                                updateOption("stats", current);
                                                                            }} />
                                                                            <Input value={stat.label} placeholder="Label" className="h-8 text-[10px] text-center" onChange={e => {
                                                                                const current = [...(editingSection.options?.stats || [])];
                                                                                current[idx].label = e.target.value;
                                                                                updateOption("stats", current);
                                                                            }} />
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {editingSection.type === 'testimonials' && (
                                                            <div className="space-y-4 col-span-full border-t pt-4">
                                                                <div className="flex justify-between items-center">
                                                                    <Label>Manage Testimonials</Label>
                                                                    <Button type="button" variant="outline" size="sm" onClick={() => {
                                                                        const current = editingSection.options?.testimonials || [];
                                                                        updateOption("testimonials", [...current, { text: "Review text...", name: "Name", role: "Role" }]);
                                                                    }}>
                                                                        Add Testimonial
                                                                    </Button>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    {(editingSection.options?.testimonials || []).map((t: any, idx: number) => (
                                                                        <div key={idx} className="p-3 bg-background border rounded-xl space-y-2 relative group/item">
                                                                            <button type="button" className="absolute top-2 right-2 text-destructive" onClick={() => {
                                                                                const current = [...(editingSection.options?.testimonials || [])];
                                                                                current.splice(idx, 1);
                                                                                updateOption("testimonials", current);
                                                                            }}>
                                                                                <Trash2 className="w-3 h-3" />
                                                                            </button>
                                                                            <Input value={t.text} placeholder="Review" className="h-8 text-xs" onChange={e => {
                                                                                const current = [...(editingSection.options?.testimonials || [])];
                                                                                current[idx].text = e.target.value;
                                                                                updateOption("testimonials", current);
                                                                            }} />
                                                                            <div className="flex gap-2">
                                                                                <Input value={t.name} placeholder="Name" className="h-7 text-[10px] font-bold" onChange={e => {
                                                                                    const current = [...(editingSection.options?.testimonials || [])];
                                                                                    current[idx].name = e.target.value;
                                                                                    updateOption("testimonials", current);
                                                                                }} />
                                                                                <Input value={t.role} placeholder="Role" className="h-7 text-[10px]" onChange={e => {
                                                                                    const current = [...(editingSection.options?.testimonials || [])];
                                                                                    current[idx].role = e.target.value;
                                                                                    updateOption("testimonials", current);
                                                                                }} />
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {editingSection.type === 'gallery' && (
                                                            <div className="space-y-4 col-span-full border-t pt-4">
                                                                <div className="flex justify-between items-center">
                                                                    <Label>Manage Gallery Images</Label>
                                                                    <Button type="button" variant="outline" size="sm" onClick={() => {
                                                                        const current = editingSection.options?.images || [];
                                                                        updateOption("images", [...current, { url: "", title: "Image Title" }]);
                                                                    }}>
                                                                        Add Image
                                                                    </Button>
                                                                </div>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    {(editingSection.options?.images || []).map((img: any, idx: number) => (
                                                                        <div key={idx} className="p-3 bg-background border rounded-xl space-y-2 relative group/item">
                                                                            <button type="button" className="absolute top-2 right-2 text-destructive" onClick={() => {
                                                                                const current = [...(editingSection.options?.images || [])];
                                                                                current.splice(idx, 1);
                                                                                updateOption("images", current);
                                                                            }}>
                                                                                <Trash2 className="w-3 h-3" />
                                                                            </button>
                                                                            <div className="flex items-center gap-3">
                                                                                <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden border">
                                                                                    {img.url && <img src={img.url} className="w-full h-full object-cover" />}
                                                                                </div>
                                                                                <div className="flex-1 space-y-1">
                                                                                    <Input value={img.title} placeholder="Title" className="h-7 text-xs font-bold" onChange={e => {
                                                                                        const current = [...(editingSection.options?.images || [])];
                                                                                        current[idx].title = e.target.value;
                                                                                        updateOption("images", current);
                                                                                    }} />
                                                                                    <FileUploader
                                                                                        folder="gallery"
                                                                                        onUploadSuccess={(url) => {
                                                                                            const current = [...(editingSection.options?.images || [])];
                                                                                            current[idx].url = url;
                                                                                            updateOption("images", current);
                                                                                        }}
                                                                                        label="Upload Image"
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {editingSection.templateId === 'cta-features' && (
                                                            <div className="space-y-4 col-span-full border-t pt-4">
                                                                <div className="flex justify-between items-center">
                                                                    <Label>Manage Features</Label>
                                                                    <Button type="button" variant="outline" size="sm" onClick={() => {
                                                                        const current = editingSection.options?.features || [];
                                                                        updateOption("features", [...current, { title: "Feature", desc: "Description..." }]);
                                                                    }}>
                                                                        Add Feature
                                                                    </Button>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    {(editingSection.options?.features || []).map((feat: any, idx: number) => (
                                                                        <div key={idx} className="p-3 bg-background border rounded-xl space-y-2 relative group/item">
                                                                            <button type="button" className="absolute top-2 right-2 text-destructive" onClick={() => {
                                                                                const current = [...(editingSection.options?.features || [])];
                                                                                current.splice(idx, 1);
                                                                                updateOption("features", current);
                                                                            }}>
                                                                                <Trash2 className="w-3 h-3" />
                                                                            </button>
                                                                            <Input value={feat.title} placeholder="Feature Title" className="h-8 font-bold" onChange={e => {
                                                                                const current = [...(editingSection.options?.features || [])];
                                                                                current[idx].title = e.target.value;
                                                                                updateOption("features", current);
                                                                            }} />
                                                                            <Input value={feat.desc} placeholder="Description" className="h-8 text-xs outline-none" onChange={e => {
                                                                                const current = [...(editingSection.options?.features || [])];
                                                                                current[idx].desc = e.target.value;
                                                                                updateOption("features", current);
                                                                            }} />
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex justify-end gap-2 pt-4 border-t">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            setEditingSection(null);
                                                        }}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button type="submit" size="sm" className="gap-2">
                                                        <Check className="w-4 h-4" /> Save Changes
                                                    </Button>
                                                </div>
                                            </form>
                                        ) : (
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-6">
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="font-bold text-lg">{section.title}</h4>
                                                            <span className="text-[10px] px-2 py-0.5 bg-secondary rounded-full">{section.templateId}</span>
                                                            {section.inNav && (
                                                                <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-full font-bold">In Menu: {section.navTitle || section.title}</span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-muted-foreground italic truncate max-w-md">{section.subtitle}</p>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="rounded-xl hover:bg-primary/10 hover:text-primary transition-colors h-10 w-10 shrink-0"
                                                        onClick={() => handleDuplicateSection(section)}
                                                        title="Duplicate Section"
                                                    >
                                                        <Copy className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="rounded-xl hover:bg-primary/10 hover:text-primary transition-colors h-10 w-10 shrink-0"
                                                        onClick={() => setEditingSection(section)}
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="rounded-xl hover:bg-destructive/10 hover:text-destructive transition-colors h-10 w-10 shrink-0"
                                                        onClick={() => setConfirmDelete({ id: section.id, title: section.title })}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </SortableItem>
                            ))}
                        </SortableContext>
                    )}
                </div>
            </DndContext>
        </div >
    );
}
