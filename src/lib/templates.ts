import { type SectionType } from "@/types";

export interface SectionTemplate {
    id: string;
    name: string;
    description: string;
    type: SectionType;
}

export const SECTION_TEMPLATES: SectionTemplate[] = [
    // Hero Templates (4)
    { id: 'hero-modern', name: 'Modern Hero', description: 'Big typography with centered subtitle.', type: 'hero' },
    { id: 'hero-split', name: 'Split Hero', description: 'Side-by-side text and image.', type: 'hero' },
    { id: 'hero-visual', name: 'Visual Hero', description: 'Full-screen background image with overlay.', type: 'hero' },
    { id: 'hero-minimal', name: 'Minimal Hero', description: 'Clean, whitespace-focused typography.', type: 'hero' },

    // Project Templates (4)
    { id: 'projects-grid', name: 'Standard Project Grid', description: 'Responsive 2-column project cards.', type: 'projects' },
    { id: 'projects-featured', name: 'Featured Project List', description: 'Large images with detailed summaries.', type: 'projects' },
    { id: 'projects-masonry', name: 'Masonry Portfolio', description: 'Dynamic grid with varying card sizes.', type: 'projects' },
    { id: 'projects-bento', name: 'Bento Grid', description: 'Modern asymmetrical card layout.', type: 'projects' },

    // Skill Templates (3)
    { id: 'skills-category', name: 'Categorized Skill Cards', description: 'Skills grouped by domain.', type: 'skills' },
    { id: 'skills-minimal', name: 'Minimal Skill Tags', description: 'Clean layout of small tag cards.', type: 'skills' },
    { id: 'skills-showcase', name: 'Visual Skill Icons', description: 'Large, colored icons with descriptions.', type: 'skills' },

    // Experience Templates (3)
    { id: 'experience-timeline', name: 'Chronological Timeline', description: 'Vertical journey with nodes.', type: 'experience' },
    { id: 'experience-grid', name: 'Experience Grid', description: 'Cards showing company and role.', type: 'experience' },
    { id: 'experience-compact', name: 'Compact List', description: 'Minimal list for extensive history.', type: 'experience' },

    // Services Templates (3)
    { id: 'services-modern', name: 'Service Overview', description: 'Highlighting expertise area.', type: 'services' },
    { id: 'services-list', name: 'Services List', description: 'Detailed list of offerings.', type: 'services' },
    { id: 'services-grid', name: 'Service Grid', description: 'Icon-based grid of specialties.', type: 'services' },

    // Contact & About Templates (3)
    { id: 'contact-standard', name: 'Contact Info', description: 'Social links and email.', type: 'contact' },
    { id: 'contact-card', name: 'Business Card', description: 'Focused, centered contact card.', type: 'contact' },
    { id: 'about-bold', name: 'Bold About', description: 'Large font intro with signature style.', type: 'custom' },

    // NEW Expansion Templates (10)
    { id: 'pricing-modern', name: 'Modern Pricing', description: 'Three-column pricing plan grid.', type: 'pricing' },
    { id: 'testimonials-slider', name: 'Review Slider', description: 'Interactive slider for client testimonials.', type: 'testimonials' },
    { id: 'faq-accordion', name: 'FAQ Accordion', description: 'Collapsible question and answer list.', type: 'faq' },
    { id: 'features-elegant', name: 'Elegant Features', description: 'Icon-centric feature grid with hover effects.', type: 'cta' },
    { id: 'gallery-masonry', name: 'Visual Gallery', description: 'Masonry grid for images/screenshots.', type: 'gallery' },
    { id: 'stats-grid', name: 'Data Highlights', description: 'Animated counters for key metrics.', type: 'stats' },
    { id: 'team-modern', name: 'Team Showcase', description: 'Professional profile grid for team members.', type: 'team' },
    { id: 'process-steps', name: 'Process Workflow', description: 'Step-by-step horizontal walkthrough.', type: 'custom' },
    { id: 'cta-banner', name: 'Action Banner', description: 'High-impact call-to-action strip.', type: 'cta' },
    { id: 'tech-stack', name: 'Tech Stack', description: 'Marquee or grid of technology logos.', type: 'custom' },
];
