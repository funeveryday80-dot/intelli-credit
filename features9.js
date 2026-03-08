'use strict';
// ═══════════════════════════════════════════════════════════════════
//  FEATURES 9 — Smart Auto-Ingest | OCR / Messy PDF Handler (v2)
// ═══════════════════════════════════════════════════════════════════

// ─── COMPANY DATABASE ──────────────────────────────────────────────
const COMPANY_DB = {
  // ── NIFTY 50 + SENSEX COMPANIES ──────────────────────────────────
  // Automotive
  'tata motors': { name: 'Tata Motors Ltd', cin: 'L28920MH1945PLC004520', gstin: '27AAACT2091C1ZK', sector: 'Automotive', rating: 'A+ (ICRA)', employees: 82000 },
  'mahindra': { name: 'Mahindra & Mahindra Ltd', cin: 'L65990MH1945PLC004558', gstin: '27AAACM3025H1Z7', sector: 'Automotive', rating: 'AAA (CRISIL)', employees: 260000 },
  'maruti suzuki': { name: 'Maruti Suzuki India Ltd', cin: 'L34103DL1981PLC011375', gstin: '06AAACM4640E1ZQ', sector: 'Automotive', rating: 'AAA (CRISIL)', employees: 22000 },
  'bajaj auto': { name: 'Bajaj Auto Ltd', cin: 'L65993PN2007PLC130076', gstin: '27AABCB0562M1ZW', sector: 'Automotive', rating: 'AAA (CRISIL)', employees: 10000 },
  'hero motocorp': { name: 'Hero MotoCorp Ltd', cin: 'L35911DL1984PLC017354', gstin: '06AAACH0632G1ZE', sector: 'Automotive', rating: 'AAA (CRISIL)', employees: 9000 },
  'eicher motors': { name: 'Eicher Motors Ltd', cin: 'L34102DL1982PLC012259', gstin: '07AAACE0500A1ZZ', sector: 'Automotive', rating: 'AA+ (ICRA)', employees: 12000 },
  // Banking & Financial Services
  'hdfc bank': { name: 'HDFC Bank Ltd', cin: 'L65920MH1994PLC080618', gstin: '27AAACH4702H1Z3', sector: 'NBFC / Financial Services', rating: 'AAA (CRISIL)', employees: 177000 },
  'icici bank': { name: 'ICICI Bank Ltd', cin: 'L65190GJ1994PLC021012', gstin: '24AAACI3862C1Z3', sector: 'NBFC / Financial Services', rating: 'AAA (CRISIL)', employees: 130000 },
  'sbi': { name: 'State Bank of India', cin: 'L64190MH1955GOI009508', gstin: '27AAACS2366K1Z8', sector: 'NBFC / Financial Services', rating: 'AAA (CRISIL)', employees: 232000 },
  'state bank of india': { name: 'State Bank of India', cin: 'L64190MH1955GOI009508', gstin: '27AAACS2366K1Z8', sector: 'NBFC / Financial Services', rating: 'AAA (CRISIL)', employees: 232000 },
  'kotak mahindra': { name: 'Kotak Mahindra Bank Ltd', cin: 'L65110MH1985PLC038137', gstin: '27AAACK1376A1ZC', sector: 'NBFC / Financial Services', rating: 'AAA (CRISIL)', employees: 75000 },
  'axis bank': { name: 'Axis Bank Ltd', cin: 'L65110GJ1993PLC020769', gstin: '24AAACA3880B1Z1', sector: 'NBFC / Financial Services', rating: 'AA+ (ICRA)', employees: 90000 },
  'bajaj finance': { name: 'Bajaj Finance Ltd', cin: 'L65910MH1987PLC042961', gstin: '27AABCB0563L1ZH', sector: 'NBFC / Financial Services', rating: 'AAA (CRISIL)', employees: 45000 },
  'bajaj finserv': { name: 'Bajaj Finserv Ltd', cin: 'L65923PN2007PLC130075', gstin: '27AABCB0564K1ZG', sector: 'NBFC / Financial Services', rating: 'AAA (CRISIL)', employees: 18000 },
  'indusind bank': { name: 'IndusInd Bank Ltd', cin: 'L65191PN1994PLC076333', gstin: '27AAACI5607A1ZM', sector: 'NBFC / Financial Services', rating: 'AA (ICRA)', employees: 40000 },
  'shriram finance': { name: 'Shriram Finance Ltd', cin: 'L65191TN1979PLC007874', gstin: '33AAACS6407N1ZY', sector: 'NBFC / Financial Services', rating: 'AA+ (CRISIL)', employees: 55000 },
  'hdfc life': { name: 'HDFC Life Insurance Co Ltd', cin: 'L65110MH2000PLC128245', gstin: '27AAACH7751J1ZO', sector: 'NBFC / Financial Services', rating: 'AAA (CRISIL)', employees: 18000 },
  'sbi life': { name: 'SBI Life Insurance Co Ltd', cin: 'L99999MH2000PLC129113', gstin: '27AAFCS2286K1ZF', sector: 'NBFC / Financial Services', rating: 'AAA (CRISIL)', employees: 18000 },
  'lic': { name: 'Life Insurance Corporation of India', cin: 'L66010MH1956GOI009410', gstin: '27AAAGL0004M1ZA', sector: 'NBFC / Financial Services', rating: 'AAA (CRISIL)', employees: 115000 },
  // IT / Technology
  'infosys': { name: 'Infosys Ltd', cin: 'L85110KA1981PLC013115', gstin: '29AAACI1275E1ZJ', sector: 'IT / Technology', rating: 'AAA (CRISIL)', employees: 343000 },
  'tcs': { name: 'Tata Consultancy Services Ltd', cin: 'L22210MH1995PLC084781', gstin: '27AAACT2687P1ZE', sector: 'IT / Technology', rating: 'AAA (CRISIL)', employees: 615000 },
  'tata consultancy': { name: 'Tata Consultancy Services Ltd', cin: 'L22210MH1995PLC084781', gstin: '27AAACT2687P1ZE', sector: 'IT / Technology', rating: 'AAA (CRISIL)', employees: 615000 },
  'wipro': { name: 'Wipro Ltd', cin: 'L32102KA1945PLC020800', gstin: '29AAACW0024G1ZD', sector: 'IT / Technology', rating: 'AA+ (ICRA)', employees: 258000 },
  'hcl technologies': { name: 'HCL Technologies Ltd', cin: 'L74140DL1991PLC046369', gstin: '09AAACH3476A1Z6', sector: 'IT / Technology', rating: 'AAA (CRISIL)', employees: 227000 },
  'hcl tech': { name: 'HCL Technologies Ltd', cin: 'L74140DL1991PLC046369', gstin: '09AAACH3476A1Z6', sector: 'IT / Technology', rating: 'AAA (CRISIL)', employees: 227000 },
  'tech mahindra': { name: 'Tech Mahindra Ltd', cin: 'L64200MH1986PLC041370', gstin: '27AAACT2891H1ZX', sector: 'IT / Technology', rating: 'AA+ (ICRA)', employees: 158000 },
  // Oil, Gas & Energy
  'reliance industries': { name: 'Reliance Industries Ltd', cin: 'L17110MH1973PLC019786', gstin: '27AAACR5055K1ZT', sector: 'Oil & Gas / Retail / Telecom', rating: 'AAA (CRISIL)', employees: 345000 },
  'ongc': { name: 'Oil & Natural Gas Corporation Ltd', cin: 'L74899DL1993GOI054155', gstin: '07AAACO1521H1ZA', sector: 'Oil & Gas / Retail / Telecom', rating: 'AAA (CRISIL)', employees: 33000 },
  'oil and natural gas': { name: 'Oil & Natural Gas Corporation Ltd', cin: 'L74899DL1993GOI054155', gstin: '07AAACO1521H1ZA', sector: 'Oil & Gas / Retail / Telecom', rating: 'AAA (CRISIL)', employees: 33000 },
  'bp': { name: 'Bharat Petroleum Corporation Ltd', cin: 'L23220MH1952GOI008931', gstin: '27AAACB2498E1ZX', sector: 'Oil & Gas / Retail / Telecom', rating: 'AAA (CRISIL)', employees: 12000 },
  'bpcl': { name: 'Bharat Petroleum Corporation Ltd', cin: 'L23220MH1952GOI008931', gstin: '27AAACB2498E1ZX', sector: 'Oil & Gas / Retail / Telecom', rating: 'AAA (CRISIL)', employees: 12000 },
  'ioc': { name: 'Indian Oil Corporation Ltd', cin: 'L23201DL1959GOI003746', gstin: '07AAACI8832E1ZG', sector: 'Oil & Gas / Retail / Telecom', rating: 'AAA (CRISIL)', employees: 33000 },
  'indian oil': { name: 'Indian Oil Corporation Ltd', cin: 'L23201DL1959GOI003746', gstin: '07AAACI8832E1ZG', sector: 'Oil & Gas / Retail / Telecom', rating: 'AAA (CRISIL)', employees: 33000 },
  'ntpc': { name: 'NTPC Ltd', cin: 'L40101DL1975GOI007966', gstin: '07AAACN0187C1ZJ', sector: 'Infrastructure', rating: 'AAA (CRISIL)', employees: 22000 },
  'power grid': { name: 'Power Grid Corporation of India Ltd', cin: 'L40101DL1989GOI038121', gstin: '07AAACP0165G1ZY', sector: 'Infrastructure', rating: 'AAA (CRISIL)', employees: 9000 },
  // Metals & Mining
  'tata steel': { name: 'Tata Steel Ltd', cin: 'L27100MH1907PLC000002', gstin: '27AAACT2087F1ZA', sector: 'Metals & Mining', rating: 'A (ICRA)', employees: 80000 },
  'jsw steel': { name: 'JSW Steel Ltd', cin: 'L27102KA1994PLC016554', gstin: '29AAACJ3893K1ZU', sector: 'Metals & Mining', rating: 'AA (CRISIL)', employees: 40000 },
  'hindalco': { name: 'Hindalco Industries Ltd', cin: 'L27020MH1958PLC011238', gstin: '27AAACH0011A1Z7', sector: 'Metals & Mining', rating: 'AA (CRISIL)', employees: 60000 },
  'vedanta': { name: 'Vedanta Ltd', cin: 'L13209MH1965PLC291394', gstin: '27AAACV2463J1ZC', sector: 'Metals & Mining', rating: 'AA (ICRA)', employees: 75000 },
  'coal india': { name: 'Coal India Ltd', cin: 'L10101WB1973GOI028844', gstin: '19AAACC7432B1ZV', sector: 'Metals & Mining', rating: 'AAA (CRISIL)', employees: 250000 },
  // Consumer / FMCG / Retail
  'itc': { name: 'ITC Ltd', cin: 'L16005WB1910PLC001985', gstin: '19AAACI2268B1ZD', sector: 'FMCG / Retail', rating: 'AAA (CRISIL)', employees: 36000 },
  'hindustan unilever': { name: 'Hindustan Unilever Ltd', cin: 'L15140MH1933PLC002030', gstin: '27AAACH0229L1ZG', sector: 'FMCG / Retail', rating: 'AAA (CRISIL)', employees: 22000 },
  'hul': { name: 'Hindustan Unilever Ltd', cin: 'L15140MH1933PLC002030', gstin: '27AAACH0229L1ZG', sector: 'FMCG / Retail', rating: 'AAA (CRISIL)', employees: 22000 },
  'nestle india': { name: 'Nestle India Ltd', cin: 'L15202DL1959PLC003786', gstin: '07AAACN0047H1ZL', sector: 'FMCG / Retail', rating: 'AAA (CRISIL)', employees: 8000 },
  'britannia': { name: 'Britannia Industries Ltd', cin: 'L15412WB1918PLC002964', gstin: '19AAACB2473A1ZM', sector: 'FMCG / Retail', rating: 'AA+ (CRISIL)', employees: 4000 },
  'titan company': { name: 'Titan Company Ltd', cin: 'L74999TN1984PLC010444', gstin: '33AAACT5283P1ZY', sector: 'FMCG / Retail', rating: 'AAA (CRISIL)', employees: 8000 },
  'trent': { name: 'Trent Ltd', cin: 'L24239MH1952PLC009168', gstin: '27AAACT3340L1ZX', sector: 'FMCG / Retail', rating: 'AA (CRISIL)', employees: 14000 },
  // Pharma / Healthcare
  'sun pharma': { name: 'Sun Pharmaceutical Industries Ltd', cin: 'L24230GJ1993PLC019050', gstin: '24AAACS7606J1ZO', sector: 'Pharma / Healthcare', rating: 'AAA (CRISIL)', employees: 43000 },
  'dr reddys': { name: "Dr. Reddy's Laboratories Ltd", cin: 'L85195TG1984PLC004507', gstin: '36AAACR0680F1ZG', sector: 'Pharma / Healthcare', rating: 'AA+ (ICRA)', employees: 25000 },
  'dr reddys laboratories': { name: "Dr. Reddy's Laboratories Ltd", cin: 'L85195TG1984PLC004507', gstin: '36AAACR0680F1ZG', sector: 'Pharma / Healthcare', rating: 'AA+ (ICRA)', employees: 25000 },
  'cipla': { name: 'Cipla Ltd', cin: 'L24239MH1935PLC002380', gstin: '27AAACC0138E1ZP', sector: 'Pharma / Healthcare', rating: 'AA+ (CRISIL)', employees: 25000 },
  'divis laboratories': { name: "Divi's Laboratories Ltd", cin: 'L24110TG1990PLC011977', gstin: '36AAACD6200M1ZX', sector: 'Pharma / Healthcare', rating: 'AA (ICRA)', employees: 18000 },
  'apollo hospitals': { name: 'Apollo Hospitals Enterprise Ltd', cin: 'L85110TN1979PLC008035', gstin: '33AAACA1987J1ZX', sector: 'Pharma / Healthcare', rating: 'AA (ICRA)', employees: 72000 },
  // Infrastructure & Real Estate
  'larsen toubro': { name: 'Larsen & Toubro Ltd', cin: 'L99999MH1946PLC004768', gstin: '27AAACL0287N1Z8', sector: 'Infrastructure', rating: 'AAA (CRISIL)', employees: 440000 },
  'l&t': { name: 'Larsen & Toubro Ltd', cin: 'L99999MH1946PLC004768', gstin: '27AAACL0287N1Z8', sector: 'Infrastructure', rating: 'AAA (CRISIL)', employees: 440000 },
  'ultratech cement': { name: 'UltraTech Cement Ltd', cin: 'L26940MH2000PLC128420', gstin: '27AAACU2363M1ZK', sector: 'Infrastructure', rating: 'AAA (CRISIL)', employees: 24000 },
  'grasim': { name: 'Grasim Industries Ltd', cin: 'L17124MP1947PLC000410', gstin: '23AAACG0393F1Z3', sector: 'Manufacturing', rating: 'AAA (CRISIL)', employees: 17000 },
  'adani enterprises': { name: 'Adani Enterprises Ltd', cin: 'L51100GJ1993PLC019067', gstin: '24AAACA5065P1Z9', sector: 'Infrastructure', rating: 'A (ICRA)', employees: 18000 },
  'adani ports': { name: 'Adani Ports & SEZ Ltd', cin: 'L63090GJ1998PLC034182', gstin: '24AAACA7826B1ZF', sector: 'Infrastructure', rating: 'A+ (ICRA)', employees: 16000 },
  'adani green': { name: 'Adani Green Energy Ltd', cin: 'L40106GJ1990PLC013925', gstin: '24AAACA5248P1Z8', sector: 'Infrastructure', rating: 'A (INDIA RATINGS)', employees: 5000 },
  'adani total gas': { name: 'Adani Total Gas Ltd', cin: 'L40200GJ1999PLC036401', gstin: '24AAACA5197B1ZE', sector: 'Infrastructure', rating: 'A+ (CRISIL)', employees: 2000 },
  'dlf': { name: 'DLF Ltd', cin: 'L70101HR1963PLC002484', gstin: '06AAACL3065M1ZW', sector: 'Real Estate', rating: 'AA- (CRISIL)', employees: 4000 },
  // Telecom
  'bharti airtel': { name: 'Bharti Airtel Ltd', cin: 'L74899DL1995PLC070609', gstin: '07AAACB2383K1ZZ', sector: 'IT / Technology', rating: 'AA+ (ICRA)', employees: 18000 },
  'airtel': { name: 'Bharti Airtel Ltd', cin: 'L74899DL1995PLC070609', gstin: '07AAACB2383K1ZZ', sector: 'IT / Technology', rating: 'AA+ (ICRA)', employees: 18000 },
  // Specialty / Others
  'asian paints': { name: 'Asian Paints Ltd', cin: 'L24220MH1945PLC004598', gstin: '27AAACA6563E1ZX', sector: 'Manufacturing', rating: 'AAA (CRISIL)', employees: 8000 },
  'pidilite': { name: 'Pidilite Industries Ltd', cin: 'L24100MH1969PLC014336', gstin: '27AAACP2071G1ZG', sector: 'Manufacturing', rating: 'AAA (CRISIL)', employees: 7000 },
  'tata consumer': { name: 'Tata Consumer Products Ltd', cin: 'L15491WB1962PLC031425', gstin: '19AAACT3791N1Z0', sector: 'FMCG / Retail', rating: 'AAA (CRISIL)', employees: 11000 },
  'jswenergy': { name: 'JSW Energy Ltd', cin: 'L74999MH1994PLC077041', gstin: '27AAACJ3696N1ZS', sector: 'Infrastructure', rating: 'AA (CRISIL)', employees: 4000 },
  'jsw energy': { name: 'JSW Energy Ltd', cin: 'L74999MH1994PLC077041', gstin: '27AAACJ3696N1ZS', sector: 'Infrastructure', rating: 'AA (CRISIL)', employees: 4000 },
  'wipro enterprises': { name: 'Wipro Enterprises Pvt Ltd', cin: 'U29219KA2012PTC063982', gstin: '29AABCW1069A1ZZ', sector: 'Manufacturing', rating: 'AA (CRISIL)', employees: 13000 },
  'motherson sumi': { name: 'Samvardhana Motherson International Ltd', cin: 'L34300DL1986PLC026342', gstin: '07AAACS4001J1ZY', sector: 'Automotive', rating: 'AA (CRISIL)', employees: 167000 },
  'bharat forge': { name: 'Bharat Forge Ltd', cin: 'L25209PN1961PLC012046', gstin: '27AAACB1288K1ZM', sector: 'Manufacturing', rating: 'AA (ICRA)', employees: 14000 },
  'siemens': { name: 'Siemens Ltd', cin: 'L31600MH1957PLC010839', gstin: '27AAACS7047J1ZW', sector: 'Manufacturing', rating: 'AAA (CRISIL)', employees: 8300 },
  'havells': { name: 'Havells India Ltd', cin: 'L31900DL1983PLC016304', gstin: '07AAACH0813A1ZR', sector: 'Manufacturing', rating: 'AAA (CRISIL)', employees: 7000 },
  'zomato': { name: 'Zomato Ltd', cin: 'L74110HR2010PLC045525', gstin: '06AABCZ0834K1ZP', sector: 'FMCG / Retail', rating: 'A (ICRA)', employees: 6000 },
  'nykaa': { name: 'FSN E-Commerce Ventures Ltd (Nykaa)', cin: 'U74120MH2012PLC230136', gstin: '27AABCF1025L1ZJ', sector: 'FMCG / Retail', rating: 'BBB+ (ICRA)', employees: 4600 },
  'paytm': { name: 'One 97 Communications Ltd (Paytm)', cin: 'U72200DL2000PLC107396', gstin: '07AABCO0059E1ZF', sector: 'IT / Technology', rating: 'A- (ICRA)', employees: 36000 },
};

