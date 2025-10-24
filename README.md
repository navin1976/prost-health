# Prost Health Website

> **"Clarity, Not Chance."** The definitive approach to prostate health through MRI-first screening.

A lightweight, high-performance static website built with Astro for Prost Health, a premium men's wellness startup focused on revolutionizing proactive prostate health screening.

## 🎯 Project Overview

This is Phase 1 of the Prost Health digital presence—an informational website designed to:

- Establish brand authority in men's prostate health
- Educate users about the MRI-first diagnostic pathway
- Build trust through clinical evidence and expert profiles
- Generate leads through a premium, refined user experience

See [`openspec/project.md`](./openspec/project.md) for complete project context, brand guidelines, and technical specifications.

## 🛠️ Tech Stack

**Core Principle:** Minimal, fast, efficient. Zero bloat. Maximum performance.

- **Framework:** [Astro 5](https://astro.build) (zero JavaScript by default)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com)
- **Typography:** Tailwind Typography plugin
- **Language:** TypeScript (strict mode)
- **Content:** Markdown files with frontmatter (Content Collections)
- **Hosting:** Cloudflare Pages (recommended)

**Why this stack?**
- 🚀 Perfect Lighthouse scores (90-100)
- ⚡ Zero runtime JavaScript for static content
- 📦 Tiny bundle sizes
- 🎨 "Quiet luxury" aesthetic achievable with pure HTML/CSS
- 💰 $0/month hosting on Cloudflare Pages

## 📁 Project Structure

```
prost-health/
├── public/                     # Static assets (images, fonts, favicon)
├── src/
│   ├── components/
│   │   ├── layout/            # Header, Footer, BaseLayout
│   │   ├── sections/          # Hero, TrustBar, etc.
│   │   └── ui/                # Reusable UI components
│   ├── content/               # Markdown content (Git-based CMS)
│   │   ├── insights/          # Blog posts
│   │   ├── experts/           # Expert profiles
│   │   └── config.ts          # Content schema validation
│   ├── lib/
│   │   ├── constants.ts       # Brand constants, trust signals, etc.
│   │   └── utils.ts           # Utility functions
│   ├── pages/                 # Routes (file-based routing)
│   │   ├── index.astro        # Homepage
│   │   ├── our-approach/      # MRI-first approach pages
│   │   ├── the-science.astro  # Clinical evidence
│   │   ├── our-experts/       # Expert profiles
│   │   └── insights/          # Blog
│   ├── styles/
│   │   └── global.css         # Global styles, Tailwind imports
│   └── types/
│       └── index.ts           # TypeScript types
├── openspec/
│   └── project.md             # Complete project context & guidelines
├── astro.config.mjs
├── tailwind.config.mjs        # Brand colors, typography
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- pnpm 8+ (faster than npm/yarn)

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open http://localhost:4321
```

### Development Commands

| Command | Action |
|---------|--------|
| `pnpm dev` | Start dev server at `localhost:4321` |
| `pnpm build` | Build production site to `./dist/` |
| `pnpm preview` | Preview production build locally |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Fix ESLint errors automatically |
| `pnpm format` | Format code with Prettier |
| `pnpm type-check` | Run TypeScript type checking |

## 🎨 Brand Guidelines

### Colors (Tailwind classes)

- `brand-charcoal` (#2B2D2F) - Primary text
- `brand-navy` (#1A2332) - Headings, dark backgrounds
- `brand-warm-grey` (#E8E6E3) - Backgrounds, subtle accents
- `brand-gold` (#C9A668) - Primary CTA, links
- `brand-dark-green` (#2C5530) - Alternative accent

### Typography

- **Headings:** `font-serif` (Playfair Display)
- **Body:** `font-sans` (Inter)
- **Voice:** "Empathetic Expert" — calm, confident, clear

## 📝 Adding Content

### Blog Posts (Insights)

Create a new Markdown file in `src/content/insights/`:

```markdown
---
title: "Understanding PI-RADS Scores"
description: "A clear guide to what your prostate MRI score means"
pubDate: 2025-01-15
category: "Understanding the Diagnosis"
tags: ["PI-RADS", "MRI", "diagnosis"]
featured: true
---

Your content here...
```

### Expert Profiles

Create a new Markdown file in `src/content/experts/`:

```markdown
---
name: "Dr. Example Name"
title: "Consultant Uroradiologist"
slug: "example-name"
image: "/images/experts/example.jpg"
imageAlt: "Portrait of Dr. Example Name"
order: 1
appointments:
  - institution: "University College London Hospitals"
    role: "Consultant Radiologist"
qualifications:
  - "FRCR"
  - "MBBS"
---

Biography and personal statement...
```

## 🚢 Deployment

### Cloudflare Pages (Recommended)

1. Push code to GitHub
2. Connect repository to Cloudflare Pages
3. Build settings:
   - **Build command:** `pnpm build`
   - **Build output:** `dist`
   - **Node version:** 18+
4. Deploy!

**Cost:** $0/month

### Alternative Hosts

- **Netlify:** Same build settings
- **Vercel:** Same build settings (but we avoid vendor lock-in)
- **GitHub Pages:** Static hosting, free

## 📊 Performance Targets

- **Lighthouse Performance:** 90+
- **Lighthouse Accessibility:** 100 (WCAG 2.1 AA)
- **Lighthouse SEO:** 100
- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3.5s

## 🧪 Testing

```bash
# Type checking
pnpm type-check

# Linting
pnpm lint

# Build test (catches errors before deploy)
pnpm build
```

## 📚 Documentation

- [Astro Documentation](https://docs.astro.build)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Project Context & Guidelines](./openspec/project.md)

## 🗺️ Roadmap

### Phase 1 (Current) - Informational Website
- ✅ Homepage
- ⏳ Our Approach pages
- ⏳ The Science page
- ⏳ Our Experts section
- ⏳ Insights/Blog (10-15 articles)
- ⏳ Contact form

### Phase 2 (Future) - Booking & Portal
- Online booking system
- Secure patient portal
- Payment processing
- Authenticated user area

### Phase 3 (Future) - Expansion
- Additional men's health services
- Personalized health dashboard
- Telemedicine integration

## 📄 License

Proprietary - Prost Health

---

Built with ❤️ and Astro. Zero bloat, maximum performance.
