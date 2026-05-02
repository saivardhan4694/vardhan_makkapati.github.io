import { useEffect, useRef } from 'react';
import { Section } from './Section';

export function About({ aboutData }) {
  const terminalRef = useRef(null);

  useEffect(() => {
    if (!aboutData || !terminalRef.current) return;

    const terminal = terminalRef.current;
    const lines = terminal.querySelectorAll('.term-line');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          terminal.classList.add('typing');
          
          lines.forEach((line, index) => {
            setTimeout(() => {
              line.classList.add('revealed');
              if (line.classList.contains('typewriter-output')) {
                setTimeout(() => line.classList.add('expanding'), 100);
              }
            }, index * 350);
          });

          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(terminal);

    return () => observer.disconnect();
  }, [aboutData]);

  if (!aboutData) return null;

  return (
    <Section id="about" title={aboutData.sectionTitle} number={aboutData.sectionNumber} typewriter={true} customClass="about-section">
      <div className="section-content about-content">
        <div className="about-text">
          {aboutData.paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>
        <div className="about-terminal-container">
          <div id="about-terminal" className="terminal-window" ref={terminalRef}>
            <div className="terminal-header">
              <span className="terminal-dot"></span>
              <span className="terminal-dot"></span>
              <span className="terminal-dot"></span>
            </div>
            <div className="terminal-body" style={{ padding: '0.75rem 1rem' }}>
              {aboutData.terminal.map((line, idx) => (
                <div key={idx} style={{ marginBottom: '0.5rem' }}>
                  <p className="term-line type-in">
                    <span className="prompt-symbol">$</span> {line.command}
                  </p>
                  <p className="term-line typewriter-output">{line.output}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
