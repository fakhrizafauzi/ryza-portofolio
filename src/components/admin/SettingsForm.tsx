import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { type SiteSettings } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useEffect, useState, useRef } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "../ui/card";
import { FileUploader } from "./FileUploader";
import {
    Plus,
    Trash2,
    Search,
    Image as ImageIcon,
    Facebook,
    Twitter,
    Instagram,
    Youtube,
    Linkedin,
    Github,
    Chrome,
    MessageSquare,
    Globe,
    Mail,
    Twitch,
    Slack,
    Figma,
    Dribbble,
    MessageCircle,
    Send,
    Ghost,
    Rss,
    Apple,
    Play,
    Gitlab,
    Codepen,
    Codesandbox,
    Trello,
    Music,
    Palette,
    FileText,
    Pin,
    GitBranch
} from "lucide-react";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { toast } from "sonner";

const normalizeSocialLinks = (links: any) => {
    if (Array.isArray(links)) return links;
    if (links && typeof links === "object") {
        return Object.entries(links)
            .filter(([_, url]) => !!url)
            .map(([name, url]) => ({
                name,
                url: url as string,
                style: 'filled' as const
            }));
    }
    return [];
};

const settingsSchema = z.object({
    siteName: z.string().min(1, "Site name is required"),
    siteTitle: z.string().optional(),
    siteLogo: z.string().optional(),
    contactEmail: z.string().email("Invalid email"),
    phone: z.string().optional(),
    location: z.string().optional(),
    footerText: z.string().min(1, "Footer text is required"),
    metaDescription: z.string().optional(),
    keywords: z.string().optional(),
    socialLinks: z.array(z.object({
        name: z.string().min(1, "Name required"),
        url: z.string().url("Invalid URL"),
        icon: z.string().optional(),
        style: z.enum(['filled', 'outline', 'colored']),
        color: z.string().optional()
    })).optional(),
    navBgColor: z.string().optional(),
    navTextColor: z.string().optional(),
    navStyle: z.enum(['solid', 'glass']).optional(),
    // Keep legacy for now
    heroTitle: z.string().optional(),
    heroSubtitle: z.string().optional(),
});

type SettingsData = z.infer<typeof settingsSchema>;

interface SettingsFormProps {
    initialData: SiteSettings;
    onSubmit: (data: any) => Promise<void>;
}

const PREDEFINED_SOCIALS = [
    { name: "GitHub", icon: "github", color: "#000000" },
    { name: "LinkedIn", icon: "linkedin", color: "#0077b5" },
    { name: "Twitter", icon: "twitter", color: "#1da1f2" },
    { name: "Instagram", icon: "instagram", color: "#e4405f" },
    { name: "YouTube", icon: "youtube", color: "#ff0000" },
    { name: "Facebook", icon: "facebook", color: "#1877f2" },
    { name: "Discord", icon: "discord", color: "#5865f2" },
    { name: "TikTok", icon: "tiktok", color: "#000000" },
    { name: "Twitch", icon: "twitch", color: "#9146ff" },
    { name: "Spotify", icon: "spotify", color: "#1db954" },
    { name: "WhatsApp", icon: "whatsapp", color: "#25d366" },
    { name: "Telegram", icon: "telegram", color: "#0088cc" },
    { name: "Reddit", icon: "reddit", color: "#ff4500" },
    { name: "Dribbble", icon: "dribbble", color: "#ea4c89" },
    { name: "Behance", icon: "behance", color: "#1769ff" },
    { name: "Pinterest", icon: "pinterest", color: "#bd081c" },
    { name: "Snapchat", icon: "snapchat", color: "#fffc00" },
    { name: "Medium", icon: "medium", color: "#000000" },
    { name: "Slack", icon: "slack", color: "#4a154b" },
    { name: "Figma", icon: "figma", color: "#f24e1e" },
    { name: "GitLab", icon: "gitlab", color: "#fc6d26" },
    { name: "Bitbucket", icon: "bitbucket", color: "#0052cc" },
    { name: "CodePen", icon: "codepen", color: "#000000" },
    { name: "Trello", icon: "trello", color: "#0052cc" },
    { name: "Apple", icon: "apple", color: "#000000" },
    { name: "RSS", icon: "rss", color: "#ee802f" },
    { name: "Email", icon: "mail", color: "#64748b" },
    { name: "Website", icon: "globe", color: "#10b981" },
];

