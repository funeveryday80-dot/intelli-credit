'use strict';
// ═══════════════════════════════════════════════════════════
// PART 2 — Research, Profile, Analytics Charts, Insights,
//           CAM Report, Loan Calculator, Stress Test
// ═══════════════════════════════════════════════════════════

// ─── Research Agent ───────────────────────────────────────────
const RESEARCH_STEPS = [
  'Querying Economic Times for company news...',
  'Searching MCA21 portal for director filings...',
  'Checking eCourts for active litigation...',
  'Scanning RBI circulars for sector headwinds...',
  'Analysing IBEF sector reports...',
  'Cross-referencing CIBIL Commercial signals...',
  'Synthesising findings with Gemini AI...',
  'Research complete — 10 intelligence items found.',
];

function runResearch() {
  const company = document.getElementById('research-company').value.trim() || state.company || 'Selected Company';
  state.company = company;
  document.getElementById('sidebar-company').innerHTML = `<strong style="color:var(--text-primary)">${company}</strong>`;
  const btn = document.getElementById('run-research-btn');
  btn.disabled = true; btn.textContent = 'Researching...';
  document.getElementById('research-results').innerHTML = '';
  document.getElementById('research-summary').classList.add('hidden');
  document.getElementById('research-loading').classList.remove('hidden');
  document.getElementById('sentiment-bar-wrap').style.display = 'none';
  let step = 0;
  const si = setInterval(() => { document.getElementById('research-step').textContent = RESEARCH_STEPS[step++]; if (step >= RESEARCH_STEPS.length) clearInterval(si); }, 700);

  // Dynamically adapt research items if not demo
  const itemsToUse = DEMO.research.map(item => {
    if (state.isDemo) return item;
    const name = state.company || 'Selected Company';
    return {
      ...item,
      title: item.title.replace(/Apex Industrial/g, name).replace(/Apex/g, name),
      desc: item.desc.replace(/Apex Industrial/g, name).replace(/Apex/g, name)
    };
  });

  let ci = 0;
  const ri = setInterval(() => { if (ci < itemsToUse.length) { appendResearchCard(itemsToUse[ci++]); } else clearInterval(ri); }, 450);
  setTimeout(() => {
    clearInterval(si); clearInterval(ri);
    document.getElementById('research-loading').classList.add('hidden');
    state.researchItems = itemsToUse;
    renderResearchCards(state.researchItems);
    updateSentimentBar(state.researchItems);
    renderResearchSummary();
    document.getElementById('research-summary').classList.remove('hidden');
    updateBadge('research', 10);
    updateMetrics(Object.keys(state.docsUploaded).length, 10, 5, '—');
    updateProgress(Math.max(65, parseInt(document.getElementById('global-progress').style.width) || 0));
    state.reportReady = true;
    document.getElementById('report-dot').className = 'status-dot ready';
    btn.disabled = false; btn.textContent = 'Run Research Agent';
    toast('Research Complete', '10 intelligence items found across 5 categories', 'success');
  }, RESEARCH_STEPS.length * 700 + 600);
}

function appendResearchCard(item) { document.getElementById('research-results').appendChild(createResearchCardEl(item)); }

function renderResearchCards(items) {
  const c = document.getElementById('research-results');
  if (!c) return;
  if (!state.company && items.length === 0) {
    showPageEmptyState(c, '🔍', 'Research Agent Standby', 'Run the Research Agent to scan market news, MCA filings, and legal records.');
    return;
  }
  c.innerHTML = '';
  items.forEach(i => c.appendChild(createResearchCardEl(i)));
}


function createResearchCardEl(item) {
  const d = document.createElement('div');
  d.className = `research-card ${item.sentiment}`; d.setAttribute('data-cat', item.cat);
  d.innerHTML = `<div class="card-icon">${item.icon}</div><div class="card-body"><div class="card-meta"><span class="card-category cat-${item.cat}">${item.cat.toUpperCase()}</span><span class="card-date">${item.date}</span><span class="card-source">📎 ${item.source}</span></div><div class="card-title">${item.title}</div><div class="card-desc">${item.desc}</div></div><div class="sentiment-chip sentiment-${item.sentiment}">${item.sentiment === 'risk' ? '🔴 Risk' : item.sentiment === 'positive' ? '🟢 Positive' : '🟡 Neutral'}</div>`;
  return d;
}

function filterResearch(cat, btn) {
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.research-card').forEach(c => { c.style.display = (cat === 'all' || c.dataset.cat === cat) ? 'flex' : 'none'; });
}

function updateSentimentBar(items) {
  const total = items.length || 1;
  const risks = items.filter(i => i.sentiment === 'risk').length;
  const pos = items.filter(i => i.sentiment === 'positive').length;
  const neu = items.filter(i => i.sentiment === 'neutral').length;
  document.getElementById('sb-risk').style.width = (risks / total * 100) + '%';
  document.getElementById('sb-neutral').style.width = (neu / total * 100) + '%';
  document.getElementById('sb-positive').style.width = (pos / total * 100) + '%';
  document.getElementById('sentiment-bar-wrap').style.display = 'flex';
}

function renderResearchSummary() {
  const items = state.researchItems;
  const container = document.getElementById('summary-grid');
  if (!container) return;
  if (!state.company && items.length === 0) {
    container.innerHTML = '<div style="color:var(--text-secondary);padding:20px;text-align:center;width:100%">Intelligence summary will appear after research completion</div>';
    return;
  }
  const risks = items.filter(r => r.sentiment === 'risk').length;
  const pos = items.filter(r => r.sentiment === 'positive').length;
  const neu = items.filter(r => r.sentiment === 'neutral').length;
  container.innerHTML = `<div class="summary-card"><div class="num red">${risks}</div><div class="lbl">Risk Signals</div></div><div class="summary-card"><div class="num green">${pos}</div><div class="lbl">Positive</div></div><div class="summary-card"><div class="num amber">${neu}</div><div class="lbl">Neutral / Watch</div></div>`;
}


