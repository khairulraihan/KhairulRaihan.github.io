/**
 * Main Interactive Application Logic (100% Dynamic Content Rendering)
 * Khairul Raihan Hidayat - Data Science Portfolio
 */

// Helper to get active data with bulletproof fallback & deep merge
function getActiveData() {
    let base = typeof portfolioData !== 'undefined' ? JSON.parse(JSON.stringify(portfolioData)) : {};
    try {
        const custom = localStorage.getItem('customPortfolioData');
        if (custom) {
            const parsed = JSON.parse(custom);
            if (parsed && typeof parsed === 'object') {
                base = {
                    ...base,
                    ...parsed,
                    hero: { ...(base.hero || {}), ...(parsed.hero || {}) },
                    about: { ...(base.about || {}), ...(parsed.about || {}) },
                    contact: { ...(base.contact || {}), ...(parsed.contact || {}) },
                    footer: { ...(base.footer || {}), ...(parsed.footer || {}) },
                    nlpDemo: { ...(base.nlpDemo || {}), ...(parsed.nlpDemo || {}) },
                    skills: (parsed.skills && Array.isArray(parsed.skills) && parsed.skills.length > 0) ? parsed.skills : (base.skills || []),
                    projects: (parsed.projects && Array.isArray(parsed.projects) && parsed.projects.length > 0) ? parsed.projects : (base.projects || []),
                    certifications: (parsed.certifications && Array.isArray(parsed.certifications) && parsed.certifications.length > 0) ? parsed.certifications : (base.certifications || []),
                    stats: (parsed.stats && Array.isArray(parsed.stats) && parsed.stats.length > 0) ? parsed.stats : (base.stats || [])
                };

                // Auto-heal CV path
                if (base.contact && (!base.contact.cvPath || (!base.contact.cvPath.endsWith('.pdf') && !base.contact.cvPath.endsWith('.docx')))) {
                    base.contact.cvPath = 'assets/docs/Khairul_Raihan_Hidayat_CV.pdf';
                }
            }
        }
    } catch (e) {
        console.warn('Error reading custom data from localStorage, using base data:', e);
    }
    return base;
}

function sanitizeCvPath(path) {
    if (!path) return 'assets/docs/Khairul_Raihan_Hidayat_CV.pdf';
    let clean = path.trim();
    if (!clean.endsWith('.pdf') && !clean.endsWith('.docx')) {
        clean = `${clean}.pdf`;
    }
    return clean;
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        const data = getActiveData();
        initTheme();
        initNavigation();
        renderAllDynamicContent(data);
        initTypewriter(data);
        initScrollReveal();
        initProjectFilters();
        initProjectModal();
        initSentimentAnalyzer(data);
        initContactForm();
        initClipboard();
    } catch (err) {
        console.error('Initialization error:', err);
    } finally {
        // Guarantee visibility: always activate in-viewport reveal elements immediately
        setTimeout(() => {
            document.querySelectorAll('.reveal').forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight) {
                    el.classList.add('active');
                }
            });
        }, 50);
    }
});

function renderAllDynamicContent(data = getActiveData()) {
    renderHero(data);
    renderAbout(data);
    renderSkills(data);
    renderProjects('all', data);
    renderNlpDemo(data);
    renderCertifications(data);
    renderContact(data);
    renderFooter(data);
}

/* ==========================================================================
   1. THEME TOGGLE (DARK / LIGHT)
   ========================================================================== */
function initTheme() {
    const themeBtn = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('portfolio-theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }
}

function updateThemeIcon(theme) {
    const sunIcon = document.getElementById('theme-icon-sun');
    const moonIcon = document.getElementById('theme-icon-moon');
    if (sunIcon && moonIcon) {
        if (theme === 'light') {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        } else {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        }
    }
}

/* ==========================================================================
   2. NAVIGATION & MOBILE MENU
   ========================================================================== */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        highlightActiveSection();
    });

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('open');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
            });
        });
    }
}

function highlightActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset + 120;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop;
        const sectionId = current.getAttribute('id');
        const correspondingLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            if (correspondingLink) {
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                correspondingLink.classList.add('active');
            }
        }
    });
}

/* ==========================================================================
   3. HERO SECTION RENDER
   ========================================================================== */
