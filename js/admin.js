/**
 * Admin CMS Dashboard Logic
 * Khairul Raihan Hidayat - Portfolio Management System
 */

// Global State
let currentData = {};
let activeTab = 'overview';

document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    loadData();
    initNavigation();
    initOverview();
    initPersonalForm();
    initProjectsManager();
    initSkillsManager();
    initCertificationsManager();
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

    // Default PIN: 1234
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
            currentData = { personal: {}, projects: [], skills: [], certifications: [], education: [] };
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
        badge.innerHTML = `<span class="sync-dot"></span><span>${synced ? 'Tersimpan di Browser' : 'Perubahan Belum Disimpan'}</span>`;
    }
}

function renderAllViews() {
    initOverview();
    initPersonalForm();
    renderProjectsTable();
    renderSkillsManager();
    renderCertificationsManager();
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
   4. TAB: OVERVIEW & SUMMARY
   ========================================================================== */
function initOverview() {
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
    if (ovGpa) ovGpa.textContent = currentData.personal?.gpa || '3.88';

    // Populate quick recent table
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
   5. TAB: PERSONAL INFO & CONTACT
   ========================================================================== */
function initPersonalForm() {
    const p = currentData.personal || {};
    
    const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el && val !== undefined) el.value = val;
    };

    setVal('p-name', p.name);
    setVal('p-nickname', p.nickname);
    setVal('p-role', p.role);
    setVal('p-tagline', p.tagline);
    setVal('p-bio', p.bio);
    setVal('p-gpa', p.gpa);
    setVal('p-degree', p.degree);
    setVal('p-university', p.university);
    setVal('p-gradyear', p.graduationYear);
    setVal('p-email', p.email);
    setVal('p-whatsapp', p.whatsapp);
    setVal('p-location', p.location);
    setVal('p-github', p.socials?.github);
    setVal('p-linkedin', p.socials?.linkedin);

    if (currentData.roles && Array.isArray(currentData.roles)) {
        setVal('p-typewriter-roles', currentData.roles.join('\n'));
    } else {
        setVal('p-typewriter-roles', "Data Science Enthusiast\nNLP & Machine Learning Specialist\nBusiness Intelligence & BI Analyst\nFresh Graduate S.Kom (IPK 3.88)");
    }

    const form = document.getElementById('form-personal-info');
    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            currentData.personal = {
                ...currentData.personal,
                name: document.getElementById('p-name').value,
                nickname: document.getElementById('p-nickname').value,
                role: document.getElementById('p-role').value,
                tagline: document.getElementById('p-tagline').value,
                bio: document.getElementById('p-bio').value,
                gpa: document.getElementById('p-gpa').value,
                degree: document.getElementById('p-degree').value,
                university: document.getElementById('p-university').value,
                graduationYear: document.getElementById('p-gradyear').value,
                email: document.getElementById('p-email').value,
                whatsapp: document.getElementById('p-whatsapp').value,
                location: document.getElementById('p-location').value,
                cvPath: currentData.personal?.cvPath || "assets/docs/Khairul_Raihan_Hidayat_CV.docx",
                socials: {
                    github: document.getElementById('p-github').value,
                    linkedin: document.getElementById('p-linkedin').value,
                    email: `mailto:${document.getElementById('p-email').value}`,
                    whatsapp: `https://wa.me/${document.getElementById('p-whatsapp').value.replace(/\D/g, '')}`
                }
            };

            const rolesText = document.getElementById('p-typewriter-roles').value.trim();
            if (rolesText) {
                currentData.roles = rolesText.split('\n').map(r => r.trim()).filter(r => r.length > 0);
            }

            saveData(true);
        };
    }
}

/* ==========================================================================
   6. TAB: PROJECTS MANAGER (CRUD)
   ========================================================================== */
let editingProjectId = null;

function initProjectsManager() {
    const btnAdd = document.getElementById('btn-add-project');
    if (btnAdd) {
        btnAdd.addEventListener('click', () => openProjectEditor(null));
    }

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
            saveProjectForm();
        };
    }

    renderProjectsTable();
}

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
                    <button class="btn-adm btn-adm-secondary btn-adm-sm" onclick="openProjectEditor('${p.id}')">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        Edit
                    </button>
                    <button class="btn-adm btn-adm-rose btn-adm-sm" onclick="deleteProject('${p.id}')">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        Hapus
                    </button>
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

        // Metrics
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

function saveProjectForm() {
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
        badge: document.getElementById('proj-badge').value || 'Project',
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
        currentData.projects.unshift(projObj);
    }

    saveData(true);
    closeModal('modal-project-editor');
}

function deleteProject(projectId) {
    if (!confirm('Apakah Anda yakin ingin menghapus proyek ini?')) return;
    currentData.projects = currentData.projects.filter(p => p.id !== projectId);
    saveData(true);
}

/* ==========================================================================
   7. TAB: SKILLS MANAGER
   ========================================================================== */
function initSkillsManager() {
    renderSkillsManager();
}