const AdminSocialIcon = ({ icon, color, className = "w-4 h-4" }: { icon?: string, color?: string, className?: string }) => {
    if (!icon) return <Globe className={className} />;

    // Create actual icon with custom color if provided
    const getIconStyles = () => {
        if (!color) return {};
        return { color };
    };

    if (icon.startsWith('http')) return <img src={icon} className={`${className} object-contain`} />;

    const icons: Record<string, any> = {
        github: Github,
        linkedin: Linkedin,
        twitter: Twitter,
        instagram: Instagram,
        youtube: Youtube,
        facebook: Facebook,
        discord: MessageSquare,
        tiktok: Chrome,
        globe: Globe,
        mail: Mail,
        twitch: Twitch,
        slack: Slack,
        reddit: MessageCircle,
        figma: Figma,
        dribbble: Dribbble,
        behance: Palette,
        medium: FileText,
        spotify: Music,
        whatsapp: MessageCircle,
        telegram: Send,
        snapchat: Ghost,
        pinterest: Pin,
        rss: Rss,
        apple: Apple,
        play: Play,
        gitlab: Gitlab,
        bitbucket: GitBranch,
        codepen: Codepen,
        codesandbox: Codesandbox,
        trello: Trello,
    };

    const IconComp = icons[icon.toLowerCase()] || Globe;
    return <IconComp className={className} style={getIconStyles()} />;
};