function renderHero(data) {
    const h = data.hero || {};
    const c = data.contact || {};

    const setText = (id, val) => {
        const el = document.getElementById(id);
        if (el && val) el.textContent = val;
    };

    setText('hero-status-pill', h.statusPill);
    setText('hero-name', h.name || data.personal?.name);
    setText('hero-bio', h.bio || data.personal?.bio);
    setText('hero-cta-primary-text', h.ctaPrimaryText);
    setText('hero-cta-secondary-text', h.ctaSecondaryText);

    const ctaPrim = document.getElementById('hero-cta-primary');
    if (ctaPrim && h.ctaPrimaryLink) ctaPrim.setAttribute('href', h.ctaPrimaryLink);

    const ctaSec = document.getElementById('hero-cta-secondary');
    if (ctaSec && h.ctaSecondaryLink) ctaSec.setAttribute('href', h.ctaSecondaryLink);

    const profileImg = document.getElementById('hero-profile-img');
    if (profileImg && h.profileImage) profileImg.setAttribute('src', h.profileImage);

    // Navigation CV
    const navCv = document.getElementById('btn-nav-cv');
    const rawCvPath = c.cvPath || data.personal?.cvPath || 'assets/docs/Khairul_Raihan_Hidayat_CV.pdf';
    const cvPath = sanitizeCvPath(rawCvPath);
    if (navCv) {
        navCv.setAttribute('href', cvPath);
        navCv.setAttribute('download', 'Khairul_Raihan_Hidayat_CV.pdf');
    }

    // Hero Socials
    const setLink = (id, url) => {
        const el = document.getElementById(id);
        if (el && url) el.setAttribute('href', url);
    };

    setLink('hero-github', c.github || data.personal?.socials?.github);
    setLink('hero-linkedin', c.linkedin || data.personal?.socials?.linkedin);
    setLink('hero-email', `mailto:${c.email || data.personal?.email}`);
    
    const waNum = (c.whatsappNum || c.whatsapp || data.personal?.whatsapp || '628989518334').replace(/\D/g, '');
    setLink('hero-whatsapp', `https://wa.me/${waNum}`);
}

/* ==========================================================================
   4. ABOUT & EDUCATION SECTION RENDER
   ========================================================================== */
function renderAbout(data) {
    const a = data.about || {};
    const c = data.contact || {};

    const setText = (id, val) => {
        const el = document.getElementById(id);
        if (el && val) el.textContent = val;
    };

    setText('about-badge', a.sectionBadge);
    setText('about-title', a.sectionTitle);
    setText('about-desc', a.sectionDesc);
    setText('about-period', a.period);
    setText('about-institution', a.institution);
    setText('about-degree', a.degree);
    setText('about-gpa', a.gpa);

    // Course chips
    const courseContainer = document.getElementById('about-course-chips');
    if (courseContainer && a.courses) {
        courseContainer.innerHTML = a.courses.map(course => `<span class="course-chip">${course}</span>`).join('');
    }

    // Story paragraphs
    const storyContainer = document.getElementById('about-story-container');
    if (storyContainer && a.story) {
        const paragraphs = a.story.split('\n\n');
        storyContainer.innerHTML = paragraphs.map(p => `<p>${p}</p>`).join('');
    }

    // Competencies
    const compContainer = document.getElementById('about-competencies-grid');
    if (compContainer && a.competencies) {
        compContainer.innerHTML = a.competencies.map(comp => `
            <div class="competency-item">
                <h4>${comp.title}</h4>
                <p>${comp.desc}</p>
            </div>
        `).join('');
    }

    // About CTA Buttons
    const aboutCv = document.getElementById('btn-about-cv');
    const rawAboutCv = c.cvPath || data.personal?.cvPath || 'assets/docs/Khairul_Raihan_Hidayat_CV.pdf';
    const aboutCvPath = sanitizeCvPath(rawAboutCv);
    if (aboutCv) {
        aboutCv.setAttribute('href', aboutCvPath);
        aboutCv.setAttribute('download', 'Khairul_Raihan_Hidayat_CV.pdf');
    }

    const aboutWa = document.getElementById('btn-about-whatsapp');
    const waNum = (c.whatsappNum || c.whatsapp || data.personal?.whatsapp || '628989518334').replace(/\D/g, '');
    if (aboutWa) aboutWa.setAttribute('href', `https://wa.me/${waNum}`);
}

/* ==========================================================================
   6. SKILLS MATRIX RENDER
   ========================================================================== */