function renderSkillsManager() {
    const container = document.getElementById('skills-manager-list');
    if (!container || !currentData.skills) return;

    container.innerHTML = currentData.skills.map((cat, catIdx) => `
        <div class="adm-card" style="margin-bottom: 1.5rem;">
            <div class="adm-card-header">
                <h3 class="adm-card-title">${cat.category}</h3>
                <span style="font-size: 0.8rem; color: var(--adm-text-dim);">${cat.description || ''}</span>
            </div>
            <div>
                ${cat.items.map((skill, skillIdx) => `
                    <div style="padding: 0.75rem 0; border-bottom: 1px solid var(--adm-border); display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap;">
                        <div style="flex-grow: 1; min-width: 200px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.3rem;">
                                <strong>${skill.name}</strong>
                                <span style="color: var(--accent-cyan); font-family: var(--font-mono);">${skill.level}%</span>
                            </div>
                            <input type="range" min="0" max="100" value="${skill.level}" style="width: 100%; accent-color: var(--accent-cyan);" onchange="updateSkillLevel(${catIdx}, ${skillIdx}, this.value)" />
                            <div style="font-size: 0.75rem; color: var(--adm-text-dim); margin-top: 0.2rem;">
                                Tags: ${(skill.tags || []).join(', ')}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

window.updateSkillLevel = function(catIdx, skillIdx, newLevel) {
    if (currentData.skills?.[catIdx]?.items?.[skillIdx]) {
        currentData.skills[catIdx].items[skillIdx].level = parseInt(newLevel, 10);
        saveData(false);
        renderSkillsManager();
    }
};

/* ==========================================================================
   8. TAB: CERTIFICATIONS MANAGER (CRUD)
   ========================================================================== */
let editingCertIdx = null;

function initCertificationsManager() {
    const btnAdd = document.getElementById('btn-add-cert');
    if (btnAdd) {
        btnAdd.addEventListener('click', () => openCertEditor(null));
    }

    const form = document.getElementById('form-cert-editor');
    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            saveCertForm();
        };
    }

    renderCertificationsManager();
}

function renderCertificationsManager() {
    const tbody = document.getElementById('certs-table-tbody');
    if (!tbody || !currentData.certifications) return;

    tbody.innerHTML = currentData.certifications.map((cert, idx) => `
        <tr>
            <td><strong>${cert.title}</strong></td>
            <td><span style="color: var(--accent-cyan); font-weight: 600;">${cert.issuer}</span></td>
            <td>${cert.date}</td>
            <td><span class="badge-tag" style="text-transform: capitalize;">${cert.badgeColor || 'cyan'}</span></td>
            <td>
                <div class="table-actions">
                    <button class="btn-adm btn-adm-secondary btn-adm-sm" onclick="openCertEditor(${idx})">Edit</button>
                    <button class="btn-adm btn-adm-rose btn-adm-sm" onclick="deleteCert(${idx})">Hapus</button>
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
        setVal('cert-color', c.badgeColor);
        setVal('cert-desc', c.description);
    } else {
        modalTitle.textContent = 'Tambah Sertifikasi Baru';
        document.getElementById('form-cert-editor').reset();
    }

    openModal('modal-cert-editor');
}

function saveCertForm() {
    const certObj = {
        title: document.getElementById('cert-title').value,
        issuer: document.getElementById('cert-issuer').value,
        date: document.getElementById('cert-date').value,
        badgeColor: document.getElementById('cert-color').value,
        icon: 'award',
        description: document.getElementById('cert-desc').value
    };

    if (editingCertIdx !== null) {
        currentData.certifications[editingCertIdx] = certObj;
    } else {
        currentData.certifications.push(certObj);
    }

    saveData(true);
    closeModal('modal-cert-editor');
}

function deleteCert(idx) {
    if (!confirm('Hapus sertifikasi ini?')) return;
    currentData.certifications.splice(idx, 1);
    saveData(true);
}

/* ==========================================================================
   9. TAB: EXPORT, BACKUP & RESET TO FACTORY
   ========================================================================== */
function initExportBackup() {
    const btnDownloadJs = document.getElementById('btn-download-datajs');
    const btnCopyJs = document.getElementById('btn-copy-datajs');
    const btnExportJson = document.getElementById('btn-export-json');
    const btnImportJson = document.getElementById('btn-import-json');
    const fileImportInput = document.getElementById('file-import-json');
    const btnResetDefault = document.getElementById('btn-reset-default');

    if (btnDownloadJs) {
        btnDownloadJs.addEventListener('click', downloadDataJs);
    }

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
                    if (parsed && parsed.personal && parsed.projects) {
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
            if (!confirm('Kembalikan semua data ke pengaturan awal (default)? Data kustom akan dihapus.')) return;
            localStorage.removeItem('customPortfolioData');
            loadData();
            renderAllViews();
            showToast('Data telah direset ke setelan awal pabrik! 🔄');
        });
    }

    renderExportCode();
}

function generateDataJsCode() {
    return `/**\n * Portfolio Data Configuration for Khairul Raihan Hidayat\n * Generated automatically from Admin CMS\n */\n\nconst portfolioData = ${JSON.stringify(currentData, null, 4)};\n\nif (typeof module !== 'undefined' && module.exports) {\n    module.exports = portfolioData;\n}\n`;
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
        box.textContent = code.slice(0, 500) + '\n... (tekan Download data.js untuk mengunduh versi lengkap)';
    }
}

/* ==========================================================================
   10. MODAL & TOAST HELPERS
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

// Global modal close clicks
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
