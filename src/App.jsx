import { useState, useEffect } from 'react';
import { AmbientBackground } from './components/AmbientBackground';
import { BootLoader } from './components/BootLoader';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Experience } from './components/Experience';
import { Projects } from './components/Projects';
import { Skills } from './components/Skills';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Chatbot } from './components/Chatbot';
import { useScrollReveal } from './hooks/useScrollReveal';

function Site({ data, bootDone }) {
  useScrollReveal(bootDone);

  return (
    <>
      <Navbar navData={data.nav} />
      <Hero heroData={data.hero} />
      <About aboutData={data.about} />
      <Experience experienceData={data.experience} />
      <Projects projectsData={data.projects} />
      <Skills skillsData={data.skills} />
      <Contact contactData={data.contact} />
      <Footer footerData={data.footer} />
    </>
  );
}

function App() {
  const [data, setData] = useState(null);
  const [bootDone, setBootDone] = useState(false);

  useEffect(() => {
    fetch('/data.json')
      .then(res => res.json())
      .then(jsonData => {
        document.title = jsonData.meta.title;
        document.getElementById('meta-description')?.setAttribute('content', jsonData.meta.description);
        document.getElementById('meta-keywords')?.setAttribute('content', jsonData.meta.keywords);
        document.getElementById('meta-author')?.setAttribute('content', jsonData.meta.author);
        setData(jsonData);
      })
      .catch(err => console.error("Failed to load data:", err));
  }, []);

  return (
    <>
      <div id="scanlines"></div>
      <AmbientBackground />
      {!bootDone && data && (
        <BootLoader bootData={data.boot} onDone={() => setBootDone(true)} />
      )}
      
      {data && (
        <div id="site" className={bootDone ? 'site-visible' : 'site-hidden'}>
          <Chatbot />
          <Site data={data} bootDone={bootDone} />
        </div>
      )}
    </>
  );
}

export default App;
