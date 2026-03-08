'use strict';
// ═══════════════════════════════════════════════════════════════════
//  FEATURES 7 — Early Warning System | NPA Score | MPBF | Covenant Tracker
// ═══════════════════════════════════════════════════════════════════

// ─── EWS Data ──────────────────────────────────────────────────────
const EWS_DATA = {
  signals: [
    { id: 'ews1', category: 'Financial', severity: 'critical', icon: '📉', title: 'DSCR Below Threshold', description: 'DSCR dropped to 1.31x — below the comfortable 1.50x benchmark. Trajectory declining for 2 consecutive quarters.', triggeredOn: 'Feb 2026', metric: 'DSCR: 1.31x', benchmark: 'Threshold: 1.50x', trend: -8, status: 'active', rbi: 'SMA-0 Watch' },
    { id: 'ews2', category: 'Fraud/GST', severity: 'critical', icon: '🧾', title: 'GST-Bank Credit Mismatch > 20%', description: 'Q3 FY25 bank credits exceeded GSTR-3B turnover by 27%. Possible revenue inflation or circular trading.', triggeredOn: 'Jan 2026', metric: 'Variance: +27%', benchmark: 'Safe Limit: <10%', trend: -27, status: 'active', rbi: 'Refer to CRILC' },
    { id: 'ews3', category: 'Legal', severity: 'high', icon: '⚖️', title: 'NI Act Litigation Active', description: 'ICICI Bank filed cheque dishonour case ₹8.2 Cr — Mumbai Sessions Court. Signals payment stress.', triggeredOn: 'Nov 2024', metric: 'Case: CC/4827/2024', benchmark: 'Zero tolerance', trend: -5, status: 'active', rbi: 'Flag for SMA-1 Review' },
    { id: 'ews4', category: 'Sector', severity: 'medium', icon: '🏭', title: 'Input Cost Stress — Steel +18% YoY', description: 'Steel prices up 18% year-on-year. Operating margins under pressure for manufacturing borrowers without long-term contracts.', triggeredOn: 'Feb 2026', metric: 'Steel Index: +18%', benchmark: 'EBITDA margin ≥12%', trend: -4, status: 'active', rbi: 'Sector Watch' },
    { id: 'ews5', category: 'Governance', severity: 'medium', icon: '👤', title: 'Director — Struck-Off Entity Link', description: 'CMD Vikram Sheth linked to Alpha Polymers Pvt Ltd (struck-off 2021). Governance concern flagged.', triggeredOn: 'Oct 2025', metric: 'MCA Check', benchmark: 'Clean Record', trend: -3, status: 'active', rbi: 'KYC Enhanced DD' },
    { id: 'ews6', category: 'Compliance', severity: 'low', icon: '📋', title: 'GST SCN Notice Pending', description: 'Section 73 show cause notice for ₹4.1 Cr excess ITC claim FY22. Adjudication stage. Contingent liability.', triggeredOn: 'Oct 2025', metric: 'Amount: ₹4.1 Cr', benchmark: 'No pending SCN', trend: -2, status: 'monitoring', rbi: 'Monitor' },
    { id: 'ews7', category: 'Financial', severity: 'low', icon: '📊', title: 'Inventory Days Rising', description: 'Inventory days increased from 52 to 68 in FY25. Working capital cycle elongating — potential liquidity risk.', triggeredOn: 'Mar 2025', metric: 'Inv Days: 68', benchmark: 'Sector Avg: 45d', trend: 0, status: 'monitoring', rbi: 'WC Review' },
  ],
  dscrHistory: [
    { period: 'Q1 FY24', value: 1.62 }, { period: 'Q2 FY24', value: 1.55 }, { period: 'Q3 FY24', value: 1.48 },
    { period: 'Q4 FY24', value: 1.42 }, { period: 'Q1 FY25', value: 1.39 }, { period: 'Q2 FY25', value: 1.35 },
    { period: 'Q3 FY25', value: 1.31 }, { period: 'Q4 FY25', value: 1.28 }
  ],
  thresholds: { dscr: 1.50, deRatio: 2.5, currentRatio: 1.2, gstVariance: 10 }
};

