import { db } from "./firebase";
import { collection, addDoc, serverTimestamp, getDocs, query, limit, doc, setDoc } from "firebase/firestore";

const SAMPLE_PROJECTS = [
    {
        title: "EcoTrack Dashboard",
        description: "A realtime environmental monitoring dashboard built with React and Firestore.",
        content: "## The Challenge\r\nMonitoring environmental data in real-time requires high-throughput data processing and a responsive UI. The main goal was to allow environmental scientists to track air quality and water levels across 50+ sensors with sub-second latency.\r\n\r\n## The Solution\r\nWe utilized Firebase Cloud Firestore's real-time listeners for data syncing and used Tailwind CSS to build a high-performance, mobile-first dashboard. The architecture follows a modular approach for easy scaling.\r\n\r\n## Key Features\r\n- Real-time data visualization using Recharts\r\n- Automated alerting system for sensor spikes\r\n- Historic data export (CSV/JSON)",
        role: "Lead Fullstack Developer",
        category: "Environmental Tech",
        embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Sample placeholder
        order: 1,
        portfolioImages: ["https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop"],
        isPublished: true,
        tags: ["React", "Firebase", "Tailwind"],
        github: "https://github.com",
        link: "https://example.com"
    },
    {
        title: "Luxe E-Commerce",
        description: "Premium shopping experience with glassmorphism UI and optimized performance.",
        content: "## Overview\r\nA high-end e-commerce platform designed for luxury brands. The project focused on a 'premium feel' through the use of glassmorphism UI/UX principles and smooth interactive transitions.\r\n\r\n## Tech Stack\r\n- **Next.js** for SSR and SEO optimization\r\n- **Stripe** for secure, low-friction checkout\r\n- **Framer Motion** for elegant animations\r\n\r\n## Outcomes\r\nThe platform saw a 40% increase in user retention and a significant improvement in Lighthouse scores compared to the legacy system.",
        role: "UI/UX & Frontend Lead",
        category: "E-Commerce",
        order: 2,
        portfolioImages: ["https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=2340&auto=format&fit=crop"],
        isPublished: true,
        tags: ["Next.js", "Stripe", "Shadcn"],
        github: "https://github.com",
        link: "https://example.com"
    }
];

const SAMPLE_SKILLS = [
    { title: "React", description: "Frontend Library", order: 1, category: "Frontend", isPublished: true },
    { title: "TypeScript", description: "Type Safety", order: 2, category: "Language", isPublished: true },
    { title: "Firebase", description: "BaaS", order: 3, category: "Backend", isPublished: true },
    { title: "Tailwind CSS", description: "Styling Framework", order: 4, category: "Design", isPublished: true },
];

const SAMPLE_EXPERIENCE = [
    {
        company: "Tech Solutions Inc.",
        position: "Senior Frontend Engineer",
        duration: "2022 - Present",
        description: "Leading the UI team and implementing modern web standards.",
        order: 1,
        isPublished: true
    },
    {
        company: "Creative Agency",
        position: "Web Developer",
        duration: "2020 - 2022",
        description: "Built high-performance websites for international clients.",
        order: 2,
        isPublished: true
    }
];

const SAMPLE_SECTIONS = [
    {
        type: "hero",
        title: "Building digital experiences that matter.",
        subtitle: "I'm a frontend engineer focused on creating high-performance, accessible, and beautiful web applications.",
        templateId: "hero-split",
        order: 0,
        isPublished: true,
        options: {
            image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2344&auto=format&fit=crop",
            style: "accent"
        }
    },
    {
        type: "projects",
        title: "Featured Projects",
        templateId: "projects-featured",
        order: 1,
        isPublished: true,
        options: {
            limit: "3",
            style: "muted"
        }
    },
    {
        type: "skills",
        title: "Technical Expertise",
        templateId: "skills-category",
        order: 2,
        isPublished: true,
        options: {
            style: "glass"
        }
    },
    {
        type: "experience",
        title: "Professional Journey",
        templateId: "experience-timeline",
        order: 3,
        isPublished: true
    },
];

const DEFAULT_SETTINGS = {
    siteName: "FAKHR.",
    siteLogo: "https://raw.githubusercontent.com/lucide-react/lucide/main/icons/globe.svg",
    metaDescription: "Professional Portfolio of Fakhr - Fullstack Engineer & Designer.",
    keywords: "portfolio, react, developer, designer, firebase",
    contactEmail: "hello@example.com",
    phone: "+1 (555) 000-0000",
    location: "Remote / Digital",
    socialLinks: {
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com",
    },
    footerText: `© ${new Date().getFullYear()} Fakhr. Built with React and Firebase.`,
};

export async function seedDatabase() {
    try {
        console.log("Seeding started...");
        let seededAny = false;

        // Helper to seed if empty
        const seedIfEmpty = async (collectionName: string, items: any[]) => {
            const ref = collection(db, collectionName);
            const snapshot = await getDocs(query(ref, limit(1)));

            if (snapshot.empty) {
                console.log(`Seeding ${collectionName}...`);
                for (const item of items) {
                    await addDoc(ref, {
                        ...item,
                        createdAt: serverTimestamp(),
                        updatedAt: serverTimestamp(),
                    });
                }
                return true;
            }
            return false;
        };

        if (await seedIfEmpty("projects", SAMPLE_PROJECTS)) seededAny = true;
        if (await seedIfEmpty("skills", SAMPLE_SKILLS)) seededAny = true;
        if (await seedIfEmpty("experiences", SAMPLE_EXPERIENCE)) seededAny = true;
        if (await seedIfEmpty("sections", SAMPLE_SECTIONS)) seededAny = true;

        // Seed settings (always update or set if not existing)
        const settingsRef = doc(db, "settings", "global");
        const settingsSnap = await getDocs(query(collection(db, "settings"), limit(1)));
        if (settingsSnap.empty) {
            await setDoc(settingsRef, {
                ...DEFAULT_SETTINGS,
                updatedAt: serverTimestamp(),
            });
            seededAny = true;
        }

        if (seededAny) {
            return { success: true, message: "New data has been seeded! Refresh to see changes." };
        } else {
            return { success: false, message: "Database already has data. Nothing new to seed." };
        }
    } catch (error) {
        console.error("Error seeding database:", error);
        throw error;
    }
}
