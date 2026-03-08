'use strict';
// ═══════════════════════════════════════════════════════════════════
//  FEATURES 8 — Sanction Letter | Compliance Checklist | Doc Vault
//               Peer Benchmarking Dashboard | RBI CRILC | MBA
// ═══════════════════════════════════════════════════════════════════

// ─── SANCTION LETTER DATA ──────────────────────────────────────────
const SANCTION_DATA = {
  borrower: {
    get name() { return state.company || 'Selected Company'; },
    cin: 'L21091MH2001PLC132847',
    address: 'Plot No. 14, MIDC Industrial Area, Andheri East, Mumbai — 400 093',
    gstin: '27AABCA1234C1Z5'
  },

  bank: { name: 'State Bank of India', branch: 'Large Corporate Branch, Mumbai', branch_code: 'SBI/MUM/LC/0042', lm_name: 'Mr. Rajesh Kumar', lm_designation: 'Chief Manager (Credit)', sanctioning_authority: 'Zonal Credit Committee (ZCC)', ref: 'SBI/ZCC/2026/IC-1147' },
  loan: { type: 'Term Loan', amount: 95, amountWords: 'Rupees Ninety-Five Crores Only', purpose: 'Capacity expansion — Precision Engineering Unit, Pune Plant (Phase II)', roi: 12.50, roiType: 'Floating — MCLR + 2.25% p.a.', mclr: '10.25%', spread: '2.25%', tenor: 60, moratorium: 6, repayment: '54 monthly instalments post-moratorium', security: { primary: 'Equitable mortgage of Pune Plant (Fixed Assets) valued at ₹380 Cr; Hypothecation of stocks and book debts (₹95 Cr)', collateral: 'Personal guarantee of CMD Mr. Vikram Sheth and Director Mrs. Priya Sheth', additional: 'Assignment of DRDO defence contract cash flows' }, sanctionDate: '01 March 2026', validityDate: '30 June 2026' },
  covenants: [
    'Borrower shall maintain DSCR of not less than 1.50x on an annualised basis.',
    'Debt-Equity ratio shall not exceed 2.50x at any point during the loan tenure.',
    'Minimum Current Ratio of 1.20x to be maintained at all times.',
    'Promoter shareholding shall not fall below 51% without prior written consent of the Bank.',
    'No additional indebtedness exceeding ₹25 Cr shall be created without prior Bank consent.',
    'Quarterly Information System (QIS) reports to be submitted within 45 days of quarter close.',
    'Audited financial statements to be submitted within 180 days of financial year close.',
    'All statutory dues (GST, TDS, PF, ESI) shall be paid in time.',
    'DRDO contract assignment to be maintained for the loan period.',
    'No dividend declaration until all loan instalments for the year are serviced.',
  ],
  conditions_pre: [
    { id: 'pre1', text: 'Submission of written reconciliation for Q3 FY25 GST-bank discrepancy (₹61 Cr)', done: false },
    { id: 'pre2', text: 'Legal counsel opinion / status report on NI Act case CC/4827/2024', done: false },
    { id: 'pre3', text: 'Resolution of GST Section 73 show cause notice or escrow of ₹4.1 Cr', done: false },
    { id: 'pre4', text: 'Fresh valuation of Pune Plant from Bank-approved valuer', done: false },
    { id: 'pre5', text: 'Insurance of all primary securities for not less than 110% of book value', done: false },
    { id: 'pre6', text: 'Execution of loan agreement, mortgage deed, and all security documents', done: true },
    { id: 'pre7', text: 'Board resolution authorising borrowing and creation of security', done: true },
    { id: 'pre8', text: 'KYC verification of all directors and guarantors', done: true },
  ],
  conditions_post: [
    'Monthly sales and receivables statement to be submitted to the Bank.',
    'Quarterly insurance renewal certificates for all secured assets.',
    'Notification within 7 days of any new litigation exceeding ₹1 Cr.',
    'End-use certificate to be submitted within 3 months of disbursement.',
    'Site visit by Bank officer at least twice per year.',
  ]
};

let sanctionPreConditions = [...SANCTION_DATA.conditions_pre];