// ─── NPA PREDICTION DATA ───────────────────────────────────────────
const NPA_DATA = {
  overallScore: 38,
  trend: 'increasing',
  factors: [
    { name: 'DSCR Trajectory', weight: 25, score: 62, direction: 'negative', detail: 'Declining for 8 consecutive quarters. Currently marginal at 1.31x.' },
    { name: 'GST-Bank Discrepancy', weight: 20, score: 78, direction: 'negative', detail: 'Q3 FY25: 27% mismatch. Revenue quality questionable.' },
    { name: 'Legal Stress Signals', weight: 15, score: 55, direction: 'negative', detail: 'Active NI Act case (₹8.2 Cr). Payment default indicator.' },
    { name: 'Leverage (D/E Ratio)', weight: 15, score: 42, direction: 'neutral', detail: 'D/E at 1.82x — improving trend but still elevated.' },
    { name: 'Collateral Coverage', weight: 10, score: 18, direction: 'positive', detail: 'Strong — 3.5x cover. Acts as buffer against NPA loss.' },
    { name: 'Sector Headwinds', weight: 8, score: 45, direction: 'neutral', detail: 'Steel cost +18%. Defence tailwinds partially offset.' },
    { name: 'Promoter Quality', weight: 7, score: 50, direction: 'neutral', detail: 'Linked to struck-off entity. No personal litigation.' },
  ],
  cohortComparison: [
    { sector: 'Manufacturing (Precision)', npaRate: '4.2%', yourScore: '38%', percentile: '72nd' },
    { sector: 'All Manufacturing', npaRate: '6.8%', yourScore: '38%', percentile: '58th' },
    { sector: 'BSE Listed ₹500-1000 Cr', npaRate: '3.1%', yourScore: '38%', percentile: '81st' },
  ],
  rbiClassification: 'Standard Asset — SMA-0 Watch List',
  recommendation: 'Conditional Sanction with monthly DSCR review. Trigger enhanced monitoring if DSCR < 1.25x.'
};

// ─── MPBF DATA ─────────────────────────────────────────────────────
const MPBF_DATA = {
  method: 'Method II (Tandon Committee)',
  currentAssets: {
    rawMaterials: 48.5,
    wip: 22.3,
    finishedGoods: 38.7,
    bookDebts: 92.4,
    advancesToSuppliers: 12.1,
    otherCA: 8.6
  },
  currentLiabilities: {
    creditors: 45.2,
    advancesFromCustomers: 18.3,
    otherCL: 14.7
  },
  margins: { rawMaterials: 25, wip: 33.3, finishedGoods: 25, bookDebts: 25 },
  netSales: 847,
  holdingNorms: {
    rawMaterials: 30, wip: 15, finishedGoods: 25, bookDebts: 45
  },
  existingWCLimit: 75,
  proposedWCLimit: 95,
  bankingName: 'Working Capital Consortium (SBI Lead)'
};

