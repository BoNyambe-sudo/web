import type { CaseStudy } from "@/types/caseStudy";

export const caseStudies: CaseStudy[] = [
  {
    slug: "saas-growth-engine",
    title: "SaaS Growth Engine",
    tagline:
      "Northstar — Full-stack B2B SaaS platform for growth operations, team collaboration, and subscription billing",
    description:
      "A production-ready monorepo with authentication, multi-tenancy, Stripe billing, analytics, and audit logging. Built with NestJS, Angular, and MongoDB.",
    shortDescription:
      "Full-stack B2B SaaS platform with multi-tenancy, Stripe billing, and real-time analytics.",
    thumbnail: "/web/case-studies/sass-engine.webp",
    badge: "Lighthouse 95+",
    techStack: [
      { name: "NestJS", color: "bg-red-500", icon: "nestjs" },
      { name: "Angular", color: "bg-red-500", icon: "angular" },
      { name: "MongoDB", color: "bg-green-500", icon: "mongodb" },
      { name: "Stripe", color: "bg-purple-500", icon: "stripe" },
      { name: "TypeScript", color: "bg-blue-500", icon: "typescript" },
      { name: "pnpm", color: "bg-orange-500", icon: "pnpm" },
    ],
    links: {
      live: "https://sass-engine.vercel.app",
      github: "https://github.com/BoNyambe-sudo/Sass-Engine",
    },
    overview: `SaaS Growth Engine (Northstar) is a full-stack B2B SaaS platform for managing growth operations, team collaboration, and subscription billing. Built as a production-ready monorepo with authentication, multi-tenancy, Stripe billing, analytics, and audit logging.`,
    architecture: `
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│    Backend      │────▶│    MongoDB      │
│   (Angular)     │     │   (NestJS)      │     │   (Atlas)       │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌─────────────────┐
                        │    Stripe       │
                        │  (Billing)      │
                        └─────────────────┘
                               │
                               ▼
                        ┌─────────────────┐
                        │    Resend       │
                        │   (Email)       │
                        └─────────────────┘`,
    keyDecisions: [
      "Monorepo for shared types, simplified CI, atomic commits",
      "MongoDB for flexible tenant-scoped documents; indexes created automatically in dev",
      "Hash-based routing on frontend for static hosting compatibility",
      "Server-side authority — all billing, auth, and RBAC enforced on backend",
    ],
    features: [
      {
        title: "Authentication & Identity",
        items: [
          "Email/password signup with organization creation",
          "Email verification via one-time tokens",
          "Password reset flow",
          "JWT access tokens (15 min) + rotated opaque refresh cookies (7 days)",
          "Invitation acceptance (existing or new users)",
        ],
      },
      {
        title: "Multi-Tenancy & RBAC",
        items: [
          "Organizations with unique slugs",
          "Roles: Admin, Manager, Viewer",
          "Membership resolution on every protected request",
          "Minimum-one-admin protection on role changes/removals",
          "Organization-scoped data access",
        ],
      },
      {
        title: "Team Management",
        items: [
          "Invite members with role selection",
          "Role changes (Admin only)",
          "Member removal (Admin only, self-protection)",
          "Pending invitations with revocation",
          "Paginated member listing",
        ],
      },
      {
        title: "Billing & Subscriptions (Stripe)",
        items: [
          "3 Plans: Starter, Growth, Scale — prices fetched live from Stripe",
          "Server-created Checkout Sessions (subscription mode)",
          "Customer Portal for self-service management",
          "Webhook handling with signature verification",
          "Idempotent event processing (duplicate-safe)",
          "Subscription state sync: created/updated/deleted, invoice paid/failed",
          "Plan availability gated by configured Stripe Price IDs",
        ],
      },
      {
        title: "Analytics Dashboard",
        items: [
          "MRR (Monthly Recurring Revenue) with currency support",
          "Churn rate calculation",
          "Active subscription count",
          "New member growth (30-day rolling)",
          "Monthly growth bar chart",
          "Date-range filtering (max 366 days)",
        ],
      },
      {
        title: "Audit Logging",
        items: [
          "Immutable event log per organization",
          "Redacted metadata (passwords, tokens, emails masked)",
          "Admin-only access",
          "Paginated, newest-first",
        ],
      },
      {
        title: "Workspace Settings",
        items: [
          "Organization name update (Admin only)",
          "Workspace ID display",
          "Sign out",
        ],
      },
      {
        title: "UI/UX",
        items: [
          "Responsive layout (desktop sidebar → mobile bottom nav)",
          "Light/Dark theme (CSS variables, persisted)",
          "Loading, empty, and error states",
          "Accessible markup (ARIA, semantic HTML)",
        ],
      },
    ],
    projectStructure: `
saas-growth-engine/
├── backend/
│   ├── src/
│   │   ├── main.ts                 # App bootstrap, raw body for webhooks
│   │   ├── app.module.ts           # Module imports, global config
│   │   ├── config/environment.ts   # Zod-validated env schema
│   │   ├── modules/
│   │   │   ├── database/           # Mongoose models, connection, retry
│   │   │   ├── auth/               # Signup, login, tokens, guards
│   │   │   ├── users/              # Member CRUD, invitations
│   │   │   ├── organizations/      # Org settings, current org
│   │   │   ├── billing/            # Stripe integration, webhooks
│   │   │   ├── analytics/          # Aggregation pipelines
│   │   │   ├── audit/              # Audit log recording
│   │   │   └── email/              # Resend service
│   │   └── ...
│   └── package.json
├── frontend/
│   ├── src/app/
│   │   ├── app.ts                  # Main component, state, API calls
│   │   ├── app.html                # Template (all sections)
│   │   ├── app.scss                # Styles (CSS variables, responsive)
│   │   ├── core/
│   │   │   ├── api.service.ts      # HTTP client, token refresh
│   │   │   └── auth.interceptor.ts # Auto-attach auth, 401 retry
│   │   └── app.routes.ts           # Hash routes for billing pages
│   └── package.json
├── vercel.json                     # Frontend deploy config
├── render.yaml                     # Backend deploy config
├── .env.example                    # Environment template
└── pnpm-workspace.yaml`,
    challenges: [
      {
        title: "Hash routing + static hosting",
        solution:
          "Avoids server config complexity for SPAs by using hash-based routing.",
      },
      {
        title: "Idempotent webhooks",
        solution:
          "Critical for Stripe; use unique event IDs + status locking to prevent duplicate processing.",
      },
      {
        title: "Retry with backoff",
        solution:
          "MongoDB Atlas cold starts need connection retries with exponential backoff.",
      },
      {
        title: "Server-side price fetching",
        solution:
          "Keeps frontend in sync with Stripe Dashboard by fetching prices at runtime.",
      },
      {
        title: "Environment validation at startup",
        solution:
          "Fails fast with clear messages using Zod-validated environment schema.",
      },
    ],
    futureEnhancements: [
      "Team workspaces (multiple orgs per user)",
      "Usage-based billing / metered prices",
      "Email templates with React Email",
      "Webhook retry dashboard",
      "API keys for programmatic access",
      "Slack/Discord notifications",
      "Export analytics to CSV",
    ],
    deployment: {
      frontend: "Vercel",
      backend: "Render",
      database: "MongoDB Atlas",
      ci: "GitHub Actions",
    },
  },
  {
    slug: "seo-blog-platform",
    title: "SEO Blog Platform",
    tagline:
      "Search & Signal — A production-ready, content-first blog platform built for search visibility, performance, and editorial flexibility",
    description:
      "A modern technical blog platform featuring a Sanity Studio headless CMS for content authoring and an Astro 7.x server-rendered frontend deployed on Vercel. Built from scratch with SEO as the primary constraint.",
    shortDescription:
      "Content-first blog platform with Astro, Sanity CMS, and comprehensive SEO foundation.",
    thumbnail: "/web/case-studies/seo-blog-platform.webp",
    badge: "SEO Score 100",
    techStack: [
      { name: "Astro", color: "bg-pink-500", icon: "astro" },
      { name: "Sanity", color: "bg-orange-500", icon: "sanity" },
      { name: "Tailwind CSS", color: "bg-teal-500", icon: "tailwind" },
      { name: "TypeScript", color: "bg-blue-500", icon: "typescript" },
      { name: "Fuse.js", color: "bg-yellow-500", icon: "fuse" },
      { name: "Vercel", color: "bg-black", icon: "vercel" },
    ],
    links: {
      live: "https://seo-blog-platform-sv5z.vercel.app",
      github: "https://github.com/BoNyambe-sudo/SEO-blog-platform",
    },
    overview: `A modern technical blog platform ("Search & Signal") featuring a Sanity Studio headless CMS for content authoring and an Astro 7.x server-rendered frontend deployed on Vercel. The platform was built from scratch with SEO as the primary constraint — every architectural decision prioritizes search engine discoverability, Core Web Vitals, and fast first-contentful paint.`,
    architecture: `
The platform follows a **monorepo** structure with two independent workspaces:

seo-blog-platform/
├── web/                         # Astro frontend (SSG + on-demand ISR)
│   ├── src/
│   │   ├── pages/                 # Routes: index, blog, category, author, API
│   │   ├── components/            # 14+ Astro UI components
│   │   ├── layouts/               # Single root layout
│   │   ├── lib/                   # Sanity client, GROQ queries, SEO utilities
│   │   └── styles/                # Tailwind v4 + custom prose CSS
│   ├── static/                    # Favicons, OG image assets
│   └── scripts/                   # Dependency-free asset generator
├── studio/                      # Sanity Studio (content authoring)
│   ├── schemas/                   # post, author, category + block types
│   └── lib/                       # Seed script (5 articles, 1 author, 5 categories)
├── package.json                   # Root workspace
└── pnpm-workspace.yaml

Data flow: Content is authored in Sanity Studio → synced to Sanity's CDN → Astro fetches via GROQ at build time (for prerendered routes) or request time (for ISR routes) → HTML sent to client with zero runtime JS for content rendering.`,
    keyDecisions: [
      "Astro 7.x server-render mode via @astrojs/vercel for on-demand ISR",
      "Sanity Studio v3 as standalone workspace for content authoring",
      "Tailwind CSS v4 via @tailwindcss/vite for styling",
      "astro-portabletext for rendering Portable Text with custom block types",
      "Fuse.js for client-side fuzzy search, lazy-loaded on first interaction",
      "pnpm monorepo workspace for unified dependency management",
    ],
    features: [
      {
        title: "Editorial Content Model",
        items: [
          "Post schema with required title, slug, excerpt (max 200 chars), publishedAt, and cover image with required alt text",
          "SEO overrides — per-post seoTitle (max 60 chars) and seoDescription (max 160 chars) fields editable directly in Studio",
          "Reference relationships between posts, authors, and categories",
          "Custom block types: code blocks (with language selection + optional filename), YouTube embeds, callouts (info/warning/success), and images with alt/caption fields",
          "Auto-calculated read time (read-only field computed from content word count)",
        ],
      },
      {
        title: "Comprehensive SEO Foundation",
        items: [
          "Per-page meta tags — dynamic <title>, meta description, canonical URL, Open Graph, and Twitter Card tags on every route",
          "JSON-LD structured data — BlogPosting schema on articles, WebSite schema on all other pages",
          "Dynamic sitemap.xml — generated from Sanity, includes posts, categories, and authors with lastmod timestamps",
          "Dynamic robots.txt — references the production sitemap URL",
          "RSS feed at /rss.xml via @astrojs/rss",
          "Heading anchors synchronized with a live table of contents (h2/h3)",
          "Image optimization — explicit width/height attributes, loading=eager, fetchpriority=high, and descriptive alt text enforced in schema",
        ],
      },
      {
        title: "On-Demand ISR with Webhook Revalidation",
        items: [
          "A Vercel webhook endpoint (/api/revalidate) receives Sanity publish events",
          "Verifies the x-sanity-webhook-secret header before processing",
          "Maps changed document types to affected routes (e.g., a post update revalidates the article page, blog index, and homepage)",
          "Triggers Vercel's on-demand revalidation API to purge cached pages at the edge",
        ],
      },
      {
        title: "Client-Side Fuzzy Search",
        items: [
          "A search index is built at build time and stored as JSON at /blog/search.json",
          "Fuse.js is lazy-loaded only on first search interaction (no impact on initial load)",
          "Searches across titles, excerpts, and categories with fuzzy matching",
        ],
      },
      {
        title: "Performance Optimizations",
        items: [
          "Server-rendered HTML with zero client JavaScript for content delivery",
          "Prerendered homepage; ISR-cached dynamic pages with 7-day edge cache",
          "Preloaded Google Fonts (Inter) with display=swap and preconnect hints",
          "Sanity CDN image transforms with format negotiation (AVIF/WebP)",
          "Dark/light theme toggle with localStorage persistence and prefers-color-scheme detection",
          "Responsive images with explicit dimensions preventing layout shift",
        ],
      },
      {
        title: "Content Rich Components",
        items: [
          "Portable Text renderer with custom Astro components for all block types",
          "Code blocks with copy-to-clipboard functionality, language tagging, and optional filenames",
          "YouTube embeds rendered as responsive iframes with aspect-ratio containers",
          "Social sharing with pre-populated share text",
        ],
      },
    ],
    challenges: [
      {
        title: "ISR route purging on content updates",
        solution:
          "A minimal /api/revalidate endpoint that receives webhook payloads, validates the secret, maps document types to affected URL paths, and calls Vercel's on-demand revalidation API. Path-mapping logic is type-aware — a post update revalidates the article page, the paginated blog index, and the homepage; a category update revalidates the category page and homepage.",
      },
      {
        title: "Search without backend or external service",
        solution:
          "Build-time generated JSON index (/blog/search.json) queried client-side using Fuse.js. The library is lazy-loaded on first search interaction, keeping the initial bundle minimal.",
      },
      {
        title: "SEO title truncation without double truncation",
        solution:
          "SEO titles stay under 60 characters. Truncation happens at render time in the SEOHead component — not at the CMS level — preserving data integrity while ensuring correct display.",
      },
      {
        title: "Portable Text heading IDs and TOC sync",
        solution:
          "A utility (getContentHeadings) generates slug-based IDs with collision handling (e.g., my-heading-2 for duplicates) and synchronizes them between the rendered content and the TableOfContents component, ensuring anchor links work correctly.",
      },
      {
        title: "Monorepo dev workflow",
        solution:
          "Root pnpm -r dev command starts both workspaces, with individual scripts (dev:web, dev:studio) for focused work. The seed script (pnpm seed) populates the Sanity dataset with realistic sample content including all custom block types.",
      },
    ],
    results: [
      { metric: "Lighthouse Performance", target: "90+" },
      { metric: "Lighthouse SEO", target: "100" },
      { metric: "Lighthouse Accessibility", target: "95+" },
      { metric: "First Contentful Paint", target: "< 1.5s (edge-cached)" },
      { metric: "Core Web Vitals", target: "All green (LCP, FID, CLS)" },
    ],
    futureEnhancements: [
      "Additional custom block types for richer content",
      "Advanced analytics integration",
      "Multi-language support",
      "Comment system with moderation",
      "Newsletter integration",
    ],
    deployment: {
      frontend: "Vercel (on-demand ISR)",
      cms: "Sanity Cloud",
      database: "Sanity CDN",
      ci: "GitHub Actions",
    },
  },
  {
    slug: "real-time-analytics-dashboard",
    title: "Real-Time Analytics Dashboard",
    tagline:
      "A production-grade real-time analytics platform with live metrics streaming every 2 seconds, threshold-based alerting, and full API key management",
    description:
      "Built as a pnpm monorepo: Next.js 16 web client, NestJS 12 WebSocket backend, and shared TypeScript contract package. Deployed on Vercel + Render with MongoDB Atlas and Upstash Redis.",
    shortDescription:
      "Real-time analytics platform with WebSocket streaming, alerting, and API key management.",
    thumbnail: "/web/case-studies/real-time-analytics.webp",
    badge: "Enterprise Architecture",
    techStack: [
      { name: "Next.js", color: "bg-slate-500", icon: "nextjs" },
      { name: "NestJS", color: "bg-red-500", icon: "nestjs" },
      { name: "Socket.io", color: "bg-black", icon: "socketio" },
      { name: "MongoDB", color: "bg-green-500", icon: "mongodb" },
      { name: "Redis", color: "bg-red-500", icon: "redis" },
      { name: "TypeScript", color: "bg-blue-500", icon: "typescript" },
      { name: "Tailwind CSS", color: "bg-teal-500", icon: "tailwind" },
      { name: "Zustand", color: "bg-orange-500", icon: "zustand" },
      { name: "TanStack", color: "bg-purple-500", icon: "tanstack" },
    ],
    links: {
      live: "https://real-time-analytics-78wd.vercel.app",
      github: "https://github.com/BoNyambe-sudo/Real-time-analytics",
    },
    overview: `A production-grade real-time analytics platform built as a pnpm monorepo: Next.js 16 web client, NestJS 12 WebSocket backend, and a shared TypeScript contract package. Live metrics stream to the browser every 2 seconds with threshold-based alerting, searchable log streams, and full API key management — deployed on Vercel + Render with MongoDB Atlas and Upstash Redis.`,
    architecture: `
┌────────────────────┐   BFF /api/*    ┌────────────────────┐
│  Next.js 16 (web)  │ ── session ───▶ │   NestJS 12 API    │
│  Vercel :3000      │   + x-api-key   │   Render :4000     │
│  - React Query     │                 │   - REST controllers│
│  - Zustand store   │ ◀─ socket.io ── │   - Socket Gateway │
│  - Virtualized UI  │   org rooms     │   - @Cron 2s sim   │
└────────────────────┘                 └─────────┬──────────┘
        │                                        │
        │                           ┌─────────────┼─────────────┐
        └──────────────────────────▶ MongoDB Atlas │  Upstash Redis
                                    │ TTL 30d      │ cache + rate limit
                                    └───────────────┴─────────────┘

- apps/web — Next.js frontend with BFF API routes that authenticate the session and proxy to NestJS with a server-side BFF_API_KEY
- apps/server — NestJS backend: REST controllers, Socket.io gateway, cron simulation, throttler storage
- packages/shared — Zod schemas, env validation, and Auth.js cookie decryption (HKDF + JWE) so the server can trust sessions issued by the web app
- loadtest/ — k6 scenario scripts`,
    keyDecisions: [
      "pnpm 10 workspaces for monorepo management",
      "Shared package for Zod schemas, env validation, and Auth.js cookie decryption",
      "BFF pattern with Next.js API routes proxying to NestJS backend",
      "Socket.io with org-based rooms for real-time updates",
      "Upstash Redis for caching and rate limiting (HTTP-based, not ioredis)",
      "30-day TTL indexes on metrics and logs for automatic cleanup",
    ],
    features: [
      {
        title: "Real-time Metrics Engine",
        items: [
          "@Cron('*/2 * * * * *') simulation service generates jittered metric batches per organization every 2 seconds",
          "Bulk-inserts with insertMany and broadcasts each org's batch to its Socket.io room (org:{id})",
          "Client dedupes points by timestamp in a Zustand store (Map keyed by ts) and merges with React Query's initial 24h timeseries",
        ],
      },
      {
        title: "Triple-mode WebSocket Auth",
        items: [
          "httpOnly Auth.js session cookie (decrypted server-side)",
          "Short-lived (5-min) HS256 JWT minted by BFF /api/socket-token route",
          "Raw API key for machine-to-machine auth",
          "Org rooms enforce authorization on join:org — only members or admins can subscribe",
        ],
      },
      {
        title: "Threshold Alerts with Cooldown",
        items: [
          "When error rate exceeds 5%, AlertService.evaluate fires",
          "Only if no unacknowledged alert exists for that org in the last 5 minutes (prevents alert storms)",
          "Alerts stream over socket, surface as toast notifications with value-vs-threshold context",
          "Supports acknowledge workflow",
        ],
      },
      {
        title: "Searchable Log Stream",
        items: [
          "Cursor-based pagination (fetch limit + 1 to detect hasMore)",
          "Regex search across message/path, level filtering, sort toggle",
          "300ms debounced input",
          "Virtualized table (@tanstack/react-virtual, 48px rows, overscan 20) over an infinite query",
          "Smooth with 10k seeded entries",
        ],
      },
      {
        title: "API Key Lifecycle",
        items: [
          "64-char hex keys (32 random bytes), only SHA-256 hash persisted",
          "8-char prefix enables fast lookup",
          "Create, revoke, regenerate, set-default, expiry dates, and lastUsedAt tracking",
          "ApiKeyGuard accepts x-api-key header or Bearer token",
        ],
      },
      {
        title: "Server-side Time Bucketing",
        items: [
          "Timeseries endpoint aggregates raw 2s points into 1m / 5m / 1h buckets for 1h / 24h / 7d ranges",
          "Charts stay fast as data grows",
          "Metric and log collections carry 30-day TTL indexes",
        ],
      },
      {
        title: "Caching & Rate Limiting",
        items: [
          "Metrics summary cached in Upstash Redis with 5s setex (plus in-memory fallback in BFF)",
          "Rate limiting uses custom ThrottlerStorage on Upstash sorted sets (atomic zadd + zremrangebyscore + zcard in multi())",
          "In-memory fallback when Redis is unavailable",
        ],
      },
    ],
    challenges: [
      {
        title: "httpOnly cookies don't cross origins with Socket.io",
        solution:
          "The web app (Vercel) and API (Render) are separate origins, so the browser can't attach the session cookie to the WS handshake. Solution: BFF issues a 5-minute JWT (/api/socket-token) that the client passes as a query param. The guard tries cookie first, then JWT, then API key — one guard, three transport strategies.",
      },
      {
        title: "Socket.io's built-in reconnection breaks with expiring tokens",
        solution:
          "Disabled native reconnection and implemented manual exponential backoff (1s doubling to 30s cap, 10 attempts) that re-mints the token through the BFF on every attempt (apps/web/src/hooks/useSocket.ts).",
      },
      {
        title: "Upstash Redis is HTTP-based, not ioredis",
        solution:
          "@nestjs/throttler ships an ioredis storage that can't talk to Upstash's REST API. Implemented the ThrottlerStorage interface directly against @upstash/redis using sorted sets as a sliding window — atomic via multi(), with graceful in-memory fallback.",
      },
      {
        title: "Cross-app session trust without per-request auth calls",
        solution:
          "packages/shared replicates Auth.js key derivation (HKDF-SHA256 with the cookie salt, both authjs.session-token and __Secure- variants) and decrypts the JWE with the shared AUTH_SECRET using jose. Both apps verify the same cookie independently.",
      },
      {
        title: "MongoDB Atlas DNS resolution failures on Windows",
        solution:
          "Connection attempts intermittently failed during development; fixed by pinning resolvers (dns.setServers(['8.8.8.8', '1.1.1.1'])) in both the server bootstrap and the seed script.",
      },
      {
        title: "Mongoose model duplication in dev hot-reload",
        solution:
          "nest start --watch re-registered models and threw OverwriteModelError; guarded with mongoose.models.X ?? model('X', schema). ESM required .js extensions on all relative imports.",
      },
      {
        title: "CI flakiness",
        solution:
          "Lint and test steps removed from GitHub Actions workflow after false failures, leaving format:check, typecheck, and build as the CI gate — a deliberate trade-off to keep main green while the test suite matured.",
      },
      {
        title: "Duplicate/out-of-order socket batches",
        solution:
          "Rapid emissions could deliver overlapping points; the store dedupes by timestamp and re-sorts ascending before render, keeping charts correct without server-side coordination.",
      },
    ],
    performance: [
      "k6 load test: 250 concurrent WebSocket VUs (30s ramp, 2m hold) plus 50 RPS REST for 2 minutes",
      "Pass thresholds: p95 latency < 500ms, HTTP failure rate < 1%, WS connect success ≥ 99%",
      "Unit tests (Vitest): API key service, alert service, gateway, throttler storage, and simulation specs",
      "Degradation paths: in-memory cache when Redis is unconfigured, in-memory throttler fallback, REST polling (5s refetch) as baseline",
    ],
    futureEnhancements: [
      "OAuth providers (credentials-only auth currently)",
      "Multi-org self-signup",
      "Horizontal WebSocket scaling (sticky sessions + Socket.io Redis adapter)",
      "Docker Compose for local development",
    ],
    deployment: {
      frontend: "Vercel (apps/web)",
      backend: "Render / Fly.io / Railway (apps/server)",
      database: "MongoDB Atlas M0 + Upstash Redis",
      ci: "GitHub Actions",
    },
  },
  {
    slug: "smart-irrigation-zambia",
    title: "Smart Irrigation Zambia",
    tagline:
      "Smart Irrigation Zambia — Full-stack e-commerce and operations platform for selling, quoting, and installing irrigation systems across Zambia",
    description:
      "A Next.js 16 web app serving farmers (self-serve 5-step ordering with geolocation and site photos) and an admin operations team (live SSE dashboard, farm map, status pipeline). Built with Next.js, Prisma, PostgreSQL, and NextAuth.",
    shortDescription:
      "E-commerce and operations platform for irrigation systems with 5-step ordering, geolocation, and real-time admin dashboard.",
    thumbnail: "/web/case-studies/smart-irrigation-zambia.webp",
    badge: "Real-time Ops",
    techStack: [
      { name: "Next.js", color: "bg-slate-500", icon: "nextjs" },
      { name: "React", color: "bg-teal-500", icon: "react" },
      { name: "TypeScript", color: "bg-blue-500", icon: "typescript" },
      { name: "Tailwind CSS", color: "bg-teal-500", icon: "tailwind" },
      { name: "Prisma", color: "bg-slate-700", icon: "prisma" },
      { name: "PostgreSQL", color: "bg-blue-700", icon: "postgres" },
      { name: "NextAuth", color: "bg-black", icon: "nextauth" },
    ],
    links: {
      live: "https://irrigation-system-delta.vercel.app",
      github: "https://github.com/BoNyambe-sudo/irrigation-system.git",
    },
    overview: `Smart Irrigation Zambia is a Next.js 16 web application serving farmers (self-serve 5-step ordering with geolocation and site photos) and an admin operations team (live SSE dashboard, farm map, status pipeline).`,
    architecture: `Browser (React 19) -> Next.js App Router (Server Actions/RSC) -> Prisma 7 -> PostgreSQL 16; SSE stream via /api/events over in-memory pub/sub.`,
    keyDecisions: [
      "Server Actions for mutations; Route Handlers only where needed",
      "In-memory realtime bus for SSE broadcasts",
      "Client-only maps via dynamic import with ssr: false",
      "Mockable payment layer separated from order logic",
    ],
    features: [
      {
        title: "Customer Ordering",
        items: [
          "Product grid with type filters",
          "5-step checkout: customer, location, farm, payment, confirm",
          "Geolocation + draggable map",
          "Site photo uploads",
          "Order tracking by ID or phone",
        ],
      },
      {
        title: "Admin Operations",
        items: [
          "Dashboard counts and revenue",
          "Live orders table via SSE with toast + chime",
          "Order detail with timeline and map",
          "Product CRUD",
          "Farm map with all farms",
        ],
      },
    ],
    challenges: [
      {
        title: "In-memory realtime bus is process-local",
        solution: "Replace with Redis pub/sub for multi-instance.",
      },
    ],
    futureEnhancements: [
      "Real payment provider integration",
      "Object storage for photos",
      "Tests and CI",
    ],
    deployment: {
      frontend: "Vercel",
      database: "PostgreSQL (Docker)",
      ci: "GitHub Actions",
    },
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((cs) => cs.slug === slug);
}

export function getAllCaseStudySlugs(): string[] {
  return caseStudies.map((cs) => cs.slug);
}

export function getCaseStudiesByTech(tech: string): CaseStudy[] {
  return caseStudies.filter((cs) =>
    cs.techStack.some((t) => t.name.toLowerCase() === tech.toLowerCase())
  );
}