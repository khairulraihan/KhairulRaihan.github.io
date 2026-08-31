/**
 * Admin CMS Master Dashboard Logic (100% Full Content Management)
 * Khairul Raihan Hidayat - Portfolio Management System
 */

// Global State
let currentData = {};
let activeTab = 'overview';

document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    loadData();
    initNavigation();
    renderAllViews();
    initForms();
    initExportBackup();
});

/* ==========================================================================
   1. AUTHENTICATION & PIN SECURITY
   ========================================================================== */
function initAuth() {
    const pinModal = document.getElementById('pin-modal');
    const pinInput = document.getElementById('admin-pin-input');
    const pinBtn = document.getElementById('btn-submit-pin');
    const pinError = document.getElementById('pin-error');
    const btnLock = document.getElementById('btn-lock-session');

    if (!localStorage.getItem('adminPin')) {
        localStorage.setItem('adminPin', '1234');
    }

    const isAuth = sessionStorage.getItem('adminAuth') === 'true';
    if (isAuth) {
        pinModal.classList.add('hidden');
    } else {
        pinModal.classList.remove('hidden');
        if (pinInput) pinInput.focus();
    }

    function checkPin() {
        const entered = pinInput.value.trim();
        const storedPin = localStorage.getItem('adminPin') || '1234';

        if (entered === storedPin) {
            sessionStorage.setItem('adminAuth', 'true');
            pinModal.classList.add('hidden');
            pinError.textContent = '';
            pinInput.value = '';
            showToast('Berhasil masuk ke Dashboard Admin! 🚀');
        } else {
            pinError.textContent = 'PIN Salah! Default PIN: 1234';
            const card = document.querySelector('.pin-card');
            if (card) {
                card.classList.add('shake');
                setTimeout(() => card.classList.remove('shake'), 500);
            }
        }
    }

    if (pinBtn) pinBtn.addEventListener('click', checkPin);
    if (pinInput) {
        pinInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') checkPin();
        });
    }

    if (btnLock) {
        btnLock.addEventListener('click', () => {
            sessionStorage.removeItem('adminAuth');
            pinModal.classList.remove('hidden');
            if (pinInput) {
                pinInput.value = '';
                pinInput.focus();
            }
            showToast('Sesi dashboard telah dikunci.');
        });
    }

    // Change PIN Form
    const formPin = document.getElementById('form-change-pin');
    if (formPin) {
        formPin.addEventListener('submit', (e) => {
            e.preventDefault();
            const oldPin = document.getElementById('pin-old').value.trim();
            const newPin = document.getElementById('pin-new').value.trim();
            const storedPin = localStorage.getItem('adminPin') || '1234';

            if (oldPin !== storedPin) {
                showToast('PIN lama tidak cocok! ❌');
                return;
            }
            if (newPin.length < 4) {
                showToast('PIN baru minimal 4 angka/karakter! ❌');
                return;
            }

            localStorage.setItem('adminPin', newPin);
            showToast('PIN berhasil diubah! Simpan PIN baru Anda. 🔐');
            formPin.reset();
            closeModal('modal-change-pin');
        });
    }
}

/* ==========================================================================
   2. DATA LOADER & STATE PERSISTENCE
   ========================================================================== */
function loadData() {
    try {
        const stored = localStorage.getItem('customPortfolioData');
        if (stored) {
            currentData = JSON.parse(stored);
        } else if (typeof portfolioData !== 'undefined') {
            currentData = JSON.parse(JSON.stringify(portfolioData));
        } else {
            currentData = {};
        }
    } catch (e) {
        console.error('Error loading data:', e);
        if (typeof portfolioData !== 'undefined') {
            currentData = JSON.parse(JSON.stringify(portfolioData));
        }
    }
}

function saveData(notify = true) {
    try {
        localStorage.setItem('customPortfolioData', JSON.stringify(currentData));
        updateSyncBadge(true);
        if (notify) showToast('Data berhasil disimpan secara live! 💾');
        renderAllViews();
    } catch (e) {
        console.error('Error saving data:', e);
        showToast('Gagal menyimpan data ke browser! ❌');
    }
}

function updateSyncBadge(synced) {
    const badge = document.getElementById('sync-status-badge');
    if (badge) {
        badge.innerHTML = `<span class="sync-dot"></span><span>${synced ? 'Tersimpan Live di Browser' : 'Perubahan Belum Disimpan'}</span>`;
    }
}

function renderAllViews() {
    renderOverview();
    populateHeroForm();
    populateStatsForm();
    populateAboutForm();
    renderSkillsManager();
    renderProjectsTable();
    populateNlpForm();
    renderCertificationsManager();
    populateContactForm();
    populateFooterForm();
    renderExportCode();
}