function renderSkills(data) {
    const container = document.getElementById('skills-container');
    if (!container || !data.skills) return;

    container.innerHTML = data.skills.map((cat, idx) => `
        <div class="skill-category-card reveal reveal-delay-${(idx % 2) + 1}">
            <h3 class="skill-cat-title">${cat.category}</h3>
            <p class="skill-cat-desc">${cat.description || ''}</p>
            <div class="skill-rows-list">
                ${cat.items.map(skill => `
                    <div class="skill-row">
                        <div class="skill-row-header">
                            <span class="skill-name">${skill.name}</span>
                            <span class="skill-status-tag">${skill.status || (skill.level ? `${skill.level}%` : 'Mahir')}</span>
                        </div>
                        <div class="skill-tag-pills">
                            ${(skill.tags || []).map(tag => `<span class="skill-pill">${tag}</span>`).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

/* ==========================================================================
   7. PROJECTS SHOWCASE RENDER & FILTERING
   ========================================================================== */
function renderProjects(filter = 'all', data = getActiveData()) {
    const grid = document.getElementById('projects-grid');
    if (!grid || !data.projects) return;

    const filtered = filter === 'all' 
        ? data.projects 
        : data.projects.filter(p => p.category === filter);

    if (filtered.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">Belum ada proyek dalam kategori ini.</div>`;
        return;
    }

    grid.innerHTML = filtered.map((proj, idx) => `
        <div class="project-card reveal reveal-delay-${(idx % 3) + 1}" data-category="${proj.category}">
            <div class="project-thumbnail">
                <img src="${proj.image || 'assets/images/project-nlp.jpg'}" alt="${proj.title}" loading="lazy" />
                <span class="project-badge-tag">${proj.badge || 'Studi Kasus'}</span>
            </div>
            <div class="project-body">
                <span class="project-domain">${proj.categoryName || proj.category}</span>
                <h3 class="project-title">${proj.title}</h3>
                <p class="project-summary">${proj.overview || ''}</p>
                
                <div class="project-metrics-bar">
                    ${(proj.metrics || []).map(m => `
                        <div class="metric-cell">
                            <strong>${m.val}</strong>
                            <span>${m.label}</span>
                        </div>
                    `).join('')}
                </div>

                <div class="project-tech-tags">
                    ${(proj.techStack || []).slice(0, 4).map(tech => `
                        <span class="tech-tag">${tech}</span>
                    `).join('')}
                    ${(proj.techStack && proj.techStack.length > 4) ? `<span class="tech-tag">+${proj.techStack.length - 4}</span>` : ''}
                </div>

                <div class="project-actions">
                    <button class="btn btn-primary btn-sm btn-open-modal" data-project-id="${proj.id}">
                        Lihat Studi Kasus
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </button>
                    ${(proj.links && proj.links.github) ? `
                        <a href="${proj.links.github}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" title="Lihat Repositori">
                            GitHub
                        </a>
                    ` : ''}
                </div>
            </div>
        </div>
    `).join('');

    // Attach modal openers
    document.querySelectorAll('.btn-open-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-project-id');
            openProjectModal(id);
        });
    });

    initScrollReveal();
}

// Setup project filter tabs
function initProjectFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');
            renderProjects(filter, getActiveData());
        });
    });
}

/* ==========================================================================
   8. PROJECT DETAIL MODAL
   ========================================================================== */
function initProjectModal() {
    const modal = document.getElementById('project-modal');
    const closeBtn = document.getElementById('modal-close-btn');

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', closeProjectModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeProjectModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeProjectModal();
            }
        });
    }
}