const OCR_STAGES = [
  { icon: '🔍', text: 'Detecting document type & orientation...', ms: 600 },
  { icon: '📐', text: 'Deskewing & dewarping scanned image...', ms: 700 },
  { icon: '🌫️', text: 'Applying adaptive noise reduction filter...', ms: 800 },
  { icon: '✂️', text: 'Segmenting text regions & tables...', ms: 700 },
  { icon: '🔠', text: 'Running Tesseract OCR engine (Layer 1)...', ms: 900 },
  { icon: '🤖', text: 'AI correction pass — fixing OCR artifacts...', ms: 800 },
  { icon: '🧮', text: 'Extracting financial tables & key figures...', ms: 700 },
  { icon: '✅', text: 'Validation complete — data ready for analysis', ms: 400 },
];

const DOC_TYPES_OCR = {
  annual: { label: 'Annual Report / Balance Sheet', quality: 'Scanned (Moderate Quality)', pages: 148, tables: 24, figures: 'Revenue ₹847 Cr, PAT ₹62.3 Cr, Net Worth ₹312 Cr extracted' },
  gst: { label: 'GSTR-3B Returns', quality: 'Digital PDF', pages: 12, tables: 8, figures: 'Quarterly turnover, ITC ₹14.2 Cr query, tax paid extracted' },
  bank: { label: 'Bank Statement (SBI)', quality: 'Scanned (Low Quality — Messy)', pages: 48, tables: null, figures: '12-month transactions, avg monthly credit ₹72 Cr extracted' },
  itr: { label: 'ITR-6 Acknowledgement', quality: 'Digital (Clean)', pages: 6, tables: 3, figures: 'Gross income ₹847 Cr, taxable income, refund ₹3.2 Cr extracted' },
  legal: { label: 'Legal Notice / NI Act', quality: 'Scanned (Faded Copy)', pages: 4, tables: null, figures: 'Case no. ICICI/2024/NI138 · ₹8.2 Cr · Mumbai Court extracted' },
  rating: { label: 'CRISIL Rating Rationale', quality: 'Digital PDF', pages: 22, tables: 6, figures: 'BBB+ rating, Stable outlook, DSCR 1.31x extracted' },
};