/* ==========================================================================
   3. NAVIGATION & TABS
   ========================================================================== */
function initNavigation() {
    const links = document.querySelectorAll('.sidebar-link[data-tab]');
    const panes = document.querySelectorAll('.tab-pane');
    const mobileToggle = document.getElementById('mobile-toggle');
    const sidebar = document.querySelector('.admin-sidebar');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = link.getAttribute('data-tab');

            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            panes.forEach(pane => {
                if (pane.id === `tab-${tabId}`) {
                    pane.classList.add('active');
                } else {
                    pane.classList.remove('active');
                }
            });

            activeTab = tabId;
            if (window.innerWidth <= 900 && sidebar) {
                sidebar.classList.remove('open');
            }
        });
    });

    if (mobileToggle && sidebar) {
        mobileToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }
}

/* ==========================================================================
   4. TAB 1: OVERVIEW
   ========================================================================== */
function renderOverview() {
    const countProj = document.getElementById('ov-count-projects');
    const countSkills = document.getElementById('ov-count-skills');
    const countCerts = document.getElementById('ov-count-certs');
    const ovGpa = document.getElementById('ov-val-gpa');

    if (countProj) countProj.textContent = currentData.projects?.length || 0;
    
    let totalSkillItems = 0;
    if (currentData.skills) {
        currentData.skills.forEach(c => totalSkillItems += (c.items?.length || 0));
    }
    if (countSkills) countSkills.textContent = totalSkillItems;
    if (countCerts) countCerts.textContent = currentData.certifications?.length || 0;
    if (ovGpa) ovGpa.textContent = currentData.about?.gpa || currentData.personal?.gpa || '3.88';

    const tbody = document.getElementById('ov-recent-projects-tbody');
    if (tbody && currentData.projects) {
        tbody.innerHTML = currentData.projects.slice(0, 3).map(p => `
            <tr>
                <td><img src="${p.image || 'assets/images/project-nlp.jpg'}" class="table-thumb" alt="" /></td>
                <td><strong>${p.title}</strong></td>
                <td><span class="badge-tag">${p.categoryName || p.category}</span></td>
                <td>${(p.metrics && p.metrics[0]) ? p.metrics[0].val : '-'}</td>
            </tr>
        `).join('');
    }
}

/* ==========================================================================
   5. TAB 2: HERO & BERANDA
   ========================================================================== */
function populateHeroForm() {
    const h = currentData.hero || {};
    const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el && val !== undefined) el.value = val;
    };

    setVal('h-name', h.name || currentData.personal?.name);
    setVal('h-status-pill', h.statusPill);
    setVal('h-bio', h.bio || currentData.personal?.bio);
    setVal('h-roles', (h.roles || currentData.roles || []).join('\n'));
    setVal('h-cta-prim-text', h.ctaPrimaryText);
    setVal('h-cta-prim-link', h.ctaPrimaryLink);
    setVal('h-cta-sec-text', h.ctaSecondaryText);
    setVal('h-cta-sec-link', h.ctaSecondaryLink);
    setVal('h-profile-img', h.profileImage);
}

function initHeroForm() {
    const form = document.getElementById('form-hero-editor');
    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            const rolesText = document.getElementById('h-roles').value.trim();
            const roles = rolesText ? rolesText.split('\n').map(r => r.trim()).filter(r => r.length > 0) : [];

            currentData.hero = {
                ...currentData.hero,
                name: document.getElementById('h-name').value,
                statusPill: document.getElementById('h-status-pill').value,
                roles: roles,
                bio: document.getElementById('h-bio').value,
                ctaPrimaryText: document.getElementById('h-cta-prim-text').value,
                ctaPrimaryLink: document.getElementById('h-cta-prim-link').value,
                ctaSecondaryText: document.getElementById('h-cta-sec-text').value,
                ctaSecondaryLink: document.getElementById('h-cta-sec-link').value,
                profileImage: document.getElementById('h-profile-img').value || 'assets/images/profile.jpg'
            };

            saveData(true);
        };
    }
}

/* ==========================================================================
   6. TAB 3: STATS
   ========================================================================== */
function populateStatsForm() {
    const stats = currentData.stats || [];
    const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el && val !== undefined) el.value = val;
    };

    stats.forEach((st, idx) => {
        const num = idx + 1;
        setVal(`st-${num}-val`, st.value);
        setVal(`st-${num}-suf`, st.suffix);
        setVal(`st-${num}-lbl`, st.label);
    });
}

