/**
 * Main Interactive Application Logic
 * Khairul Raihan Hidayat - Data Science Portfolio
 */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavigation();
    initTypewriter();
    initParticleCanvas();
    initScrollReveal();
    initStatsCounter();
    renderSkills();
    renderProjects();
    renderCertifications();
    initProjectModal();
    initSentimentAnalyzer();
    initContactForm();
    initClipboard();
});

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

    // Scroll Navbar Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        highlightActiveSection();
    });

    // Mobile Hamburger
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
   3. TYPEWRITER EFFECT
   ========================================================================== */
function initTypewriter() {
    const element = document.getElementById('typewriter');
    if (!element) return;

    const roles = [
        "Data Science Enthusiast",
        "NLP & Machine Learning Specialist",
        "Business Intelligence & BI Analyst",
        "Fresh Graduate S.Kom (IPK 3.88)"
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            element.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            element.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 110;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            typingSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500;
        }

        setTimeout(type, typingSpeed);
    }

    type();
}

/* ==========================================================================
   4. PARTICLES / CONSTELLATION BACKGROUND CANVAS
   ========================================================================== */
function initParticleCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let particles = [];
    const particleCount = Math.min(Math.floor(window.innerWidth / 20), 45);

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.6;
            this.vy = (Math.random() - 0.5) * 0.6;
            this.radius = Math.random() * 2 + 1;
            this.color = Math.random() > 0.5 ? 'rgba(56, 189, 248, ' : 'rgba(168, 85, 247, ';
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color + '0.7)';
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 130) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(56, 189, 248, ${0.15 * (1 - dist / 130)})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });
}

/* ==========================================================================
   5. SCROLL REVEAL ANIMATIONS
   ========================================================================== */
function initScrollReveal() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        },
        { threshold: 0.12 }
    );

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ==========================================================================
   6. ANIMATED STATS COUNTER
   ========================================================================== */
function initStatsCounter() {
    const statCards = document.querySelectorAll('.stat-number');
    let counted = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !counted) {
                counted = true;
                statCards.forEach(card => {
                    const target = parseFloat(card.getAttribute('data-target'));
                    const isDecimal = target % 1 !== 0;
                    let count = 0;
                    const duration = 1800;
                    const increment = target / (duration / 25);

                    const timer = setInterval(() => {
                        count += increment;
                        if (count >= target) {
                            count = target;
                            clearInterval(timer);
                        }
                        card.textContent = isDecimal ? count.toFixed(2) : Math.floor(count);
                    }, 25);
                });
            }
        });
    }, { threshold: 0.5 });

    const statsGrid = document.querySelector('.stats-grid');
    if (statsGrid) observer.observe(statsGrid);
}

/* ==========================================================================
   7. SKILLS MATRIX RENDER
   ========================================================================== */
