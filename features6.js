'use strict';
// ═══════════════════════════════════════════════════════════
// FEATURES 6 — AI Analyst Chatbot
// ═══════════════════════════════════════════════════════════

const AI_KB = [
    {
        p: ['dscr', 'debt service', 'debt coverage', 'serviceable'],
        r: `📊 **DSCR (Debt Service Coverage Ratio)**\n\nCurrent value: **1.31x** | Benchmark: ≥ 1.5x → ⚠️ **BELOW THRESHOLD**\n\nFor every **₹1.00** of loan repayment obligation, the company generates **₹1.31** in operating cash — a thin buffer of only 31%.\n\n**Trend:** 1.18x (FY23) → 1.25x (FY24) → 1.31x (FY25) — **improving** but still below bank threshold.\n\n**My Recommendation:**\n• Include a DSCR covenant of ≥1.25x in the sanction letter\n• Require quarterly DSCR certification by company CA\n• Consider a 10–15% reduction in sanctioned amount to improve serviceability\n• Apply a margin step-up clause: +50bps if DSCR falls below 1.25x`
    },
    {
        p: ['credit score', 'grade', 'rating', '66', 'composite score'],
        r: `⭐ **Credit Score: 66/100 — Grade B (Moderate Risk)**\n\nThe Five-C Scorecard breakdown:\n| Category | Score | Status |\n|---|---|---|\n| Character | 62 | 🔴 Litigation; MCA issue |\n| Capacity | 69 | ⚠️ DSCR below threshold |\n| Capital | 74 | ✅ Adequate net worth |\n| Collateral | 78 | ✅ Security cover 3.5x |\n| Conditions | 61 | ⚠️ Sector headwinds |\n\n**Credit Grade B** means: *Sanction with enhanced conditions and monitoring*. The file can proceed to Credit Committee with mitigants clearly documented.`
    },
    {
        p: ['risk', 'main risk', 'top risk', 'biggest risk', 'critical risk', 'flag'],
        r: `🚨 **Top Credit Risks — ${state.company || 'Selected Company'}**\n\n**🔴 CRITICAL / HIGH:**\n• **R1 — Revenue Inflation (Score: 15):** Potential revenue overstatement detected. Forensic check recommended before disbursal.\n• **R2 — GST Discrepancy (Score: 12):** ₹14.2 Cr ITC mismatch between GSTR-2A and 3B. ITC reversal risk under audit.\n• **R3 — Litigation NI Act (Score: 12):** Active cheque dishonour case ₹8.2 Cr at Mumbai Sessions Court.\n\n**🟡 MEDIUM:**\n• **R4 — DSCR Marginal (Score: 9):** DSCR 1.31x vs required 1.5x — the single most critical quantitative risk.\n• **R6 — Promoter Link (Score: 6):** Former director appeared on MCA defaulter list; verify current board composition.\n\n**🟢 LOW / WATCH:**\n• R5, R7, R8 — Manageable with standard monitoring conditions.`

    },
    {
        p: ['recommend', 'decision', 'sanction', 'approve', 'reject', 'conclusion'],
        r: `✅ **AI Credit Recommendation**\n\n**Decision: SANCTION WITH CONDITIONS**\n\n📋 Proposed Terms:\n• **Loan Amount:** ₹95 Cr (down from requested ₹110 Cr — 14% haircut due to DSCR constraint)\n• **Tenor:** 5 years with 6-month moratorium\n• **Rate:** MCLR + 2.75% (floating) = ~12.5% p.a.\n• **Security:** Primary — Hypothecation of Plant & Machinery + receivables; Collateral — IM Land ₹185 Cr + FD ₹32 Cr; Personal guarantee all promoters\n\n⚠️ **Pre-disbursal conditions:**\n1. Resolve litigation or obtain ₹10 Cr additional security in lieu\n2. Clear GST discrepancy or provide certificate for ₹14.2 Cr ITC\n3. Forensic revenue verification by empanelled auditor\n\n📊 **Monitoring:** Quarterly DSCR review, stock audit every 6 months, MCA director check on renewal`
    },
    {
        p: ['collateral', 'security', 'cover', 'asset', 'mortgage', 'hypothecation'],
        r: `🏦 **Collateral & Security Analysis**\n\n**Security Cover Ratio: 3.54x** ✅ (Loan: ₹95 Cr)\n\n| Security | Type | Value |\n|---|---|---|\n| Plant & Machinery | Primary (Hyp.) | ₹120 Cr |\n| Book Debts | Primary (Hyp.) | ₹85 Cr |\n| Industrial Land (IM) | Collateral (Mortg.) | ₹185 Cr |\n| Fixed Deposit | Collateral (Pledge) | ₹32 Cr |\n| Personal Guarantee | Promoters | Unlimited |\n\n**Total Realizable Security:** ~₹336 Cr against loan of ₹95 Cr\n\n**Bank note:** Under stressed haircut of 30%, realizable value = ₹235 Cr — still 2.47x cover. Adequate.`
    },
    {
        p: ['gst', 'igst', 'itc', 'mismatch', 'discrepancy', 'gstr'],
        r: `🧳 **GST Discrepancy Risk (R2) — DSCR**\n\nFinding: **₹14.2 Cr ITC mismatch** between GSTR-2A (supplier-filed) and GSTR-3B (company-filed) for FY25.\n\n**Risk:** Input Tax Credit may be reversed by GST authorities — impacting cash flows by ₹14.2 Cr\n\n**Impact:** If reversed, Post-Tax Profit drops from ₹62.3 Cr → ~₹52.5 Cr, and DSCR could fall to ~1.12x (breach of covenant)\n\n**Mitigation Required:**\n✅ Obtain CA certificate explaining mismatch\n✅ Escrow/freeze account for ₹14.2 Cr during the dispute\n✅ Include GST-reversal covenant: additional collateral triggered if reversal > ₹5 Cr`
    },
    {
        p: ['financial', 'revenue', 'pat', 'profit', 'turnover', 'networth', 'net worth'],
        r: `📈 **Financial Highlights — ${state.company || 'Selected Company'}**\n\n| Metric | FY23 | FY24 | FY25 | Trend |\n|---|---|---|---|---|\n| Revenue | ₹673 Cr | ₹745 Cr | ₹847 Cr | ↑ +12.4% CAGR ✅ |\n| PAT | ₹44.1 Cr | ₹54.8 Cr | ₹62.3 Cr | ↑ +18.8% CAGR ✅ |\n| EBITDA Margin | 10.2% | 11.1% | 11.8% | ↑ Improving ✅ |\n| Debt-Equity | 2.1x | 1.95x | 1.82x | ↓ Deleveraging ✅ |\n| DSCR | 1.18x | 1.25x | 1.31x | ↑ Improving ⚠️ |\n\n📌 **Key positives:** 3-year revenue CAGR of 12.4%, improving margins, deleveraging trend.\n📌 **Key concern:** DSCR still below 1.5x threshold despite improvement.`

    },
    {
        p: ['covenant', 'condition', 'sanction letter', 'clause', 'term', 'monitoring'],
        r: `📜 **Recommended Covenants & Conditions**\n\n**Financial Covenants** (to be included in sanction letter):\n• DSCR ≥ 1.25x (to be maintained; breach triggers additional security)\n• Debt-Equity ≤ 2.0x\n• Current Ratio ≥ 1.10x\n• Net Worth ≥ ₹280 Cr\n\n**Reporting Covenants:**\n• Quarterly audited financials within 45 days of quarter end\n• Annual audited statements within 90 days\n• Quarterly stock statements for working capital\n• Immediate notification of any litigation >₹1 Cr\n• DSCR certificate by CA every quarter\n\n**Special Conditions:**\n• No dividend without bank NOC if DSCR < 1.35x\n• Promoter shareholding ≥ 51% mandatory\n• No major capex without bank NOC\n• Escrow of ₹14.2 Cr for GST dispute resolution`
    },
    {
        p: ['interest', 'icr', 'interest cover', 'ebit'],
        r: `💰 **Interest Coverage Ratio (ICR)**\n\nICR = EBIT ÷ Interest Expense = **2.8x** ✅ (Benchmark: ≥ 2.5x)\n\n**Meaning:** The company earns ₹2.80 for every ₹1 of interest it must pay — comfortably above the 2.5x RBI threshold.\n\n**vs DSCR:** While ICR is healthy, DSCR (1.31x) is below threshold because it also includes principal repayment. This is a common pattern in capital-heavy industries — interest affordable, but principal repayment strains cash flow.`
    },
    {
        p: ['liquidity', 'current ratio', 'quick ratio', 'working capital', 'cash'],
        r: `💧 **Liquidity Analysis**\n\n| Ratio | Value | Benchmark | Status |\n|---|---|---|---|\n| Current Ratio | 1.18x | ≥ 1.25x | ⚠️ Watch |\n| Quick Ratio | 0.82x | ≥ 1.0x | ⚠️ Watch |\n| Absolute Liquid | 0.35x | ≥ 0.5x | 🔴 Low |\n\n**Debtor Days:** ~45 days | **Creditor Days:** ~38 days | **Inventory Days:** ~44 days\n\n**Working Capital Cycle:** ~51 days — moderate. The mild liquidity pressure is a concern, particularly if GST reversal materializes. Recommend Working Capital limit of ₹25 Cr as part of the package to buffer short-term gaps.`
    },
    {
        p: ['litigation', 'legal', 'court', 'ni act', 'cheque', 'ib', 'dishonour'],
        r: `⚖️ **Litigation Risk (R3) — NI Act Section 138**\n\n**Case:** Negotiable Instruments Act cheque dishonour case filed by ICICI Bank for ₹8.2 Cr, Mumbai Sessions Court (2024).\n\n**Risk Level:** HIGH (Impact 3 × Likelihood 4 = Score 12)\n\n**Credit Officer's View:**\n• This is a criminal case (NI Act 138) — conviction rare but reputational damage is material\n• The case has NOT been resolved — reply field but hearing pending\n• ₹8.2 Cr is 8.6% of the new loan amount — not trivial\n\n**Mitigation:**\n1. Obtain court status certificate from borrower's advocate\n2. Require legal undertaking that no adverse order against promoters\n3. Add ₹10 Cr additional security in lieu of closure OR\n4. Make litigation closure a condition precedent to disbursal`
    },
    {
        p: ['promoter', 'management', 'director', 'shareholding', 'pledge'],
        r: `👤 **Promoter & Management Assessment**\n\n**Shareholding:** 62.3% (unlisted, family-held) — No pledge ✅\n\n**Positive:**\n• Zero promoter pledge — skin-in-the-game well demonstrated\n• 25-year industry track record in precision manufacturing\n• ISO 9001:2015 recertified Dec 2025 — quality commitment\n• DRDO order win (₹120 Cr) — government contractor credentials\n\n**Concern (R6):**\n• Director DIN 00834712 appeared on MCA-21 defaulter list (FY23 filing)\n• Must verify if this director is still on board\n• If so, obtain resignation or NOC from parent company\n\n**Character Score: 62/100** — Addressable with standard KYC verification and legal undertaking`
    },
    {
        p: ['sector', 'industry', 'steel', 'manufacturing', 'headwind', 'macro'],
        r: `🏭 **Sector Analysis — Capital Goods / Manufacturing**\n\n**Indian Manufacturing Outlook (FY25-26):**\n• PLI scheme benefits — government capex tailwind ✅\n• DRDO/Defence indigenisation — significant opportunity ✅\n• RBI ECB tightening — higher cost of foreign borrowing ⚠️\n• Steel & raw material prices — volatile, +18% YoY ⚠️\n• Indian precision manufacturing: 14% CAGR forecast through 2028 ✅\n\n**Company Positioning:**\n• Revenue concentration: Top 3 customers = 58% of revenue (concentration risk)\n• New DRDO order diversifies concentration ✅\n• Forex exposure: 22% of raw materials imported (USD/INR risk)\n\n**Overall:** Sector fundamentals are positive despite near-term headwinds. Company is well-positioned.`
    },
    {
        p: ['hello', 'hi', 'help', 'what can you do', 'who are you', 'introduce'],
        r: `👋 Hello! I'm the **IntelliCredit AI Analyst** — your 24/7 credit appraisal assistant.\n\nI have been trained on the credit file of **${state.company || 'Selected Company'}** and can answer:\n\n📊 **Ratios & Financials** — DSCR, ICR, liquidity, profitability\n🚨 **Credit Risks** — All 8 identified risks with mitigation\n✅ **Recommendation** — Sanction terms, covenants, conditions\n🏦 **Security** — Collateral analysis and cover ratios\n👤 **Management** — Promoter assessment, shareholding\n🏭 **Sector** — Industry outlook and macro factors\n\nJust type your question below or click one of the quick buttons!`
    },

    {
        p: ['what is', 'explain', 'define', 'meaning', 'definition'],
        r: `📖 I can explain any credit concept. Here are some common ones:\n\n• **DSCR** — Debt Service Coverage Ratio\n• **ICR** — Interest Coverage Ratio\n• **Current Ratio** — Short-term liquidity measure\n• **Debt-Equity** — Financial leverage indicator\n• **CRISIL Rating** — Credit risk assessment\n• **NPA** — Non-Performing Asset\n• **LCR** — Loan to Collateral Ratio\n\nPlease ask specifically about any of these, or ask me about the company's specific metrics!`
    },
];

