# Astro Migration Plan: React → Astro

## 1. Scope & Constraints

**In scope:** Public-facing pages only. No admin routes, no auth (login/signup), no blog comments.

**Interactive islands (React only):**
- Contact form (`/contact`)
- Appointment booking form (used in `/website-survey` outcome + `/services` contact section)
- Blog filter/sort sidebar (`/blog`)

**Static by default:** All other pages, layouts, and UI shell.

**Design fidelity:** Preserve existing Tailwind v4 + shadcn/ui visual system, custom CSS animations, GSAP motion, and icon set.

**Performance target:** SSG with pre-rendered blog posts fetched from the backend at build time. Target LCP < 2.5s, CLS < 0.1.

---

## 2. Route Mapping

| React Route | Astro Route | Strategy |
|-------------|-------------|----------|
| `/` | `/src/pages/index.astro` | Static |
| `/services` | `/src/pages/services.astro` | Static + GSAP island |
| `/blog` | `/src/pages/blog/index.astro` | Static shell + React island for filters |
| `/blog/:slug` | `/src/pages/blog/[slug].astro` | SSG via `getStaticPaths` |
| `/contact` | `/src/pages/contact.astro` | Static shell + React island for form |
| `/faqs` | `/src/pages/faqs.astro` | Static |
| `/privacy-policy` | `/src/pages/privacy-policy.astro` | Static |
| `/terms-of-service` | `/src/pages/terms-of-service.astro` | Static |
| `/website-survey` | `/src/pages/website-survey.astro` | Static shell + React island for survey wizard + appointment dialog |
| `/website-benefits` | `/src/pages/website-benefits.astro` | Static + GSAP |

**Removed (per override):**
- `/admin*` — all admin routes dropped
- `/manage-account` — dropped
- `/auth/callback` — dropped
- Blog comment sections — dropped

---

## 3. Architecture Decisions

### 3.1 Data Layer
- **Blog posts:** Fetched from `https://mysite-backend-rtck.onrender.com/api/v1/blogs` at build time using Astro’s `fetch` in `getStaticPaths`. No runtime client fetching for initial render.
- **Top tags for filter sidebar:** Fetched at build time in the blog list page and passed as props to the filter island.
- **Contact & appointment mutations:** Remain client-side API calls inside React islands (same endpoints as React app).

### 3.2 SEO Strategy
- Replace `react-helmet-async` with Astro’s native `<title>` and `<meta>` tags in page frontmatter + layout.
- Embed JSON-LD schemas via `<script type="application/ld+json">` in page templates.
- Keep existing schema generators (`getOrganizationSchema`, `getBlogPostSchema`, `getFAQSchema`, `getBreadcrumbSchema`) ported to `/src/lib/seoConfig.ts`.
- Add `canonical` URLs, Open Graph, Twitter Cards, and `theme-color` in the base layout.
- Preload `hero.webp` with `fetchpriority="high"` on the homepage.

### 3.3 Styling
- Copy the React app’s `src/index.css` custom properties, animations, and `@layer` rules into `/src/styles/global.css`.
- Preserve the existing Tailwind v4 + shadcn/ui component library already scaffolded in the Astro project.
- Keep the `@/` path alias (already configured in `tsconfig.json`).

### 3.4 Icons & Assets
- Port all SVG icon components from `src/components/icons/` into `/src/components/icons/`.
- Replace `hero.jpg` with `hero.webp` in the assets folder and update references.
- Keep existing public assets (`favicon.svg`, `favicon.ico`).

### 3.5 Theme & Motion
- **Theme toggle:** Reimplement as a lightweight Astro component with a client directive (`client:load`) or a tiny vanilla-JS island. Avoid porting the full React `ToggleTheme` drag behavior unless strictly required; a fixed sun/moon/system toggle is sufficient.
- **GSAP animations:** Keep Services and WebsiteBenefits pages as Astro components with `client:load` on the animated wrapper, or port the GSAP logic into a small React island if the animation is complex. Prefer vanilla GSAP in `<script>` tags to avoid unnecessary React hydration.

### 3.6 Accessibility
- Preserve skip-to-main-content links.
- Keep ARIA labels on icon-only buttons, nav landmarks, and dialog semantics.
- Ensure all images have descriptive `alt` text (already present in React code).
- Maintain focus management in the appointment dialog (Radix UI behavior to be replicated with shadcn Dialog in React island).

