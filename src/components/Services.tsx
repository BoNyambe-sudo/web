import * as React from "react";
import {
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  Mail,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Whatsapp from "@/components/icons/whatsapp";
import MongoDB from "@/components/icons/MongoDB";
import Angular from "@/components/icons/Angular";
import NestJS from "@/components/icons/NestJS";
import NodeJS from "@/components/icons/NodeJS";
import { WHATSAPP_LINK, EMAIL } from "@/lib/constants";
import { SITE_URL } from "@/lib/seoConfig";

type TechStackItem = {
  label: string;
  icon: React.ReactNode;
  color: string;
  colorDark: string;
};

const techStackItems: TechStackItem[] = [
  { label: "MongoDB", icon: <MongoDB />, color: "bg-green-50 text-green-700 border-green-200", colorDark: "dark:bg-green-950 dark:text-green-300 dark:border-green-800" },
  { label: "Angular", icon: <Angular />, color: "bg-red-50 text-red-700 border-red-200", colorDark: "dark:bg-red-950 dark:text-red-300 dark:border-red-800" },
  { label: "Nest JS", icon: <NestJS />, color: "bg-red-50 text-red-700 border-red-200", colorDark: "dark:bg-red-950 dark:text-red-300 dark:border-red-800" },
  { label: "Node.js", icon: <NodeJS />, color: "bg-green-50 text-green-700 border-green-200", colorDark: "dark:bg-green-950 dark:text-green-300 dark:border-green-800" },
];

interface CarouselItem {
  id: number;
  title: string;
  description: string;
  image: string;
}

const SECTIONS = [
  { id: "tech-stack", label: "Tech Stack" },
  { id: "services", label: "Services" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

const COLORS = ["#6cac48", "#b52e31", "#ea2845", "#8cc84b"] as const;
const SECTION_DURATION = 5000;
const CAROUSEL_INTERVAL = 2500;

const Services = ({ images }: { images: Record<string, string> }) => {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const [activeSectionIndex, setActiveSectionIndex] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [activeCarouselIndex, setActiveCarouselIndex] = React.useState(0);
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  const carouselItems: CarouselItem[] = [
    { id: 0, title: "Custom Admin Panels", description: "Powerful dashboards with real-time data visualization, role-based access control, and intuitive management interfaces.", image: images.adminPanel },
    { id: 1, title: "SEO-Optimized Sites", description: "Built with semantic HTML, meta tags, structured data, and performance optimization for maximum search engine visibility.", image: images.seo },
    { id: 2, title: "Responsive Websites", description: "Mobile-first design approach ensuring perfect display on phones, tablets, and desktops with fluid layouts.", image: images.responsive },
    { id: 3, title: "Dark/Light Mode", description: "Seamless theme switching with CSS custom properties, respecting user preferences and system settings.", image: images.theme },
    { id: 4, title: "Accessible Sites", description: "WCAG compliant interfaces with proper ARIA labels, keyboard navigation, screen reader support, and focus management.", image: images.accessibility },
    { id: 5, title: "Performance First", description: "Optimized loading with code splitting, lazy loading, efficient caching, and Core Web Vitals optimization.", image: images.performance },
  ];

  const projectItems = [
    { id: "project-1", title: "E-Commerce Platform", description: "A full-featured online store with payment integration, inventory management, and real-time order tracking.", link: "https://oop-online-store-frontend.vercel.app" },
  ];

  React.useEffect(() => {
    if (!isPlaying || isTransitioning) return;
    const shouldWait = activeSectionIndex === 1 && activeCarouselIndex < carouselItems.length - 1;
    if (shouldWait) return;
    const t = window.setTimeout(() => {
      setActiveSectionIndex((i) => (i + 1) % SECTIONS.length);
    }, SECTION_DURATION);
    return () => window.clearTimeout(t);
  }, [activeSectionIndex, isPlaying, isTransitioning, activeCarouselIndex]);

  React.useEffect(() => {
    if (activeSectionIndex !== 1 || !isPlaying || isTransitioning) return;
    if (activeCarouselIndex >= carouselItems.length - 1) return;
    const t = window.setInterval(() => {
      setActiveCarouselIndex((i) => i + 1);
    }, CAROUSEL_INTERVAL);
    return () => window.clearInterval(t);
  }, [activeSectionIndex, isPlaying, isTransitioning, activeCarouselIndex]);

  const switchTo = (newIndex: number) => {
    if (isTransitioning || newIndex === activeSectionIndex) return;
    if (newIndex < 0 || newIndex >= SECTIONS.length) return;
    setIsTransitioning(true);
    setActiveCarouselIndex(0);
    setActiveSectionIndex(newIndex);
    window.setTimeout(() => setIsTransitioning(false), 350);
  };

  const handleCarouselNav = (dir: "prev" | "next") => {
    setActiveCarouselIndex((prev) =>
      dir === "next"
        ? Math.min(prev + 1, carouselItems.length - 1)
        : Math.max(prev - 1, 0),
    );
  };

  const sectionBase =
    "absolute inset-0 items-center justify-center p-4 sm:p-8 transition-opacity duration-500";

  return (
    <div className="h-screen w-screen bg-background text-foreground flex flex-col relative overflow-hidden">
      <header className="absolute top-0 left-0 right-0 z-40 px-4 sm:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <a href="/web/" className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm font-medium hover:bg-muted">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
            Back
          </a>
        </div>
      </header>

      <div className="flex-1 relative overflow-hidden">
        <section id="tech-stack" className={`${sectionBase} bg-linear-to-br from-muted/30 via-background to-secondary/20 ${activeSectionIndex === 0 ? "flex opacity-100" : "opacity-0 pointer-events-none"}`} aria-hidden={activeSectionIndex !== 0}>
          <div className="w-full max-w-4xl mx-auto flex flex-col">
            <div className="text-center mb-8 sm:mb-12">
              <span className="text-xs font-semibold tracking-widest text-primary uppercase block">TECHNOLOGY STACK</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mt-3">Technologies I Work With</h2>
              <p className="text-muted-foreground text-xs sm:text-sm mt-4">I use the MANN stack - MongoDB, Angular, NestJS, and Node.js - for end-to-end Typescript development. It gives me flexible, scalable data, modular backend architecture, and responsive UIs in one cohesive stack. That means faster builds, cleaner code, and apps that scale without losing performance or maintainability.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8">
              {techStackItems.map((item, index) => (
                <div key={item.label} className="flex flex-col items-center gap-3">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center rounded-xl border-2 shadow-md transition-all duration-300" style={{ borderColor: COLORS[index % COLORS.length] }}>
                    {item.icon}
                  </div>
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${item.color} ${item.colorDark}`}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="services" className={`${sectionBase} bg-background ${activeSectionIndex === 1 ? "flex opacity-100" : "opacity-0 pointer-events-none"}`} aria-hidden={activeSectionIndex !== 1}>
          <div className="w-full max-w-4xl mx-auto flex flex-col">
            <div className="text-center mb-2 md:mb-6">
              <span className="text-xs font-semibold tracking-widest text-primary uppercase block">FEATURES & CAPABILITIES</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-3">What I Deliver</h2>
            </div>
            <div className="relative w-full h-72 sm:h-80" aria-live="polite" aria-atomic="true" role="region" aria-label="Feature carousel">
              <div className="relative w-full h-full overflow-hidden">
                {carouselItems.map((item, index) => (
                  <div key={item.id} className={`absolute inset-0 md:p-8 flex flex-col md:flex-row gap-3 md:gap-8 justify-center transition-opacity duration-500 ${index === activeCarouselIndex ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
                    <div className="w-full md:w-1/2 relative rounded-lg overflow-hidden">
                      <img src={item.image} alt={`image of ${item.title}`} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col gap-1 md:gap-4 text-center md:text-start w-full md:w-1/2">
                      <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">{item.title}</h3>
                      <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute -bottom-4 md:bottom-1 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {carouselItems.map((_, i) => (
                  <button key={i} onClick={() => setActiveCarouselIndex(i)} className={`rounded-full transition-all duration-300 ${i === activeCarouselIndex ? "bg-primary w-6 h-2.5" : "bg-muted-foreground/50 hover:bg-muted-foreground/80 w-2.5 h-2.5"}`} aria-label={`Slide ${i + 1}`} />
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between mt-5">
              <Button variant="outline" size="icon" onClick={() => handleCarouselNav("prev")} disabled={activeCarouselIndex === 0} aria-label="Previous"><ChevronLeft className="h-4 w-4" /></Button>
              <span className="text-sm text-muted-foreground font-medium">{activeCarouselIndex + 1} / {carouselItems.length}</span>
              <Button variant="outline" size="icon" onClick={() => handleCarouselNav("next")} disabled={activeCarouselIndex === carouselItems.length - 1} aria-label="Next"><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>
        </section>

        <section id="projects" className={`${sectionBase} bg-muted/30 ${activeSectionIndex === 2 ? "flex opacity-100" : "opacity-0 pointer-events-none"}`} aria-hidden={activeSectionIndex !== 2}>
          <div className="w-full max-w-3xl mx-auto flex flex-col">
            <div className="text-center mb-8">
              <span className="text-xs font-semibold tracking-widest text-primary uppercase block">PORTFOLIO</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-3">Featured Projects</h2>
              <p className="text-muted-foreground mt-4">A selection of my deployed work</p>
            </div>
            <Accordion type="single" collapsible className="w-full space-y-3">
              {projectItems.map((project) => (
                <AccordionItem key={project.id} value={project.id} className="bg-card border border-border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline text-left"><span className="font-semibold text-foreground">{project.title}</span></AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{project.description}</p>
                    <Button variant="outline" size="sm" asChild>
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">View Deployed Project <ExternalLink className="h-4 w-4" /></a>
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2"><code className="bg-muted px-1.5 py-0.5 rounded text-xs">{project.link}</code></p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section id="contact" className={`${sectionBase} bg-linear-to-br from-primary/5 via-background to-secondary/10 ${activeSectionIndex === 3 ? "flex opacity-100" : "opacity-0 pointer-events-none"}`} aria-hidden={activeSectionIndex !== 3}>
          <div className="w-full max-w-2xl mx-auto flex flex-col">
            <div className="text-center mb-8">
              <span className="text-xs font-semibold tracking-widest text-primary uppercase block">GET IN TOUCH</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-3">Let's Connect</h2>
              <p className="text-muted-foreground text-xs sm:text-sm mt-4">Got an idea, a product, or a problem to solve? Let's talk. I'm always open to new projects, collaborations, and conversations about building scalable apps. Drop a message and I'll get back to you.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto w-full">
              <div className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50 bg-card group rounded-xl">
                <div className="pb-3 p-6">
                  <div className="flex items-center gap-3 text-lg font-semibold"><div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center group-hover:scale-110 transition-transform"><Whatsapp className="text-green-600 dark:text-green-400" size={22} /></div>WhatsApp</div>
                </div>
                <div className="p-6 pt-0">
                  <p className="text-sm text-muted-foreground mb-3">Quick chat anytime</p>
                  <Button variant="default" className="w-full bg-green-600 hover:bg-green-700 text-white" asChild>
                    <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2"><Whatsapp size={16} /> Chat on WhatsApp</a>
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">+260978000956</p>
                </div>
              </div>
              <div className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50 bg-card group rounded-xl">
                <div className="pb-3 p-6">
                  <div className="flex items-center gap-3 text-lg font-semibold"><div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center group-hover:scale-110 transition-transform"><Mail className="text-primary" size={22} /></div>Email</div>
                </div>
                <div className="p-6 pt-0">
                  <p className="text-sm text-muted-foreground mb-3">Send me a message</p>
                  <Button variant="outline" className="w-full" asChild>
                    <a href={`mailto:${EMAIL}`} className="inline-flex items-center gap-2"><Mail size={16} /> Send Email</a>
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2 truncate">{EMAIL}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none" aria-label="Page navigation">
        <div className="flex flex-col items-center sm:items-start pb-4 sm:pb-6 sm:pl-6">
          <div className="pointer-events-auto flex items-center justify-center gap-2 bg-card/80 backdrop-blur-lg border border-border rounded-full px-4 py-2 shadow-lg">
            {SECTIONS.map((section, index) => (
              <button key={section.id} onClick={() => switchTo(index)} className={`rounded-full transition-all duration-300 ${index === activeSectionIndex ? "bg-primary w-6 h-2.5" : "bg-muted-foreground/50 hover:bg-muted-foreground/80 w-2.5 h-2.5"}`} aria-label={`Go to ${section.label}`} title={section.label} />
            ))}
          </div>
          <div className="pointer-events-auto flex gap-2 mt-3">
            <Button variant="ghost" size="sm" onClick={() => setIsPlaying(!isPlaying)} className="bg-card/60 backdrop-blur-lg border border-border text-foreground hover:bg-card" aria-label={isPlaying ? "Pause" : "Play"}>
              {isPlaying ? <><Pause className="h-4 w-4 mr-1" />Pause</> : <><Play className="h-4 w-4 mr-1" />Play</>}
            </Button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Services;