// ─── Chat Logic ────────────────────────────────────────────────
let aiOpen = false;

function toggleAIChat() {
    aiOpen = !aiOpen;
    const panel = document.getElementById('ai-chat-panel');
    const fab = document.getElementById('ai-analyst-fab');
    panel.classList.toggle('hidden', !aiOpen);
    fab.classList.toggle('active', aiOpen);
    if (aiOpen) {
        // Show welcome message on first open
        const msgs = document.getElementById('ai-chat-msgs');
        if (!msgs.hasChildNodes()) {
            appendAIMsg('bot', AI_KB.find(k => k.p.includes('hello')).r);
        }
        setTimeout(() => document.getElementById('ai-chat-input').focus(), 100);
    }
}

function clearAIChat() {
    document.getElementById('ai-chat-msgs').innerHTML = '';
    appendAIMsg('bot', '🗑️ Chat cleared. How can I help you with the credit appraisal?');
}

function sendAIMsg() {
    const inp = document.getElementById('ai-chat-input');
    const q = inp.value.trim();
    if (!q) return;
    inp.value = '';
    askAI(q);
}

function askAI(question) {
    // Open chat if not open
    if (!aiOpen) toggleAIChat();
    appendAIMsg('user', question);
    // Typing indicator
    const typingId = appendAITyping();
    const delay = 600 + Math.random() * 800;
    setTimeout(() => {
        removeTyping(typingId);
        const answer = findAIAnswer(question);
        appendAIMsg('bot', answer);
    }, delay);
}