// ─── Company Profile ─────────────────────────────────────────
const PROFILE = {
  meta: {
    get fullName() { return state.company || 'Selected Company'; },
    shortName: 'AICP',

    cin: 'L21091MH2001PLC132847', gstin: '27AABCA1234C1Z5',
    pan: 'AABCA1234C', tan: 'MUMA12345A', udyam: 'UDYAM-MH-023-0014576',
    sector: 'Manufacturing — Precision Engineering / Auto Ancillary',
    roc: 'RoC Mumbai', class: 'Public Limited',
    founded: '12th April 2001', employees: '1,850+',
    listed: 'BSE: 534782 · NSE: APEXIND',
    rating: 'BBB+ (CRISIL Stable)', mca_status: 'Active', cibil_rank: 'CMR-3 (Good)',
    reg_office: 'Unit 402, Corporate World, Andheri East, Mumbai — 400093',
    factories: '2 (Pune · Nashik SEZ)', bankers: 'SBI · HDFC Bank · BoB',
    auditor: 'S.R. Batliboi & Co. LLP', promoter_pledge: '0% (Nil)',
  },
  kpis: [
    { label: 'Revenue (FY25)', value: '₹847 Cr', trend: '+12.3% YoY', color: 'blue' },
    { label: 'PAT (FY25)', value: '₹62.3 Cr', trend: '+13.7% YoY', color: 'green' },
    { label: 'Net Worth', value: '₹312 Cr', trend: '+10.1% YoY', color: 'purple' },
    { label: 'Credit Score', value: '66/100', trend: 'Grade B', color: 'amber' },
    { label: 'DSCR', value: '1.31x', trend: '⚠ Below 1.5x', color: 'red' },
    { label: 'Market Cap', value: '₹1,240 Cr', trend: 'Mid-cap', color: 'cyan' },
  ],
  board: [
    { name: 'Vikram Sheth', role: 'CMD & Promoter', init: 'VS', din: '00834712', exp: '28 yrs' },
    { name: 'Priya Mehta', role: 'Independent Director', init: 'PM', din: '01234567', exp: '15 yrs' },
    { name: 'Rajesh Kumar', role: 'CFO & Whole-time Director', init: 'RK', din: '02345678', exp: '20 yrs' },
    { name: 'Anita Sharma', role: 'Non-Executive Director', init: 'AS', din: '03456789', exp: '12 yrs' },
    { name: 'Col. S. Iyer (Ret)', role: 'Independent Director', init: 'SI', din: '04567890', exp: '8 yrs' },
  ],
  subsidiaries: [
    { name: 'Apex Precision Tools Pvt Ltd', pct: '100%', type: 'Subsidiary', sector: 'Tooling', turn: '₹124 Cr' },
    { name: 'Apex Defence Components Ltd', pct: '74%', type: 'Subsidiary', sector: 'Defence', turn: '₹87 Cr' },
    { name: 'Apex Auto Parts Pvt Ltd', pct: '51%', type: 'Associate', sector: 'Auto Ancillary', turn: '₹212 Cr' },
    { name: 'Apex Nashik SEZ Unit', pct: '100%', type: 'Subsidiary', sector: 'Export', turn: '₹68 Cr' },
  ],
  compliance: [
    { label: 'GST Filing (FY25)', status: 'ok', detail: '✅ GSTR-3B filed · Turnover ₹722 Cr declared' },
    { label: 'MCA Annual Return', status: 'ok', detail: '✅ AOC-4 XBRL & MGT-7 filed for FY24' },
    { label: 'EPFO / ESIC', status: 'ok', detail: '✅ 1,850 employees registered & compliant' },
    { label: 'Income Tax (AY25-26)', status: 'ok', detail: '✅ ITR-6 filed · Refund pending ₹3.2 Cr' },
    { label: 'GST SCN (FY22)', status: 'warn', detail: '⚠️ ITC reversal demand ₹4.1 Cr — reply filed Mar 2025' },
    { label: 'NI Act Sec 138', status: 'danger', detail: '🔴 ICICI Bank — ₹8.2 Cr cheque dishonour — Hearing pending' },
  ],
  timeline: [
    { date: 'Feb 2026', text: 'Won DRDO defence order worth ₹120 Cr for precision components.', type: 'positive', icon: '🏆' },
    { date: 'Dec 2025', text: 'ISO 9001:2015 recertification completed. BSE filing confirmed.', type: 'positive', icon: '📋' },
    { date: 'Nov 2024', text: 'ICICI Bank filed NI Act Sec 138 case — ₹8.2 Cr cheque dishonour.', type: 'negative', icon: '⚠️' },
    { date: 'Oct 2025', text: 'GST SCN received for FY22 ITC reversal — ₹4.1 Cr demand.', type: 'negative', icon: '📌' },
    { date: 'Apr 2024', text: 'Nashik SEZ Unit commenced commercial production.', type: 'positive', icon: '🏭' },
    { date: 'Mar 2023', text: 'Director DIN 00834712 on MCA defaulter list — subsequently resolved.', type: 'neutral', icon: '📁' },
    { date: 'Apr 2022', text: 'Credit rating upgraded BBB → BBB+ by CRISIL (Stable outlook).', type: 'positive', icon: '📈' },
    { date: 'Apr 2001', text: `Incorporated as ${state.company || 'Selected Company'}, Mumbai.`, type: 'neutral', icon: '🏢' },

  ],
  shareholding: { labels: ['Promoters', 'FII/FPI', 'Mutual Funds', 'Retail Public', 'Others'], data: [62.3, 12.1, 9.4, 11.8, 4.4] },
};

function renderProfile() {
  const pageEl = document.getElementById('page-profile');
  if (!pageEl) return;

  // If no company loaded or not in demo mode and no data extracted, show an empty state prompting the user
  if (!state.company || (!state.isDemo && !state.extractedData)) {
    pageEl.innerHTML = `
        <div class="section-header">
          <h2>Company Profile</h2>
          <p>Shareholding structure, board composition, subsidiaries &amp; key events timeline</p>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:60vh;gap:18px;text-align:center;padding:40px">
          <div style="font-size:3.5rem">🏢</div>
          <h3 style="font-size:1.4rem;font-weight:700;color:var(--text-primary)">Profile Standby</h3>
          <p style="color:var(--text-secondary);max-width:420px">${state.company ? `Profile for <strong>${state.company}</strong> will be generated after document ingestion and research.` : 'Load the demo case or enter a company name in the Data Ingestor to begin.'}</p>
          <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center;margin-top:8px">
            <button class="btn btn-primary btn-lg" onclick="loadDemo()">Load Demo Case →</button>
            <button class="btn btn-ghost btn-lg" onclick="navigateTo('ingest')">Enter Company →</button>
          </div>
        </div>`;
    return;
  }

  // Use live state.company to override the profile name if possible
  const m = Object.assign({}, PROFILE.meta, {
    fullName: state.company || PROFILE.meta.fullName,
    shortName: (state.company || PROFILE.meta.fullName).split(' ').filter(w => w.length > 2).map(w => w[0]).join('').substring(0, 4).toUpperCase()
  });

  pageEl.innerHTML = `
    <div class="prof-hero">
      <div class="prof-hero-bg"></div>
      <div class="prof-hero-content">
        <div class="prof-hero-left">
          <div class="prof-logo-ring"><div class="prof-logo-inner">${m.shortName}</div></div>
          <div>
            <div class="prof-company-name">${m.fullName}</div>
            <div class="prof-tags-row">

              <span class="prof-tag blue">Manufacturing</span>
              <span class="prof-tag green">Listed · BSE &amp; NSE</span>
              <span class="prof-tag purple">${m.roc}</span>
              <span class="prof-tag amber">${m.class}</span>
            </div>
            <div class="prof-hero-stats">
              <div class="prof-hs"><span>Since</span><strong>${m.founded.split(' ').pop()}</strong></div>
              <div class="prof-hs-div"></div>
              <div class="prof-hs"><span>Employees</span><strong>${m.employees}</strong></div>
              <div class="prof-hs-div"></div>
              <div class="prof-hs"><span>Rating</span><strong>${m.rating}</strong></div>
              <div class="prof-hs-div"></div>
              <div class="prof-hs"><span>MCA</span><strong class="flag-ok">● Active</strong></div>
            </div>
          </div>
        </div>
        <div class="prof-hero-right">
          <div class="prof-credit-ring">
            <svg viewBox="0 0 120 120" width="120" height="120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="10"/>
              <circle cx="60" cy="60" r="50" fill="none" stroke="url(#profGrad)" stroke-width="10"
                stroke-linecap="round" stroke-dasharray="209.4" stroke-dashoffset="${(314.16 - (66 / 100) * 209.4).toFixed(1)}"
                transform="rotate(-90 60 60)"/>
              <defs><linearGradient id="profGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#3b82f6"/><stop offset="100%" stop-color="#8b5cf6"/>
              </linearGradient></defs>
            </svg>
            <div class="prof-credit-center"><div class="prof-credit-num">66</div><div class="prof-credit-lbl">Credit Score</div></div>
          </div>
          <div class="prof-grade-badge">Grade B — Moderate Risk</div>
          <div class="prof-cibil">CIBIL Rank: ${m.cibil_rank}</div>
        </div>
      </div>
    </div>

    <div class="prof-kpi-row">
      ${PROFILE.kpis.map(k => `<div class="prof-kpi-card prof-kpi-${k.color}">
        <div class="prof-kpi-value">${k.value}</div>
        <div class="prof-kpi-label">${k.label}</div>
        <div class="prof-kpi-trend">${k.trend}</div>
      </div>`).join('')}
    </div>

    <div class="prof-main-grid">
      <div class="prof-card">
        <div class="prof-card-title">🏛️ Entity Vitals</div>
        <div class="prof-vitals-grid">
          ${[['CIN', m.cin], ['GSTIN', m.gstin], ['PAN', m.pan], ['TAN', m.tan], ['Udyam', m.udyam], ['Listed', m.listed], ['Founded', m.founded], ['Employees', m.employees], ['Rating', m.rating], ['Auditor', m.auditor], ['Bankers', m.bankers], ['Promoter Pledge', m.promoter_pledge], ['Reg. Office', m.reg_office], ['Factories', m.factories]].map(([l, v]) => `
          <div class="prof-vital-row"><span class="prof-vital-label">${l}</span><span class="prof-vital-val">${v}</span></div>`).join('')}
        </div>
      </div>
      <div class="prof-card">
        <div class="prof-card-title">✅ Compliance Snapshot</div>
        <div class="prof-compliance-list">
          ${PROFILE.compliance.map(c => `<div class="prof-comp-item prof-comp-${c.status}">
            <div class="prof-comp-dot prof-comp-dot-${c.status}"></div>
            <div><div class="prof-comp-label">${c.label}</div><div class="prof-comp-detail">${c.detail}</div></div>
          </div>`).join('')}
        </div>
        <div class="prof-card-title" style="margin-top:20px">📊 Shareholding Pattern</div>
        <canvas id="shareholdingChart" height="170"></canvas>
        <div class="prof-share-breakdown">
          ${PROFILE.shareholding.labels.map((l, i) => { const cols = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#94a3b8']; return `<div class="prof-share-row"><span class="prof-share-dot" style="background:${cols[i]}"></span><span class="prof-share-label">${l}</span><span class="prof-share-pct">${PROFILE.shareholding.data[i]}%</span></div>`; }).join('')}
        </div>
      </div>
    </div>

    <div class="prof-board-grid-wrap prof-card">
      <div class="prof-card-title">👥 Board of Directors &amp; KMPs</div>
      <div class="prof-board-grid">
        ${PROFILE.board.map(b => `<div class="prof-board-card">
          <div class="prof-board-avatar">${b.init}</div>
          <div class="prof-board-name">${b.name}</div>
          <div class="prof-board-role">${b.role}</div>
          <div class="prof-board-din">DIN: ${b.din}</div>
          <div class="prof-board-exp">${b.exp} experience</div>
          <div class="prof-board-status flag-ok">● MCA Verified</div>
        </div>`).join('')}
      </div>
    </div>

    <div class="prof-sub-timeline-grid">
      <div class="prof-card">
        <div class="prof-card-title">🌐 Corporate Group Structure</div>
        <div class="prof-parent-node"><div class="prof-node-chip parent-chip">🏛️ ${m.fullName}</div><div class="prof-node-cin">${m.cin}</div></div>
        <div class="prof-sub-grid">
          ${PROFILE.subsidiaries.map(s => `<div class="prof-sub-card">
            <div class="prof-sub-pct">${s.pct}</div>
            <div class="prof-sub-name">${s.name}</div>
            <div class="prof-sub-meta">${s.type} · ${s.sector}</div>
            <div class="prof-sub-rev">Turnover: ${s.turn}</div>
          </div>`).join('')}
        </div>
      </div>
      <div class="prof-card">
        <div class="prof-card-title">📅 Key Events Timeline</div>
        <div class="prof-timeline">
          ${PROFILE.timeline.map(e => `<div class="prof-tl-item">
            <div class="prof-tl-left"><div class="prof-tl-icon-wrap prof-tl-${e.type}">${e.icon}</div><div class="prof-tl-connector"></div></div>
            <div class="prof-tl-body"><div class="prof-tl-date">${e.date}</div><div class="prof-tl-text">${e.text}</div></div>
          </div>`).join('')}
        </div>
      </div>
    </div>
    `;

  const ctx = document.getElementById('shareholdingChart').getContext('2d');
  if (state.charts.shareholding) state.charts.shareholding.destroy();
  state.charts.shareholding = new Chart(ctx, {
    type: 'doughnut',
    data: { labels: PROFILE.shareholding.labels, datasets: [{ data: PROFILE.shareholding.data, backgroundColor: ['rgba(99,102,241,0.85)', 'rgba(6,182,212,0.8)', 'rgba(16,185,129,0.8)', 'rgba(245,158,11,0.8)', 'rgba(148,163,184,0.6)'], borderWidth: 3, borderColor: 'rgba(5,8,16,0.8)', hoverOffset: 10 }] },
    options: { responsive: true, cutout: '65%', plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => `${c.label}: ${c.parsed}%` }, backgroundColor: 'rgba(10,15,30,0.9)', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 } }, animation: { animateScale: true } }
  });
}

