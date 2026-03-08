'use strict';
// ═══════════════════════════════════════════════════════════
// FEATURES 5 — Stock Analysis + Ratio Classifications Guide
// ═══════════════════════════════════════════════════════════

// ─── STOCK DATA ───────────────────────────────────────────────
const STOCK_DATA = {
    apex: {
        get name() { return state.company || 'Selected Company'; }, ticker: state.company ? `BSE: 532846 | NSE: APXIND` : 'Ticker not available',

        exchange: 'BSE & NSE', sector: 'Capital Goods / Manufacturing', isin: 'INE123A01025',
        price: 287.45, prevClose: 280.95, yearHigh: 342.80, yearLow: 198.60,
        mktCap: '₹3,247 Cr', pe: 21.4, eps: 13.43, pb: 1.8, divYield: '1.2%',
        faceValue: '₹10', beta: 0.92, volume: '8.4L', avgVolume: '6.2L',
        marketLot: 1, listingDate: 'Mar 2004',
        color: 'rgba(99,102,241',
        technicals: {
            rsi: 62.4, macd: '+4.2', signal: 'Bullish', ma20: 272.10, ma50: 258.40, ma200: 241.80,
            support: 265.00, resistance: 310.00, ema20: 274.50, stoch: 68.2,
            trend: 'Uptrend', strength: 'Moderate', recommendation: 'Accumulate'
        },
        holdings: { promoter: 62.3, fii: 12.1, dii: 9.4, retail: 11.8, others: 4.4 }
    },
    bharat: {
        name: 'Bharat Electronics Ltd', ticker: 'BSE: 500049 | NSE: BEL',
        exchange: 'BSE & NSE', sector: 'Defence Electronics / PSU', isin: 'INE263A01024',
        price: 312.80, prevClose: 310.30, yearHigh: 340.15, yearLow: 198.50,
        mktCap: '₹22,836 Cr', pe: 38.6, eps: 8.10, pb: 5.2, divYield: '0.8%',
        faceValue: '₹1', beta: 0.78, volume: '24.1L', avgVolume: '18.7L',
        marketLot: 1, listingDate: 'Jan 1992',
        color: 'rgba(6,182,212',
        technicals: {
            rsi: 57.8, macd: '+2.5', signal: 'Neutral–Bullish', ma20: 305.40, ma50: 290.10, ma200: 268.20,
            support: 295.00, resistance: 335.00, ema20: 307.20, stoch: 55.6,
            trend: 'Uptrend', strength: 'Strong', recommendation: 'Buy'
        },
        holdings: { promoter: 51.1, fii: 14.8, dii: 22.6, retail: 9.5, others: 2.0 }
    }
};

// Generate 52 weeks of simulated weekly price data via random walk
function generatePriceSeries(start, seed, weeks = 52) {
    const prices = [], labels = [];
    let price = start;
    const rng = (() => { let s = seed; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; })();
    const now = new Date();
    for (let w = weeks; w >= 0; w--) {
        const d = new Date(now); d.setDate(d.getDate() - w * 7);
        labels.push(d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }));
        const chg = (rng() - 0.485) * 0.025; // slight upward bias
        price = Math.max(price * 0.7, price * (1 + chg));
        prices.push(+price.toFixed(2));
    }
    return { labels, prices };
}

let stockChart = null;