function renderSanctionPage() {
  const container = document.getElementById('sanction-content');
  if (!container) return;
  if (!state.company || (!state.isDemo && !state.extractedData)) {
    showPageEmptyState(container, '📄', 'Sanction Standby', state.company ? `The draft sanction letter for <strong>${state.company}</strong> will be prepared once the credit decision is finalized.` : 'Load a demo case to generate a sanction letter for the borrower.');
    return;
  }

  // Dynamically update borrower name from state if available
  if (typeof state !== 'undefined' && state.company) {
    SANCTION_DATA.borrower.name = state.company;
  }

  const completedPre = sanctionPreConditions.filter(c => c.done).length;
  const preProgress = Math.round((completedPre / sanctionPreConditions.length) * 100);

  container.innerHTML = `
    <div class="sanction-top-row">
      <!-- Pre-Disbursement Conditions -->
      <div class="sanction-precond-card">
        <h3>⏳ Pre-Disbursement Conditions (${completedPre}/${sanctionPreConditions.length})</h3>
        <div class="sanction-progress-bar"><div class="sanction-progress-fill" style="width:${preProgress}%"></div></div>
        <div class="precond-list">
          ${sanctionPreConditions.map((c, i) => `
            <div class="precond-item ${c.done ? 'done' : 'pending'}" onclick="togglePreCond(${i})">
              <span class="precond-check">${c.done ? '✅' : '⬜'}</span>
              <span class="precond-text">${c.text}</span>
            </div>
          `).join('')}
        </div>
        <div class="sanction-disburse-btn ${preProgress === 100 ? '' : 'disabled'}">
          ${preProgress === 100 ? '<button class="btn btn-primary btn-full" onclick="toast(\'Disbursement Initiated\',\'All pre-conditions met. Processing ₹95 Cr disbursement.\',\'success\')">🚀 Mark as Ready for Disbursement</button>' : '<div class="disburse-blocked">🔒 Complete all pre-conditions to unlock disbursement</div>'}
        </div>
      </div>

      <!-- Loan Summary -->
      <div class="sanction-summary-card">
        <h3>📋 Sanction Summary</h3>
        <div class="sanction-summary-rows">
          <div class="ss-row"><span>Borrower</span><strong>${SANCTION_DATA.borrower.name}</strong></div>
          <div class="ss-row"><span>Facility Type</span><strong>${SANCTION_DATA.loan.type}</strong></div>
          <div class="ss-row"><span>Amount</span><strong class="highlight">₹${SANCTION_DATA.loan.amount} Crores</strong></div>
          <div class="ss-row"><span>Interest Rate</span><strong>${SANCTION_DATA.loan.roi}% p.a. (Floating)</strong></div>
          <div class="ss-row"><span>Tenor</span><strong>${SANCTION_DATA.loan.tenor} Months</strong></div>
          <div class="ss-row"><span>Moratorium</span><strong>${SANCTION_DATA.loan.moratorium} Months</strong></div>
          <div class="ss-row"><span>Repayment</span><strong>${SANCTION_DATA.loan.repayment}</strong></div>
          <div class="ss-row"><span>Valid Until</span><strong>${SANCTION_DATA.loan.validityDate}</strong></div>
          <div class="ss-row"><span>Sanctioning Auth.</span><strong>${SANCTION_DATA.bank.sanctioning_authority}</strong></div>
          <div class="ss-row"><span>Pre-Conditions</span><span class="${preProgress === 100 ? 'flag-ok' : 'flag-warn'}">${preProgress}% complete</span></div>
        </div>
        <button class="btn btn-primary btn-full" style="margin-top:16px" onclick="generateSanctionLetter()">📄 Generate & Download Sanction Letter</button>
        <button class="btn btn-ghost btn-full" style="margin-top:8px" onclick="previewSanctionLetter()">👁️ Preview Full Letter</button>
      </div>
    </div>

    <!-- Covenants -->
    <div class="sanction-covenants-card">
      <h3>📜 Financial & Non-Financial Covenants (${SANCTION_DATA.covenants.length})</h3>
      <div class="sanction-covenants-list">
        ${SANCTION_DATA.covenants.map((c, i) => `<div class="cov-list-item"><span class="cov-list-num">${i + 1}.</span><span>${c}</span></div>`).join('')}
      </div>
    </div>

    <!-- Post-Disbursement Conditions -->
    <div class="sanction-postcond-card">
      <h3>📅 Post-Disbursement Conditions</h3>
      <div class="sanction-covenants-list">
        ${SANCTION_DATA.conditions_post.map((c, i) => `<div class="cov-list-item"><span class="cov-list-num">${i + 1}.</span><span>${c}</span></div>`).join('')}
      </div>
    </div>

    <!-- Sanction Letter Preview Modal -->
    <div id="sanction-letter-modal" class="modal-overlay hidden">
      <div class="modal-box modal-wide">
        <div class="modal-header">
          <h3>📄 Sanction Letter Preview</h3>
          <button class="modal-close" onclick="closeSanctionModal()">✕</button>
        </div>
        <div class="modal-body" id="sanction-letter-body"></div>
      </div>
    </div>
  `;
}

function togglePreCond(idx) {
  sanctionPreConditions[idx].done = !sanctionPreConditions[idx].done;
  renderSanctionPage();
  toast('Updated', `Condition ${sanctionPreConditions[idx].done ? 'marked complete' : 'marked pending'}`, 'info');
}

function previewSanctionLetter() {
  const d = SANCTION_DATA;
  const letterHTML = buildSanctionLetterHTML(d);
  document.getElementById('sanction-letter-body').innerHTML = letterHTML;
  document.getElementById('sanction-letter-modal').classList.remove('hidden');
}

function closeSanctionModal() {
  document.getElementById('sanction-letter-modal').classList.add('hidden');
}