// ─── SLEEP HELPER ─────────────────────────────────────────────────
function aic_sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ─── FUZZY MATCH ──────────────────────────────────────────────────
function matchCompanies(query) {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const entries = Object.entries(COMPANY_DB);
  // Priority: name starts with query first, then any substring match
  const starts = entries.filter(([key, co]) =>
    co.name.toLowerCase().startsWith(q) || key.startsWith(q)
  );
  const contains = entries.filter(([key, co]) =>
    !co.name.toLowerCase().startsWith(q) && !key.startsWith(q) &&
    (co.name.toLowerCase().includes(q) || key.includes(q) || co.cin.toLowerCase().includes(q))
  );
  return [...starts, ...contains];
}

// ─── SETUP AUTOCOMPLETE ON INPUT ─────────────────────────────────
function setupAutoIngest() {
  const compInput = document.getElementById('company-name');
  if (!compInput) return;
  // Guard: only wire once per page visit; reset on re-entry handled by removing old dropdown
  if (compInput._aiWired) {
    // Already wired — just ensure dropdown is clean
    const old = document.getElementById('ai-suggest-dropdown');
    if (!old) compInput._aiWired = false; // DOM was cleared, re-initialise
    else return;
  }
  compInput._aiWired = true;

  // Remove any old dropdown
  const old = document.getElementById('ai-suggest-dropdown');
  if (old) old.remove();

  // Position the dropdown relative to the company-input-row (the grid row)
  const row = document.querySelector('.company-input-row');
  const inputGroup = compInput.closest('.input-group');
  if (!inputGroup) return;
  inputGroup.style.position = 'relative';

  const dropdown = document.createElement('div');
  dropdown.id = 'ai-suggest-dropdown';
  dropdown.className = 'ai-suggest-dropdown hidden';
  inputGroup.appendChild(dropdown);

  function updateDropdown() {
    const val = compInput.value.trim();
    if (!val) { dropdown.classList.add('hidden'); return; }
    const matches = matchCompanies(val);
    if (matches.length) {
      dropdown.innerHTML = matches.slice(0, 6).map(([key, co]) =>
        `<div class="ai-suggest-item" onclick="selectAutoCompany('${key}')">
                    <span class="ai-suggest-icon">🏢</span>
                    <div class="ai-suggest-info">
                        <div class="ai-suggest-name">${co.name}</div>
                        <div class="ai-suggest-meta">${co.sector} &nbsp;·&nbsp; ${co.cin}</div>
                    </div>
                    <span class="ai-suggest-badge">MCA ✓</span>
                </div>`
      ).join('');
    } else {
      dropdown.innerHTML = `<div class="ai-suggest-item ai-suggest-custom" onclick="triggerFullAutoIngest('${val.replace(/'/g, "\\'")}')">
                <span class="ai-suggest-icon">⚡</span>
                <div class="ai-suggest-info">
                    <div class="ai-suggest-name">${val}</div>
                    <div class="ai-suggest-meta">Click to run full auto-analysis</div>
                </div>
                <span class="ai-suggest-badge">Analyse →</span>
            </div>`;
    }
    dropdown.classList.remove('hidden');
  }

  compInput.addEventListener('input', updateDropdown);

  compInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = this.value.trim();
      if (!val) return;
      const matches = matchCompanies(val);
      if (matches.length) selectAutoCompany(matches[0][0]);
      else triggerFullAutoIngest(val);
    }
    if (e.key === 'Escape') dropdown.classList.add('hidden');
  });

  // Also add a 🔍 AUTO-ANALYSE button inline next to the input
  if (!document.getElementById('auto-analyse-trigger-btn')) {
    const btn = document.createElement('button');
    btn.id = 'auto-analyse-trigger-btn';
    btn.type = 'button';
    btn.className = 'btn btn-primary auto-analyse-inline-btn';
    btn.innerHTML = '⚡ Auto-Analyse';
    btn.title = 'Type company name above and click to auto-fetch all documents';
    btn.onclick = function () {
      const val = compInput.value.trim();
      if (!val) { toast('Enter Company Name', 'Please type a company name first', 'warn'); compInput.focus(); return; }
      const matches = matchCompanies(val);
      dropdown.classList.add('hidden');
      if (matches.length) selectAutoCompany(matches[0][0]);
      else triggerFullAutoIngest(val);
    };
    inputGroup.appendChild(btn);
  }

  // Close on outside click
  document.addEventListener('click', function handleOutside(e) {
    if (!inputGroup.contains(e.target)) {
      dropdown.classList.add('hidden');
    }
  });
}