function renderStockPage() {
    // Determine which stock data to show based on loaded company
    const comp = (typeof state !== 'undefined' && state.company) ? state.company.toLowerCase() : '';
    // Try to match by key or by company name substring
    let d = null;
    for (const key of Object.keys(STOCK_DATA)) {
        const entry = STOCK_DATA[key];
        if (comp && (entry.name.toLowerCase().includes(comp.split(' ')[0]) || comp.includes(key))) {
            d = entry;
            break;
        }
    }
    // If no company loaded or no match and not demo, show a 'no stock selected' state
    if (!d || (!state.isDemo && !state.extractedData)) {
        const pg = document.getElementById('page-stock');
        if (!pg) return;
        const companyName = (typeof state !== 'undefined' && state.company) ? state.company : null;
        if (!companyName || (!state.isDemo && !state.extractedData)) {
            pg.innerHTML = `
                <div class="section-header">
                  <h2>Stock Analysis</h2>
                  <p>Real-time market data and technical indicators</p>
                </div>
                <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:50vh;gap:18px;text-align:center;padding:40px">
                  <div style="font-size:3.5rem">📈</div>
                  <h3 style="font-size:1.4rem;font-weight:700;color:var(--text-primary)">Stock Data Standby</h3>
                  <p style="color:var(--text-secondary);max-width:380px">${companyName ? `Market data for <strong>${companyName}</strong> will be fetched once the appraisal is processed.` : 'Load the demo case or enter a company in the Data Ingestor to view stock analysis.'}</p>
                  <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center;margin-top:8px">
                    <button class="btn btn-primary btn-lg" onclick="loadDemo()">Load Demo Case →</button>
                    <button class="btn btn-ghost btn-lg" onclick="navigateTo('ingest')">Enter Company →</button>
                  </div>
                </div>`;
            return;
        }
        // Fall back only if explicitly in demo mode but name mismatch (unlikely now)
        d = { ...STOCK_DATA.apex, name: companyName, ticker: 'BSE / NSE' };
    }
    const change = d.price - d.prevClose;
    const changePct = (change / d.prevClose * 100).toFixed(2);
    const isUp = change >= 0;
    const clr = isUp ? 'var(--green)' : 'var(--red)';

    // Ticker strip
    document.getElementById('stock-ticker-strip').innerHTML = [
        { t: 'SENSEX', v: '72,831', c: '+0.42%', up: true }, { t: 'NIFTY50', v: '22,097', c: '+0.38%', up: true },
        { t: 'NIFTY BANK', v: '46,442', c: '-0.11%', up: false }, { t: 'USD/INR', v: '83.29', c: '-0.05%', up: false },
        { t: 'GOLD', v: '₹68,420', c: '+0.3%', up: true }, { t: 'CRUDE', v: '$83.4', c: '+0.8%', up: true },
        { t: 'VIX', v: '12.8', c: '-0.6%', up: false }, { t: '10Y YIELD', v: '7.08%', c: '+0.02%', up: true },
    ].map(i => `<span class="ticker-item"><span class="ticker-name">${i.t}</span><span class="ticker-val">${i.v}</span><span class="ticker-chg ${i.up ? 'green' : 'red'}">${i.c}</span></span>`).join('');

    // Price header
    document.getElementById('stock-price-header').innerHTML = `
    <div class="sph-left">
      <div class="sph-name">${d.name}</div>
      <div class="sph-ticker">${d.ticker}</div>
      <div class="sph-tags"><span class="tag">${d.sector}</span><span class="tag">ISIN: ${d.isin}</span></div>
    </div>
    <div class="sph-right">
      <div class="sph-price">₹${d.price.toFixed(2)}</div>
      <div class="sph-change ${isUp ? 'green' : 'red'}">${isUp ? '▲' : '▼'} ₹${Math.abs(change).toFixed(2)} (${isUp ? '+' : ''}${changePct}%) <span class="sph-today">Today</span></div>
      <div class="sph-range"><span>52W L: ₹${d.yearLow}</span><div class="sph-range-bar"><div class="sph-range-fill" style="width:${((d.price - d.yearLow) / (d.yearHigh - d.yearLow) * 100).toFixed(0)}%"></div></div><span>H: ₹${d.yearHigh}</span></div>
    </div>`;

    // Chart title
    document.getElementById('stock-chart-title').textContent = `${d.name} — 1-Year Price Performance`;

    // Stock chart
    const seed = caseId === 'apex' ? 12345 : 67890;
    const { labels, prices } = generatePriceSeries(d.yearLow * 1.1 + 10, seed, 52);
    prices[prices.length - 1] = d.price; // ensure last point = current price
    const ma20 = prices.map((_, i) => i >= 19 ? +(prices.slice(i - 19, i + 1).reduce((a, b) => a + b, 0) / 20).toFixed(2) : null);
    const ma50 = prices.map((_, i) => i >= 49 ? +(prices.slice(i - 49, i + 1).reduce((a, b) => a + b, 0) / 50).toFixed(2) : null);
    const light = document.body.classList.contains('light-mode');
    const tickColor = light ? '#334155' : '#475569';
    const gridColor = light ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.05)';

    if (stockChart) { stockChart.destroy(); stockChart = null; }
    const ctx = document.getElementById('stockPriceChart').getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, 0, 240);
    grad.addColorStop(0, `${d.color},0.25)`);
    grad.addColorStop(1, `${d.color},0.01)`);
    stockChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels, datasets: [
                { label: 'Price (₹)', data: prices, borderColor: `${d.color},1)`, backgroundColor: grad, fill: true, tension: 0.3, pointRadius: 0, pointHoverRadius: 5, borderWidth: 2.5 },
                { label: 'MA20', data: ma20, borderColor: 'rgba(245,158,11,0.8)', fill: false, tension: 0.3, pointRadius: 0, borderWidth: 1.5, borderDash: [4, 3] },
                { label: 'MA50', data: ma50, borderColor: 'rgba(239,68,68,0.7)', fill: false, tension: 0.3, pointRadius: 0, borderWidth: 1.5, borderDash: [6, 3] },
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: { labels: { color: tickColor, font: { size: 11 }, usePointStyle: true } },
                tooltip: { backgroundColor: 'rgba(10,15,30,0.92)', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1, callbacks: { label: c => `${c.dataset.label}: ₹${c.parsed.y?.toFixed(2) || ''}` } }
            },
            scales: {
                x: { grid: { color: gridColor }, ticks: { color: tickColor, maxTicksLimit: 12 } },
                y: { grid: { color: gridColor }, ticks: { color: tickColor, callback: v => `₹${v}` } }
            }
        }
    });

    // Metrics grid
    const mets = [
        { l: 'Market Cap', v: d.mktCap }, { l: 'P/E Ratio', v: d.pe }, { l: 'EPS (TTM)', v: `₹${d.eps}` }, { l: 'P/B Ratio', v: d.pb },
        { l: 'Div Yield', v: d.divYield }, { l: 'Beta', v: d.beta }, { l: 'Volume', v: d.volume }, { l: 'Avg Volume', v: d.avgVolume },
        { l: 'Face Value', v: d.faceValue }, { l: '52W High', v: `₹${d.yearHigh}` }, { l: '52W Low', v: `₹${d.yearLow}` }, { l: 'Listed', v: d.listingDate },
    ];
    document.getElementById('stock-metrics-grid').innerHTML = mets.map(m => `<div class="stock-metric"><div class="sm-label">${m.l}</div><div class="sm-val">${m.v}</div></div>`).join('');

    // Technicals panel
    const t = d.technicals;
    const recCls = t.recommendation === 'Buy' ? 'green' : t.recommendation === 'Accumulate' ? 'amber' : 'red';
    document.getElementById('stock-technicals').innerHTML = `
    <div class="chart-title">Technical Indicators</div>
    <div class="tech-items">
      ${[
            { k: 'RSI (14)', v: t.rsi, note: t.rsi > 70 ? 'Overbought' : t.rsi < 30 ? 'Oversold' : 'Neutral', cls: t.rsi > 70 ? 'red' : t.rsi < 30 ? 'green' : 'amber' },
            { k: 'MACD', v: t.macd, note: t.signal, cls: t.macd.startsWith('+') ? 'green' : 'red' },
            { k: 'MA 20D', v: `₹${t.ma20}`, note: d.price > t.ma20 ? 'Above MA' : 'Below MA', cls: d.price > t.ma20 ? 'green' : 'red' },
            { k: 'MA 50D', v: `₹${t.ma50}`, note: d.price > t.ma50 ? 'Above MA' : 'Below MA', cls: d.price > t.ma50 ? 'green' : 'red' },
            { k: 'EMA 200D', v: `₹${t.ma200}`, note: d.price > t.ma200 ? 'Bullish' : 'Bearish', cls: d.price > t.ma200 ? 'green' : 'red' },
            { k: 'Stochastic', v: t.stoch, note: t.stoch > 80 ? 'Overbought' : t.stoch < 20 ? 'Oversold' : 'Neutral', cls: t.stoch > 80 ? 'red' : t.stoch < 20 ? 'green' : 'amber' },
            { k: 'Support', v: `₹${t.support}`, note: 'Key level', cls: 'amber' },
            { k: 'Resistance', v: `₹${t.resistance}`, note: 'Key level', cls: 'amber' },
        ].map(i => `<div class="tech-item"><span class="tech-key">${i.k}</span><span class="tech-val">${i.v}</span><span class="tech-note ${i.cls}">${i.note}</span></div>`).join('')}
      <div class="tech-recommendation"><span>Recommendation:</span><span class="tech-rec ${recCls}">${t.recommendation}</span></div>
    </div>`;

    // Holdings (shareholding doughnut text)
    const h = d.holdings;
    document.getElementById('stock-holdings').innerHTML = `
    <div class="chart-title">Institutional Holdings Pattern</div>
    <div class="holdings-bars">
      ${[
            { l: 'Promoter', v: h.promoter, cls: 'blue' }, { l: 'DII', v: h.dii, cls: 'teal' },
            { l: 'FII/FPI', v: h.fii, cls: 'purple' }, { l: 'Retail Public', v: h.retail, cls: 'amber' },
            { l: 'Others', v: h.others, cls: 'muted' },
        ].map(i => `<div class="hbar-row"><div class="hbar-label">${i.l}</div><div class="hbar-track"><div class="hbar-fill hbar-${i.cls}" style="width:${i.v}%"></div></div><div class="hbar-pct">${i.v}%</div></div>`).join('')}
    </div>`;
}

