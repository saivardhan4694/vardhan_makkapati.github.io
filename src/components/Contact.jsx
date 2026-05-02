import { useEffect, useRef } from 'react';
import { Section } from './Section';

export function Contact({ contactData }) {
  const terminalRef = useRef(null);

  useEffect(() => {
    if (!contactData || !terminalRef.current) return;

    const terminal = terminalRef.current;
    const output = terminal.querySelector('.contact-output.type-in');
    
    if (!output) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => output.classList.add('expanding'), 400);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    observer.observe(terminal);

    return () => observer.disconnect();
  }, [contactData]);

  if (!contactData) return null;

  return (
    <Section id="contact" title={contactData.sectionTitle} number={contactData.sectionNumber} typewriter={true}>
      <div className="section-content contact-content">
        <p className="contact-desc">{contactData.desc}</p>
        <div id="contact-terminal" className="terminal-window contact-terminal" ref={terminalRef}>
          <div className="terminal-header">
            <span className="terminal-dot"></span>
            <span className="terminal-dot"></span>
            <span className="terminal-dot"></span>
          </div>
          <div className="terminal-body" style={{ padding: '1rem' }}>
            <p className="contact-prompt">
              <span className="prompt-symbol">$</span> {contactData.terminalCommand}
            </p>
            <p className="contact-output type-in">{contactData.terminalOutput}</p>
          </div>
        </div>
        <div className="contact-links">
          {contactData.links.map((link, idx) => (
            <a key={idx} href={link.url} id={link.id} target="_blank" rel="noreferrer" className="contact-link">
              <span className="contact-icon">→</span> {link.label}
            </a>
          ))}
        </div>
        <p className="contact-note">{contactData.note}</p>
      </div>
    </Section>
  );
}
