import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Master GSAP animation hook.
 * All ScrollTriggers must use scroller: '#site' because #site is our
 * custom overflow-y scroll container, not the window.
 */
export function useGSAPAnimations(ready = true) {
  useEffect(() => {
    if (!ready) return;

    const siteEl = document.getElementById('site');
    if (!siteEl) return;

    // Tell ScrollTrigger to use #site as the scroll proxy
    ScrollTrigger.defaults({ scroller: siteEl });

    const ctx = gsap.context(() => {

      // ─────────────────────────────────────────────────────────────────
      // 1. SCROLL PROGRESS BAR
      // ─────────────────────────────────────────────────────────────────
      const progressBar = document.getElementById('scroll-progress');
      if (progressBar) {
        gsap.to(progressBar, {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: siteEl,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.3,
          },
        });
      }

      // ─────────────────────────────────────────────────────────────────
      // 2. HERO PARALLAX — left text scrolls away faster than terminal
      // ─────────────────────────────────────────────────────────────────
      const heroLeft = document.querySelector('.hero-left');
      const heroRight = document.querySelector('.hero-right');
      const heroSection = document.getElementById('hero');

      if (heroLeft && heroRight && heroSection) {
        // Left side scrolls up and fades slightly faster
        gsap.to(heroLeft, {
          y: -60,
          opacity: 0.4,
          ease: 'none',
          scrollTrigger: {
            trigger: heroSection,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        });

        // Right terminal window scrolls at a slower rate — creates depth
        gsap.to(heroRight, {
          y: -30,
          opacity: 0.6,
          ease: 'none',
          scrollTrigger: {
            trigger: heroSection,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
      }

      // ─────────────────────────────────────────────────────────────────
      // 3. SECTION TITLE border-bottom LINE DRAW
      // ─────────────────────────────────────────────────────────────────
      document.querySelectorAll('.section-title').forEach((title) => {
        gsap.fromTo(
          title,
          { '--line-scale': 0 },
          {
            '--line-scale': 1,
            ease: 'power2.out',
            duration: 0.7,
            scrollTrigger: {
              trigger: title,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      });

      // ─────────────────────────────────────────────────────────────────
      // 4. EXPERIENCE CARDS — staggered blur + slide entrance
      // ─────────────────────────────────────────────────────────────────
      const expItems = document.querySelectorAll('.exp-item');
      if (expItems.length) {
        ScrollTrigger.batch(expItems, {
          start: 'top 88%',
          onEnter: (batch) =>
            gsap.fromTo(
              batch,
              { opacity: 0, y: 28, filter: 'blur(6px)' },
              {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                duration: 0.7,
                ease: 'power2.out',
                stagger: 0.15,
                onComplete() {
                  batch.forEach((el) => el.classList.add('gsap-done'));
                },
              }
            ),
          once: true,
        });
      }

      // ─────────────────────────────────────────────────────────────────
      // 5. PROJECT CARDS — staggered scale + blur pop
      // ─────────────────────────────────────────────────────────────────
      const projectCards = document.querySelectorAll('.project-card');
      if (projectCards.length) {
        ScrollTrigger.batch(projectCards, {
          start: 'top 90%',
          onEnter: (batch) =>
            gsap.fromTo(
              batch,
              { opacity: 0, scale: 0.94, y: 20, filter: 'blur(4px)' },
              {
                opacity: 1,
                scale: 1,
                y: 0,
                filter: 'blur(0px)',
                duration: 0.6,
                ease: 'power2.out',
                stagger: { each: 0.12 },
                onComplete() {
                  batch.forEach((el) => el.classList.add('gsap-done'));
                },
              }
            ),
          once: true,
        });
      }

      // ─────────────────────────────────────────────────────────────────
      // 6. SKILLS TERMINAL — "terminal boot dump" entrance
      // ─────────────────────────────────────────────────────────────────
      const skillGroups = document.querySelectorAll('.skill-group');
      if (skillGroups.length) {
        gsap.fromTo(
          skillGroups,
          { opacity: 0, x: -10, filter: 'blur(3px)' },
          {
            opacity: 1,
            x: 0,
            filter: 'blur(0px)',
            duration: 0.45,
            ease: 'power1.out',
            stagger: 0.08,
            scrollTrigger: {
              trigger: document.querySelector('.skills-terminal'),
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // ─────────────────────────────────────────────────────────────────
      // 7. CONTACT SECTION — gentle elastic float + staggered links
      // ─────────────────────────────────────────────────────────────────
      const contactContent = document.querySelector('.contact-content');
      if (contactContent) {
        gsap.fromTo(
          contactContent,
          { opacity: 0, y: 40, filter: 'blur(4px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.9,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: contactContent,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );

        const contactLinks = document.querySelectorAll('.contact-link');
        if (contactLinks.length) {
          gsap.fromTo(
            contactLinks,
            { opacity: 0, x: -14 },
            {
              opacity: 1,
              x: 0,
              duration: 0.5,
              ease: 'power2.out',
              stagger: 0.1,
              delay: 0.3,
              scrollTrigger: {
                trigger: contactContent,
                start: 'top 85%',
                toggleActions: 'play none none none',
              },
            }
          );
        }
      }

    }); // end gsap.context

    // Refresh ScrollTrigger after a brief delay to ensure DOM is settled
    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 100);

    return () => {
      ctx.revert();
      clearTimeout(refreshTimer);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [ready]);
}