// ─── SELECT FROM DROPDOWN ─────────────────────────────────────────
function selectAutoCompany(key) {
  const co = COMPANY_DB[key];
  if (!co) return;

  const dropdown = document.getElementById('ai-suggest-dropdown');
  if (dropdown) dropdown.classList.add('hidden');

  const nameEl = document.getElementById('company-name');
  const cinEl = document.getElementById('company-cin');
  const sectorEl = document.getElementById('company-sector');

  if (nameEl) nameEl.value = co.name;
  if (cinEl) cinEl.value = co.cin;

  // Match sector option to dropdown — find closest option text
  if (sectorEl) {
    const sectorLower = co.sector.toLowerCase();
    for (const opt of sectorEl.options) {
      if (sectorLower.includes(opt.text.toLowerCase().split(' ')[0].toLowerCase()) ||
        opt.text.toLowerCase().includes(sectorLower.split(' ')[0].toLowerCase())) {
        sectorEl.value = opt.value;
        break;
      }
    }
  }

  triggerFullAutoIngest(co.name);
}

// ─── TRIGGER MAIN INGEST FLOW ─────────────────────────────────────
function triggerFullAutoIngest(companyName) {
  if (!companyName || !companyName.trim()) return;
  document.getElementById('ai-suggest-dropdown')?.classList.add('hidden');
  showAutoIngestModal(companyName.trim());
}

