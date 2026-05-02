import { useState, useEffect } from 'react';

export function Navbar({ navData }) {
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!navData) return;

    const siteEl = document.getElementById('site') || window;

    const handleScroll = () => {
      const scrollY = siteEl.scrollTop !== undefined ? siteEl.scrollTop : window.scrollY;
      setScrolled(scrollY > 20);

      // Find active section
      const sections = navData.links.map(name => document.getElementById(name)).filter(Boolean);
      let current = '';
      
      for (const section of sections) {
        if (scrollY >= section.offsetTop - 100) {
          current = section.id;
        }
      }
      
      setActiveId(current);
    };

    siteEl.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Init

    return () => siteEl.removeEventListener('scroll', handleScroll);
  }, [navData]);

  if (!navData) return null;

  return (
    <>
      <nav id="navbar" className={scrolled ? 'scrolled' : ''}>
        <div className="nav-links desktop-only">
          {navData.links.map(name => (
            <a
              key={name}
              href={`#${name}`}
              className={`nav-link ${activeId === name ? 'active' : ''}`}
            >
              {name}
            </a>
          ))}
        </div>
        <div id="nav-toggle" className="mobile-only" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          ☰
        </div>
      </nav>
      {mobileMenuOpen && (
        <div className="mobile-nav open">
          {navData.links.map(name => (
            <a
              key={name}
              href={`#${name}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {name}
            </a>
          ))}
        </div>
      )}
    </>
  );
}
