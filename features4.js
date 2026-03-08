'use strict';
// ═══════════════════════════════════════════════════════════
// FEATURES 4 — Metric Tooltips, Onboarding Tour,
//              Multi-Case Tab Bar
// ═══════════════════════════════════════════════════════════

// ─── 5. METRIC TOOLTIPS ──────────────────────────────────────
const METRIC_TIPS = {
    'DSCR': 'Debt Service Coverage Ratio — Measures ability to service debt. Benchmark: ≥1.5x preferred; <1.25x triggers covenant breach.',
    'Debt / Equity': 'Leverage ratio. Lower is better. >2x indicates high financial risk. Sector avg: 1.5x.',
    'Current Ratio': 'Liquidity ratio (current assets ÷ current liabilities). ≥1.25x preferred for manufacturing.',
    'PAT Margin': 'Profit After Tax margin. Higher indicates efficient operations. Sector avg: 8.5%.',
    'Interest Cover': 'EBIT ÷ Interest expense. ≥2.5x required. Below 1.5x signals distress.',
    'Asset Turnover': 'Revenue ÷ Total Assets. Measures operational efficiency. Higher is better.',
    'ROE': 'Return on Equity — profitability relative to shareholders. Sector avg ~16%.',
    'Promoter Pledge': '% of promoter shares pledged as collateral. 0% preferred; >30% is a red flag.',
    'Revenue': 'Total turnover for the financial year. Measures top-line scale and growth trajectory.',
    'PAT': 'Profit After Tax. Net earnings after all expenses, interest, and taxes.',
    'Net Worth': 'Shareholders equity — total assets minus liabilities. Stronger base = more creditworthy.',
    'Operating CF': 'Cash generated from core operations. Positive OCF is critical for debt serviceability.',
    'Credit Score': 'Composite Five-C score (0–100). Below 50 = High Risk, 50–70 = Moderate, 70+ = Good.',
};

let _tipTimeout = null;
const tipBox = () => document.getElementById('tooltip-box');

function attachTooltips() {
    // Ratio items
    document.querySelectorAll('.ratio-item').forEach(el => {
        const nameEl = el.querySelector('.ratio-name');
        if (!nameEl) return;
        const key = nameEl.textContent.trim();
        if (METRIC_TIPS[key]) {
            el.setAttribute('data-tip', METRIC_TIPS[key]);
            el.addEventListener('mouseenter', showMetricTip);
            el.addEventListener('mouseleave', hideMetricTip);
            el.addEventListener('mousemove', moveMetricTip);
        }
    });
    // Metric cards on dashboard
    document.querySelectorAll('.metric-card').forEach(el => {
        const labelEl = el.querySelector('.metric-label');
        if (!labelEl) return;
        const key = labelEl.textContent.trim().replace('Ingested', '').replace('Findings', '').replace('Raised', '').replace('Score', 'Credit Score').trim();
        const tip = METRIC_TIPS[key] || null;
        if (tip) { el.setAttribute('data-tip', tip); el.addEventListener('mouseenter', showMetricTip); el.addEventListener('mouseleave', hideMetricTip); el.addEventListener('mousemove', moveMetricTip); }
    });
    // Extraction rows
    document.querySelectorAll('.extraction-row').forEach(el => {
        const label = (el.querySelector('.label') || {}).textContent || '';
        const clean = label.trim().replace(/\s*\(.*\)/, '');
        const tip = METRIC_TIPS[clean] || null;
        if (tip) { el.setAttribute('data-tip', tip); el.addEventListener('mouseenter', showMetricTip); el.addEventListener('mouseleave', hideMetricTip); el.addEventListener('mousemove', moveMetricTip); }
    });
}

function showMetricTip(e) {
    const tip = e.currentTarget.dataset.tip;
    if (!tip) return;
    const box = tipBox();
    box.textContent = tip;
    box.classList.remove('hidden');
    positionTip(e);
}
function hideMetricTip() {
    tipBox().classList.add('hidden');
}
function moveMetricTip(e) { positionTip(e); }
function positionTip(e) {
    const box = tipBox();
    const margin = 14;
    let x = e.clientX + margin;
    let y = e.clientY - 10;
    if (x + 280 > window.innerWidth) x = e.clientX - 280 - margin;
    box.style.left = x + 'px';
    box.style.top = y + 'px';
}