function findAIAnswer(q) {
    const ql = q.toLowerCase();

    // If not in demo mode and no extraction data yet, provide a standby message
    if (!state.isDemo && !state.extractedData) {
        return `🤖 **Analyst Standby**\n\nI am currently initializing for **${state.company || 'the new company'}**. Once you upload the financial documents and extraction is complete, I will be able to provide deep-dive insights into the company's credit profile.\n\nTry loading the **Apex Industrial Demo** to see my full capabilities!`;
    }

    for (const kb of AI_KB) {
        if (kb.p.some(p => ql.includes(p))) {
            let res = kb.r;
            // If not demo, replace company name at least (even if stats are demo for now, 
            // but usually we'd have a dynamic model; for this UI, we'll just name-swap or 
            // note that it's based on demo patterns).
            if (!state.isDemo) {
                res = res.replace(/Apex Industrial/g, state.company || 'Selected Company');
            }
            return res;
        }
    }
    // Generic fallback
    return `🤔 I don't have a specific answer for "${q}" in my current knowledge base.\n\nFor detailed analysis, please review the generated CAM report, or ask me about:\n• DSCR analysis\n• Credit risks\n• Recommendation\n• Collateral\n• Financial highlights\n• Covenants\n\nType any of these topics!`;
}

function appendAIMsg(role, text) {
    const el = document.createElement('div');
    el.className = `ai-msg ai-msg-${role}`;
    // Convert markdown-style **bold** and line breaks
    const html = text
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>')
        .replace(/\| (.+?) \|/g, (_, c) => `<td>${c}</td>`)  // basic table parsing skipped
        ;
    el.innerHTML = role === 'bot' ? `<span class="ai-avatar-sm">🤖</span><div class="ai-bubble">${html}</div>` : `<div class="ai-bubble">${html}</div>`;
    document.getElementById('ai-chat-msgs').appendChild(el);
    el.scrollIntoView({ behavior: 'smooth', block: 'end' });
    return el;
}

