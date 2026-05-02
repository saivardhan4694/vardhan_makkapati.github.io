import { Section } from './Section';

export function Experience({ experienceData }) {
  if (!experienceData) return null;

  return (
    <Section id="experience" title={experienceData.sectionTitle} number={experienceData.sectionNumber} typewriter={true}>
      <div className="section-content">
        <div className="exp-timeline">
          {experienceData.items.map((job, idx) => (
            <div key={idx} className="exp-item" data-animate="true">
              <div className="exp-header">
                <span className="exp-role">{job.role}</span>
                <span className="exp-date">{job.date}</span>
              </div>
              <p className="exp-company">{job.company}</p>
              <ul className="exp-list">
                {job.points.map((p, i) => (
                  <li key={i}><span className="bullet">▹</span> {p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
