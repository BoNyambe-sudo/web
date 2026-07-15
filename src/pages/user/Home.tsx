import heroImg from "@/assets/hero.jpg";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router";
import SEOHelmet from "@/components/SEOHelmet";
import { SITE_URL } from "@/lib/seoConfig";
import {
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Rocket,
  Sparkles,
} from "lucide-react";

const FAQS = [
  {
    question: "How long does it take to launch a website?",
    answer:
      "Typical projects launch in 4-8 weeks depending on scope. I focus on speed without sacrificing quality, SEO, or user experience.",
  },
  {
    question: "Do you handle SEO and performance optimization?",
    answer:
      "Yes. Every project includes SEO-ready structure, metadata setup, fast Core Web Vitals, and mobile-first page performance.",
  },
  {
    question:
      "Can you improve my existing site instead of building from scratch?",
    answer:
      "Absolutely. I audit your current stack, fix performance bottlenecks, and make your site faster, more secure, and easier to maintain.",
  },
  {
    question: "What industries do you work with?",
    answer:
      "I work with startups, agencies, small businesses, and founders who want modern, scalable web platforms across commerce, SaaS, and enterprise projects.",
  },
  {
    question: "Why NestJS and Angular?",
    answer:
      "NestJS delivers enterprise-grade backend architecture while Angular provides a resilient, testable frontend. Together they create apps built to scale and rank.",
  },
];

const SERVICES = [
  {
    title: "Custom Web Applications",
    description:
      "NestJS backend and Angular or React frontend for dashboards, SaaS, marketplaces, and business-critical apps.",
    icon: <Rocket className="h-5 w-5" />,
  },
  {
    title: "Performance & SEO",
    description:
      "Lighthouse 90+ performance, metadata SEO, fast Core Web Vitals, and a site built to rank for your most important search terms.",
    icon: <TrendingUp className="h-5 w-5" />,
  },
  {
    title: "Launch-Ready Platforms",
    description:
      "From MVP to launch, I build production-ready applications with deployable architecture, auth, and growth-ready infrastructure.",
    icon: <Sparkles className="h-5 w-5" />,
  },
];

