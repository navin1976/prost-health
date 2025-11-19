# Project Context

## Purpose

Prost Health is a premium men's wellness startup focused on revolutionizing proactive prostate health screening through an MRI-first diagnostic pathway. The project aims to create a category-defining brand that transcends conventional medical service providers by combining clinical excellence with aspirational wellness.

### Core Mission
Transform prostate cancer screening from a source of anxiety into an act of empowered, proactive self-care through precision diagnostics and a refined patient experience.

### Brand Proposition
**"Clarity, Not Chance"** - A contrast between the precision of MRI-led screening and the uncertainty of traditional biopsy-first pathways.

### Project Phases
1. **Phase 1 (Current)**: Informational website showcasing the brand, approach, and expertise
2. **Phase 2 (Future)**: Web application with booking functionality, patient portal, and personalized content
3. **Phase 3 (Future)**: Expansion into broader men's health monitoring and services

## Tech Stack

### Philosophy: Minimal, Fast, Efficient
**Core Principle**: Ship only what's necessary. Zero bloat. Maximum performance.

### Phase 1: Static Informational Site (Current)

#### Core Framework
- **SSG**: Astro 5.15.1 (zero JavaScript by default, ship pure HTML/CSS)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4.1.16 with Vite integration
- **Why Astro?**
  - Zero client-side JavaScript by default
  - Perfect Lighthouse scores out of the box
  - Content Collections (Markdown-based, no CMS needed)
  - Island Architecture (add React/Vue only where needed)
  - Can progressively enhance to Phase 2 without rewrite

#### Content Management
- **Blog/Insights**: Markdown files with frontmatter (no CMS overhead)
- **Location**: `src/content/insights/*.md`
- **Schema Validation**: Zod schemas via Astro Content Collections
- **Benefits**: Git-based, version controlled, fast builds, no API calls

#### Forms & Interactivity
- **Contact Form**: HTML form → Serverless function (Cloudflare Workers)
- **Alternative**: FormSpree or Formcarry (zero backend setup)
- **Form Validation**: Native HTML5 validation + progressive enhancement with lightweight JS
- **No heavy form libraries needed** for Phase 1

#### Hosting & Infrastructure
- **Hosting**: Cloudflare Pages (currently active at prost-health.pages.dev)
- **Alternative**: Netlify, GitHub Pages, or any static host
- **DNS**: Cloudflare (configured in astro.config.mjs)
- **SSL**: Auto via Cloudflare
- **Analytics**: Not yet implemented (Plausible Analytics or Cloudflare Web Analytics recommended)
- **Cost**: $0/month (Cloudflare Pages free tier)

#### UI Components (Minimal Approach)
- **No component library needed** - build what you need
- **Headless UI primitives** if needed (e.g., dialog, dropdown)
- **Tailwind CSS** for styling
- **Custom components** only - no framework overhead

#### Animations
- **View Transitions API** (native, zero-JS page transitions)
- **CSS animations** for 90% of effects
- **GSAP 3.13.0** + **Lenis 1.3.14** currently implemented for smooth scroll animations
- Custom scroll animations integrated for enhanced user experience

#### Development Tools
- **Package Manager**: npm (based on package-lock.json)
- **Linting**: ESLint + @typescript-eslint + eslint-plugin-astro
- **Formatting**: Prettier + prettier-plugin-astro
- **Type Checking**: TypeScript strict mode + Astro check
- **Testing**: Not yet implemented (Vitest recommended for utilities)
- **E2E**: Not yet implemented (Playwright recommended for critical paths)
- **Git Hooks**: Not yet implemented (simple-git-hooks + lint-staged recommended)

### Phase 2: Add Booking Functionality (Future)

When you need a backend for bookings, patient portal:

#### Backend Option 1: Lightweight Rust API
- **Framework**: Axum (Tokio-based, blazingly fast)
- **Database**: PostgreSQL (via SQLx, compile-time verified queries)
- **Authentication**: JWT tokens, bcrypt for passwords
- **Hosting**: Fly.io or Railway (cheap, auto-scaling)
- **Why Rust?**
  - Memory safe, no runtime overhead
  - Handles concurrency efficiently
  - Small binary size, fast cold starts
  - Perfect for medical data handling (security-critical)