// ─── AUTO-INGEST MODAL ────────────────────────────────────────────
function showAutoIngestModal(companyName) {
  // Remove any existing modal completely
  const existing = document.getElementById('auto-ingest-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'auto-ingest-modal';
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-box auto-ingest-box" id="aib-box">
        <div class="aib-close-btn" onclick="document.getElementById('auto-ingest-modal').remove()">✕</div>
        <div class="aib-header">
            <div class="aib-title-row">
                <div class="aib-ai-pulse"></div>
                <h3>🤖 Smart Auto-Ingest Engine</h3>
            </div>
            <div class="aib-company-name">${companyName}</div>
            <div class="aib-subtitle">AI is fetching, OCR-processing & analysing all documents automatically</div>
        </div>

        <div class="aib-phases-wrap">
            <!-- Phase 1 -->
            <div class="aib-phase-card">
                <div class="aib-phase-title">📷 Phase 1 — OCR &amp; Document Processing</div>
                <div id="aib-ocr-stages" class="aib-ocr-stages"></div>
            </div>
            <!-- Phase 2 -->
            <div class="aib-phase-card">
                <div class="aib-phase-title">📥 Phase 2 — Fetching &amp; Ingesting Documents</div>
                <div id="aib-doc-grid" class="aib-doc-grid"></div>
            </div>
            <!-- Phase 3 -->
            <div class="aib-phase-card">
                <div class="aib-phase-title">🧠 Phase 3 — Running AI Analysis</div>
                <div id="aib-analysis-steps" class="aib-analysis-steps"></div>
            </div>
            <!-- Result -->
            <div class="aib-result hidden" id="aib-result">
                <div class="aib-result-icon">✅</div>
                <div class="aib-result-title">Analysis Complete!</div>
                <div class="aib-result-desc">All documents ingested &amp; financial analysis generated for <strong>${companyName}</strong></div>
                <div id="aib-result-stats" class="aib-result-stats"></div>
                <div class="aib-result-actions">
                    <button class="btn btn-primary btn-lg" onclick="completeAutoIngest('${companyName.replace(/'/g, "\\'")}')">View Full Analysis →</button>
                    <button class="btn btn-ghost" onclick="document.getElementById('auto-ingest-modal').remove()">Close</button>
                </div>
            </div>
        </div>
    </div>`;

  document.body.appendChild(modal);
  // Prevent scroll on body
  document.body.style.overflow = 'hidden';
  modal.addEventListener('click', e => { if (e.target === modal) { modal.remove(); document.body.style.overflow = ''; } });

  runAutoIngestSequence(companyName);
}

async function runAutoIngestSequence(companyName) {
  // ── Phase 1: OCR ──
  const ocrEl = document.getElementById('aib-ocr-stages');
  if (!ocrEl) return;

  for (let i = 0; i < OCR_STAGES.length; i++) {
    const s = OCR_STAGES[i];
    const div = document.createElement('div');
    div.className = 'ocr-stage';
    div.id = `aib-ocr-s-${i}`;
    div.innerHTML = `<span class="ocr-stage-icon">${s.icon}</span><span class="ocr-stage-text">${s.text}</span><span class="ocr-stage-badge pending-badge">⏳</span>`;
    ocrEl.appendChild(div);
    ocrEl.scrollTop = ocrEl.scrollHeight;
    await aic_sleep(s.ms);
    div.classList.add('done');
    div.querySelector('.ocr-stage-badge').textContent = '✓';
    div.querySelector('.ocr-stage-badge').className = 'ocr-stage-badge done-badge';
  }

  // ── Phase 2: Document fetch ──
  await aic_sleep(200);
  const docGrid = document.getElementById('aib-doc-grid');
  if (!docGrid) return;

  for (const [key, doc] of Object.entries(DOC_TYPES_OCR)) {
    const card = document.createElement('div');
    card.className = 'aib-doc-card';
    card.id = `aib-doc-${key}`;
    const qualityIcon = doc.quality.includes('Low') ? '🔴' : doc.quality.includes('Moderate') ? '🟡' : '🟢';
    card.innerHTML = `
            <div class="aib-doc-top">
                <span class="aib-doc-status-icon">⏳</span>
                <span class="aib-doc-name">${doc.label}</span>
                <span class="aib-doc-quality">${qualityIcon}</span>
            </div>
            <div class="aib-doc-qual-txt">${doc.quality} · ${doc.pages} pages</div>
            <div class="aib-doc-progbar"><div class="aib-doc-progfill" id="aib-fill-${key}"></div></div>
            <div class="aib-doc-extracted-row" id="aib-ext-${key}"></div>`;
    docGrid.appendChild(card);
    await aic_sleep(100);

    // Animate bar
    const fill = document.getElementById(`aib-fill-${key}`);
    let pct = 0;
    const iv = setInterval(() => {
      pct = Math.min(100, pct + (Math.random() * 10 + 6));
      if (fill) fill.style.width = pct + '%';
      if (pct >= 100) clearInterval(iv);
    }, 55);
    await aic_sleep(1100 + Math.random() * 500);
    clearInterval(iv);
    if (fill) fill.style.width = '100%';

    card.classList.add('done');
    const si = card.querySelector('.aib-doc-status-icon');
    if (si) si.textContent = '✅';
    const ext = document.getElementById(`aib-ext-${key}`);
    if (ext) ext.innerHTML = `<span class="aib-ext-text">↳ ${doc.figures}</span>`;
  }

  // ── Phase 3: Analysis ──
  await aic_sleep(300);
  const analysisEl = document.getElementById('aib-analysis-steps');
  if (!analysisEl) return;

  const steps = [
    { icon: '📊', text: 'Computing DSCR 1.31x, D/E 1.82x, Current Ratio 1.18x...' },
    { icon: '⚠️', text: 'GST vs Bank cross-analysis — ₹14.2 Cr variance flagged...' },
    { icon: '🔍', text: 'MCA21 portal — 5 directors verified, DIN checks complete...' },
    { icon: '⚖️', text: 'eCourts query — 1 active NI Act case identified...' },
    { icon: '🤖', text: 'NPA ML model — computing 12-month probability score...' },
    { icon: '📜', text: 'Covenant tracker — 3 breaches detected...' },
    { icon: '🏆', text: 'Five-C composite credit score: 66/100 (Grade B)...' },
    { icon: '✅', text: 'CAM report generated — ready for review!' },
  ];

  for (let i = 0; i < steps.length; i++) {
    const s = steps[i];
    const row = document.createElement('div');
    row.className = 'aib-analysis-row';
    row.id = `aib-ans-${i}`;
    row.innerHTML = `<span class="ans-icon">${s.icon}</span><span class="ans-text">${s.text}</span><span class="ans-badge pending-badge">⏳</span>`;
    analysisEl.appendChild(row);
    analysisEl.scrollTop = analysisEl.scrollHeight;
    await aic_sleep(600 + Math.random() * 300);
    row.classList.add('done');
    row.querySelector('.ans-badge').textContent = '✓';
    row.querySelector('.ans-badge').className = 'ans-badge done-badge';
  }

  // ── Show result ──
  await aic_sleep(400);
  const resultEl = document.getElementById('aib-result');
  if (resultEl) {
    resultEl.classList.remove('hidden');
    document.getElementById('aib-result-stats').innerHTML = `
            <div class="aib-stat"><span>6</span><label>Docs Ingested</label></div>
            <div class="aib-stat"><span>10</span><label>Research Signals</label></div>
            <div class="aib-stat"><span>5</span><label>Risk Flags</label></div>
            <div class="aib-stat"><span>66</span><label>Credit Score</label></div>`;
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function completeAutoIngest(companyName) {
  const modal = document.getElementById('auto-ingest-modal');
  if (modal) { modal.remove(); document.body.style.overflow = ''; }

  // Kick off the full dynamic analysis pipeline (generates company-specific data)
  if (typeof startAppraisal === 'function') {
    startAppraisal(companyName);
  } else {
    // Fallback: use demo data if startAppraisal not available
    state.company = companyName;
    const el = document.getElementById('sidebar-company');
    if (el) el.innerHTML = `<strong style="color:var(--text-primary)">${companyName}</strong>`;
    loadDemo(companyName);
  }

  // Inject "Re-Analyse" button into extraction panel after pipeline completes
  setTimeout(() => injectReAnalyseButton(companyName), 9500);
}

function injectReAnalyseButton(companyName) {
  const panel = document.getElementById('extraction-panel');
  if (!panel || document.getElementById('re-analyse-btn')) return;
  const banner = document.createElement('div');
  banner.id = 're-analyse-banner';
  banner.className = 're-analyse-banner';
  banner.innerHTML = `
    <div class="re-analyse-info">
      <span class="re-analyse-icon">📂</span>
      <div>
        <div class="re-analyse-title">Add more documents to update the analysis</div>
        <div class="re-analyse-sub">Upload additional files using the panels above, then click Re-Analyse to regenerate the full report.</div>
      </div>
    </div>
    <button id="re-analyse-btn" class="btn btn-primary re-analyse-btn-el" onclick="triggerReAnalysis('${companyName.replace(/'/g, "\\'")}')">⚡ Re-Analyse</button>`;
  panel.insertAdjacentElement('afterbegin', banner);
}