// Re-attach tooltips whenever content updates
const _origRenderCAM = typeof renderCAM !== 'undefined' ? renderCAM : null;
document.addEventListener('DOMContentLoaded', () => {
    // Observe DOM changes to auto-attach tooltips
    const obs = new MutationObserver(() => {
        setTimeout(attachTooltips, 300);
    });
    obs.observe(document.getElementById('pages'), { childList: true, subtree: true });
    setTimeout(attachTooltips, 800);
});

// ─── 6. ONBOARDING TOUR ──────────────────────────────────────
const ONBOARDING_STEPS = [
    { icon: '👋', title: 'Welcome to IntelliCredit', desc: 'An AI-powered corporate credit appraisal engine. We\'ll guide you through the 6-step workflow in under 2 minutes. Press <strong>Next</strong> to begin.', page: null },
    { icon: '🏢', title: 'Step 1 — Company Profile', desc: 'Start by entering company details: CIN, shareholding pattern, board of directors, and key events timeline. This contextualises the borrower for credit officers.', page: 'profile' },
    { icon: '📁', title: 'Step 2 — Data Ingestor', desc: 'Upload financial documents (Annual Reports, GST returns, Bank Statements, ITRs). Gemini AI extracts financials and runs <strong>GST vs Bank cross-analysis</strong> to flag discrepancies.', page: 'ingest' },
    { icon: '📈', title: 'Step 3 — Financial Analytics', desc: 'View 3-year trends, DSCR, D/E ratio, OCF, working capital cycle, and sector peer benchmarking — powered by Chart.js visualisations. Hover any metric for its definition.', page: 'analytics' },
    { icon: '🔍', title: 'Step 4 — Research Agent', desc: 'One click triggers web-scale research: MCA filings, eCourts litigation, promoter news, sector headwinds. Results are categorised by sentiment: Risk / Neutral / Positive.', page: 'research' },
    { icon: '💡', title: 'Step 5 — Primary Insights', desc: 'Credit officers add factory visit notes and management interview observations. The <strong>AI adjusts the credit score in real-time</strong> based on qualitative signals.', page: 'insights' },
    { icon: '📋', title: 'Step 6 — CAM Report', desc: 'The engine generates a complete Credit Appraisal Memo with Five-C scorecard, AI explainability, risk heatmap, and the credit decision. Export as PDF or print directly.', page: 'report' },
    { icon: '🎉', title: 'You\'re all set!', desc: 'Intelli-Credit is ready. Click <strong>Load Demo Case</strong> on the dashboard to explore a full sample appraisal. Press <strong>Finish</strong> to begin.', page: 'dashboard' },
];
let obStep = 0;

function startOnboarding() {
    obStep = 0;
    document.getElementById('onboarding-overlay').classList.remove('hidden');
    renderOnboardingStep();
}
function skipOnboarding() {
    document.getElementById('onboarding-overlay').classList.add('hidden');
    localStorage.setItem('ic-onboarded', '1');
}
function nextOnboardingStep() {
    obStep++;
    if (obStep >= ONBOARDING_STEPS.length) { skipOnboarding(); return; }
    renderOnboardingStep();
}
function renderOnboardingStep() {
    const s = ONBOARDING_STEPS[obStep];
    document.getElementById('ob-icon').textContent = s.icon;
    document.getElementById('ob-title').textContent = s.title;
    document.getElementById('ob-desc').innerHTML = s.desc;
    document.getElementById('ob-next-btn').textContent = obStep >= ONBOARDING_STEPS.length - 1 ? '🎉 Finish' : 'Next →';
    // Progress dots
    document.getElementById('onboarding-progress').innerHTML =
        ONBOARDING_STEPS.map((_, i) => `<span class="ob-dot ${i === obStep ? 'active' : i < obStep ? 'done' : ''}"></span>`).join('');
    // Navigate to the relevant page in background
    if (s.page) navigateTo(s.page);
}

