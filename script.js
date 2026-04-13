/* ============================================
   MAIN — fetch data.json and build everything
   ============================================ */
(async function () {
  const res = await fetch("data.json");
  const data = await res.json();

  // --- META ---
  document.title = data.meta.title;
  document.getElementById("meta-description").setAttribute("content", data.meta.description);
  document.getElementById("meta-keywords").setAttribute("content", data.meta.keywords);
  document.getElementById("meta-author").setAttribute("content", data.meta.author);

  // --- BOOT SEQUENCE ---
  runBoot(data.boot, () => {
    buildSite(data);
  });
})();

/* ============================================
   BOOT SEQUENCE
   ============================================ */
function runBoot(boot, onDone) {
  const bootLog = document.getElementById("boot-log");
  const bootLoader = document.getElementById("boot-loader");
  const site = document.getElementById("site");

  boot.lines.forEach((line, i) => {
    const delay = i * boot.lineDelayMs;
    setTimeout(() => {
      const el = document.createElement("div");
      el.classList.add("log-line");
      if (line.ok) el.classList.add("log-ok");
      el.textContent = line.text;
      bootLog.appendChild(el);
      bootLog.scrollTop = bootLog.scrollHeight;
    }, delay);
  });

  const totalBootTime = boot.lines.length * boot.lineDelayMs + boot.transitionDelayMs;
  setTimeout(() => {
    bootLoader.classList.add("boot-done");
    site.classList.add("site-visible");
    onDone();
  }, totalBootTime);
}

/* ============================================
   BUILD SITE — render all sections from data
   ============================================ */
function buildSite(data) {
  const site = document.getElementById("site");
  site.innerHTML = "";

  site.appendChild(buildNavbar(data.nav));
  site.appendChild(buildHero(data.hero));
  site.appendChild(buildAbout(data.about));
  site.appendChild(buildExperience(data.experience));
  site.appendChild(buildProjects(data.projects));
  site.appendChild(buildSkills(data.skills));
  site.appendChild(buildContact(data.contact));
  site.appendChild(buildFooter(data.footer));

  initNavbarScroll();
  initMobileNav(data.nav.links);
  initScrollAnimations();
  initSmoothScroll();
  startTypewriter(data.hero.skills);
  initSectionTitleTypewriters();
  initAboutTerminalTypewriter();
  initContactTypewriter();
}

/* ============================================
   NAVBAR
   ============================================ */
function buildNavbar(nav) {
  const navbar = document.createElement("nav");
  navbar.id = "navbar";

  const logo = document.createElement("a");
  logo.href = "#hero";
  logo.className = "nav-logo";
  logo.textContent = nav.logo;
  navbar.appendChild(logo);

  const links = document.createElement("div");
  links.className = "nav-links";
  nav.links.forEach((link) => {
    const a = document.createElement("a");
    a.href = `#${link}`;
    a.className = "nav-link";
    a.textContent = link;
    links.appendChild(a);
  });
  navbar.appendChild(links);

  const toggle = document.createElement("button");
  toggle.id = "nav-toggle";
  toggle.setAttribute("aria-label", "Toggle navigation");
  for (let i = 0; i < 3; i++) toggle.appendChild(document.createElement("span"));
  navbar.appendChild(toggle);

  return navbar;
}

/* ============================================
   HERO
   ============================================ */