function initStatsForm() {
    const form = document.getElementById('form-stats-editor');
    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            const stats = [];
            for (let i = 1; i <= 4; i++) {
                stats.push({
                    value: document.getElementById(`st-${i}-val`).value.trim(),
                    suffix: document.getElementById(`st-${i}-suf`).value.trim(),
                    label: document.getElementById(`st-${i}-lbl`).value.trim()
                });
            }
            currentData.stats = stats;
            saveData(true);
        };
    }
}

/* ==========================================================================
   7. TAB 4: ABOUT, EDUCATION & COMPETENCIES
   ========================================================================== */
function populateAboutForm() {
    const a = currentData.about || {};
    const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el && val !== undefined) el.value = val;
    };

    setVal('ab-badge', a.sectionBadge);
    setVal('ab-title', a.sectionTitle);
    setVal('ab-desc', a.sectionDesc);
    setVal('ab-institution', a.institution);
    setVal('ab-degree', a.degree);
    setVal('ab-gpa', a.gpa);
    setVal('ab-period', a.period);
    setVal('ab-courses', (a.courses || []).join('\n'));
    setVal('ab-story', a.story);

    const comps = a.competencies || [];
    for (let i = 1; i <= 4; i++) {
        const c = comps[i - 1] || {};
        setVal(`comp-${i}-title`, c.title);
        setVal(`comp-${i}-desc`, c.desc);
    }
}

function initAboutForm() {
    const form = document.getElementById('form-about-editor');
    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            const coursesText = document.getElementById('ab-courses').value.trim();
            const courses = coursesText ? coursesText.split('\n').map(c => c.trim()).filter(c => c.length > 0) : [];

            const competencies = [];
            for (let i = 1; i <= 4; i++) {
                const title = document.getElementById(`comp-${i}-title`).value.trim();
                const desc = document.getElementById(`comp-${i}-desc`).value.trim();
                if (title) competencies.push({ title, desc });
            }

            currentData.about = {
                ...currentData.about,
                sectionBadge: document.getElementById('ab-badge').value,
                sectionTitle: document.getElementById('ab-title').value,
                sectionDesc: document.getElementById('ab-desc').value,
                institution: document.getElementById('ab-institution').value,
                degree: document.getElementById('ab-degree').value,
                gpa: document.getElementById('ab-gpa').value,
                period: document.getElementById('ab-period').value,
                courses: courses,
                story: document.getElementById('ab-story').value,
                competencies: competencies
            };

            saveData(true);
        };
    }
}

/* ==========================================================================
   8. TAB 5: SKILLS MATRIX (FULL CRUD)
   ========================================================================== */
let editingCategoryIdx = null;
let targetCatIdxForSkill = null;
let editingSkillIdx = null;

function renderSkillsManager() {
    const container = document.getElementById('skills-manager-list');
    if (!container || !currentData.skills) return;

    container.innerHTML = currentData.skills.map((cat, catIdx) => `
        <div class="adm-card" style="margin-bottom: 1.5rem;">
            <div class="adm-card-header">
                <div>
                    <h3 class="adm-card-title">${cat.category}</h3>
                    <p style="font-size: 0.8rem; color: var(--adm-text-dim);">${cat.description || ''}</p>
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    <button type="button" class="btn-adm btn-adm-secondary btn-adm-sm" onclick="openCategoryEditor(${catIdx})">Edit Kategori</button>
                    <button type="button" class="btn-adm btn-adm-primary btn-adm-sm" onclick="openSkillItemEditor(${catIdx}, null)">+ Tambah Skill</button>
                    <button type="button" class="btn-adm btn-adm-rose btn-adm-sm" onclick="deleteCategory(${catIdx})">Hapus Kategori</button>
                </div>
            </div>

            <div>
                ${(cat.items || []).map((skill, skillIdx) => `
                    <div style="padding: 0.85rem 0; border-bottom: 1px solid var(--adm-border); display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap;">
                        <div>
                            <strong style="font-size: 0.95rem;">${skill.name}</strong>
                            <span class="badge-tag" style="margin-left: 0.5rem;">${skill.status || 'Mahir'}</span>
                            <div style="font-size: 0.78rem; color: var(--adm-text-dim); margin-top: 0.3rem;">
                                Tags: ${(skill.tags || []).join(', ')}
                            </div>
                        </div>
                        <div class="table-actions">
                            <button type="button" class="btn-adm btn-adm-secondary btn-adm-sm" onclick="openSkillItemEditor(${catIdx}, ${skillIdx})">Edit</button>
                            <button type="button" class="btn-adm btn-adm-rose btn-adm-sm" onclick="deleteSkillItem(${catIdx}, ${skillIdx})">Hapus</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

function openCategoryEditor(catIdx = null) {
    editingCategoryIdx = catIdx;
    const title = document.getElementById('modal-cat-title');
    const nameInput = document.getElementById('cat-name-input');
    const descInput = document.getElementById('cat-desc-input');

    if (catIdx !== null && currentData.skills[catIdx]) {
        title.textContent = 'Edit Kategori Keahlian';
        nameInput.value = currentData.skills[catIdx].category;
        descInput.value = currentData.skills[catIdx].description || '';
    } else {
        title.textContent = 'Tambah Kategori Keahlian Baru';
        nameInput.value = '';
        descInput.value = '';
    }

    openModal('modal-category-editor');
}

function initCategoryForm() {
    const form = document.getElementById('form-category-editor');
    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            const name = document.getElementById('cat-name-input').value.trim();
            const desc = document.getElementById('cat-desc-input').value.trim();

            if (editingCategoryIdx !== null && currentData.skills[editingCategoryIdx]) {
                currentData.skills[editingCategoryIdx].category = name;
                currentData.skills[editingCategoryIdx].description = desc;
            } else {
                currentData.skills.push({
                    id: `cat-${Date.now()}`,
                    category: name,
                    description: desc,
                    items: []
                });
            }

            saveData(true);
            closeModal('modal-category-editor');
        };
    }
}