---

## 4. File Structure (Target)

```
astro-version/
├── src/
│   ├── assets/
│   │   └── hero.webp
│   ├── components/
│   │   ├── ui/                    # existing shadcn components
│   │   ├── icons/                 # ported SVG icons
│   │   ├── Layout.astro
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── Logo.astro
│   │   ├── SocialLinks.astro
│   │   ├── ScrollToTop.astro
│   │   ├── BlogCard.astro
│   │   ├── BlogCardSkeleton.astro
│   │   ├── SingleBlogSkeleton.astro
│   │   ├── BenefitCard.astro
│   │   ├── BlogRenderer.astro     # static HTML renderer
│   │   ├── ContactForm.tsx         # React island
│   │   ├── AppointmentDialog.tsx   # React island
│   │   └── BlogFilters.tsx         # React island
│   ├── layouts/
│   │   └── Layout.astro
│   ├── lib/
│   │   ├── seoConfig.ts            # ported schema generators
│   │   ├── constants.ts
│   │   ├── utils.ts
│   │   └── formattedDate.ts
│   ├── pages/
│   │   ├── index.astro             # Home
│   │   ├── services.astro
│   │   ├── blog/
│   │   │   ├── index.astro         # list + filter island
│   │   │   └── [slug].astro        # SSG post
│   │   ├── contact.astro           # contact form island
│   │   ├── faqs.astro
│   │   ├── privacy-policy.astro
│   │   ├── terms-of-service.astro
│   │   ├── website-survey.astro    # survey island + appointment
│   │   └── website-benefits.astro
│   └── styles/
│       └── global.css              # merged CSS from React app
├── public/
│   └── favicon.{svg,ico}
├── astro.config.mjs
├── components.json
├── package.json
└── tsconfig.json
```

---

## 5. Step-by-Step Implementation Plan

### Phase 1: Foundation & Design System
1. **Copy and merge CSS** from React `src/index.css` into Astro `src/styles/global.css`. Preserve custom properties, animations (`trigger-pulse`, `survey-fade-in`, `sidebar-glow`), and `@layer` rules.
2. **Port utilities** (`cn`, `formatCompactNumber`, `formatDate`) to `/src/lib/`.
3. **Port constants** (`SITE_URL`, social links, blog categories, keyword maps) to `/src/lib/seoConfig.ts` and `/src/lib/constants.ts`.
4. **Port SVG icons** from `src/components/icons/` to Astro `src/components/icons/`.
5. **Update `astro.config.mjs`** to ensure `base` is set correctly for GitHub Pages (`/web/`) if needed, matching the React `base` config.

### Phase 2: Layout & Shell
6. **Create `src/layouts/Layout.astro`** with:
   - `<!DOCTYPE html>`, `<html lang="en">`, charset, viewport
   - `<title>` and meta description slot
   - Canonical link, OG tags, Twitter Card, theme-color
   - Global JSON-LD for Organization schema
   - `<slot />` for page content
7. **Port `Header.astro`** — simplified public nav (Home, Services, Blog, FAQs, Contact). Remove login/signup/admin buttons.
8. **Port `Footer.astro`** — copyright, nav links, social icons.
9. **Port `Logo.astro`** — inline SVG component.
10. **Port `ScrollToTop.astro`** — view-transition or simple `window.scrollTo`.

### Phase 3: Static Pages
11. **Home (`index.astro`)** — port hero section, problem/solution, services, featured projects, process, why-stack, FAQ grid, final CTA. Replace `hero.jpg` with `hero.webp` and add `<link rel="preload" as="image" href="/assets/hero.webp" fetchpriority="high">` in layout for LCP optimization.
12. **Services (`services.astro`)** — port tech stack grid, services carousel, projects accordion, and contact cards. Wrap GSAP animation logic in `client:load` or vanilla script.
13. **FAQs (`faqs.astro`)** — port accordion grid + FAQPage JSON-LD.
14. **Privacy Policy & Terms** — port prose content verbatim.
15. **Website Benefits (`website-benefits.astro`)** — port sections + GSAP entrance animations.

