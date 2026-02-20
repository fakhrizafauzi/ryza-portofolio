import { useParams, Link } from "react-router-dom";
import { useFirestoreDocument } from "@/hooks/useFirestoreDocument";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import { type Project } from "@/types";
import { Button } from "@/components/ui/button";
import {
    ArrowLeft, Github, ExternalLink, Calendar, Tag, User,
    Layout, ArrowRight, Code2, FileText, Trophy, Users,
    Quote, Palette, Milestone, CheckCircle2, Cpu, Clock, Sparkles,
    ArrowLeftRight, UserSearch, GitMerge, Lightbulb, Terminal, X,
    Gauge, HelpCircle, TrendingUp
} from "lucide-react";
import { motion } from "framer-motion";

export function ProjectPage() {
    const { id } = useParams<{ id: string }>();
    const { data: project, loading, error } = useFirestoreDocument<Project>("projects", id || "");
    const { data: allProjects } = useFirestoreCollection<Project>("projects");

    const labels = {
        backText: project?.customLabels?.backText || "Back to Portfolio",
        roleLabel: project?.customLabels?.roleLabel || "My Role",
        techLabel: project?.customLabels?.techLabel || "Tech Stack",
        linksLabel: project?.customLabels?.linksLabel || "Project Links",
        galleryTitle: project?.customLabels?.galleryTitle || "Project Gallery",
        gallerySubtitle: project?.customLabels?.gallerySubtitle || "Visualizing Innovation",
        demoTitle: project?.customLabels?.demoTitle || "Live Demo / Preview",
        interactiveTitle: project?.customLabels?.interactiveTitle || "Interactive Content",
        aboutTitle: project?.customLabels?.aboutTitle || "About Project",
        dateLabel: project?.customLabels?.dateLabel || "Date",
        resourcesTitle: project?.customLabels?.resourcesTitle || "Resources",
        githubButton: project?.customLabels?.githubButton || "GitHub",
        demoButton: project?.customLabels?.demoButton || "Live Demo",
        nextProjectLabel: project?.customLabels?.nextProjectLabel || "Next Project",
        // New labels
        statsTitle: project?.customLabels?.statsTitle || "By The Numbers",
        challengeTitle: project?.customLabels?.challengeTitle || "The Challenge",
        solutionTitle: project?.customLabels?.solutionTitle || "The Solution",
        milestonesTitle: project?.customLabels?.milestonesTitle || "Project Milestones",
        designTokensTitle: project?.customLabels?.designTokensTitle || "Design DNA",
        testimonialsTitle: project?.customLabels?.testimonialsTitle || "The Collaborative Force",
        processTitle: project?.customLabels?.processTitle || "Execution Strategy",
        techStackTitle: project?.customLabels?.techStackTitle || "Technology Core",
        featuresTitle: project?.customLabels?.featuresTitle || "Core Capabilities",
        userPersonasTitle: project?.customLabels?.userPersonasTitle || "Understanding Users",
        comparisonTitle: project?.customLabels?.comparisonTitle || "Measure of Success",
        roadmapTitle: project?.customLabels?.roadmapTitle || "Evolutionary Roadmap",
        reflectionsTitle: project?.customLabels?.reflectionsTitle || "Deep Reflections",
        technicalDeepDiveTitle: project?.customLabels?.technicalDeepDiveTitle || "Technical Core",
        architectureTitle: project?.customLabels?.architectureTitle || "System Architecture",
        perfSeoTitle: project?.customLabels?.perfSeoTitle || "Performance & Vitals",
        faqTitle: project?.customLabels?.faqTitle || "Technical FAQ",
        designDecisionsTitle: project?.customLabels?.designDecisionsTitle || "Design Decisions",
        successMetricsTitle: project?.customLabels?.successMetricsTitle || "Success Metrics",
    };

    const sortedProjects = [...allProjects].sort((a, b) => a.order - b.order);
    const currentIndex = sortedProjects.findIndex(p => p.id === id);
    const nextProject = sortedProjects[currentIndex + 1] || sortedProjects[0];

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-24 animate-pulse space-y-8">
                <div className="h-10 w-32 bg-muted rounded-full" />
                <div className="aspect-video bg-muted rounded-[2rem]" />
                <div className="space-y-4">
                    <div className="h-12 w-3/4 bg-muted rounded-xl" />
                    <div className="h-6 w-full bg-muted rounded-lg" />
                </div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
                <h2 className="text-3xl font-bold">Project not found</h2>
                <Button asChild variant="outline">
                    <Link to="/">Back to Home</Link>
                </Button>
            </div>
        );
    }

    return (
        <main className="max-w-6xl mx-auto px-4 py-12 md:py-24 space-y-24 animate-in fade-in duration-700">
            <nav>
                <Button asChild variant="ghost" className="rounded-full group">
                    <Link to="/" className="flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        {labels.backText}
                    </Link>
                </Button>
            </nav>

            <motion.header
                initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
                className="space-y-12"
            >
                <div className="space-y-6 text-center md:text-left">
                    <div className="flex flex-wrap justify-center md:justify-start gap-2">
                        <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest rounded-full">{project.category || "Case Study"}</span>
                        {project.status && (
                            <span className={`px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full ${project.status === 'Finished' ? 'bg-green-500/10 text-green-500' :
                                project.status === 'In Development' ? 'bg-blue-500/10 text-blue-500' :
                                    project.status === 'Blueprint' ? 'bg-amber-500/10 text-amber-500' :
                                        project.status === 'Maintained' ? 'bg-purple-500/10 text-purple-500' :
                                            'bg-slate-500/10 text-slate-500'
                                }`}>
                                {project.status}
                            </span>
                        )}
                    </div>
                    <h1 className="text-4xl md:text-8xl font-black tracking-tighter leading-[0.9] md:leading-[0.8] mb-4">
                        {project.title}
                    </h1>
                    <p className="text-lg md:text-3xl text-muted-foreground max-w-4xl leading-relaxed font-medium pt-4 border-l-4 border-primary/20 pl-6 mx-auto md:mx-0">
                        {project.description}
                    </p>
                </div>

                <div className="relative aspect-video overflow-hidden rounded-[2.5rem] border-4 border-muted shadow-2xl bg-muted group">
                    {project.portfolioImages?.[0] ? (
                        <img
                            src={project.portfolioImages[0]}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xl">
                            Visualizing Innovation...
                        </div>
                    )}
                </div>
            </motion.header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-16 mt-16">
                <div className="lg:col-span-3 space-y-24">
                    {(project.sectionOrder || ['stats', 'challenge_solution', 'embeds', 'content', 'milestones', 'design_tokens', 'gallery', 'testimonials', 'team', 'architecture', 'perf_seo', 'faq', 'design_decisions', 'success_metrics']).map((sectionId) => {
                        const renderContent = () => {
                            switch (sectionId) {
                                case 'stats':
                                    return (project.visibility?.showStats && project.stats && project.stats.length > 0) ? (
                                        <section key="stats" className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 bg-secondary/5 p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-secondary/20 shadow-inner">
                                            {project.stats.map((stat, i) => (
                                                <div key={i} className="p-2 md:p-4 text-center space-y-1">
                                                    <h3 className="text-2xl md:text-5xl font-black tracking-tighter text-primary">{stat.value}</h3>
                                                    <p className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-muted-foreground">{stat.label}</p>
                                                </div>
                                            ))}
                                        </section>
                                    ) : null;
                                case 'challenge_solution':
                                    return (project.visibility?.showChallengeSolution && (project.challengeContent || project.solutionContent)) ? (
                                        <section key="challenge_solution" className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
                                            <div className="space-y-6">
                                                <div className="p-3 bg-destructive/10 text-destructive rounded-xl w-fit"><Trophy className="w-6 h-6 rotate-180" /></div>
                                                <h2 className="text-2xl md:text-3xl font-black tracking-tighter">{project.challengeTitle || "The Challenge"}</h2>
                                                <p className="text-lg text-muted-foreground leading-loose">{project.challengeContent}</p>
                                            </div>
                                            <div className="space-y-6">
                                                <div className="p-3 bg-primary/10 text-primary rounded-xl w-fit"><CheckCircle2 className="w-6 h-6" /></div>
                                                <h2 className="text-2xl md:text-3xl font-black tracking-tighter">{project.solutionTitle || "The Solution"}</h2>
                                                <p className="text-lg text-muted-foreground leading-loose">{project.solutionContent}</p>
                                            </div>
                                        </section>
                                    ) : null;
                                case 'embeds':
                                    return (project.embedUrl || project.embedScript) ? (
                                        <div key="embeds" className="space-y-16">
                                            {project.embedUrl && (
                                                <section className="space-y-8">
                                                    <h2 className="text-2xl md:text-3xl font-black tracking-tighter flex items-center gap-3">
                                                        <Layout className="w-8 h-8 text-primary" />
                                                        {labels.demoTitle}
                                                    </h2>
                                                    <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border-2 shadow-2xl bg-black">
                                                        <iframe src={project.embedUrl} className="absolute inset-0 w-full h-full" allowFullScreen loading="lazy" />
                                                    </div>
                                                </section>
                                            )}
                                            {project.embedScript && (
                                                <section className="space-y-8">
                                                    <h2 className="text-2xl md:text-3xl font-black tracking-tighter flex items-center gap-3">
                                                        <Code2 className="w-8 h-8 text-primary" />
                                                        {labels.interactiveTitle}
                                                    </h2>
                                                    <div className="rounded-[2.5rem] overflow-hidden border-2 shadow-2xl bg-card p-6 overflow-x-auto" dangerouslySetInnerHTML={{ __html: project.embedScript }} />
                                                </section>
                                            )}
                                        </div>
                                    ) : null;
                                case 'content':
                                    return (
                                        <section key="content" className="prose prose-slate dark:prose-invert max-w-none">
                                            <div className="whitespace-pre-wrap text-lg md:text-2xl leading-relaxed text-foreground/90 font-sans">
                                                {project.content || "Detailed project documentation is being prepared."}
                                            </div>
                                        </section>
                                    );
                                case 'milestones':
                                    return (project.visibility?.showMilestones && project.milestones && project.milestones.length > 0) ? (
                                        <section key="milestones" className="space-y-12">
                                            <h2 className="text-2xl md:text-3xl font-black tracking-tighter flex items-center gap-3">
                                                <Milestone className="w-8 h-8 text-primary" />
                                                Project Milestones
                                            </h2>
                                            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-muted-foreground/20 before:to-transparent">
                                                {project.milestones.map((item, i) => (
                                                    <div key={i} className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active`}>
                                                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-primary text-primary-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                                            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                                        </div>
                                                        <div className="w-[calc(100%-4rem)] md:w-[45%] p-6 rounded-2xl md:rounded-3xl border bg-card shadow-sm group-hover:border-primary transition-colors">
                                                            <div className="flex items-center justify-between gap-2 mb-1">
                                                                <div className="font-black text-primary uppercase text-[10px] tracking-widest">{item.date}</div>
                                                            </div>
                                                            <div className="text-lg md:text-xl font-bold text-foreground">{item.label}</div>
                                                            {item.description && <div className="text-sm md:text-base text-muted-foreground mt-2">{item.description}</div>}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    ) : null;
                                case 'design_tokens':
                                    return (project.visibility?.showDesignTokens && project.designTokens) ? (
                                        <section key="design_tokens" className="space-y-12 p-6 md:p-12 bg-muted/30 rounded-[2rem] md:rounded-[3rem] border-2">
                                            <div className="space-y-2">
                                                <h2 className="text-2xl md:text-3xl font-black tracking-tighter flex items-center gap-3">
                                                    <Palette className="w-8 h-8 text-primary" />
                                                    Design DNA
                                                </h2>
                                                <p className="text-sm md:text-base text-muted-foreground">The visual foundation of the experience.</p>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                                {project.designTokens.colors && project.designTokens.colors.length > 0 && (
                                                    <div className="space-y-6">
                                                        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Color Palette</h3>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            {project.designTokens.colors.map((c, i) => (
                                                                <div key={i} className="flex items-center gap-4 group">
                                                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl shadow-lg group-hover:scale-110 transition-transform" style={{ backgroundColor: c.hex }} />
                                                                    <div>
                                                                        <p className="text-xs md:text-sm font-bold">{c.name}</p>
                                                                        <p className="text-[9px] md:text-[10px] uppercase font-mono text-muted-foreground">{c.hex}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                {project.designTokens.fonts && project.designTokens.fonts.length > 0 && (
                                                    <div className="space-y-6">
                                                        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Typography</h3>
                                                        <div className="space-y-6">
                                                            {project.designTokens.fonts.map((f, i) => (
                                                                <div key={i} className="space-y-1 overflow-hidden">
                                                                    <p className="text-xs font-bold text-muted-foreground mb-2">{f.name}</p>
                                                                    <p className="text-2xl md:text-5xl tracking-tighter truncate" style={{ fontFamily: f.family }}>
                                                                        The quick brown fox
                                                                    </p>
                                                                    <p className="text-[9px] md:text-[10px] font-mono opacity-50">{f.family}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </section>
                                    ) : null;
                                case 'gallery':
                                    return (project.portfolioImages.length > 1) ? (
                                        <section key="gallery" className="space-y-12">
                                            <div className="space-y-2 text-center md:text-left">
                                                <h2 className="text-3xl md:text-4xl font-black tracking-tighter">{labels.galleryTitle}</h2>
                                                {labels.gallerySubtitle && <p className="text-lg md:text-xl text-muted-foreground">{labels.gallerySubtitle}</p>}
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                {project.portfolioImages.slice(1).map((img, i) => (
                                                    <div key={i} className="rounded-[2rem] md:rounded-[2.5rem] border overflow-hidden shadow-2xl aspect-auto bg-muted group">
                                                        <img src={img} alt={`${project.title} screenshot ${i + 1}`} className="w-full h-auto group-hover:scale-105 transition-transform duration-700" />
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    ) : null;
                                case 'testimonials':
                                    return (project.visibility?.showTestimonials && project.testimonials && project.testimonials.length > 0) ? (
                                        <section key="testimonials" className="pt-12 border-t space-y-12">
                                            {project.testimonials.map((t, i) => (
                                                <div key={i} className="space-y-8 max-w-4xl mx-auto">
                                                    <Quote className="w-12 h-12 md:w-16 md:h-16 text-primary/10 mx-auto" />
                                                    <p className="text-xl md:text-4xl font-medium italic text-center leading-relaxed font-serif">
                                                        "{t.quote}"
                                                    </p>
                                                    <div className="flex flex-col items-center gap-4">
                                                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-secondary border-2 overflow-hidden shadow-xl">
                                                            {t.avatar && <img src={t.avatar} className="w-full h-full object-cover" />}
                                                        </div>
                                                        <div className="text-center">
                                                            <p className="font-black text-base md:text-lg">{t.author}</p>
                                                            <p className="text-[10px] md:text-sm text-muted-foreground uppercase tracking-widest font-bold">{t.role}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </section>
                                    ) : null;
                                case 'team':
                                    return (project.visibility?.showTeam && project.teamMembers && project.teamMembers.length > 0) ? (
                                        <section key="team" className="space-y-12 pt-12 border-t">
                                            <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-center">The Collaborative Force</h2>
                                            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                                                {project.teamMembers.map((member, i) => (
                                                    <div key={i} className="flex flex-col items-center gap-4 text-center group">
                                                        <a href={member.url} target="_blank" rel="noreferrer" className="block relative">
                                                            <div className="w-20 h-20 md:w-32 md:h-32 rounded-full border-4 border-muted overflow-hidden group-hover:border-primary transition-colors shadow-xl">
                                                                {member.avatar ? (
                                                                    <img src={member.avatar} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <div className="w-full h-full bg-secondary flex items-center justify-center"><Users className="w-8 h-8 md:w-10 md:h-10 text-muted-foreground/30" /></div>
                                                                )}
                                                            </div>
                                                            <div className="absolute -bottom-2 right-0 p-2 bg-primary text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"><ExternalLink className="w-3 h-3" /></div>
                                                        </a>
                                                        <div>
                                                            <p className="text-lg md:text-xl font-black">{member.name}</p>
                                                            <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-primary">{member.role}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    ) : null;
                                case 'process_steps':
                                    return (project.visibility?.showProcess && project.processSteps && project.processSteps.length > 0) ? (
                                        <section key="process" className="space-y-16">
                                            <div className="space-y-4">
                                                <h2 className="text-3xl md:text-5xl font-black tracking-tighter">Execution Strategy</h2>
                                                <p className="text-lg text-muted-foreground max-w-2xl">A systematic approach to solving complex problems through phased development.</p>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                {project.processSteps.map((step, i) => (
                                                    <div key={i} className="p-8 md:p-12 bg-secondary/5 rounded-[3rem] border border-secondary/20 hover:border-primary/30 transition-all space-y-6 group">
                                                        <div className="flex items-center justify-between">
                                                            <div className="p-4 bg-background rounded-[1.5rem] border shadow-sm group-hover:scale-110 transition-transform">
                                                                <Clock className="w-6 h-6 text-primary" />
                                                            </div>
                                                            <span className="text-5xl font-black opacity-5 group-hover:opacity-10 transition-opacity">0{i + 1}</span>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <h3 className="text-2xl font-black">{step.title}</h3>
                                                            <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    ) : null;
                                case 'tech_stack':
                                    return (project.visibility?.showTech && project.techStack && project.techStack.length > 0) ? (
                                        <section key="tech" className="space-y-12 p-8 md:p-16 bg-primary/[0.02] rounded-[3rem] md:rounded-[4rem] border-2 border-primary/5">
                                            <div className="text-center space-y-4">
                                                <h2 className="text-3xl md:text-5xl font-black tracking-tighter">Technology Core</h2>
                                                <div className="h-1.5 w-24 bg-primary/20 mx-auto rounded-full" />
                                            </div>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                                                {project.techStack.map((tech, i) => (
                                                    <div key={i} className="flex flex-col items-center gap-4 p-6 bg-background rounded-3xl border shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500">
                                                        <div className="w-12 h-12 flex items-center justify-center bg-primary/5 rounded-2xl">
                                                            <Cpu className="w-6 h-6 text-primary" />
                                                        </div>
                                                        <div className="text-center">
                                                            <p className="font-black text-xs uppercase tracking-wider">{tech.name}</p>
                                                            <p className="text-[9px] font-bold text-primary/60">{tech.level || "Primary"}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    ) : null;
                                case 'feature_list':
                                    return (project.visibility?.showFeatures && project.features && project.features.length > 0) ? (
                                        <section key="features" className="space-y-12">
                                            <div className="space-y-2">
                                                <h2 className="text-3xl font-black tracking-tight flex items-center gap-4">
                                                    <Sparkles className="w-8 h-8 text-primary" /> Core Capabilities
                                                </h2>
                                                <p className="text-muted-foreground font-medium">Key functionalities that drive the user experience.</p>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {project.features.map((feature, i) => (
                                                    <div key={i} className="flex items-start gap-6 p-8 bg-card rounded-[2.5rem] border hover:border-primary/20 transition-all shadow-sm">
                                                        <div className="bg-primary/10 p-3 rounded-2xl shrink-0">
                                                            <CheckCircle2 className="w-5 h-5 text-primary" />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <h3 className="font-black text-xl">{feature.title}</h3>
                                                            {feature.description && <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    ) : null;
                                case 'comparison':
                                    return (project.visibility?.showComparison && project.comparison && project.comparison.length > 0) ? (
                                        <section key="comparison" className="space-y-12">
                                            <div className="space-y-4">
                                                <div className="p-3 bg-primary/10 text-primary rounded-2xl w-fit"><ArrowLeftRight className="w-6 h-6" /></div>
                                                <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-center md:text-left">Measure of Success</h2>
                                            </div>
                                            <div className="space-y-8">
                                                {project.comparison.map((item, i) => (
                                                    <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-px bg-primary/10 rounded-[3rem] overflow-hidden border shadow-xl">
                                                        <div className="p-10 md:p-16 bg-background space-y-6">
                                                            <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground">Before</h4>
                                                            <p className="text-xl md:text-2xl font-medium leading-relaxed italic opacity-60">"{item.before}"</p>
                                                        </div>
                                                        <div className="p-10 md:p-16 bg-primary/5 space-y-6">
                                                            <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary">After</h4>
                                                            <p className="text-xl md:text-2xl font-medium leading-relaxed">"{item.after}"</p>
                                                            {item.caption && <p className="text-xs text-primary/60 font-black uppercase tracking-widest">{item.caption}</p>}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    ) : null;
                                case 'user_personas':
                                    return (project.visibility?.showUserPersonas && project.userPersonas && project.userPersonas.length > 0) ? (
                                        <section key="personas" className="space-y-16">
                                            <div className="space-y-4">
                                                <h2 className="text-3xl md:text-5xl font-black tracking-tighter">Understanding Users</h2>
                                                <p className="text-lg text-muted-foreground max-w-2xl">Empathizing with the people who interact with the system.</p>
                                            </div>
                                            <div className="space-y-12">
                                                {project.userPersonas.map((p, i) => (
                                                    <div key={i} className="p-8 md:p-12 bg-secondary/5 rounded-[3rem] md:rounded-[4rem] border border-secondary/20 space-y-10 group hover:border-primary/20 transition-all duration-500">
                                                        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                                                            <div className="w-24 h-24 md:w-40 md:h-40 rounded-[2.5rem] bg-gradient-to-br from-primary/10 to-primary/5 border-2 flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-500">
                                                                {p.avatar ? (
                                                                    <img src={p.avatar} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <UserSearch className="w-12 h-12 md:w-20 md:h-20 text-primary/30" />
                                                                )}
                                                            </div>
                                                            <div className="space-y-4">
                                                                <div className="space-y-1">
                                                                    <h3 className="text-3xl md:text-5xl font-black tracking-tighter text-primary">{p.name}</h3>
                                                                    <p className="text-sm md:text-lg font-bold uppercase tracking-[0.1em] opacity-60">{p.role}</p>
                                                                </div>
                                                                <p className="text-lg md:text-xl leading-relaxed text-muted-foreground italic">"{p.bio}"</p>
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-secondary/20">
                                                            <div className="space-y-6">
                                                                <h4 className="font-black text-xs uppercase tracking-[0.2em] text-primary flex items-center gap-3"><Sparkles className="w-4 h-4" /> Core Goals</h4>
                                                                <p className="text-sm md:text-base leading-loose whitespace-pre-wrap">{p.goals}</p>
                                                            </div>
                                                            <div className="space-y-6">
                                                                <h4 className="font-black text-xs uppercase tracking-[0.2em] text-destructive flex items-center gap-3"><X className="w-4 h-4" /> Key Pain Points</h4>
                                                                <p className="text-sm md:text-base leading-loose whitespace-pre-wrap opacity-70">{p.pains}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    ) : null;
                                case 'roadmap':
                                    return (project.visibility?.showRoadmap && project.roadmap && project.roadmap.length > 0) ? (
                                        <section key="roadmap" className="space-y-16">
                                            <div className="text-center space-y-4">
                                                <h2 className="text-3xl md:text-6xl font-black tracking-tighter">Evolutionary Roadmap</h2>
                                                <p className="text-muted-foreground max-w-xl mx-auto">Visualizing the future trajectory and iterative growth of the project.</p>
                                            </div>
                                            <div className="relative">
                                                <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/5 via-primary/20 to-primary/5 hidden md:block" />
                                                <div className="space-y-12 relative">
                                                    {project.roadmap.map((item, i) => (
                                                        <div key={i} className={`flex flex-col md:flex-row items-center gap-8 md:gap-24 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                                                            <div className={`md:flex-1 space-y-4 text-center ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                                                                <span className={`px-4 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border shadow-sm ${item.status === 'Completed' ? 'bg-green-500/10 text-green-600 border-green-500/20' :
                                                                    item.status === 'In Progress' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20 animate-pulse' :
                                                                        'bg-slate-500/10 text-slate-600 border-slate-500/20'
                                                                    }`}>{item.status}</span>
                                                                <h3 className="text-2xl md:text-4xl font-black tracking-tighter">{item.title}</h3>
                                                                <p className="text-sm font-bold opacity-40 uppercase tracking-[0.2em]">{item.date}</p>
                                                            </div>
                                                            <div className="w-12 h-12 rounded-full border-4 border-background bg-primary shadow-xl z-10 shrink-0 flex items-center justify-center">
                                                                <GitMerge className="w-5 h-5 text-primary-foreground" />
                                                            </div>
                                                            <div className="md:flex-1 hidden md:block" />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </section>
                                    ) : null;
                                case 'reflections':
                                    return (project.visibility?.showReflections && project.reflections && project.reflections.length > 0) ? (
                                        <section key="reflections" className="space-y-12">
                                            <div className="space-y-4">
                                                <h2 className="text-3xl md:text-5xl font-black tracking-tighter italic">Deep Reflections</h2>
                                                <p className="text-lg text-muted-foreground font-serif leading-relaxed italic">Insights gained and the philosophy behind the execution.</p>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                {project.reflections.map((r, i) => (
                                                    <div key={i} className="p-10 md:p-12 bg-yellow-500/5 rounded-[3.5rem] border border-yellow-500/10 space-y-6 relative overflow-hidden group">
                                                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-125 transition-transform duration-1000">
                                                            <Lightbulb className="w-48 h-48" />
                                                        </div>
                                                        <div className="p-4 bg-yellow-500/10 rounded-2xl w-fit text-yellow-600">
                                                            <Lightbulb className="w-6 h-6" />
                                                        </div>
                                                        <h3 className="text-3xl font-black tracking-tighter leading-tight italic">{r.title}</h3>
                                                        <p className="text-base md:text-lg leading-loose text-foreground/80 font-serif italic whitespace-pre-wrap">{r.content}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    ) : null;
                                case 'architecture':
                                    return (project.visibility?.showArchitecture && project.architecture && project.architecture.length > 0) ? (
                                        <section key="architecture" className="space-y-12">
                                            <div className="space-y-4">
                                                <div className="p-3 bg-primary/10 text-primary rounded-2xl w-fit"><Cpu className="w-8 h-8" /></div>
                                                <h2 className="text-3xl md:text-5xl font-black tracking-tighter">{labels.architectureTitle}</h2>
                                            </div>
                                            <div className="space-y-16">
                                                {project.architecture.map((item, i) => (
                                                    <div key={i} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                                        <div className="space-y-6">
                                                            <h3 className="text-2xl md:text-3xl font-black tracking-tight">{item.title}</h3>
                                                            <p className="text-lg text-muted-foreground leading-relaxed">{item.description}</p>
                                                        </div>
                                                        {item.image && (
                                                            <div className="rounded-[3rem] overflow-hidden border-8 border-muted shadow-2xl bg-muted aspect-video">
                                                                <img src={item.image} alt={item.title} className="w-full h-full object-contain p-4" />
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    ) : null;
                                case 'perf_seo':
                                    return (project.visibility?.showPerfSeo && project.perfSeo) ? (
                                        <section key="perfseo" className="space-y-12">
                                            <div className="space-y-4">
                                                <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl w-fit"><Gauge className="w-8 h-8" /></div>
                                                <h2 className="text-3xl md:text-5xl font-black tracking-tighter">{labels.perfSeoTitle}</h2>
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                                                {[
                                                    { label: "Performance", value: project.perfSeo.performance, icon: Gauge, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                                                    { label: "Accessibility", value: project.perfSeo.accessibility, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
                                                    { label: "Best Practices", value: project.perfSeo.bestPractices, icon: CheckCircle2, color: "text-purple-500", bg: "bg-purple-500/10" },
                                                    { label: "SEO", value: project.perfSeo.seo, icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-500/10" },
                                                ].map((metric, i) => (
                                                    <div key={i} className="p-8 bg-card rounded-[2.5rem] border-2 border-muted text-center space-y-4 group hover:border-primary/20 transition-all">
                                                        <div className={`p-4 ${metric.bg} ${metric.color} rounded-2xl w-fit mx-auto group-hover:scale-110 transition-transform`}>
                                                            <metric.icon className="w-6 h-6" />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <div className={`text-4xl font-black tracking-tighter ${metric.color}`}>{metric.value}</div>
                                                            <div className="text-[10px] uppercase font-black tracking-widest opacity-40">{metric.label}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    ) : null;
                                case 'tech_deep_dive':
                                    return (project.visibility?.showTechnicalDeepDive && project.technicalDeepDive && project.technicalDeepDive.length > 0) ? (
                                        <section key="deepdive" className="space-y-12">
                                            <div className="flex items-center gap-6">
                                                <div className="p-5 bg-blue-500/10 text-blue-500 rounded-3xl"><Terminal className="w-10 h-10" /></div>
                                                <div className="space-y-1">
                                                    <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-[0.8]">Technical Core</h2>
                                                    <p className="text-sm font-black uppercase tracking-[0.2em] opacity-40">Engineering Excellence</p>
                                                </div>
                                            </div>
                                            <div className="space-y-12">
                                                {project.technicalDeepDive.map((d, i) => (
                                                    <div key={i} className="bg-slate-950 rounded-[3rem] border border-slate-800 overflow-hidden shadow-2xl">
                                                        <div className="p-8 md:p-12 lg:p-16 space-y-10">
                                                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                                                                <div className="lg:col-span-1 space-y-6 pt-4">
                                                                    <h3 className="text-2xl md:text-3xl font-black tracking-tight text-white">{d.title}</h3>
                                                                    <p className="text-slate-400 text-sm md:text-base leading-relaxed">{d.description}</p>
                                                                </div>
                                                                <div className="lg:col-span-2 space-y-4">
                                                                    <div className="flex items-center justify-between px-6 py-3 bg-slate-900 rounded-t-2xl border-x border-t border-slate-800">
                                                                        <div className="flex gap-1.5">
                                                                            <div className="w-3 h-3 rounded-full bg-slate-800" />
                                                                            <div className="w-3 h-3 rounded-full bg-slate-800" />
                                                                            <div className="w-3 h-3 rounded-full bg-slate-800" />
                                                                        </div>
                                                                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{d.language || 'typescript'}</span>
                                                                    </div>
                                                                    <pre className="p-6 md:p-10 bg-slate-900/50 border border-slate-800 rounded-b-2xl overflow-x-auto">
                                                                        <code className="text-xs md:text-sm font-mono text-blue-300 leading-relaxed block">
                                                                            {d.code}
                                                                        </code>
                                                                    </pre>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    ) : null;
                                case 'faq':
                                    return (project.visibility?.showFaq && project.faq && project.faq.length > 0) ? (
                                        <section key="faq" className="space-y-12">
                                            <div className="space-y-4">
                                                <div className="p-3 bg-primary/10 text-primary rounded-2xl w-fit"><Lightbulb className="w-8 h-8" /></div>
                                                <h2 className="text-3xl md:text-5xl font-black tracking-tighter">{labels.faqTitle}</h2>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                {project.faq.map((item, i) => (
                                                    <div key={i} className="p-10 bg-secondary/5 rounded-[3rem] border space-y-6 group hover:bg-secondary/10 transition-colors">
                                                        <div className="flex gap-4 items-start">
                                                            <div className="p-2 bg-primary/20 text-primary rounded-lg shrink-0 mt-1">
                                                                <HelpCircle className="w-4 h-4" />
                                                            </div>
                                                            <h3 className="text-xl font-black leading-tight">{item.question}</h3>
                                                        </div>
                                                        <p className="text-muted-foreground leading-relaxed pl-10 border-l border-primary/20">{item.answer}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    ) : null;
                                case 'design_decisions':
                                    return (project.visibility?.showDesignDecisions && project.designDecisions && project.designDecisions.length > 0) ? (
                                        <section key="decisions" className="space-y-12">
                                            <div className="space-y-4">
                                                <div className="p-3 bg-purple-500/10 text-purple-500 rounded-2xl w-fit"><Sparkles className="w-8 h-8" /></div>
                                                <h2 className="text-3xl md:text-5xl font-black tracking-tighter">{labels.designDecisionsTitle}</h2>
                                            </div>
                                            <div className="space-y-8">
                                                {project.designDecisions.map((item, i) => (
                                                    <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-px bg-purple-500/10 rounded-[3rem] overflow-hidden border shadow-xl">
                                                        <div className="p-10 md:p-16 bg-background space-y-6">
                                                            <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground opacity-60">The Rationale</h4>
                                                            <div className="space-y-4">
                                                                <h3 className="text-2xl font-black tracking-tight">{item.title}</h3>
                                                                <p className="text-lg text-muted-foreground leading-relaxed italic">"{item.rationale}"</p>
                                                            </div>
                                                        </div>
                                                        <div className="p-10 md:p-16 bg-purple-500/5 space-y-6 flex flex-col justify-center">
                                                            <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] text-purple-600">The Decision</h4>
                                                            <p className="text-2xl md:text-3xl font-black tracking-tighter leading-tight text-purple-700">{item.choice}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    ) : null;
                                case 'success_metrics':
                                    return (project.visibility?.showSuccessMetrics && project.successMetrics && project.successMetrics.length > 0) ? (
                                        <section key="metrics" className="space-y-12">
                                            <div className="space-y-4">
                                                <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl w-fit"><Trophy className="w-8 h-8" /></div>
                                                <h2 className="text-3xl md:text-5xl font-black tracking-tighter">{labels.successMetricsTitle}</h2>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {project.successMetrics.map((item, i) => (
                                                    <div key={i} className="p-10 bg-emerald-500/[0.03] rounded-[3.5rem] border-2 border-emerald-500/10 space-y-8 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
                                                        <div className="flex justify-between items-start">
                                                            <div className="space-y-1">
                                                                <p className="text-[10px] uppercase font-black tracking-[0.2em] opacity-40">{item.label}</p>
                                                                <h3 className="text-5xl font-black tracking-tighter text-emerald-600">{item.value}</h3>
                                                            </div>
                                                            <div className={`p-2 rounded-full ${item.trend === 'up' ? 'bg-emerald-500 text-white' : item.trend === 'down' ? 'bg-red-500 text-white' : 'bg-slate-500 text-white'}`}>
                                                                {item.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : item.trend === 'down' ? <TrendingUp className="w-4 h-4 rotate-180" /> : <TrendingUp className="w-4 h-4 rotate-90" />}
                                                            </div>
                                                        </div>
                                                        {item.goal && (
                                                            <div className="space-y-2">
                                                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-60">
                                                                    <span>Progress to Goal</span>
                                                                    <span>Target: {item.goal}</span>
                                                                </div>
                                                                <div className="h-2 bg-emerald-500/10 rounded-full overflow-hidden">
                                                                    <div className="h-full bg-emerald-500" style={{ width: '85%' }} />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    ) : null;
                                default:
                                    return null;
                            }
                        };
                        const content = renderContent();
                        if (!content) return null;
                        return (
                            <motion.div
                                key={`project-section-${sectionId}`}
                                initial={{ opacity: 0, y: 60 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-10%" }}
                                transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
                            >
                                {content}
                            </motion.div>
                        );
                    })}
                </div>

                <motion.aside
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="space-y-12"
                >
                    <div className="p-6 md:p-10 bg-secondary/10 rounded-[2rem] md:rounded-[3rem] border-2 space-y-10 sticky top-24">
                        <div className="space-y-8">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">{labels.aboutTitle}</h3>

                            <div className="space-y-6">
                                <div className="flex items-center gap-5">
                                    <div className="p-3 bg-background rounded-2xl border shadow-sm"><User className="w-5 h-5 text-primary" /></div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">{labels.roleLabel}</p>
                                        <p className="text-base font-black">{project.role || "Lead Developer"}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-5">
                                    <div className="p-3 bg-background rounded-2xl border shadow-sm"><Calendar className="w-5 h-5 text-primary" /></div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">{labels.dateLabel}</p>
                                        <p className="text-base font-black">{new Date(project.updatedAt?.toMillis() || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-5">
                                    <div className="p-3 bg-background rounded-2xl border shadow-sm"><Tag className="w-5 h-5 text-primary" /></div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">{labels.techLabel}</p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {project.tags.map(tag => (
                                                <span key={tag} className="text-[9px] bg-primary/10 text-primary px-3 py-1 rounded-full font-black uppercase">{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {project.documents && project.documents.length > 0 && (
                            <div className="pt-10 border-t space-y-6">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">{labels.resourcesTitle}</h3>
                                <div className="space-y-3">
                                    {project.documents.map((doc, i) => (
                                        <a
                                            key={i}
                                            href={doc.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center justify-between p-4 bg-background border-2 rounded-2xl hover:border-primary transition-all group"
                                        >
                                            <div className="flex items-center gap-3 truncate">
                                                <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center"><FileText className="w-4 h-4 text-primary" /></div>
                                                <span className="text-xs font-black truncate">{doc.name}</span>
                                            </div>
                                            <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="pt-10 border-t space-y-4">
                            {project.github && (
                                <Button asChild className="w-full justify-between rounded-2xl py-8 px-6 text-sm font-black" variant="outline">
                                    <a href={project.github} target="_blank" rel="noreferrer">
                                        <span className="flex items-center"><Github className="w-6 h-6 mr-4" /> {labels.githubButton}</span>
                                        <ArrowRight className="w-4 h-4 opacity-50" />
                                    </a>
                                </Button>
                            )}
                            {project.link && (
                                <Button asChild className="w-full justify-between rounded-2xl py-8 px-6 text-sm font-black bg-primary text-primary-foreground shadow-2xl shadow-primary/30">
                                    <a href={project.link} target="_blank" rel="noreferrer">
                                        <span className="flex items-center"><ExternalLink className="w-6 h-6 mr-4" /> {labels.demoButton}</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </a>
                                </Button>
                            )}
                        </div>
                    </div>
                </motion.aside>
            </div>

            {nextProject && (
                <motion.footer
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 0.7 }}
                    className="pt-32 border-t"
                >
                    <Link to={`/project/${nextProject.id}`} className="group block space-y-8 text-center md:text-left">
                        <p className="text-sm font-black uppercase tracking-[0.3em] text-muted-foreground">{labels.nextProjectLabel}</p>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-12">
                            <h2 className="text-5xl md:text-9xl font-black tracking-tighter group-hover:text-primary transition-colors leading-[0.8]">
                                {nextProject.title}
                            </h2>
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-primary-foreground transition-all shadow-xl group-hover:scale-110 duration-500">
                                <ArrowRight className="w-12 h-12 group-hover:translate-x-3 transition-transform duration-500" />
                            </div>
                        </div>
                    </Link>
                </motion.footer>
            )}
        </main>
    );
}
