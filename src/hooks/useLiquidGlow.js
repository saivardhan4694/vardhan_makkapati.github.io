import { useEffect, useRef } from 'react';

export function useLiquidGlow() {
  const containerRef = useRef(null);

  useEffect(() => {
    let mouseX = -200, mouseY = -200;
    const blobCount = 5;
    const blobs = [];

    for (let i = 0; i < blobCount; i++) {
      blobs.push({
        angle: (Math.PI * 2 / blobCount) * i,
        speed: 0.8 + Math.random() * 0.6,
        radius: 20 + Math.random() * 25,
        size: 40 + Math.random() * 30,
      });
    }

    const mouseMoveHandler = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    document.addEventListener('mousemove', mouseMoveHandler);

    let animationFrameId;

    const tick = (time) => {
      const t = time / 1000;
      const parts = [];

      parts.push(`radial-gradient(circle 50px at ${mouseX}px ${mouseY}px, black 0%, transparent 100%)`);

      for (const b of blobs) {
        const angle = b.angle + t * b.speed;
        const bx = mouseX + Math.cos(angle) * b.radius;
        const by = mouseY + Math.sin(angle) * b.radius;
        parts.push(`radial-gradient(circle ${b.size}px at ${bx}px ${by}px, black 0%, transparent 100%)`);
      }

      const composite = parts.join(', ');
      
      if (containerRef.current) {
        containerRef.current.style.setProperty('--blob-mask', composite);
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener('mousemove', mouseMoveHandler);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return containerRef;
}