// Show onboarding for first-time users (after 800ms delay)
document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('ic-onboarded')) {
        setTimeout(startOnboarding, 1200);
    }
    // Ctrl+K global shortcut
    document.addEventListener('keydown', e => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); openCmdPalette(); }
    });
});

// ─── 7. MULTI-CASE TAB BAR (Dynamic) ────────────────────────
// Registry stores all open cases; populated at runtime (e.g., by loadDemo)
const CASE_REGISTRY = {};
let activeCase = null;

// Register a case and show its tab
function registerCase(caseId, data) {
    CASE_REGISTRY[caseId] = data;
    // Create tab if it doesn't exist
    const inner = document.getElementById('case-tabs-inner');
    if (!inner) return;
    if (document.querySelector(`[data-case="${caseId}"]`)) return; // already exists
    const sectorIcon = data.sector && data.sector.includes('IT') ? '💻'
        : data.sector && data.sector.includes('Auto') ? '🚗'
            : data.sector && data.sector.includes('Pharma') ? '💊'
                : data.sector && data.sector.includes('Finance') ? '🏦'
                    : data.sector && data.sector.includes('Oil') ? '⛽'
                        : data.sector && data.sector.includes('Metal') ? '⚙️'
                            : data.sector && data.sector.includes('FMCG') ? '🛒'
                                : '🏢';
    const shortName = data.company.replace(/ Ltd| Limited| Corp| Industries| Technologies| International/gi, '').trim().substring(0, 18);
    const addBtn = inner.querySelector('.case-tab-add');
    const tab = document.createElement('button');
    tab.className = 'case-tab';
    tab.dataset.case = caseId;
    tab.onclick = function () { switchCase(caseId, this); };
    tab.innerHTML = `<span class="case-tab-icon">${sectorIcon}</span><span class="case-tab-name">${shortName}</span><span class="case-tab-sector">${data.sector || ''}</span>`;
    inner.insertBefore(tab, addBtn);
}

function switchCase(caseId, btn) {
    if (caseId === activeCase && btn) return;
    const data = CASE_REGISTRY[caseId];
    if (!data) { toast('Case Not Found', 'Please load a demo or start a new appraisal', 'warn'); return; }
    activeCase = caseId;
    // Update tab active state
    document.querySelectorAll('.case-tab').forEach(t => t.classList.remove('active'));
    const targetBtn = btn || document.querySelector(`[data-case="${caseId}"]`);
    if (targetBtn) targetBtn.classList.add('active');
    // Populate state
    state.company = data.company;
    state.sector = data.sector;
    state.extractedData = data.financials;
    // Update sidebar company chip
    document.getElementById('sidebar-company').innerHTML = `<strong style="color:var(--text-primary)">${data.company}</strong>`;
    // Update company fields
    if (document.getElementById('company-name')) document.getElementById('company-name').value = data.company;
    if (document.getElementById('company-cin')) document.getElementById('company-cin').value = data.cin;
    if (document.getElementById('research-company')) document.getElementById('research-company').value = data.company;
    // Update dashboard metrics
    updateMetrics(data.docs, data.research, data.flags, data.score);
    updateProgress(data.progress);
    state.reportReady = true;
    document.getElementById('report-dot').className = 'status-dot ready';
    // Reset charts so they re-render with new data
    Object.values(state.charts).forEach(c => { try { c.destroy(); } catch (e) { } });
    state.charts = {};
    navigateTo('dashboard');
    toast(`Switched to ${data.company}`, `Score: ${data.score}/100 | ${data.sector}`, 'success', 3500);
}

function addNewCase() {
    const name = prompt('Enter company name for new appraisal:');
    if (!name || !name.trim()) return;
    toast('New Case Created', `Starting fresh appraisal for ${name.trim()}`, 'info');
    resetSession();
    setTimeout(() => {
        document.getElementById('company-name').value = name.trim();
        state.company = name.trim();
        document.getElementById('sidebar-company').innerHTML = `<strong style="color:var(--text-primary)">${name.trim()}</strong>`;
        navigateTo('profile');
    }, 400);
}