function deleteCategory(catIdx) {
    if (!confirm('Apakah Anda yakin ingin menghapus seluruh kategori keahlian ini beserta isinya?')) return;
    currentData.skills.splice(catIdx, 1);
    saveData(true);
}

function openSkillItemEditor(catIdx, skillIdx = null) {
    targetCatIdxForSkill = catIdx;
    editingSkillIdx = skillIdx;
    const title = document.getElementById('modal-skill-item-title');
    const nameInput = document.getElementById('sk-name-input');
    const statusInput = document.getElementById('sk-status-input');
    const tagsInput = document.getElementById('sk-tags-input');

    if (skillIdx !== null && currentData.skills[catIdx]?.items[skillIdx]) {
        title.textContent = 'Edit Skill Item';
        const s = currentData.skills[catIdx].items[skillIdx];
        nameInput.value = s.name;
        statusInput.value = s.status || '';
        tagsInput.value = (s.tags || []).join(', ');
    } else {
        title.textContent = 'Tambah Skill Item Baru';
        nameInput.value = '';
        statusInput.value = 'Utama';
        tagsInput.value = '';
    }

    openModal('modal-skill-item-editor');
}

function initSkillItemForm() {
    const form = document.getElementById('form-skill-item-editor');
    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            const name = document.getElementById('sk-name-input').value.trim();
            const status = document.getElementById('sk-status-input').value.trim();
            const tagsText = document.getElementById('sk-tags-input').value.trim();
            const tags = tagsText ? tagsText.split(',').map(t => t.trim()).filter(t => t.length > 0) : [];

            const skillObj = { name, status, tags };

            if (editingSkillIdx !== null && currentData.skills[targetCatIdxForSkill]?.items[editingSkillIdx]) {
                currentData.skills[targetCatIdxForSkill].items[editingSkillIdx] = skillObj;
            } else {
                if (!currentData.skills[targetCatIdxForSkill].items) currentData.skills[targetCatIdxForSkill].items = [];
                currentData.skills[targetCatIdxForSkill].items.push(skillObj);
            }

            saveData(true);
            closeModal('modal-skill-item-editor');
        };
    }
}

function deleteSkillItem(catIdx, skillIdx) {
    if (!confirm('Hapus skill ini?')) return;
    currentData.skills[catIdx].items.splice(skillIdx, 1);
    saveData(true);
}

/* ==========================================================================
   9. TAB 6: PROJECTS (CRUD)
   ========================================================================== */
let editingProjectId = null;

