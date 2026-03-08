'use strict';
// ═══════════════════════════════════════════════════════════
// FEATURES 3 — Command Palette, Skeleton Loading,
//              PDF Export, Sortable Research Table
// ═══════════════════════════════════════════════════════════

// ─── 1. COMMAND PALETTE ──────────────────────────────────────
const CMD_COMMANDS = [
    // Navigation
    { icon: '📊', label: 'Go to Dashboard', cat: 'Navigate', action: () => navigateTo('dashboard') },
    { icon: '🏢', label: 'Go to Company Profile', cat: 'Navigate', action: () => navigateTo('profile') },
    { icon: '📁', label: 'Go to Data Ingestor', cat: 'Navigate', action: () => navigateTo('ingest') },
    { icon: '📈', label: 'Go to Analytics', cat: 'Navigate', action: () => navigateTo('analytics') },
    { icon: '🔍', label: 'Go to Research Agent', cat: 'Navigate', action: () => navigateTo('research') },
    { icon: '💡', label: 'Go to Primary Insights', cat: 'Navigate', action: () => navigateTo('insights') },
    { icon: '📋', label: 'Go to CAM Report', cat: 'Navigate', action: () => navigateTo('report') },
    // Actions
    { icon: '⚡', label: 'Load Sample Case (Apex Industrial)', cat: 'Action', action: () => loadDemo() },
    { icon: '🔄', label: 'Reset / New Appraisal', cat: 'Action', action: () => resetSession() },
    { icon: '🏦', label: 'Open Loan Calculator', cat: 'Action', action: () => openLoanModal() },
    { icon: '🧪', label: 'Open Stress Test', cat: 'Action', action: () => openStressModal() },
    { icon: '✨', label: 'Generate Full CAM', cat: 'Action', action: () => { navigateTo('report'); generateFullCAM(); } },
    { icon: '🔍', label: 'Run Research Agent', cat: 'Action', action: () => { navigateTo('research'); runResearch(); } },
    { icon: '📄', label: 'Export CAM as PDF', cat: 'Action', action: () => exportCAMPDF() },
    // Theme / UI
    { icon: '🌙', label: 'Toggle Dark / Light Mode', cat: 'UI', action: () => toggleTheme() },
    { icon: '☰', label: 'Toggle Sidebar', cat: 'UI', action: () => toggleSidebar() },
    { icon: '🎓', label: 'Start Onboarding Tour', cat: 'UI', action: () => startOnboarding() },
    // Switch cases
    { icon: '🏭', label: 'Switch Case → Sample (Apex Industrial)', cat: 'Cases', action: () => switchCase('apex', null) },
    { icon: '⚡', label: 'Switch Case → Bharat Electronics', cat: 'Cases', action: () => switchCase('bharat', null) },
];

let cmdActive = 0;
let cmdFiltered = CMD_COMMANDS;

function openCmdPalette() {
    document.getElementById('cmd-palette').classList.remove('hidden');
    const inp = document.getElementById('cmd-input');
    inp.value = '';
    cmdSearch('');
    setTimeout(() => inp.focus(), 60);
}
function closeCmdPalette() {
    document.getElementById('cmd-palette').classList.add('hidden');
}
function cmdSearch(q) {
    const s = q.trim().toLowerCase();
    cmdFiltered = s
        ? CMD_COMMANDS.filter(c => c.label.toLowerCase().includes(s) || c.cat.toLowerCase().includes(s))
        : CMD_COMMANDS;
    cmdActive = 0;
    renderCmdResults();
}
function renderCmdResults() {
    const el = document.getElementById('cmd-results');
    if (!cmdFiltered.length) {
        el.innerHTML = '<div class="cmd-empty">No commands found</div>';
        return;
    }
    let lastCat = '';
    el.innerHTML = cmdFiltered.map((c, i) => {
        const catHdr = c.cat !== lastCat ? `<div class="cmd-category">${(lastCat = c.cat)}</div>` : (lastCat = c.cat, '');
        return `${catHdr}<div class="cmd-item ${i === cmdActive ? 'active' : ''}" onclick="runCmd(${i})" onmouseover="cmdActive=${i};renderCmdResults()"><span class="cmd-item-icon">${c.icon}</span><span class="cmd-item-label">${c.label}</span><span class="cmd-item-cat">${c.cat}</span></div>`;
    }).join('');
}
function cmdKeyNav(e) {
    if (e.key === 'ArrowDown') { cmdActive = Math.min(cmdActive + 1, cmdFiltered.length - 1); renderCmdResults(); e.preventDefault(); }
    else if (e.key === 'ArrowUp') { cmdActive = Math.max(cmdActive - 1, 0); renderCmdResults(); e.preventDefault(); }
    else if (e.key === 'Enter') { runCmd(cmdActive); }
    else if (e.key === 'Escape') { closeCmdPalette(); }
}
function runCmd(i) {
    const cmd = cmdFiltered[i];
    if (!cmd) return;
    closeCmdPalette();
    setTimeout(() => cmd.action(), 80);
}

