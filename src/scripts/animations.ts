import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Make GSAP available globally for debugging and manual access
(window as any).gsap = gsap;
(window as any).ScrollTrigger = ScrollTrigger;

gsap.registerPlugin(ScrollTrigger);

export function initAnimations() {
  console.log('GSAP initializing...');
  console.log('Document ready state:', document.readyState);
  console.log('Elements found:', {
    heroContent: document.querySelector('.hero-content-overlay'),
    statNumbers: document.querySelectorAll('.stat-number').length,
    processSteps: document.querySelectorAll('.process-step').length,
    scrollAnimate: document.querySelectorAll('.scroll-animate').length,
    scrollAnimateLeft: document.querySelectorAll('.scroll-animate-left').length,
    scrollAnimateRight: document.querySelectorAll('.scroll-animate-right').length,
    scrollAnimateScale: document.querySelectorAll('.scroll-animate-scale').length,
  });

  const isMobile = window.innerWidth <= 768;

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: !isMobile,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  // Hero parallax effect
  const heroImage = document.querySelector('.hero-bg-img');
  if (heroImage) {
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

  // Hero text fade-in
  const heroContent = document.querySelector('.hero-content-overlay');
  if (heroContent) {
    gsap.from(heroContent, { opacity: 0, y: 30, duration: 0.8, ease: 'power2.out' });
  }

  // Stats counter animation - ensure elements are visible
  const statItems = document.querySelectorAll('.stat-item');
  console.log('Found stat items:', statItems.length);

  // First ensure stat items are properly initialized
  gsap.set(statItems, { opacity: 1, y: 0 }); // Reset any previous animation state

  // Then animate them in
  gsap.from(statItems, {
    scrollTrigger: {
      trigger: '.stats-grid',
      start: 'top 80%',
      onEnter: () => console.log('Stats animation triggered'),
      onLeave: () => console.log('Stats animation left'),
      onEnterBack: () => console.log('Stats animation entered back'),
      onLeaveBack: () => console.log('Stats animation left back'),
    },
    opacity: 0,
    y: 40,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power2.out',
    onComplete: () => console.log('Stats animation completed'),
  });

  // Then animate the numbers
  const statNumbers = document.querySelectorAll('.stat-number');
  statNumbers.forEach((stat) => {
    const text = stat.textContent || '';
    const targetValue = parseInt(text.replace(/[^0-9]/g, '')) || 0;
    const suffix = text.replace(/[0-9]/g, '');

    ScrollTrigger.create({
      trigger: stat,
      start: 'top 80%',
      onEnter: () => {
        const counter = { value: 0 };
        gsap.to(counter, {
          value: targetValue,
          duration: 2,
          ease: 'power1.out',
          onUpdate: function () {
            stat.textContent = Math.round(counter.value) + suffix;
          },
        });
      },
      once: true,
    });
  });

  // Timeline entrance animation and line
  const processSteps = document.querySelectorAll('.process-step');
  console.log('Found process steps:', processSteps.length);

  // Animate timeline line - proper viewport synchronization
  const timelineLine = document.querySelector('.process-timeline-line');
  if (timelineLine) {
    // Create smooth viewport-centered animation that follows scroll perfectly
    gsap.fromTo(
      timelineLine,
      { height: 0 },
      {
        height: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: '.process-timeline',
          start: 'top bottom', // Start when timeline enters viewport
          end: 'bottom 50%', // End when timeline bottom reaches 50% of viewport
          scrub: 0, // No smoothing - direct 1:1 relationship with scroll
          onUpdate: (self) => console.log(`Timeline progress: ${self.progress.toFixed(2)}`),
        },
      }
    );
  }

  processSteps.forEach((step, index) => {
    const element = step;
    // Set initial state first, then animate
    if (isMobile) {
      gsap.set(element, { x: 100, opacity: 0 });
      gsap.to(element, {
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          onEnter: () => console.log(`Process step ${index} animation triggered`),
        },
        x: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
      });
    } else {
      // Set initial state - reduce blur and adjust timing
      gsap.set(element, {
        x: index % 2 === 0 ? -200 : 200,
        rotationY: index % 2 === 0 ? -8 : 8,
        scale: 0.85,
        opacity: 0,
      });

      // Animate to final state - faster and earlier unblur
      gsap.to(element, {
        scrollTrigger: {
          trigger: element,
          start: index >= processSteps.length - 2 ? 'top 90%' : 'top 80%',
          onEnter: () => console.log(`Process step ${index} animation triggered`),
        },
        x: 0,
        rotationY: 0,
        scale: 1,
        opacity: 1,
        duration: 0.6, // Faster animation
        delay: index * 0.05, // Reduced stagger delay
        ease: 'power2.out',
        onStart: () => {
          // Remove blur earlier in the animation
          gsap.to(element, {
            filter: 'blur(0px)',
            duration: 0.3,
            ease: 'power1.out',
          });
        },
      });
    }
  });

  // Card grids entrance
  const cardGrids = ['.benefits-grid', '.advantage-grid'];
  cardGrids.forEach((gridSelector) => {
    const cards = document.querySelectorAll(`${gridSelector} > *`);
    cards.forEach((card, index) => {
      const element = card;
      if (isMobile) {
        gsap.from(element, {
          scrollTrigger: { trigger: element, start: 'top 90%' },
          y: 40,
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out',
        });
      } else {
        const row = Math.floor(index / 3);
        const col = index % 3;
        const delay = (row + col) * 0.1;
        gsap.from(element, {
          scrollTrigger: { trigger: element, start: 'top 85%' },
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
  });

  // Missing animation classes - add debugging
  console.log('Setting up scroll-animate animations...');

  const scrollAnimateElements = document.querySelectorAll('.scroll-animate');
  console.log('Found .scroll-animate elements:', scrollAnimateElements.length);
  scrollAnimateElements.forEach((el, i) => {
    console.log(`Scroll-animate element ${i}:`, el);
    // Set initial state first
    gsap.set(el, { opacity: 0, y: 40 });
    // Then create the animation
    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        onEnter: () => console.log(`Scroll-animate element ${i} triggered`),
        onLeave: () => console.log(`Scroll-animate element ${i} left`),
      },
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
    });
  });

  const scrollLeftElements = document.querySelectorAll('.scroll-animate-left');
  console.log('Found .scroll-animate-left elements:', scrollLeftElements.length);
  scrollLeftElements.forEach((el, i) => {
    console.log(`Scroll-left element ${i}:`, el);
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        onEnter: () => console.log(`Scroll-left element ${i} triggered`),
        onLeave: () => console.log(`Scroll-left element ${i} left`),
      },
      opacity: 0,
      x: -40,
      duration: 0.8,
      ease: 'power2.out',
    });
  });

  const scrollRightElements = document.querySelectorAll('.scroll-animate-right');
  console.log('Found .scroll-animate-right elements:', scrollRightElements.length);
  scrollRightElements.forEach((el, i) => {
    console.log(`Scroll-right element ${i}:`, el);
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        onEnter: () => console.log(`Scroll-right element ${i} triggered`),
        onLeave: () => console.log(`Scroll-right element ${i} left`),
      },
      opacity: 0,
      x: 40,
      duration: 0.8,
      ease: 'power2.out',
    });
  });

  const scrollScaleElements = document.querySelectorAll('.scroll-animate-scale');
  console.log('Found .scroll-animate-scale elements:', scrollScaleElements.length);
  scrollScaleElements.forEach((el, i) => {
    console.log(`Scroll-scale element ${i}:`, el);
    // Set initial state first
    gsap.set(el, { opacity: 0, scale: 0.9 });
    // Then create the animation
    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        onEnter: () => console.log(`Scroll-scale element ${i} triggered`),
        onLeave: () => console.log(`Scroll-scale element ${i} left`),
      },
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: 'power2.out',
    });
  });

  // Refresh ScrollTrigger
  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 100);

  console.log('Animations initialized');
}