export function SettingsForm({ initialData, onSubmit }: SettingsFormProps) {
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [pendingData, setPendingData] = useState<any>(null);

    const { register, handleSubmit, watch, setValue, reset, control, formState: { errors } } = useForm<SettingsData>({
        resolver: zodResolver(settingsSchema),
        defaultValues: {
            siteName: initialData?.siteName || "",
            siteTitle: initialData?.siteTitle || "",
            siteLogo: initialData?.siteLogo || "",
            contactEmail: initialData?.contactEmail || "",
            phone: initialData?.phone || "",
            location: initialData?.location || "",
            footerText: initialData?.footerText || "",
            metaDescription: initialData?.metaDescription || "",
            keywords: initialData?.keywords || "",
            socialLinks: normalizeSocialLinks(initialData?.socialLinks),
            heroTitle: initialData?.heroTitle || "",
            heroSubtitle: initialData?.heroSubtitle || "",
            navBgColor: initialData?.navBgColor || "",
            navTextColor: initialData?.navTextColor || "",
            navStyle: initialData?.navStyle || "glass",
        },
    });

    const colorPickerRefs = useRef<Record<number, HTMLInputElement | null>>({});

    const { fields, append, remove } = useFieldArray({
        control,
        name: "socialLinks"
    });

    const siteLogo = watch("siteLogo");

    // Re-initialize form when initialData changes (e.g. after fetch)
    useEffect(() => {
        if (initialData) {
            reset({
                siteName: initialData.siteName || "",
                siteTitle: initialData.siteTitle || "",
                siteLogo: initialData.siteLogo || "",
                contactEmail: initialData.contactEmail || "",
                phone: initialData.phone || "",
                location: initialData.location || "",
                footerText: initialData.footerText || "",
                metaDescription: initialData.metaDescription || "",
                keywords: initialData.keywords || "",
                socialLinks: normalizeSocialLinks(initialData.socialLinks),
                heroTitle: initialData.heroTitle || "",
                heroSubtitle: initialData.heroSubtitle || "",
                navBgColor: initialData.navBgColor || "",
                navTextColor: initialData.navTextColor || "",
                navStyle: initialData.navStyle || "glass",
            });
        }
    }, [initialData, reset]);

    const handleFormSubmit = async (data: any) => {
        setPendingData(data);
        setShowConfirm(true);
    };

    const confirmSubmit = async () => {
        if (!pendingData) return;
        setLoading(true);
        setShowConfirm(false);
        try {
            await onSubmit(pendingData);
            toast.success("Site settings updated successfully!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to update settings.");
        } finally {
            setLoading(false);
            setPendingData(null);
        }
    };

    return (
        <Card>
            <ConfirmModal
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={confirmSubmit}
                title="Save Changes?"
                description="Are you sure you want to update the global site settings? These changes will be reflected immediately across the entire portfolio."
                confirmText="Save Settings"
            />
            <CardHeader>
                <CardTitle>Website Configuration</CardTitle>
                <CardDescription>
                    Update the global content of your portfolio website. Changes reflect instantly.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
                    {/* Branding Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold flex items-center gap-2 border-b pb-2">
                            <Globe className="w-5 h-5 text-primary" /> Branding & Identity
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="siteName">Site Name (Logo Text)</Label>
                                <Input id="siteName" {...register("siteName")} placeholder="e.g. FAKHR." />
                                {errors.siteName && <p className="text-xs text-destructive">{errors.siteName.message as string}</p>}
                            </div>
                            <div className="space-y-4">
                                <Label className="flex items-center gap-1">
                                    Site Logo <span className="text-destructive">*</span>
                                </Label>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-muted border-2 border-dashed flex items-center justify-center overflow-hidden">
                                        {siteLogo ? <img src={siteLogo} className="w-full h-full object-contain" /> : <ImageIcon className="w-6 h-6 text-muted-foreground/40" />}
                                    </div>
                                    {siteLogo && (
                                        <Button type="button" variant="ghost" size="sm" onClick={() => setValue("siteLogo", "")}>
                                            Clear
                                        </Button>
                                    )}
                                </div>
                                <FileUploader
                                    folder="settings"
                                    onUploadSuccess={(url) => setValue("siteLogo", url)}
                                    label="Upload Logo"
                                    accept="image/*"
                                />
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground">Or paste logo URL directly</Label>
                                    <Input
                                        placeholder="https://example.com/logo.png"
                                        value={siteLogo || ""}
                                        onChange={(e) => setValue("siteLogo", e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Point 2: Navbar Customization */}
                        <div className="space-y-4 pt-4 border-t">
                            <h4 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                                <Palette className="w-4 h-4" /> Navigation Bar Style
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label>Background Color</Label>
                                    <div className="flex gap-2">
                                        <input
                                            type="color"
                                            value={watch("navBgColor") || "#000000"}
                                            onChange={(e) => setValue("navBgColor", e.target.value)}
                                            className="w-12 h-10 p-1 rounded-md border border-input cursor-pointer"
                                        />
                                        <Input
                                            placeholder="#HEX"
                                            className="flex-1 font-mono uppercase"
                                            value={watch("navBgColor") || ""}
                                            onChange={(e) => setValue("navBgColor", e.target.value)}
                                        />
                                        {watch("navBgColor") && (
                                            <Button type="button" variant="ghost" size="sm" onClick={() => setValue("navBgColor", "")}>
                                                ✕
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Text Color</Label>
                                    <div className="flex gap-2">
                                        <input
                                            type="color"
                                            value={watch("navTextColor") || "#ffffff"}
                                            onChange={(e) => setValue("navTextColor", e.target.value)}
                                            className="w-12 h-10 p-1 rounded-md border border-input cursor-pointer"
                                        />
                                        <Input
                                            placeholder="#HEX"
                                            className="flex-1 font-mono uppercase"
                                            value={watch("navTextColor") || ""}
                                            onChange={(e) => setValue("navTextColor", e.target.value)}
                                        />
                                        {watch("navTextColor") && (
                                            <Button type="button" variant="ghost" size="sm" onClick={() => setValue("navTextColor", "")}>
                                                ✕
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Style</Label>
                                    <select
                                        value={watch("navStyle") || "solid"}
                                        onChange={(e) => setValue("navStyle", e.target.value as "solid" | "glass")}
                                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    >
                                        <option value="solid">Solid Background</option>
                                        <option value="glass">Glass (Blurry Translucent)</option>
                                    </select>
                                </div>
                            </div>
                            {/* Live Preview */}
                            <div className="mt-2 rounded-xl overflow-hidden border">
                                <div
                                    className={`h-14 flex items-center justify-between px-6 ${watch("navStyle") === 'glass' ? 'backdrop-blur-xl' : ''}`}
                                    style={{
                                        backgroundColor: watch("navStyle") === 'glass'
                                            ? `${watch("navBgColor") || '#000000'}cc`
                                            : (watch("navBgColor") || '#000000'),
                                        color: watch("navTextColor") || '#ffffff',
                                    }}
                                >
                                    <span className="text-sm font-bold">Preview</span>
                                    <div className="flex gap-4 text-xs font-medium opacity-70">
                                        <span>Home</span>
                                        <span>Projects</span>
                                        <span>Contact</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SEO Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold flex items-center gap-2 border-b pb-2">
                            <Search className="w-5 h-5 text-primary" /> Search Engine Optimization (SEO)
                        </h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="metaDescription">Meta Description</Label>
                                <Textarea
                                    id="metaDescription"
                                    {...register("metaDescription")}
                                    placeholder="Brief description of your site for search results..."
                                    className="min-h-[80px]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="keywords">Keywords</Label>
                                <Input id="keywords" {...register("keywords")} placeholder="frontend, developer, react, portfolio..." />
                            </div>
                        </div>
                    </div>

                    {/* Social Links Section */}
                    <div className="space-y-6">
                        <div className="flex justify-between items-center border-b pb-2">
                            <div>
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <Globe className="w-5 h-5 text-primary" /> Social Media Connectivity
                                </h3>
                                <p className="text-sm text-muted-foreground">Add your profiles or custom links.</p>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="rounded-full gap-2"
                                onClick={() => append({ name: "New Link", url: "", style: "filled" })}
                            >
                                <Plus className="w-4 h-4" /> Add Link
                            </Button>
                        </div>

                        {/* Quick Add */}
                        <div className="flex flex-wrap gap-2">
                            {PREDEFINED_SOCIALS.map(social => (
                                <Button
                                    key={social.icon}
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 rounded-full border border-dashed hover:border-primary gap-2"
                                    onClick={() => append({ name: social.name, url: "", icon: social.icon, style: "filled", color: social.color })}
                                >
                                    <AdminSocialIcon icon={social.icon} color={social.color} className="w-3 h-3" />
                                    {social.name}
                                </Button>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {fields.map((field, index) => (
                                <div key={field.id} className="p-4 bg-muted/30 rounded-2xl border space-y-4 relative group/link">
                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="absolute top-2 right-2 text-destructive opacity-0 group-hover/link:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>

                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col gap-2">
                                            <Label className="text-[10px] uppercase font-bold text-muted-foreground">Logo / Icon</Label>
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-xl bg-card border flex items-center justify-center overflow-hidden">
                                                    <AdminSocialIcon icon={watch(`socialLinks.${index}.icon`)} color={watch(`socialLinks.${index}.color`)} className="w-6 h-6" />
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <FileUploader
                                                        folder="social"
                                                        onUploadSuccess={(url) => setValue(`socialLinks.${index}.icon`, url)}
                                                        label="Upload"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-[10px] uppercase font-bold text-muted-foreground">Pick Standard Icon</Label>
                                            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-9 gap-1.5 p-2 bg-muted/30 rounded-xl border border-dashed">
                                                {PREDEFINED_SOCIALS.map(s => (
                                                    <button
                                                        key={s.icon}
                                                        type="button"
                                                        className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${watch(`socialLinks.${index}.icon`) === s.icon ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-card bg-card hover:border-primary/50'}`}
                                                        onClick={() => setValue(`socialLinks.${index}.icon`, s.icon)}
                                                        title={s.name}
                                                    >
                                                        <AdminSocialIcon icon={s.icon} color={watch(`socialLinks.${index}.color`) || s.color} className="w-4 h-4" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Color Customization */}
                                    <div className="space-y-3 pt-4 border-t">
                                        <Label className="text-[10px] uppercase font-bold text-muted-foreground flex items-center justify-between">
                                            Custom Coloring
                                            {watch(`socialLinks.${index}.color`) && (
                                                <button
                                                    type="button"
                                                    className="text-[9px] text-destructive hover:underline"
                                                    onClick={() => setValue(`socialLinks.${index}.color`, "")}
                                                >
                                                    Reset to Default
                                                </button>
                                            )}
                                        </Label>

                                        <div className="flex items-center gap-3">
                                            <div className="relative group/picker">
                                                <input
                                                    type="color"
                                                    ref={el => { colorPickerRefs.current[index] = el; }}
                                                    className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0 bg-transparent absolute inset-0 opacity-0 z-10"
                                                    value={watch(`socialLinks.${index}.color`) || "#000000"}
                                                    onChange={(e) => setValue(`socialLinks.${index}.color`, e.target.value)}
                                                />
                                                <div className="w-10 h-10 rounded-lg border shadow-inner transition-all group-hover/picker:ring-2 ring-primary" style={{ backgroundColor: watch(`socialLinks.${index}.color`) || "#000000" }} />
                                            </div>

                                            <div className="flex-1 space-y-1">
                                                <Input
                                                    {...register(`socialLinks.${index}.color` as const)}
                                                    placeholder="#HEX Code"
                                                    className="h-8 text-xs font-mono uppercase"
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        if (val.startsWith('#') || val === "") {
                                                            setValue(`socialLinks.${index}.color`, val);
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-1.5 items-center">
                                            {/* Deduplicated platform colors */}
                                            {Array.from(new Map(PREDEFINED_SOCIALS.map(s => [s.color, s])).values()).map(social => (
                                                <button
                                                    key={social.color}
                                                    type="button"
                                                    className={`w-5 h-5 rounded-full border border-white/20 shadow-sm transition-transform hover:scale-125 ${watch(`socialLinks.${index}.color`) === social.color ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                                                    style={{ backgroundColor: social.color }}
                                                    onClick={() => setValue(`socialLinks.${index}.color`, social.color)}
                                                    title={social.color === "#000000" ? "Black" : social.name}
                                                />
                                            ))}
                                            {/* Ensure White is always available */}
                                            <button
                                                type="button"
                                                className={`w-5 h-5 rounded-full border border-card shadow-sm transition-transform hover:scale-125 ${watch(`socialLinks.${index}.color`) === "#ffffff" ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                                                style={{ backgroundColor: "#ffffff" }}
                                                onClick={() => setValue(`socialLinks.${index}.color`, "#ffffff")}
                                                title="White"
                                            />
                                            <button
                                                type="button"
                                                className="w-5 h-5 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center hover:bg-muted transition-colors group/add"
                                                onClick={() => colorPickerRefs.current[index]?.click()}
                                                title="Add Custom Color"
                                            >
                                                <Plus className="w-2.5 h-2.5 text-muted-foreground group-hover/add:text-primary" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <Label className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                                                Platform Name <span className="text-destructive">*</span>
                                            </Label>
                                            <Input {...register(`socialLinks.${index}.name` as const)} placeholder="e.g. GitHub" className="h-9" />
                                            {errors.socialLinks?.[index]?.name && <p className="text-[10px] text-destructive">{errors.socialLinks[index]?.name?.message}</p>}
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                                                Profile URL <span className="text-destructive">*</span>
                                            </Label>
                                            <Input {...register(`socialLinks.${index}.url` as const)} placeholder="https://..." className="h-9" />
                                            {errors.socialLinks?.[index]?.url && <p className="text-[10px] text-destructive">{errors.socialLinks[index]?.url?.message}</p>}
                                        </div>
                                    </div>

                                    {/* Style Selector */}
                                    <div className="space-y-2 pt-2 border-t">
                                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Icon Style</Label>
                                        <div className="flex gap-2">
                                            {(['filled', 'outline', 'colored'] as const).map((style) => (
                                                <Button
                                                    key={style}
                                                    type="button"
                                                    variant={watch(`socialLinks.${index}.style`) === style ? "default" : "outline"}
                                                    size="sm"
                                                    className="h-7 text-[10px] px-3 capitalize rounded-full"
                                                    onClick={() => setValue(`socialLinks.${index}.style`, style)}
                                                >
                                                    {style}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold flex items-center gap-2 border-b pb-2">
                            <Mail className="w-5 h-5 text-primary" /> Contact & Footer
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="siteTitle">Browser Tab Title (SEO)</Label>
                                <Input id="siteTitle" {...register("siteTitle")} placeholder="e.g. FAKHR. | Portfolio" />
                                <p className="text-[10px] text-muted-foreground">This name appears on the browser tab.</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contactEmail" className="flex items-center gap-1">
                                    Contact Email <span className="text-destructive">*</span>
                                </Label>
                                <Input id="contactEmail" {...register("contactEmail")} placeholder="hello@example.com" />
                                {errors.contactEmail && <p className="text-xs text-destructive">{errors.contactEmail.message}</p>}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input id="location" {...register("location")} placeholder="e.g. Remote / New York" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="footerText" className="flex items-center gap-1">
                                Footer Copyright/Credit <span className="text-destructive">*</span>
                            </Label>
                            <Input id="footerText" {...register("footerText")} />
                            {errors.footerText && <p className="text-xs text-destructive">{errors.footerText.message}</p>}
                        </div>
                    </div>


                    <div className="pt-4">
                        <Button type="submit" className="w-full sm:w-auto" disabled={loading}>
                            {loading ? "Saving Settings..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