function buildHero(hero) {
  const section = document.createElement("section");
  section.id = "hero";

  // Left
  const left = document.createElement("div");
  left.className = "hero-left";

  left.innerHTML = `
    <p class="hero-prefix">${esc(hero.prefix)}</p>
    <h1 class="hero-name">
      <span class="name-first">${esc(hero.nameFirst)}</span>
      <span class="name-last">${esc(hero.nameLast)}</span>
    </h1>
    <p class="hero-role">${esc(hero.role)}</p>
    <p class="hero-statement">${esc(hero.statement)}</p>
    <div class="hero-cta">
      ${hero.cta.map((b) => `<a href="${esc(b.href)}" class="btn-${esc(b.style)}">${esc(b.label)}</a>`).join("")}
    </div>
  `;

  // Right — terminal
  const right = document.createElement("div");
  right.className = "hero-right";
  right.innerHTML = `
    <div class="terminal-window">
      <div class="terminal-header">
        <span class="terminal-dot"></span>
        <span class="terminal-dot"></span>
        <span class="terminal-dot"></span>
        <span class="terminal-title">${esc(hero.terminalTitle)}</span>
      </div>
      <div class="terminal-body">
        <p class="terminal-prompt">${esc(hero.terminalPrompt)}</p>
        <div id="typewriter-skills"></div>
        <span class="cursor-blink">█</span>
      </div>
    </div>
  `;

  section.appendChild(left);
  section.appendChild(right);
  return section;
}

/* ============================================
   ABOUT
   ============================================ */
function buildAbout(about) {
  const section = createSection("about", about.sectionNumber, about.sectionTitle, true);
  const content = document.createElement("div");
  content.className = "section-content about-content";

  const textDiv = document.createElement("div");
  textDiv.className = "about-text";

  about.paragraphs.forEach((p) => {
    const el = document.createElement("p");
    el.textContent = p;
    textDiv.appendChild(el);
  });

  if (about.terminal && about.terminal.length) {
    const term = document.createElement("div");
    term.className = "about-terminal";
    term.id = "about-terminal";
    about.terminal.forEach((t) => {
      const cmd = document.createElement("p");
      cmd.className = "term-line";
      cmd.innerHTML = `<span class="prompt-symbol">$</span> ${esc(t.command)}`;
      const out = document.createElement("p");
      out.className = "about-output typewriter-output term-line";
      out.textContent = t.output;
      term.appendChild(cmd);
      term.appendChild(out);
    });
    textDiv.appendChild(term);
  }

  content.appendChild(textDiv);
  section.appendChild(content);
  return section;
}

/* ============================================
   EXPERIENCE
   ============================================ */
function buildExperience(exp) {
  const section = createSection("experience", exp.sectionNumber, exp.sectionTitle, true);
  const content = document.createElement("div");
  content.className = "section-content";

  const timeline = document.createElement("div");
  timeline.className = "exp-timeline";

  exp.items.forEach((item) => {
    const el = document.createElement("div");
    el.className = "exp-item";
    el.setAttribute("data-animate", "");

    el.innerHTML = `
      <div class="exp-header">
        <span class="exp-role">${esc(item.role)}</span>
        <span class="exp-date">${esc(item.date)}</span>
      </div>
      <p class="exp-company">${esc(item.company)}</p>
      <ul class="exp-list">
        ${item.points.map((p) => `<li><span class="bullet">▹</span> ${esc(p)}</li>`).join("")}
      </ul>
    `;
    timeline.appendChild(el);
  });

  content.appendChild(timeline);
  section.appendChild(content);
  return section;
}

/* ============================================
   PROJECTS
   ============================================ */
function buildProjects(proj) {
  const section = createSection("projects", proj.sectionNumber, proj.sectionTitle);
  const content = document.createElement("div");
  content.className = "section-content";

  const grid = document.createElement("div");
  grid.className = "projects-grid";

  proj.items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "project-card";
    card.setAttribute("data-animate", "");

    card.innerHTML = `
      <div class="project-card-header">
        <span class="project-icon">⟩_</span>
        <div class="project-links">
          ${item.links.map((l) => `<a href="${esc(l.url)}" class="project-link" target="_blank" rel="noopener">${esc(l.label)}</a>`).join("")}
        </div>
      </div>
      <h3 class="project-title">${esc(item.title)}</h3>
      <p class="project-desc">${esc(item.description)}</p>
      <div class="project-tech">
        ${item.tech.map((t) => `<span>${esc(t)}</span>`).join("")}
      </div>
    `;
    grid.appendChild(card);
  });

  content.appendChild(grid);
  section.appendChild(content);
  return section;
}