function openProjectModal(projectId) {
    const modal = document.getElementById('project-modal');
    const body = document.getElementById('modal-dynamic-body');
    const data = getActiveData();
    const project = (data.projects || []).find(p => p.id === projectId);

    if (!modal || !body || !project) return;

    body.innerHTML = `
        <div class="modal-banner">
            <img src="${project.image || 'assets/images/project-nlp.jpg'}" alt="${project.title}" />
        </div>
        
        <span class="project-domain">${project.categoryName || project.category}</span>
        <h2 class="modal-title">${project.title}</h2>
        <p class="modal-subtitle">${project.subtitle || ''}</p>

        <div class="project-metrics-bar" style="margin-bottom: 1.5rem;">
            ${(project.metrics || []).map(m => `
                <div class="metric-cell">
                    <strong style="font-size: 1.15rem;">${m.val}</strong>
                    <span>${m.label}</span>
                </div>
            `).join('')}
        </div>

        ${project.details?.problem ? `
            <h4 class="modal-section-title">Latar Belakang & Masalah</h4>
            <p class="modal-text">${project.details.problem}</p>
        ` : ''}

        ${project.details?.solution ? `
            <h4 class="modal-section-title">Metodologi & Solusi Teknis</h4>
            <p class="modal-text">${project.details.solution}</p>
        ` : ''}

        ${(project.highlights && project.highlights.length > 0) ? `
            <h4 class="modal-section-title">Poin Hasil & Pencapaian Kunci</h4>
            <div class="modal-highlights-list">
                ${project.highlights.map(h => `
                    <div class="modal-highlight-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span>${h}</span>
                    </div>
                `).join('')}
            </div>
        ` : ''}

        ${project.details?.impact ? `
            <h4 class="modal-section-title">Dampak & Manfaat Bisnis</h4>
            <p class="modal-text">${project.details.impact}</p>
        ` : ''}

        ${(project.techStack && project.techStack.length > 0) ? `
            <h4 class="modal-section-title">Teknologi & Library</h4>
            <div class="project-tech-tags" style="margin-top: 0.5rem;">
                ${project.techStack.map(t => `<span class="tech-tag" style="font-size: 0.8rem; padding: 0.25rem 0.65rem;">${t}</span>`).join('')}
            </div>
        ` : ''}

        <div style="display: flex; gap: 0.75rem; margin-top: 1.75rem; padding-top: 1.25rem; border-top: 1px solid var(--border-subtle);">
            ${(project.links && project.links.github) ? `
                <a href="${project.links.github}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
                    Lihat Kode di GitHub
                </a>
            ` : ''}
            <button class="btn btn-secondary btn-sm" onclick="closeProjectModal()">Tutup</button>
        </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    const modal = document.getElementById('project-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

/* ==========================================================================
   9. RESEARCH CONSOLE / NLP DEMO SECTION RENDER
   ========================================================================== */
function renderNlpDemo(data) {
    const n = data.nlpDemo || {};

    const setText = (id, val) => {
        const el = document.getElementById(id);
        if (el && val) el.textContent = val;
    };

    setText('nlp-badge', n.sectionBadge);
    setText('nlp-title', n.sectionTitle);
    setText('nlp-desc', n.sectionDesc);
    setText('nlp-console-title', n.consoleTitle);
    setText('nlp-console-subtitle', n.consoleSubtitle);
    setText('nlp-console-badge', n.consoleBadge);

    const chipsContainer = document.getElementById('nlp-sample-chips-container');
    if (chipsContainer && n.sampleChips) {
        chipsContainer.innerHTML = `
            <span style="font-size: 0.78rem; color: var(--text-muted);">Pilih contoh uji:</span>
            ${n.sampleChips.map(c => `
                <button type="button" class="sample-chip" data-text="${c.text}">${c.label}</button>
            `).join('')}
        `;
    }
}

/* ==========================================================================
   10. CERTIFICATIONS RENDER
   ========================================================================== */
function renderCertifications(data) {
    const grid = document.getElementById('certifications-grid');
    if (!grid || !data.certifications) return;

    grid.innerHTML = data.certifications.map((cert, idx) => `
        <div class="cert-card reveal reveal-delay-${(idx % 4) + 1}">
            <h3 class="cert-title">${cert.title}</h3>
            <span class="cert-issuer">${cert.issuer}</span>
            <span class="cert-date">${cert.date}</span>
            <p class="cert-desc">${cert.description}</p>
        </div>
    `).join('');
}

/* ==========================================================================
   11. CONTACT SECTION RENDER
   ========================================================================== */
function renderContact(data) {
    const c = data.contact || {};

    const setText = (id, val) => {
        const el = document.getElementById(id);
        if (el && val) el.textContent = val;
    };

    setText('contact-badge', c.sectionBadge);
    setText('contact-title', c.sectionTitle);
    setText('contact-desc', c.sectionDesc);
    setText('contact-location', c.location);

    const mailLink = document.getElementById('contact-email-link');
    if (mailLink && c.email) {
        mailLink.textContent = c.email;
        mailLink.setAttribute('href', `mailto:${c.email}`);
    }

    const waLink = document.getElementById('contact-whatsapp-link');
    if (waLink && c.whatsapp) {
        waLink.textContent = c.whatsapp;
        const waNum = (c.whatsappNum || c.whatsapp).replace(/\D/g, '');
        waLink.setAttribute('href', `https://wa.me/${waNum}`);
    }

    const linkedinLink = document.getElementById('contact-linkedin-link');
    if (linkedinLink && c.linkedin) {
        linkedinLink.textContent = c.linkedinDisplay || c.linkedin;
        linkedinLink.setAttribute('href', c.linkedin);
    }
}