function renderProjectsTable(query = '') {
    const tbody = document.getElementById('projects-table-tbody');
    if (!tbody || !currentData.projects) return;

    let list = currentData.projects;
    if (query) {
        list = list.filter(p => p.title.toLowerCase().includes(query) || (p.categoryName && p.categoryName.toLowerCase().includes(query)));
    }

    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--adm-text-dim); padding: 2rem;">Tidak ada proyek ditemukan.</td></tr>`;
        return;
    }

    tbody.innerHTML = list.map(p => `
        <tr>
            <td><img src="${p.image || 'assets/images/project-nlp.jpg'}" class="table-thumb" alt="" /></td>
            <td>
                <strong>${p.title}</strong>
                <div style="font-size: 0.75rem; color: var(--adm-text-dim);">${p.subtitle || ''}</div>
            </td>
            <td><span class="badge-tag">${p.categoryName || p.category}</span></td>
            <td>
                <span style="font-size: 0.8rem; color: var(--accent-cyan); font-weight: 600;">
                    ${(p.metrics && p.metrics[0]) ? `${p.metrics[0].val} (${p.metrics[0].label})` : '-'}
                </span>
            </td>
            <td>
                <div class="table-actions">
                    <button type="button" class="btn-adm btn-adm-secondary btn-adm-sm" onclick="openProjectEditor('${p.id}')">Edit</button>
                    <button type="button" class="btn-adm btn-adm-rose btn-adm-sm" onclick="deleteProject('${p.id}')">Hapus</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function openProjectEditor(projectId = null) {
    editingProjectId = projectId;
    const modalTitle = document.getElementById('modal-project-title');
    const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.value = val || '';
    };

    if (projectId) {
        modalTitle.textContent = 'Edit Data Proyek';
        const p = currentData.projects.find(x => x.id === projectId);
        if (!p) return;

        setVal('proj-title', p.title);
        setVal('proj-subtitle', p.subtitle);
        setVal('proj-category', p.category);
        setVal('proj-badge', p.badge);
        setVal('proj-image', p.image);
        setVal('proj-overview', p.overview);
        setVal('proj-problem', p.details?.problem);
        setVal('proj-solution', p.details?.solution);
        setVal('proj-impact', p.details?.impact);
        setVal('proj-highlights', (p.highlights || []).join('\n'));
        setVal('proj-techstack', (p.techStack || []).join(', '));
        setVal('proj-github', p.links?.github);

        setVal('proj-m1-val', p.metrics?.[0]?.val);
        setVal('proj-m1-lbl', p.metrics?.[0]?.label);
        setVal('proj-m2-val', p.metrics?.[1]?.val);
        setVal('proj-m2-lbl', p.metrics?.[1]?.label);
        setVal('proj-m3-val', p.metrics?.[2]?.val);
        setVal('proj-m3-lbl', p.metrics?.[2]?.label);
    } else {
        modalTitle.textContent = 'Tambah Proyek Baru';
        document.getElementById('form-project-editor').reset();
    }

    openModal('modal-project-editor');
}

function initProjectForm() {
    const btnAdd = document.getElementById('btn-add-project');
    if (btnAdd) btnAdd.addEventListener('click', () => openProjectEditor(null));

    const searchInput = document.getElementById('proj-search-input');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            renderProjectsTable(searchInput.value.trim().toLowerCase());
        });
    }

    const form = document.getElementById('form-project-editor');
    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            const catSelect = document.getElementById('proj-category');
            const catVal = catSelect.value;
            const catName = catSelect.options[catSelect.selectedIndex].text;

            const highlightsText = document.getElementById('proj-highlights').value.trim();
            const highlights = highlightsText ? highlightsText.split('\n').map(h => h.trim()).filter(h => h.length > 0) : [];

            const techText = document.getElementById('proj-techstack').value.trim();
            const techStack = techText ? techText.split(',').map(t => t.trim()).filter(t => t.length > 0) : [];

            const metrics = [];
            const m1Val = document.getElementById('proj-m1-val').value.trim();
            const m1Lbl = document.getElementById('proj-m1-lbl').value.trim();
            if (m1Val) metrics.push({ val: m1Val, label: m1Lbl || 'Metrik 1' });

            const m2Val = document.getElementById('proj-m2-val').value.trim();
            const m2Lbl = document.getElementById('proj-m2-lbl').value.trim();
            if (m2Val) metrics.push({ val: m2Val, label: m2Lbl || 'Metrik 2' });

            const m3Val = document.getElementById('proj-m3-val').value.trim();
            const m3Lbl = document.getElementById('proj-m3-lbl').value.trim();
            if (m3Val) metrics.push({ val: m3Val, label: m3Lbl || 'Metrik 3' });

            const projObj = {
                id: editingProjectId || `project-${Date.now()}`,
                title: document.getElementById('proj-title').value,
                subtitle: document.getElementById('proj-subtitle').value,
                category: catVal,
                categoryName: catName,
                featured: true,
                badge: document.getElementById('proj-badge').value || 'Studi Kasus',
                image: document.getElementById('proj-image').value || 'assets/images/project-nlp.jpg',
                overview: document.getElementById('proj-overview').value,
                highlights: highlights,
                techStack: techStack,
                metrics: metrics,
                details: {
                    problem: document.getElementById('proj-problem').value,
                    solution: document.getElementById('proj-solution').value,
                    impact: document.getElementById('proj-impact').value
                },
                links: {
                    github: document.getElementById('proj-github').value || 'https://github.com/KhairulRaihan',
                    demo: null
                }
            };

            if (editingProjectId) {
                const idx = currentData.projects.findIndex(p => p.id === editingProjectId);
                if (idx !== -1) currentData.projects[idx] = projObj;
            } else {
                if (!currentData.projects) currentData.projects = [];
                currentData.projects.unshift(projObj);
            }

            saveData(true);
            closeModal('modal-project-editor');
        };
    }
}

function deleteProject(projectId) {
    if (!confirm('Apakah Anda yakin ingin menghapus proyek ini?')) return;
    currentData.projects = currentData.projects.filter(p => p.id !== projectId);
    saveData(true);
}

/* ==========================================================================
   10. TAB 7: NLP RESEARCH CONSOLE DEMO
   ========================================================================== */
function populateNlpForm() {
    const n = currentData.nlpDemo || {};
    const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el && val !== undefined) el.value = val;
    };

    setVal('nlp-badge-input', n.sectionBadge);
    setVal('nlp-title-input', n.sectionTitle);
    setVal('nlp-desc-input', n.sectionDesc);
    setVal('nlp-console-title-input', n.consoleTitle);
    setVal('nlp-console-subtitle-input', n.consoleSubtitle);
    setVal('nlp-console-badge-input', n.consoleBadge);

    renderNlpChipsEditor();
}

function renderNlpChipsEditor() {
    const container = document.getElementById('nlp-chips-editor-list');
    if (!container || !currentData.nlpDemo?.sampleChips) return;

    container.innerHTML = currentData.nlpDemo.sampleChips.map((chip, idx) => `
        <div style="padding: 0.75rem; background: var(--adm-input); border-radius: var(--radius-md); margin-bottom: 0.75rem; border: 1px solid var(--adm-border);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                <span style="font-weight: 600; font-size: 0.85rem;">Contoh Ulasan #${idx + 1}</span>
                <button type="button" class="btn-adm btn-adm-rose btn-adm-sm" onclick="deleteNlpChip(${idx})">Hapus</button>
            </div>
            <input type="text" class="form-input nlp-chip-label" value="${chip.label}" placeholder="Label tombol (e.g. Contoh Positif)" style="margin-bottom: 0.35rem;" />
            <textarea class="form-textarea nlp-chip-text" rows="2" placeholder="Teks ulasan...">${chip.text}</textarea>
        </div>
    `).join('');
}

function deleteNlpChip(idx) {
    if (currentData.nlpDemo?.sampleChips) {
        currentData.nlpDemo.sampleChips.splice(idx, 1);
        renderNlpChipsEditor();
    }
}

function initNlpForm() {
    const form = document.getElementById('form-nlp-editor');
    const btnAddChip = document.getElementById('btn-add-nlp-chip');

    if (btnAddChip) {
        btnAddChip.addEventListener('click', () => {
            if (!currentData.nlpDemo) currentData.nlpDemo = {};
            if (!currentData.nlpDemo.sampleChips) currentData.nlpDemo.sampleChips = [];
            currentData.nlpDemo.sampleChips.push({
                label: 'Contoh Baru',
                text: 'Teks ulasan baru untuk diuji di simulator sentimen.'
            });
            renderNlpChipsEditor();
        });
    }

    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            const chipLabels = document.querySelectorAll('.nlp-chip-label');
            const chipTexts = document.querySelectorAll('.nlp-chip-text');

            const chips = [];
            chipLabels.forEach((lblEl, i) => {
                const label = lblEl.value.trim();
                const text = chipTexts[i]?.value.trim() || '';
                if (label && text) chips.push({ label, text });
            });

            currentData.nlpDemo = {
                ...currentData.nlpDemo,
                sectionBadge: document.getElementById('nlp-badge-input').value,
                sectionTitle: document.getElementById('nlp-title-input').value,
                sectionDesc: document.getElementById('nlp-desc-input').value,
                consoleTitle: document.getElementById('nlp-console-title-input').value,
                consoleSubtitle: document.getElementById('nlp-console-subtitle-input').value,
                consoleBadge: document.getElementById('nlp-console-badge-input').value,
                sampleChips: chips
            };

            saveData(true);
        };
    }
}

/* ==========================================================================
   11. TAB 8: CERTIFICATIONS (CRUD)
   ========================================================================== */
let editingCertIdx = null;

function renderCertificationsManager() {
    const tbody = document.getElementById('certs-table-tbody');
    if (!tbody || !currentData.certifications) return;

    tbody.innerHTML = currentData.certifications.map((cert, idx) => `
        <tr>
            <td><strong>${cert.title}</strong></td>
            <td><span style="color: var(--accent-cyan); font-weight: 600;">${cert.issuer}</span></td>
            <td>${cert.date}</td>
            <td>
                <div class="table-actions">
                    <button type="button" class="btn-adm btn-adm-secondary btn-adm-sm" onclick="openCertEditor(${idx})">Edit</button>
                    <button type="button" class="btn-adm btn-adm-rose btn-adm-sm" onclick="deleteCert(${idx})">Hapus</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function openCertEditor(idx = null) {
    editingCertIdx = idx;
    const modalTitle = document.getElementById('modal-cert-title');
    const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.value = val || '';
    };

    if (idx !== null && currentData.certifications[idx]) {
        modalTitle.textContent = 'Edit Sertifikasi';
        const c = currentData.certifications[idx];
        setVal('cert-title', c.title);
        setVal('cert-issuer', c.issuer);
        setVal('cert-date', c.date);
        setVal('cert-desc', c.description);
    } else {
        modalTitle.textContent = 'Tambah Sertifikasi Baru';
        document.getElementById('form-cert-editor').reset();
    }

    openModal('modal-cert-editor');
}