// ─── COVENANT DATA ─────────────────────────────────────────────────
const COVENANT_DATA = {
  covenants: [
    { id: 'cov1', name: 'Minimum DSCR', type: 'Financial', threshold: '≥ 1.50x', current: '1.31x', status: 'breach', breach_since: 'Q3 FY25', cure_period: '90 days', action: 'Enhanced Monitoring + Waiver Request' },
    { id: 'cov2', name: 'Maximum Debt-Equity Ratio', type: 'Financial', threshold: '≤ 2.50x', current: '1.82x', status: 'compliant', breach_since: null, cure_period: null, action: null },
    { id: 'cov3', name: 'Minimum Current Ratio', type: 'Financial', threshold: '≥ 1.20x', current: '1.18x', status: 'breach', breach_since: 'Q4 FY25', cure_period: '90 days', action: 'Borrower to reduce short-term debt' },
    { id: 'cov4', name: 'Promoter Holding ≥ 51%', type: 'Non-Financial', threshold: '≥ 51%', current: '62.3%', status: 'compliant', breach_since: null, cure_period: null, action: null },
    { id: 'cov5', name: 'No Additional Indebtedness >₹25 Cr', type: 'Non-Financial', threshold: '< ₹25 Cr', current: 'Pending Verification', status: 'watch', breach_since: null, cure_period: null, action: 'Obtain CA Certificate' },
    { id: 'cov6', name: 'Minimum Net Worth', type: 'Financial', threshold: '≥ ₹280 Cr', current: '₹310 Cr', status: 'compliant', breach_since: null, cure_period: null, action: null },
    { id: 'cov7', name: 'Annual Audited Financial Submission', type: 'Reporting', threshold: 'Within 180 days of FY close', current: 'Submitted Oct 2025 ✅', status: 'compliant', breach_since: null, cure_period: null, action: null },
    { id: 'cov8', name: 'Quarterly QIS Submission', type: 'Reporting', threshold: 'Within 45 days of quarter end', current: '⚠️ Q4 FY25 — 18 days overdue', status: 'breach', breach_since: 'Feb 2026', cure_period: '30 days', action: 'Send reminder notice' },
    { id: 'cov9', name: 'No New Related-Party Loans', type: 'Non-Financial', threshold: '₹0', current: '₹0 (Verified)', status: 'compliant', breach_since: null, cure_period: null, action: null },
    { id: 'cov10', name: 'Insurance Cover (Assets)', type: 'Non-Financial', threshold: '≥ 110% of book value', current: '108% — ⚠️ Below threshold', status: 'watch', breach_since: null, cure_period: null, action: 'Renew insurance policy' },
  ]
};

// ═══════════════════════════════════════════════════════════════════
//  RENDER: EARLY WARNING SYSTEM PAGE
// ═══════════════════════════════════════════════════════════════════
function renderEWSPage() {
  const container = document.getElementById('ews-content');
  if (!container) return;
  if (!state.company || (!state.isDemo && !state.extractedData)) {
    showPageEmptyState(container, '⚠️', 'EWS Standby', state.company ? `Early Warning Systems for <strong>${state.company}</strong> will activate once financial and legal data is processed.` : 'Load a demo case to view early warning signals, DSCR trends and RBI SMA classification.');
    return;
  }
  const active = EWS_DATA.signals.filter(s => s.status === 'active');
  const monitoring = EWS_DATA.signals.filter(s => s.status === 'monitoring');
  const critical = EWS_DATA.signals.filter(s => s.severity === 'critical').length;
  const high = EWS_DATA.signals.filter(s => s.severity === 'high').length;

  container.innerHTML = `
    <!-- EWS Summary KPIs -->
    <div class="ews-kpi-row">
      <div class="ews-kpi critical">
        <div class="ews-kpi-num">${critical}</div>
        <div class="ews-kpi-label">🔴 Critical Signals</div>
      </div>
      <div class="ews-kpi high">
        <div class="ews-kpi-num">${high}</div>
        <div class="ews-kpi-label">🟠 High Signals</div>
      </div>
      <div class="ews-kpi monitoring">
        <div class="ews-kpi-num">${monitoring.length}</div>
        <div class="ews-kpi-label">🟡 Under Watch</div>
      </div>
      <div class="ews-kpi rbi">
        <div class="ews-kpi-num">SMA-0</div>
        <div class="ews-kpi-label">🏛️ RBI Classification</div>
      </div>
    </div>

    <!-- DSCR Trend Chart -->
    <div class="ews-dscr-card">
      <div class="ews-dscr-header">
        <h3>📉 DSCR Decline Trajectory — 8 Quarter View</h3>
        <span class="ews-badge critical-badge">DSCR BELOW THRESHOLD</span>
      </div>
      <canvas id="ewsDscrChart" height="80"></canvas>
    </div>

    <!-- Signals Grid -->
    <div class="ews-section-title">⚠️ Active Warning Signals (${active.length})</div>
    <div class="ews-signals-grid">
      ${active.map(s => renderEWSSignal(s)).join('')}
    </div>
    <div class="ews-section-title" style="margin-top:24px;">🟡 Monitoring Signals (${monitoring.length})</div>
    <div class="ews-signals-grid">
      ${monitoring.map(s => renderEWSSignal(s)).join('')}
    </div>

    <!-- Action Centre -->
    <div class="ews-action-centre">
      <h3>🎯 Recommended Actions</h3>
      <div class="ews-actions-list">
        <div class="ews-action-item critical-action">
          <div class="ews-action-num">1</div>
          <div><strong>Immediate:</strong> Obtain written reconciliation from borrower for Q3 FY25 GST-bank discrepancy of ₹61 Cr within 14 days.</div>
        </div>
        <div class="ews-action-item critical-action">
          <div class="ews-action-num">2</div>
          <div><strong>Immediate:</strong> Obtain legal counsel status report on CC/4827/2024 (NI Act — ICICI Bank ₹8.2 Cr). Any adverse order → immediate NPA review.</div>
        </div>
        <div class="ews-action-item high-action">
          <div class="ews-action-num">3</div>
          <div><strong>30 Days:</strong> Convene monthly DSCR review meeting. Trigger enhanced monitoring protocol if DSCR falls below 1.25x.</div>
        </div>
        <div class="ews-action-item medium-action">
          <div class="ews-action-num">4</div>
          <div><strong>60 Days:</strong> Request updated steel purchase contracts to assess actual margin impact. Review Q1 FY26 projections.</div>
        </div>
      </div>
    </div>
  `;

  setTimeout(() => renderEWSDscrChart(), 150);
}

