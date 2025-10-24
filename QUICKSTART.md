# Prost Health - Quick Reference

## 🌐 Dev Server is Running!

**URL:** http://localhost:4321

**Status:** ✅ Running in background (PID: see dev-server.pid)

---

## 📋 Quick Commands

### Manage Dev Server

```bash
# Check status
./dev-server.sh status

# Stop server
./dev-server.sh stop

# Start server
./dev-server.sh start

# Restart server
./dev-server.sh restart

# View live logs
./dev-server.sh logs
```

### Development Commands

```bash
# Install dependencies
pnpm install

# Build for production
pnpm build

# Preview production build
pnpm preview

# Lint code
pnpm lint

# Format code
pnpm format

# Type check
pnpm type-check
```

---

## 📂 Quick File Locations

### Add Content

```bash
# Blog posts (Markdown)
src/content/insights/your-post.md

# Expert profiles (Markdown)
src/content/experts/expert-name.md

# New pages
src/pages/your-page.astro

# Components
src/components/sections/YourComponent.astro

# Images
public/images/your-image.jpg
```

### Configuration

```bash
# Astro config
astro.config.mjs

# Global CSS (brand colors, typography)
src/styles/global.css

# Constants (messaging, colors, etc.)
src/lib/constants.ts

# Utility functions
src/lib/utils.ts
```

---

## 🎨 Brand Colors (Copy & Paste)

```css
/* In CSS */
color: var(--color-brand-charcoal);  /* #2B2D2F - Body text */
color: var(--color-brand-navy);      /* #1A2332 - Headings */
color: var(--color-brand-gold);      /* #C9A668 - CTAs */
color: var(--color-brand-dark-green);/* #2C5530 - Alt accent */
background: var(--color-brand-warm-grey); /* #E8E6E3 - Backgrounds */
```

```html
<!-- In Tailwind classes -->
<div class="text-[--color-brand-charcoal]">Body text</div>
<h2 class="text-[--color-brand-navy]">Heading</h2>
<button class="bg-[--color-brand-gold]">CTA</button>
```

---

## 📝 Create Blog Post Template

```markdown
---
title: "Your Article Title"
description: "Brief description for SEO"
pubDate: 2025-01-15
category: "Understanding the Diagnosis"
tags: ["tag1", "tag2"]
featured: true
---

# Your Article Title

Your content here...
```

**Categories:**
- Understanding the Diagnosis
- Navigating the Pathway
- Living with Uncertainty
- Health & Lifestyle

---

## 👨‍⚕️ Create Expert Profile Template

```markdown
---
name: "Dr. Example Name"
title: "Consultant Uroradiologist"
slug: "example-name"
image: "/images/experts/example-name.jpg"
imageAlt: "Portrait of Dr. Example Name"
order: 1
appointments:
  - institution: "University College London Hospitals"
    role: "Consultant Radiologist"
qualifications:
  - "FRCR"
  - "MBBS"
researchInterests:
  - "Prostate MRI"
  - "mpMRI reporting"
publications:
  - title: "Example Study"
    journal: "Journal Name"
    year: 2023
    url: "https://example.com"
personalStatement: "Brief statement about philosophy..."
---

Full biography here...
```

---

## 🚀 Deployment Checklist

### Before Deploying:

```bash
# 1. Build locally to check for errors
pnpm build

# 2. Preview the build
pnpm preview

# 3. Check for type errors
pnpm type-check

# 4. Lint and format
pnpm lint:fix
pnpm format
```

### Deploy to Cloudflare Pages:

1. Push to GitHub
2. Go to Cloudflare Pages dashboard
3. Connect repository
4. **Build command:** `pnpm build`
5. **Build output:** `dist`
6. **Node version:** 18+
7. Deploy!

---

## 🔗 Important Links

- **Project Docs:** `openspec/project.md`
- **Setup Guide:** `SETUP.md`
- **Main README:** `README.md`
- **Astro Docs:** https://docs.astro.build
- **Tailwind Docs:** https://tailwindcss.com/docs

---

## 🆘 Troubleshooting

### Server won't start?

```bash
# Check if port 4321 is already in use
lsof -i :4321

# Kill any process using the port
kill -9 <PID>

# Restart
./dev-server.sh restart
```

### Build errors?

```bash
# Clear cache and rebuild
rm -rf node_modules .astro dist
pnpm install
pnpm build
```

### Type errors?

```bash
# Regenerate types
pnpm astro sync
pnpm type-check
```

---

## ✨ Current Status

- ✅ Dev server running at http://localhost:4321
- ✅ Homepage complete with hero, trust bar, problem/solution
- ✅ Responsive navigation with mobile menu
- ✅ Brand colors and typography configured
- ✅ Content Collections ready for blog & experts
- ✅ Zero JavaScript, pure HTML/CSS
- ✅ Build size: ~40KB

**Next:** Add more pages and content! 🎉
