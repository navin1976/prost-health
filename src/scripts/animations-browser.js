// Browser-compatible animations module
// This is a compiled version that works in the browser

// Using node_modules imports that Vite can resolve
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Make GSAP available globally for debugging
window.gsap = gsap;
window.ScrollTrigger = ScrollTrigger;

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

  // Initialize Lenis smooth scrolling
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

  // Hero text fade-in with reversible animation
  const heroContent = document.querySelector('.hero-content-overlay');
  if (heroContent) {
    gsap.from(heroContent, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: heroContent,
        start: 'top 95%',
        end: 'bottom 5%',
        toggleActions: 'play none none reverse',
      },
    });
  }

  // Stats items animation
  const statItems = document.querySelectorAll('.stat-item');
  console.log('Found stat items:', statItems.length);

  gsap.set(statItems, { opacity: 1, y: 0 });

  gsap.from(statItems, {
    scrollTrigger: {
      trigger: '.stats-grid',
      start: 'top 80%',
      end: 'bottom 5%',
      toggleActions: 'play reverse play reverse',
    },
    opacity: 0,
    y: 40,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power2.out',
  });

  // Animate the numbers
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

  // Timeline entrance animation
  const processSteps = document.querySelectorAll('.process-step');
  console.log('Found process steps:', processSteps.length);

  const timelineLine = document.querySelector('.process-timeline-line');
  if (timelineLine) {
    gsap.fromTo(
      timelineLine,
      { height: 0 },
      {
        height: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: '.process-timeline',
          start: 'top bottom',
          end: 'bottom 50%',
          scrub: 0,
        },
      }
    );
  }

  processSteps.forEach((step, index) => {
    const element = step;
    if (isMobile) {
      gsap.set(element, { x: 100, opacity: 0 });
      gsap.to(element, {
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          end: 'bottom 5%',
          toggleActions: 'play reverse play reverse',
        },
        x: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
      });
    } else {
      gsap.set(element, {
        x: index % 2 === 0 ? -200 : 200,
        rotationY: index % 2 === 0 ? -8 : 8,
        scale: 0.85,
        opacity: 0,
      });

      gsap.to(element, {
        scrollTrigger: {
          trigger: element,
          start: index >= processSteps.length - 2 ? 'top 90%' : 'top 80%',
          end: 'bottom 5%',
          toggleActions: 'play reverse play reverse',
        },
        x: 0,
        rotationY: 0,
        scale: 1,
        opacity: 1,
        duration: 0.6,
        delay: index * 0.05,
        ease: 'power2.out',
        onStart: () => {
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
          scrollTrigger: {
            trigger: element,
            start: 'top 90%',
            end: 'bottom 5%',
            toggleActions: 'play reverse play reverse',
          },
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
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
            end: 'bottom 5%',
            toggleActions: 'play reverse play reverse',
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
  });

  // Animation classes
  const scrollAnimateElements = document.querySelectorAll('.scroll-animate');
  scrollAnimateElements.forEach((el) => {
    gsap.set(el, { opacity: 0, y: 40 });
    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        end: 'bottom 5%',
        toggleActions: 'play reverse play reverse',
      },
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
    });
  });

  const scrollLeftElements = document.querySelectorAll('.scroll-animate-left');
  scrollLeftElements.forEach((el) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        end: 'bottom 5%',
        toggleActions: 'play reverse play reverse',
      },
      opacity: 0,
      x: -40,
      duration: 0.8,
      ease: 'power2.out',
    });
  });

  const scrollRightElements = document.querySelectorAll('.scroll-animate-right');
  scrollRightElements.forEach((el) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        end: 'bottom 5%',
        toggleActions: 'play reverse play reverse',
      },
      opacity: 0,
      x: 40,
      duration: 0.8,
      ease: 'power2.out',
    });
  });

  const scrollScaleElements = document.querySelectorAll('.scroll-animate-scale');
  scrollScaleElements.forEach((el) => {
    gsap.set(el, { opacity: 0, scale: 0.9 });
    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        end: 'bottom 5%',
        toggleActions: 'play reverse play reverse',
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

  console.log('Animations initialized successfully');
}