#### Backend Option 2: Go API (Alternative)
- **Framework**: Chi router or Fiber
- **Database**: PostgreSQL (via pgx or GORM)
- **Simpler than Rust, still very fast**
- **Great stdlib, easy deployment**

#### Backend Option 3: Cloudflare Workers (Serverless)
- **Runtime**: Workers (JavaScript/TypeScript edge functions)
- **Database**: D1 (SQLite on edge) or Turso
- **Pay-per-request**, global deployment
- **Keep frontend static, backend serverless**

#### Frontend Enhancement for Phase 2
- **Keep Astro** as base
- **Add Islands**: React/Preact islands for booking calendar, forms
- **HTMX**: For dynamic form interactions without heavy JS
- **State**: Nanostores (tiny state management, 300 bytes)

### Technology Rationale

**Why NOT Next.js/Vercel?**
- ❌ Overkill for static content site
- ❌ Heavy JavaScript bundle even for simple pages
- ❌ Vendor lock-in with Vercel
- ❌ Complex for Phase 1 needs
- ❌ SSR overhead when you don't need it

**Why Astro?**
- ✅ Zero JavaScript by default (fastest possible)
- ✅ Content Collections perfect for blog
- ✅ Can add framework components (React/Vue) only where needed
- ✅ Best-in-class SEO and performance
- ✅ Deploy anywhere (no vendor lock-in)
- ✅ Progressive enhancement path to Phase 2

**Why Cloudflare Pages?**
- ✅ Free tier is generous
- ✅ Global CDN (117+ locations)
- ✅ Automatic builds from Git
- ✅ Edge functions available (for forms)
- ✅ Best performance/cost ratio

**Why Rust for future backend?**
- ✅ Memory safety (critical for medical data)
- ✅ Concurrent request handling
- ✅ Small resource footprint
- ✅ Compile-time guarantees
- ✅ Your expertise as rust-engineer

## Project Conventions

### Code Style

#### TypeScript
- Strict mode enabled
- Prefer `interface` over `type` for object shapes
- Use explicit return types for functions
- Avoid `any` - use `unknown` when type is truly unknown
- Use strict null checks

#### Naming Conventions
- **Components**: PascalCase (e.g., `HeroSection.tsx`, `ExpertProfile.tsx`)
- **Files**: kebab-case for utilities (e.g., `format-date.ts`)
- **Functions**: camelCase (e.g., `calculatePIRADS`, `fetchExpertProfiles`)
- **Constants**: SCREAMING_SNAKE_CASE (e.g., `NICE_GUIDELINE_URL`)
- **CSS Classes**: Tailwind utilities + custom classes in kebab-case

#### File Structure (Astro)
```
prost-health/
├── src/
│   ├── pages/                  # Routes (file-based routing)
│   │   ├── index.astro         # Homepage
│   │   ├── our-approach/
│   │   │   ├── index.astro
│   │   │   ├── mri-first.astro
│   │   │   ├── pi-rads.astro
│   │   │   └── patient-journey.astro
│   │   ├── the-science.astro
│   │   ├── our-experts/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro    # Dynamic expert profiles
│   │   ├── insights/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro    # Blog posts
│   │   ├── pricing.astro
│   │   ├── faq.astro
│   │   └── contact.astro
│   ├── content/                # Content Collections (Markdown)
│   │   ├── insights/           # Blog posts
│   │   │   ├── understanding-pirads.md
│   │   │   ├── mri-vs-biopsy.md
│   │   │   └── ...
│   │   ├── experts/            # Expert profiles (structured data)
│   │   │   ├── clare-allen.md
│   │   │   ├── alex-kirkham.md
│   │   │   └── ...
│   │   └── config.ts           # Content collection schemas
│   ├── components/
│   │   ├── sections/           # Page sections
│   │   │   ├── Hero.astro
│   │   │   ├── TrustBar.astro
│   │   │   ├── ProblemSolution.astro
│   │   │   └── ...
│   │   ├── ui/                 # Reusable UI components
│   │   │   ├── Button.astro
│   │   │   ├── Card.astro
│   │   │   └── ...
│   │   └── layout/
│   │       ├── Header.astro
│   │       ├── Footer.astro
│   │       └── BaseLayout.astro
│   ├── lib/
│   │   ├── utils.ts            # Utility functions
│   │   └── constants.ts        # App-wide constants
│   ├── styles/
│   │   └── global.css          # Global styles, Tailwind imports
│   └── types/
│       └── index.ts            # Shared TypeScript types
├── public/                     # Static assets
│   ├── images/
│   ├── fonts/
│   └── favicon.svg
├── astro.config.mjs            # Astro configuration
├── tailwind.config.mjs         # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── package.json
```

