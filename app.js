'use strict';
// ─── Global State ─────────────────────────────────────────────
const state = {
  company: null, sector: null, docsUploaded: {}, extractedData: null,
  researchItems: [], insights: { site: '', mgmt: '', other: '' },
  baseScore: 68, adjustedScore: 68,
  fiveC: { character: 62, capacity: 58, capital: 72, collateral: 75, conditions: 65 },
  reportReady: false, stepsDone: new Set(),
  charts: {}, isDemo: false
};

// ─── Toast System ─────────────────────────────────────────────
function toast(title, msg, type = 'info', duration = 4000) {
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warn: '⚠️' };
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span class="toast-icon">${icons[type] || 'ℹ️'}</span><div class="toast-body"><div class="toast-title">${title}</div><div class="toast-msg">${msg}</div></div>`;
  document.getElementById('toast-container').appendChild(t);
  setTimeout(() => { t.classList.add('hide'); setTimeout(() => t.remove(), 350); }, duration);
}

// ─── Shared Empty State Helper ────────────────────────────────
function showPageEmptyState(container, icon, title, subtitle) {
  const pageTitle = subtitle || 'Load the demo case to view this analysis for the borrower company.';
  if (!container) return;
  container.innerHTML = `
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:55vh;gap:16px;text-align:center;padding:40px">
      <div style="font-size:3.5rem">${icon || '📊'}</div>
      <h3 style="font-size:1.3rem;font-weight:700;color:var(--text-primary);margin:0">${title || 'No Company Loaded'}</h3>
      <p style="color:var(--text-secondary);max-width:400px;margin:0;line-height:1.6">${pageTitle}</p>
      <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center;margin-top:8px">
        <button class="btn btn-primary btn-lg" onclick="loadDemo()">Load Demo Case →</button>
        <button class="btn btn-ghost btn-lg" onclick="navigateTo('ingest')">Enter Company →</button>
      </div>
    </div>`;
}

// ─── Navigation ───────────────────────────────────────────────
const PAGE_TITLES = {
  dashboard: ['Dashboard', 'AI-Powered Corporate Credit Decisioning Engine'],
  profile: ['Company Profile', 'Shareholding, Board, Subsidiaries & Key Events Timeline'],
  ingest: ['Data Ingestor', 'Pillar 1 — Multi-Format Document Extraction & Cross-Analysis'],
  analytics: ['Financial Analytics', '3-Year Trends, Ratio Analysis & Sector Peer Benchmarking'],
  research: ['Research Agent', 'Pillar 2 — Web-Scale Secondary Research & Sector Intelligence'],
  insights: ['Primary Insights Portal', 'Pillar 2 — Credit Officer Qualitative Input Integration'],
  report: ['Credit Appraisal Memo (CAM)', 'Pillar 3 — AI-Generated Credit Decision & Explainability'],
  stock: ['Stock Analysis', 'Listed Equity Performance, Technicals & Institutional Activity'],
  ratios: ['Ratio Classifications Guide', 'All Financial Ratios Grouped by Category with Benchmarks'],
  ews: ['Early Warning System', 'Auto-flag DSCR drops, overdue payments & sector stress signals'],
  npa: ['NPA Prediction Score', 'ML-style 0–100% probability of NPA within 12 months'],
  covenant: ['Covenant Breach Tracker', 'Monitor financial & non-financial covenant compliance'],
  sanction: ['Sanction Letter Generator', 'Auto-generate full sanction letter — one-click export'],
  mpbf: ['Working Capital Assessment (MPBF)', 'Tandon Committee norms — Maximum Permissible Bank Finance'],
  peer: ['Peer Benchmarking Dashboard', 'Compare borrower ratios vs. top 3 sector peers'],
  compliance: ['Pre-Disbursal Compliance Checklist', 'KYC, Legal Opinion, ROC Search & Pre-disbursement Requirements'],
  vault: ['Document Vault', 'Upload & Track Balance Sheet, ITR, GST Returns, MCA Cert…'],
  crilc: ['RBI CRILC Reporting', 'Quarterly CRILC Submission Preview & SMA Classification'],
};

function navigateTo(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('page-active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const pg = document.getElementById('page-' + pageId);
  if (pg) pg.classList.add('page-active');
  const nav = document.querySelector(`[data-page="${pageId}"]`);
  if (nav) nav.classList.add('active');
  const t = PAGE_TITLES[pageId] || ['', ''];
  document.getElementById('page-title').textContent = t[0];
  document.getElementById('page-subtitle').textContent = t[1];
  updateStepper(pageId);
  if (pageId === 'report' && state.reportReady) renderCAM();
  if (pageId === 'analytics') initAnalyticsCharts();
  if (pageId === 'profile') renderProfile();
  if (pageId === 'research' && state.company) document.getElementById('research-company').value = state.company;
  // New feature pages
  if (pageId === 'ews') initEWSPage();
  if (pageId === 'npa') initNPAPage();
  if (pageId === 'covenant') initCovenantPage();
  if (pageId === 'sanction') initSanctionPage();
  if (pageId === 'mpbf') initMPBFPage();
  if (pageId === 'peer') initPeerPage();
  if (pageId === 'compliance') initCompliancePage();
  if (pageId === 'vault') initVaultPage();
  if (pageId === 'crilc') initCRILCPage();
  // features9.js — Smart Auto-Ingest hooks
  if (pageId === 'ingest') {
    setTimeout(() => {
      if (typeof setupAutoIngest === 'function') setupAutoIngest();
      if (typeof patchUploadZonesWithOCR === 'function') patchUploadZonesWithOCR();
    }, 150);
  }
  if (pageId === 'dashboard') {
    setTimeout(() => {
      if (typeof addSmartAnalyseButton === 'function') addSmartAnalyseButton();
    }, 150);
  }
}

document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', e => { e.preventDefault(); navigateTo(item.dataset.page); });
});

// ─── Workflow Stepper ─────────────────────────────────────────
const STEP_PAGES = ['profile', 'ingest', 'analytics', 'research', 'insights', 'report'];
function updateStepper(currentPage) {
  const idx = STEP_PAGES.indexOf(currentPage);
  document.querySelectorAll('.step').forEach((s, i) => {
    s.classList.remove('active', 'done');
    if (i === idx) s.classList.add('active');
    else if (state.stepsDone.has(STEP_PAGES[i])) s.classList.add('done');
  });
  document.querySelectorAll('.step-line').forEach((l, i) => {
    l.classList.toggle('done', state.stepsDone.has(STEP_PAGES[i]));
  });
  if (currentPage !== 'dashboard') state.stepsDone.add(currentPage);
}

// ─── Demo Data ────────────────────────────────────────────────
const DEMO = {
  company: 'Apex Industrial Corp Ltd', cin: 'L21091MH2001PLC132847', sector: 'Manufacturing',
  financials: {
    revenue: '₹847 Cr', revenueGrowth: '+12.4%', pat: '₹62.3 Cr', patMargin: '7.4%',
    netWorth: '₹310 Cr', debtEquity: '1.82x', dscr: '1.31x', currentRatio: '1.18x',
    ocf: '₹78 Cr', promoterHolding: '62.3%', creditRating: 'BBB+ (CRISIL)',
  },
  gstData: [
    { q: 'Q1 FY25', gst: '₹198 Cr', bank: '₹204 Cr', var: '+3.1%', flag: 'ok' },
    { q: 'Q2 FY25', gst: '₹213 Cr', bank: '₹247 Cr', var: '+16.0%', flag: 'warn' },
    { q: 'Q3 FY25', gst: '₹226 Cr', bank: '₹287 Cr', var: '+27.0%', flag: 'danger' },
    { q: 'Q4 FY25', gst: '₹210 Cr', bank: '₹218 Cr', var: '+3.8%', flag: 'ok' },
  ],
  gstFlags: [
    { type: 'warning', text: 'Q2 FY25: Bank credits exceed GSTR-3B by 16.0%. Possible timing differences or advance receipts.' },
    { type: 'danger', text: '⚠️ Q3 FY25: Critical — Bank credits exceed GST turnover by 27%. Possible revenue inflation or circular trading.' },
    { type: 'warning', text: 'GSTR-2A vs GSTR-3B ITC mismatch of ₹14.2 Cr in FY25. Potential reversal risk under GST audit.' },
  ],
  fiveC: {
    character: { score: 62, label: 'Character', color: 'mid', sub: 'Litigation risk; MCA defaulter (director)' },
    capacity: { score: 58, label: 'Capacity', color: 'mid', sub: 'DSCR 1.31x marginal; Q3 GST discrepancy 27%' },
    capital: { score: 72, label: 'Capital', color: 'high', sub: 'Net Worth ₹310 Cr; D/E 1.82x (improving)' },
    collateral: { score: 75, label: 'Collateral', color: 'high', sub: 'Fixed assets ₹520 Cr; SARFAESI-actionable' },
    conditions: { score: 65, label: 'Conditions', color: 'mid', sub: 'Sector CAGR 14%; steel cost headwind' },
  },
  decision: {
    verdict: 'CONDITIONAL APPROVAL', type: 'conditional',
    amount: '₹95 Crores', rate: '12.50% p.a.', tenor: '5 Years',
    rationale: 'Approved conditionally at reduced limit due to Q3 GST-bank discrepancy, active NI Act litigation (₹8.2 Cr), and marginal DSCR of 1.31x despite strong collateral and positive sector outlook.'
  },
  explain: [
    { type: 'negative', icon: '⚠️', text: 'Q3 FY25: Bank credits exceeded GSTR-3B by 27% — possible revenue inflation.', weight: '-12 pts' },
    { type: 'negative', icon: '⚖️', text: 'Active NI Act case ICICI Bank ₹8.2 Cr — cheque dishonour, payment stress signal.', weight: '-8 pts' },
    { type: 'negative', icon: '👤', text: 'CMD linked to struck-off entity Alpha Polymers. Character concern noted.', weight: '-5 pts' },
    { type: 'positive', icon: '📋', text: 'DRDO defence order ₹120 Cr provides strong revenue visibility for FY26.', weight: '+7 pts' },
    { type: 'positive', icon: '🏭', text: 'Fixed assets ₹520 Cr against ₹95 Cr limit = 5.5x collateral coverage.', weight: '+9 pts' },
    { type: 'positive', icon: '📈', text: 'Sector CAGR 14% through 2028; Aatmanirbhar Bharat tailwinds.', weight: '+5 pts' },
    { type: 'neutral', icon: '📄', text: 'MCA ROC filings current; ISO 9001:2015 recertified Dec 2025.', weight: '0 pts' },
  ],
  research: [
    { id: 1, cat: 'news', icon: '📰', title: 'Apex Industrial wins ₹120 Cr DRDO order', desc: 'Precision engineering components for defence indigenisation. Strong order book visibility for FY26.', date: 'Feb 2026', source: 'Economic Times', sentiment: 'positive' },
    { id: 2, cat: 'legal', icon: '⚖️', title: 'NI Act Sec 138 case — ICICI Bank ₹8.2 Cr cheque dishonour', desc: 'Filed in Mumbai Sessions Court. Case no: CC/4827/2024. Matter sub-judice; no stay granted.', date: 'Nov 2024', source: 'eCourts Portal', sentiment: 'risk' },
    { id: 3, cat: 'mca', icon: '🏛️', title: 'Director DIN 00834712 appeared on MCA defaulter list (FY23)', desc: 'Non-filing of DIR-3 KYC. Status resolved as per MCA records but raises governance questions.', date: 'Mar 2023', source: 'MCA21 Portal', sentiment: 'risk' },
    { id: 4, cat: 'sector', icon: '📈', title: 'RBI tightens ECB norms for manufacturing sector', desc: 'Minimum average maturity of 5 years for ECBs above USD 50 Mn. May slow capex funding.', date: 'Jan 2026', source: 'RBI.org.in', sentiment: 'neutral' },
    { id: 5, cat: 'promoter', icon: '👤', title: 'CMD Vikram Sheth linked to defunct Alpha Polymers Pvt Ltd', desc: 'Struck-off in 2021 under Section 248. No active litigation found against him personally.', date: '2021', source: 'MCA21 Portal', sentiment: 'risk' },
    { id: 6, cat: 'news', icon: '📰', title: 'Indian precision manufacturing to grow at 14% CAGR through 2028', desc: 'IBEF report highlights EV, defence, and export tailwinds for precision engineering.', date: 'Jan 2026', source: 'IBEF.org', sentiment: 'positive' },
    { id: 7, cat: 'sector', icon: '📊', title: 'Steel prices up 18% YoY — margin pressure for manufacturers', desc: 'Rising input costs squeezing mid-sized manufacturers without long-term supply contracts.', date: 'Feb 2026', source: 'Steel Mint', sentiment: 'risk' },
    { id: 8, cat: 'news', icon: '📰', title: 'Apex Industrial completes ISO 9001:2015 recertification', desc: 'Quality management systems validated; maintains eligibility for export-linked orders.', date: 'Dec 2025', source: 'BSE Filing', sentiment: 'positive' },
    { id: 9, cat: 'mca', icon: '🏛️', title: 'ROC filings current — no pending defaults', desc: 'MGT-7 and AOC-4 filed within statutory timelines for FY23, FY24, FY25.', date: 'Dec 2025', source: 'MCA21 Portal', sentiment: 'positive' },
    { id: 10, cat: 'legal', icon: '⚖️', title: 'GST Sec 73 notice — ITC reversal demand ₹4.1 Cr', desc: 'FY22 excess ITC claim disputed. Reply filed; adjudication stage. Counsel expects favourable outcome.', date: 'Oct 2025', source: 'Company ROC Filing', sentiment: 'risk' },
  ],
  camSections: [
    { icon: '🏢', title: 'Executive Summary', content: `<p class="cam-text"><span class="cam-company-name"></span> is a multi-sector industrial entity. They seek a <strong>Term Loan</strong> for capacity expansion. </p><br><p class="cam-text">Recommendation: <strong>Conditional Approval</strong>, subject to pre-disbursement conditions.</p>` },

    { icon: '📊', title: 'Financial Performance (3-Year Trend)', content: `<table class="cam-table"><thead><tr><th>Metric</th><th>FY23</th><th>FY24</th><th>FY25</th><th>Assessment</th></tr></thead><tbody><tr><td>Revenue (₹ Cr)</td><td>673</td><td>754</td><td class="highlight">847</td><td class="flag-ok">✅ Growing</td></tr><tr><td>PAT (₹ Cr)</td><td>44.1</td><td>54.8</td><td class="highlight">62.3</td><td class="flag-ok">✅ Improving</td></tr><tr><td>DSCR</td><td>1.18x</td><td>1.26x</td><td class="highlight">1.31x</td><td class="flag-warn">⚠️ Marginal</td></tr><tr><td>Debt/Equity</td><td>2.10x</td><td>1.95x</td><td class="highlight">1.82x</td><td class="flag-ok">✅ Improving</td></tr><tr><td>Operating CF</td><td>₹58 Cr</td><td>₹69 Cr</td><td class="highlight">₹78 Cr</td><td class="flag-ok">✅ Positive</td></tr></tbody></table>` },
    { icon: '🔍', title: 'GST & Bank Statement Analysis', content: `<p class="cam-text" style="margin-bottom:14px">Q3 FY25 bank credits exceed GSTR-3B by <strong>27%</strong> — critical discrepancy requiring borrower reconciliation.</p><table class="cam-table"><thead><tr><th>Quarter</th><th>GSTR-3B</th><th>Bank Credits</th><th>Variance</th><th>Status</th></tr></thead><tbody><tr><td>Q1 FY25</td><td>₹198 Cr</td><td>₹204 Cr</td><td>+3.1%</td><td class="flag-ok">✅ OK</td></tr><tr><td>Q2 FY25</td><td>₹213 Cr</td><td>₹247 Cr</td><td>+16.0%</td><td class="flag-warn">⚠️ Elevated</td></tr><tr><td>Q3 FY25</td><td>₹226 Cr</td><td>₹287 Cr</td><td class="highlight">+27.0%</td><td class="flag-danger">🔴 Critical</td></tr><tr><td>Q4 FY25</td><td>₹210 Cr</td><td>₹218 Cr</td><td>+3.8%</td><td class="flag-ok">✅ OK</td></tr></tbody></table>` },
    { icon: '⚖️', title: 'Legal & Compliance Review', content: `<table class="cam-table"><thead><tr><th>Matter</th><th>Forum</th><th>Amount</th><th>Assessment</th></tr></thead><tbody><tr><td>NI Act Sec 138 (ICICI)</td><td>Mumbai Sessions CC/4827/2024</td><td>₹8.2 Cr</td><td class="flag-danger">🔴 Active</td></tr><tr><td>GST SCN ITC Reversal</td><td>GST Adjudication</td><td>₹4.1 Cr</td><td class="flag-warn">⚠️ Contingent</td></tr><tr><td>MCA defaulter (Director)</td><td>MCA21</td><td>—</td><td class="flag-ok">✅ Resolved</td></tr></tbody></table>` },
    { icon: '🏗️', title: 'Collateral & Security Structure', content: `<table class="cam-table"><thead><tr><th>Security</th><th>Value</th><th>Haircut</th><th>Realizable</th></tr></thead><tbody><tr><td>Pune Plant (Fixed Assets)</td><td>₹380 Cr</td><td>30%</td><td class="highlight">₹266 Cr</td></tr><tr><td>Stocks & Book Debts</td><td>₹95 Cr</td><td>25%</td><td class="highlight">₹71 Cr</td></tr><tr><td><strong>Total Cover</strong></td><td>—</td><td>—</td><td class="highlight flag-ok">₹337 Cr (3.5x)</td></tr></tbody></table>` },
    { icon: '✅', title: 'Credit Decision & Conditions', content: `<p class="cam-text"><strong>Decision: Conditional Approval — ₹95 Cr @ 12.50% p.a.</strong></p><br><p class="cam-text"><strong>Pre-Disbursement:</strong></p><ul style="color:var(--text-secondary);font-size:.875rem;line-height:2;padding-left:20px;margin-top:8px"><li>Written reconciliation of Q3 FY25 discrepancy (₹61 Cr)</li><li>Legal counsel status report on NI Act case CC/4827/2024</li><li>Resolution of GST SCN or escrow of ₹4.1 Cr</li><li>Fresh factory valuation from approved valuer</li></ul>` },
  ],
};

// ─── Load Demo ────────────────────────────────────────────────
function updateCompanyUI() {
  const name = state.company || 'No company selected';
  document.getElementById('sidebar-company').innerHTML = `<strong style="color:var(--text-primary)">${name}</strong>`;
  const nameInput = document.getElementById('company-name');
  if (nameInput) nameInput.value = state.company || '';
  const researchInput = document.getElementById('research-company');
  if (researchInput) researchInput.value = state.company || '';

  // Update any CAM specific placeholders
  const camCompany = document.querySelector('.cam-company-name');
  if (camCompany) camCompany.textContent = state.company || '';
}

// ─── Load Demo ────────────────────────────────────────────────
function loadDemo(customName) {
  state.isDemo = true;
  state.company = customName || DEMO.company; state.sector = DEMO.sector;
  updateCompanyUI();

  document.getElementById('company-cin').value = DEMO.cin;
  document.getElementById('company-sector').value = DEMO.sector;
  document.getElementById('research-company').value = state.company;

  ['annual', 'gst', 'bank', 'itr', 'legal', 'rating'].forEach(type => {
    const z = document.getElementById('upload-' + type);
    if (z) { z.classList.add('uploaded'); z.querySelector('.upload-status').textContent = '✅ Uploaded'; state.docsUploaded[type] = true; }
  });
  state.extractedData = DEMO.financials;
  renderExtractionPanel();
  state.researchItems = DEMO.research;
  renderResearchCards(state.researchItems);
  updateSentimentBar(state.researchItems);
  document.getElementById('research-summary').classList.remove('hidden');
  renderResearchSummary();
  updateBadge('ingest', 6); updateBadge('research', 10);
  state.reportReady = true;
  document.getElementById('report-dot').className = 'status-dot ready';
  updateMetrics(6, 10, 5, '66');
  updateProgress(85);
  ['profile', 'ingest', 'analytics', 'research', 'insights'].forEach(p => state.stepsDone.add(p));
  toast('Data Loaded', `${state.company} processed successfully`, 'success');

  // Register demo case tab dynamically
  if (typeof registerCase === 'function') {
    registerCase('active-case', {
      company: state.company, cin: DEMO.cin, sector: DEMO.sector,


      score: '66', docs: 6, research: 10, flags: 5, progress: 85,
      financials: DEMO.financials
    });
    setTimeout(() => {
      const tab = document.querySelector('[data-case="active-case"]');
      if (tab) { document.querySelectorAll('.case-tab').forEach(t => t.classList.remove('active')); tab.classList.add('active'); }
      if (typeof activeCase !== 'undefined') window._activeCase = 'active-case';

    }, 100);
  }
  navigateTo('ingest');
}

// ─── Reset ────────────────────────────────────────────────────
function resetSession() {
  Object.assign(state, {
    company: null, sector: null, docsUploaded: {}, extractedData: null, researchItems: [],
    insights: { site: '', mgmt: '', other: '' }, baseScore: 68, adjustedScore: 68, reportReady: false, stepsDone: new Set(),
    fiveC: { character: 62, capacity: 58, capital: 72, collateral: 75, conditions: 65 },
    isDemo: false
  });
  updateMetrics(0, 0, 0, '—'); updateProgress(0);
  document.getElementById('sidebar-company').innerHTML = '<span>No company selected</span>';
  document.getElementById('report-dot').className = 'status-dot';
  document.querySelectorAll('.nav-badge').forEach(b => { b.textContent = '0'; b.classList.remove('visible'); });
  document.getElementById('extraction-panel').classList.add('hidden');
  document.getElementById('research-results').innerHTML = '';
  document.getElementById('research-summary').classList.add('hidden');
  document.getElementById('cam-full').classList.add('hidden');
  document.getElementById('empty-report').classList.remove('hidden');
  document.getElementById('sentiment-bar-wrap').style.display = 'none';
  document.querySelectorAll('.upload-zone').forEach(z => {
    z.classList.remove('uploaded', 'uploading');
    z.querySelector('.upload-status').textContent = 'Click to upload';
  });
  Object.values(state.charts).forEach(c => { try { c.destroy(); } catch (e) { } });
  state.charts = {};
  navigateTo('dashboard');
  toast('Session Reset', 'New appraisal session started', 'info');
}

// ─── Upload Simulation ────────────────────────────────────────
const uploadNames = {
  annual: ['AICL_Annual_Report_FY25.pdf'], gst: ['GSTR3B_FY25_Q1_Q4.csv'],
  bank: ['BankStatement_12M.pdf'], itr: ['ITR6_FY25.xml'],
  legal: ['ICICI_NISec138.pdf'], rating: ['CRISIL_BBBplus.pdf'],
};
function simulateUpload(type, el) {
  if (state.docsUploaded[type]) return;
  el.classList.add('uploading'); el.querySelector('.upload-status').textContent = '⏳ Processing...';
  setTimeout(() => {
    el.classList.remove('uploading'); el.classList.add('uploaded');
    el.querySelector('.upload-status').textContent = `✅ ${uploadNames[type][0]}`;
    state.docsUploaded[type] = true;
    if (!state.company) {
      const cn = document.getElementById('company-name').value.trim();
      if (cn) {
        state.isDemo = false;
        state.company = cn;
        updateCompanyUI();
      }
    }

    state.sector = document.getElementById('company-sector').value;
    updateBadge('ingest', Object.keys(state.docsUploaded).length);
    const n = Object.keys(state.docsUploaded).length;
    updateMetrics(n, parseInt(document.getElementById('m-research').textContent) || 0,
      parseInt(document.getElementById('m-flags').textContent) || 0, document.getElementById('m-score').textContent);
    if (n >= 3) triggerExtraction();
    updateProgress(Math.min(Math.round(n / 6 * 40), 40));
    toast('Document Processed', `${uploadNames[type][0]} extracted successfully`, 'success');
  }, 1800 + Math.random() * 1200);
}
function triggerExtraction() {
  state.extractedData = DEMO.financials;
  state.company = state.company || document.getElementById('company-name').value || 'New Appraisal Case';
  updateCompanyUI();

  renderExtractionPanel();
}
function renderExtractionPanel() {
  document.getElementById('extraction-panel').classList.remove('hidden');
  const fin = state.extractedData || DEMO.financials;
  const isApexDemo = state.isDemo && state.company === DEMO.company;

  document.getElementById('extraction-results').innerHTML = [
    { title: '📈 Financial Highlights', rows: [['Revenue (FY25)', fin.revenue, 'positive'], ['Revenue Growth', fin.revenueGrowth, 'positive'], ['PAT', fin.pat, 'positive'], ['PAT Margin', fin.patMargin, '']] },
    { title: '⚖️ Leverage & Ratios', rows: [['Debt/Equity', fin.debtEquity, 'warn'], ['DSCR', fin.dscr, 'warn'], ['Current Ratio', fin.currentRatio, 'warn'], ['Operating CF', fin.ocf, 'positive']] },
    { title: '🏢 Promoter & Governance', rows: [['Promoter Holding', fin.promoterHolding, 'positive'], ['Credit Rating', fin.creditRating, 'warn'], ['MCA Compliance', 'Current ✅', 'positive'], ['ISO Cert', isApexDemo ? '9001:2015 ✅' : 'Verification pending', isApexDemo ? 'positive' : '']] },
  ].map(s => `<div class="extraction-card"><h4>${s.title}</h4>${s.rows.map(([l, v, c]) => `<div class="extraction-row"><span class="label">${l}</span><span class="value ${c}">${v}</span></div>`).join('')}</div>`).join('');

  // Inject company name into CAM placeholder if it exists in the DOM already
  const camCompany = document.querySelector('.cam-company-name');
  if (camCompany) camCompany.textContent = state.company;

  // GST table: use demo data for Apex, generate plausible rows for others
  let gstRows, gstFlags;
  if (isApexDemo) {
    gstRows = DEMO.gstData;
    gstFlags = DEMO.gstFlags;
  } else {
    const rev = fin._rev || 500;
    const q = (n) => Math.round(rev / 4 * n);
    const variance = [2.1, 4.3, 3.8, 2.5];
    gstRows = ['Q1 FY25', 'Q2 FY25', 'Q3 FY25', 'Q4 FY25'].map((quarter, i) => {
      const gst = q(0.22 + i * 0.02);
      const bank = Math.round(gst * (1 + variance[i] / 100));
      return { q: quarter, gst: `₹${gst} Cr`, bank: `₹${bank} Cr`, var: `+${variance[i]}%`, flag: variance[i] > 10 ? 'warn' : 'ok' };
    });
    gstFlags = [{ type: 'info', text: `GST cross-analysis complete. Variance within acceptable limits across all quarters for ${state.company}.` }];
  }

  document.getElementById('gst-tbody').innerHTML = gstRows.map(r => `<tr><td>${r.q}</td><td>${r.gst}</td><td>${r.bank}</td><td class="${r.flag === 'ok' ? 'flag-ok' : r.flag === 'warn' ? 'flag-warn' : 'flag-danger'}">${r.var}</td><td class="${r.flag === 'ok' ? 'flag-ok' : r.flag === 'warn' ? 'flag-warn' : 'flag-danger'}">${r.flag === 'ok' ? '✅ OK' : r.flag === 'warn' ? '⚠️ Review' : '🔴 Critical'}</td></tr>`).join('');
  document.getElementById('gst-flags').innerHTML = gstFlags.map(f => `<div class="gst-flag-item ${f.type}"><span>${f.type === 'danger' ? '🔴' : f.type === 'info' ? '✅' : '⚠️'}</span><span>${f.text}</span></div>`).join('');
}


// ─── Helpers ──────────────────────────────────────────────────
function updateMetrics(d, r, f, sc) {
  animateCount('m-docs', d); animateCount('m-research', r); animateCount('m-flags', f);
  document.getElementById('m-score').textContent = sc;
}
function animateCount(id, target) {
  const el = document.getElementById(id); let cur = parseInt(el.textContent) || 0;
  if (cur === target || isNaN(target)) return;
  const step = Math.ceil(Math.abs(target - cur) / 20);
  const iv = setInterval(() => { cur = cur < target ? Math.min(cur + step, target) : Math.max(cur - step, target); el.textContent = cur; if (cur === target) clearInterval(iv); }, 40);
}
function updateBadge(type, count) { const el = document.getElementById('badge-' + type); if (!el) return; el.textContent = count; el.classList.toggle('visible', count > 0); }
function updateProgress(pct) { document.getElementById('global-progress').style.width = pct + '%'; document.getElementById('global-pct').textContent = pct + '%'; }
function gradeLabel(s) { if (s >= 80) return 'A+'; if (s >= 75) return 'A'; if (s >= 68) return 'B+'; if (s >= 60) return 'B'; if (s >= 50) return 'C+'; if (s >= 40) return 'C'; return 'D'; }

// ─── Quick-Start: Analyse Any Company ─────────────────────────
function startAppraisal(name) {
  const companyName = name || (document.getElementById('quick-company-input') || {}).value || '';
  if (!companyName.trim()) {
    toast('Company Required', 'Please enter a company name to analyse', 'warn');
    return;
  }
  toast('🔍 Starting Analysis', `Fetching documents for ${companyName}…`, 'info', 2500);

  // Reset state cleanly first
  Object.assign(state, {
    company: companyName.trim(), sector: null, docsUploaded: {}, extractedData: null,
    researchItems: [], insights: { site: '', mgmt: '', other: '' },
    baseScore: 68, adjustedScore: 68, reportReady: false, stepsDone: new Set(),
    fiveC: { character: 62, capacity: 58, capital: 72, collateral: 75, conditions: 65 },
    isDemo: false
  });
  Object.values(state.charts).forEach(c => { try { c.destroy(); } catch (e) { } });
  state.charts = {};

  updateCompanyUI();
  updateMetrics(0, 0, 0, '—');
  updateProgress(5);

  // Step 1 — Simulate document fetching (1.5s)
  setTimeout(() => {
    updateProgress(25);
    toast('📑 Documents Found', `Annual Reports, GST Returns, Bank Statements located for ${companyName}`, 'info', 2500);
    ['annual', 'gst', 'bank', 'itr', 'legal', 'rating'].forEach(type => {
      const z = document.getElementById('upload-' + type);
      if (z) { z.classList.add('uploaded'); const s = z.querySelector('.upload-status'); if (s) s.textContent = '✅ Auto-fetched'; }
      state.docsUploaded[type] = true;
    });
    updateBadge('ingest', 6);
    if (document.getElementById('company-name')) document.getElementById('company-name').value = companyName;
    navigateTo('ingest');
  }, 1500);

  // Step 2 — Simulate AI extraction (3s)
  setTimeout(() => {
    updateProgress(50);
    toast('🤖 AI Extraction', 'Gemini AI is processing financial statements…', 'info', 2500);
    state.extractedData = generateCompanyData(companyName);
    renderExtractionPanel();
    updateMetrics(6, 0, 0, '—');
  }, 3000);

  // Step 3 — Simulate Web Research (5s)
  setTimeout(() => {
    updateProgress(70);
    toast('🔍 Research Agent', `Running web-scale research on ${companyName}…`, 'info', 2500);
    state.researchItems = generateResearchItems(companyName);
    renderResearchCards(state.researchItems);
    updateSentimentBar(state.researchItems);
    const summaryEl = document.getElementById('research-summary');
    if (summaryEl) summaryEl.classList.remove('hidden');
    if (typeof renderResearchSummary === 'function') renderResearchSummary();
    updateBadge('research', state.researchItems.length);
    updateMetrics(6, state.researchItems.length, 3, '—');
  }, 5000);

  // Step 4 — Generate CAM and score (7s)
  setTimeout(() => {
    updateProgress(90);
    // Generate a score based on company name hash (deterministic for same input)
    const hash = companyName.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const score = 55 + (hash % 30); // Score between 55 and 84
    state.baseScore = score; state.adjustedScore = score;
    state.fiveC = {
      character: Math.max(45, Math.min(85, score - 5 + (hash % 15))),
      capacity: Math.max(45, Math.min(85, score - 8 + (hash % 12))),
      capital: Math.max(50, Math.min(90, score + 3 + (hash % 10))),
      collateral: Math.max(55, Math.min(90, score + 7 + (hash % 8))),
      conditions: Math.max(50, Math.min(82, score - 2 + (hash % 14))),
    };
    // Mark as demo-equivalent so all pages unlock
    state.isDemo = true;
    state.reportReady = true;
    const reportDot = document.getElementById('report-dot');
    if (reportDot) reportDot.className = 'status-dot ready';
    updateMetrics(6, state.researchItems.length, 3, String(score));
    ['profile', 'ingest', 'analytics', 'research', 'insights'].forEach(p => state.stepsDone.add(p));
  }, 7000);

  // Step 5 — Done (8.5s)
  setTimeout(() => {
    updateProgress(100);
    toast('✅ Analysis Complete', `Full credit analysis ready for ${companyName}`, 'success', 4000);
    navigateTo('analytics');
  }, 8500);
}

// Generate company-specific financial data using deterministic seeding
function generateCompanyData(name) {
  const seed = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const rng = (() => { let s = seed; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; })();
  const rev = Math.round(200 + rng() * 1800);
  const growth = (4 + rng() * 20).toFixed(1);
  const patPct = (4 + rng() * 12).toFixed(1);
  const pat = (rev * patPct / 100).toFixed(1);
  const dscr = (1.1 + rng() * 0.9).toFixed(2);
  const de = (0.8 + rng() * 2.2).toFixed(2);
  const cr = (1.0 + rng() * 0.8).toFixed(2);
  const nwRaw = Math.round(rev * (0.3 + rng() * 0.5));
  const ocf = Math.round(parseFloat(pat) * (0.9 + rng() * 0.6));
  const promo = (45 + rng() * 35).toFixed(1);
  const ratings = ['AA (CRISIL)', 'AA- (ICRA)', 'A+ (CRISIL)', 'A (CARE)', 'BBB+ (CRISIL)', 'BBB (ICRA)', 'A- (CARE)'];
  const rating = ratings[Math.floor(rng() * ratings.length)];

  // Generate 3-year trend data (FY23, FY24, FY25) using growth back-calculation
  const gFactor = parseFloat(growth) / 100;
  const rev23 = Math.round(rev / (1 + gFactor) / (1 + gFactor * 0.8));
  const rev24 = Math.round(rev / (1 + gFactor));
  const patPctF = parseFloat(patPct);
  const pat23 = parseFloat((rev23 * (patPctF * 0.78) / 100).toFixed(1));
  const pat24 = parseFloat((rev24 * (patPctF * 0.89) / 100).toFixed(1));
  const patF = parseFloat(pat);
  const dscrF = parseFloat(dscr);
  const deF = parseFloat(de);
  const ocfF = ocf;
  const dscr23 = parseFloat((dscrF * 0.83).toFixed(2));
  const dscr24 = parseFloat((dscrF * 0.92).toFixed(2));
  const de23 = parseFloat((deF * 1.18).toFixed(2));
  const de24 = parseFloat((deF * 1.09).toFixed(2));
  const ocf23 = Math.round(ocfF * 0.74);
  const ocf24 = Math.round(ocfF * 0.87);

  return {
    revenue: `₹${rev} Cr`, revenueGrowth: `+${growth}%`, pat: `₹${pat} Cr`,
    patMargin: `${patPct}%`, netWorth: `₹${nwRaw} Cr`, debtEquity: `${de}x`,
    dscr: `${dscr}x`, currentRatio: `${cr}x`, ocf: `₹${ocf} Cr`,
    promoterHolding: `${promo}%`, creditRating: rating,
    // raw numbers for charts (FY25)
    _rev: rev, _pat: patF, _dscr: dscrF, _de: deF,
    _cr: parseFloat(cr), _ocf: ocfF, _nw: nwRaw,
    // 3-year trend arrays [FY23, FY24, FY25]
    _rev3: [rev23, rev24, rev], _pat3: [pat23, pat24, patF],
    _dscr3: [dscr23, dscr24, dscrF], _de3: [de23, de24, deF],
    _ocf3: [ocf23, ocf24, ocfF]
  };
}

// Generate dynamic research items for any company
function generateResearchItems(name) {
  const first = name.split(' ')[0];
  const sectors = ['manufacturing', 'technology', 'finance', 'pharma', 'infrastructure'];
  const hash = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const sector = sectors[hash % sectors.length];
  return [
    { id: 1, cat: 'news', icon: '📰', title: `${name} secures major government contract`, desc: `${first} has secured a significant government supply contract, boosting order book visibility for the next two financial years.`, date: 'Feb 2026', source: 'Economic Times', sentiment: 'positive' },
    { id: 2, cat: 'mca', icon: '🏛️', title: `MCA21 ROC filings current for ${name}`, desc: `MGT-7 and AOC-4 filed within statutory timelines. No pending defaults found in MCA21 database.`, date: 'Dec 2025', source: 'MCA21 Portal', sentiment: 'positive' },
    { id: 3, cat: 'sector', icon: '📈', title: `${sector.charAt(0).toUpperCase() + sector.slice(1)} sector headwinds in FY26`, desc: `Rising input costs and policy uncertainty pose margin pressure for ${sector} companies. Working capital requirements elevated.`, date: 'Jan 2026', source: 'IBEF Report', sentiment: 'neutral' },
    { id: 4, cat: 'legal', icon: '⚖️', title: `No active litigation found against ${name}`, desc: `eCourts and NCLAT search returned no active insolvency or material litigation matters for ${name} as of search date.`, date: 'Mar 2026', source: 'eCourts Portal', sentiment: 'positive' },
    { id: 5, cat: 'promoter', icon: '👤', title: `Promoter background check — ${first} Group`, desc: `Director KYC verified. No appearance in MCA defaulter list or SEBI debarment orders. Credit bureau records clean.`, date: 'Mar 2026', source: 'CIBIL / MCA21', sentiment: 'positive' },
    { id: 6, cat: 'news', icon: '📊', title: `GST compliance analysis for ${name}`, desc: `GSTR-3B to bank statement cross-check completed. Variance within acceptable limits for Q1-Q4 FY25. No major discrepancy detected.`, date: 'Feb 2026', source: 'Internal Analysis', sentiment: 'positive' },
    { id: 7, cat: 'sector', icon: '🏭', title: `Input cost pressure in ${sector} sector`, desc: `Raw material prices up 10-15% YoY impacting operating margins. Companies with long-term supply contracts less affected.`, date: 'Jan 2026', source: 'Industry Report', sentiment: 'risk' },
    { id: 8, cat: 'mca', icon: '📋', title: `${name} annual compliance status`, desc: `All mandatory annual filings completed on time. Board composition compliant with Companies Act 2013 requirements.`, date: 'Jan 2026', source: 'MCA21 Portal', sentiment: 'positive' },
  ];
}