function initCertForm() {
    const btnAdd = document.getElementById('btn-add-cert');
    if (btnAdd) btnAdd.addEventListener('click', () => openCertEditor(null));

    const form = document.getElementById('form-cert-editor');
    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            const certObj = {
                title: document.getElementById('cert-title').value,
                issuer: document.getElementById('cert-issuer').value,
                date: document.getElementById('cert-date').value,
                description: document.getElementById('cert-desc').value
            };

            if (editingCertIdx !== null) {
                currentData.certifications[editingCertIdx] = certObj;
            } else {
                if (!currentData.certifications) currentData.certifications = [];
                currentData.certifications.push(certObj);
            }

            saveData(true);
            closeModal('modal-cert-editor');
        };
    }
}

function deleteCert(idx) {
    if (!confirm('Hapus sertifikasi ini?')) return;
    currentData.certifications.splice(idx, 1);
    saveData(true);
}

/* ==========================================================================
   12. TAB 9: CONTACT & SOCIALS
   ========================================================================== */
function populateContactForm() {
    const c = currentData.contact || {};
    const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el && val !== undefined) el.value = val;
    };

    setVal('ct-badge', c.sectionBadge);
    setVal('ct-title', c.sectionTitle);
    setVal('ct-desc', c.sectionDesc);
    setVal('ct-email', c.email || currentData.personal?.email);
    setVal('ct-whatsapp', c.whatsapp || currentData.personal?.whatsapp);
    setVal('ct-location', c.location || currentData.personal?.location);
    setVal('ct-github', c.github || currentData.personal?.socials?.github);
    setVal('ct-linkedin', c.linkedin || currentData.personal?.socials?.linkedin);
    setVal('ct-cvpath', c.cvPath || currentData.personal?.cvPath);
}