function renderSkills() {
    const container = document.getElementById('skills-container');
    if (!container || !portfolioData.skills) return;

    container.innerHTML = portfolioData.skills.map((cat, idx) => `
        <div class="skill-category-card reveal reveal-delay-${(idx % 3) + 1}">
            <div class="skill-cat-header">
                <div class="skill-cat-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                        <polyline points="2 17 12 22 22 17"></polyline>
                        <polyline points="2 12 12 17 22 12"></polyline>
                    </svg>
                </div>
                <div>
                    <h3 class="skill-cat-title">${cat.category}</h3>
                    <p class="skill-cat-desc">${cat.description}</p>
                </div>
            </div>
            <div class="skill-items-list">
                ${cat.items.map(skill => `
                    <div class="skill-item">
                        <div class="skill-item-header">
                            <span class="skill-item-name">${skill.name}</span>
                            <span class="skill-item-level">${skill.level}%</span>
                        </div>
                        <div class="skill-progress-bar">
                            <div class="skill-progress-fill" style="width: ${skill.level}%"></div>
                        </div>
                        <div class="skill-tags">
                            ${skill.tags.map(tag => `<span class="skill-tag-pill">${tag}</span>`).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

/* ==========================================================================
   8. PROJECTS SHOWCASE RENDER & FILTERING
   ========================================================================== */
function renderProjects(filter = 'all') {
    const grid = document.getElementById('projects-grid');
    if (!grid || !portfolioData.projects) return;

    const filtered = filter === 'all' 
        ? portfolioData.projects 
        : portfolioData.projects.filter(p => p.category === filter);

    grid.innerHTML = filtered.map((proj, idx) => `
        <div class="project-card reveal reveal-delay-${(idx % 3) + 1}" data-category="${proj.category}">
            <div class="project-thumbnail">
                <img src="${proj.image}" alt="${proj.title}" loading="lazy" />
                <span class="project-badge">${proj.badge}</span>
            </div>
            <div class="project-body">
                <span class="project-category-tag">${proj.categoryName}</span>
                <h3 class="project-title">${proj.title}</h3>
                <p class="project-desc">${proj.overview}</p>
                
                <div class="project-metrics-row">
                    ${proj.metrics.map(m => `
                        <div class="metric-pill">
                            <div class="metric-val">${m.val}</div>
                            <div class="metric-lbl">${m.label}</div>
                        </div>
                    `).join('')}
                </div>

                <div class="project-tech-stack">
                    ${proj.techStack.slice(0, 4).map(tech => `
                        <span class="tech-badge">${tech}</span>
                    `).join('')}
                    ${proj.techStack.length > 4 ? `<span class="tech-badge">+${proj.techStack.length - 4} more</span>` : ''}
                </div>

                <div class="project-actions">
                    <button class="btn btn-primary btn-sm btn-open-modal" data-project-id="${proj.id}">
                        Lihat Studi Kasus
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </button>
                    ${proj.links.github ? `
                        <a href="${proj.links.github}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" title="Lihat Repositori GitHub">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                            </svg>
                            Code
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
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        renderProjects(filter);
    });
});

/* ==========================================================================
   9. PROJECT DETAIL MODAL
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
    const project = portfolioData.projects.find(p => p.id === projectId);

    if (!modal || !body || !project) return;

    body.innerHTML = `
        <div class="modal-banner">
            <img src="${project.image}" alt="${project.title}" />
        </div>
        <div class="modal-header-meta">
            <span class="project-category-tag">${project.categoryName}</span>
            <h2 class="modal-title">${project.title}</h2>
            <p class="modal-subtitle">${project.subtitle}</p>
        </div>

        <div class="project-metrics-row" style="margin-bottom: 2rem;">
            ${project.metrics.map(m => `
                <div class="metric-pill">
                    <div class="metric-val" style="font-size: 1.25rem;">${m.val}</div>
                    <div class="metric-lbl">${m.label}</div>
                </div>
            `).join('')}
        </div>

        <h4 class="modal-section-title">Latar Belakang & Masalah</h4>
        <p class="modal-text">${project.details.problem}</p>

        <h4 class="modal-section-title">Metodologi & Solusi</h4>
        <p class="modal-text">${project.details.solution}</p>

        <h4 class="modal-section-title">Fitur & Pencapaian Kunci</h4>
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

        <h4 class="modal-section-title">Dampak & Manfaat Bisnis</h4>
        <p class="modal-text">${project.details.impact}</p>

        <h4 class="modal-section-title">Teknologi & Library</h4>
        <div class="project-tech-stack" style="margin-top: 0.5rem;">
            ${project.techStack.map(t => `<span class="tech-badge" style="font-size: 0.82rem; padding: 0.3rem 0.8rem;">${t}</span>`).join('')}
        </div>

        <div class="modal-footer-actions">
            ${project.links.github ? `
                <a href="${project.links.github}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                    Lihat Kode di GitHub
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="7" y1="17" x2="17" y2="7"></line>
                        <polyline points="7 7 17 7 17 17"></polyline>
                    </svg>
                </a>
            ` : ''}
            <button class="btn btn-secondary" onclick="closeProjectModal()">Tutup</button>
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
   10. CERTIFICATIONS RENDER
   ========================================================================== */
function renderCertifications() {
    const grid = document.getElementById('certifications-grid');
    if (!grid || !portfolioData.certifications) return;

    grid.innerHTML = portfolioData.certifications.map((cert, idx) => `
        <div class="cert-card reveal reveal-delay-${(idx % 4) + 1}">
            <div class="cert-icon-box ${cert.badgeColor}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="8" r="7"></circle>
                    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                </svg>
            </div>
            <h3 class="cert-title">${cert.title}</h3>
            <span class="cert-issuer">${cert.issuer}</span>
            <span class="cert-date">${cert.date}</span>
            <p class="cert-desc">${cert.description}</p>
        </div>
    `).join('');
}

/* ==========================================================================
   11. INTERACTIVE SENTIMENT ANALYZER (LIVE NLP PLAYGROUND)
   ========================================================================== */
function initSentimentAnalyzer() {
    const textarea = document.getElementById('analyzer-input');
    const analyzeBtn = document.getElementById('btn-analyze-text');
    const chips = document.querySelectorAll('.sample-chip');
    const emojiEl = document.getElementById('sentiment-emoji');
    const labelEl = document.getElementById('sentiment-label');
    const posFill = document.getElementById('prob-pos-fill');
    const posVal = document.getElementById('prob-pos-val');
    const neuFill = document.getElementById('prob-neu-fill');
    const neuVal = document.getElementById('prob-neu-val');
    const negFill = document.getElementById('prob-neg-fill');
    const negVal = document.getElementById('prob-neg-val');

    if (!textarea || !analyzeBtn) return;

    // Indonesian Sentiment Lexicon Dictionary (Inspired by Skripsi InSet Lexicon)
    const posLexicon = [
        'bagus', 'keren', 'mantap', 'baik', 'hebat', 'setuju', 'terima kasih', 'edukasi', 
        'bantu', 'senang', 'cinta', 'suka', 'puas', 'luar biasa', 'lanjutkan', 'salut', 
        'terbaik', 'puji', 'dukung', 'positif', 'mendidik', 'informatif', 'rapi', 'bermanfaat', 
        'jelas', 'lengkap', 'memuaskan', 'top', 'rekomendasi', 'profesional', 'mantul'
    ];

    const negLexicon = [
        'buruk', 'jelek', 'kecewa', 'kurang', 'gagal', 'sulit', 'tidak suka', 'benci', 
        'parah', 'bohong', 'rugi', 'lambat', 'membingungkan', 'menyesal', 'rusak', 'salah', 
        'marah', 'kacau', 'lelet', 'ribet', 'zonk', 'mengecewakan', 'payah', 'jelek'
    ];

    const slangDict = {
        'bgt': 'banget', 'gk': 'tidak', 'ga': 'tidak', 'gak': 'tidak', 'bs': 'bisa', 
        'tp': 'tapi', 'yg': 'yang', 'dgn': 'dengan', 'utk': 'untuk', 'skrg': 'sekarang', 
        'rekomended': 'rekomendasi', 'mantaap': 'mantap', 'bguss': 'bagus'
    };

    function runAnalysis(text) {
        if (!text.trim()) {
            showToast('Silakan ketik komentar atau pilih contoh di bawah!');
            return;
        }

        // Clean & Normalize
        let cleaned = text.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, ' ');
        let tokens = cleaned.split(/\s+/).filter(t => t.length > 0);
        
        let normalizedTokens = tokens.map(t => slangDict[t] || t);

        let posScore = 0;
        let negScore = 0;

        normalizedTokens.forEach(word => {
            if (posLexicon.includes(word)) posScore += 1;
            if (negLexicon.includes(word)) negScore += 1;
        });

        // Compute probabilities
        let totalWords = normalizedTokens.length;
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

        // Normalize sum to 100%
        let pPos = Math.round(posProb * 100);
        let pNeg = Math.round(negProb * 100);
        let pNeu = 100 - (pPos + pNeg);

        // Update UI
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

        showToast('Analisis Sentimen Selesai!');
    }

    analyzeBtn.addEventListener('click', () => runAnalysis(textarea.value));

    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            textarea.value = chip.getAttribute('data-text');
            runAnalysis(textarea.value);
        });
    });
}

/* ==========================================================================
   12. CONTACT FORM HANDLER
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('sender-name').value;
        const email = document.getElementById('sender-email').value;
        const subject = document.getElementById('sender-subject').value || 'Pesan dari Web Portofolio';
        const message = document.getElementById('sender-message').value;

        // Build mailto link
        const mailtoLink = `mailto:khairulraihan617@gmail.com?subject=${encodeURIComponent(subject + ' - ' + name)}&body=${encodeURIComponent("Halo Khairul Raihan,\n\n" + message + "\n\nDari: " + name + " (" + email + ")")}`;
        
        window.location.href = mailtoLink;
        showToast('Membuka aplikasi email...');
        form.reset();
    });
}

/* ==========================================================================
   13. CLIPBOARD & TOAST SYSTEM
   ========================================================================== */
function initClipboard() {
    const copyEmailBtn = document.getElementById('btn-copy-email');
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', () => {
            const email = 'khairulraihan617@gmail.com';
            navigator.clipboard.writeText(email).then(() => {
                showToast('Email berhasil disalin ke clipboard! 📋');
            }).catch(() => {
                showToast('Email: khairulraihan617@gmail.com');
            });
        });
    }
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
    toast.innerHTML = `
        <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <span>${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 50);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}