/* ==========================================================================
   12. FOOTER RENDER
   ========================================================================== */
function renderFooter(data) {
    const f = data.footer || {};
    const c = data.contact || {};

    const setText = (id, val) => {
        const el = document.getElementById(id);
        if (el && val) el.textContent = val;
    };

    setText('footer-title', f.title || data.hero?.name || data.personal?.name);
    setText('footer-subtitle', f.subtitle);

    const footCopy = document.getElementById('footer-copyright');
    if (footCopy && f.copyright) {
        footCopy.innerHTML = f.copyright;
    }

    const footGit = document.getElementById('footer-github');
    if (footGit && (c.github || data.personal?.socials?.github)) {
        footGit.setAttribute('href', c.github || data.personal?.socials?.github);
    }

    const footIn = document.getElementById('footer-linkedin');
    if (footIn && (c.linkedin || data.personal?.socials?.linkedin)) {
        footIn.setAttribute('href', c.linkedin || data.personal?.socials?.linkedin);
    }
}

/* ==========================================================================
   13. TYPEWRITER EFFECT
   ========================================================================== */
function initTypewriter(data) {
    const element = document.getElementById('typewriter');
    if (!element) return;

    const roles = data.hero?.roles || data.roles || [
        "Data Science & Analytics",
        "NLP & Machine Learning Specialist",
        "Business Intelligence (Tableau & SQL)",
        "Fresh Graduate S.Kom (IPK 3.88)"
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 90;

    function type() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            element.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 45;
        } else {
            element.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 90;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            typingSpeed = 2200;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 400;
        }

        setTimeout(type, typingSpeed);
    }

    type();
}

/* ==========================================================================
   14. INTERACTIVE RESEARCH CONSOLE (NLP SENTIMENT)
   ========================================================================== */
