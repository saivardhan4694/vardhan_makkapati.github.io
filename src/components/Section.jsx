import { useEffect, useRef } from 'react';

function SectionTitle({ title, number, typewriter }) {
  const h2Ref = useRef(null);

  useEffect(() => {
    if (!typewriter || !h2Ref.current) return;

    const el = h2Ref.current;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          typeSectionTitle(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(el);
    
    return () => observer.disconnect();
  }, [title, typewriter]);

  function typeSectionTitle(h2) {
    const fullText = h2.dataset.fullTitle;
    const textEl = h2.querySelector(".title-text");
    if (!textEl || !fullText) return;

    h2.classList.add("typing");
    let i = 0;

    function tick() {
      if (i <= fullText.length) {
        textEl.textContent = fullText.substring(0, i);
        i++;
        setTimeout(tick, 55 + Math.random() * 40);
      } else {
        h2.classList.remove("typing");
        h2.classList.add("typed");
      }
    }

    tick();
  }

  if (typewriter) {
    return (
      <h2 className="section-title" data-typewriter="true" data-full-title={title} ref={h2Ref}>
        <span className="title-text"></span><span className="title-cursor cursor-solid">█</span>
      </h2>
    );
  }

  return (
    <h2 className="section-title">{title}</h2>
  );
}

export function Section({ id, number, title, typewriter, children, customClass = '' }) {
  return (
    <section id={id} className={`section ${customClass}`}>
      {title && <SectionTitle number={number} title={title} typewriter={typewriter} />}
      {children}
    </section>
  );
}
