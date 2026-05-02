import { Section } from './Section';

export function Skills({ skillsData }) {
  if (!skillsData) return null;

  return (
    <Section id="skills" title={skillsData.sectionTitle} number={skillsData.sectionNumber} typewriter={true}>
      <div className="section-content">
        <div className="skills-terminal" data-animate="true">
          <div className="terminal-window">
            <div className="terminal-header">
              <span className="terminal-dot"></span>
              <span className="terminal-dot"></span>
              <span className="terminal-dot"></span>
              <span className="terminal-title">skills.json</span>
            </div>
            <div className="terminal-body skills-body">
              {skillsData.groups.map((g, idx) => (
                <div key={idx} className="skill-group" data-animate="true">
                  <p className="skill-category">
                    <span className="prompt-symbol">$</span> {g.command}
                  </p>
                  <p className="skill-items">{g.items}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
