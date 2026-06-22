import { useRef, useState, useEffect, type ElementType } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ChevronRight, ChevronLeft, Play, Pause, Mail, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SEOHelmet from "@/components/SEOHelmet";
import { SITE_URL, getOrganizationSchema } from "@/lib/seoConfig";
import { useIsMobile } from "@/hooks/use-mobile";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import Whatsapp from "@/components/icons/whatsapp";

gsap.registerPlugin(SplitText);

type TechStackItem = {
  label: string;
  icon: ElementType;
  color: string;
  colorDark: string;
};

const techStackItems: TechStackItem[] = [
  { label: "MongoDB", icon: () => <span className="text-green-500 text-2xl">🍃</span>, color: "bg-green-50 text-green-700 border-green-200", colorDark: "dark:bg-green-950 dark:text-green-300 dark:border-green-800" },
  { label: "Angular", icon: () => <span className="text-red-500 text-2xl">🅰️</span>, color: "bg-red-50 text-red-700 border-red-200", colorDark: "dark:bg-red-950 dark:text-red-300 dark:border-red-800" },
  { label: "Nest JS", icon: () => <span className="text-red-600 text-2xl">🐈</span>, color: "bg-red-50 text-red-700 border-red-200", colorDark: "dark:bg-red-950 dark:text-red-300 dark:border-red-800" },
  { label: "Node.js", icon: () => <span className="text-green-600 text-2xl">💚</span>, color: "bg-green-50 text-green-700 border-green-200", colorDark: "dark:bg-green-950 dark:text-green-300 dark:border-green-800" },
];

type CarouselItem = {
  id: number;
  title: string;
  description: string;
};

const carouselItems: CarouselItem[] = [
  { id: 0, title: "Custom Admin Panels", description: "Powerful dashboards with real-time data visualization, role-based access control, and intuitive management interfaces." },
  { id: 1, title: "SEO-Optimized Sites", description: "Built with semantic HTML, meta tags, structured data, and performance optimization for maximum search engine visibility." },
  { id: 2, title: "Responsive Websites", description: "Mobile-first design approach ensuring perfect display on phones, tablets, and desktops with fluid layouts." },
  { id: 3, title: "Dark/Light Mode", description: "Seamless theme switching with CSS custom properties, respecting user preferences and system settings." },
  { id: 4, title: "Accessible Sites", description: "WCAG compliant interfaces with proper ARIA labels, keyboard navigation, screen reader support, and focus management." },
  { id: 5, title: "Performance First", description: "Optimized loading with code splitting, lazy loading, efficient caching, and Core Web Vitals optimization." },
];

const projectItems = [
  { id: "project-1", title: "E-Commerce Platform", description: "A full-featured online store with payment integration, inventory management, and real-time order tracking.", link: "https://example.com/ecommerce" },
  { id: "project-2", title: "Healthcare Dashboard", description: "Patient management system with appointment scheduling, medical records, and analytics for healthcare providers.", link: "https://example.com/healthcare" },
  { id: "project-3", title: "Real Estate Portal", description: "Property listing platform with advanced search, virtual tours, and agent management system.", link: "https://example.com/realestate" },
  { id: "project-4", title: "Invoicing SaaS App", description: "Automated invoicing platform with recurring billing, payment reminders, and detailed financial reporting.", link: "https://example.com/invoicing" },
];