function initContactForm() {
    const form = document.getElementById('form-contact-editor');
    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            const rawWa = document.getElementById('ct-whatsapp').value;
            const waNum = rawWa.replace(/\D/g, '');

            currentData.contact = {
                ...currentData.contact,
                sectionBadge: document.getElementById('ct-badge').value,
                sectionTitle: document.getElementById('ct-title').value,
                sectionDesc: document.getElementById('ct-desc').value,
                email: document.getElementById('ct-email').value,
                whatsapp: rawWa,
                whatsappNum: waNum,
                location: document.getElementById('ct-location').value,
                github: document.getElementById('ct-github').value,
                linkedin: document.getElementById('ct-linkedin').value,
                linkedinDisplay: document.getElementById('ct-linkedin').value.replace(/^https?:\/\/(www\.)?/, ''),
                cvPath: document.getElementById('ct-cvpath').value || 'assets/docs/Khairul_Raihan_Hidayat_CV.docx'
            };

            saveData(true);
        };
    }
}

/* ==========================================================================
   13. TAB 10: FOOTER & BRANDING
   ========================================================================== */
function populateFooterForm() {
    const f = currentData.footer || {};
    const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el && val !== undefined) el.value = val;
    };

    setVal('ft-title', f.title || currentData.hero?.name || currentData.personal?.name);
    setVal('ft-subtitle', f.subtitle);
    setVal('ft-copyright', f.copyright);
}