function initSentimentAnalyzer(data) {
    const textarea = document.getElementById('analyzer-input');
    const analyzeBtn = document.getElementById('btn-analyze-text');
    const emojiEl = document.getElementById('sentiment-emoji');
    const labelEl = document.getElementById('sentiment-label');
    const posFill = document.getElementById('prob-pos-fill');
    const posVal = document.getElementById('prob-pos-val');
    const neuFill = document.getElementById('prob-neu-fill');
    const neuVal = document.getElementById('prob-neu-val');
    const negFill = document.getElementById('prob-neg-fill');
    const negVal = document.getElementById('prob-neg-val');

    if (!textarea || !analyzeBtn) return;

    const posLexicon = [
        'bagus', 'keren', 'mantap', 'baik', 'hebat', 'setuju', 'terima kasih', 'edukasi', 
        'bantu', 'senang', 'cinta', 'suka', 'puas', 'luar biasa', 'lanjutkan', 'salut', 
        'terbaik', 'puji', 'dukung', 'positif', 'mendidik', 'informatif', 'rapi', 'bermanfaat', 
        'jelas', 'lengkap', 'memuaskan', 'top', 'rekomendasi', 'profesional', 'daging'
    ];

    const negLexicon = [
        'buruk', 'jelek', 'kecewa', 'kurang', 'gagal', 'sulit', 'tidak suka', 'benci', 
        'parah', 'bohong', 'rugi', 'lambat', 'membingungkan', 'menyesal', 'rusak', 'salah', 
        'marah', 'kacau', 'lelet', 'ribet', 'zonk', 'mengecewakan', 'payah'
    ];

    const slangDict = {
        'bgt': 'banget', 'gk': 'tidak', 'ga': 'tidak', 'gak': 'tidak', 'bs': 'bisa', 
        'tp': 'tapi', 'yg': 'yang', 'dgn': 'dengan', 'utk': 'untuk', 'skrg': 'sekarang'
    };

    function runAnalysis(text) {
        if (!text.trim()) {
            showToast('Ketik ulasan atau pilih contoh di atas.');
            return;
        }

        let cleaned = text.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, ' ');
        let tokens = cleaned.split(/\s+/).filter(t => t.length > 0);
        let normalizedTokens = tokens.map(t => slangDict[t] || t);

        let posScore = 0;
        let negScore = 0;

        normalizedTokens.forEach(word => {
            if (posLexicon.includes(word)) posScore += 1;
            if (negLexicon.includes(word)) negScore += 1;
        });

        let posProb = 0.33, neuProb = 0.34, negProb = 0.33;

        if (posScore > negScore) {
            posProb = Math.min(0.70 + (posScore * 0.12), 0.96);
            negProb = Math.max(0.02, 0.15 - (posScore * 0.04));
            neuProb = Math.max(0.02, 1 - (posProb + negProb));
        } else if (negScore > posScore) {
            negProb = Math.min(0.70 + (negScore * 0.12), 0.95);
            posProb = Math.max(0.02, 0.15 - (negScore * 0.04));
            neuProb = Math.max(0.02, 1 - (posProb + negProb));
        } else {
            neuProb = 0.70;
            posProb = 0.15;
            negProb = 0.15;
        }

        let pPos = Math.round(posProb * 100);
        let pNeg = Math.round(negProb * 100);
        let pNeu = 100 - (pPos + pNeg);

        posFill.style.width = pPos + '%';
        posVal.textContent = pPos + '%';
        neuFill.style.width = pNeu + '%';
        neuVal.textContent = pNeu + '%';
        negFill.style.width = pNeg + '%';
        negVal.textContent = pNeg + '%';

        labelEl.className = 'sentiment-label';
        if (pPos > pNeg && pPos > pNeu) {
            emojiEl.textContent = '😊';
            labelEl.textContent = 'POSITIF';
            labelEl.classList.add('positive');
        } else if (pNeg > pPos && pNeg > pNeu) {
            emojiEl.textContent = '😡';
            labelEl.textContent = 'NEGATIF';
            labelEl.classList.add('negative');
        } else {
            emojiEl.textContent = '😐';
            labelEl.textContent = 'NETRAL';
            labelEl.classList.add('neutral');
        }

        showToast('Klasifikasi sentimen selesai.');
    }

    analyzeBtn.addEventListener('click', () => runAnalysis(textarea.value));

    // Dynamic delegation for sample chips
    const chipsContainer = document.getElementById('nlp-sample-chips-container');
    if (chipsContainer) {
        chipsContainer.addEventListener('click', (e) => {
            const chip = e.target.closest('.sample-chip');
            if (chip) {
                textarea.value = chip.getAttribute('data-text');
                runAnalysis(textarea.value);
            }
        });
    }
}

/* ==========================================================================
   16. CONTACT FORM HANDLER
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = getActiveData();
        const targetEmail = data.contact?.email || data.personal?.email || 'khairulraihan617@gmail.com';
        const name = document.getElementById('sender-name').value;
        const email = document.getElementById('sender-email').value;
        const subject = document.getElementById('sender-subject').value || 'Pesan dari Portofolio';
        const message = document.getElementById('sender-message').value;

        const mailtoLink = `mailto:${targetEmail}?subject=${encodeURIComponent(subject + ' - ' + name)}&body=${encodeURIComponent("Halo Khairul Raihan,\n\n" + message + "\n\nDari: " + name + " (" + email + ")")}`;
        
        window.location.href = mailtoLink;
        showToast('Membuka aplikasi email...');
        form.reset();
    });
}

/* ==========================================================================
   17. CLIPBOARD & TOAST SYSTEM
   ========================================================================== */
function initClipboard() {
    const copyEmailBtn = document.getElementById('btn-copy-email');
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', () => {
            const data = getActiveData();
            const email = data.contact?.email || data.personal?.email || 'khairulraihan617@gmail.com';
            navigator.clipboard.writeText(email).then(() => {
                showToast('Email disalin ke clipboard! 📋');
            }).catch(() => {
                showToast(`Email: ${email}`);
            });
        });
    }
}

function initScrollReveal() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        },
        { threshold: 0.1 }
    );

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function showToast(message) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${message}</span>`;

    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 50);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 350);
    }, 3000);
}