### Visual Design System

#### Brand Colors
```css
/* Current color palette from global.css */
:root {
  /* Typography - Formal and Professional like Brighton College */
  --font-primary: 'Playfair Display', 'Crimson Text', serif;
  --font-secondary: 'Inter', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --font-accent: 'Poppins', 'Inter', system-ui, sans-serif;

  /* Color Palette - Harmonious & Complementary */
  --color-navy: #1e3a5f; /* Primary navy - adjusted for better harmony */
  --color-navy-dark: #152838; /* Darker navy for hover */
  --color-primary: #1f2937; /* Dark text */
  --color-secondary: #6b7280; /* Medium gray */
  --color-accent: #1e3a5f; /* Navy accent for brand consistency */
  --color-accent-light: #2a5080; /* Lighter navy for hover */
  --color-accent-warm: #c9945f; /* Warm gold - complementary to navy */
  --color-accent-teal: #2d8a8e; /* Teal - analogous harmony */
  --color-timeline: #ff8c42; /* Vibrant orange - complementary to navy */
}
```

#### Typography
- **Headings**: Refined serif font (e.g., Playfair Display, Fraunces)
- **Body**: Modern sans-serif (e.g., Inter, DM Sans)
- **Line Height**: Generous for readability (1.6-1.8 for body)
- **Font Sizes**: Responsive scale using Tailwind typography plugin

#### Spacing
- Use Tailwind spacing scale consistently
- Generous whitespace for "quiet luxury" aesthetic
- Sections: Minimum 80px (mobile) to 160px (desktop) padding

#### Photography Guidelines
- **Custom, professional photography only** - no stock photos
- High-resolution (2x retina)
- Muted, sophisticated color grading
- Focus on architectural spaces and thoughtful portraiture
- Alt text required for all images (accessibility + SEO)

### Architecture Patterns

#### Component Architecture (Astro)
- **Static by default** - all `.astro` components render to HTML at build time
- **Zero runtime** - no client-side JavaScript unless explicitly needed
- **Islands for interactivity** - use `client:*` directives only when necessary
  - `client:load` - load JS immediately
  - `client:idle` - load when browser is idle
  - `client:visible` - load when component is visible
- **Composition over inheritance** - small, reusable components
- **Props are type-safe** via TypeScript interfaces

#### Content Management (Content Collections)
- **Markdown-first** - all content in `src/content/`
- **Type-safe frontmatter** - Zod schemas validate content
- **Git-based workflow** - version controlled, no CMS API
- **Build-time validation** - catches errors before deploy
- **Query at build time** - `getCollection()`, `getEntry()`

#### Routing
- **File-based routing** - `src/pages/` maps to URLs
- **Dynamic routes** - `[slug].astro` for blog posts, expert profiles
- **Layouts** - shared layouts via `<BaseLayout>` component
- **No client-side routing** - standard page navigation (fast, accessible)

#### Performance Strategy
- **Static Site Generation (SSG)** - pre-render everything at build time
- **No hydration overhead** - pure HTML/CSS for static content
- **Critical CSS inlined** - Tailwind purges unused styles
- **Images optimized** - use Astro's `<Image>` component for automatic optimization
- **Lazy loading** - native `loading="lazy"` for images below fold
- **Minimal JavaScript** - only for contact form validation (progressive enhancement)