const FEATURED_PROJECTS = [
  {
    title: "SaaS Growth Engine",
    description:
      "A scalable admin platform built with NestJS, Angular, and Stripe-ready payments for subscription growth.",
    badge: "Lighthouse 95+",
  },
  {
    title: "SEO Blog Platform",
    description:
      "A content-first website built for ranking, fast indexing, and high visibility across niche search queries.",
    badge: "SEO-ready content",
  },
  {
    title: "Real-Time Analytics Dashboard",
    description:
      "A responsive dashboard with real-time data, secure auth, and reliable performance under heavy user load.",
    badge: "Enterprise architecture",
  },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEOHelmet
        title="High-Performance Web Development"
        description="Build fast, SEO-optimized NestJS and Angular applications designed to convert visitors into customers. Book a strategy call or explore services."
        keywords="NestJS Angular developer, web development, SEO web design, performance optimization, Zambia web developer"
        url={SITE_URL}
        canonicalUrl={SITE_URL}
      />

      <div className="bg-background text-foreground">
        <Header textClassName="lightText" />

        <section
          className="relative overflow-hidden bg-cover bg-center text-foreground"
          style={{ backgroundImage: `url(${heroImg})` }}
        >
          <div className="absolute inset-0 bg-background/70" />
          <div className="relative mx-auto max-w-6xl px-4 py-28 sm:px-6 lg:px-8">
            <div className="max-w-3xl space-y-8">
              <span className="inline-flex rounded-full bg-primary/20 px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-primary">
                High-growth web ecosystems
              </span>
              <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                Architecting premium, high-performance web ecosystems that rank
                and convert.
              </h1>
              <p className="text-base leading-8 text-muted-foreground sm:text-xl sm:leading-9">
                I build scalable NestJS + Angular applications with fast
                performance, strong SEO, and user-first conversion flows.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Button
                  size="lg"
                  className="w-full sm:w-auto"
                  onClick={() => navigate("/website-survey")}
                >
                  Book a strategy call
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto"
                  asChild
                >
                  <Link to="/services">See my work</Link>
                </Button>
              </div>

              <div className="rounded-3xl border border-border/20 bg-card/10 p-4 text-sm text-foreground shadow-xl shadow-border/10 backdrop-blur-md">
                <p className="font-semibold">Built with:</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                  <span className="rounded-full bg-card/10 px-3 py-2">
                    NestJS
                  </span>
                  <span className="rounded-full bg-card/10 px-3 py-2">
                    Angular
                  </span>
                  <span className="rounded-full bg-card/10 px-3 py-2">
                    React
                  </span>
                  <span className="rounded-full bg-card/10 px-3 py-2">
                    Lighthouse 95+
                  </span>
                  <span className="rounded-full bg-card/10 px-3 py-2">
                    Mobile first
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="relative mx-auto max-w-6xl px-4 pb-10 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center">
              <a
                href="#problem"
                className="inline-flex items-center gap-2 rounded-full border border-border/30 bg-card/10 px-4 py-2 text-sm uppercase tracking-[0.3em] text-foreground transition hover:bg-card/20"
              >
                Scroll to learn more <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <section
            id="problem"
            className="grid gap-12 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center"
          >
            <div className="space-y-6">
              <span className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
                Problem + Solution
              </span>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Tired of slow, bloated websites that don't rank?
              </h2>
              <p className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                Most developers ship pretty UIs that still load in 8 seconds and
                tank on Google. I deliver premium ecosystems where sophisticated
                backend logic, clean architecture, and SEO-first design work
                together to convert visitors into customers.
              </p>
            </div>
            <div className="rounded-3xl border border-border bg-card p-10 shadow-sm">
              <div className="space-y-5">
                <div>
                  <h3 className="text-xl font-semibold">What you get</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    A website and app built for speed, search visibility, and
                    scalable growth—without the agency waste.
                  </p>
                </div>
                <div className="grid gap-4">
                  <div className="rounded-2xl bg-card/80 p-5">
                    <p className="text-sm uppercase tracking-[0.25em] text-primary">
                      Speed
                    </p>
                    <p className="mt-3 text-base text-foreground">
                      Fast Core Web Vitals, quicker conversions, and fewer lost
                      visitors.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-card/80 p-5">
                    <p className="text-sm uppercase tracking-[0.25em] text-primary">
                      Visibility
                    </p>
                    <p className="mt-3 text-base text-foreground">
                      SEO-ready structure with metadata and schema for higher
                      search rankings.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-card/80 p-5">
                    <p className="text-sm uppercase tracking-[0.25em] text-primary">
                      Conversion
                    </p>
                    <p className="mt-3 text-base text-foreground">
                      Intent-driven pages that guide visitors toward your best
                      offer.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="services" className="space-y-10 pb-20">
            <div className="space-y-4 text-center">
              <span className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
                What I build for you
              </span>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Services designed to make your website work harder.
              </h2>
              <p className="mx-auto max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                Clear service offerings, no hidden buttons. I help brands move
                from invisible to high-converting digital platforms.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {SERVICES.map((service) => (
                <Card
                  key={service.title}
                  className="border-border/50 shadow-sm"
                >
                  <CardHeader className="space-y-4">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      {service.icon}
                    </div>
                    <CardTitle className="text-lg font-semibold">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-7 text-muted-foreground">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section
            id="featured"
            className="space-y-10 border-t border-border/70 py-20"
          >
            <div className="space-y-4 text-center">
              <span className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
                Proof of work
              </span>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Featured builds that prove the approach.
              </h2>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {FEATURED_PROJECTS.map((project) => (
                <Card
                  key={project.title}
                  className="border-border/50 shadow-sm"
                >
                  <CardHeader className="space-y-4">
                    <CardTitle className="text-lg font-semibold">
                      {project.title}
                    </CardTitle>
                    <p className="text-sm uppercase tracking-[0.25em] text-primary">
                      {project.badge}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-7 text-muted-foreground">
                      {project.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section id="process" className="grid gap-12 py-20 lg:grid-cols-3">
            <div className="space-y-4">
              <span className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
                How I work
              </span>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                A simple 3-step process for stress-free launches.
              </h2>
              <p className="text-base leading-8 text-muted-foreground">
                Planning, building, and launching with clarity so your project
                moves fast and stays on budget.
              </p>
            </div>
            {[
              {
                step: "Plan",
                copy: "We define goals, tech stack, and success metrics so every feature drives business value.",
              },
              {
                step: "Build",
                copy: "I ship clean, documented code with weekly updates so you always know progress is real.",
              },
              {
                step: "Launch",
                copy: "Deployment, SEO setup, and performance tests finish the project with a polished, measurable release.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-3xl border border-border bg-card p-8 shadow-sm"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
                  {item.step}
                </p>
                <p className="mt-4 text-base leading-7 text-muted-foreground">
                  {item.copy}
                </p>
              </div>
            ))}
          </section>

          <section
            id="why-stack"
            className="space-y-10 border-t border-border/70 py-20"
          >
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <span className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
                  Why this stack
                </span>
                <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                  NestJS + Angular for speed, scale, and predictable growth.
                </h2>
                <p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
                  NestJS delivers enterprise backend architecture while Angular
                  provides resilient, maintainable frontends. Together they
                  ensure your app can handle real traffic, evolve safely, and
                  rank strongly.
                </p>
                <Button
                  size="lg"
                  className="mt-8"
                  onClick={() => navigate("/services")}
                >
                  Explore services
                </Button>
              </div>
              <div className="grid gap-4">
                {[
                  {
                    title: "Reliable architecture",
                    description:
                      "Code that stays maintainable as your business grows.",
                  },
                  {
                    title: "SEO-ready foundations",
                    description:
                      "Structured pages, metadata, and performance work together for visibility.",
                  },
                  {
                    title: "Built for conversion",
                    description:
                      "Interfaces designed to guide users and capture leads with clear CTAs.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-3xl border border-border bg-card p-6 shadow-sm"
                  >
                    <div className="flex items-center gap-3 text-primary">
                      <ShieldCheck className="h-5 w-5" />
                      <p className="font-semibold">{item.title}</p>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section
            id="faq"
            className="space-y-10 border-t border-border/70 py-20"
          >
            <div className="space-y-4 text-center">
              <span className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
                FAQ
              </span>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Questions I hear most often.
              </h2>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              {FAQS.map((item) => (
                <div
                  key={item.question}
                  className="rounded-3xl border border-border bg-card p-8 shadow-sm"
                >
                  <h3 className="text-lg font-semibold">{item.question}</h3>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-8 border-t border-border/70 py-20 text-center">
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
              Let’s build a website that actually performs.
            </h2>
            <p className="mx-auto max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              No agencies. No bloated timelines. Just clean, premium code that
              helps your business win online.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" onClick={() => navigate("/website-survey")}>
                Book a call
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/contact">Send a message</Link>
              </Button>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Home;
