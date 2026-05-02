import { useEffect, useRef } from 'react';

export function SkillsTypewriter({ skills }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!skills || skills.length === 0 || !containerRef.current) return;

    let twIndex = 0;
    let twChar = 0;
    let twLine = null;
    let currentTimer = null;

    const el = containerRef.current;
    el.innerHTML = '';

    const esc = (str) => {
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    };

    function typeNext() {
      if (!el || twIndex >= skills.length) return;

      const current = skills[twIndex];

      if (!twLine) {
        twLine = document.createElement("p");
        twLine.className = "skill-line";
        el.appendChild(twLine);
      }

      twLine.innerHTML = esc(current.substring(0, twChar + 1)) + '<span class="cursor-blink" style="font-weight: 400; margin-left: 2px;">█</span>';
      twChar++;

      if (twChar === current.length) {
        currentTimer = setTimeout(() => {
          if (twIndex < skills.length - 1) {
            twLine.innerHTML = esc(current);
            twLine = null;
            twIndex++;
            twChar = 0;
            currentTimer = setTimeout(typeNext, 100);
          }
          // Do nothing on the last item to keep the cursor blinking
        }, 800);
        return;
      }

      currentTimer = setTimeout(typeNext, 45 + Math.random() * 35);
    }

    typeNext();

    return () => clearTimeout(currentTimer);
  }, [skills]);

  return <div id="typewriter-skills" ref={containerRef}></div>;
}