// ─── Analytics Charts ────────────────────────────────────────
function initAnalyticsCharts() {
  const years = ['FY23', 'FY24', 'FY25'];
  const chartDefaults = { responsive: true, plugins: { legend: { labels: { color: '#94a3b8', font: { size: 11 } } }, tooltip: { backgroundColor: 'rgba(10,15,30,0.9)', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 } }, scales: { x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#475569' } }, y: { grid: { color: 'rgba(255,255,255,0.06)' }, ticks: { color: '#475569' } } } };

  if (!state.company || (!state.isDemo && !state.extractedData)) {
    const chartsWrap = document.getElementById('analytics-content');
    if (chartsWrap) {
      showPageEmptyState(chartsWrap, '📊', 'Analytics Standby', state.company ? `Financial analytics for <strong>${state.company}</strong> will be generated once document extraction is complete.` : 'Load a demo case or complete document ingestion to generate financial trend analysis.');
    }
    return;
  }

  // Destroy existing charts so they re-render with fresh data
  ['revPat', 'dscr', 'de', 'ocf', 'wcc', 'peer'].forEach(k => { if (state.charts[k]) { try { state.charts[k].destroy(); } catch (e) { } delete state.charts[k]; } });

  // Pick data source: use extractedData 3-year trends if available, else Apex demo defaults
  const ed = state.extractedData;
  const isDemoApex = state.isDemo && (!ed || !ed._rev3);
  const revData = ed && ed._rev3 ? ed._rev3 : [673, 754, 847];
  const patData = ed && ed._pat3 ? ed._pat3 : [44.1, 54.8, 62.3];
  const dscrData = ed && ed._dscr3 ? ed._dscr3 : [1.18, 1.26, 1.31];
  const deData = ed && ed._de3 ? ed._de3 : [2.10, 1.95, 1.82];
  const ocfData = ed && ed._ocf3 ? ed._ocf3 : [58, 69, 78];
  const patPctVal = ed ? parseFloat(ed.patMargin) : 7.4;
  const crVal = ed ? ed._cr : 1.18;
  const dscrFY25 = ed ? ed._dscr : 1.31;
  const deFY25 = ed ? ed._de : 1.82;

  // Dynamic debtor/inventory/creditor days — seeded from company name
  const seed = (state.company || 'apex').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const dbDays = [Math.round(45 + (seed % 20)), Math.round(42 + (seed % 18)), Math.round(38 + (seed % 15))];
  const invDays = [Math.round(35 + (seed % 15)), Math.round(37 + (seed % 14)), Math.round(40 + (seed % 12))];
  const crDays = [Math.round(30 + (seed % 12)), Math.round(33 + (seed % 11)), Math.round(36 + (seed % 10))];

  // Revenue & PAT
  state.charts.revPat = new Chart(document.getElementById('revPatChart').getContext('2d'), { type: 'bar', data: { labels: years, datasets: [{ label: 'Revenue (₹ Cr)', data: revData, backgroundColor: 'rgba(59,130,246,0.7)', borderRadius: 6 }, { label: 'PAT (₹ Cr)', data: patData, backgroundColor: 'rgba(16,185,129,0.7)', borderRadius: 6 }] }, options: { ...chartDefaults } });
  // DSCR
  const dscrMin = Math.max(0.8, Math.min(...dscrData) - 0.2);
  const dscrMax = Math.max(2.0, Math.max(...dscrData) + 0.3);
  state.charts.dscr = new Chart(document.getElementById('dscrChart').getContext('2d'), { type: 'line', data: { labels: years, datasets: [{ label: 'DSCR', data: dscrData, borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,0.15)', fill: true, tension: 0.4, pointBackgroundColor: '#6366f1', pointRadius: 5 }, { label: 'Benchmark (1.5x)', data: [1.5, 1.5, 1.5], borderColor: 'rgba(239,68,68,0.6)', borderDash: [6, 4], pointRadius: 0 }] }, options: { ...chartDefaults, scales: { ...chartDefaults.scales, y: { ...chartDefaults.scales.y, min: dscrMin, max: dscrMax } } } });
  // D/E
  const deColors = deData.map(v => v > 2.5 ? 'rgba(239,68,68,0.7)' : v > 1.5 ? 'rgba(245,158,11,0.7)' : 'rgba(16,185,129,0.7)');
  state.charts.de = new Chart(document.getElementById('deChart').getContext('2d'), { type: 'bar', data: { labels: years, datasets: [{ label: 'D/E Ratio', data: deData, backgroundColor: deColors, borderRadius: 6 }] }, options: { ...chartDefaults } });
  // OCF
  state.charts.ocf = new Chart(document.getElementById('ocfChart').getContext('2d'), { type: 'line', data: { labels: years, datasets: [{ label: 'Op. Cash Flow (₹Cr)', data: ocfData, borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.15)', fill: true, tension: 0.4, pointBackgroundColor: '#10b981', pointRadius: 5 }] }, options: { ...chartDefaults } });
  // WCC
  state.charts.wcc = new Chart(document.getElementById('wccChart').getContext('2d'), { type: 'bar', data: { labels: years, datasets: [{ label: 'Debtor Days', data: dbDays, backgroundColor: 'rgba(6,182,212,0.7)', borderRadius: 4 }, { label: 'Inventory Days', data: invDays, backgroundColor: 'rgba(245,158,11,0.6)', borderRadius: 4 }, { label: 'Creditor Days', data: crDays, backgroundColor: 'rgba(139,92,246,0.6)', borderRadius: 4 }] }, options: { ...chartDefaults } });
  // Peer benchmark horizontal
  state.charts.peer = new Chart(document.getElementById('peerChart').getContext('2d'), { type: 'bar', data: { labels: ['DSCR', 'D/E (inv)', 'PAT Margin (%)', 'Current Ratio'], datasets: [{ label: state.company || 'Borrowing Entity', data: [dscrFY25, +(1 / deFY25 * 5).toFixed(2), patPctVal, crVal], backgroundColor: 'rgba(99,102,241,0.75)', borderRadius: 6 }, { label: 'Sector Avg', data: [1.6, +(1 / 1.5 * 5).toFixed(2), 8.5, 1.4], backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 6 }] }, options: { ...chartDefaults, indexAxis: 'y', plugins: { ...chartDefaults.plugins, legend: { ...chartDefaults.plugins.legend, position: 'bottom' } } } });

  // Ratio table — dynamic values
  const icRatio = ed ? (dscrFY25 * 1.8 + 0.5).toFixed(1) : '2.8';
  const atRatio = ed ? (ed._rev / (ed._nw * 1.6 + 50)).toFixed(1) : '1.6';
  const roeVal = ed ? ((ed._pat / ed._nw) * 100).toFixed(1) : '16.2';
  const dscrCls = dscrFY25 >= 1.5 ? 'good' : dscrFY25 >= 1.25 ? 'ok' : 'danger';
  const deCls = deFY25 <= 1.5 ? 'good' : deFY25 <= 2.5 ? 'ok' : 'danger';
  const crCls = crVal >= 1.25 ? 'good' : crVal >= 1.0 ? 'ok' : 'danger';
  document.getElementById('ratio-table').innerHTML = [
    { name: 'DSCR', val: `${dscrFY25}x`, cls: dscrCls, bench: 'Benchmark: ≥1.5x' },
    { name: 'Debt / Equity', val: `${deFY25}x`, cls: deCls, bench: 'Sector avg: 1.5x' },
    { name: 'Current Ratio', val: `${crVal}x`, cls: crCls, bench: 'Benchmark: ≥1.25x' },
    { name: 'PAT Margin', val: `${patPctVal}%`, cls: patPctVal >= 8 ? 'good' : patPctVal >= 5 ? 'ok' : 'danger', bench: 'Sector avg: 8.5%' },
    { name: 'Interest Cover', val: `${icRatio}x`, cls: parseFloat(icRatio) >= 2.5 ? 'good' : 'ok', bench: 'Benchmark: ≥2.5x' },
    { name: 'Asset Turnover', val: `${atRatio}x`, cls: 'ok', bench: 'Healthy' },
    { name: 'ROE', val: `${roeVal}%`, cls: parseFloat(roeVal) >= 15 ? 'good' : 'ok', bench: 'Sector avg: 16%' },
    { name: 'Promoter Holding', val: ed ? ed.promoterHolding : '62.3%', cls: 'good', bench: 'Preferred: >50%' },
  ].map(r => `<div class="ratio-item"><div class="ratio-name">${r.name}</div><div class="ratio-value ${r.cls}">${r.val}</div><div class="ratio-bench">${r.bench}</div></div>`).join('');
}

// ─── Primary Insights ─────────────────────────────────────────
const templates = {
  site: {
    positive: 'Factory visited. Machinery running at 85%+ capacity. Workforce fully engaged. Raw material at healthy 45 days. Excellent housekeeping and safety standards. No idle equipment observed.',
    negative: 'Factory found operating at ~40% capacity. Large idle equipment on shop floor. Finished goods inventory elevated — possible demand slowdown or channel stuffing. Deferred maintenance visible.',
    neutral: 'Factory visit conducted. Capacity utilisation approximately 60%. Some older machines noted with deferred maintenance. Operations appeared normal with no major concerns.',
  },
  mgmt: {
    positive: 'Management provided clear, data-backed responses. CMD has 28 years industry experience. Succession planning in place. ESG initiatives underway. Strong governance culture observed.',
    negative: 'Management appeared evasive on Q3 GST discrepancy queries. CMD unable to produce reconciliation on-the-spot. Financial controller appeared hesitant during balance sheet walk-through.',
  },
};
function insertTemplate(type, mood) { document.getElementById(type + '-notes').value = templates[type][mood]; analyzeInsight(); }

let radarChart = null;
function analyzeInsight() {
  const site = document.getElementById('site-notes').value.toLowerCase();
  const mgmt = document.getElementById('mgmt-notes').value.toLowerCase();
  const impacts = []; let delta = 0;
  if (site.includes('40%') || site.includes('idle') || site.includes('slow')) { impacts.push({ text: 'Low factory utilisation (≤40%) — significant underutilisation risk', delta: -10, cls: 'neg' }); delta -= 10; }
  else if (site.includes('85%') || site.includes('full') || site.includes('efficient')) { impacts.push({ text: 'High factory utilisation (85%+) confirms operational strength', delta: +6, cls: 'pos' }); delta += 6; }
  if (site.includes('inventory') && (site.includes('elevated') || site.includes('high'))) { impacts.push({ text: 'High finished goods inventory — demand concern / channel stuffing', delta: -5, cls: 'neg' }); delta -= 5; }
  if (site.includes('safety') || site.includes('excellent')) { impacts.push({ text: 'Strong safety & housekeeping — disciplined management', delta: +3, cls: 'pos' }); delta += 3; }
  if (mgmt.includes('evasive') || mgmt.includes('hesitant') || mgmt.includes('unable')) { impacts.push({ text: 'Management evasiveness on financials — Character C concern', delta: -12, cls: 'neg' }); delta -= 12; }
  if (mgmt.includes('succession') || mgmt.includes('28 years')) { impacts.push({ text: 'Strong management depth & succession planning', delta: +5, cls: 'pos' }); delta += 5; }
  if (mgmt.includes('clear') && mgmt.includes('data')) { impacts.push({ text: 'Transparent disclosure — positive for Character assessment', delta: +4, cls: 'pos' }); delta += 4; }
  const base = 68; const adj = Math.min(100, Math.max(0, base + delta));
  const el = document.getElementById('impact-items');
  if (!impacts.length) { el.innerHTML = '<div class="impact-placeholder">Start typing to see real-time AI analysis...</div>'; document.getElementById('adjusted-score-card').classList.add('hidden'); document.getElementById('insights-explanation').classList.add('hidden'); return; }
  el.innerHTML = impacts.map(i => `<div class="impact-item"><span class="impact-text">${i.text}</span><span class="impact-delta ${i.cls}">${i.delta > 0 ? '+' : ''}${i.delta} pts</span></div>`).join('');
  document.getElementById('adj-score-display').textContent = adj;
  document.getElementById('adj-grade-display').textContent = gradeLabel(adj);
  document.getElementById('adjusted-score-card').classList.remove('hidden');
  state.adjustedScore = adj;
  // Live radar
  renderRadar(adj, delta);
  document.getElementById('insights-explanation').innerHTML = `🤖 <strong>Gemini Analysis:</strong> Base score ${base} ${delta >= 0 ? 'increased' : 'reduced'} by <strong>${Math.abs(delta)} pts</strong> → <strong>${adj}</strong>. ${delta < -10 ? 'Management interview concerns are material — committee-level discussion recommended.' : delta > 5 ? 'Positive operational signals reinforce the lending case.' : 'Mixed signals — recommend a follow-up management call.'}`;
  document.getElementById('insights-explanation').classList.remove('hidden');
}
function renderRadar(score, delta) {
  const fc = state.fiveC; const adj = Math.max(0, Math.min(100, fc.capacity + delta * 0.4));
  const data = [fc.character, Math.round(adj), fc.capital, fc.collateral, fc.conditions];
  if (radarChart) { radarChart.data.datasets[0].data = data; radarChart.update('none'); return; }
  const ctx = document.getElementById('fiveCRadar').getContext('2d');
  radarChart = new Chart(ctx, { type: 'radar', data: { labels: ['Character', 'Capacity', 'Capital', 'Collateral', 'Conditions'], datasets: [{ label: 'Five-C Scores', data, borderColor: 'rgba(99,102,241,0.8)', backgroundColor: 'rgba(99,102,241,0.15)', pointBackgroundColor: '#6366f1', pointRadius: 4 }] }, options: { responsive: true, scales: { r: { min: 0, max: 100, grid: { color: 'rgba(255,255,255,0.07)' }, pointLabels: { color: '#94a3b8', font: { size: 11 } }, ticks: { color: '#475569', backdrop: false, stepSize: 25 } } }, plugins: { legend: { display: false } } } });
}

function saveInsights() {
  state.insights.site = document.getElementById('site-notes').value;
  state.insights.mgmt = document.getElementById('mgmt-notes').value;
  state.insights.other = document.getElementById('other-notes').value;
  state.reportReady = true;
  document.getElementById('report-dot').className = 'status-dot ready';
  updateProgress(90);
  state.stepsDone.add('insights');
  toast('Insights Saved', 'Primary observations applied to credit score', 'success');
  navigateTo('report');
  renderCAM();
}

// ─── CAM Report ───────────────────────────────────────────────
function generateFullCAM() {
  if (!state.reportReady && Object.keys(state.docsUploaded).length === 0) { loadDemo(); return; }
  state.reportReady = true; renderCAM();
  toast('CAM Generated', 'Full Credit Appraisal Memo ready', 'success');
}
function renderCAM() {
  if (!state.isDemo && !state.reportReady) {
    document.getElementById('empty-report').classList.remove('hidden');
    document.getElementById('cam-full').classList.add('hidden');
    return;
  }
  document.getElementById('empty-report').classList.add('hidden');
  const camEl = document.getElementById('cam-full'); camEl.classList.remove('hidden');

  // Determine if this is the original Apex Industrial demo or a dynamically analysed company
  const isApexDemo = state.isDemo && state.company === DEMO.company;

  if (isApexDemo) {
    // ── Original Apex Industrial demo ─────────────────────────
    const d = DEMO.decision;
    const fiveC = DEMO.fiveC;
    const score = 66;
    camEl.innerHTML = _buildCAMHTML(d, fiveC, score, DEMO.explain, DEMO.camSections, true);
    updateProgress(100); updateMetrics(6, 10, 5, '66');
  } else {
    // ── Dynamic company analysis ───────────────────────────────
    const score = state.baseScore || 65;
    const grade = score >= 80 ? 'A+' : score >= 75 ? 'A' : score >= 68 ? 'B+' : score >= 60 ? 'B' : score >= 50 ? 'C+' : 'C';
    const riskLabel = score >= 75 ? 'Low Risk' : score >= 65 ? 'Moderate Risk' : score >= 55 ? 'Elevated Risk' : 'High Risk';
    const verdictType = score >= 75 ? 'positive' : score >= 60 ? 'conditional' : 'negative';
    const verdict = score >= 75 ? 'APPROVED' : score >= 60 ? 'CONDITIONAL APPROVAL' : 'REFERRED TO COMMITTEE';
    const ed = state.extractedData || {};
    const dscrVal = ed._dscr || 1.2;
    const deVal = ed._de || 1.8;
    const revVal = ed.revenue || '₹500 Cr';
    const patVal = ed.pat || '₹40 Cr';
    const nwVal = ed._nw || 200;
    // Estimate loan amount as ~30% of net worth
    const loanAmt = Math.round(nwVal * 0.3 / 5) * 5;
    const rate = score >= 75 ? '10.75% p.a.' : score >= 65 ? '11.50% p.a.' : '12.50% p.a.';
    const rationale = score >= 75
      ? `Strong financial profile with DSCR ${dscrVal}x and improving leverage. Recommend approval at standard terms with quarterly monitoring covenants.`
      : score >= 60
        ? `Approved conditionally — DSCR ${dscrVal}x is marginal. Pre-disbursement conditions and enhanced monitoring covenants recommended.`
        : `Risk profile warrants committee review. Key concerns: DSCR ${dscrVal}x, D/E ${deVal}x. Obtain additional collateral before decision.`;
    const d = { verdict, type: verdictType, amount: `₹${loanAmt} Crores`, rate, tenor: '5 Years', rationale };
    // Build Five-C display from state.fiveC
    const fc = state.fiveC;
    const fiveCDisplay = {
      character: { score: fc.character, label: 'Character', color: fc.character >= 70 ? 'high' : 'mid', sub: fc.character >= 70 ? 'No adverse MCA/litigation findings' : 'Conduct thorough KYC & director background check' },
      capacity: { score: fc.capacity, label: 'Capacity', color: fc.capacity >= 70 ? 'high' : 'mid', sub: `DSCR ${dscrVal}x — ${fc.capacity >= 70 ? 'comfortable' : 'marginal, monitor closely'}` },
      capital: { score: fc.capital, label: 'Capital', color: fc.capital >= 70 ? 'high' : 'mid', sub: `Net Worth ₹${nwVal} Cr · D/E ${deVal}x` },
      collateral: { score: fc.collateral, label: 'Collateral', color: fc.collateral >= 70 ? 'high' : 'mid', sub: `Security coverage ${(nwVal * 0.5 / loanAmt).toFixed(1)}x estimated` },
      conditions: { score: fc.conditions, label: 'Conditions', color: fc.conditions >= 65 ? 'high' : 'mid', sub: 'Sector outlook assessed from recent intelligence signals' },
    };
    // Dynamic explain items from research signals
    const researchRisks = (state.researchItems || []).filter(r => r.sentiment === 'risk').slice(0, 3);
    const researchPos = (state.researchItems || []).filter(r => r.sentiment === 'positive').slice(0, 3);
    const explainItems = [
      ...researchRisks.map(r => ({ type: 'negative', icon: r.icon || '⚠️', text: r.title, weight: `-${3 + researchRisks.indexOf(r)} pts` })),
      ...researchPos.map(r => ({ type: 'positive', icon: r.icon || '✅', text: r.title, weight: `+${4 + researchPos.indexOf(r)} pts` })),
      { type: 'neutral', icon: '📄', text: `${state.company} MCA filings verified — board & compliance current.`, weight: '0 pts' },
    ];
    // Dynamic CAM sections
    const dynSections = [
      { icon: '🏢', title: 'Executive Summary', content: `<p class="cam-text"><strong>${state.company}</strong> seeks credit facilities for business expansion. Financial analysis based on documents ingested via IntelliCredit Auto-Analyse pipeline.</p><br><p class="cam-text">Recommendation: <strong>${verdict}</strong>, subject to pre-disbursement due diligence.</p>` },
      {
        icon: '📊', title: 'Financial Performance (3-Year Trend)', content: `<table class="cam-table"><thead><tr><th>Metric</th><th>FY23</th><th>FY24</th><th>FY25</th><th>Assessment</th></tr></thead><tbody>
        <tr><td>Revenue (₹ Cr)</td><td>${ed._rev3 ? ed._rev3[0] : '—'}</td><td>${ed._rev3 ? ed._rev3[1] : '—'}</td><td class="highlight">${ed._rev3 ? ed._rev3[2] : '—'}</td><td class="flag-ok">✅ Growing</td></tr>
        <tr><td>PAT (₹ Cr)</td><td>${ed._pat3 ? ed._pat3[0] : '—'}</td><td>${ed._pat3 ? ed._pat3[1] : '—'}</td><td class="highlight">${ed._pat3 ? ed._pat3[2] : '—'}</td><td class="${ed._pat > 0 ? 'flag-ok' : 'flag-warn'}">✅ Positive</td></tr>
        <tr><td>DSCR</td><td>${ed._dscr3 ? ed._dscr3[0] : '—'}</td><td>${ed._dscr3 ? ed._dscr3[1] : '—'}</td><td class="highlight">${dscrVal}x</td><td class="${dscrVal >= 1.5 ? 'flag-ok' : 'flag-warn'}">${dscrVal >= 1.5 ? '✅ Strong' : '⚠️ Marginal'}</td></tr>
        <tr><td>Debt/Equity</td><td>${ed._de3 ? ed._de3[0] : '—'}</td><td>${ed._de3 ? ed._de3[1] : '—'}</td><td class="highlight">${deVal}x</td><td class="${deVal <= 1.5 ? 'flag-ok' : 'flag-warn'}">${deVal <= 1.5 ? '✅ Low' : '⚠️ Moderate'}</td></tr>
        <tr><td>Operating CF</td><td>${ed._ocf3 ? '₹' + ed._ocf3[0] + ' Cr' : '—'}</td><td>${ed._ocf3 ? '₹' + ed._ocf3[1] + ' Cr' : '—'}</td><td class="highlight">${ed.ocf || '—'}</td><td class="flag-ok">✅ Positive</td></tr>
        </tbody></table>` },
      { icon: '✅', title: 'Credit Decision & Conditions', content: `<p class="cam-text"><strong>Decision: ${verdict} — ${d.amount} @ ${d.rate}</strong></p><br><p class="cam-text"><strong>Pre-Disbursement:</strong></p><ul style="color:var(--text-secondary);font-size:.875rem;line-height:2;padding-left:20px;margin-top:8px"><li>Latest audited financial statements + CA certificate</li><li>Promoter and director KYC verification</li><li>Valuation report for primary security</li><li>Board resolution authorising borrowing</li></ul>` },
    ];
    camEl.innerHTML = _buildCAMHTML(d, fiveCDisplay, score, explainItems, dynSections, false);
    updateProgress(100); updateMetrics(6, (state.researchItems || []).length, researchRisks.length, String(score));
  }
  document.getElementById('report-dot').className = 'status-dot ready';
}

function _buildCAMHTML(d, fiveC, score, explainItems, camSections, isApex) {
  const gradeLabel = score >= 80 ? 'A+' : score >= 75 ? 'A' : score >= 68 ? 'B+' : score >= 60 ? 'B' : score >= 50 ? 'C+' : 'C';
  const riskLabel = score >= 75 ? 'Low Risk' : score >= 65 ? 'Moderate Risk' : score >= 55 ? 'Elevated Risk' : 'High Risk';
  const fcBars = Object.values(fiveC).map(c => `<div class="c-bar"><div class="c-bar-header"><span class="c-bar-label">${c.label}</span><span class="c-bar-score ${c.color}">${c.score}/100</span></div><div class="c-bar-track"><div class="c-bar-fill ${c.color}" style="width:${c.score}%"></div></div><div class="c-bar-sub">${c.sub}</div></div>`).join('');
  const explainHTML = explainItems.map(e => `<div class="explain-item ${e.type}"><div class="explain-icon">${e.icon}</div><div class="explain-text">${e.text}</div><div class="explain-weight">${e.weight}</div></div>`).join('');
  const sectionsHTML = camSections.map((s, i) => `<div class="cam-section"><div class="cam-section-header" onclick="toggleSection(${i})"><span class="cam-section-icon">${s.icon}</span><span class="cam-section-title">${s.title}</span><span class="cam-section-toggle" id="toggle-${i}">▼</span></div><div class="cam-section-body ${i > 0 ? 'hidden' : ''}" id="section-body-${i}">${s.content}</div></div>`).join('');
  const securityAmt = isApex ? '₹337 Cr (3.5x)' : 'As per valuation report';
  return `
    <div class="decision-banner ${d.type}">
      <div class="decision-left"><h2>Credit Decision</h2><div class="decision-verdict">${d.verdict}</div><div class="decision-rationale">"${d.rationale}"</div></div>
      <div class="decision-right"><div class="decision-amount">${d.amount}</div><div class="decision-rate">${d.rate}</div><div class="decision-details">Tenor: ${d.tenor} &nbsp;|&nbsp; Security: ${securityAmt}</div></div>
    </div>
    <div class="cam-scorecard">
      <div class="five-c-radars"><h3>Five-C Scorecard</h3><div class="five-c-bars">${fcBars}</div>
        <div style="margin-top:16px;padding:12px;background:rgba(255,255,255,0.03);border-radius:10px;text-align:center">
          <div style="font-size:.72rem;color:var(--text-muted);font-weight:600;text-transform:uppercase;letter-spacing:.5px">Composite Score</div>
          <div style="font-size:2rem;font-weight:900;background:var(--gradient-primary);-webkit-background-clip:text;-webkit-text-fill-color:transparent">${score} / 100</div>
          <div style="font-size:1rem;font-weight:700;color:var(--text-secondary)">Grade ${gradeLabel} — ${riskLabel}</div>
        </div>
      </div>
      <div class="explainability-panel"><h3>🤖 AI Explainability</h3><div class="explain-items">${explainHTML}</div></div>
    </div>
    <div class="risk-heatmap-section"><h3>Risk Heatmap — Impact vs Likelihood</h3>${renderHeatmap()}</div>
    <div class="cam-sections">${sectionsHTML}</div>`;
}
function toggleSection(i) { document.getElementById('section-body-' + i).classList.toggle('hidden'); document.getElementById('toggle-' + i).classList.toggle('open'); }
function printCAM() { window.print(); }

function renderHeatmap() {
  const RISKS = [
    { id: 'R1', name: 'Revenue Inflation', impact: 5, likelihood: 3, owner: 'Finance / CFO', status: 'Open', mitigation: 'Forensic audit of debtors ledger; independent revenue verification' },
    { id: 'R2', name: 'GST Discrepancy', impact: 4, likelihood: 3, owner: 'Tax & Compliance', status: 'Monitoring', mitigation: 'CA certificate & ITC reconciliation pending; ₹14.2 Cr under query' },
    { id: 'R3', name: 'Litigation (NI Act)', impact: 3, likelihood: 4, owner: 'Legal Cell', status: 'Open', mitigation: 'Seek court clearance / status report; obtain legal undertaking from borrower' },
    { id: 'R4', name: 'DSCR Marginal', impact: 3, likelihood: 3, owner: 'Credit Committee', status: 'Watch', mitigation: 'Enhanced DSCR covenant at ≥1.25x; quarterly monitoring clause in sanction letter' },
    { id: 'R5', name: 'Steel Cost Rise', impact: 2, likelihood: 5, owner: 'Operations Risk', status: 'Open', mitigation: 'Price escalation clause in offtake contract; commodity hedging strategy' },
    { id: 'R6', name: 'Promoter Link', impact: 3, likelihood: 2, owner: 'Credit Team', status: 'Monitoring', mitigation: 'MCA defaulter director removed from board; confirm current status at sanction stage' },
    { id: 'R7', name: 'Sector Headwind', impact: 2, likelihood: 3, owner: 'Risk Department', status: 'Watch', mitigation: 'RBI tightening impact; monitor order book quarterly' },
    { id: 'R8', name: 'ITC Reversal', impact: 2, likelihood: 3, owner: 'Finance Team', status: 'Monitoring', mitigation: 'Potential ₹14.2 Cr reversal; provision recommended in credit terms' },
  ];

  // Standard 5×5 risk matrix zone mapping [impactRow=5..1 top to bottom][likelihoodCol=1..5]
  const ZONES = [
    ['medium', 'high', 'high', 'critical', 'critical'],   // impact = 5
    ['low', 'medium', 'high', 'high', 'critical'],        // impact = 4
    ['low', 'low', 'medium', 'high', 'high'],             // impact = 3
    ['low', 'low', 'low', 'medium', 'high'],              // impact = 2
    ['low', 'low', 'low', 'low', 'medium'],               // impact = 1
  ];
  const ZONE_LABELS = { critical: 'CRITICAL', high: 'HIGH', medium: 'MEDIUM', low: 'LOW' };

  // Build cell map: key="impact-likelihood" → [risks]
  const cellMap = {};
  RISKS.forEach(r => { const k = `${r.impact}-${r.likelihood}`; (cellMap[k] = cellMap[k] || []).push(r); });

  // Render 5×5 grid (impact=5→1 top to bottom, likelihood=1→5 left to right)
  let gridHTML = '';
  for (let imp = 5; imp >= 1; imp--) {
    for (let lik = 1; lik <= 5; lik++) {
      const zone = ZONES[5 - imp][lik - 1];
      const risks = cellMap[`${imp}-${lik}`] || [];
      const chips = risks.map(r => `<div class="rm-chip rm-chip-${zone}" title="${r.name}\n${r.mitigation}">${r.id}<span class="rm-chip-tip">${r.name}</span></div>`).join('');
      const scoreNum = imp * lik;
      gridHTML += `<div class="rm-cell rm-zone-${zone}">${chips}<span class="rm-cell-score">${scoreNum}</span></div>`;
    }
  }

  // Risk register rows
  const tableRows = RISKS.map(r => {
    const zone = ZONES[5 - r.impact][r.likelihood - 1];
    const score = r.impact * r.likelihood;
    const statusCls = r.status === 'Open' ? 'rr-open' : r.status === 'Monitoring' ? 'rr-monitor' : 'rr-watch';
    return `<tr>
          <td class="rr-id-cell">${r.id}</td>
          <td class="rr-name-cell">${r.name}</td>
          <td class="rr-num">${r.impact}</td>
          <td class="rr-num">${r.likelihood}</td>
          <td class="rr-score-cell rr-score-${zone}">${score}</td>
          <td><span class="rr-badge rr-zone-${zone}">${ZONE_LABELS[zone]}</span></td>
          <td class="rr-owner-cell">${r.owner}</td>
          <td><span class="rr-status ${statusCls}">${r.status}</span></td>
          <td class="rr-mit">${r.mitigation}</td>
        </tr>`;
  }).join('');

  return `
    <div class="rm-wrap">
      <div class="rm-top-section">
        <!-- Y-axis label -->
        <div class="rm-y-label-wrap">
          <div class="rm-y-label-txt">I M P A C T</div>
          <div class="rm-y-ticks">${[5, 4, 3, 2, 1].map(n => `<div class="rm-tick">${n}</div>`).join('')}</div>
        </div>
        <!-- Grid -->
        <div class="rm-grid-wrap">
          <div class="rm-grid">${gridHTML}</div>
          <!-- X-axis -->
          <div class="rm-x-axis">
            <div class="rm-x-ticks">${[1, 2, 3, 4, 5].map(n => `<div class="rm-tick">${n}</div>`).join('')}</div>
            <div class="rm-x-label-txt">L I K E L I H O O D</div>
          </div>
        </div>
        <!-- Legend + summary -->
        <div class="rm-right-panel">
          <div class="rm-legend">
            <div class="rm-leg-title">Risk Zones</div>
            ${['critical', 'high', 'medium', 'low'].map(z => `<div class="rm-leg-item"><span class="rm-leg-dot rm-zone-${z}"></span><span>${ZONE_LABELS[z]}</span></div>`).join('')}
          </div>
          <div class="rm-summary-cards">
            ${['critical', 'high', 'medium', 'low'].map(z => {
    const cnt = RISKS.filter(r => ZONES[5 - r.impact][r.likelihood - 1] === z).length;
    return `<div class="rm-sum-card rm-sum-${z}"><div class="rm-sum-num">${cnt}</div><div class="rm-sum-lbl">${ZONE_LABELS[z]}</div></div>`;
  }).join('')}
          </div>
          <div class="rm-chip-guide">
            <div class="rm-leg-title">Risk IDs</div>
            ${RISKS.map(r => `<div class="rm-id-row"><span class="rm-chip rm-chip-${ZONES[5 - r.impact][r.likelihood - 1]}">${r.id}</span><span class="rm-id-name">${r.name}</span></div>`).join('')}
          </div>
        </div>
      </div>
      <!-- Risk Register Table -->
      <div class="rm-register">
        <div class="rm-reg-title">📋 Risk Register — All ${RISKS.length} Identified Risks</div>
        <div class="rm-reg-scroll">
          <table class="rr-table">
            <thead><tr>
              <th>ID</th><th>Risk Name</th><th>Impact</th><th>Likelihood</th>
              <th>Score</th><th>Zone</th><th>Risk Owner</th><th>Status</th><th>Mitigation Measure</th>
            </tr></thead>
            <tbody>${tableRows}</tbody>
          </table>
        </div>
      </div>
    </div>`;
}


// ─── Loan Calculator ──────────────────────────────────────────
function openLoanModal() { document.getElementById('loan-modal').classList.remove('hidden'); runCalc(); }
function closeLoanModal() { document.getElementById('loan-modal').classList.add('hidden'); }
document.getElementById('loan-modal').addEventListener('click', e => { if (e.target === e.currentTarget) closeLoanModal(); });

function runCalc() {
  const P = parseFloat(document.getElementById('calc-amount').value || 95) * 1e7; // crores -> units
  const rAnn = parseFloat(document.getElementById('calc-rate').value || 12.5) / 100;
  const totalMonths = parseInt(document.getElementById('calc-tenor').value || 60);
  const moratorium = parseInt(document.getElementById('calc-moratorium').value || 6);
  const repayMonths = totalMonths - moratorium;
  const rMon = rAnn / 12;
  const emi = P * rMon * Math.pow(1 + rMon, repayMonths) / (Math.pow(1 + rMon, repayMonths) - 1);
  const totalPayable = emi * repayMonths + (P * rMon * moratorium);
  const totalInterest = totalPayable - P;
  const fmt = v => '₹' + (v >= 1e7 ? (v / 1e7).toFixed(2) + ' Cr' : (v >= 1e5 ? (v / 1e5).toFixed(1) + ' L' : '' + Math.round(v)));
  document.getElementById('calc-summary').innerHTML = `<div class="calc-stat"><div class="calc-stat-val">${fmt(emi)}</div><div class="calc-stat-lbl">Monthly EMI</div></div><div class="calc-stat"><div class="calc-stat-val">${fmt(totalInterest)}</div><div class="calc-stat-lbl">Total Interest</div></div><div class="calc-stat"><div class="calc-stat-val">${fmt(totalPayable)}</div><div class="calc-stat-lbl">Total Payable</div></div>`;
  let bal = P; const rows = []; let month = 1;
  for (let m = 1; m <= moratorium; m++) { const interest = bal * rMon; rows.push(`<tr><td>${month++}</td><td>${fmt(interest)}</td><td>₹0</td><td>${fmt(interest)}</td><td>${fmt(bal)}</td></tr>`); bal += interest; }
  for (let m = 1; m <= repayMonths && rows.length <= 60; m++) { const interest = bal * rMon; const principal = emi - interest; bal -= principal; rows.push(`<tr><td>${month++}</td><td>${fmt(interest)}</td><td>${fmt(principal)}</td><td>${fmt(emi)}</td><td>${fmt(Math.max(0, bal))}</td></tr>`); }
  document.getElementById('calc-schedule').innerHTML = `<table><thead><tr><th>Month</th><th>Interest</th><th>Principal</th><th>EMI</th><th>Balance</th></tr></thead><tbody>${rows.join('')}</tbody></table>`;
}

// ─── Stress Test ──────────────────────────────────────────────
function openStressModal() { document.getElementById('stress-modal').classList.remove('hidden'); runStress(); }
function closeStressModal() { document.getElementById('stress-modal').classList.add('hidden'); }
document.getElementById('stress-modal').addEventListener('click', e => { if (e.target === e.currentTarget) closeStressModal(); });

function runStress() {
  const revDecline = parseFloat(document.getElementById('s-revenue').value || 0) / 100;
  const rateUp = parseFloat(document.getElementById('s-rate').value || 0);
  const haircutUp = parseFloat(document.getElementById('s-haircut').value || 0) / 100;
  const costUp = parseFloat(document.getElementById('s-cost').value || 0) / 100;
  document.getElementById('s-revenue-val').textContent = Math.round(revDecline * 100) + '%';
  document.getElementById('s-rate-val').textContent = `+${rateUp}%`;
  document.getElementById('s-haircut-val').textContent = `+${Math.round(haircutUp * 100)}%`;
  document.getElementById('s-cost-val').textContent = `+${Math.round(costUp * 100)}%`;

  const resultsEl = document.getElementById('stress-results');
  if (!state.isDemo && !state.extractedData) {
    resultsEl.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 40px; text-align: center; background: rgba(255,255,255,0.02); border-radius: 12px; border: 1px dashed rgba(255,255,255,0.1)">
        <div style="font-size: 2.5rem; margin-bottom: 12px">🧪</div>
        <h4 style="color: var(--text-primary); margin-bottom: 8px">Stress Test Standby</h4>
        <p style="color: var(--text-secondary); font-size: 0.9rem; max-width: 300px; margin: 0 auto">Financial data for <strong>${state.company || 'the borrower'}</strong> is required to run multi-scenario stress tests.</p>
      </div>`;
    return;
  }

  const baseRev = 847; const basePat = 62.3; const baseDscr = 1.31; const baseCol = 337;
  const stressRev = baseRev * (1 + revDecline);
  const stressPat = Math.max(0, basePat * (1 + revDecline) * (1 - costUp));
  const stressDscr = Math.max(0, baseDscr * (1 + revDecline) * (1 - costUp) / (1 + rateUp * 0.08));
  const stressCol = baseCol * (1 - haircutUp);
  const getDscrClass = v => v >= 1.5 ? 'stress-ok' : v >= 1.25 ? 'stress-warn' : 'stress-danger';
  const getClass = v => v >= 0 ? 'stress-ok' : 'stress-danger';
  resultsEl.innerHTML = `
    <div class="stress-metric"><div class="stress-metric-val ${getClass(stressRev - baseRev)}">₹${stressRev.toFixed(0)} Cr</div><div class="stress-metric-lbl">Stressed Revenue</div><div class="stress-metric-base">Base: ₹${baseRev} Cr</div></div>
    <div class="stress-metric"><div class="stress-metric-val ${getClass(stressPat - basePat)}">₹${stressPat.toFixed(1)} Cr</div><div class="stress-metric-lbl">Stressed PAT</div><div class="stress-metric-base">Base: ₹${basePat} Cr</div></div>
    <div class="stress-metric"><div class="stress-metric-val ${getDscrClass(stressDscr)}">${stressDscr.toFixed(2)}x</div><div class="stress-metric-lbl">Stressed DSCR</div><div class="stress-metric-base">Base: ${baseDscr}x | Min: 1.25x</div></div>
    <div class="stress-metric"><div class="stress-metric-val ${stressCol >= 95 ? 'stress-ok' : 'stress-danger'}">₹${stressCol.toFixed(0)} Cr</div><div class="stress-metric-lbl">Adjusted Security</div><div class="stress-metric-base">Loan: ₹95 Cr</div></div>
    <div class="stress-metric"><div class="stress-metric-val ${stressDscr < 1.25 ? 'stress-danger' : stressDscr < 1.5 ? 'stress-warn' : 'stress-ok'}">${stressDscr < 1.0 ? '⚠️ Default Risk' : stressDscr < 1.25 ? '🔴 Below Covenant' : '✅ Serviceable'}</div><div class="stress-metric-lbl">Loan Serviceability</div><div class="stress-metric-base">Covenant: DSCR ≥ 1.25x</div></div>
    <div class="stress-metric"><div class="stress-metric-val ${stressCol / 95 >= 1 ? 'stress-ok' : stressCol / 95 >= 0.8 ? 'stress-warn' : 'stress-danger'}">${(stressCol / 95).toFixed(2)}x</div><div class="stress-metric-lbl">Security Cover Ratio</div><div class="stress-metric-base">Min required: 1.0x</div></div>`;
}

// ─── Sidebar Toggle ─────────────────────────────────────────
function toggleSidebar() {
  const collapsed = document.body.classList.toggle('sidebar-collapsed');
  const btn = document.getElementById('sidebar-toggle-btn');
  btn.querySelector('.toggle-icon').textContent = collapsed ? '▶' : '☰';
  btn.title = collapsed ? 'Expand Sidebar (Alt+S)' : 'Collapse Sidebar (Alt+S)';
  localStorage.setItem('ic-sidebar', collapsed ? 'collapsed' : 'expanded');
}

// ─── Light / Dark Mode Toggle ──────────────────────────────
function toggleTheme() {
  const isLight = document.body.classList.toggle('light-mode');
  const btn = document.getElementById('theme-toggle-btn');
  btn.textContent = isLight ? '☀️' : '🌙';
  btn.title = isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode';
  localStorage.setItem('ic-theme', isLight ? 'light' : 'dark');
  updateChartTheme(isLight);
  toast(isLight ? 'Light Mode' : 'Dark Mode', `Switched to ${isLight ? 'light' : 'dark'} theme`, 'info', 2000);
}

function updateChartTheme(light) {
  const tickColor = light ? '#334155' : '#475569';
  const gridColor = light ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.05)';
  const legColor = light ? '#334155' : '#94a3b8';
  Object.values(state.charts).forEach(chart => {
    try {
      ['x', 'y', 'r'].forEach(ax => {
        if (chart.options.scales && chart.options.scales[ax]) {
          if (chart.options.scales[ax].ticks) chart.options.scales[ax].ticks.color = tickColor;
          if (chart.options.scales[ax].grid) chart.options.scales[ax].grid.color = gridColor;
          if (chart.options.scales[ax].pointLabels) chart.options.scales[ax].pointLabels.color = legColor;
        }
      });
      if (chart.options.plugins?.legend?.labels) chart.options.plugins.legend.labels.color = legColor;
      chart.update('none');
    } catch (e) { }
  });
}

// ─── Boot ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('session-id').textContent = 'IC-2026-' + Math.floor(1000 + Math.random() * 9000);
  navigateTo('dashboard');

  // Restore sidebar preference from localStorage
  if (localStorage.getItem('ic-sidebar') === 'collapsed') {
    document.body.classList.add('sidebar-collapsed');
    const btn = document.getElementById('sidebar-toggle-btn');
    btn.querySelector('.toggle-icon').textContent = '▶';
    btn.title = 'Expand Sidebar (Alt+S)';
  }

  // Restore theme preference from localStorage
  if (localStorage.getItem('ic-theme') === 'light') {
    document.body.classList.add('light-mode');
    document.getElementById('theme-toggle-btn').textContent = '☀️';
    document.getElementById('theme-toggle-btn').title = 'Switch to Dark Mode';
  }

  // Keyboard shortcuts
  document.addEventListener('keydown', e => {
    if (e.altKey) {
      const map = { '1': 'dashboard', '2': 'profile', '3': 'ingest', '4': 'analytics', '5': 'research', '6': 'insights', '7': 'report' };
      if (map[e.key]) { e.preventDefault(); navigateTo(map[e.key]); }
      if (e.key === 's' || e.key === 'S') { e.preventDefault(); toggleSidebar(); }
      if (e.key === 't' || e.key === 'T') { e.preventDefault(); toggleTheme(); }
    }
    if (e.key === 'Escape') { closeLoanModal(); closeStressModal(); }
  });
});