#### State Management (Phase 1)
- **No state management needed** - static site
- **Form state** - native HTML form + minimal JS validation
- **Future (Phase 2)**: Nanostores (300 bytes) or Preact signals

### Testing Strategy

#### Unit Tests
- Vitest for utilities and hooks
- Test pure functions, data transformations
- Mock external dependencies
- Target: 80%+ coverage for business logic

#### Integration Tests
- Test component interactions
- Mock API responses
- Test form validation and submission

#### E2E Tests (Playwright)
- **Minimal test coverage** - only critical paths
- Critical user journeys:
  - Homepage → Our Approach → Contact
  - Homepage → Our Experts → Individual Expert Profile
  - Insights → Article → Related Articles
- Test on desktop and mobile viewports
- Visual regression testing for brand consistency
- **Philosophy**: Static sites have fewer failure modes, less testing needed

#### Accessibility Testing
- Automated: axe-core, Lighthouse CI
- Manual: Screen reader testing (VoiceOver, NVDA)
- Keyboard navigation testing
- WCAG 2.1 AA compliance minimum

### Content Guidelines

#### Voice and Tone: "Empathetic Expert"
- **Calm, confident, clear**
- Avoid clinical jargon, but respect user intelligence
- Acknowledge anxieties without being patronizing
- Partnership language, not doctor-patient hierarchy

#### Writing Principles
- Short sentences, active voice
- Explain technical terms in context
- Use "you" to address the user directly
- Balance emotional reassurance with clinical evidence

#### SEO Strategy
- Target keywords: "private prostate MRI UK", "MRI-first prostate screening", "prostate cancer diagnosis London"
- Long-tail: "avoid prostate biopsy", "PI-RADS score explained"
- Structured data: Schema.org markup for medical procedures, experts, articles
- Meta descriptions: 150-160 characters, benefit-focused

### Git Workflow

#### Branching Strategy
- `main`: Production-ready code
- `develop`: Integration branch
- Feature branches: `feature/hero-section`, `feature/expert-profiles`
- Hotfix branches: `hotfix/navigation-bug`

#### Commit Conventions (Conventional Commits)
```
feat: add expert profile page component
fix: correct PI-RADS score display
docs: update README with setup instructions
style: adjust hero section spacing
refactor: extract trust signals to component
test: add tests for booking form validation
chore: update dependencies
```

#### Pull Request Process
1. Create feature branch from `develop`
2. Implement feature with tests
3. Run `pnpm lint`, `pnpm type-check`, `pnpm test`
4. Create PR with description referencing any issues
5. Request review
6. Squash and merge to `develop`
7. Deploy to staging for review
8. Merge `develop` to `main` for production deployment

## Domain Context

### Healthcare & Prostate Cancer Screening

#### Current Site Configuration
- **Site URL**: https://prost-health.pages.dev (deployed on Cloudflare Pages)
- **Site Title**: Prost Health
- **Tagline**: "Clarity, Not Chance."
- **Primary Message**: The smarter, safer path to prostate health.
- **Secondary Message**: Our MRI-first approach, guided by leading experts and NICE recommendations, provides definitive clarity while helping you avoid unnecessary biopsies.

#### Clinical Pathway
- **Traditional**: PSA test → DRE → TRUS biopsy (invasive, risk of infection, false negatives)
- **Prost Health (MRI-First)**: PSA → mpMRI → PI-RADS score → Targeted biopsy if necessary

#### PI-RADS Scoring System
- **PI-RADS 1-2**: Low likelihood of significant cancer - avoid biopsy
- **PI-RADS 3**: Equivocal - discuss options
- **PI-RADS 4-5**: High likelihood - MRI-guided biopsy recommended

#### NICE Guidelines (NG131)
- Referenced URL: https://www.nice.org.uk/guideline/ng131
- mpMRI is the first-line investigation for suspected clinically localized prostate cancer
- This is a critical trust signal and third-party endorsement