function refreshStock() {
    if (stockChart) { stockChart.destroy(); stockChart = null; }
    renderStockPage();
    toast('Stock Data Refreshed', 'Prices updated to latest simulation snapshot', 'info', 2000);
}

// Auto-render when navigating to stock page
const __origNav5 = window.navigateTo;
window.navigateTo = function (p) {
    __origNav5(p);
    if (p === 'stock') setTimeout(renderStockPage, 50);
    if (p === 'ratios') setTimeout(renderRatioClassifications, 50);
};

// ─── RATIO CLASSIFICATIONS ────────────────────────────────────
const RATIO_CATEGORIES = [
    {
        id: 'liquidity', icon: '💧', name: 'Liquidity Ratios',
        color: 'blue', desc: 'Measure ability to meet short-term obligations',
        ratios: [
            { name: 'Current Ratio', formula: 'Current Assets ÷ Current Liabilities', value: '1.18x', bench: '≥ 1.25x', status: 'warn', tip: 'Slightly below preferred threshold, indicating mild liquidity pressure.' },
            { name: 'Quick Ratio (Acid Test)', formula: '(Current Assets − Inventory) ÷ Current Liabilities', value: '0.82x', bench: '≥ 1.0x', status: 'warn', tip: 'Below 1.0x — company relies on inventory to meet obligations.' },
            { name: 'Absolute Liquid Ratio', formula: '(Cash + Bank + Marketable Securities) ÷ Current Liabilities', value: '0.35x', bench: '≥ 0.5x', status: 'bad', tip: 'Cash liquidity is low — dependency on receivables to meet immediate obligations.' },
        ]
    },
    {
        id: 'turnover', icon: '🔄', name: 'Turnover Ratios',
        color: 'teal', desc: 'Measure efficiency of asset utilisation',
        ratios: [
            { name: 'Stock Turnover Ratio', formula: 'Cost of Goods Sold ÷ Average Inventory', value: '8.4x', bench: '> 6x', status: 'good', tip: 'Inventory is turning over efficiently. Healthy stock management.' },
            { name: 'Debtors Turnover Ratio', formula: 'Net Credit Sales ÷ Average Debtors', value: '8.1x', bench: '> 8x', status: 'good', tip: 'Collections are efficient — 45 debtor days approximately.' },
            { name: 'Creditors Turnover Ratio', formula: 'Net Credit Purchases ÷ Average Creditors', value: '9.6x', bench: 'Industry specific', status: 'ok', tip: 'Creditor days ~38D. Balanced payment cycle.' },
            { name: 'Capital Turnover Ratio', formula: 'Net Sales ÷ Capital Employed', value: '1.6x', bench: '> 1.2x', status: 'good', tip: 'Higher than industry average — strong asset utilisation.' },
            { name: 'Working Capital Turnover', formula: 'Net Sales ÷ Net Working Capital', value: '5.8x', bench: '> 4x', status: 'good', tip: 'Working capital is being deployed productively.' },
        ]
    },
    {
        id: 'profitability', icon: '💰', name: 'Profitability Ratios',
        color: 'green', desc: 'Measure earnings relative to sales, assets & equity',
        ratios: [
            { name: 'Gross Profit Ratio', formula: 'Gross Profit ÷ Net Sales × 100', value: '22.4%', bench: '> 20%', status: 'good', tip: 'Healthy gross margin — raw material costs are well controlled.' },
            { name: 'Net Profit Ratio', formula: 'Net Profit After Tax ÷ Net Sales × 100', value: '7.4%', bench: '> 8%', status: 'warn', tip: 'Slightly below sector average of 8.5%. Monitor interest expense.' },
            { name: 'Operating Ratio', formula: '(COGS + Operating Expenses) ÷ Net Sales × 100', value: '88.2%', bench: '< 85%', status: 'warn', tip: 'Operating expenses are proportionally high — cost optimisation needed.' },
            { name: 'Operating Profit Ratio', formula: 'Operating Profit ÷ Net Sales × 100', value: '11.8%', bench: '> 12%', status: 'warn', tip: 'Near-threshold EBITDA margin — satisfactory but room for improvement.' },
            { name: 'Expenses Ratio', formula: 'Total Expenses ÷ Net Sales × 100', value: '92.6%', bench: '< 90%', status: 'bad', tip: 'Total expense ratio is above ideal — high fixed costs.' },
            { name: 'Return on Assets (ROA)', formula: 'Net Profit ÷ Total Assets × 100', value: '8.1%', bench: '> 8%', status: 'good', tip: 'Assets are generating adequate returns.' },
            { name: 'Return on Equity (ROE)', formula: 'Net Profit ÷ Shareholders Equity × 100', value: '16.2%', bench: '> 15%', status: 'good', tip: 'Strong equity returns — promoters are earning well on invested capital.' },
        ]
    },
    {
        id: 'proprietary', icon: '🏛️', name: 'Proprietary Ratios',
        color: 'purple', desc: 'Measure shareholders\' stake in total assets',
        ratios: [
            { name: 'Equity Ratio (Proprietary Ratio)', formula: 'Shareholders\' Funds ÷ Total Assets', value: '0.36', bench: '> 0.5 preferred', status: 'warn', tip: 'Only 36% of assets funded by equity — higher reliance on debt.' },
            { name: 'Capital Gearing Ratio', formula: 'Fixed Interest Capital ÷ Equity Shareholders\' Funds', value: '1.82x', bench: '< 1.5x', status: 'warn', tip: 'Company is moderately leveraged. Watch debt servicing.' },
        ]
    },
    {
        id: 'solvency', icon: '🏦', name: 'Solvency Ratios',
        color: 'amber', desc: 'Measure long-term financial stability and debt capacity',
        ratios: [
            { name: 'Debt-Equity Ratio', formula: 'Total Debt ÷ Shareholders\' Equity', value: '1.82x', bench: '< 1.5x preferred', status: 'warn', tip: 'Above preferred threshold. Improving trend (from 2.1x in FY23).' },
            { name: 'Interest Coverage Ratio (ICR)', formula: 'EBIT ÷ Interest Expense', value: '2.8x', bench: '≥ 2.5x', status: 'good', tip: 'Comfortably covers interest obligations. RBI threshold met.' },
            { name: 'Debt Service Coverage Ratio (DSCR)', formula: 'Net Operating Income ÷ Total Debt Service', value: '1.31x', bench: '≥ 1.5x', status: 'warn', tip: 'Marginal DSCR — below bank benchmark. Key risk in this appraisal.' },
            { name: 'Solvency Ratio', formula: 'Net Profit After Tax + Depreciation ÷ Total Liabilities', value: '0.24', bench: '> 0.2', status: 'good', tip: 'Adequate solvency cushion for long-term obligations.' },
        ]
    },
    {
        id: 'leverage', icon: '⚖️', name: 'Leverage Ratios',
        color: 'red', desc: 'Measure use of fixed costs in capital structure',
        ratios: [
            { name: 'Operating Leverage (DOL)', formula: '% Change in EBIT ÷ % Change in Sales', value: '2.4x', bench: '< 3x ideal', status: 'good', tip: 'Moderate operating leverage — manageable fixed cost risk.' },
            { name: 'Financial Leverage (DFL)', formula: '% Change in EPS ÷ % Change in EBIT', value: '1.8x', bench: '< 2x', status: 'good', tip: 'Acceptable financial leverage — EPS amplification is controlled.' },
            { name: 'Combined Leverage (DCL)', formula: 'DOL × DFL', value: '4.3x', bench: '< 5x', status: 'good', tip: 'Total leverage is within safe limits. Moderate overall risk amplification.' },
        ]
    }
];

