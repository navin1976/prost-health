# Dramatic Scroll Animations Design

**Date:** 2025-01-08
**Status:** Approved for implementation
**Scope:** Desktop scroll animations with simplified mobile versions

## Overview

Implement dramatic, professional scroll animations inspired by modern web experiences (e.g., Neuracore) while maintaining the medical website's formal aesthetic and current typography/spacing.

## Core Requirements

- **Smooth momentum scrolling** foundation
- **Parallax depth effects** for layered visual interest
- **3D card/element transforms** for premium feel
- **Large dramatic movements** where appropriate
- **Simplified animations on mobile** for performance
- **Modern browsers only** (latest Chrome/Safari/Firefox)

## Technical Architecture

### Libraries (npm-based)

```bash
npm install lenis gsap
```

- **Lenis** (~8KB) - Smooth momentum scrolling with native-feeling easing
- **GSAP Core** (~30KB) - Animation engine for transforms, scales, rotations
- **ScrollTrigger plugin** (~12KB) - Scroll-triggered GSAP animations

### Integration Approach

**File Structure:**
```
src/
├── scripts/
│   └── animations.ts          # Main animation initialization
└── pages/
    └── index.astro            # Import and run animations
```

**Initialization:**
- Client-side script in Astro pages using `<script>` tags
- Lenis initializes globally for smooth scrolling
- ScrollTrigger instances per animated section
- Astro build process bundles and optimizes automatically

**Progressive Enhancement:**
- Animations are client-side enhancements
- CSS transitions work if JavaScript fails
- `data-animate` attributes mark elements declaratively

## Priority Sections

### 1. Timeline Section (Highest Priority)

**Current:** Basic slide-in from left/right

**Enhancements:**

**Smooth Scroll Behavior:**
- Lenis slows scroll speed to 0.8x when timeline enters viewport
- Creates "heavy" substantial feel for this important section

**Timeline Line Animation:**
- Particle trail follows line growth (GSAP motion path)
- Glowing "active point" follows growth
- Pulsates at each card connection point

**Card Entrance Sequence:**
- Start 300px offscreen (vs current 100px)
- Rotate 12° on Y-axis while sliding in
- Scale from 0.75 → 1.0
- Blur effect: blur(10px) → blur(0px)
- Stagger delay: 0.2s between cards
- Sequential reveal: Card animates when previous is 60% visible

**Hover State (3D):**
- Lift 30px on Z-axis (translateZ)
- Rotate toward cursor position (dynamic rotateX/Y)
- Shadow grows and shifts dramatically
- Spring easing for natural feel

**Mobile:** Simple slide-in from right, no rotation/blur, faster transitions

### 2. Statistics & Data Sections

**Biparametric MRI Stats (96%, 0, 20):**
- Number counter: Animate from 0 to target value on viewport entry
- 3D lift on hover (perspective transform)
- Staggered entrance: 0.15s delay per stat
- Pulsing glow on numbers: scale 1.0 → 1.05 breathe

**Risk Visualization:**
- Scale-up entrance: 0.85 → 1.0
- Icon grids: Cascade wave effect
- Toggle buttons: Magnetic hover (shift toward cursor)

### 3. Benefit/Advantage Card Grids

**Card Entrance:**
- 3D rotation: Start 15° rotated on X-axis, flatten on entry
- Scale + blur: Start 0.7 scale blurred, grow and sharpen
- Wave stagger: Diagonal waves across grid (0.1s between cards)

**Card Hover:**
- Dramatic lift: translateZ(40px) with large shadow
- Tilt toward cursor position
- Border glow fade-in (teal accent)
- Icon scales up slightly

**Mobile:** Simple fade-up, no 3D

### 4. Hero Section (Subtle Enhancements)

**Keep:** Current typography, spacing, layout

**Add:**
- Gentle parallax: Background image at 0.5x scroll speed
- Button hover: Subtle 5px translateZ lift
- Text fade-in on load: opacity 0 → 1 over 0.8s

## Implementation Notes

- All 3D transforms use CSS `perspective` on parent containers
- GPU acceleration via `transform: translate3d()` and `will-change`
- Intersection Observer for viewport detection
- requestAnimationFrame for smooth 60fps
- Media query: `@media (max-width: 768px)` for mobile simplification
- Desktop-only complex effects: `@media (hover: hover) and (pointer: fine)`

## Success Criteria

- Smooth momentum scrolling feels premium and polished
- Timeline section commands attention with dramatic reveals
- Card interactions feel responsive and high-quality
- Mobile experience is performant with simplified animations
- Site degrades gracefully if JavaScript disabled

## Rollback Plan

If animations don't meet expectations:
1. Git revert commits
2. Remove npm packages: `npm uninstall lenis gsap`
3. Restore original CSS transitions
4. All existing functionality preserved
