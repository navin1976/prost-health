: import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initAnimations() {
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

  gsap.from('.scroll-animate', { scrollTrigger: { trigger: '.scroll-animate', start: 'top 85%' }, y: 40, opacity: 0, duration: 0.8 });
  gsap.from('.scroll-animate-left', { scrollTrigger: { trigger: '.scroll-animate-left', start: 'top 85%' }, x: -80, opacity: 0, duration: 0.8 });
  gsap.from('.scroll-animate-right', { scrollTrigger: { trigger: '.scroll-animate-right', start: 'top 85%' }, x: 80, opacity: 0, duration: 0.8 });
  gsap.from('.scroll-animate-scale', { scrollTrigger: { trigger: '.scroll-animate-scale', start: 'top 85%' }, scale: 0.9, opacity: 0, duration: 0.8 });

  setTimeout(() => ScrollTrigger.refresh(), 100);
}