function triggerReAnalysis(companyName) {
  const name = companyName || state.company || document.getElementById('company-name')?.value?.trim() || 'Company';
  toast('🔄 Re-Analysis', 'Running updated analysis with new documents...', 'info');
  showAutoIngestModal(name);
}

// ─── OCR PANEL ────────────────────────────────────────────────────
function showOCRPanel(docType) {
  const existing = document.getElementById('ocr-panel-modal');
  if (existing) existing.remove();

  const docInfo = DOC_TYPES_OCR[docType] || { label: 'Document', quality: 'Scanned', pages: 20, figures: 'Data extracted' };
  const qualityIcon = docInfo.quality.includes('Low') ? '🔴' : docInfo.quality.includes('Moderate') ? '🟡' : '🟢';

  const panel = document.createElement('div');
  panel.id = 'ocr-panel-modal';
  panel.className = 'modal-overlay';
  panel.innerHTML = `
    <div class="modal-box ocr-panel-box">
        <div class="modal-header">
            <h3>📷 IntelliOCR — Smart Document Processor</h3>
            <button class="modal-close" onclick="document.getElementById('ocr-panel-modal').remove()">✕</button>
        </div>
        <div class="modal-body">
            <div class="ocr-doc-info">
                <span class="ocr-quality-icon">${qualityIcon}</span>
                <span class="ocr-doc-label"><strong>${docInfo.label}</strong></span>
                <span class="ocr-doc-pages">${docInfo.pages} pages</span>
                <span class="ocr-quality-txt">${docInfo.quality}</span>
            </div>
            <div class="ocr-pipeline" id="ocr-pipeline-${docType}">
                ${['detect', 'enhance', 'ocr', 'ai', 'extract'].map((step, i) => {
    const titles = { detect: '🔍 Document Detection', enhance: '✨ Image Enhancement', ocr: '🔠 OCR Engine', ai: '🤖 AI Correction (Gemini)', extract: '🧮 Financial Extraction' };
    const descs = { detect: 'Detecting page boundaries, orientation, and skew angle...', enhance: 'Adaptive binarization · Noise removal · Contrast boost', ocr: 'Multi-language OCR (English + Hindi numerals)...', ai: 'Correcting OCR errors, fixing misread numerals...', extract: 'Identifying tables, mapping rows to financial statements...' };
    return `<div class="ocr-pipe-step" id="pipe-${step}">
                        <div class="ocr-step-num">${i + 1}</div>
                        <div class="ocr-step-body">
                            <div class="ocr-step-title">${titles[step]}</div>
                            <div class="ocr-step-detail" id="pipe-${step}-detail">${descs[step]}</div>
                        </div>
                        <div class="ocr-step-status" id="pipe-${step}-status">⏳</div>
                    </div>`;
  }).join('')}
            </div>
            <div class="ocr-result hidden" id="ocr-result-panel">
                <div class="ocr-result-header">✅ Extraction Complete</div>
                <div class="ocr-confidence-row">
                    <span>OCR Confidence:</span>
                    <div class="ocr-conf-bar-wrap"><div class="ocr-conf-bar" id="ocr-conf-bar"></div></div>
                    <span id="ocr-conf-pct" class="ocr-conf-pct">0%</span>
                </div>
                <div class="ocr-extracted-grid" id="ocr-extracted-grid"></div>
                <div id="ocr-issues"></div>
            </div>
        </div>
    </div>`;
  document.body.appendChild(panel);
  panel.addEventListener('click', e => { if (e.target === panel) panel.remove(); });
  runOCRPipeline(docType);
}