const SECTIONS = [
  { id: "tech-stack", label: "Tech Stack" },
  { id: "demos", label: "Demos" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"] as const;
const SECTION_DURATION = 5000;
const CAROUSEL_INTERVAL = 2500;
const CAROUSEL_TRANSITION_DURATION = 500;
const ANIM_CLASSES = ["tech-anim", "demo-anim", "project-anim", "contact-anim"] as const;

const Demos = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isMobile = useIsMobile();
  const reducedMotion = useRef(false);

  if (typeof window !== "undefined" && !reducedMotion.current) {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  const [activeSectionIndex, setActiveSectionIndex] = useState(() => {
    const initial = searchParams.get("section") || "tech-stack";
    return Math.max(0, SECTIONS.findIndex(s => s.id === initial));
  });
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const allTechLogosRef = useRef<HTMLDivElement[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const sectionTimerRef = useRef<number | null>(null);
  const carouselTimerRef = useRef<number | null>(null);
  const isTransitioningRef = useRef(false);
  const prevIndexRef = useRef(activeSectionIndex);

  const clearTimers = () => {
    if (sectionTimerRef.current) { clearTimeout(sectionTimerRef.current); sectionTimerRef.current = null; }
    if (carouselTimerRef.current) { clearInterval(carouselTimerRef.current); carouselTimerRef.current = null; }
  };

  // Section animation: runs whenever activeSectionIndex changes
  useEffect(() => {
    if (timelineRef.current) { timelineRef.current.kill(); }

    const el = sectionRefs.current[activeSectionIndex];
    if (!el) return;

    const animClass = ANIM_CLASSES[activeSectionIndex] || "anim-child";
    const children = el.querySelectorAll(`.${animClass}`);

    // Hide all other sections
    sectionRefs.current.forEach((s, i) => {
      if (s && i !== activeSectionIndex) {
        gsap.set(s, { display: "none", opacity: 0 });
        const c = s.querySelectorAll(`.${ANIM_CLASSES[i] || "anim-child"}`);
        c.forEach(e => { gsap.set(e, { clearProps: "all" }); });
      }
    });

    gsap.set(el, { display: "flex", opacity: 0 });
    gsap.set(children, { y: 50, opacity: 0, clearProps: "all" });
    gsap.set(children, { y: 50, opacity: 0 });

    const fast = reducedMotion.current;
    const tl = gsap.timeline();
    timelineRef.current = tl;
    tl.to(el, { opacity: 1, duration: fast ? 0.05 : 0.3, ease: "power2.out" });
    tl.to(children, {
      y: 0, opacity: 1, scale: 1,
      duration: fast ? 0.05 : 0.6,
      stagger: fast ? 0 : 0.06,
      ease: "power2.out",
    }, fast ? 0 : 0.1);

    return () => { tl.kill(); };
  }, [activeSectionIndex]);

  // Carousel timer: runs only when on demos (index 1) and isPlaying
  useEffect(() => {
    if (activeSectionIndex !== 1 || !isPlaying || isTransitioningRef.current) {
      if (carouselTimerRef.current) { clearInterval(carouselTimerRef.current); carouselTimerRef.current = null; }
      return;
    }
    carouselTimerRef.current = window.setInterval(() => {
      setActiveCarouselIndex(i => (i + 1) % carouselItems.length);
    }, CAROUSEL_INTERVAL);
    return () => { if (carouselTimerRef.current) { clearInterval(carouselTimerRef.current); carouselTimerRef.current = null; } };
  }, [activeSectionIndex, isPlaying]);

  // Section auto-advance timer
  useEffect(() => {
    if (!isPlaying || isTransitioningRef.current) {
      if (sectionTimerRef.current) { clearTimeout(sectionTimerRef.current); sectionTimerRef.current = null; }
      return;
    }
    sectionTimerRef.current = window.setTimeout(() => {
      setActiveSectionIndex(i => (i + 1) % SECTIONS.length);
    }, SECTION_DURATION);
    return () => { if (sectionTimerRef.current) { clearTimeout(sectionTimerRef.current); sectionTimerRef.current = null; } };
  }, [activeSectionIndex, isPlaying]);

  // Reset carousel when leaving demos section
  useEffect(() => {
    if (activeSectionIndex !== 1) {
      setActiveCarouselIndex(0);
    }
  }, [activeSectionIndex]);

  // Mount animation
  useEffect(() => {
    const initialIdx = Math.max(0, SECTIONS.findIndex(s => s.id === (searchParams.get("section") || "tech-stack")));
    prevIndexRef.current = initialIdx;
    sectionRefs.current.forEach((s, i) => {
      if (s && i !== initialIdx) {
        gsap.set(s, { display: "none" });
      }
    });
    // Trigger animation by setting state after a tick
    const t = setTimeout(() => setActiveSectionIndex(initialIdx), 50);
    return () => { clearTimeout(t); clearTimers(); };
  }, [searchParams]);

  const switchTo = (newIndex: number) => {
    if (isTransitioningRef.current) return;
    if (newIndex === activeSectionIndex) return;
    if (newIndex < 0 || newIndex >= SECTIONS.length) return;

    clearTimers();
    isTransitioningRef.current = true;

    // Animate out current
    const oldEl = sectionRefs.current[activeSectionIndex];
    if (oldEl) {
      const animClass = ANIM_CLASSES[activeSectionIndex] || "anim-child";
      const children = oldEl.querySelectorAll(`.${animClass}`);
      const fast = reducedMotion.current;
      const tl = gsap.timeline({
        onComplete: () => {
          isTransitioningRef.current = false;
        }
      });
      tl.to(children, { y: -30, opacity: 0, scale: 0.96, duration: fast ? 0.05 : 0.3, stagger: fast ? 0 : 0.03 });
      tl.set(oldEl, { display: "none" });
      if (timelineRef.current) { timelineRef.current.kill(); }
      timelineRef.current = tl;
    } else {
      isTransitioningRef.current = false;
    }

    setActiveCarouselIndex(0);
    prevIndexRef.current = newIndex;
    setActiveSectionIndex(newIndex);
  };

  const togglePlay = () => {
    const next = !isPlaying;
    setIsPlaying(next);
    if (next) {
      clearTimers();
      const el = sectionRefs.current[activeSectionIndex];
      if (el) {
        const animClass = ANIM_CLASSES[activeSectionIndex] || "anim-child";
        const children = el.querySelectorAll(`.${animClass}`);
        gsap.set(el, { display: "flex", opacity: 0 });
        gsap.set(children, { y: 50, opacity: 0 });
        const fast = reducedMotion.current;
        const tl = gsap.timeline();
        tl.to(el, { opacity: 1, duration: fast ? 0.05 : 0.3 });
        tl.to(children, { y: 0, opacity: 1, duration: fast ? 0.05 : 0.5, stagger: fast ? 0 : 0.06 });
      }
    } else {
      clearTimers();
      if (timelineRef.current) { timelineRef.current.kill(); timelineRef.current = null; }
    }
  };

  const handleCarouselNav = (dir: "prev" | "next") => {
    setActiveCarouselIndex(prev => {
      if (dir === "next") return Math.min(prev + 1, carouselItems.length - 1);
      return Math.max(prev - 1, 0);
    });
  };

  const TechStackLogo = ({ item, index }: { item: typeof techStackItems[0]; index: number }) => {
    const Icon = item.icon;
    return (
      <div
        ref={el => { if (el) allTechLogosRef.current[index] = el; }}
        className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center rounded-xl border-2 shadow-md transition-all duration-300"
        style={{ borderColor: COLORS[index % COLORS.length] }}
      >
        <Icon />
      </div>
    );
  };

  return (
    <>
      <SEOHelmet
        title="Demos & Tech Stack - Bo Nyambe"
        description="Explore my tech stack, demos, projects, and contact information. See examples of custom admin panels, SEO-optimized sites, responsive designs, and more."
        keywords="tech stack, demos, projects, Angular, Nest JS, MongoDB, Node.js, contact, portfolio"
        url={`${SITE_URL}demos`}
        canonicalUrl={`${SITE_URL}demos`}
        type="website"
      >
        <script type="application/ld+json">{JSON.stringify(getOrganizationSchema())}</script>
      </SEOHelmet>

      <div className="h-screen w-screen bg-background text-foreground flex flex-col relative overflow-hidden">
        <header className="absolute top-0 left-0 right-0 z-40 px-4 sm:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
              Back
            </Button>
          </div>
        </header>

        <div className="flex-1 relative overflow-hidden">
          {/* TECH STACK */}
          <section
            ref={el => { if (el) sectionRefs.current[0] = el; }}
            id="tech-stack"
            className="absolute inset-0 items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-muted/30 via-background to-secondary/20 hidden"
            aria-labelledby="tech-stack-title"
          >
            <div className="w-full max-w-4xl mx-auto flex flex-col">
              <div className="text-center mb-8 sm:mb-12">
                <span className="text-xs font-semibold tracking-widest text-primary uppercase tech-anim block">TECHNOLOGY STACK</span>
                <h2 id="tech-stack-title" className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mt-3 tech-anim">Technologies I Work With</h2>
                <p className="text-muted-foreground text-lg mt-4 tech-anim">Modern tools for modern applications</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8">
                {techStackItems.map((item, index) => (
                  <div key={item.label} className="flex flex-col items-center gap-3 tech-anim">
                    <TechStackLogo item={item} index={index} />
                    <span className={`text-sm font-medium px-3 py-1 rounded-full ${item.color} ${item.colorDark}`}>{item.label}</span>
                  </div>
                ))}
              </div>
              <p className="text-center text-muted-foreground mt-8 tech-anim">Specializing in full-stack MERN/Angular-NestJS architectures for scalable web applications</p>
            </div>
          </section>

          {/* DEMOS */}
          <section
            ref={el => { if (el) sectionRefs.current[1] = el; }}
            id="demos"
            className="absolute inset-0 items-center justify-center p-4 sm:p-8 bg-background hidden"
            aria-labelledby="demos-title"
          >
            <div className="w-full max-w-4xl mx-auto flex flex-col">
              <div className="text-center mb-6">
                <span className="text-xs font-semibold tracking-widest text-primary uppercase demo-anim block">FEATURES & CAPABILITIES</span>
                <h2 id="demos-title" className="text-3xl sm:text-4xl font-bold text-foreground mt-3 demo-anim">What I Deliver</h2>
              </div>

              <div className="relative w-full h-72 sm:h-80 demo-anim" aria-live="polite" aria-atomic="true" role="region" aria-label="Feature carousel">
                <div className="relative w-full h-full rounded-xl overflow-hidden bg-muted border border-border shadow-lg">
                  {carouselItems.map((item, index) => (
                    <div
                      key={item.id}
                      data-carousel-track={index}
                      className={`absolute inset-0 p-6 sm:p-8 flex flex-col justify-center transition-opacity duration-500 ${index === activeCarouselIndex ? "opacity-100 z-10" : "opacity-0 z-0"}`}
                    >
                      <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">{item.title}</h3>
                      <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">{item.description}</p>
                      <div className="relative mt-4 h-32 sm:h-36 bg-secondary/50 rounded-lg overflow-hidden flex">
                        <div className="flex-1 relative bg-gradient-to-br from-blue-50 to-indigo-100 rounded-l-lg overflow-hidden dark:from-slate-800 dark:to-slate-900">
                          <div className="absolute inset-0 flex items-center justify-center opacity-30 dark:opacity-20">
                            <div className="space-y-2 px-3">
                              <div className="h-1.5 bg-blue-400 dark:bg-blue-500 rounded w-24"></div>
                              <div className="h-1.5 bg-blue-300 dark:bg-blue-400 rounded w-20"></div>
                              <div className="h-1.5 bg-blue-200 dark:bg-blue-300 rounded w-28"></div>
                              <div className="h-1.5 bg-blue-300 dark:bg-blue-400 rounded w-16"></div>
                            </div>
                          </div>
                          <span className="absolute bottom-2 left-3 text-xs text-blue-600 dark:text-blue-300 font-medium">Light Mode</span>
                        </div>
                        <div className="w-1/2 border-l border-border bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-900 dark:to-black relative overflow-hidden">
                          <div className="absolute inset-0 flex items-center justify-center opacity-50">
                            <div className="space-y-2 px-3">
                              <div className="h-1.5 bg-emerald-400 rounded w-24"></div>
                              <div className="h-1.5 bg-emerald-500 rounded w-20"></div>
                              <div className="h-1.5 bg-emerald-600 rounded w-28"></div>
                              <div className="h-1.5 bg-emerald-500 rounded w-16"></div>
                            </div>
                          </div>
                          <span className="absolute bottom-2 left-3 text-xs text-emerald-400 font-medium">Dark Mode</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                  {carouselItems.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveCarouselIndex(i)}
                      className={`rounded-full transition-all duration-300 ${i === activeCarouselIndex ? "bg-primary w-6 h-2.5" : "bg-muted-foreground/50 hover:bg-muted-foreground/80 w-2.5 h-2.5"}`}
                      aria-label={`Slide ${i + 1}`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between mt-5 demo-anim">
                <Button variant="outline" size="icon" onClick={() => handleCarouselNav("prev")} disabled={activeCarouselIndex === 0} aria-label="Previous">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground font-medium">{activeCarouselIndex + 1} / {carouselItems.length}</span>
                <Button variant="outline" size="icon" onClick={() => handleCarouselNav("next")} disabled={activeCarouselIndex === carouselItems.length - 1} aria-label="Next">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-6 space-y-1 demo-anim">
                <h3 className="text-lg font-bold text-foreground">{carouselItems[activeCarouselIndex].title}</h3>
                <p className="text-muted-foreground text-sm">{carouselItems[activeCarouselIndex].description}</p>
              </div>
            </div>
          </section>

          {/* PROJECTS */}
          <section
            ref={el => { if (el) sectionRefs.current[2] = el; }}
            id="projects"
            className="absolute inset-0 items-center justify-center p-4 sm:p-8 bg-muted/30 hidden"
            aria-labelledby="projects-title"
          >
            <div className="w-full max-w-3xl mx-auto flex flex-col">
              <div className="text-center mb-8">
                <span className="text-xs font-semibold tracking-widest text-primary uppercase project-anim block">PORTFOLIO</span>
                <h2 id="projects-title" className="text-3xl sm:text-4xl font-bold text-foreground mt-3 project-anim">Featured Projects</h2>
                <p className="text-muted-foreground mt-4 project-anim">A selection of my deployed work</p>
              </div>
              <Accordion type="single" collapsible className="w-full space-y-3 project-anim">
                {projectItems.map(project => (
                  <AccordionItem key={project.id} value={project.id} className="bg-card border border-border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline text-left">
                      <span className="font-semibold text-foreground">{project.title}</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{project.description}</p>
                      <Button variant="outline" size="sm" asChild>
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                          View Deployed Project <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2">
                        <code className="bg-muted px-1.5 py-0.5 rounded text-xs">{project.link}</code>
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>

          {/* CONTACT */}
          <section
            ref={el => { if (el) sectionRefs.current[3] = el; }}
            id="contact"
            className="absolute inset-0 items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-primary/5 via-background to-secondary/10 hidden"
            aria-labelledby="contact-title"
          >
            <div className="w-full max-w-2xl mx-auto flex flex-col">
              <div className="text-center mb-8 contact-anim">
                <span className="text-xs font-semibold tracking-widest text-primary uppercase block">GET IN TOUCH</span>
                <h2 id="contact-title" className="text-3xl sm:text-4xl font-bold text-foreground mt-3">Let's Work Together</h2>
                <p className="text-muted-foreground mt-4">I'd love to hear about your project. Reach out via WhatsApp or email.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto w-full contact-anim">
                <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50 bg-card group">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-3 text-lg">
                      <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Whatsapp className="text-green-600 dark:text-green-400" size={22} />
                      </div>
                      WhatsApp
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">Quick chat anytime</p>
                    <Button variant="default" className="w-full bg-green-600 hover:bg-green-700 text-white" asChild>
                      <a href="https://wa.me/+260978000956" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                        <Whatsapp size={16} /> Chat on WhatsApp
                      </a>
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">+260978000956</p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50 bg-card group">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-3 text-lg">
                      <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Mail className="text-blue-600 dark:text-blue-400" size={22} />
                      </div>
                      Email
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">Send me a message</p>
                    <Button variant="outline" className="w-full" asChild>
                      <a href="mailto:franknyambe202205@gmail.com" className="inline-flex items-center gap-2">
                        <Mail size={16} /> Send Email
                      </a>
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2 truncate">franknyambe202205@gmail.com</p>
                  </CardContent>
                </Card>
              </div>
              <div className="mt-10 flex justify-center gap-6 contact-anim">
                <a href="https://wa.me/+260978000956" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors" aria-label="WhatsApp">
                  <Whatsapp size={20} /><span className="text-sm">+260978000956</span>
                </a>
                <a href="mailto:franknyambe202205@gmail.com" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors" aria-label="Email">
                  <Mail size={20} /><span className="text-sm">franknyambe202205@gmail.com</span>
                </a>
              </div>
            </div>
          </section>
        </div>

        {/* NAVIGATION */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none" aria-label="Page navigation">
          <div className="flex flex-col items-center sm:items-start pb-4 sm:pb-6 sm:pl-6">
            {isMobile ? (
              <div className="pointer-events-auto flex items-center justify-center gap-2 bg-card/80 backdrop-blur-lg border border-border rounded-full px-4 py-2 shadow-lg">
                {SECTIONS.map((section, index) => (
                  <button
                    key={section.id}
                    onClick={() => switchTo(index)}
                    className={`rounded-full transition-all duration-300 ${index === activeSectionIndex ? "bg-primary w-6 h-2.5" : "bg-muted-foreground/50 hover:bg-muted-foreground/80 w-2.5 h-2.5"}`}
                    aria-label={`Go to ${section.label}`}
                    title={section.label}
                  />
                ))}
              </div>
            ) : (
              <div className="pointer-events-auto flex flex-col gap-2 bg-card/80 backdrop-blur-lg border border-border rounded-xl p-3 shadow-lg">
                {SECTIONS.map((section, index) => (
                  <button
                    key={section.id}
                    onClick={() => switchTo(index)}
                    className={`relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 min-w-[140px] group ${index === activeSectionIndex ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"}`}
                    aria-label={`Navigate to ${section.label}`}
                  >
                    <span className={`w-2 h-2 rounded-full transition-all duration-300 shrink-0 ${index === activeSectionIndex ? "bg-primary scale-125" : "bg-muted-foreground/50 group-hover:bg-muted-foreground/80"}`} />
                    {section.label}
                  </button>
                ))}
              </div>
            )}
            <div className="pointer-events-auto flex gap-2 mt-3">
              <Button variant="ghost" size="sm" onClick={togglePlay} className="bg-card/60 backdrop-blur-lg border border-border text-foreground hover:bg-card" aria-label={isPlaying ? "Pause" : "Play"}>
                {isPlaying ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
                {isPlaying ? "Pause" : "Play"}
              </Button>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Demos;
