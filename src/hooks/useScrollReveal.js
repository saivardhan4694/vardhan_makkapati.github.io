import { useEffect } from 'react';

export function useScrollReveal(ready = true) {
  useEffect(() => {
    if (!ready) return;

    const siteEl = document.getElementById('site');

    // Small delay to ensure DOM layout is completely flushed and visible
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("visible");
              observer.unobserve(e.target);
            }
          });
        },
        {
          root: siteEl,
          threshold: 0.15,
          rootMargin: "0px 0px -40px 0px"
        }
      );

      document.querySelectorAll("[data-animate]").forEach((el) => observer.observe(el));

      // Dispatch scroll on #site so navbar and other listeners update
      if (siteEl) siteEl.dispatchEvent(new Event('scroll'));

      // Setup cleanup
      window._scrollObserver = observer;
    }, 150);

    return () => {
      clearTimeout(timer);
      if (window._scrollObserver) window._scrollObserver.disconnect();
    };
  }, [ready]);
}