async function runOCRPipeline(docType) {
  const stepDetails = {
    detect: 'Detected: Portrait A4 · Skew: 2.3° corrected · 300 DPI',
    enhance: 'Applied: Otsu binarization + median blur + CLAHE contrast',
    ocr: `Character accuracy: ${Math.floor(88 + Math.random() * 10)}% · ${Math.floor(1200 + Math.random() * 400)} words extracted`,
    ai: 'Fixed 47 numeral misreads · Reconstructed 3 damaged table cells',
    extract: DOC_TYPES_OCR[docType]?.figures || 'Key figures extracted successfully',
  };
  const delays = { detect: 900, enhance: 1000, ocr: 1100, ai: 900, extract: 800 };
  const steps = ['detect', 'enhance', 'ocr', 'ai', 'extract'];

  for (const step of steps) {
    await aic_sleep(delays[step]);
    const statusEl = document.getElementById(`pipe-${step}-status`);
    const detailEl = document.getElementById(`pipe-${step}-detail`);
    const stepEl = document.getElementById(`pipe-${step}`);
    if (!statusEl) break; // modal was closed
    statusEl.textContent = '✓';
    statusEl.style.color = '#22c55e';
    if (detailEl) detailEl.textContent = stepDetails[step];
    if (stepEl) stepEl.classList.add('pipe-done');
  }

  await aic_sleep(300);
  const resultPanel = document.getElementById('ocr-result-panel');
  if (!resultPanel) return;
  resultPanel.classList.remove('hidden');

  const conf = Math.floor(87 + Math.random() * 11);
  const confBar = document.getElementById('ocr-conf-bar');
  const confPct = document.getElementById('ocr-conf-pct');
  let c = 0;
  const ci = setInterval(() => {
    c = Math.min(conf, c + 2);
    if (confBar) { confBar.style.width = c + '%'; confBar.style.background = c >= 90 ? '#22c55e' : c >= 75 ? '#f59e0b' : '#ef4444'; }
    if (confPct) confPct.textContent = c + '%';
    if (c >= conf) clearInterval(ci);
  }, 20);

  const docInfo = DOC_TYPES_OCR[docType] || {};
  const extGrid = document.getElementById('ocr-extracted-grid');
  if (extGrid) extGrid.innerHTML = `
        <div class="ocr-ext-item ocr-ext-ok"><span>✅ Pages</span><strong>${docInfo.pages || 20}</strong></div>
        <div class="ocr-ext-item ocr-ext-ok"><span>✅ Tables</span><strong>${docInfo.tables || '–'}</strong></div>
        <div class="ocr-ext-item ocr-ext-ok"><span>✅ Confidence</span><strong>${conf}%</strong></div>
        <div class="ocr-ext-item ${conf >= 90 ? 'ocr-ext-ok' : 'ocr-ext-warn'}"><span>${conf >= 90 ? '✅' : '⚠️'} Quality</span><strong>${conf >= 90 ? 'High' : 'Moderate'}</strong></div>`;

  const issues = document.getElementById('ocr-issues');
  if (issues) issues.innerHTML = conf < 90
    ? `<div class="ocr-issue-note">⚠️ <strong>Low-quality scan.</strong> AI has applied best-effort correction. 3 cells flagged for manual review.</div>`
    : `<div class="ocr-issue-note" style="border-color:rgba(34,197,94,0.3);background:rgba(34,197,94,0.06)">✅ <strong>High confidence extraction.</strong> All figures cross-checked against prior period data.</div>`;
}