function renderEWSSignal(s) {
  const colours = { critical: 'ews-sig-critical', high: 'ews-sig-high', medium: 'ews-sig-medium', low: 'ews-sig-low' };
  const cssCls = colours[s.severity] || 'ews-sig-low';
  return `
    <div class="ews-signal-card ${cssCls}">
      <div class="ews-sig-top">
        <span class="ews-sig-icon">${s.icon}</span>
        <div class="ews-sig-meta">
          <div class="ews-sig-title">${s.title}</div>
          <div class="ews-sig-cat">${s.category} · Triggered: ${s.triggeredOn}</div>
        </div>
        <span class="ews-severity-pill ${s.severity}">${s.severity.toUpperCase()}</span>
      </div>
      <div class="ews-sig-desc">${s.description}</div>
      <div class="ews-sig-metrics">
        <span class="ews-metric-chip">${s.metric}</span>
        <span class="ews-metric-chip bench">${s.benchmark}</span>
        <span class="ews-metric-chip rbi-chip">RBI: ${s.rbi}</span>
      </div>
    </div>`;
}

function renderEWSDscrChart() {
  const ctx = document.getElementById('ewsDscrChart');
  if (!ctx) return;
  if (state.charts && state.charts.ewsDscr) { state.charts.ewsDscr.destroy(); }
  state.charts = state.charts || {};
  state.charts.ewsDscr = new Chart(ctx, {
    type: 'line',
    data: {
      labels: EWS_DATA.dscrHistory.map(d => d.period),
      datasets: [
        {
          label: 'DSCR',
          data: EWS_DATA.dscrHistory.map(d => d.value),
          borderColor: '#f97316', backgroundColor: 'rgba(249,115,22,0.15)',
          borderWidth: 2.5, pointRadius: 5, pointBackgroundColor: '#f97316', tension: 0.4, fill: true
        },
        {
          label: 'Threshold (1.50x)',
          data: Array(EWS_DATA.dscrHistory.length).fill(1.50),
          borderColor: '#ef4444', borderWidth: 2, borderDash: [6, 3],
          pointRadius: 0, fill: false
        }
      ]
    },
    options: {
      responsive: true, plugins: { legend: { labels: { color: '#94a3b8' } } },
      scales: {
        x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.05)' } },
        y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.05)' }, min: 1.0, max: 1.8 }
      }
    }
  });
}

