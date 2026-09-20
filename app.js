import {
  personalInfo,
  skillsData,
  projectsData,
  interpersonalSkills,
  educationData,
  certificationsData
} from './data.js';

// SVG Icons Map
const ICONS = {
  code: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,
  layout: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><line x1="3" x2="21" y1="9" y2="9"></line><line x1="9" x2="9" y1="21" y2="9"></line></svg>`,
  server: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"></rect><rect width="20" height="8" x="2" y="14" rx="2" ry="2"></rect><line x1="6" x2="6.01" y1="6" y2="6"></line><line x1="6" x2="6.01" y1="18" y2="18"></line></svg>`,
  database: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M3 5V19A9 3 0 0 0 21 19V5"></path><path d="M3 12A9 3 0 0 0 21 12"></path></svg>`,
  network: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="16" y="16" width="6" height="6" rx="1"></rect><rect x="2" y="16" width="6" height="6" rx="1"></rect><rect x="9" y="2" width="6" height="6" rx="1"></rect><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"></path><path d="M12 12V8"></path></svg>`,
  'git-branch': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" x2="6" y1="3" y2="15"></line><circle cx="18" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M18 9a9 9 0 0 1-9 9"></path></svg>`,
  lightbulb: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path><path d="M9 18h6"></path><path d="M10 22h4"></path></svg>`,
  cpu: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="16" x="4" y="4" rx="2"></rect><rect width="6" height="6" x="9" y="9" rx="1"></rect><path d="M15 2v2"></path><path d="M15 20v2"></path><path d="M2 15h2"></path><path d="M2 9h2"></path><path d="M20 15h2"></path><path d="M20 9h2"></path><path d="M9 2v2"></path><path d="M9 20v2"></path></svg>`,
  users: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
  'message-square': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`,
  zap: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
  sparkles: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path></svg>`,
  clock: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
  github: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>`,
  external: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" x2="21" y1="14" y2="3"></line></svg>`,
  check: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
  download: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg>`
};

// Toast notification helper
export function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span style="color: var(--rose-400);">${ICONS.check}</span>
    <span>${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Render Skills
function renderSkills(filterCategory = 'all') {
  const skillsGrid = document.getElementById('skills-grid');
  if (!skillsGrid) return;

  const filtered = filterCategory === 'all'
    ? skillsData
    : skillsData.filter((c) => c.category === filterCategory);

  skillsGrid.innerHTML = filtered.map((cat) => `
    <div class="glass-card" style="padding: 1.75rem; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem;">
          <div style="width: 40px; height: 40px; border-radius: var(--radius-md); background: rgba(244, 63, 94, 0.12); border: 1px solid var(--rose-border); color: var(--rose-400); display: flex; align-items: center; justify-content: center;">
            ${ICONS[cat.icon] || ICONS.code}
          </div>
          <div>
            <h3 style="font-size: 1.15rem; font-weight: 700; color: #fff;">${cat.category}</h3>
            <p style="font-size: 0.75rem; color: var(--text-muted);">${cat.description}</p>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 0.6rem;">
          ${cat.skills.map((skill) => `
            <div style="padding: 0.6rem 0.85rem; border-radius: var(--radius-md); background: rgba(8, 12, 22, 0.7); border: 1px solid rgba(255, 255, 255, 0.05);">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span class="font-mono" style="font-weight: 600; font-size: 0.85rem; color: #e2e8f0;">${skill.name}</span>
                <span style="width: 6px; height: 6px; border-radius: 50%; background: var(--rose-400);"></span>
              </div>
              <p style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.25rem; line-height: 1.4;">${skill.desc}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <div style="margin-top: 1.25rem; padding-top: 0.85rem; border-top: 1px solid rgba(255, 255, 255, 0.06); display: flex; justify-content: space-between; font-size: 0.72rem; font-family: var(--font-mono); color: var(--text-muted);">
        <span>${cat.skills.length} verified technologies</span>
        <span style="color: var(--rose-300);">● Active</span>
      </div>
    </div>
  `).join('');
}

// Render Projects
function renderProjects(filterCategory = 'all') {
  const projectsGrid = document.getElementById('projects-grid');
  if (!projectsGrid) return;

  const filtered = filterCategory === 'all'
    ? projectsData
    : projectsData.filter((p) => p.category === filterCategory);

  projectsGrid.innerHTML = filtered.map((project) => `
    <div class="glass-card" style="padding: 1.75rem; display: flex; flex-direction: column; justify-content: space-between; position: relative;">
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.85rem;">
          <span class="badge badge-rose">${project.category}</span>
          <span class="font-mono" style="font-size: 0.75rem; color: var(--text-muted);">${project.year}</span>
        </div>

        <h3 style="font-size: 1.25rem; font-weight: 700; color: #fff; margin-bottom: 0.6rem;">
          ${project.title}
        </h3>

        <p style="font-size: 0.825rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.25rem;">
          ${project.shortDescription}
        </p>

        <!-- Feature highlights box -->
        <div style="padding: 0.85rem; border-radius: var(--radius-md); background: rgba(7, 11, 20, 0.7); border: 1px solid rgba(255, 255, 255, 0.06); margin-bottom: 1.25rem;">
          <div class="font-mono" style="font-size: 0.72rem; color: var(--rose-300); font-weight: 600; margin-bottom: 0.5rem;">
            Core Features:
          </div>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.35rem;">
            ${project.keyFeatures.slice(0, 3).map((feat) => `
              <li style="font-size: 0.75rem; color: #cbd5e1; display: flex; align-items: flex-start; gap: 0.4rem;">
                <span style="color: var(--rose-400); margin-top: 2px;">•</span>
                <span>${feat}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <!-- Tech tags -->
        <div style="display: flex; flex-wrap: wrap; gap: 0.35rem; margin-bottom: 1.25rem;">
          ${project.technologies.map((t) => `
            <span class="badge badge-slate" style="font-size: 0.7rem;">${t}</span>
          `).join('')}
        </div>
      </div>

      <div style="padding-top: 1rem; border-top: 1px solid rgba(255, 255, 255, 0.08); display: flex; align-items: center; justify-content: space-between;">
        <button class="btn btn-secondary inspect-project-btn" data-project-id="${project.id}" style="padding: 0.45rem 0.85rem; font-size: 0.78rem;">
          View Details &rarr;
        </button>

        ${project.githubUrl ? `
          <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn-icon" aria-label="GitHub Repository">
            ${ICONS.github}
          </a>
        ` : ''}
      </div>
    </div>
  `).join('');

  // Attach modal triggers
  document.querySelectorAll('.inspect-project-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const pid = btn.getAttribute('data-project-id');
      const project = projectsData.find((p) => p.id === pid);
      if (project) openProjectModal(project);
    });
  });
}

// Project Modal Handler
function openProjectModal(project) {
  const modal = document.getElementById('project-modal');
  const titleEl = document.getElementById('modal-project-title');
  const catEl = document.getElementById('modal-project-category');
  const yearEl = document.getElementById('modal-project-year');
  const descEl = document.getElementById('modal-project-desc');
  const featuresEl = document.getElementById('modal-project-features');
  const techEl = document.getElementById('modal-project-tech');
  const githubLink = document.getElementById('modal-project-github');

  if (!modal) return;

  titleEl.textContent = project.title;
  catEl.textContent = project.category;
  yearEl.textContent = `Year: ${project.year}`;
  descEl.textContent = project.description;

  featuresEl.innerHTML = project.keyFeatures.map((f) => `
    <li style="display: flex; align-items: flex-start; gap: 0.5rem; font-size: 0.825rem; color: #cbd5e1; margin-bottom: 0.4rem;">
      <span style="color: var(--rose-400); margin-top: 2px;">✔</span>
      <span>${f}</span>
    </li>
  `).join('');

  techEl.innerHTML = project.technologies.map((t) => `
    <span class="badge badge-slate" style="font-size: 0.75rem;">${t}</span>
  `).join('');

  if (project.githubUrl) {
    githubLink.href = project.githubUrl;
    githubLink.style.display = 'inline-flex';
  } else {
    githubLink.style.display = 'none';
  }

  modal.classList.add('active');
}

// Resume Modal Handler
export function openResumeModal() {
  const modal = document.getElementById('resume-modal');
  if (modal) modal.classList.add('active');
}

export function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach((m) => m.classList.remove('active'));
}

// Render Interpersonal Skills
function renderSoftSkills() {
  const container = document.getElementById('soft-skills-grid');
  if (!container) return;

  container.innerHTML = interpersonalSkills.map((s, idx) => `
    <div class="glass-card" style="padding: 1.5rem; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <div style="width: 44px; height: 44px; border-radius: var(--radius-md); background: rgba(244, 63, 94, 0.12); border: 1px solid var(--rose-border); color: var(--rose-400); display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;">
          ${ICONS[s.icon] || ICONS.sparkles}
        </div>
        <h3 style="font-size: 1.05rem; font-weight: 700; color: #fff; margin-bottom: 0.4rem;">${s.name}</h3>
        <p style="font-size: 0.78rem; color: var(--text-secondary); line-height: 1.5;">${s.desc}</p>
      </div>
      <div style="margin-top: 1rem; padding-top: 0.6rem; border-top: 1px solid rgba(255,255,255,0.06); font-size: 0.7rem; font-family: var(--font-mono); color: var(--text-muted); display: flex; justify-content: space-between;">
        <span>Attribute 0${idx + 1}</span>
        <span style="color: var(--rose-300);">• Core Strength</span>
      </div>
    </div>
  `).join('');
}

// Render Education & Certifications
function renderEducationCertifications() {
  const eduContainer = document.getElementById('education-list');
  const certContainer = document.getElementById('certifications-list');

  if (eduContainer) {
    eduContainer.innerHTML = educationData.map((edu) => `
      <div class="glass-card" style="padding: 1.75rem; position: relative;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
          <span class="badge badge-rose">B.Tech Degree</span>
          <span class="font-mono" style="font-size: 0.75rem; color: var(--text-muted);">${edu.duration}</span>
        </div>
        <h3 style="font-size: 1.2rem; font-weight: 700; color: #fff; margin-bottom: 0.4rem;">${edu.degree}</h3>
        <p style="font-size: 0.85rem; color: var(--text-secondary); font-weight: 500; margin-bottom: 1rem;">${edu.institution}</p>
        <div style="padding: 0.85rem; border-radius: var(--radius-md); background: rgba(7, 11, 20, 0.7); border: 1px solid rgba(255,255,255,0.06);">
          <div class="font-mono" style="font-size: 0.72rem; color: var(--rose-300); font-weight: 600; margin-bottom: 0.25rem;">Academic Foundations:</div>
          <p style="font-size: 0.78rem; color: #cbd5e1; line-height: 1.5;">${edu.highlights}</p>
        </div>
      </div>
    `).join('');
  }

  if (certContainer) {
    certContainer.innerHTML = certificationsData.map((cert) => `
      <div class="glass-card" style="padding: 1.5rem; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem;">
            <span class="badge badge-rose" style="font-size: 0.7rem;">${cert.category}</span>
            <span class="font-mono" style="font-size: 0.75rem; color: var(--text-muted);">${cert.year}</span>
          </div>
          <h4 style="font-size: 1.1rem; font-weight: 700; color: #fff; margin-bottom: 0.35rem;">${cert.title}</h4>
          <p style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.75rem;">Location: ${cert.location}</p>
          <div style="display: flex; flex-wrap: wrap; gap: 0.3rem;">
            ${cert.skills.map((s) => `<span class="badge badge-slate" style="font-size: 0.68rem;">${s}</span>`).join('')}
          </div>
        </div>
        <div style="margin-top: 1rem; padding-top: 0.6rem; border-top: 1px solid rgba(255,255,255,0.06); font-size: 0.72rem; color: #6ee7b7; display: flex; align-items: center; gap: 0.35rem;">
          <span>✔ Verified Training</span>
        </div>
      </div>
    `).join('');
  }
}

// Setup Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  // Render initial components
  renderSkills();
  renderProjects();
  renderSoftSkills();
  renderEducationCertifications();

  // Header scroll detection
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // Mobile drawer toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.style.display === 'flex';
      mobileDrawer.style.display = isOpen ? 'none' : 'flex';
    });

    mobileDrawer.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        mobileDrawer.style.display = 'none';
      });
    });
  }

  // Skills filter buttons
  document.querySelectorAll('#skills-filter-bar .filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#skills-filter-bar .filter-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-category');
      renderSkills(cat);
    });
  });

  // Projects filter buttons
  document.querySelectorAll('#projects-filter-bar .filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#projects-filter-bar .filter-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-category');
      renderProjects(cat);
    });
  });

  // Modals Close handlers
  document.querySelectorAll('.modal-close, .modal-close-btn').forEach((btn) => {
    btn.addEventListener('click', closeAllModals);
  });
  document.querySelectorAll('.modal-overlay').forEach((modal) => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeAllModals();
    });
  });

  // Resume Triggers
  document.querySelectorAll('.open-resume-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openResumeModal();
    });
  });

  // Copy Buttons
  document.querySelectorAll('.copy-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-copy-text');
      const label = btn.getAttribute('data-copy-label');
      if (text) {
        navigator.clipboard.writeText(text);
        showToast(`Copied ${label} to clipboard!`);
      }
    });
  });

  // Contact Form Submission
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('form-name')?.value;
      const email = document.getElementById('form-email')?.value;
      const message = document.getElementById('form-message')?.value;

      if (!name || !email || !message) {
        showToast('Please fill in all required fields.');
        return;
      }

      showToast('Thank you! Your message has been sent to Anubama.');
      contactForm.reset();
    });
  }

  // Back to top
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
