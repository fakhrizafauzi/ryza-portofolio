import { Timestamp } from "firebase/firestore";

export interface BaseDoc {
    id: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    order: number;
    isPublished: boolean;
}

export interface Project extends BaseDoc {
    title: string;
    description: string;
    content?: string; // Long-form case study
    embedUrl?: string; // YouTube, Figma, etc.
    embedScript?: string; // Raw HTML/Script embed
    role?: string;     // e.g. Lead Developer
    category?: string; // e.g. E-commerce
    portfolioImages: string[];
    documents?: { name: string, url: string }[]; // Research papers, PDFs, etc.
    tags: string[];
    github?: string;
    link?: string;
    customLabels?: {
        backText?: string;
        roleLabel?: string;
        techLabel?: string;
        linksLabel?: string;
        galleryTitle?: string;
        gallerySubtitle?: string;
        demoTitle?: string;
        interactiveTitle?: string;
        aboutTitle?: string;
        dateLabel?: string;
        resourcesTitle?: string;
        githubButton?: string;
        demoButton?: string;
        nextProjectLabel?: string;
    };

    // Premium Case Study Sections
    stats?: { value: string, label: string }[];
    challengeTitle?: string;
    challengeContent?: string;
    solutionTitle?: string;
    solutionContent?: string;
    teamMembers?: { name: string, role: string, avatar?: string, url?: string }[];
    milestones?: { date: string, label: string, description?: string }[];
    designTokens?: {
        colors?: { name: string, hex: string }[];
        fonts?: { name: string, family: string }[];
    };
    testimonials?: { quote: string, author: string, role?: string, avatar?: string }[];

    // Feature Visibility Toggles
    visibility?: {
        showStats?: boolean;
        showChallengeSolution?: boolean;
        showTeam?: boolean;
        showMilestones?: boolean;
        showDesignTokens?: boolean;
        showTestimonials?: boolean;
    };

    // Layout Flexibility
    status?: 'Finished' | 'In Development' | 'Blueprint' | 'Maintained' | 'Archived';
    sectionOrder?: string[]; // IDs of sections to render in order
}

export interface Skill extends BaseDoc {
    title: string;
    description?: string;
    category: string;
    icon?: string; // URL or Storage path
}

export interface Experience extends BaseDoc {
    company: string;
    position: string;
    location?: string;
    duration: string;
    description: string;
}

export type SectionType = 'hero' | 'projects' | 'skills' | 'experience' | 'services' | 'contact' | 'custom' | 'pricing' | 'testimonials' | 'faq' | 'team' | 'stats' | 'gallery' | 'cta';

export interface PageSection extends BaseDoc {
    type: SectionType;
    title: string;
    subtitle?: string;
    navTitle?: string; // Label for navigation bar
    inNav?: boolean;   // Whether to show in navigation bar
    icon?: string; // Lucide icon name or URL
    templateId: string; // e.g. 'grid', 'list', 'split'
    options?: any; // Template-specific configuration
}

export interface SiteSettings {
    id: string;
    siteName: string;
    siteTitle?: string;
    siteLogo?: string;
    favicon?: string;

    // SEO
    metaDescription?: string;
    keywords?: string;

    // Contact & Social
    contactEmail: string;
    phone?: string;
    location?: string;
    socialLinks?: {
        name: string;
        url: string;
        icon?: string;
        style?: 'filled' | 'outline' | 'colored';
        color?: string;
    }[];

    footerText: string;
    updatedAt: Timestamp;

    // Navbar Customization
    navBgColor?: string;
    navTextColor?: string;
    navStyle?: 'solid' | 'glass';

    // Legacy (may be used as fallback)
    heroTitle?: string;
    heroSubtitle?: string;

    // Project Detail Labels
    projectLabels?: {
        backText?: string;
        roleLabel?: string;
        techLabel?: string;
        linksLabel?: string;
        galleryTitle?: string;
        gallerySubtitle?: string;
    };
}
