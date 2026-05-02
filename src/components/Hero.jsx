import { SkillsTypewriter } from './SkillsTypewriter';

export function Hero({ heroData }) {
  if (!heroData) return null;

  return (
    <section id="hero">
      <div className="hero-left">
        <p className="hero-prefix">{heroData.prefix}</p>
        <h1 className="hero-name">
          <span className="name-first">{heroData.nameFirst}</span>
          <span className="name-last">{heroData.nameLast}</span>
        </h1>
        <p className="hero-role">{heroData.role}</p>
        <p className="hero-statement">{heroData.statement}</p>
        <div className="hero-cta">
          {heroData.cta.map((b, i) => (
            <a key={i} href={b.href} className={`btn-${b.style}`}>
              {b.label}
            </a>
          ))}
        </div>
      </div>
      <div className="hero-right">
        <div className="terminal-window">
          <div className="terminal-header">
            <span className="terminal-dot"></span>
            <span className="terminal-dot"></span>
            <span className="terminal-dot"></span>
            <span className="terminal-title">{heroData.terminalTitle}</span>
          </div>
          <div className="terminal-body">
            <p className="terminal-prompt">{heroData.terminalPrompt}</p>
            <SkillsTypewriter skills={heroData.skills} />
          </div>
        </div>
      </div>
    </section>
  );
}