function initFooterForm() {
    const form = document.getElementById('form-footer-editor');
    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            currentData.footer = {
                ...currentData.footer,
                title: document.getElementById('ft-title').value,
                subtitle: document.getElementById('ft-subtitle').value,
                copyright: document.getElementById('ft-copyright').value
            };

            saveData(true);
        };
    }
}

/* ==========================================================================
   14. TAB 11: EXPORT, BACKUP & RESET
   ========================================================================== */
function initExportBackup() {
    const btnDownloadJs = document.getElementById('btn-download-datajs');
    const btnDownloadJsTab = document.getElementById('btn-download-datajs-tab');
    const btnCopyJs = document.getElementById('btn-copy-datajs');
    const btnExportJson = document.getElementById('btn-export-json');
    const btnImportJson = document.getElementById('btn-import-json');
    const fileImportInput = document.getElementById('file-import-json');
    const btnResetDefault = document.getElementById('btn-reset-default');

    if (btnDownloadJs) btnDownloadJs.addEventListener('click', downloadDataJs);
    if (btnDownloadJsTab) btnDownloadJsTab.addEventListener('click', downloadDataJs);

    if (btnCopyJs) {
        btnCopyJs.addEventListener('click', () => {
            const code = generateDataJsCode();
            navigator.clipboard.writeText(code).then(() => {
                showToast('Kode data.js berhasil disalin! 📋');
            });
        });
    }

    if (btnExportJson) {
        btnExportJson.addEventListener('click', () => {
            const jsonStr = JSON.stringify(currentData, null, 2);
            const blob = new Blob([jsonStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `portfolio_backup_${new Date().toISOString().slice(0, 10)}.json`;
            a.click();
            URL.revokeObjectURL(url);
            showToast('Backup JSON berhasil diunduh! 📦');
        });
    }

    if (btnImportJson && fileImportInput) {
        btnImportJson.addEventListener('click', () => fileImportInput.click());
        fileImportInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const parsed = JSON.parse(event.target.result);
                    if (parsed && (parsed.hero || parsed.personal) && parsed.projects) {
                        currentData = parsed;
                        saveData(true);
                        showToast('Data berhasil diimpor dari berkas JSON! 🎉');
                    } else {
                        showToast('Format berkas JSON tidak valid! ❌');
                    }
                } catch (err) {
                    showToast('Gagal membaca berkas JSON! ❌');
                }
            };
            reader.readAsText(file);
        });
    }

    if (btnResetDefault) {
        btnResetDefault.addEventListener('click', () => {
            if (!confirm('Kembalikan semua data ke pengaturan awal (default)? Semua modifikasi lokal akan dihapus.')) return;
            localStorage.removeItem('customPortfolioData');
            loadData();
            renderAllViews();
            showToast('Data telah direset ke setelan awal! 🔄');
        });
    }

    renderExportCode();
}

function generateDataJsCode() {
    return `/**\n * Master Portfolio Data Configuration for Khairul Raihan Hidayat\n * Generated automatically from Admin CMS\n */\n\nconst portfolioData = ${JSON.stringify(currentData, null, 4)};\n\nif (typeof module !== 'undefined' && module.exports) {\n    module.exports = portfolioData;\n}\n`;
}

function downloadDataJs() {
    const code = generateDataJsCode();
    const blob = new Blob([code], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.js';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Berkas data.js berhasil diunduh! Silakan timpa ke folder js/data.js 🚀');
}

function renderExportCode() {
    const box = document.getElementById('datajs-code-preview');
    if (box) {
        const code = generateDataJsCode();
        box.textContent = code.slice(0, 500) + '\n... (tekan Download data.js untuk mengunduh berkas lengkap)';
    }
}

/* ==========================================================================
   15. INITIALIZE ALL FORMS
   ========================================================================== */
function initForms() {
    initHeroForm();
    initStatsForm();
    initAboutForm();
    initCategoryForm();
    initSkillItemForm();
    initProjectForm();
    initNlpForm();
    initCertForm();
    initContactForm();
    initFooterForm();
}

/* ==========================================================================
   16. MODAL & TOAST HELPERS
   ========================================================================== */
function openModal(id) {
    const el = document.getElementById(id);
    if (el) {
        el.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(id) {
    const el = document.getElementById(id);
    if (el) {
        el.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

document.querySelectorAll('.adm-modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(modal.id);
    });
});

document.querySelectorAll('.adm-modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
        const modal = btn.closest('.adm-modal-overlay');
        if (modal) closeModal(modal.id);
    });
});

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