#### Key Clinical Evidence
- 96% negative predictive value for aggressive cancer over 3 years
- Reduces unnecessary biopsies
- Lower risk of overdiagnosis of insignificant cancers
- Faster biparametric MRI protocols validated (PRIME trial)

#### Target Audience Concerns (from patient forums)
1. Understanding symptoms and test results
2. Treatment options and side effects
3. Emotional impact and anxiety management
4. Supporting partners and family
5. Long-term quality of life

### Competitive Landscape

#### Direct Competitors
- **GenesisCare**: Comprehensive cancer care, feature-led messaging, clinical aesthetic
- **OneWelbeck**: Multi-specialty clinic, service-led, professional but generic
- **HCA Healthcare UK**: Corporate, transactional

#### Prost Health Differentiation
- **Specialist brand** (vs. generalist clinics)
- **Benefit-led, emotional messaging** (vs. feature/service-led)
- **Quiet luxury aesthetic** (vs. corporate clinical)
- **Narrative-driven journey** (vs. informational/transactional)
- **Expert radiologists as the product** (vs. technology/tests as commodity)

## Important Constraints

### Regulatory & Compliance
- **GDPR**: Patient data protection, consent management
- **Medical Device Regulation**: Claims must be evidence-based, cited
- **Advertising Standards**: Cannot make misleading health claims
- **Professional Standards**: Respect GMC, RCR guidelines for consultant representation

### Technical Constraints
- **Performance**: Lighthouse score 90+ (critical for luxury perception)
- **Accessibility**: WCAG 2.1 AA minimum (healthcare equity)
- **Security**: HTTPS, secure forms, no PII in URLs/analytics
- **Browser Support**: Last 2 versions of major browsers + Safari iOS

### Business Constraints
- **Premium Positioning**: All design decisions must reinforce quality, not undermine it
- **Trust is Non-Negotiable**: Clinical accuracy, cited sources, no hype
- **Scalability**: Architecture must support Phase 2 booking without major refactor

### Content Constraints
- **Photography Budget**: Custom photography is expensive - plan shoot carefully
- **Expert Availability**: Consultant profiles require their approval and time
- **Clinical Review**: All medical content must be reviewed by a clinician before publish

## External Dependencies

