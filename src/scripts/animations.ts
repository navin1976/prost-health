import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initAnimations() {
  // Check if we're on desktop with hover capability
  const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const isMobile = window.innerWidth <= 768;

  // Initialize Lenis smooth scrolling
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: !isMobile, // Disable on mobile for native feel
    smoothTouch: false, // Always disable on touch for native scroll
  });

  // Integrate Lenis with ScrollTrigger using GSAP ticker (recommended method)
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  // ============================================
  // HERO SECTION - Subtle parallax
  // ============================================

  const heroImage = document.querySelector('.hero-bg-img');

  if (heroImage && isDesktop) {
    gsap.to(heroImage, {
      yPercent: 20,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-overlay-style',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  // Hero text fade-in on load
  const heroContent = document.querySelector('.hero-content-overlay');
  if (heroContent) {
    gsap.from(heroContent, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power2.out',
    });
  }

  // ============================================
  // STATISTICS SECTION - Counter animation
  // ============================================

  const statNumbers = document.querySelectorAll('.stat-number');

  statNumbers.forEach((stat) => {
    const text = stat.textContent || '';
    const targetValue = parseInt(text.replace(/[^0-9]/g, '')) || 0;
    const suffix = text.replace(/[0-9]/g, ''); // Extract %, etc.

    ScrollTrigger.create({
      trigger: stat,
      start: 'top 80%',
      onEnter: () => {
        // Create a temporary object to animate
        const counter = { value: 0 };
        gsap.to(counter, {
          value: targetValue,
          duration: 2,
          ease: 'power1.out',
          onUpdate: function() {
            stat.textContent = Math.round(counter.value) + suffix;
          },
        });
      },
      once: true,
    });
  });

  // Stats card 3D hover (desktop only)
  if (isDesktop) {
    const statItems = document.querySelectorAll('.stat-item');

    statItems.forEach((card) => {
      const element = card as HTMLElement;

      element.addEventListener('mouseenter', () => {
        gsap.to(element, {
          z: 20,
          scale: 1.05,
          duration: 0.3,
          ease: 'power2.out',
        });
      });

      element.addEventListener('mouseleave', () => {
        gsap.to(element, {
          z: 0,
          scale: 1,
          duration: 0.3,
          ease: 'power2.out',
        });
      });
    });
  }

  // Stats staggered entrance
  gsap.from('.stat-item', {
    scrollTrigger: {
      trigger: '.stats-grid',
      start: 'top 80%',
    },
    y: 60,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power2.out',
  });

  // ============================================
  // TIMELINE SECTION - Dramatic animations
  // ============================================

  const timelineSection = document.querySelector('.timeline-section');

  if (timelineSection) {
    // Slow down scroll speed in timeline section
    ScrollTrigger.create({
      trigger: timelineSection,
      start: 'top 50%',
      end: 'bottom 50%',
      onEnter: () => lenis.options.duration = 1.8,
      onLeave: () => lenis.options.duration = 1.2,
      onEnterBack: () => lenis.options.duration = 1.8,
      onLeaveBack: () => lenis.options.duration = 1.2,
    });
  }

  // Timeline cards dramatic entrance
  const processSteps = document.querySelectorAll('.process-step');

  processSteps.forEach((step, index) => {
    const element = step as HTMLElement;

    if (isMobile) {
      // Simple slide-in on mobile
      gsap.from(element, {
        scrollTrigger: {
          trigger: element,
          start: 'top 90%',
        },
        x: 100,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
      });
    } else {
      // Dramatic 3D entrance on desktop
      gsap.from(element, {
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
        },
        x: index % 2 === 0 ? -300 : 300,
        rotationY: index % 2 === 0 ? -12 : 12,
        scale: 0.75,
        filter: 'blur(10px)',
        opacity: 0,
        duration: 1,
        delay: index * 0.2,
        ease: 'power3.out',
        clearProps: 'filter', // Remove blur after animation
      });
    }
  });

  // Timeline cards 3D hover (desktop only)
  if (isDesktop) {
    processSteps.forEach((step) => {
      const element = step as HTMLElement;

      element.addEventListener('mouseenter', (e) => {
        gsap.to(element, {
          z: 30,
          duration: 0.4,
          ease: 'power2.out',
        });
      });

      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        gsap.to(element, {
          rotationX: rotateX,
          rotationY: rotateY,
          duration: 0.3,
          ease: 'power2.out',
        });
      });

      element.addEventListener('mouseleave', () => {
        gsap.to(element, {
          z: 0,
          rotationX: 0,
          rotationY: 0,
          duration: 0.4,
          ease: 'power2.out',
        });
      });
    });
  }

  // ============================================
  // CARD GRIDS - Benefits, Advantages
  // ============================================

  const cardGrids = ['.benefits-grid', '.advantage-grid'];

  cardGrids.forEach((gridSelector) => {
    const cards = document.querySelectorAll(`${gridSelector} > *`);

    cards.forEach((card, index) => {
      const element = card as HTMLElement;

      if (isMobile) {
        // Simple fade-up on mobile
        gsap.from(element, {
          scrollTrigger: {
            trigger: element,
            start: 'top 90%',
          },
          y: 40,
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out',
        });
      } else {
        // 3D rotation entrance on desktop
        const row = Math.floor(index / 3);
        const col = index % 3;
        const delay = (row + col) * 0.1;

        gsap.from(element, {
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
          },
          rotationX: 15,
          scale: 0.7,
          filter: 'blur(8px)',
          opacity: 0,
          duration: 0.8,
          delay: delay,
          ease: 'power3.out',
          clearProps: 'filter',
        });
      }
    });

    // Card hover effects (desktop only)
    if (isDesktop) {
      cards.forEach((card) => {
        const element = card as HTMLElement;

        element.addEventListener('mouseenter', () => {
          gsap.to(element, {
            z: 40,
            duration: 0.3,
            ease: 'power2.out',
          });
        });

        element.addEventListener('mousemove', (e) => {
          const rect = element.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          const rotateX = ((y - centerY) / centerY) * -3;
          const rotateY = ((x - centerX) / centerX) * 3;

          gsap.to(element, {
            rotationX: rotateX,
            rotationY: rotateY,
            duration: 0.3,
            ease: 'power2.out',
          });
        });

        element.addEventListener('mouseleave', () => {
          gsap.to(element, {
            z: 0,
            rotationX: 0,
            rotationY: 0,
            duration: 0.3,
            ease: 'power2.out',
          });
        });

        // Icon scale on card hover
        const icon = element.querySelector('.benefit-icon, .advantage-icon');
        if (icon) {
          element.addEventListener('mouseenter', () => {
            gsap.to(icon, {
              scale: 1.1,
              duration: 0.3,
              ease: 'back.out(1.7)',
            });
          });

          element.addEventListener('mouseleave', () => {
            gsap.to(icon, {
              scale: 1,
              duration: 0.3,
              ease: 'power2.out',
            });
          });
        }
      });
    }
  });

  // ============================================
  // RISK VISUALIZATION - Scale entrance
  // ============================================

  const riskViz = document.querySelector('.risk-visualization');

  if (riskViz) {
    gsap.from(riskViz, {
      scrollTrigger: {
        trigger: riskViz,
        start: 'top 80%',
      },
      scale: 0.85,
      opacity: 0,
      duration: 1,
      ease: 'power2.out',
    });
  }

  // ============================================
  // BUTTONS - 3D lift on hover (desktop)
  // ============================================

  if (isDesktop) {
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-large');

    buttons.forEach((btn) => {
      const element = btn as HTMLElement;

      element.addEventListener('mouseenter', () => {
        gsap.to(element, {
          z: 5,
          duration: 0.2,
          ease: 'power2.out',
        });
      });

      element.addEventListener('mouseleave', () => {
        gsap.to(element, {
          z: 0,
          duration: 0.2,
          ease: 'power2.out',
        });
      });
    });
  }

  // Refresh ScrollTrigger to ensure all triggers are calculated correctly
  ScrollTrigger.refresh();

  console.log('Dramatic scroll animations initialized', {
    isDesktop,
    isMobile,
    statNumbers: statNumbers.length,
    processSteps: document.querySelectorAll('.process-step').length,
    scrollTriggers: ScrollTrigger.getAll().length,
  });
}