// ═══════════════════════════════════════════════════════════════════
//  RENDER: NPA PREDICTION SCORE PAGE
// ═══════════════════════════════════════════════════════════════════
function renderNPAPage() {
  const container = document.getElementById('npa-content');
  if (!container) return;
  if (!state.company || (!state.isDemo && !state.extractedData)) {
    showPageEmptyState(container, '🔮', 'NPA Score Standby', state.company ? `ML-powered NPA probability for <strong>${state.company}</strong> will be calculated after full data extraction.` : 'Load a demo case to view NPA probability score, ML factor decomposition and sector cohort benchmarking.');
    return;
  }
  const score = NPA_DATA.overallScore;
  const riskClass = score >= 60 ? 'high-risk' : score >= 35 ? 'medium-risk' : 'low-risk';
  const riskLabel = score >= 60 ? '🔴 HIGH RISK' : score >= 35 ? '🟠 MEDIUM RISK' : '🟢 LOW RISK';

  container.innerHTML = `
    <div class="npa-hero-row">
      <!-- Score Gauge -->
      <div class="npa-gauge-card ${riskClass}">
        <div class="npa-gauge-title">NPA Probability Score</div>
        <div class="npa-gauge-wrap">
          <svg viewBox="0 0 200 110" class="gauge-svg">
            <defs>
              <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#22c55e"/>
                <stop offset="50%" style="stop-color:#f59e0b"/>
                <stop offset="100%" style="stop-color:#ef4444"/>
              </linearGradient>
            </defs>
            <path d="M15,100 A85,85 0 0,1 185,100" fill="none" stroke="#1e293b" stroke-width="18" stroke-linecap="round"/>
            <path d="M15,100 A85,85 0 0,1 185,100" fill="none" stroke="url(#gaugeGrad)" stroke-width="18" stroke-linecap="round" stroke-dasharray="267" stroke-dashoffset="${267 - (267 * score / 100)}"/>
            <text x="100" y="95" text-anchor="middle" fill="white" font-size="32" font-weight="bold">${score}%</text>
            <text x="100" y="112" text-anchor="middle" fill="#94a3b8" font-size="10">12-Month NPA Probability</text>
          </svg>
        </div>
        <div class="npa-risk-label">${riskLabel}</div>
        <div class="npa-rbi-class">RBI: ${NPA_DATA.rbiClassification}</div>
      </div>

      <!-- Factor Breakdown -->
      <div class="npa-factors-card">
        <h3>🔬 ML Factor Decomposition</h3>
        <div class="npa-factors-list">
          ${NPA_DATA.factors.map(f => `
            <div class="npa-factor-row">
              <div class="npa-factor-top">
                <span class="npa-factor-name">${f.name}</span>
                <span class="npa-factor-weight">Weight: ${f.weight}%</span>
                <span class="npa-factor-score ${f.direction}">${f.score}%</span>
              </div>
              <div class="npa-factor-bar-wrap">
                <div class="npa-factor-bar ${f.direction}" style="width:${f.score}%"></div>
              </div>
              <div class="npa-factor-detail">${f.detail}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- Cohort Comparison -->
    <div class="npa-cohort-card">
      <h3>📊 Sector Cohort Benchmarking</h3>
      <div class="npa-cohort-table">
        <div class="npa-cohort-header">
          <span>Cohort</span><span>Industry NPA Rate</span><span>Your NPA Score</span><span>Percentile</span>
        </div>
        ${NPA_DATA.cohortComparison.map(c => `
          <div class="npa-cohort-row">
            <span>${c.sector}</span>
            <span class="flag-warn">${c.npaRate}</span>
            <span class="flag-warn">${c.yourScore}</span>
            <span class="flag-ok">${c.percentile} riskiest</span>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Recommendation -->
    <div class="npa-rec-card">
      <div class="npa-rec-icon">🤖</div>
      <div>
        <div class="npa-rec-title">AI Recommendation</div>
        <div class="npa-rec-text">${NPA_DATA.recommendation}</div>
        <div class="npa-rec-triggers">
          <strong>Auto-escalation triggers:</strong>
          <span class="trigger-chip">DSCR &lt; 1.25x</span>
          <span class="trigger-chip">Any new legal filing</span>
          <span class="trigger-chip">GST default</span>
          <span class="trigger-chip">QIS overdue &gt; 60 days</span>
        </div>
      </div>
    </div>
  `;
}

// ═══════════════════════════════════════════════════════════════════
//  RENDER: WORKING CAPITAL ASSESSMENT (MPBF — TANDON COMMITTEE)
// ═══════════════════════════════════════════════════════════════════
function renderMPBFPage() {
  const container = document.getElementById('mpbf-content');
  if (!container) return;
  if (!state.company || (!state.isDemo && !state.extractedData)) {
    showPageEmptyState(container, '🧮', 'MPBF Standby', state.company ? `Working capital assessment for <strong>${state.company}</strong> will be generated using Tandon Committee norms after financial entry.` : 'Load a demo case to view working capital assessment, MPBF calculation and holding norms analysis.');
    return;
  }
  const d = MPBF_DATA;
  const totalCA = Object.values(d.currentAssets).reduce((a, b) => a + b, 0);
  const totalCL = Object.values(d.currentLiabilities).reduce((a, b) => a + b, 0);
  const nwc = totalCA - totalCL;
  const mpbfMethod1 = totalCA * 0.75 - totalCL;
  const mpbfMethod2 = (totalCA - totalCA * 0.25) - totalCL;
  const mpbfMethod3 = (totalCA - d.currentAssets.rawMaterials * 0.25) - totalCL;

  container.innerHTML = `
    <div class="mpbf-method-badge">
      <span class="mpbf-badge-label">Using: ${d.method}</span>
      <span class="mpbf-badge-note">RBI Master Circular on Working Capital Finance</span>
    </div>

    <div class="mpbf-main-grid">
      <!-- Current Assets -->
      <div class="mpbf-card">
        <h3>📦 Current Assets (₹ Cr)</h3>
        <div class="mpbf-table">
          ${[
      ['Raw Materials', d.currentAssets.rawMaterials],
      ['Work-in-Progress (WIP)', d.currentAssets.wip],
      ['Finished Goods', d.currentAssets.finishedGoods],
      ['Book Debts (Receivables)', d.currentAssets.bookDebts],
      ['Advances to Suppliers', d.currentAssets.advancesToSuppliers],
      ['Other Current Assets', d.currentAssets.otherCA],
    ].map(([l, v]) => `<div class="mpbf-row"><span>${l}</span><span class="mpbf-val">₹${v} Cr</span></div>`).join('')}
          <div class="mpbf-row total"><span><strong>Total Current Assets</strong></span><span class="mpbf-val total-val"><strong>₹${totalCA.toFixed(1)} Cr</strong></span></div>
        </div>
      </div>

      <!-- Current Liabilities -->
      <div class="mpbf-card">
        <h3>💳 Current Liabilities (₹ Cr)</h3>
        <div class="mpbf-table">
          ${[
      ['Creditors (Trade Payables)', d.currentLiabilities.creditors],
      ['Advances from Customers', d.currentLiabilities.advancesFromCustomers],
      ['Other Current Liabilities', d.currentLiabilities.otherCL],
    ].map(([l, v]) => `<div class="mpbf-row"><span>${l}</span><span class="mpbf-val">₹${v} Cr</span></div>`).join('')}
          <div class="mpbf-row total"><span><strong>Total Current Liabilities</strong></span><span class="mpbf-val total-val"><strong>₹${totalCL.toFixed(1)} Cr</strong></span></div>
        </div>
        <div class="mpbf-nwc-box">
          <span>Net Working Capital (NWC)</span>
          <span class="${nwc > 0 ? 'flag-ok' : 'flag-danger'}">₹${nwc.toFixed(1)} Cr</span>
        </div>
      </div>

      <!-- MPBF Calculation -->
      <div class="mpbf-card mpbf-calc-card">
        <h3>🧮 MPBF — Tandon Committee Methods</h3>
        <div class="mpbf-methods">
          <div class="mpbf-method ${d.method.includes('I ') ? 'selected' : ''}">
            <div class="mpbf-method-name">Method I</div>
            <div class="mpbf-method-formula">75% of CA – CL (Excl. Bank Borrowings)</div>
            <div class="mpbf-method-result">₹${mpbfMethod1.toFixed(2)} Cr</div>
          </div>
          <div class="mpbf-method selected">
            <div class="mpbf-method-name">Method II ✅ (Adopted)</div>
            <div class="mpbf-method-formula">75% of (CA – CL excl. Bank Borrow.)</div>
            <div class="mpbf-method-result highlight-result">₹${mpbfMethod2.toFixed(2)} Cr</div>
          </div>
          <div class="mpbf-method">
            <div class="mpbf-method-name">Method III (Flexible)</div>
            <div class="mpbf-method-formula">CA – Core CA*0.25 – CL</div>
            <div class="mpbf-method-result">₹${mpbfMethod3.toFixed(2)} Cr</div>
          </div>
        </div>
        <div class="mpbf-conclusion">
          <div class="mpbf-conc-row">
            <span>MPBF (Calculated)</span><span class="highlight">₹${mpbfMethod2.toFixed(2)} Cr</span>
          </div>
          <div class="mpbf-conc-row">
            <span>Existing WC Limit</span><span>₹${d.existingWCLimit} Cr</span>
          </div>
          <div class="mpbf-conc-row">
            <span>Proposed WC Limit</span><span class="${d.proposedWCLimit <= mpbfMethod2 ? 'flag-ok' : 'flag-warn'}">₹${d.proposedWCLimit} Cr</span>
          </div>
          <div class="mpbf-conc-row">
            <span>Assessment</span>
            <span class="${d.proposedWCLimit <= mpbfMethod2 ? 'flag-ok' : 'flag-warn'}">
              ${d.proposedWCLimit <= mpbfMethod2 ? '✅ Within permissible limits' : '⚠️ Exceeds MPBF — review required'}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Holding Norms Analysis -->
    <div class="mpbf-holding-card">
      <h3>📅 Holding Norms Analysis (Days)</h3>
      <div class="holding-norms-grid">
        ${[
      { name: 'Raw Materials', actual: 30, norm: d.holdingNorms.rawMaterials },
      { name: 'WIP', actual: 12, norm: d.holdingNorms.wip },
      { name: 'Finished Goods', actual: 25, norm: d.holdingNorms.finishedGoods },
      { name: 'Book Debts', actual: 68, norm: d.holdingNorms.bookDebts },
    ].map(n => `
          <div class="holding-norm-item">
            <div class="hn-name">${n.name}</div>
            <div class="hn-bars">
              <div class="hn-bar-wrap">
                <div class="hn-bar actual-bar" style="width:${Math.min(n.actual / 90 * 100, 100)}%"></div>
                <span class="hn-bar-label">Actual: ${n.actual}d</span>
              </div>
              <div class="hn-bar-wrap">
                <div class="hn-bar norm-bar" style="width:${Math.min(n.norm / 90 * 100, 100)}%"></div>
                <span class="hn-bar-label">Norm: ${n.norm}d</span>
              </div>
            </div>
            <div class="hn-status ${n.actual > n.norm ? 'flag-warn' : 'flag-ok'}">${n.actual > n.norm ? '⚠️ Excess' : '✅ OK'}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ═══════════════════════════════════════════════════════════════════
//  RENDER: COVENANT BREACH TRACKER
// ═══════════════════════════════════════════════════════════════════
function renderCovenantPage() {
  const container = document.getElementById('covenant-content');
  if (!container) return;
  if (!state.company || (!state.isDemo && !state.extractedData)) {
    showPageEmptyState(container, '📜', 'Covenant Monitor Standby', state.company ? `Covenant compliance tracking for <strong>${state.company}</strong> will activate once the sanction terms are processed.` : 'Load a demo case to view covenant breach status, financial covenants and RBI guideline implications.');
    return;
  }
  const breached = COVENANT_DATA.covenants.filter(c => c.status === 'breach');
  const watching = COVENANT_DATA.covenants.filter(c => c.status === 'watch');
  const compliant = COVENANT_DATA.covenants.filter(c => c.status === 'compliant');
  const health = Math.round((compliant.length / COVENANT_DATA.covenants.length) * 100);

  container.innerHTML = `
    <!-- Summary Bar -->
    <div class="cov-summary-row">
      <div class="cov-kpi breach-kpi">
        <div class="cov-kpi-num">${breached.length}</div>
        <div class="cov-kpi-label">🔴 Breached</div>
      </div>
      <div class="cov-kpi watch-kpi">
        <div class="cov-kpi-num">${watching.length}</div>
        <div class="cov-kpi-label">🟡 On Watch</div>
      </div>
      <div class="cov-kpi ok-kpi">
        <div class="cov-kpi-num">${compliant.length}</div>
        <div class="cov-kpi-label">🟢 Compliant</div>
      </div>
      <div class="cov-kpi health-kpi">
        <div class="cov-kpi-num">${health}%</div>
        <div class="cov-kpi-label">📊 Covenant Health</div>
      </div>
    </div>

    <!-- Health Bar -->
    <div class="cov-health-bar-wrap">
      <div class="cov-health-label">Overall Covenant Health</div>
      <div class="cov-health-bar">
        <div class="cov-health-fill" style="width:${health}%;background:${health > 75 ? '#22c55e' : health > 50 ? '#f59e0b' : '#ef4444'}"></div>
      </div>
      <div class="cov-health-pct">${health}%</div>
    </div>

    <!-- Covenant Table -->
    <div class="cov-table-wrap">
      <table class="cov-table">
        <thead>
          <tr>
            <th>Covenant</th><th>Type</th><th>Threshold</th><th>Current Value</th><th>Status</th><th>Breach Since</th><th>Cure Period</th><th>Required Action</th>
          </tr>
        </thead>
        <tbody>
          ${COVENANT_DATA.covenants.map(c => `
            <tr class="cov-row cov-${c.status}">
              <td class="cov-name">${c.name}</td>
              <td><span class="cov-type-tag">${c.type}</span></td>
              <td class="cov-threshold">${c.threshold}</td>
              <td class="cov-current">${c.current}</td>
              <td><span class="cov-status-badge cov-${c.status}">
                ${c.status === 'breach' ? '🔴 Breach' : c.status === 'watch' ? '🟡 Watch' : '🟢 OK'}
              </span></td>
              <td class="cov-breach-date">${c.breach_since || '—'}</td>
              <td class="cov-cure">${c.cure_period || '—'}</td>
              <td class="cov-action">${c.action || '—'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- RBI Implications -->
    <div class="cov-rbi-note">
      <div class="cov-rbi-icon">🏛️</div>
      <div>
        <div class="cov-rbi-title">RBI Guidelines — Covenant Breach Implications</div>
        <div class="cov-rbi-desc">Under RBI's Prudential Framework (June 2019), banks must review accounts with financial covenant breaches within <strong>30 days</strong>. Persistent breach without cure triggers <strong>Resolution Plan</strong> under the Framework for Revitalisation of Distressed Assets. Current DSCR breach warrants formal notice to borrower.</div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="cov-action-row">
      <button class="btn btn-ghost" onclick="generateCovenantReport()">📄 Generate Covenant Review Letter</button>
      <button class="btn btn-primary" onclick="toast('Reminder Sent','Quarterly QIS reminder sent to borrower','success')">📧 Send QIS Reminder</button>
    </div>
  `;
}

function generateCovenantReport() {
  const breached = COVENANT_DATA.covenants.filter(c => c.status === 'breach');
  let text = `COVENANT BREACH NOTICE\n\nDear Mr. Vikram Sheth,\n\nThis is to inform you that your account (${state.company || 'Selected Company'}) has the following covenant breaches:\n\n`;

  breached.forEach((c, i) => {
    text += `${i + 1}. ${c.name}\n   Threshold: ${c.threshold} | Current: ${c.current}\n   Action Required: ${c.action}\n\n`;
  });
  text += `Please remedy the above within the specified cure period. Failure to do so may result in account classification review under RBI's Prudential Framework.\n\nYours sincerely,\nCredit Manager\nIntelliCredit Banking System`;
  const blob = new Blob([text], { type: 'text/plain' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'Covenant_Breach_Notice.txt'; a.click();
  toast('Notice Generated', 'Covenant breach letter downloaded', 'success');
}

// ═══════════════════════════════════════════════════════════════════
//  PAGE INIT HOOKs — called from navigateTo
// ═══════════════════════════════════════════════════════════════════
function initEWSPage() { renderEWSPage(); }
function initNPAPage() { renderNPAPage(); }
function initMPBFPage() { renderMPBFPage(); }
function initCovenantPage() { renderCovenantPage(); }