### Content Sources
- **NICE Guidelines**: [https://www.nice.org.uk/guideline/ng131](https://www.nice.org.uk/guideline/ng131) (already referenced in constants.ts)
- **Prostate Cancer UK**: Patient information, community forums
- **UCLH Research**: Clinical studies, expert publications
- **BMJ, ecancer**: Peer-reviewed clinical evidence

### External Resources (Already defined in constants.ts)
```typescript
export const EXTERNAL_RESOURCES = [
  {
    name: 'Prostate Cancer UK',
    url: 'https://prostatecanceruk.org',
    description: 'Support, information, and community for men with prostate cancer',
  },
  {
    name: 'Macmillan Cancer Support',
    url: 'https://www.macmillan.org.uk/cancer-information-and-support/prostate-cancer',
    description: 'Practical and emotional support for cancer patients and families',
  },
  {
    name: 'Cancer Research UK',
    url: 'https://www.cancerresearchuk.org/about-cancer/prostate-cancer',
    description: 'Evidence-based information about prostate cancer',
  },
] as const;
```

### APIs & Services (Future)
- **CMS**: Sanity.io / Contentful API
- **Email**: Resend / SendGrid
- **Analytics**: Plausible Analytics or Cloudflare Web Analytics (recommended)
- **Booking System**: Custom or integrate with practice management software (Phase 2)

### Third-Party Integrations
- **Trust Signals**: NICE logo (with permission), CQC rating (if applicable)
- **Social Proof**: Expert publications from PubMed, ResearchGate
- **Support Resources**: Links to Prostate Cancer UK, Macmillan forums

### Design Assets
- **Typography**: Google Fonts (Inter, Playfair Display, Poppins, Crimson Text) - already implemented
- **Icons**: TBD - not yet implemented (Lucide React recommended)
- **Photography**: Custom commissioned or high-end stock (Unsplash Plus)

## Key Success Metrics (KPIs)

### Engagement Metrics
- Time on page: "Our Approach" (target: 2+ min), "The Science" (target: 1.5+ min)
- Bounce rate: < 50% on landing pages
- Pages per session: 3+ (indicates content exploration)

### Conversion Metrics
- Contact form submissions
- "Discover Our Approach" CTA clicks
- Download rate for informational guides (future)

### Brand Metrics
- Organic search rankings for target keywords
- Direct traffic volume (brand recall)
- Social mentions and sentiment

### Technical Metrics
- Lighthouse Performance: 90+
- Lighthouse Accessibility: 100
- Core Web Vitals: All "Good"
- Time to First Byte (TTFB): < 600ms

## Project Phases & Roadmap

### Phase 1: Informational Website (Current - MVP)
**Goal**: Establish brand presence, educate users, build trust

**Pages**:
- Homepage (Hero, Problem/Solution, Experts Preview, How It Works, Journal Preview)
- Our Approach (MRI-First, PI-RADS Explained, Patient Journey, Problem with Traditional)
- The Science (NICE Guidelines, Clinical Studies, Technology)
- Our Experts (Individual profiles: Dr. Clare Allen, Dr. Alex Kirkham, etc.)
- Insights / Journal (10-15 foundational articles)
- Pricing (transparent, simple)
- FAQ
- Contact

**Features**:
- Responsive design (mobile-first)
- Custom photography
- SEO optimized
- Fast load times
- Accessible (WCAG AA)
- Contact form

### Phase 2: Booking & Patient Portal (Future)
**Goal**: Enable direct bookings, provide premium patient experience

**New Features**:
- Online booking system with calendar
- Secure patient portal (view results, imaging reports)
- Personalized content recommendations
- Encrypted messaging with care coordinator
- Payment processing

**Technical Additions**:
- Authentication system
- Database for patient records
- HIPAA/GDPR compliant data handling
- Integration with clinic scheduling software

### Phase 3: Expansion (Future)
**Goal**: Broaden into proactive men's health monitoring

**Potential Additions**:
- Cardiovascular health screening
- Metabolic health assessments
- Personalized health dashboard
- Subscription wellness programs
- Telemedicine consultations

## Implementation Status (Current)

### Completed
- Astro 5.15.1 site with TypeScript strict mode
- Tailwind CSS 4.1.16 styling with Vite integration
- GSAP 3.13.0 + Lenis 1.3.14 for smooth scroll animations
- Content Collections configured for insights and experts
- Constants library with NICE Guidelines, PI-RADS scores, navigation items
- BaseLayout with proper SEO meta tags
- Modern color palette with navy/teal/gold accents inspired by Brighton College
- Deployed to Cloudflare Pages at https://prost-health.pages.dev

### In Progress
- Content population (insights and experts directories exist but empty)
- Component library development
- Page implementation beyond homepage

### Not Yet Implemented
- Testing (Vitest for utilities, Playwright for E2E)
- Analytics implementation
- Contact form functionality
- Git hooks (simple-git-hooks + lint-staged)
- Social media integration

## Notes for AI Assistants

When working on this project:

1. **Prioritize trust and clinical accuracy** - always cite sources for medical claims
2. **Maintain the "quiet luxury" aesthetic** - restraint, whitespace, sophistication
3. **Write in the "Empathetic Expert" voice** - calm, confident, clear, non-patronizing
4. **Component naming should reflect brand language**: `TrustBar`, `ClarityStatement`, `ExpertProfile`
5. **Accessibility is non-negotiable** - this is healthcare; everyone must be able to access information
6. **Performance = Perception of quality** - slow sites feel cheap
7. **Evidence-based design decisions** - reference the branding document when making creative choices
8. **Mobile experience is critical** - many users will research health concerns on phones
9. **Respect patient privacy** - no tracking that could identify individuals
10. **Future-proof architecture** - Phase 1 decisions should not block Phase 2 implementation