// ─── 2. SKELETON LOADING ─────────────────────────────────────
function showSkeleton(containerId, type = 'card', count = 3) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const skels = {
        card: `<div class="skeleton-card"><div class="skel-line w80"></div><div class="skel-line w60"></div><div class="skel-line w40"></div></div>`,
        row: `<div class="skeleton-row"><div class="skel-block w30"></div><div class="skel-block w50"></div><div class="skel-block w20"></div></div>`,
        chart: `<div class="skeleton-chart"><div class="skel-bars">${Array(5).fill('<div class="skel-bar"></div>').join('')}</div><div class="skel-line w60" style="margin:8px auto 0"></div></div>`,
    };
    el.innerHTML = Array(count).fill(skels[type] || skels.card).join('');
}

function showPageSkeleton(pageId) {
    if (pageId === 'analytics') {
        showSkeleton('analytics-content', 'chart', 4);
    } else if (pageId === 'research') {
        showSkeleton('research-results', 'card', 4);
    }
}

// ─── 3. PDF / PRINT EXPORT ───────────────────────────────────
function exportCAMPDF() {
    if (!state.reportReady) {
        toast('No Report', 'Generate the CAM first before exporting', 'warn');
        return;
    }
    // Inject ephemeral print styles to stamp company name + date
    let printHeader = document.getElementById('print-cam-header');
    if (!printHeader) {
        printHeader = document.createElement('div');
        printHeader.id = 'print-cam-header';
        printHeader.className = 'print-cam-header';
        document.getElementById('cam-full').prepend(printHeader);
    }
    const now = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
    printHeader.innerHTML = `
    <div class="print-hdr-logo">⚡ IntelliCredit</div>
    <div class="print-hdr-center"><strong>CREDIT APPRAISAL MEMORANDUM (CONFIDENTIAL)</strong></div>
    <div class="print-hdr-right">Date: ${now}</div>
    <div class="print-hdr-company">Borrower: ${state.company || 'Selected Company'}</div>`;

    navigateTo('report');
    setTimeout(() => window.print(), 300);
    toast('Printing…', 'Use "Save as PDF" in the print dialog', 'info', 4000);
}

// ─── 4. SORTABLE RESEARCH TABLE ──────────────────────────────
let researchView = 'cards'; // or 'table'
let sortCol = 'date';
let sortDir = 1;

function toggleResearchView(view, btn) {
    researchView = view;
    document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    if (view === 'table') renderResearchTable(state.researchItems, sortCol, sortDir);
    else renderResearchCards(state.researchItems);
}

function renderResearchTable(items, col = 'date', dir = 1) {
    if (!items || !items.length) return;
    sortCol = col; sortDir = dir;
    const sorted = [...items].sort((a, b) => {
        let av = a[col] || '', bv = b[col] || '';
        return dir * (av < bv ? -1 : av > bv ? 1 : 0);
    });
    const arrow = d => d === 1 ? '↑' : '↓';
    const th = (c, label) => `<th class="sortable-th ${col === c ? 'sorted' : ''}" onclick="renderResearchTable(state.researchItems,'${c}',sortCol==='${c}'?-sortDir:1)">${label} <span class="sort-arrow">${col === c ? arrow(dir) : '⇅'}</span></th>`;
    const doc = document.getElementById('research-results');
    doc.innerHTML = `
    <table class="research-table">
      <thead><tr>
        ${th('cat', 'Category')}
        ${th('title', 'Finding')}
        ${th('sentiment', 'Sentiment')}
        ${th('date', 'Date')}
        ${th('source', 'Source')}
      </tr></thead>
      <tbody>
        ${sorted.map(r => `<tr class="rt-row ${r.sentiment}" onclick="showResearchDetail('${r.id}')">
          <td><span class="card-category cat-${r.cat}">${r.cat.toUpperCase()}</span></td>
          <td class="rt-title"><span class="rt-icon">${r.icon}</span>${r.title}</td>
          <td><span class="sentiment-chip sentiment-${r.sentiment}">${r.sentiment === 'risk' ? '🔴 Risk' : r.sentiment === 'positive' ? '🟢 Positive' : '🟡 Neutral'}</span></td>
          <td class="rt-date">${r.date}</td>
          <td class="rt-source">${r.source}</td>
        </tr>`).join('')}
      </tbody>
    </table>`;
}

function showResearchDetail(id) {
    const item = (state.researchItems || DEMO.research).find(r => String(r.id) === String(id));
    if (!item) return;
    toast(item.title, item.desc, item.sentiment === 'risk' ? 'error' : item.sentiment === 'positive' ? 'success' : 'info', 6000);
}

// ─── Inject view-toggle into research toolbar on first use ───
function ensureResearchViewToggle() {
    if (document.getElementById('research-view-toggle')) return;
    const toolbar = document.querySelector('.research-toolbar');
    if (!toolbar) return;
    const tog = document.createElement('div');
    tog.id = 'research-view-toggle';
    tog.className = 'view-toggle';
    tog.innerHTML = `
    <button class="view-btn active" onclick="toggleResearchView('cards',this)" title="Card View">🃏 Cards</button>
    <button class="view-btn" onclick="toggleResearchView('table',this)" title="Table View">📋 Table</button>`;
    toolbar.appendChild(tog);
}

// Hook into navigateTo for skeleton + view-toggle injection
const _origNavigateTo = navigateTo;
window.navigateTo = function (pageId) {
    _origNavigateTo(pageId);
    if (pageId === 'research') ensureResearchViewToggle();
};
