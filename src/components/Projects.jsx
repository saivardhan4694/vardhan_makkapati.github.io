import { Section } from './Section';

export function Projects({ projectsData }) {
  if (!projectsData) return null;

  return (
    <Section id="projects" title={projectsData.sectionTitle} number={projectsData.sectionNumber} typewriter={true}>
      <div className="section-content">
        <div className="projects-grid">
          {projectsData.items.map((proj, idx) => (
            <div key={idx} className="project-card" data-animate="true">
              <div className="project-card-header">
                <span className="project-icon">⟩_</span>
                <div className="project-links">
                  {proj.links.map((link, l_idx) => (
                    <a key={l_idx} href={link.url} className="project-link" target="_blank" rel="noopener noreferrer">
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
              <h3 className="project-title">{proj.title}</h3>
              <p className="project-desc">{proj.description}</p>
              <div className="project-tech">
                {proj.tech.map((t, i) => (
                  <span key={i} className="tech-tag">{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
