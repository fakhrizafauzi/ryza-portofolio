import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import { useFirestoreCollection } from '@/hooks/useFirestoreCollection'
import { useFirestoreDocument } from '@/hooks/useFirestoreDocument'
import { seedDatabase } from '@/lib/seed'
import { type Project, type SiteSettings } from '@/types'
import { useAuth } from '@/context/AuthContext'
import AuthGuard from '@/components/AuthGuard'
import { projectService } from '@/services/projectService'
import { settingsService } from '@/services/settingsService'
import { ProjectForm } from '@/components/admin/ProjectForm'
import { SettingsForm } from '@/components/admin/SettingsForm'
import { SkillForm } from '@/components/admin/SkillForm'
import { ExperienceForm } from '@/components/admin/ExperienceForm'
import { skillService } from '@/services/skillService'
import { experienceService } from '@/services/experienceService'
import { type Skill, type Experience, type PageSection } from '@/types'
import { LayoutForm } from '@/components/admin/LayoutForm'
import { ToasterProvider } from '@/components/ToasterProvider'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { LandingPageSkeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import {
  Zap,
  Mail,
  LayoutGrid,
  Database,
  LogOut,
  Plus,
  Trash2,
  Pencil,
  Briefcase,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Github,
  Chrome,
  MessageSquare,
  Globe,
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
  GitBranch,
  CreditCard,
  Users,
  HelpCircle,
  Trophy,
  Star,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Award,
  Layers,
  Heart,
  Menu,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { ProjectPage } from '@/pages/ProjectPage'

// Helper to handle legacy social links structure
const normalizeSocialLinks = (links: any) => {
  if (Array.isArray(links)) return links;
  if (links && typeof links === 'object') {
    return Object.entries(links)
      .filter(([_, url]) => !!url)
      .map(([name, url]) => ({ name, url: url as string }));
  }
  return [];
};

const SocialIcon = ({
  icon,
  className = "w-5 h-5",
  style = 'filled',
  name,
  color
}: {
  icon?: string,
  className?: string,
  style?: 'filled' | 'outline' | 'colored',
  name?: string,
  color?: string
}) => {
  const baseIcon = !icon || icon === 'globe' ? 'globe' : icon.toLowerCase();

  // Custom uploaded image
  if (icon && icon.startsWith('http')) {
    const customStyle = color ? {
      backgroundColor: style === 'filled' ? color : 'transparent',
      borderColor: style === 'outline' ? color : 'transparent',
      color: style === 'outline' ? color : 'inherit'
    } : {};

    return (
      <div
        className={`flex items-center justify-center p-2 rounded-xl border transition-all ${style === 'outline' ? 'bg-transparent border-primary/20' :
          style === 'colored' ? 'bg-secondary/50 border-secondary' :
            'bg-secondary border-transparent'
          }`}
        style={customStyle}
      >
        <img src={icon} className={`${className} object-contain`} alt={name || "social icon"} />
      </div>
    );
  }

  const icons: Record<string, any> = {
    github: { component: Github, color: "text-zinc-900", bg: "bg-zinc-900" },
    linkedin: { component: Linkedin, color: "text-blue-700", bg: "bg-blue-700" },
    twitter: { component: Twitter, color: "text-sky-500", bg: "bg-sky-500" },
    instagram: { component: Instagram, color: "text-pink-600", bg: "bg-pink-600" },
    youtube: { component: Youtube, color: "text-red-600", bg: "bg-red-600" },
    facebook: { component: Facebook, color: "text-blue-600", bg: "bg-blue-600" },
    discord: { component: MessageSquare, color: "text-indigo-500", bg: "bg-indigo-500" },
    tiktok: { component: Chrome, color: "text-black", bg: "bg-black" },
    globe: { component: Globe, color: "text-emerald-500", bg: "bg-emerald-500" },
    mail: { component: Mail, color: "text-slate-500", bg: "bg-slate-500" },
    twitch: { component: Twitch, color: "text-[#9146ff]", bg: "bg-[#9146ff]" },
    slack: { component: Slack, color: "text-[#4a154b]", bg: "bg-[#4a154b]" },
    reddit: { component: MessageCircle, color: "text-[#ff4500]", bg: "bg-[#ff4500]" },
    figma: { component: Figma, color: "text-[#f24e1e]", bg: "bg-[#f24e1e]" },
    dribbble: { component: Dribbble, color: "text-[#ea4c89]", bg: "bg-[#ea4c89]" },
    behance: { component: Palette, color: "text-[#1769ff]", bg: "bg-[#1769ff]" },
    medium: { component: FileText, color: "text-black", bg: "bg-black" },
    spotify: { component: Music, color: "text-[#1db954]", bg: "bg-[#1db954]" },
    whatsapp: { component: MessageCircle, color: "text-[#25d366]", bg: "bg-[#25d366]" },
    telegram: { component: Send, color: "text-[#0088cc]", bg: "bg-[#0088cc]" },
    snapchat: { component: Ghost, color: "text-[#fffc00]", bg: "bg-[#fffc00]" },
    pinterest: { component: Pin, color: "text-[#bd081c]", bg: "bg-[#bd081c]" },
    rss: { component: Rss, color: "text-[#ee802f]", bg: "bg-[#ee802f]" },
    apple: { component: Apple, color: "text-black", bg: "bg-black" },
    play: { component: Play, color: "text-[#607d8b]", bg: "bg-[#607d8b]" },
    gitlab: { component: Gitlab, color: "text-[#fc6d26]", bg: "bg-[#fc6d26]" },
    bitbucket: { component: GitBranch, color: "text-[#0052cc]", bg: "bg-[#0052cc]" },
    codepen: { component: Codepen, color: "text-black", bg: "bg-black" },
    codesandbox: { component: Codesandbox, color: "text-black", bg: "bg-black" },
    trello: { component: Trello, color: "text-[#0052cc]", bg: "bg-[#0052cc]" },
  };

  const iconData = icons[baseIcon] || icons.globe;
  const IconComponent = iconData.component;
  const activeColor = color || iconData.color;
  const activeBg = color || iconData.bg;

  if (style === 'colored') {
    return (
      <div
        className={`p-2 rounded-xl transition-all hover:scale-110 flex items-center justify-center text-white shadow-lg shadow-black/5`}
        style={{ backgroundColor: activeBg.startsWith('#') ? activeBg : undefined }}
      >
        <IconComponent className={className} />
      </div>
    );
  }

  if (style === 'outline') {
    return (
      <div
        className={`p-2 rounded-xl transition-all hover:scale-110 hover:border-primary border-2 flex items-center justify-center border-secondary`}
        style={{ borderColor: activeColor.startsWith('#') ? activeColor : undefined, color: activeColor.startsWith('#') ? activeColor : undefined }}
      >
        <IconComponent className={className} />
      </div>
    );
  }

  // Default: Filled
  return (
    <div
      className={`p-2 rounded-xl transition-all hover:scale-110 flex items-center justify-center bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground`}
      style={{ backgroundColor: style === 'filled' && color ? color : undefined }}
    >
      <IconComponent className={className} />
    </div>
  );
};

// Public Landing Page Component
function LandingPage({ projects, skills, experiences, sections, settings, loading }: any) {
  const s = settings || {
    siteName: "FAKHR.",
    heroTitle: "Building digital experiences that matter.",
    heroSubtitle: "I'm a frontend engineer focused on creating high-performance, accessible, and beautiful web applications using React, TypeScript, and Firebase.",
    footerText: `© ${new Date().getFullYear()} Fakhr. Built with React and Firebase.`
  };

  const { hash } = useLocation();

  // Handle hash scroll on mount or hash change
  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [hash]);

  const renderSection = (section: PageSection) => {
    const sectionStyle = section.options?.style === 'muted' ? 'bg-secondary/20' :
      section.options?.style === 'accent' ? 'bg-primary/5' :
        section.options?.style === 'glass' ? 'bg-background/20 backdrop-blur-md border border-white/10' :
          section.options?.style === 'custom' ? '' : ''; // Custom preset clears defaults

    const sectionId = section.navTitle ? section.navTitle.toLowerCase().replace(/\s+/g, '-') : section.id;

    // Dynamic Color Overrides
    const dynamicStyles = {
      backgroundColor: section.options?.bgColor,
      color: section.options?.textColor,
      '--accent': section.options?.accentColor || 'var(--primary)',
    } as any;

    const accentColor = section.options?.accentColor || 'currentColor';

    // 1. Data Filtering
    let filteredProjects = projects;
    if (section.type === 'projects') {
      if (section.options?.mode === 'manual' && section.options?.selectedIds) {
        filteredProjects = (projects || []).filter((p: Project) => (section.options.selectedIds || []).includes(p.id));
      } else if (section.options?.limit && section.options.limit !== 'all') {
        filteredProjects = (projects || []).slice(0, parseInt(section.options.limit));
      }
    }

    let filteredSkills = skills;
    if (section.type === 'skills') {
      if (section.options?.limit && section.options.limit !== 'all') {
        filteredSkills = (skills || []).slice(0, parseInt(section.options.limit));
      }
    }

    let filteredExperience = experiences;
    if (section.type === 'experience') {
      if (section.options?.limit && section.options.limit !== 'all') {
        filteredExperience = (experiences || []).slice(0, parseInt(section.options.limit));
      }
    }

    // 2. Alignment Logic
    const alignClass = section.options?.align === 'center' ? 'text-center mx-auto items-center' :
      section.options?.align === 'right' ? 'text-right ml-auto items-end' : 'text-left items-start';

    switch (section.type) {
      case 'hero':

        if (section.templateId === 'hero-split') {
          return (
            <section id={sectionId} key={section.id} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20 rounded-[3rem] px-8 md:px-16 ${sectionStyle}`} style={dynamicStyles}>
              <div className={`space-y-8 flex flex-col ${alignClass}`}>
                <h2 className={`text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[0.9] ${section.options?.align === 'center' ? 'text-center' : section.options?.align === 'right' ? 'text-right' : 'text-left'}`}>{section.title}</h2>
                <p className={`text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl ${section.options?.align === 'center' ? 'text-center mx-auto' : section.options?.align === 'right' ? 'text-right ml-auto' : 'text-left'}`}>{section.subtitle}</p>
              </div>
              <div className="relative aspect-square md:aspect-video rounded-[2.5rem] overflow-hidden border-8 border-background shadow-2xl bg-muted group">
                {section.options?.image ? (
                  <img src={section.options.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary/20"><LayoutGrid className="w-20 h-20" /></div>
                )}
              </div>
            </section>
          );
        }

        if (section.templateId === 'hero-visual') {
          return (
            <section id={sectionId} key={section.id} className="relative min-h-[80vh] flex items-center justify-center rounded-[3rem] overflow-hidden group" style={dynamicStyles}>
              {section.options?.image ? (
                <img src={section.options.image} className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 bg-primary/10" />
              )}
              <div className={`absolute inset-0 bg-black/60 backdrop-blur-[2px]`} />
              <div className={`relative z-10 p-8 max-w-4xl flex flex-col ${alignClass} text-white space-y-6`}>
                <h2 className={`text-5xl md:text-8xl font-black tracking-tighter leading-none animate-in fade-in zoom-in duration-1000 ${section.options?.align === 'center' ? 'text-center' : section.options?.align === 'right' ? 'text-right' : 'text-left'}`}>
                  {section.title}
                </h2>
                <p className={`text-xl md:text-2xl text-white/80 leading-relaxed max-w-2xl ${section.options?.align === 'center' ? 'mx-auto text-center' : section.options?.align === 'right' ? 'ml-auto text-right' : 'text-left'}`}>
                  {section.subtitle}
                </p>
              </div>
            </section>
          );
        }

        if (section.templateId === 'hero-minimal') {
          return (
            <section id={sectionId} key={section.id} className={`py-24 px-8 flex flex-col items-center justify-center space-y-12 ${sectionStyle}`} style={dynamicStyles}>
              <h2 className="text-4xl md:text-6xl font-light tracking-tight text-center max-w-4xl leading-tight">
                {section.title}
              </h2>
              <div className="h-px w-32 bg-primary/50" />
              <p className="text-lg text-muted-foreground tracking-widest uppercase font-medium">
                {section.subtitle}
              </p>
            </section>
          );
        }
        return (
          <section id={sectionId} key={section.id} className={`space-y-8 py-16 px-8 rounded-[3rem] ${sectionStyle} ${alignClass} max-w-6xl mx-auto`} style={dynamicStyles}>
            <h2 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.85] animate-in fade-in slide-in-from-bottom-4 duration-1000">
              {section.title}
            </h2>
            <p className={`text-xl md:text-3xl text-muted-foreground leading-relaxed max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-1000 ${section.options?.align === 'center' ? 'mx-auto' : ''}`}>
              {section.subtitle}
            </p>
          </section>
        );

      case 'custom':
        if (section.templateId === 'about-bold') {
          return (
            <section id={sectionId} key={section.id} className={`py-20 px-8 rounded-[3rem] ${sectionStyle} text-center space-y-12`} style={dynamicStyles}>
              <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-tight max-w-5xl mx-auto">
                {section.title}
              </h2>
              <div className="h-1 w-24 bg-primary mx-auto rounded-full" />
              <p className="text-2xl md:text-4xl text-muted-foreground italic font-medium leading-relaxed max-w-4xl mx-auto">
                "{section.subtitle}"
              </p>
            </section>
          );
        }
        if (section.templateId === 'process-steps') {
          const steps = section.options?.steps || [
            { title: "Define", desc: "Setting goals and requirements." },
            { title: "Design", desc: "Creating visual and functional prototypes." },
            { title: "Develop", desc: "Building the solution with clean code." },
            { title: "Deploy", desc: "Launching to the global audience." }
          ];
          return (
            <section id={sectionId} key={section.id} className={`py-16 px-8 rounded-[3rem] ${sectionStyle} space-y-12`} style={dynamicStyles}>
              <div className="text-center space-y-4">
                <h3 className="text-4xl font-bold tracking-tight">{section.title}</h3>
                <p className="text-muted-foreground">{section.subtitle}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                {steps.map((step: any, i: number) => (
                  <div key={i} className="relative space-y-6 group">
                    <div className="w-16 h-16 rounded-3xl bg-primary text-primary-foreground flex items-center justify-center font-black text-2xl shadow-2xl shadow-primary/20 ring-4 ring-background">
                      {i + 1}
                    </div>
                    {i < steps.length - 1 && (
                      <div className="hidden lg:block absolute top-8 left-16 w-full h-0.5 bg-border -z-10" />
                    )}
                    <div className="space-y-2">
                      <h4 className="font-bold text-2xl tracking-tight">{step.title}</h4>
                      <p className="text-base text-muted-foreground leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        }
        if (section.templateId === 'tech-stack') {
          const tech = section.options?.tech || ["React", "TypeScript", "Next.js", "Tailwind", "Firebase", "Node.js", "PostgreSQL", "Docker"];
          return (
            <section id={sectionId} key={section.id} className={`py-12 rounded-[2.5rem] ${sectionStyle} overflow-hidden`} style={dynamicStyles}>
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold uppercase tracking-[0.3em] text-muted-foreground">{section.title}</h3>
              </div>
              <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
                {tech.map((t: string, i: number) => (
                  <span key={i} className="text-2xl md:text-4xl font-black tracking-tighter cursor-default">{t}</span>
                ))}
              </div>
            </section>
          );
        }
        return null;

      case 'projects':
        const isFeatured = section.templateId === 'projects-featured';
        const isBento = section.templateId === 'projects-bento';
        const isMasonry = section.templateId === 'projects-masonry';

        return (
          <section id={sectionId} key={section.id} className={`space-y-12 py-12 px-8 rounded-[3rem] ${sectionStyle}`} style={dynamicStyles}>
            <div className={`flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-8 ${alignClass}`}>
              <div className="space-y-2">
                <h3 className="text-4xl font-bold tracking-tight">{section.title}</h3>
                <p className="text-muted-foreground">{section.subtitle}</p>
              </div>
              <span className="text-xs font-black text-primary uppercase tracking-[0.2em] bg-primary/10 px-4 py-2 rounded-full" style={{ color: accentColor, backgroundColor: accentColor + '10' }}>
                {filteredProjects.length} selected works
              </span>
            </div>

            {filteredProjects.length === 0 ? (
              <div className="py-20 text-center border-4 border-dashed rounded-[3rem] text-muted-foreground">
                Building something amazing...
              </div>
            ) : section.options?.displayMode === 'slider' ? (
              <div className="flex overflow-x-auto gap-8 pb-8 no-scrollbar scroll-smooth">
                {filteredProjects.map((project: Project) => (
                  <Link
                    to={`/project/${project.id}`}
                    key={project.id}
                    className="min-w-[300px] md:min-w-[450px] flex-shrink-0 group block space-y-6"
                  >
                    <div className="relative aspect-video overflow-hidden rounded-[2.5rem] border-4 border-transparent hover:border-primary transition-all duration-700 bg-muted shadow-2xl" style={{ borderColor: accentColor }}>
                      {project.portfolioImages?.[0] ? (
                        <img src={project.portfolioImages[0]} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-1000" alt={project.title} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground font-bold">Concept Phase</div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-2xl font-bold tracking-tight group-hover:text-primary transition-colors">{project.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : isBento ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-8 h-auto lg:h-[900px]">
                {filteredProjects.slice(0, 4).map((project: Project, i: number) => (
                  <Link
                    to={`/project/${project.id}`}
                    key={project.id}
                    className={`group relative overflow-hidden rounded-[2.5rem] bg-muted border-4 border-transparent hover:border-primary transition-all duration-700 ${i === 0 ? 'md:col-span-2 md:row-span-2' :
                      i === 1 ? 'md:col-span-2' : ''
                      }`}
                  >
                    {project.portfolioImages?.[0] && <img src={project.portfolioImages[0]} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 flex flex-col justify-end">
                      <h4 className="text-2xl font-bold text-white group-hover:text-primary transition-colors">{project.title}</h4>
                      <p className="text-sm text-white/70 line-clamp-2">{project.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : isMasonry ? (
              <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                {filteredProjects.map((project: Project) => (
                  <Link
                    to={`/project/${project.id}`}
                    key={project.id}
                    className="break-inside-avoid group block bg-card rounded-[2rem] overflow-hidden border border-border/50 hover:border-primary shadow-sm hover:shadow-xl transition-all"
                    style={{ borderColor: accentColor }}
                  >
                    <div className="relative aspect-[4/5] overflow-hidden">
                      {project.portfolioImages?.[0] && <img src={project.portfolioImages[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                    </div>
                    <div className="p-6 space-y-2">
                      <h4 className="font-bold text-xl">{project.title}</h4>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {project.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="text-[10px] bg-secondary px-2 py-1 rounded-full">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className={isFeatured ? "space-y-24" : "grid grid-cols-1 md:grid-cols-2 gap-12"}>
                {filteredProjects.map((project: Project, i: number) => (
                  <Link
                    to={`/project/${project.id}`}
                    key={project.id}
                    className={`group block ${isFeatured ? 'grid grid-cols-1 lg:grid-cols-2 gap-12 items-center' : 'space-y-6'}`}
                  >
                    <div className={`${isFeatured && i % 2 === 1 ? 'lg:order-2' : ''} relative aspect-video overflow-hidden rounded-[2.5rem] border-4 border-transparent hover:border-primary transition-all duration-700 bg-muted shadow-2xl`} style={{ borderColor: accentColor }}>
                      {project.portfolioImages?.[0] ? (
                        <img src={project.portfolioImages[0]} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-1000" alt={project.title} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground font-bold">Concept Phase</div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                        <Button variant="secondary" size="sm" className="rounded-full">View Case Study</Button>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {project.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="text-[10px] uppercase font-black tracking-widest text-primary">{tag}</span>
                        ))}
                      </div>
                      <h4 className={`${isFeatured ? 'text-4xl md:text-6xl' : 'text-3xl'} font-bold tracking-tighter group-hover:text-primary transition-colors leading-none`}>{project.title}</h4>
                      <p className="text-lg text-muted-foreground leading-relaxed line-clamp-3">{project.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        );

      case 'skills':
        const isMinimal = section.templateId === 'skills-minimal';
        const isShowcase = section.templateId === 'skills-showcase';
        const isSliderS = section.options?.displayMode === 'slider';

        return (
          <section id={sectionId} key={section.id} className={`space-y-12 py-12 px-8 rounded-[3rem] ${sectionStyle}`} style={dynamicStyles}>
            <div className={`space-y-4 ${alignClass}`}>
              <h3 className="text-4xl font-bold tracking-tight">{section.title}</h3>
              <p className="text-muted-foreground">{section.subtitle}</p>
            </div>

            {isSliderS ? (
              <div className="flex overflow-x-auto gap-4 pb-8 no-scrollbar scroll-smooth">
                {(filteredSkills || []).map((skill: any) => (
                  <div key={skill.id} className="min-w-[200px] flex-shrink-0 p-6 bg-card border rounded-[2rem] hover:border-primary transition-all">
                    <div className="text-primary font-bold mb-2" style={{ color: accentColor }}>{skill.title}</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-widest">{skill.category}</div>
                  </div>
                ))}
              </div>
            ) : isMinimal ? (
              <div className={`flex flex-wrap gap-4 ${section.options?.align === 'center' ? 'justify-center' : section.options?.align === 'right' ? 'justify-end' : 'justify-start'}`}>
                {(filteredSkills || []).map((skill: any) => (
                  <div key={skill.id} className="px-6 py-3 rounded-full border bg-card hover:border-primary transition-all flex items-center gap-3">
                    {skill.icon && <img src={skill.icon} className="w-5 h-5 object-contain" />}
                    <span className="font-bold text-sm tracking-tight">{skill.title}</span>
                  </div>
                ))}
              </div>
            ) : isShowcase ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 text-center">
                {(filteredSkills || []).map((skill: any) => (
                  <div key={skill.id} className="space-y-4 group">
                    <div className="aspect-square bg-muted rounded-[2rem] flex items-center justify-center group-hover:bg-primary/20 transition-all border border-transparent group-hover:border-primary/50 p-6">
                      {skill.icon ? <img src={skill.icon} className="w-full h-full object-contain" /> : <Zap className="w-12 h-12 text-muted-foreground group-hover:text-primary" />}
                    </div>
                    <span className="font-bold tracking-tighter text-lg">{skill.title}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(filteredSkills || []).map((skill: any) => (
                  <div key={skill.id} className="p-8 rounded-[2rem] border bg-card hover:shadow-xl transition-all group space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                      {skill.icon ? <img src={skill.icon} className="w-6 h-6 object-contain group-hover:brightness-0 group-hover:invert" /> : <Zap className="w-6 h-6 text-primary group-hover:text-primary-foreground" />}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold">{skill.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{skill.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        );

      case 'experience':
        const isGrid = section.templateId === 'experience-grid';
        return (
          <section id={sectionId} key={section.id} className={`space-y-12 py-12 px-8 rounded-[3rem] ${sectionStyle}`}>
            <div className={`pl-6 space-y-2 border-l-4 border-primary ${alignClass}`} style={{ borderColor: accentColor }}>
              <h3 className="text-4xl font-bold tracking-tight">{section.title}</h3>
              <p className="text-muted-foreground">{section.subtitle}</p>
            </div>
            {isGrid ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {(filteredExperience || []).map((exp: any) => (
                  <div key={exp.id} className="p-8 rounded-[2rem] border bg-card hover:border-primary transition-all">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{exp.duration}</span>
                    <h4 className="text-2xl font-bold mt-2">{exp.position}</h4>
                    <p className="text-lg font-medium text-muted-foreground mb-4">{exp.company}</p>
                    <p className="text-muted-foreground leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            ) : section.templateId === 'experience-compact' ? (
              <div className="space-y-4 max-w-4xl">
                {experiences.map((exp: Experience) => (
                  <div key={exp.id} className="flex items-center justify-between p-6 rounded-2xl bg-card border hover:border-primary transition-all group">
                    <div>
                      <h4 className="font-bold text-lg group-hover:text-primary transition-colors">{exp.position}</h4>
                      <p className="text-sm text-muted-foreground">{exp.company}</p>
                    </div>
                    <span className="text-xs font-medium tabular-nums text-muted-foreground">{exp.duration}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-16 max-w-4xl">
                {experiences.map((exp: Experience) => (
                  <div key={exp.id} className="relative pl-12 before:absolute before:left-0 before:top-2 before:bottom-[-4rem] before:w-1 before:bg-primary/20 last:before:hidden">
                    <div className="absolute left-[-6px] top-2 w-4 h-4 rounded-full bg-primary border-4 border-background" />
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="space-y-1">
                        <h4 className="text-2xl font-bold tracking-tight">{exp.position}</h4>
                        <p className="text-xl font-medium text-primary">{exp.company}</p>
                      </div>
                      <span className="px-4 py-1.5 bg-secondary text-xs font-bold rounded-full">{exp.duration}</span>
                    </div>
                    <p className="mt-6 text-xl text-muted-foreground leading-loose">{exp.description}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        );

      case 'services':
        const services = section.options?.services || [
          { title: 'Creative Development', description: 'Crafting digital solutions with precision.' },
          { title: 'Technical Architecture', description: 'Building scalable and robust systems.' }
        ];
        const isList = section.templateId === 'services-list';
        const isGridS = section.templateId === 'services-grid';

        if (isGridS) {
          return (
            <section id={sectionId} key={section.id} className={`py-12 px-8 rounded-[3rem] ${sectionStyle} space-y-12`} style={dynamicStyles}>
              <div className="text-center space-y-4">
                <h3 className="text-4xl font-bold tracking-tight">{section.title}</h3>
                <p className="text-muted-foreground">{section.subtitle}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {services.map((service: any, i: number) => (
                  <div key={i} className="p-8 bg-card rounded-[2.5rem] border hover:shadow-xl transition-all text-center space-y-4 group">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center group-hover:rotate-12 transition-transform" style={{ backgroundColor: accentColor + '20' }}>
                      <Zap className="w-8 h-8" style={{ color: accentColor }} />
                    </div>
                    <h4 className="font-bold text-xl">{service.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        return (
          <section id={sectionId} key={section.id} className={`py-12 px-8 rounded-[3rem] ${sectionStyle} ${isList ? 'space-y-12' : 'grid grid-cols-1 md:grid-cols-3 gap-12'}`} style={dynamicStyles}>
            <div className={isList ? "space-y-4" : "lg:col-span-1 space-y-6"}>
              <h3 className="text-4xl font-bold tracking-tight">{section.title}</h3>
              <p className="text-xl text-muted-foreground leading-relaxed">{section.subtitle}</p>
            </div>
            <div className={isList ? "space-y-4" : "lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4"}>
              {services.map((service: any, i: number) => (
                <div key={i} className={`p-6 bg-card rounded-3xl border hover:border-primary transition-all group ${isList ? 'flex items-center justify-between' : ''}`}>
                  <div className={isList ? "flex items-center gap-6" : "space-y-4"}>
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors shrink-0">
                      <HelpCircle className="w-5 h-5 text-primary group-hover:text-primary-foreground" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{service.title}</h4>
                      <p className="text-sm text-muted-foreground mt-2">{service.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      case 'contact':
        if (section.templateId === 'contact-card') {
          return (
            <section id={sectionId} key={section.id} className={`py-16 px-8 rounded-[4rem] ${sectionStyle} flex justify-center`} style={dynamicStyles}>
              <div className="w-full max-w-2xl bg-card border-8 border-background shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] rounded-[3rem] p-12 text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="space-y-4">
                  <h3 className="text-4xl font-bold tracking-tight">{section.title}</h3>
                  <p className="text-muted-foreground text-lg">{section.subtitle}</p>
                </div>
                <div className="h-px bg-border w-1/2 mx-auto" />
                <div className="flex flex-col items-center gap-4">
                  <a href={`mailto:${s.contactEmail}`} className="text-2xl font-black text-primary hover:underline transition-all tabular-nums">
                    {s.contactEmail}
                  </a>
                  <div className="flex gap-4">
                    {normalizeSocialLinks(s.socialLinks).map((link: any, index: number) => {
                      if (!link.url) return null;
                      return (
                        <a key={index} href={link.url} target="_blank" rel="noreferrer" className="transition-all">
                          <SocialIcon icon={link.icon} style={link.style} name={link.name} color={link.color} className="w-5 h-5" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>
          );
        }
        return (
          <section id={sectionId} key={section.id} className={`py-16 px-8 rounded-[3rem] ${sectionStyle} text-center space-y-12`} style={dynamicStyles}>
            <div className="space-y-6 max-w-3xl mx-auto">
              <h3 className="text-5xl md:text-7xl font-black tracking-tighter">{section.title}</h3>
              <p className="text-xl text-muted-foreground">{section.subtitle}</p>
            </div>
            <div className="flex flex-col md:flex-row justify-center items-center gap-6">
              <Button asChild size="lg" className="rounded-full h-16 px-12 text-xl font-bold bg-primary text-primary-foreground shadow-2xl shadow-primary/20 group">
                <a href={`mailto:${s.contactEmail}`}>
                  Let's Talk <Mail className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              <div className="flex gap-4">
                {normalizeSocialLinks(s.socialLinks).map((link: any, index: number) => (
                  <a key={index} href={link.url} target="_blank" rel="noreferrer" className="transition-all">
                    <SocialIcon icon={link.icon} style={link.style} name={link.name} color={link.color} className="w-6 h-6" />
                  </a>
                ))}
              </div>
            </div>
          </section>
        );

      case 'pricing':
        const tiers = section.options?.tiers || [
          { name: "Starter", price: "Free", features: ["Basic UI", "Community Support"], button: "Get Started" },
          { name: "Pro", price: "$19", features: ["Advanced UI", "Custom Domain", "Priority Support"], button: "Go Pro", featured: true },
          { name: "Enterprise", price: "$49", features: ["Full Source", "White-label", "24/7 Support"], button: "Contact Us" }
        ];
        return (
          <section id={sectionId} key={section.id} className={`py-16 px-8 rounded-[3rem] ${sectionStyle} space-y-12`} style={dynamicStyles}>
            <div className="text-center space-y-4">
              <h3 className="text-4xl font-bold tracking-tight">{section.title}</h3>
              <p className="text-muted-foreground">{section.subtitle}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {tiers.map((tier: any, i: number) => (
                <div key={i} className={`p-8 rounded-[2.5rem] border-2 transition-all hover:scale-105 flex flex-col ${tier.featured ? 'border-primary bg-primary/5 shadow-2xl scale-105' : 'border-border bg-card'}`}>
                  <div className="space-y-4 mb-8 flex-1">
                    <div className="flex items-center gap-2 mb-4">
                      <CreditCard className="w-5 h-5" style={{ color: accentColor }} />
                      <h4 className="text-xl font-bold">{tier.name}</h4>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-black">{tier.price}</span>
                      {tier.price !== "Free" && <span className="text-muted-foreground">/mo</span>}
                    </div>
                    <ul className="space-y-3">
                      {tier.features.map((f: string, idx: number) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="w-4 h-4" style={{ color: accentColor }} /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button
                    className="w-full rounded-full"
                    variant={tier.featured ? 'default' : 'outline'}
                    style={tier.featured ?
                      { backgroundColor: accentColor, color: '#FFFFFF' } :
                      { borderColor: accentColor, color: accentColor }
                    }
                  >
                    {tier.button}
                  </Button>
                </div>
              ))}
            </div>
          </section>
        );

      case 'faq':
        const questions = section.options?.questions || [
          { q: "How does it work?", a: "Our platform integrates seamlessly with your existing workflow." },
          { q: "Is it secure?", a: "We use military-grade encryption for all data." }
        ];
        return (
          <section id={sectionId} key={section.id} className={`py-16 px-8 rounded-[3rem] ${sectionStyle} space-y-12 max-w-4xl mx-auto`} style={dynamicStyles}>
            <div className="text-center space-y-4">
              <h3 className="text-4xl font-bold tracking-tight">{section.title}</h3>
              <p className="text-muted-foreground">{section.subtitle}</p>
            </div>
            <div className="space-y-4">
              {questions.map((item: any, i: number) => (
                <details key={i} className="group border rounded-2xl bg-card transition-all">
                  <summary className="flex items-center justify-between p-6 cursor-pointer font-bold list-none">
                    {item.q}
                    <Plus className="w-5 h-5 group-open:rotate-45 transition-transform" style={{ color: accentColor }} />
                  </summary>
                  <div className="p-6 pt-0 text-muted-foreground leading-relaxed">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </section>
        );

      case 'gallery':
        const images = section.options?.images || [
          { url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800", title: "Abstract One" },
          { url: "https://images.unsplash.com/photo-1618005192346-0bb63b8c2c62?w=800", title: "Visual Two" },
          { url: "https://images.unsplash.com/photo-1618004912976-3b95adac3c8d?w=800", title: "Modern Three" },
          { url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800", title: "Abstract One" },
          { url: "https://images.unsplash.com/photo-1618005192346-0bb63b8c2c62?w=800", title: "Visual Two" },
          { url: "https://images.unsplash.com/photo-1618004912976-3b95adac3c8d?w=800", title: "Modern Three" }
        ];
        return (
          <section id={sectionId} key={section.id} className={`py-12 px-8 rounded-[3rem] ${sectionStyle} space-y-12`} style={dynamicStyles}>
            <div className="text-center space-y-4">
              <h3 className="text-4xl font-bold tracking-tight">{section.title}</h3>
              <p className="text-muted-foreground">{section.subtitle}</p>
            </div>
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {images.map((img: any, i: number) => (
                <div key={i} className="break-inside-avoid relative group overflow-hidden rounded-[2rem] border-2 border-transparent hover:border-primary transition-all shadow-lg" style={i === 0 ? { borderColor: accentColor } : {}}>
                  <img src={img.url} className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-700" alt={img.title} />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-8 backdrop-blur-[2px]">
                    <span className="text-white font-bold text-center">{img.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      case 'team':
        const members = section.options?.members || [
          { name: "John Doe", role: "Design Lead", img: "https://i.pravatar.cc/150?u=1" },
          { name: "Jane Smith", role: "Tech Lead", img: "https://i.pravatar.cc/150?u=2" },
          { name: "Alex Ross", role: "DevOps", img: "https://i.pravatar.cc/150?u=3" }
        ];
        return (
          <section id={sectionId} key={section.id} className={`py-16 px-8 rounded-[3rem] ${sectionStyle} space-y-12`} style={dynamicStyles}>
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b pb-12">
              <div className="space-y-4">
                <h3 className="text-4xl font-bold tracking-tight">{section.title}</h3>
                <p className="text-xl text-muted-foreground">{section.subtitle}</p>
              </div>
              <div className="flex -space-x-4">
                {members.map((m: any, i: number) => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-background bg-muted overflow-hidden">
                    <img src={m.img} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {members.map((member: any, i: number) => (
                <div key={i} className="text-center space-y-6 group">
                  <div className="relative mx-auto w-48 h-48 rounded-[3rem] overflow-hidden border-8 border-background shadow-2xl group-hover:rotate-3 transition-transform">
                    <img src={member.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold tracking-tight">{member.name}</h4>
                    <p className="text-primary font-bold text-xs uppercase tracking-widest" style={{ color: accentColor }}>{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      case 'cta':
        const isBanner = section.templateId === 'cta-banner';
        if (isBanner) {
          return (
            <section id={sectionId} key={section.id} className="py-24 px-8 rounded-[4rem] bg-primary text-primary-foreground overflow-hidden relative group" style={dynamicStyles}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 max-w-5xl mx-auto">
                <div className={`space-y-6 flex-1 ${alignClass}`}>
                  <h3 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">{section.title}</h3>
                  <p className="text-xl text-white/80 max-w-xl">{section.subtitle}</p>
                </div>
                <Button size="lg" variant="secondary" asChild className="rounded-full px-12 h-16 text-lg font-bold group-hover:scale-110 transition-all">
                  <a href={section.options?.btnUrl || "#contact"}>
                    {section.options?.btnText || "Get Started Now"} <ArrowRight className="ml-2 w-5 h-5" />
                  </a>
                </Button>
              </div>
            </section>
          );
        }
        // Elegant Features
        const features = section.options?.features || [
          { title: "Smart Architecture", desc: "Built with the latest modular standards.", icon: Layers },
          { title: "Rapid Performance", desc: "Optimized for sub-second delivery.", icon: TrendingUp },
          { title: "Expert Support", desc: "24/7 dedicated help from real humans.", icon: Users },
          { title: "Verified Quality", desc: "Tested against industry benchmarks.", icon: Award }
        ];
        return (
          <section id={sectionId} key={section.id} className={`py-20 px-8 rounded-[3rem] ${sectionStyle} space-y-16`} style={dynamicStyles}>
            <div className="text-center space-y-4">
              <h3 className="text-5xl font-black tracking-tighter">{section.title}</h3>
              <p className="text-xl text-muted-foreground">{section.subtitle}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feat: any, i: number) => {
                const Icon = feat.icon || Zap;
                return (
                  <div key={i} className="p-10 bg-card rounded-[3rem] border border-transparent hover:border-primary/50 transition-all group space-y-6">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all" style={{ backgroundColor: accentColor + '20', color: accentColor }}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xl font-bold tracking-tight">{feat.title}</h4>
                      <p className="text-muted-foreground leading-relaxed">{feat.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );

      case 'stats':
        const stats = section.options?.stats || [
          { value: "10k+", label: "Active Users" },
          { value: "50+", label: "Award Wins", icon: Trophy },
          { value: "99%", label: "Satisfaction", icon: Heart },
          { value: "24/7", label: "Availability", icon: Zap }
        ];
        return (
          <section id={sectionId} key={section.id} className={`py-12 rounded-[3.5rem] ${sectionStyle} bg-secondary/10`} style={dynamicStyles}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 p-12 ">
              {stats.map((stat: any, i: number) => (
                <div key={i} className="text-center space-y-2">
                  <div className="text-4xl md:text-6xl font-black tracking-tighter text-primary" style={{ color: accentColor }}>{stat.value}</div>
                  <div className="text-xs uppercase font-black tracking-[0.2em] text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </section>
        );

      case 'testimonials':
        const reviews = section.options?.testimonials || [
          { text: "This platform changed how we build projects forever.", author: "Sarah Jenkins", role: "CTO @ TechFlow" },
          { text: "The most intuitive dashboard I have ever used.", author: "Mike Ross", role: "Product Designer" }
        ];
        return (
          <section id={sectionId} key={section.id} className={`py-20 px-8 rounded-[3rem] ${sectionStyle} space-y-16`} style={dynamicStyles}>
            <div className="text-center space-y-4">
              <h3 className="text-4xl font-bold tracking-tight">{section.title}</h3>
              <p className="text-muted-foreground">{section.subtitle}</p>
            </div>
            <div className="flex overflow-x-auto gap-8 pb-8 snap-x scrollbar-hide">
              {reviews.map((rev: any, i: number) => (
                <div key={i} className="min-w-[320px] md:min-w-[450px] snap-center bg-card p-12 rounded-[3rem] border shadow-xl space-y-8">
                  <div className="flex gap-1 text-primary" style={{ color: accentColor }}>
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 fill-current" />)}
                  </div>
                  <p className="text-2xl font-medium italic leading-relaxed">"{rev.text}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-muted border" />
                    <div>
                      <div className="font-bold">{rev.name || rev.author}</div>
                      <div className="text-sm text-muted-foreground">{rev.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 pb-16 space-y-12">
      {loading ? (
        <LandingPageSkeleton />
      ) : sections.length > 0 ? (
        sections.map(renderSection)
      ) : (
        // Fallback to default layout if no sections defined
        <>
          <section className="space-y-6 max-w-4xl pt-12 md:pt-24">
            <h2 className="text-5xl md:text-8xl font-extrabold tracking-tight leading-[1]">
              {s.heroTitle}
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl">
              {s.heroSubtitle}
            </p>
          </section>
          {/* ... other default sections ... */}
        </>
      )}
    </main>
  );
};


// Admin Dashboard Component
const AdminDashboard = () => {
  const { data: projects } = useFirestoreCollection<Project>('projects')
  const { data: skills } = useFirestoreCollection<Skill>('skills')
  const { data: experiences } = useFirestoreCollection<Experience>('experiences')
  const { data: settings } = useFirestoreDocument<SiteSettings>('settings', 'global')
  const { logout } = useAuth()
  const [seeding, setSeeding] = useState(false)
  const [activeDialog, setActiveDialog] = useState<{
    type: 'create' | 'edit',
    category: 'project' | 'skill' | 'experience',
    data?: any
  } | null>(null)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    variant?: "danger" | "primary"
  }>({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => { }
  });

  // Project Handlers
  const handleProjectCreate = async (data: any) => {
    try {
      await projectService.createProject(data);
      toast.success("Project created successfully!");
      setActiveDialog(null);
    } catch (err) { toast.error("Failed to create project."); }
  };
  const handleProjectUpdate = async (data: any) => {
    if (!activeDialog?.data) return;
    try {
      await projectService.updateProject(activeDialog.data.id, data);
      toast.success("Project updated!");
      setActiveDialog(null);
    } catch (err) { toast.error("Update failed."); }
  };

  // Skill Handlers
  const handleSkillCreate = async (data: any) => {
    try {
      await skillService.createSkill(data);
      toast.success("Skill added!");
      setActiveDialog(null);
    } catch (err) { toast.error("Error adding skill."); }
  };
  const handleSkillUpdate = async (data: any) => {
    if (!activeDialog?.data) return;
    try {
      await skillService.updateSkill(activeDialog.data.id, data);
      toast.success("Skill updated!");
      setActiveDialog(null);
    } catch (err) { toast.error("Update failed."); }
  };

  // Experience Handlers
  const handleExperienceCreate = async (data: any) => {
    try {
      await experienceService.createExperience(data);
      toast.success("Experience journey updated!");
      setActiveDialog(null);
    } catch (err) { toast.error("Error creating experience."); }
  };
  const handleExperienceUpdate = async (data: any) => {
    if (!activeDialog?.data) return;
    try {
      await experienceService.updateExperience(activeDialog.data.id, data);
      toast.success("Experience saved!");
      setActiveDialog(null);
    } catch (err) { toast.error("Update failed."); }
  };

  const handleDelete = async (category: string, id: string) => {
    setConfirmModal({
      isOpen: true,
      title: `Delete ${category}?`,
      description: `Are you sure you want to permanently delete this ${category}? This action cannot be undone.`,
      variant: "danger",
      onConfirm: async () => {
        try {
          if (category === 'project') await projectService.deleteProject(id);
          if (category === 'skill') await skillService.deleteSkill(id);
          if (category === 'experience') await experienceService.deleteExperience(id);
          toast.success(`${category} deleted successfully.`);
        } catch (err) { toast.error(`Error deleting ${category}.`); }
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleSettingsUpdate = async (data: any) => {
    try {
      await settingsService.updateSettings(data);
      toast.success("Site settings saved!");
    } catch (err: any) {
      toast.error(`Save failed: ${err.message}`);
      throw err;
    }
  };

  const handleSeed = async () => {
    setConfirmModal({
      isOpen: true,
      title: "Seed Database?",
      description: "This will populate your database with initial sample data. It will not overwrite existing items but may create duplicates if run multiple times.",
      onConfirm: async () => {
        setSeeding(true);
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        try {
          const result = await seedDatabase();
          if (result.success) toast.success(result.message);
          else toast.info(result.message);
        } catch (err: any) { toast.error(`Seeding error: ${err.message}`); }
        finally { setSeeding(false); }
      }
    });
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        description={confirmModal.description}
        variant={confirmModal.variant}
        isLoading={seeding}
      />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-8">
        <div className="flex items-center gap-4">
          <div className="bg-primary p-3 rounded-2xl text-primary-foreground">
            <LayoutGrid className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Content Studio</h2>
            <p className="text-muted-foreground">Manage your portfolio projects and site-wide settings.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={handleSeed} disabled={seeding} className="flex-1 md:flex-none">
            <Database className="w-4 h-4 mr-2" /> {seeding ? "..." : "Seed"}
          </Button>
          <Button size="sm" onClick={() => setActiveDialog({ type: 'create', category: 'project' })} className="flex-1 md:flex-none">
            <Plus className="w-4 h-4 mr-2" /> Project
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setActiveDialog({ type: 'create', category: 'skill' })} className="flex-1 md:flex-none">
            <Plus className="w-4 h-4 mr-2" /> Skill
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setActiveDialog({ type: 'create', category: 'experience' })} className="flex-1 md:flex-none">
            <Plus className="w-4 h-4 mr-2" /> Exp
          </Button>
          <Button variant="ghost" size="sm" onClick={logout} className="text-destructive hover:bg-destructive/10 flex-1 md:flex-none">
            <LogOut className="w-4 h-4 mr-2" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="projects" className="space-y-8">
        <div className="overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar">
          <TabsList className="bg-secondary/50 p-1 rounded-xl w-max md:w-auto">
            <TabsTrigger value="projects" className="rounded-lg px-4 md:px-6">Projects</TabsTrigger>
            <TabsTrigger value="skills" className="rounded-lg px-4 md:px-6">Skills</TabsTrigger>
            <TabsTrigger value="experience" className="rounded-lg px-4 md:px-6">Experience</TabsTrigger>
            <TabsTrigger value="layout" className="rounded-lg px-4 md:px-6">Layout</TabsTrigger>
            <TabsTrigger value="settings" className="rounded-lg px-4 md:px-6">Settings</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="projects" className="space-y-6 outline-none">
          <div className="grid grid-cols-1 gap-4">
            {projects.length === 0 ? (
              <div className="p-20 border-2 border-dashed rounded-[2rem] text-center text-muted-foreground">
                No projects added yet. Click "New Project" to begin.
              </div>
            ) : projects.map((project: Project) => (
              <div key={project.id} className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-2xl bg-card hover:border-primary/50 transition-all shadow-sm gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-14 md:w-24 md:h-16 rounded-lg bg-muted overflow-hidden border flex-shrink-0">
                    {project.portfolioImages?.[0] && <img src={project.portfolioImages[0]} className="w-full h-full object-cover" />}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-lg truncate">{project.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-1">{project.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <Button variant="ghost" size="icon" onClick={() => setActiveDialog({ type: 'edit', category: 'project', data: project })}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete('project', project.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6 outline-none">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((skill: Skill) => (
              <div key={skill.id} className="flex items-center justify-between p-4 border rounded-xl bg-card">
                <div>
                  <h4 className="font-bold">{skill.title}</h4>
                  <p className="text-xs text-muted-foreground">{skill.category}</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => setActiveDialog({ type: 'edit', category: 'skill', data: skill })}>
                    <Pencil className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete('skill', skill.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="experience" className="space-y-6 outline-none">
          <div className="grid grid-cols-1 gap-4">
            {experiences.map((exp: Experience) => (
              <div key={exp.id} className="flex items-center justify-between p-4 border rounded-xl bg-card">
                <div className="flex items-center gap-4">
                  <Briefcase className="w-5 h-5 text-primary" />
                  <div>
                    <h4 className="font-bold">{exp.position} @ {exp.company}</h4>
                    <p className="text-xs text-muted-foreground">{exp.duration}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => setActiveDialog({ type: 'edit', category: 'experience', data: exp })}>
                    <Pencil className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete('experience', exp.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="layout" className="outline-none">
          <LayoutForm />
        </TabsContent>

        <TabsContent value="settings" className="outline-none">
          <SettingsForm
            initialData={settings || {
              siteName: "FAKHR.",
              heroTitle: "Building digital experiences that matter.",
              heroSubtitle: "I'm a frontend engineer focused on creating high-performance, accessible, and beautiful web applications using React, TypeScript, and Firebase.",
              contactEmail: "hello@example.com",
              footerText: `© ${new Date().getFullYear()} Fakhr. Built with React and Firebase.`
            } as any}
            onSubmit={handleSettingsUpdate}
          />
        </TabsContent>
      </Tabs>

      {/* Project Form Dialog */}
      <Dialog open={!!activeDialog} onOpenChange={(open: boolean) => !open && setActiveDialog(null)}>
        <DialogContent className="sm:max-w-[600px] overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{activeDialog?.type === 'create' ? 'Create' : 'Edit'} {activeDialog?.category}</DialogTitle>
          </DialogHeader>
          {activeDialog?.category === 'project' && (
            <ProjectForm
              initialData={activeDialog.data}
              onSubmit={activeDialog.type === 'create' ? handleProjectCreate : handleProjectUpdate}
              onCancel={() => setActiveDialog(null)}
            />
          )}
          {activeDialog?.category === 'skill' && (
            <SkillForm
              initialData={activeDialog.data}
              onSubmit={activeDialog.type === 'create' ? handleSkillCreate : handleSkillUpdate}
              onCancel={() => setActiveDialog(null)}
            />
          )}
          {activeDialog?.category === 'experience' && (
            <ExperienceForm
              initialData={activeDialog.data}
              onSubmit={activeDialog.type === 'create' ? handleExperienceCreate : handleExperienceUpdate}
              onCancel={() => setActiveDialog(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
};

function App() {
  const { data: projects, loading: loadingProjects } = useFirestoreCollection<Project>('projects')
  const { data: skills, loading: loadingSkills } = useFirestoreCollection<Skill>('skills')
  const { data: experiences, loading: loadingExperiences } = useFirestoreCollection<Experience>('experiences')
  const { data: sections, loading: loadingSections } = useFirestoreCollection<PageSection>('sections')
  const { data: settings, loading: loadingSettings } = useFirestoreDocument<SiteSettings>('settings', 'global')
  const dataLoading = loadingProjects || loadingSkills || loadingExperiences || loadingSections || loadingSettings;

  // Minimum skeleton display time for smooth UX
  const [minLoadTime, setMinLoadTime] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setMinLoadTime(false), 600);
    return () => clearTimeout(timer);
  }, []);
  const loading = dataLoading || minLoadTime;

  const s = settings || {
    siteName: "FAKHR.",
    footerText: `© ${new Date().getFullYear()} Fakhr. All rights reserved.`
  } as Partial<SiteSettings>;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Sync browser tab title
  useEffect(() => {
    const title = s.siteTitle || s.siteName;
    if (title) {
      document.title = title;
    }
  }, [s.siteTitle, s.siteName]);

  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (e: React.MouseEvent, targetId: string) => {
    setIsMenuOpen(false);
    const isHome = location.pathname === '/';

    if (!isHome) {
      e.preventDefault();
      navigate(`/#${targetId}`);
      return;
    }

    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', `#${targetId}`);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground transition-colors duration-300">
      <ToasterProvider />
      <header
        className={`border-b sticky top-0 z-50 transition-all duration-300 ${s.navStyle === 'glass' ? 'backdrop-blur-xl' : ''}`}
        style={{
          backgroundColor: s.navStyle === 'glass'
            ? (s.navBgColor ? `${s.navBgColor}cc` : 'hsl(var(--background) / 0.8)')
            : (s.navBgColor || 'hsl(var(--background))'),
          color: s.navTextColor || undefined,
          borderColor: s.navStyle === 'glass' ? 'transparent' : (s.navTextColor ? `${s.navTextColor}20` : undefined)
        }}
      >
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-70 transition-opacity" onClick={() => setIsMenuOpen(false)}>
            {s.siteLogo ? (
              <img src={s.siteLogo} alt={s.siteName} className="h-10 w-auto object-contain" />
            ) : (
              <span className="text-2xl font-black tracking-tighter">{s.siteName}</span>
            )}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {sections
              .filter((sec: PageSection) => sec.isPublished && sec.inNav)
              .sort((a: PageSection, b: PageSection) => (a.order || 0) - (b.order || 0))
              .map((sec: PageSection) => {
                const label = sec.navTitle || sec.title;
                const targetId = label.toLowerCase().replace(/\s+/g, '-');
                return (
                  <a
                    key={sec.id}
                    href={`#${targetId}`}
                    onClick={(e) => handleNavClick(e, targetId)}
                    className="text-sm font-semibold tracking-wide hover:opacity-70 transition-all flex items-center gap-2 group"
                    style={{ color: s.navTextColor || 'inherit' }}
                  >
                    {label}
                    <div className="h-0.5 w-0 group-hover:w-full bg-primary transition-all duration-300" style={{ backgroundColor: s.navTextColor || undefined }} />
                  </a>
                );
              })}
          </nav>

          {/* Mobile Toggle */}
          <div className="flex items-center gap-2 md:hidden relative z-[110]">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer - Outside header to avoid z-index stacking context issues */}
      <div
        className={`fixed inset-0 z-[100] md:hidden transition-all duration-700 ${isMenuOpen ? 'visible' : 'invisible pointer-events-none'}`}
      >
        {/* Menu Panel */}
        <nav
          className={`absolute inset-0 bg-background transition-all duration-700 transform ${isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'} flex flex-col items-center justify-center`}
        >
          {/* Close Button */}
          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-6 right-6 z-10 p-2 rounded-full hover:bg-secondary/50 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-7 h-7" />
          </button>

          <div className="flex flex-col items-center justify-between h-[100dvh] w-full px-8 py-20">
            <div className="flex flex-col gap-7 w-full max-w-lg items-center text-center mt-4">
              {sections
                .filter((sec: PageSection) => sec.isPublished && sec.inNav)
                .sort((a: PageSection, b: PageSection) => (a.order || 0) - (b.order || 0))
                .map((sec: PageSection, idx: number) => {
                  const label = sec.navTitle || sec.title;
                  const targetId = label.toLowerCase().replace(/\s+/g, '-');
                  const indexStr = (idx + 1).toString().padStart(2, '0');
                  return (
                    <a
                      key={sec.id}
                      href={`#${targetId}`}
                      onClick={(e) => handleNavClick(e, targetId)}
                      className={`group relative flex items-center justify-center gap-3 text-4xl font-black tracking-tighter hover:text-primary transition-all transform duration-700 ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
                      style={{
                        color: s.navTextColor || 'inherit',
                        transitionDelay: `${idx * 80 + 100}ms`
                      }}
                    >
                      <span className="text-xs font-mono text-primary/30 font-black absolute -left-2 -top-1">{indexStr}</span>
                      <span>{label}</span>
                      <div className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-primary/40 transition-all duration-700 group-hover:w-full -translate-x-1/2" />
                    </a>
                  );
                })}
            </div>

            <div className={`flex flex-col items-center gap-6 w-full transition-all duration-700 delay-500 ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
              <div className="h-px w-20 bg-primary/20" />

              <div className="flex items-center gap-8">
                {normalizeSocialLinks(s.socialLinks).map((link: any, index: number) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-muted-foreground hover:text-primary transition-all hover:scale-125 active:scale-90"
                  >
                    <SocialIcon icon={link.icon} style={link.style} name={link.name} color={link.color} className="w-6 h-6" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </nav>
      </div>

      <Routes>
        <Route path="/" element={
          <LandingPage
            projects={projects}
            skills={skills}
            experiences={experiences}
            sections={sections}
            settings={settings}
            loading={loading}
          />
        } />
        <Route path="/project/:id" element={<ProjectPage />} />
        <Route path="/port-admin" element={<AuthGuard><AdminDashboard /></AuthGuard>} />
      </Routes>

      <footer className="border-t py-16 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8 text-sm text-muted-foreground">
          <span className="font-medium">{s.footerText || `© ${new Date().getFullYear()} Fakhr. All rights reserved.`}</span>
          <div className="flex items-center gap-6">
            {normalizeSocialLinks(s.socialLinks).map((link: any, index: number) => (
              <a key={index} href={link.url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-all">
                <SocialIcon icon={link.icon} style={link.style} name={link.name} color={link.color} className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
