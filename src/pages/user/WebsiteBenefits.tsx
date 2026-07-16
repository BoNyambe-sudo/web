import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { BenefitCard } from "@/components/BenefitCard";
import SEOHelmet from "@/components/SEOHelmet";
import { SITE_URL } from "@/lib/seoConfig";
import gsap from "gsap";
import {
  ShieldCheck,
  TrendingUp,
  Award,
  Gauge,
  ArrowLeft,
  Users,
  BarChart3,
  Globe,
  Zap,
} from "lucide-react";
import Logo from "@/components/Logo";

const TESTIMONIALS = [
  {
    quote:
      "After launching our website, leads increased by 40% in the first month.",
    author: "Sarah M.",
    role: "Restaurant Owner",
    initials: "SM",
  },
  {
    quote: "We went from invisible online to ranking #1 for our core keywords.",
    author: "James K.",
    role: "Consultant",
    initials: "JK",
  },
  {
    quote:
      "Our competitors have websites. We now have a dominant digital presence.",
    author: "Elena R.",
    role: "Real Estate Agent",
    initials: "ER",
  },
];

const CLIENT_LOGOS = ["Acme", "Vertex", "Novus", "Prism", "Forge", "Lumen"];

const WebsiteBenefits = () => {
  const navigate = useNavigate();
  //const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const costRef = useRef<HTMLDivElement>(null);
  const driversRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  const finalRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      tl.fromTo(
        heroRef.current,
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, duration: 0.7 },
      );

      tl.fromTo(
        costRef.current?.children || [],
        { autoAlpha: 0, y: 40 },
        { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.15 },
        "-=0.3",
      );

      tl.fromTo(
        driversRef.current?.children || [],
        { autoAlpha: 0, y: 40 },
        { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.15 },
        "-=0.3",
      );

      tl.fromTo(
        socialRef.current?.children || [],
        { autoAlpha: 0, y: 40 },
        { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.12 },
        "-=0.3",
      );

      tl.fromTo(
        finalRef.current,
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, duration: 0.6 },
        "-=0.3",
      );
    });

    return () => {
      mountedRef.current = false;
      ctx.revert();
    };
  }, []);

  return (
    <>
      <SEOHelmet
        title="Claim Your Digital Dominance - Free Consultation"
        description="Stop bleeding customers to competitors. Book a free consultation and discover how to unlock 24/7 automated revenue with a high-performance website."
        keywords="website consultation, digital dominance, business growth, free consultation, web development, NestJS Angular developer, web development, Web development services in Zambia,SEO web design, performance optimization, Zambia web developer, website development Zambia, website design Zambia, software development Zambia, web developer Lusaka, responsive web design, ecommerce website Zambia, SEO services Zambia, custom software development, WordPress development Zambia"
        url={`${SITE_URL}website-benefits`}
        canonicalUrl={`${SITE_URL}website-benefits`}
        type="website"
      />
      <div className="min-h-screen bg-background">
        <nav className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 h-14 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-sm"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="size-4" />
              Back
            </Button>
            <div className="flex items-center gap-1">
              <Logo size={24} />
              <span className="text-sm font-semibold tracking-tight">
                Bo Nyambe{" "}
              </span>
            </div>
            <div className="w-16" />
          </div>
        </nav>

        <main className="mx-auto max-w-6xl px-4 sm:px-6">
          <section
            ref={heroRef}
            className="py-16 sm:py-24 text-center space-y-6"
          >
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1]">
              Claim Your <span className="text-primary">Digital Dominance</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Stop Bleeding Customers to Competitors. Build a high-performance
              website that works 24/7 — while you sleep, while you close deals,
              while you scale.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button
                size="lg"
                className="h-12 px-8 text-base font-semibold shadow-lg"
                onClick={() => navigate("/website-survey")}
              >
                Book a Call
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Limited consultation slots — early adopters win.
            </p>
          </section>

          <section ref={costRef} className="py-12 sm:py-16 space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                The Cost of <span className="text-destructive">Absence</span>
              </h2>
              <p className="text-sm text-muted-foreground max-w-xl mx-auto">
                Every day without a professional website is a day your
                competitors are winning. Here is what that actually costs you.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <BenefitCard
                title="Lost Revenue"
                description="Invisible = Unexistent. 57% of buyers will not consider a business without a website. That is more than half your market walking away."
                icon={<TrendingUp className="size-5" />}
              />
              <BenefitCard
                title="Stagnation"
                description="Not Growing While Competitors Surge. While you wait, competitors with websites capture leads, build authority, and scale faster."
                icon={<Gauge className="size-5" />}
              />
              <BenefitCard
                title="Irrelevance"
                description="Missing 57% Who Search Before Buying. Without a site, you are absent from the most important decision moment in the buyer journey."
                icon={<Globe className="size-5" />}
              />
              <BenefitCard
                title="Overwhelm"
                description="Social Media Algorithms Control You. Relying on social media alone means your reach is dictated by platforms you do not own."
                icon={<Zap className="size-5" />}
              />
            </div>
          </section>

          <section ref={driversRef} className="py-12 sm:py-16 space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                The 4 Primal Drivers
              </h2>
              <p className="text-sm text-muted-foreground max-w-xl mx-auto">
                A website is not just a page — it is a strategic asset that taps
                into the core motivations of your customers.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <BenefitCard
                title="Security"
                description="Own Your Digital Land, Not Rent. Your website is your sovereign territory. No algorithm changes, no shadowbans, no platform rules."
                icon={<ShieldCheck className="size-5" />}
              />
              <BenefitCard
                title="Profit"
                description="Your 24/7 Automated Revenue Team. While you sleep, your site qualifies leads, demonstrates value, and converts visitors into buyers."
                icon={<BarChart3 className="size-5" />}
              />
              <BenefitCard
                title="Status"
                description="84% Trust Businesses With Websites. A professional site is a credibility signal that separates serious players from side hustles."
                icon={<Award className="size-5" />}
              />
              <BenefitCard
                title="Control"
                description="Your Narrative, Your Rules, Always. You decide the message, the design, the journey. No middleman. No compromises."
                icon={<Gauge className="size-5" />}
              />
            </div>
          </section>

          <section ref={socialRef} className="py-12 sm:py-16 space-y-10">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Trusted by People Who Demand Results
              </h2>
              <p className="text-sm text-muted-foreground max-w-xl mx-auto">
                Real outcomes from businesses that chose to stop bleeding
                customers and start scaling with a professional website.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t) => (
                <div
                  key={t.author}
                  className="rounded-xl border border-border/60 bg-card p-6 space-y-4 transition-colors hover:border-primary/20"
                >
                  <p className="text-sm text-foreground leading-relaxed">
                    "{t.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                      {t.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{t.author}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <p className="text-center text-xs font-medium text-muted-foreground uppercase tracking-widest">
                Trusted across industries
              </p>
              <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
                {CLIENT_LOGOS.map((logo) => (
                  <span
                    key={logo}
                    className="text-lg font-bold tracking-tight text-muted-foreground"
                  >
                    {logo}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section ref={finalRef} className="py-12 sm:py-20">
            <div className="rounded-2xl border border-border/60 bg-gradient-to-b from-muted/30 to-background p-8 sm:p-12 text-center space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
                <Users className="size-3.5" />
                Limited Spots — Early Adopters Win
              </div>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
                Ready to own your digital presence?
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Stop watching competitors take your market share. Book a free
                consultation now and get a clear, actionable roadmap to digital
                dominance.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Button
                  size="lg"
                  className="h-14 px-10 text-lg font-bold shadow-xl"
                  onClick={() => navigate("/website-survey")}
                >
                  Book a Call
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                No commitment. No pitch. Just actionable insights delivered in
                48 hours.
              </p>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default WebsiteBenefits;