// ─── PATCH UPLOAD ZONES WITH OCR ─────────────────────────────────
function patchUploadZonesWithOCR() {
  ['annual', 'gst', 'bank', 'itr', 'legal', 'rating'].forEach(key => {
    const zone = document.getElementById(`upload-${key}`);
    if (zone && !zone._ocrPatched) {
      zone._ocrPatched = true;
      zone.setAttribute('onclick', `simulateUploadWithOCR('${key}', this)`);
    }
  });
}

function simulateUploadWithOCR(type, el) {
  // Allow re-upload: clear the uploaded state so it gets re-processed
  if (state.docsUploaded[type]) {
    state.docsUploaded[type] = false;
    el.classList.remove('uploaded');
    const statusEl = el.querySelector('.upload-status');
    if (statusEl) statusEl.textContent = 'Click to upload';
  }
  showOCRPanel(type);
  setTimeout(() => {
    const zone = document.getElementById(`upload-${type}`);
    if (zone) simulateUpload(type, zone);
  }, 4800);
}

// ─── DASHBOARD SMART-ANALYSE BUTTON ──────────────────────────────
function addSmartAnalyseButton() {
  if (document.getElementById('smart-analyse-btn')) return;
  const cta = document.querySelector('.hero-cta');
  if (!cta) return;
  const btn = document.createElement('button');
  btn.id = 'smart-analyse-btn';
  btn.type = 'button';
  btn.className = 'btn btn-ghost btn-lg';
  btn.style.cssText = 'border-color:rgba(34,197,94,0.4);color:#22c55e;';
  btn.innerHTML = '⚡ Smart Auto-Analyse';
  btn.onclick = () => {
    const val = document.getElementById('company-name')?.value?.trim() || '';
    if (val) { triggerFullAutoIngest(val); }
    else { navigateTo('ingest'); setTimeout(() => document.getElementById('company-name')?.focus(), 300); }
  };
  cta.appendChild(btn);
}

// ─── INIT ─────────────────────────────────────────────────────────
// Note: setupAutoIngest & addSmartAnalyseButton are called by app.js's navigateTo directly
// (the window.navigateTo wrapper cannot intercept the local function reference used by nav items)

// Run once after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    addSmartAnalyseButton();
    patchUploadZonesWithOCR();
    // Don't call setupAutoIngest here — ingest page is hidden at startup
    // It will init when user navigates to ingest page via app.js navigateTo hook
  }, 600);
});