function appendAITyping() {
    const el = document.createElement('div');
    el.className = 'ai-msg ai-msg-bot ai-typing-row';
    el.id = 'ai-typing-' + Date.now();
    el.innerHTML = `<span class="ai-avatar-sm">🤖</span><div class="ai-bubble ai-typing"><span></span><span></span><span></span></div>`;
    document.getElementById('ai-chat-msgs').appendChild(el);
    el.scrollIntoView({ behavior: 'smooth' });
    return el.id;
}

function removeTyping(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

// Register "AI Analyst" in command palette
document.addEventListener('DOMContentLoaded', () => {
    // Add to CMD_COMMANDS if defined
    setTimeout(() => {
        if (typeof CMD_COMMANDS !== 'undefined') {
            CMD_COMMANDS.push({ icon: '🤖', label: 'Open AI Analyst Chat', cat: 'UI', action: () => { if (!aiOpen) toggleAIChat(); } });
            CMD_COMMANDS.push({ icon: '💬', label: 'Ask AI — Credit Recommendation', cat: 'AI', action: () => askAI('What is the credit recommendation?') });
            CMD_COMMANDS.push({ icon: '🚨', label: 'Ask AI — Main Credit Risks', cat: 'AI', action: () => askAI('What are the main credit risks?') });
            CMD_COMMANDS.push({ icon: '📊', label: 'Ask AI — Explain DSCR', cat: 'AI', action: () => askAI('Explain DSCR and what it means here') });
        }
    }, 500);
});