function buildSanctionLetterHTML(d) {
  return `
    <div class="sanction-letter">
      <div class="sl-header">
        <div class="sl-bank-logo">🏦 ${d.bank.name}</div>
        <div class="sl-ref">${d.bank.ref}</div>
        <div class="sl-date">Date: ${d.loan.sanctionDate}</div>
      </div>
      <div class="sl-to">
        <strong>To,</strong><br>
        ${d.borrower.name}<br>
        ${d.borrower.address}<br>
        CIN: ${d.borrower.cin}
      </div>
      <div class="sl-subject">
        <strong>SUBJECT: Sanction of ${d.loan.type} of ₹${d.loan.amount} Crores to ${d.borrower.name}</strong>
      </div>
      <div class="sl-salutation">Dear Sir/Madam,</div>
      <p class="sl-para">We are pleased to advise that the Zonal Credit Committee of ${d.bank.name} has approved, at its meeting held on ${d.loan.sanctionDate}, the following credit facility to your company, subject to the terms and conditions mentioned herein.</p>
      <table class="sl-terms-table">
        <tr><th>Particulars</th><th>Terms</th></tr>
        <tr><td>Borrower</td><td>${d.borrower.name} (CIN: ${d.borrower.cin})</td></tr>
        <tr><td>Facility</td><td>${d.loan.type}</td></tr>
        <tr><td>Amount</td><td>₹${d.loan.amount} Crores (${d.loan.amountWords})</td></tr>
        <tr><td>Purpose</td><td>${d.loan.purpose}</td></tr>
        <tr><td>Rate of Interest</td><td>${d.loan.roi}% p.a. (${d.loan.roiType})</td></tr>
        <tr><td>Tenor</td><td>${d.loan.tenor} months from date of first disbursement</td></tr>
        <tr><td>Moratorium</td><td>${d.loan.moratorium} months</td></tr>
        <tr><td>Repayment</td><td>${d.loan.repayment}</td></tr>
        <tr><td>Primary Security</td><td>${d.loan.security.primary}</td></tr>
        <tr><td>Collateral Security</td><td>${d.loan.security.collateral}</td></tr>
        <tr><td>Additional Security</td><td>${d.loan.security.additional}</td></tr>
        <tr><td>Sanction Validity</td><td>${d.loan.validityDate} (Acceptance within 14 days)</td></tr>
      </table>
      <p class="sl-para"><strong>Financial Covenants:</strong></p>
      <ol class="sl-covenants-ol">${d.covenants.map(c => `<li>${c}</li>`).join('')}</ol>
      <p class="sl-para">This sanction is subject to pre-disbursement conditions being met in full. The Bank reserves the right to withdraw this offer if conditions are not met within the validity period.</p>
      <div class="sl-sign-block">
        <div>Yours faithfully,<br><br><br><strong>${d.bank.lm_name}</strong><br>${d.bank.lm_designation}<br>${d.bank.name}, ${d.bank.branch}<br>Branch Code: ${d.bank.branch_code}</div>
      </div>
    </div>`;
}