function renderRatioClassifications() {
    const el = document.getElementById('ratio-class-grid');
    if (!el) return;
    if (!state.company || (!state.isDemo && !state.extractedData)) {
        showPageEmptyState(el, '⚖️', 'Ratio Analysis Standby', state.company ? `Benchmarks and ratio classifications for <strong>${state.company}</strong> will be generated after document processing.` : 'Load a demo case to view financial ratio classifications and benchmarks.');
        return;
    }
    el.innerHTML = RATIO_CATEGORIES.map(cat => `

    <div class="rc-card" id="rcc-${cat.id}">
      <div class="rc-header rcc-${cat.color}" onclick="toggleRatioCard('${cat.id}')">
        <div class="rc-header-left">
          <span class="rc-icon">${cat.icon}</span>
          <div>
            <div class="rc-name">${cat.name}</div>
            <div class="rc-desc">${cat.desc}</div>
          </div>
        </div>
        <div class="rc-meta">
          <span class="rc-count">${cat.ratios.length} ratios</span>
          <span class="rc-toggle-arrow" id="rca-${cat.id}">▼</span>
        </div>
      </div>
      <div class="rc-body" id="rcb-${cat.id}">
        <div class="rc-ratio-list">
          ${cat.ratios.map(r => `
            <div class="rc-ratio-item">
              <div class="rc-ratio-top">
                <span class="rc-ratio-name">${r.name}</span>
                <span class="rc-status rcst-${r.status}">${r.status === 'good' ? '✅ Good' : r.status === 'warn' ? '⚠️ Watch' : r.status === 'bad' ? '🔴 Risk' : 'ℹ️ –'}</span>
              </div>
              <div class="rc-formula">📐 <code>${r.formula}</code></div>
              <div class="rc-ratio-bottom">
                <div class="rc-vals">
                  <span class="rc-company-val">Company: <strong>${r.value}</strong></span>
                  <span class="rc-bench">Benchmark: ${r.bench}</span>
                </div>
                <div class="rc-tip">💬 ${r.tip}</div>
              </div>
            </div>`).join('')}
        </div>
      </div>
    </div>`).join('');
}

function toggleRatioCard(id) {
    const body = document.getElementById('rcb-' + id);
    const arrow = document.getElementById('rca-' + id);
    if (!body || !arrow) return;
    body.classList.toggle('collapsed');
    arrow.textContent = body.classList.contains('collapsed') ? '▶' : '▼';
}