/* ============================================
   SKILLS
   ============================================ */
function buildSkills(skills) {
  const section = createSection("skills", skills.sectionNumber, skills.sectionTitle);
  const content = document.createElement("div");
  content.className = "section-content";

  const wrapper = document.createElement("div");
  wrapper.className = "skills-terminal";

  wrapper.innerHTML = `
    <div class="terminal-window">
      <div class="terminal-header">
        <span class="terminal-dot"></span>
        <span class="terminal-dot"></span>
        <span class="terminal-dot"></span>
        <span class="terminal-title">${esc(skills.terminalTitle)}</span>
      </div>
      <div class="terminal-body skills-body">
        ${skills.groups
          .map(
            (g) => `
          <div class="skill-group" data-animate>
            <p class="skill-category"><span class="prompt-symbol">$</span> ${esc(g.command)}</p>
            <p class="skill-items">${esc(g.items)}</p>
          </div>`
          )
          .join("")}
      </div>
    </div>
  `;

  content.appendChild(wrapper);
  section.appendChild(content);
  return section;
}

/* ============================================
   CONTACT
   ============================================ */
function buildContact(contact) {
  const section = createSection("contact", contact.sectionNumber, contact.sectionTitle, true);
  const content = document.createElement("div");
  content.className = "section-content contact-content";

  content.innerHTML = `
    <div class="contact-terminal" id="contact-terminal">
      <p class="contact-prompt"><span class="prompt-symbol">$</span> ${esc(contact.terminalCommand)}</p>
      <p class="contact-output type-in">${esc(contact.terminalOutput)}</p>
    </div>
    <div class="contact-links">
      ${contact.links
        .map(
          (l) => `
        <a href="${esc(l.url)}" class="contact-link" id="${esc(l.id)}" target="_blank" rel="noopener">
          <span class="contact-icon">→</span> ${esc(l.label)}
        </a>`
        )
        .join("")}
    </div>
    <p class="contact-note">${esc(contact.note)}</p>
  `;

  section.appendChild(content);
  return section;
}

/* ============================================
   FOOTER
   ============================================ */
function buildFooter(footer) {
  const el = document.createElement("footer");
  el.id = "footer";
  el.innerHTML = `
    <p>${footer.line1}</p>
    <p class="footer-copy">${esc(footer.line2)}</p>
  `;
  return el;
}

/* ============================================
   HELPERS
   ============================================ */
function createSection(id, number, title, typewriterTitle = false) {
  const section = document.createElement("section");
  section.id = id;
  section.className = "section";

  const h2 = document.createElement("h2");
  h2.className = "section-title";

  if (typewriterTitle) {
    h2.innerHTML = `<span class="section-number">${esc(number)}.</span> <span class="title-text"></span><span class="title-cursor">█</span>`;
    h2.dataset.fullTitle = title;
    h2.dataset.typewriter = "true";
  } else {
    h2.innerHTML = `<span class="section-number">${esc(number)}.</span> ${esc(title)}`;
  }

  section.appendChild(h2);
  return section;
}