function generateSanctionLetter() {
  const d = SANCTION_DATA;
  let text = `${d.bank.name.toUpperCase()}\n${d.bank.branch}\n\nRef: ${d.bank.ref}\nDate: ${d.loan.sanctionDate}\n\nTo,\n${d.borrower.name}\n${d.borrower.address}\n\nSUBJECT: SANCTION OF ${d.loan.type.toUpperCase()} OF ₹${d.loan.amount} CRORES\n\nDear Sir/Madam,\n\nWe are pleased to approve the following credit facility:\n\nFacility: ${d.loan.type}\nAmount: ₹${d.loan.amount} Crores (${d.loan.amountWords})\nPurpose: ${d.loan.purpose}\nRate of Interest: ${d.loan.roi}% p.a. Floating (MCLR ${d.loan.mclr} + Spread ${d.loan.spread})\nTenor: ${d.loan.tenor} months\nMoratorium: ${d.loan.moratorium} months\nRepayment: ${d.loan.repayment}\n\nPrimary Security: ${d.loan.security.primary}\nCollateral: ${d.loan.security.collateral}\n\nFINANCIAL COVENANTS:\n${d.covenants.map((c, i) => `${i + 1}. ${c}`).join('\n')}\n\nThis sanction is valid until ${d.loan.validityDate}.\n\nYours faithfully,\n${d.bank.lm_name}\n${d.bank.lm_designation}\n${d.bank.name}`;
  const blob = new Blob([text], { type: 'text/plain' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `Sanction_Letter_${SANCTION_DATA.borrower.cin}.txt`; a.click();
  toast('Sanction Letter Generated', 'Full sanction letter downloaded successfully', 'success');
}

// ═══════════════════════════════════════════════════════════════════
//  COMPLIANCE CHECKLIST
// ═══════════════════════════════════════════════════════════════════
const COMPLIANCE_DATA = {
  categories: [
    {
      name: 'KYC & Identity', icon: '🪪',
      items: [
        { id: 'kyc1', label: 'CIN Verification (MCA21)', done: true, mandatory: true, doc: 'MCA ROC Extract' },
        { id: 'kyc2', label: 'PAN Card of Company', done: true, mandatory: true, doc: 'Self-attested copy' },
        { id: 'kyc3', label: 'Director KYC (All Directors)', done: true, mandatory: true, doc: 'Aadhaar + PAN' },
        { id: 'kyc4', label: 'GSTIN Verification', done: true, mandatory: true, doc: 'GST Portal Extract' },
        { id: 'kyc5', label: 'UDYAM Registration', done: false, mandatory: false, doc: 'MSME Certificate' },
      ]
    },
    {
      name: 'Legal & Collateral', icon: '⚖️',
      items: [
        { id: 'leg1', label: 'Legal Opinion on Title of Mortgaged Properties', done: false, mandatory: true, doc: 'Empanelled Advocate Certificate' },
        { id: 'leg2', label: 'CERSAI Registration of Existing Charges', done: true, mandatory: true, doc: 'CERSAI Search Certificate' },
        { id: 'leg3', label: 'ROC Search — Existing Charges (Form CHG-1)', done: true, mandatory: true, doc: 'MCA21 Charge Search' },
        { id: 'leg4', label: 'Land Record Search (7/12 Utara)', done: false, mandatory: true, doc: 'Revenue Records' },
        { id: 'leg5', label: 'Property Valuation Report — Bank Approved Valuer', done: false, mandatory: true, doc: 'Valuation Certificate' },
        { id: 'leg6', label: 'Environmental Clearance / NOC (if applicable)', done: true, mandatory: false, doc: 'State Pollution Board' },
      ]
    },
    {
      name: 'Financial Documents', icon: '📊',
      items: [
        { id: 'fin1', label: 'Audited Balance Sheet FY23, FY24, FY25', done: true, mandatory: true, doc: 'CA Certified Copy' },
        { id: 'fin2', label: 'ITR for last 3 years (Company + Promoters)', done: true, mandatory: true, doc: 'IT Portal Download' },
        { id: 'fin3', label: 'GSTR-3B for last 12 months', done: true, mandatory: true, doc: 'GST Portal Extract' },
        { id: 'fin4', label: 'Bank Statement — 12 months (all banks)', done: true, mandatory: true, doc: 'Bank Certified Copies' },
        { id: 'fin5', label: 'CA Certificate — No Direct Tax Arrears', done: false, mandatory: true, doc: 'Form 26AS / CA Cert' },
        { id: 'fin6', label: 'Provisional Financials (Current Year)', done: false, mandatory: false, doc: 'Management Accounts' },
      ]
    },
    {
      name: 'Credit Bureau & External', icon: '🔍',
      items: [
        { id: 'cib1', label: 'CIBIL Commercial Report (Company)', done: true, mandatory: true, doc: 'CIBIL / TransUnion' },
        { id: 'cib2', label: 'CIBIL Individual Report (All Directors)', done: true, mandatory: true, doc: 'Director CIBIL Score' },
        { id: 'cib3', label: 'CRILC Database Check', done: true, mandatory: true, doc: 'RBI CRILC Portal' },
        { id: 'cib4', label: 'Wilful Defaulter List Check (RBI)', done: true, mandatory: true, doc: 'RBI / IBA List' },
        { id: 'cib5', label: 'ECGC Watch List Check', done: false, mandatory: false, doc: 'ECGC Portal' },
      ]
    },
    {
      name: 'Pre-Disbursement', icon: '🚀',
      items: [
        { id: 'dis1', label: 'Board Resolution — Borrowing Powers', done: true, mandatory: true, doc: 'Certified Board Resolution' },
        { id: 'dis2', label: 'Loan Agreement Executed', done: false, mandatory: true, doc: 'Stamp Duty Paid' },
        { id: 'dis3', label: 'Mortgage Deed Registered', done: false, mandatory: true, doc: 'Sub-Registrar Receipt' },
        { id: 'dis4', label: 'Insurance Cover on Securities', done: false, mandatory: true, doc: 'Insurance Policy Copy' },
        { id: 'dis5', label: 'NACH Mandate / ECS Registration', done: false, mandatory: true, doc: 'Bank Form' },
        { id: 'dis6', label: 'Stock / Debtors Statement (D-Day)', done: false, mandatory: true, doc: 'CA Certified Statement' },
      ]
    }
  ]
};

let complianceItems = JSON.parse(JSON.stringify(COMPLIANCE_DATA));

function renderCompliancePage() {
  const container = document.getElementById('compliance-content');
  if (!container) return;
  if (!state.company || (!state.isDemo && !state.extractedData)) {
    showPageEmptyState(container, '✅', 'Compliance Standby', state.company ? `The pre-disbursal compliance checklist for <strong>${state.company}</strong> will be generated after document verification.` : 'Load a demo case to view pre-disbursal compliance checklist and status.');
    return;
  }

  const allItems = complianceItems.categories.flatMap(c => c.items);
  const mandatory = allItems.filter(i => i.mandatory);
  const doneCount = allItems.filter(i => i.done).length;
  const mandatoryDoneCount = mandatory.filter(i => i.done).length;
  const pct = Math.round((doneCount / allItems.length) * 100);
  const mandPct = Math.round((mandatoryDoneCount / mandatory.length) * 100);

  container.innerHTML = `
    <!-- Progress Summary -->
    <div class="comp-progress-row">
      <div class="comp-prog-card">
        <div class="comp-prog-nums"><span class="comp-prog-big">${doneCount}</span><span class="comp-prog-of">/ ${allItems.length}</span></div>
        <div class="comp-prog-label">Total Items Done</div>
        <div class="comp-prog-bar"><div class="comp-prog-fill" style="width:${pct}%;background:#6366f1"></div></div>
        <div class="comp-prog-pct">${pct}%</div>
      </div>
      <div class="comp-prog-card mandatory-card">
        <div class="comp-prog-nums"><span class="comp-prog-big">${mandatoryDoneCount}</span><span class="comp-prog-of">/ ${mandatory.length}</span></div>
        <div class="comp-prog-label">🔴 Mandatory Items Done</div>
        <div class="comp-prog-bar"><div class="comp-prog-fill" style="width:${mandPct}%;background:${mandPct === 100 ? '#22c55e' : '#ef4444'}"></div></div>
        <div class="comp-prog-pct">${mandPct}%</div>
      </div>
      <div class="comp-overall-status ${mandPct === 100 ? 'status-clear' : 'status-blocked'}">
        ${mandPct === 100 ? '✅ CLEAR FOR DISBURSEMENT' : `🔒 ${mandatory.length - mandatoryDoneCount} MANDATORY ITEMS PENDING`}
      </div>
    </div>

    <!-- Category Checklists -->
    ${complianceItems.categories.map((cat, ci) => {
    const catDone = cat.items.filter(i => i.done).length;
    return `
      <div class="comp-category-card">
        <div class="comp-cat-header" onclick="toggleCompCategory(${ci})">
          <span class="comp-cat-icon">${cat.icon}</span>
          <span class="comp-cat-name">${cat.name}</span>
          <span class="comp-cat-count ${catDone === cat.items.length ? 'all-done' : ''}">${catDone}/${cat.items.length}</span>
          <span class="comp-cat-chevron" id="chevron-${ci}">▼</span>
        </div>
        <div class="comp-cat-items" id="cat-items-${ci}">
          ${cat.items.map((item, ii) => `
            <div class="comp-item ${item.done ? 'comp-done' : ''}" onclick="toggleCompItem(${ci}, ${ii})">
              <span class="comp-item-check">${item.done ? '✅' : '⬜'}</span>
              <div class="comp-item-body">
                <span class="comp-item-label">${item.label}</span>
                ${item.mandatory ? '<span class="comp-mandatory-tag">Mandatory</span>' : '<span class="comp-optional-tag">Optional</span>'}
                <span class="comp-doc-hint">📄 ${item.doc}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>`;
  }).join('')}

    <button class="btn btn-ghost" style="margin-top:16px" onclick="exportComplianceReport()">📊 Export Compliance Report</button>
  `;
}

function toggleCompCategory(ci) {
  const el = document.getElementById(`cat-items-${ci}`);
  const ch = document.getElementById(`chevron-${ci}`);
  if (el) { el.classList.toggle('collapsed'); ch.textContent = el.classList.contains('collapsed') ? '▶' : '▼'; }
}

function toggleCompItem(ci, ii) {
  complianceItems.categories[ci].items[ii].done = !complianceItems.categories[ci].items[ii].done;
  renderCompliancePage();
}

function exportComplianceReport() {
  const allItems = complianceItems.categories.flatMap(cat =>
    cat.items.map(i => `[${i.done ? 'X' : ' '}] ${i.mandatory ? '*' : ' '} ${i.label} — ${i.doc}`)
  );
  const text = `COMPLIANCE CHECKLIST — ${SANCTION_DATA.borrower.name}\nDate: ${new Date().toLocaleDateString('en-IN')}\n\n* = Mandatory\n\n` + allItems.join('\n');
  const blob = new Blob([text], { type: 'text/plain' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'Compliance_Checklist.txt'; a.click();
  toast('Exported', 'Compliance report downloaded', 'success');
}

// ═══════════════════════════════════════════════════════════════════
//  DOCUMENT VAULT
// ═══════════════════════════════════════════════════════════════════
const VAULT_DATA = [
  { id: 'v1', name: 'Annual Report FY25', category: 'Financial', status: 'uploaded', size: '4.2 MB', uploaded: '28 Feb 2026', expiry: null, docType: 'PDF' },
  { id: 'v2', name: 'Annual Report FY24', category: 'Financial', status: 'uploaded', size: '3.8 MB', uploaded: '28 Feb 2026', expiry: null, docType: 'PDF' },
  { id: 'v3', name: 'Annual Report FY23', category: 'Financial', status: 'uploaded', size: '3.5 MB', uploaded: '28 Feb 2026', expiry: null, docType: 'PDF' },
  { id: 'v4', name: 'GSTR-3B (Q1–Q4 FY25)', category: 'Tax', status: 'uploaded', size: '1.1 MB', uploaded: '27 Feb 2026', expiry: null, docType: 'CSV' },
  { id: 'v5', name: 'Bank Statement — SBI 12M', category: 'Banking', status: 'uploaded', size: '2.3 MB', uploaded: '27 Feb 2026', expiry: null, docType: 'PDF' },
  { id: 'v6', name: 'ITR-6 FY25', category: 'Tax', status: 'uploaded', size: '680 KB', uploaded: '26 Feb 2026', expiry: null, docType: 'XML' },
  { id: 'v7', name: 'CRISIL Rating Report BBB+', category: 'Rating', status: 'uploaded', size: '890 KB', uploaded: '25 Feb 2026', expiry: '30 Sep 2026', docType: 'PDF' },
  { id: 'v8', name: 'Legal Opinion — Title Report', category: 'Legal', status: 'pending', size: null, uploaded: null, expiry: null, docType: 'PDF' },
  { id: 'v9', name: 'Valuation Report — Pune Plant', category: 'Collateral', status: 'pending', size: null, uploaded: null, expiry: null, docType: 'PDF' },
  { id: 'v10', name: 'MCA ROC Extract — All Directors', category: 'KYC', status: 'uploaded', size: '420 KB', uploaded: '26 Feb 2026', expiry: '26 May 2026', docType: 'PDF' },
  { id: 'v11', name: 'CIBIL Commercial Report', category: 'Credit Bureau', status: 'uploaded', size: '310 KB', uploaded: '25 Feb 2026', expiry: '25 May 2026', docType: 'PDF' },
  { id: 'v12', name: 'Board Resolution — Borrowing', category: 'Corporate', status: 'uploaded', size: '150 KB', uploaded: '28 Feb 2026', expiry: null, docType: 'PDF' },
  { id: 'v13', name: 'Insurance Policy — Plant & Machinery', category: 'Collateral', status: 'expiring', size: '220 KB', uploaded: '15 Jan 2026', expiry: '14 Mar 2026', docType: 'PDF' },
  { id: 'v14', name: 'CA Certificate — No Tax Arrears', category: 'Financial', status: 'pending', size: null, uploaded: null, expiry: null, docType: 'PDF' },
  { id: 'v15', name: 'NACH Mandate Form', category: 'Banking', status: 'pending', size: null, uploaded: null, expiry: null, docType: 'PDF' },
];

const vaultDocs = [...VAULT_DATA];

function renderVaultPage() {
  const container = document.getElementById('vault-content');
  if (!container) return;
  if (!state.company || (!state.isDemo && !state.extractedData)) {
    showPageEmptyState(container, '📁', 'Vault Standby', state.company ? `The document vault for <strong>${state.company}</strong> will be initialized upon completion of the Data Ingestor workflow.` : 'Load a demo case to view the document vault for the borrower.');
    return;
  }

  const uploaded = vaultDocs.filter(d => d.status === 'uploaded').length;
  const pending = vaultDocs.filter(d => d.status === 'pending').length;
  const expiring = vaultDocs.filter(d => d.status === 'expiring').length;
  const cats = [...new Set(vaultDocs.map(d => d.category))];

  const filterBtns = ['All', ...cats].map(c => `<button class="vault-filter ${c === 'All' ? 'active' : ''}" onclick="filterVault('${c}', this)">${c}</button>`).join('');

  container.innerHTML = `
    <!-- KPIs -->
    <div class="vault-kpi-row">
      <div class="vault-kpi up"><div class="vault-kpi-n">${uploaded}</div><div class="vault-kpi-l">✅ Uploaded</div></div>
      <div class="vault-kpi pend"><div class="vault-kpi-n">${pending}</div><div class="vault-kpi-l">⏳ Pending</div></div>
      <div class="vault-kpi exp"><div class="vault-kpi-n">${expiring}</div><div class="vault-kpi-l">⚠️ Expiring Soon</div></div>
      <div class="vault-kpi total-kpi"><div class="vault-kpi-n">${vaultDocs.length}</div><div class="vault-kpi-l">📁 Total Documents</div></div>
    </div>

    <!-- Filters -->
    <div class="vault-filters">${filterBtns}</div>

    <!-- Documents Grid -->
    <div class="vault-docs-grid" id="vault-docs-grid">
      ${vaultDocs.map(d => renderVaultDocCard(d)).join('')}
    </div>

    <!-- Upload Zone -->
    <div class="vault-upload-zone" onclick="simulateVaultUpload()">
      <div class="vault-upload-icon">📂</div>
      <div class="vault-upload-text">Click to upload additional documents</div>
      <div class="vault-upload-sub">PDF, Excel, XML, CSV — Max 25 MB</div>
    </div>
  `;
}

function renderVaultDocCard(d) {
  const statusClass = { uploaded: 'vault-uploaded', pending: 'vault-pending', expiring: 'vault-expiring' }[d.status];
  const statusLabel = { uploaded: '✅ Uploaded', pending: '⏳ Pending', expiring: '⚠️ Expiring' }[d.status];
  const catColors = { Financial: '#6366f1', Tax: '#f59e0b', Banking: '#3b82f6', Rating: '#8b5cf6', Legal: '#ef4444', Collateral: '#f97316', KYC: '#06b6d4', 'Credit Bureau': '#10b981', Corporate: '#64748b' };
  const catColor = catColors[d.category] || '#6366f1';
  return `
    <div class="vault-doc-card ${statusClass}" data-cat="${d.category}">
      <div class="vault-doc-top">
        <span class="vault-doc-icon">${d.status === 'uploaded' ? '📄' : d.status === 'expiring' ? '⚠️' : '📋'}</span>
        <span class="vault-doc-type" style="background:${catColor}20;color:${catColor}">${d.category}</span>
      </div>
      <div class="vault-doc-name">${d.name}</div>
      <div class="vault-doc-meta">
        ${d.uploaded ? `<span>📅 ${d.uploaded}</span>` : '<span class="pending-tag">Not yet uploaded</span>'}
        ${d.size ? `<span>💾 ${d.size}</span>` : ''}
        ${d.expiry ? `<span class="${d.status === 'expiring' ? 'expiring-tag' : ''}">⏰ Exp: ${d.expiry}</span>` : ''}
      </div>
      <div class="vault-doc-status ${statusClass}">${statusLabel}</div>
      ${d.status === 'uploaded' ? `<button class="vault-view-btn" onclick="toast('Document Viewer','Preview feature available in production','info')">👁️ View</button>` : `<button class="vault-upload-btn" onclick="simulateVaultUploadItem('${d.id}')">⬆️ Upload Now</button>`}
    </div>`;
}

function filterVault(cat, btn) {
  document.querySelectorAll('.vault-filter').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const grid = document.getElementById('vault-docs-grid');
  if (!grid) return;
  const docs = cat === 'All' ? vaultDocs : vaultDocs.filter(d => d.category === cat);
  grid.innerHTML = docs.map(d => renderVaultDocCard(d)).join('');
}

function simulateVaultUploadItem(id) {
  const doc = vaultDocs.find(d => d.id === id);
  if (doc) {
    doc.status = 'uploaded'; doc.uploaded = new Date().toLocaleDateString('en-IN'); doc.size = '1.2 MB';
    renderVaultPage();
    toast('Uploaded', `${doc.name} uploaded successfully`, 'success');
  }
}

function simulateVaultUpload() {
  toast('Upload Ready', 'File picker would open here in production', 'info');
}

// ═══════════════════════════════════════════════════════════════════
//  PEER BENCHMARKING DASHBOARD (DEEP)
// ═══════════════════════════════════════════════════════════════════
const PEER_DATA = {
  company: { name: 'Apex Industrial (AICL)', color: '#6366f1' },
  peers: [
    { name: 'Bharat Forge Ltd', color: '#22c55e' },
    { name: 'Minda Industries', color: '#f59e0b' },
    { name: 'Ramkrishna Forgings', color: '#ef4444' },
  ],
  metrics: [
    { label: 'Revenue Growth (YoY)', unit: '%', AICL: 12.4, peers: [15.2, 9.8, 18.1], higherIsBetter: true },
    { label: 'EBITDA Margin', unit: '%', AICL: 14.2, peers: [22.4, 16.8, 12.9], higherIsBetter: true },
    { label: 'PAT Margin', unit: '%', AICL: 7.4, peers: [12.1, 8.9, 5.3], higherIsBetter: true },
    { label: 'DSCR', unit: 'x', AICL: 1.31, peers: [2.14, 1.87, 1.42], higherIsBetter: true },
    { label: 'Debt/Equity', unit: 'x', AICL: 1.82, peers: [0.84, 1.23, 2.41], higherIsBetter: false },
    { label: 'Current Ratio', unit: 'x', AICL: 1.18, peers: [1.65, 1.42, 1.29], higherIsBetter: true },
    { label: 'Inventory Days', unit: 'd', AICL: 68, peers: [42, 55, 71], higherIsBetter: false },
    { label: 'Debtor Days', unit: 'd', AICL: 78, peers: [55, 62, 88], higherIsBetter: false },
    { label: 'Return on Equity', unit: '%', AICL: 20.1, peers: [28.4, 22.7, 15.6], higherIsBetter: true },
    { label: 'Interest Coverage', unit: 'x', AICL: 2.8, peers: [4.6, 3.9, 2.4], higherIsBetter: true },
  ]
};

function renderPeerBenchmarkingPage() {
  const container = document.getElementById('peer-content');
  if (!container) return;
  if (!state.company || (!state.isDemo && !state.extractedData)) {
    showPageEmptyState(container, '📊', 'Peer Analysis Standby', state.company ? `Peer-to-peer benchmarking for <strong>${state.company}</strong> requires valid financial indicators which are currently processing.` : 'Load a demo case to view peer benchmarking analysis vs sector competitors.');
    return;
  }


  const rankings = PEER_DATA.metrics.map(m => {
    const all = [m.AICL, ...m.peers];
    const sorted = [...all].sort((a, b) => m.higherIsBetter ? b - a : a - b);
    const rank = sorted.indexOf(m.AICL) + 1;
    return rank;
  });
  const avgRank = (rankings.reduce((a, b) => a + b, 0) / rankings.length).toFixed(1);

  container.innerHTML = `
    <!-- Ranking Summary -->
    <div class="peer-ranking-row">
      <div class="peer-rank-card">
        <div class="peer-rank-num">#${Math.round(avgRank)}</div>
        <div class="peer-rank-label">Average Sector Rank (out of 4)</div>
      </div>
      ${PEER_DATA.peers.map((p, i) => `
        <div class="peer-info-chip" style="border-color:${p.color}">
          <div class="peer-chip-color" style="background:${p.color}"></div>
          <div class="peer-chip-name">${p.name}</div>
        </div>`).join('')}
    </div>

    <!-- Metrics Table -->
    <div class="peer-table-wrap">
      <table class="peer-table">
        <thead>
          <tr>
            <th>Metric</th>
            <th style="color:#6366f1">${state.company || 'Borrower'} (You)</th>
            ${PEER_DATA.peers.map(p => `<th style="color:${p.color}">${p.name.split(' ')[0]}</th>`).join('')}
            <th>Rank</th>
            <th>Assessment</th>
          </tr>
        </thead>
        <tbody>
          ${PEER_DATA.metrics.map((m, idx) => {
    const all = [m.AICL, ...m.peers];
    const sorted = [...all].sort((a, b) => m.higherIsBetter ? b - a : a - b);
    const rank = sorted.indexOf(m.AICL) + 1;
    const rankClass = rank === 1 ? 'flag-ok' : rank === 4 ? 'flag-danger' : rank === 2 ? 'flag-ok' : 'flag-warn';
    const statusLabel = rank === 1 ? '🏆 Best' : rank === 2 ? '✅ Good' : rank === 3 ? '⚠️ Watch' : '🔴 Lagging';
    return `
              <tr>
                <td class="peer-metric-name">${m.label}</td>
                <td class="peer-val you">${m.AICL}${m.unit}</td>
                ${m.peers.map(v => `<td class="peer-val">${v}${m.unit}</td>`).join('')}
                <td class="${rankClass}">#${rank}/4</td>
                <td class="${rankClass}">${statusLabel}</td>
              </tr>`;
  }).join('')}
        </tbody>
      </table>
    </div>

    <!-- Radar Chart -->
    <div class="peer-radar-wrap">
      <h3>📡 Multi-Dimensional Peer Comparison</h3>
      <canvas id="peerRadarChart" height="300" style="max-height:360px"></canvas>
    </div>
  `;
  setTimeout(() => renderPeerRadarChart(), 150);
}

function renderPeerRadarChart() {
  const ctx = document.getElementById('peerRadarChart');
  if (!ctx) return;
  if (state.charts && state.charts.peerRadar) { state.charts.peerRadar.destroy(); }
  // Normalize to 0-10 scale for display
  const labels = ['Revenue Gr.', 'EBITDA Mgn', 'DSCR', 'D/E (inv)', 'Current Ratio', 'ROE', 'Interest Cover'];
  function norm(val, min, max) { return Math.max(0, Math.min(10, ((val - min) / (max - min)) * 10)); }
  const datasets = [
    { label: state.company || 'Borrower', data: [norm(12.4, 0, 20), norm(14.2, 0, 25), norm(1.31, 0, 3), norm(3 - 1.82, 0, 3), norm(1.18, 0, 2), norm(20.1, 0, 35), norm(2.8, 0, 6)], borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,0.2)', borderWidth: 2 },
    { label: 'Bharat Forge', data: [norm(15.2, 0, 20), norm(22.4, 0, 25), norm(2.14, 0, 3), norm(3 - 0.84, 0, 3), norm(1.65, 0, 2), norm(28.4, 0, 35), norm(4.6, 0, 6)], borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,0.1)', borderWidth: 2 },
    { label: 'Minda', data: [norm(9.8, 0, 20), norm(16.8, 0, 25), norm(1.87, 0, 3), norm(3 - 1.23, 0, 3), norm(1.42, 0, 2), norm(22.7, 0, 35), norm(3.9, 0, 6)], borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.1)', borderWidth: 2 },
    { label: 'Ramkrishna', data: [norm(18.1, 0, 20), norm(12.9, 0, 25), norm(1.42, 0, 3), norm(3 - 2.41, 0, 3), norm(1.29, 0, 2), norm(15.6, 0, 35), norm(2.4, 0, 6)], borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.1)', borderWidth: 2 },
  ];
  state.charts = state.charts || {};
  state.charts.peerRadar = new Chart(ctx, {
    type: 'radar',
    data: { labels, datasets },
    options: {
      responsive: true,
      scales: { r: { min: 0, max: 10, ticks: { color: '#64748b', stepSize: 2 }, grid: { color: 'rgba(255,255,255,0.1)' }, pointLabels: { color: '#94a3b8', font: { size: 12 } } } },
      plugins: { legend: { labels: { color: '#94a3b8' } } }
    }
  });
}

// ═══════════════════════════════════════════════════════════════════
//  BONUS: RBI CRILC REPORTING PREVIEW
// ═══════════════════════════════════════════════════════════════════
function renderCRILCPage() {
  const container = document.getElementById('crilc-content');
  if (!container) return;
  if (!state.company || (!state.isDemo && !state.extractedData)) {
    showPageEmptyState(container, '🏛️', 'CRILC Standby', state.company ? `The RBI CRILC reporting preview for <strong>${state.company}</strong> will be available once the loan account is structured.` : 'Load a demo case to view the RBI CRILC reporting preview.');
    return;
  }

  container.innerHTML = `
    <div class="crilc-explainer">
      <div class="crilc-icon">🏛️</div>
      <div>
        <h3>Central Repository of Information on Large Credits (CRILC)</h3>
        <p>RBI mandates all Scheduled Commercial Banks to report credit exposures ≥ ₹5 Cr on a quarterly basis to CRILC. This preview shows the reporting format for the current borrower.</p>
      </div>
    </div>
    <div class="crilc-form-card">
      <h3>📋 CRILC Reporting Format — Q3 FY26</h3>
      <div class="crilc-grid">
        ${[
      ['Borrower Name', (typeof state !== 'undefined' && state.company) ? state.company : 'N/A'],

      ['Borrower PAN', 'AABCA1234C'],
      ['Reporting Bank', 'State Bank of India'],
      ['Branch Code', 'SBI/MUM/LC/0042'],
      ['Credit Limit (₹ Cr)', '95.00'],
      ['Outstanding (₹ Cr)', '0.00 (Pre-disbursement)'],
      ['Asset Classification', 'Standard'],
      ['SMA Status', 'SMA-0 (Watch)'],
      ['NPA Flag', 'No'],
      ['Wilful Default', 'No'],
      ['Fraud Flag', 'No'],
      ['ECGC Cover', 'Not Applicable'],
      ['Consortium Lead', 'SBI (Lead Bank)'],
      ['Consortium Members', 'HDFC Bank (40% share)'],
      ['Reporting Quarter', 'Q3 FY26 (Dec 2025)'],
      ['Next Review Date', '31 Mar 2026'],
    ].map(([l, v]) => `<div class="crilc-row"><span class="crilc-label">${l}</span><span class="crilc-val">${v}</span></div>`).join('')}
      </div>
      <button class="btn btn-ghost" style="margin-top:16px" onclick="toast('CRILC Export','Report exported in XML format for RBI submission','success')">📤 Export CRILC XML</button>
    </div>
    <div class="crilc-sma-card">
      <h3>⚡ SMA Classification Guide (RBI Master Direction)</h3>
      <table class="cam-table">
        <thead><tr><th>Category</th><th>Overdue Period</th><th>Description</th><th>Bank Action</th></tr></thead>
        <tbody>
          <tr class="flag-ok"><td>Standard</td><td>0 days</td><td>Regular account, no overdue</td><td>Normal monitoring</td></tr>
          <tr><td class="flag-warn">SMA-0</td><td>1–30 days</td><td>Principal or interest overdue 1–30 days</td><td>Enhanced monitoring. Current account.</td></tr>
          <tr><td class="flag-warn">SMA-1</td><td>31–60 days</td><td>O/S 31–60 days</td><td>Initiate Resolution Plan within 30 days</td></tr>
          <tr><td class="flag-danger">SMA-2</td><td>61–90 days</td><td>O/S 61–90 days</td><td>Mandatory ICA; Sign ICA within 30 days</td></tr>
          <tr><td class="flag-danger">NPA / Sub-Standard</td><td>>90 days</td><td>Non-Performing Asset</td><td>Provisioning; SARFAESI / NCLT action</td></tr>
        </tbody>
      </table>
    </div>`;
}

// ═══════════════════════════════════════════════════════════════════
//  PAGE INIT HOOKs
// ═══════════════════════════════════════════════════════════════════
function initSanctionPage() { renderSanctionPage(); }
function initCompliancePage() { renderCompliancePage(); }
function initVaultPage() { renderVaultPage(); }
function initPeerPage() { renderPeerBenchmarkingPage(); }
function initCRILCPage() { renderCRILCPage(); }
