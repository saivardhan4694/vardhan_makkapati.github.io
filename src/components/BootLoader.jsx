import { useEffect, useState } from 'react';

export function BootLoader({ bootData, onDone }) {
  const [lines, setLines] = useState([]);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!bootData) return;

    let timers = [];

    bootData.lines.forEach((line, i) => {
      const delay = i * bootData.lineDelayMs;
      const timer = setTimeout(() => {
        setLines(prev => [...prev, line]);
      }, delay);
      timers.push(timer);
    });

    const totalBootTime = bootData.lines.length * bootData.lineDelayMs + bootData.transitionDelayMs;
    const finalTimer = setTimeout(() => {
      setIsDone(true);
      onDone();
    }, totalBootTime);
    timers.push(finalTimer);

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [bootData, onDone]);

  if (!bootData) return null;

  return (
    <div id="boot-loader" className={isDone ? "boot-done" : ""}>
      <div id="boot-log">
        {lines.map((line, i) => (
          <div key={i} className={`log-line ${line.ok ? 'log-ok' : ''}`}>
            {line.text}
          </div>
        ))}
      </div>
      <div id="boot-cursor" className="cursor-blink">█</div>
    </div>
  );
}