function esc(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/* ============================================
   TYPEWRITER EFFECT
   ============================================ */
let twSkills = [];
let twIndex = 0;
let twChar = 0;
let twDeleting = false;
let twEl = null;
let twLine = null;

function startTypewriter(skills) {
  twSkills = skills;
  twEl = document.getElementById("typewriter-skills");
  if (twEl) typeNext();
}

function typeNext() {
  if (!twEl || twSkills.length === 0) return;

  const current = twSkills[twIndex];

  if (!twLine) {
    twLine = document.createElement("p");
    twLine.classList.add("skill-line");
    twEl.appendChild(twLine);
  }

  if (!twDeleting) {
    twLine.textContent = current.substring(0, twChar + 1);
    twChar++;

    if (twChar === current.length) {
      setTimeout(() => {
        if (twIndex < twSkills.length - 1) {
          twLine = null;
          twIndex++;
          twChar = 0;
          setTimeout(typeNext, 100);
        } else {
          twDeleting = true;
          setTimeout(typeNext, 1200);
        }
      }, 800);
      return;
    }

    setTimeout(typeNext, 45 + Math.random() * 35);
  } else {
    twLine.textContent = current.substring(0, twChar - 1);
    twChar--;

    if (twChar === 0) {
      twEl.innerHTML = "";
      twLine = null;
      twIndex = 0;
      twDeleting = false;
      setTimeout(typeNext, 400);
      return;
    }

    setTimeout(typeNext, 25);
  }
}

/* ============================================
   NAVBAR — SCROLL BEHAVIOR
   ============================================ */
function initNavbarScroll() {
  const navbar = document.getElementById("navbar");
  const sections = document.querySelectorAll(".section, #hero");
  const navLinks = document.querySelectorAll(".nav-link");

  function update() {
    navbar.classList.toggle("scrolled", window.scrollY > 20);

    let current = "";
    sections.forEach((s) => {
      if (window.scrollY >= s.offsetTop - 100) current = s.id;
    });

    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
    });
  }

  window.addEventListener("scroll", update, { passive: true });
}

/* ============================================
   MOBILE NAV
   ============================================ */
function initMobileNav(linkNames) {
  const toggle = document.getElementById("nav-toggle");
  let mobileNav = null;

  toggle.addEventListener("click", () => {
    if (!mobileNav) {
      mobileNav = document.createElement("div");
      mobileNav.classList.add("mobile-nav");
      linkNames.forEach((name) => {
        const a = document.createElement("a");
        a.href = `#${name}`;
        a.textContent = name;
        a.addEventListener("click", () => mobileNav.classList.remove("open"));
        mobileNav.appendChild(a);
      });
      document.body.appendChild(mobileNav);
      mobileNav.offsetHeight; // reflow
    }
    mobileNav.classList.toggle("open");
  });
}

/* ============================================
   SCROLL-TRIGGERED ANIMATIONS
   ============================================ */
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll("[data-animate]").forEach((el) => observer.observe(el));
}

/* ============================================
   SMOOTH SCROLL
   ============================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

/* ============================================
   SECTION TITLE TYPEWRITER
   ============================================ */
function initSectionTitleTypewriters() {
  const titles = document.querySelectorAll('.section-title[data-typewriter="true"]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          typeSectionTitle(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  titles.forEach((t) => observer.observe(t));
}

function typeSectionTitle(h2) {
  const fullText = h2.dataset.fullTitle;
  const textEl = h2.querySelector(".title-text");
  if (!textEl || !fullText) return;

  h2.classList.add("typing");
  let i = 0;

  function tick() {
    if (i <= fullText.length) {
      textEl.textContent = fullText.substring(0, i);
      i++;
      setTimeout(tick, 55 + Math.random() * 40);
    } else {
      h2.classList.remove("typing");
      h2.classList.add("typed");
    }
  }

  tick();
}

/* ============================================
   ABOUT TERMINAL TYPEWRITER
   ============================================ */
function initAboutTerminalTypewriter() {
  const terminal = document.getElementById("about-terminal");
  if (!terminal) return;

  const lines = terminal.querySelectorAll(".term-line");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          terminal.classList.add("typing");
          revealLinesSequentially(lines);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  observer.observe(terminal);
}

function revealLinesSequentially(lines) {
  lines.forEach((line, index) => {
    setTimeout(() => {
      line.classList.add("revealed");
      if (line.classList.contains("typewriter-output")) {
        setTimeout(() => line.classList.add("expanding"), 100);
      }
    }, index * 350);
  });
}

/* ============================================
   CONTACT TERMINAL TYPEWRITER
   ============================================ */
function initContactTypewriter() {
  const terminal = document.getElementById("contact-terminal");
  if (!terminal) return;

  const output = terminal.querySelector(".contact-output.type-in");
  if (!output) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => output.classList.add("expanding"), 400);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  observer.observe(terminal);
}