### Phase 4: Blog System (SSG)
16. **Create `src/pages/blog/[slug].astro`** with `export async function getStaticPaths()`:
    - Fetch all published blogs from backend API at build time.
    - Return `params: { slug }` and `props: { blog }`.
    - Render `BlogRenderer` with `blog.content`.
    - Inject `BlogPosting` JSON-LD.
    - Remove comment section and similar-blogs sidebar (or keep similar-blogs as static if desired, but no comments).
17. **Create `src/pages/blog/index.astro`**:
    - Fetch initial blog list + top tags at build time.
    - Render static blog cards grid.
    - Embed `BlogFilters` React island for client-side filtering/sorting.
    - Inject `CollectionPage` JSON-LD.

### Phase 5: Interactive Islands (React)
18. **Contact Form Island (`ContactForm.tsx`)**:
    - Port form fields, validation, and `POST /appointments/inquiry` mutation.
    - Use shadcn `Button`, `Input`, `Label`, `Textarea`.
    - Wrap with `client:load` or `client:visible` on the Astro page.
19. **Appointment Dialog Island (`AppointmentDialog.tsx`)**:
    - Port full dialog with calendar, time picker, and `POST /appointments` mutation.
    - Used by survey outcome and services contact card.
20. **Survey Island (`PrimalSurvey.tsx`)**:
    - Port 8-step wizard with zustand store persisted to `localStorage`.
    - Outcome step opens `AppointmentDialog` island.
21. **Blog Filters Island (`BlogFilters.tsx`)**:
    - Port sidebar with category checkboxes, tag checkboxes, latest toggle, sort select.
    - Receive initial data as props from Astro page.
    - Communicate filter changes via callback or shared state.

### Phase 6: SEO & Meta Polish
22. **Centralize SEO** in `Layout.astro` frontmatter and `seoConfig.ts`.
23. **Add breadcrumbs** on blog post pages.
24. **Verify canonical URLs** match the deployed site structure.
25. **Add `sitemap.xml` and `robots.txt`** in `/public` for static routes.

### Phase 7: Assets & Performance
26. **Convert `hero.jpg` → `hero.webp`** using existing optimized asset. Update all references.
27. **Audit image alt text** across all pages.
28. **Add lazy loading** to below-fold images (`loading="lazy"`).
29. **Verify Core Web Vitals** with `astro build` + preview.

### Phase 8: Validation
30. Run `astro build` and verify no errors.
31. Run `astro preview` and visually compare against React production build.
32. Validate JSON-LD with Google Rich Results Test.
33. Test contact form and appointment booking end-to-end against backend.
14. Test blog filter/sort island functionality.
15. Run Lighthouse on deployed preview; fix any accessibility or performance issues.

---

## 6. Risk Register

| Risk | Mitigation |
|------|-----------|
| Backend API changes during migration | Pin API contracts; use same endpoints as React app |
| GSAP animation breakage in Astro hydration | Test `client:load` vs vanilla script approach early |
| Blog SSG build time too long | Paginate or limit initial fetch; cache responses |
| Image format incompatibility | Verify `.webp` support in target browsers; keep `.jpg` fallback if needed |
| Filter island state desync with static list | Design island to own state fully; static list is initial render only |

---

## 7. Open Questions

1. **Base path:** Should the Astro site keep the `/web/` base path (matching current React deployment) or move to root `/`?  
   *Recommendation: Keep `/web/` to avoid breaking existing links.*

2. **GSAP strategy:** Do you want GSAP animations preserved exactly as-is (React islands), or is vanilla JS acceptable for simpler scroll-triggered effects?  
   *Recommendation: Vanilla GSAP in `client:load` to reduce React bundle size.*

3. **Blog pagination:** The React app uses infinite scroll. Should the Astro blog list paginate or keep infinite scroll inside the filter island?  
   *Recommendation: Keep infinite scroll inside the React island for parity.*

4. **Theme toggle placement:** The React app has a draggable floating toggle. Should this be preserved exactly, or simplified to a fixed header toggle?  
   *Recommendation: Fixed header toggle; draggable behavior adds complexity without conversion value.*

5. **Contact form CTA placement:** Should the contact form appear only on `/contact`, or also as an inline CTA block on other pages (e.g., Services)?  
   *Recommendation: Keep inline CTA on Services page using the same React island.*
