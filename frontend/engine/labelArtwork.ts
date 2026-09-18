/**
 * Yatarth AI — Outer Label Packaging Panel Renders (SVG Data URIs)
 * 
 * Renders outer packaging label panels with printed LMPC Rule 6 declarations,
 * Principal Display Panels (PDP), barcodes, and Rule 7 numeral height boxes.
 * 
 * Scope: Outer label packaging inspection ONLY (no inner food/product testing).
 */

export function generateOuterLabelSVG(
  productName: string,
  netQty: string,
  mrpText: string,
  mfgDate: string,
  mfgAddress: string,
  fssai: string,
  careText: string,
  status: 'COMPLIANT' | 'VIOLATING' | 'WARNING' = 'COMPLIANT',
  panelTitle: string = 'OUTER PACKAGING LABEL'
): string {
  const isViolating = status === 'VIOLATING';
  const isWarning = status === 'WARNING';

  const headerBg = isViolating ? '#991b1b' : isWarning ? '#b45309' : '#1e3a8a';
  const headerSubText = isViolating 
    ? 'LMPC RULES 2011 — NON-COMPLIANCE DETECTED IN LABEL SCAN' 
    : isWarning 
    ? 'LMPC RULES 2011 — BORDERLINE WARNING IN LABEL SCAN' 
    : 'LMPC RULES 2011 — MANDATORY DECLARATION AUDIT PASS';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%" style="background:#0f172a; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <defs>
      <linearGradient id="pouchBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1e293b"/>
        <stop offset="100%" stop-color="#0f172a"/>
      </linearGradient>
      <linearGradient id="labelFilm" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="100%" stop-color="#f8fafc"/>
      </linearGradient>
    </defs>

    <!-- Outer Packaging Pouch Boundary -->
    <rect x="40" y="25" width="720" height="550" rx="20" fill="url(#pouchBg)" stroke="#334155" stroke-width="4"/>

    <!-- Pouch Top & Bottom Heat Seals -->
    <rect x="40" y="25" width="720" height="38" fill="#334155" opacity="0.7"/>
    <line x1="40" y1="44" x2="760" y2="44" stroke="#475569" stroke-width="2" stroke-dasharray="6,4"/>
    
    <rect x="40" y="537" width="720" height="38" fill="#334155" opacity="0.7"/>
    <line x1="40" y1="556" x2="760" y2="556" stroke="#475569" stroke-width="2" stroke-dasharray="6,4"/>

    <!-- Printed Outer Packaging Film Panel -->
    <rect x="70" y="75" width="660" height="450" rx="14" fill="url(#labelFilm)" stroke="#cbd5e1" stroke-width="3"/>

    <!-- Outer Panel Header Banner -->
    <rect x="70" y="75" width="660" height="72" fill="${headerBg}"/>
    <text x="95" y="108" font-size="18" font-weight="900" fill="#ffffff" letter-spacing="1">${panelTitle.toUpperCase()}</text>
    <text x="95" y="130" font-size="11" font-weight="700" fill="#93c5fd">${headerSubText}</text>
    <rect x="585" y="92" width="130" height="32" rx="6" fill="#ffffff" opacity="0.2"/>
    <text x="650" y="113" font-size="11" font-weight="900" fill="#ffffff" text-anchor="middle">OUTER WRAP</text>

    <!-- Product Generic Descriptor (Rule 6(1)(b)) -->
    <text x="95" y="176" font-size="17" font-weight="900" fill="#0f172a">${productName.toUpperCase()}</text>
    <line x1="95" y1="188" x2="705" y2="188" stroke="#e2e8f0" stroke-width="2"/>

    <!-- Printed Statutory Declarations Grid (Rule 6 & Rule 7) -->
    <!-- Net Quantity Box (Rule 6(1)(c) & Rule 7) -->
    <rect x="95" y="205" width="290" height="82" rx="10" fill="#f1f5f9" stroke="${isViolating ? '#ef4444' : '#cbd5e1'}" stroke-width="2"/>
    <text x="110" y="227" font-size="10" font-weight="800" fill="#64748b">NET QUANTITY [Rule 6(1)(c)]</text>
    <text x="110" y="260" font-size="22" font-weight="900" fill="${isViolating ? '#dc2626' : '#09090b'}">${netQty}</text>
    <text x="110" y="277" font-size="9" font-weight="700" fill="#64748b">Metric Symbol &amp; Numeral Height Standard</text>

    <!-- Maximum Retail Price Box (Rule 6(1)(e)) -->
    <rect x="405" y="205" width="300" height="82" rx="10" fill="#f1f5f9" stroke="${isViolating ? '#ef4444' : '#cbd5e1'}" stroke-width="2"/>
    <text x="420" y="227" font-size="10" font-weight="800" fill="#64748b">MAX RETAIL PRICE [Rule 6(1)(e)]</text>
    <text x="420" y="260" font-size="17" font-weight="900" fill="${isViolating ? '#dc2626' : '#09090b'}">${mrpText}</text>
    <text x="420" y="277" font-size="9" font-weight="700" fill="#64748b">Mandatory "Incl. of all taxes" Declaration</text>

    <!-- Month & Year of Mfg/Pack (Rule 6(1)(f)) -->
    <rect x="95" y="300" width="290" height="65" rx="10" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="2"/>
    <text x="110" y="320" font-size="10" font-weight="800" fill="#64748b">DATE OF PACKING [Rule 6(1)(f)]</text>
    <text x="110" y="346" font-size="15" font-weight="900" fill="#0f172a">${mfgDate}</text>

    <!-- FSSAI Licence Number -->
    <rect x="405" y="300" width="300" height="65" rx="10" fill="#f1f5f9" stroke="${isViolating ? '#ef4444' : '#cbd5e1'}" stroke-width="2"/>
    <text x="420" y="320" font-size="10" font-weight="800" fill="#64748b">FSSAI LICENCE NO. (Co-Required)</text>
    <text x="420" y="346" font-size="14" font-weight="900" fill="${isViolating ? '#dc2626' : '#0f172a'}">${fssai}</text>

    <!-- Manufacturer / Packer Name & Address (Rule 6(1)(a)) -->
    <rect x="95" y="378" width="610" height="58" rx="10" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
    <text x="110" y="396" font-size="9" font-weight="800" fill="#64748b">MANUFACTURER / PACKER NAME &amp; ADDRESS [Rule 6(1)(a)]</text>
    <text x="110" y="420" font-size="11" font-weight="700" fill="#1e293b">${mfgAddress}</text>

    <!-- Consumer Care Details (Rule 6(1)(g)) -->
    <rect x="95" y="446" width="610" height="58" rx="10" fill="#e2e8f0" stroke="${isViolating ? '#ef4444' : '#cbd5e1'}" stroke-width="2"/>
    <text x="110" y="464" font-size="9" font-weight="800" fill="#475569">CONSUMER CARE DETAILS [Rule 6(1)(g)]</text>
    <text x="110" y="488" font-size="10" font-weight="700" fill="${isViolating ? '#991b1b' : '#0f172a'}">${careText}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function generatePanelSVG(
  productName: string,
  panelType: 'front' | 'back' | 'left' | 'right' | 'top' | 'bottom',
  status: 'COMPLIANT' | 'VIOLATING' | 'WARNING' = 'COMPLIANT'
): string {
  const panelTitles: Record<string, string> = {
    front: 'Principal Display Panel (PDP) — Front Label Scan',
    back: 'Statutory Declarations Panel — Back Label Scan',
    left: 'Side Panel — Generic Name & Origin Declarations',
    right: 'Side Panel — Rule 7 Font Height & Calibration Grid',
    top: 'Top Heat Seal — Batch Number & Date Code Print',
    bottom: 'Bottom Base Flap — Recycling & Packaging Film Details'
  };

  if (panelType === 'front') {
    return generateOuterLabelSVG(
      productName,
      "50 g",
      "MRP ₹ 20.00 (Incl. of all taxes)",
      "04/2026",
      "PepsiCo India Holdings Pvt. Ltd., Sangrur, Punjab",
      "FSSAI Lic No. 10012063000110",
      "Consumer Care: 1800-22-9900 | consumer.care@pepsico.com",
      status,
      panelTitles.front
    );
  } else if (panelType === 'back') {
    return generateOuterLabelSVG(
      productName,
      "50 g",
      "MRP ₹ 20.00 (Incl. of all taxes)",
      "04/2026",
      "PepsiCo India Holdings Pvt. Ltd., Village Channo, Patiala Road, Sangrur - 148028, Punjab, India",
      "FSSAI Lic No. 10012063000110",
      "Manager Consumer Care, PepsiCo India, PO Box 27, Gurgaon 122002. Tel: 1800-22-9900, Email: consumer.care@pepsico.com",
      status,
      panelTitles.back
    );
  }

  // Generic panel rendering for left, right, top, bottom
  const title = panelTitles[panelType];
  const isViolating = status === 'VIOLATING';
  const isWarning = status === 'WARNING';
  const headerBg = isViolating ? '#991b1b' : isWarning ? '#b45309' : '#1e3a8a';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%" style="background:#0f172a; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <rect x="40" y="25" width="720" height="550" rx="20" fill="#1e293b" stroke="#334155" stroke-width="4"/>
    <rect x="70" y="75" width="660" height="450" rx="14" fill="#ffffff" stroke="#cbd5e1" stroke-width="3"/>
    <rect x="70" y="75" width="660" height="72" fill="${headerBg}"/>
    <text x="95" y="110" font-size="16" font-weight="900" fill="#ffffff">${title.toUpperCase()}</text>
    <text x="95" y="132" font-size="11" font-weight="700" fill="#93c5fd">LMPC RULES 2011 OUTER PACKAGING PANEL AUDIT</text>
    
    <text x="95" y="180" font-size="18" font-weight="900" fill="#0f172a">${productName.toUpperCase()}</text>
    <line x1="95" y1="192" x2="705" y2="192" stroke="#e2e8f0" stroke-width="2"/>

    <rect x="95" y="210" width="610" height="290" rx="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
    <text x="120" y="250" font-size="14" font-weight="800" fill="#334155">OUTER LABEL PRINTED PANEL AREA: ${panelType.toUpperCase()}</text>
    
    <text x="120" y="295" font-size="12" font-weight="700" fill="#475569">• Mandatory Statutory Declarations Scanned: Rule 6(1)(a)-(k)</text>
    <text x="120" y="325" font-size="12" font-weight="700" fill="#475569">• Rule 7 Font Numeral Height Check: PASS (Verified on Outer Wrap)</text>
    <text x="120" y="355" font-size="12" font-weight="700" fill="#475569">• Country of Origin: India [Rule 6(1)(d)]</text>
    <text x="120" y="385" font-size="12" font-weight="700" fill="#475569">• Outer Packaging Heat Seal Lot Code: BATCH-LAYS-2026-N7</text>
    <text x="120" y="415" font-size="12" font-weight="700" fill="#475569">• Scope: Outer packaging label scan only (Inner contents excluded)</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
