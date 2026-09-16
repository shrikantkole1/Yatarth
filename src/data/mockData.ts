import { Product, ComplianceRule, Inspection, ReportItem, TeamMember, AuditLog } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-01',
    sku: 'YAT-CK-001',
    name: 'Premium Almond Cookies',
    category: 'Packaged Food & Snacks',
    brand: 'Artisan Harvest Foods',
    packSize: '250 g',
    batchNumber: 'AHF-2026-B88',
    complianceScore: 94,
    status: 'compliant',
    lastScanDate: '2026-09-07 14:32',
    issuesCount: 1,
    criticalIssues: 0,
    owner: 'Vikram Sengupta (LMO)',
    sides: [
      {
        id: 'side-01-front',
        sideName: 'Front Panel',
        imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="750" viewBox="0 0 600 750"><rect width="600" height="750" fill="%23f8fafc" rx="24"/><rect x="20" y="20" width="560" height="710" fill="%23ffffff" stroke="%23cbd5e1" stroke-width="2" rx="16"/><circle cx="300" cy="180" r="90" fill="%230284c7" opacity="0.08"/><path d="M260 180 C260 140 340 140 340 180 C340 220 260 220 260 180" stroke="%230284c7" stroke-width="6" fill="none"/><text x="300" y="320" font-family="sans-serif" font-size="28" font-weight="bold" fill="%230f172a" text-anchor="middle">ARTISAN HARVEST</text><text x="300" y="355" font-family="sans-serif" font-size="20" font-weight="600" fill="%230369a1" text-anchor="middle">PREMIUM ALMOND COOKIES</text><text x="300" y="385" font-family="sans-serif" font-size="14" fill="%2364748b" text-anchor="middle">Slow Baked with California Almonds and Pure Butter</text><rect x="60" y="450" width="480" height="120" fill="%23f1f5f9" rx="12" stroke="%2394a3b8"/><text x="80" y="485" font-family="sans-serif" font-size="13" font-weight="bold" fill="%23334155">MANDATORY DECLARATIONS (FRONT)</text><text x="80" y="520" font-family="sans-serif" font-size="16" font-weight="bold" fill="%230f172a">NET QUANTITY: 250 g</text><text x="80" y="550" font-family="sans-serif" font-size="13" fill="%2364748b">100% Vegetarian | High Fiber | Zero Trans Fat</text><rect x="490" y="470" width="36" height="36" fill="none" stroke="%2316a34a" stroke-width="2"/><circle cx="508" cy="488" r="8" fill="%2316a34a"/><rect x="60" y="600" width="480" height="80" fill="%23f8fafc" stroke="%23e2e8f0" rx="8"/><text x="80" y="635" font-family="monospace" font-size="14" fill="%230284c7">BATCH: AHF-2026-B88 | MFG: 08/2026</text><text x="80" y="660" font-family="monospace" font-size="14" font-weight="bold" fill="%230f172a">MRP ₹ 185.00 (INCL. OF ALL TAXES)</text></svg>',
        boundingBoxes: [
          {
            id: 'box-01',
            field: 'Product Identity',
            category: 'origin',
            x: 10,
            y: 38,
            width: 80,
            height: 12,
            detectedText: 'ARTISAN HARVEST PREMIUM ALMOND COOKIES',
            confidence: 99.4,
            status: 'detected'
          },
          {
            id: 'box-02',
            field: 'Net Quantity',
            category: 'net_quantity',
            x: 10,
            y: 60,
            width: 45,
            height: 10,
            detectedText: 'NET QUANTITY: 250 g',
            confidence: 98.7,
            status: 'detected'
          },
          {
            id: 'box-03',
            field: 'MRP & Taxes',
            category: 'mrp',
            x: 10,
            y: 80,
            width: 80,
            height: 11,
            detectedText: 'MRP ₹ 185.00 (INCL. OF ALL TAXES)',
            confidence: 99.1,
            status: 'detected'
          }
        ]
      },
      {
        id: 'side-01-back',
        sideName: 'Back Panel',
        imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="750" viewBox="0 0 600 750"><rect width="600" height="750" fill="%23f8fafc" rx="24"/><rect x="25" y="25" width="550" height="700" fill="%23ffffff" stroke="%23cbd5e1" stroke-width="2" rx="16"/><text x="50" y="65" font-family="sans-serif" font-size="16" font-weight="bold" fill="%230f172a">MANUFACTURED & PACKED BY:</text><text x="50" y="95" font-family="sans-serif" font-size="13" fill="%23334155">Artisan Harvest Foods Pvt. Ltd., Plot No. 42-B, Industrial Area Phase II,</text><text x="50" y="115" font-family="sans-serif" font-size="13" fill="%23334155">Bengaluru, Karnataka - 560058, India.</text><text x="50" y="160" font-family="sans-serif" font-size="16" font-weight="bold" fill="%230f172a">CONSUMER CARE EXECUTIVE:</text><text x="50" y="190" font-family="sans-serif" font-size="13" fill="%23334155">Address: Same as manufacturer above | Toll Free: 1800-425-9090</text><text x="50" y="210" font-family="sans-serif" font-size="13" fill="%23334155">Email: feedback@artisanharvestfoods.com | Web: www.artisanharvest.com</text><text x="50" y="260" font-family="sans-serif" font-size="16" font-weight="bold" fill="%230f172a">COUNTRY OF ORIGIN:</text><text x="50" y="290" font-family="sans-serif" font-size="14" font-weight="600" fill="%230284c7">Country of Origin: India</text><rect x="50" y="320" width="500" height="150" fill="%23f1f5f9" rx="8" stroke="%23cbd5e1"/><text x="70" y="350" font-family="sans-serif" font-size="14" font-weight="bold" fill="%230369a1">NUTRITIONAL INFORMATION (Approx. per 100g)</text><text x="70" y="380" font-family="sans-serif" font-size="13" fill="%23334155">Energy: 512 kcal | Protein: 8.4 g | Carbohydrate: 62.1 g</text><text x="70" y="405" font-family="sans-serif" font-size="13" fill="%23334155">Total Sugars: 21.0 g | Added Sugars: 18.5 g | Dietary Fiber: 4.2 g</text><text x="70" y="430" font-family="sans-serif" font-size="13" fill="%23334155">Total Fat: 25.8 g | Saturated Fat: 11.2 g | Trans Fat: 0 g | Sodium: 145 mg</text><text x="50" y="510" font-family="sans-serif" font-size="16" font-weight="bold" fill="%230f172a">DATE OF PACKING & EXPIRY:</text><text x="50" y="540" font-family="monospace" font-size="14" fill="%23d97706">Mfg Date: 12/08/2026 | Best Before: 6 Months</text><text x="50" y="565" font-family="sans-serif" font-size="12" fill="%23dc2626">! Advisory: Missing explicit Month/Year expiry indicator</text><rect x="50" y="600" width="220" height="85" fill="%23ffffff" stroke="%2394a3b8" rx="6"/><path d="M60 610 h6 v65 h-6 z M72 610 h3 v65 h-3 z M80 610 h9 v65 h-9 z M95 610 h3 v65 h-3 z M104 610 h12 v65 h-12 z M122 610 h6 v65 h-6 z M135 610 h4 v65 h-4 z M145 610 h10 v65 h-10 z M162 610 h5 v65 h-5 z M173 610 h12 v65 h-12 z M192 610 h6 v65 h-6 z M204 610 h8 v65 h-8 z M218 610 h4 v65 h-4 z M230 610 h10 v65 h-10 z M248 610 h4 v65 h-4 z" fill="%23000000"/><text x="160" y="692" font-family="monospace" font-size="11" fill="%23000000" text-anchor="middle">8 901234 567891</text></svg>',
        boundingBoxes: [
          {
            id: 'box-04',
            field: 'Manufacturer Address',
            category: 'manufacturer',
            x: 8,
            y: 8,
            width: 84,
            height: 14,
            detectedText: 'Artisan Harvest Foods Pvt. Ltd., Plot No. 42-B, Industrial Area Phase II, Bengaluru, Karnataka - 560058',
            confidence: 99.2,
            status: 'detected'
          },
          {
            id: 'box-05',
            field: 'Consumer Care Cell',
            category: 'consumer_care',
            x: 8,
            y: 23,
            width: 84,
            height: 12,
            detectedText: 'Toll Free: 1800-425-9090, Email: feedback@artisanharvestfoods.com',
            confidence: 97.9,
            status: 'detected'
          },
          {
            id: 'box-06',
            field: 'Country of Origin',
            category: 'origin',
            x: 8,
            y: 35,
            width: 45,
            height: 8,
            detectedText: 'Country of Origin: India',
            confidence: 99.8,
            status: 'detected'
          },
          {
            id: 'box-07',
            field: 'Best Before / Expiry Format',
            category: 'dates',
            x: 8,
            y: 68,
            width: 80,
            height: 10,
            detectedText: 'Mfg Date: 12/08/2026 | Best Before: 6 Months',
            confidence: 91.5,
            status: 'needs_review',
            violationId: 'viol-01'
          }
        ]
      }
    ],
    declarations: [
      { id: 'dec-1', key: 'net_qty', label: 'Net Quantity', detectedValue: '250 g', standardRequired: 'Mandatory standard metric units with minimum height ratio', status: 'detected', category: 'Metrology', confidence: 98.7 },
      { id: 'dec-2', key: 'mrp', label: 'Maximum Retail Price', detectedValue: '₹ 185.00 (Incl. of all taxes)', standardRequired: 'Explicit "Inclusive of all taxes" formulation', status: 'detected', category: 'Pricing', confidence: 99.1 },
      { id: 'dec-3', key: 'mfg_name', label: 'Manufacturer & Packer', detectedValue: 'Artisan Harvest Foods Pvt. Ltd.', standardRequired: 'Full corporate name & registered premises', status: 'detected', category: 'Corporate', confidence: 99.2 },
      { id: 'dec-4', key: 'consumer_care', label: 'Consumer Grievance Cell', detectedValue: '1800-425-9090 / feedback@artisanharvestfoods.com', standardRequired: 'Designated manager/cell, telephone and email address', status: 'detected', category: 'Consumer Protection', confidence: 97.9 },
      { id: 'dec-5', key: 'dates', label: 'Date of Packing & Expiry', detectedValue: 'Mfg: 12/08/2026, Best Before: 6 Months', standardRequired: 'Explicit Month/Year or MM/YYYY expiry representation', status: 'needs_review', category: 'Shelf Life', confidence: 91.5, notes: 'Lacks explicit absolute expiry date string alongside relative duration.' },
      { id: 'dec-6', key: 'origin', label: 'Country of Origin', detectedValue: 'Country of Origin: India', standardRequired: 'Prominent country of manufacture/packaging', status: 'detected', category: 'Trade Origin', confidence: 99.8 }
    ],
    violations: [
      {
        id: 'viol-01',
        productId: 'prod-01',
        productName: 'Premium Almond Cookies',
        sku: 'YAT-CK-001',
        title: 'Relative shelf-life statement without absolute expiry date',
        category: 'Dates & Shelf Life',
        severity: 'low',
        explanation: 'The package states "Best Before: 6 Months" relative to manufacturing date, but packaged commodities exceeding 90 days shelf-life are recommended to provide unambiguous MM/YYYY expiry declaration under legal metrology guidelines.',
        evidence: 'Detected text on back panel: "Mfg Date: 12/08/2026 | Best Before: 6 Months"',
        recommendedAction: 'Direct manufacturer to append unambiguous calendar date or "Best Before: FEB 2027" to eliminate consumer ambiguity.',
        reviewStatus: 'open',
        detectedAt: '2026-09-07 14:32',
        assignedTo: 'Vikram Sengupta',
        ruleCode: 'RULE-DAT-04'
      }
    ],
    history: [
      { date: '2026-09-07 14:32', score: 94, scannedBy: 'Yatarth AI Engine v4.2', notes: 'Automated market surveillance sample verified with 1 advisory.' }
    ],
    batchTrace: {
      batchId: 'AHF-2026-B88',
      barcodeQr: '8901234567891',
      barcodeFormat: 'EAN-13',
      mfgDate: '2026-08-12',
      expDate: '2027-02-12',
      isExpired: false,
      mfgLicenseNumber: 'KAR-LM-2021-08422',
      manufacturer: {
        entityName: 'Artisan Harvest Foods Pvt. Ltd.',
        brandOwner: 'Artisan Harvest Brand Co.',
        plantLocation: 'Plot No. 42-B, Industrial Area Phase II, Peenya, Bengaluru, Karnataka - 560058',
        plantManager: 'Anand Kulkarni (QA Head)',
        contactPhone: '+91 80 2839 4410',
        contactEmail: 'plant.peenya@artisanharvest.com',
        fssaiLicense: '11221334000542',
        productionLine: 'High-Speed Automated Bakery Line 03'
      },
      distributor: {
        name: 'South Deccan Cold Chain & FMCG Logistics',
        hubLocation: 'Yeshwanthpur Distribution Terminal Hub A, Bengaluru',
        dispatchInvoiceNo: 'INV-BLR-2026-8841',
        dispatchDate: '2026-08-20',
        vehicleRegistration: 'KA-04-E-4491',
        contactPerson: 'Ramesh Gowda (Dispatch Mgr)'
      },
      wholesaler: {
        name: 'Metro Cash & Carry Wholesale Hub',
        depotLocation: 'Katraj-Dehu Bypass Road, Wakad, Pune - 411057',
        intakeDate: '2026-08-24',
        inventoryLotId: 'LOT-MT-9012',
        contactPhone: '+91 20 6791 8800'
      },
      retailer: {
        storeName: "Nature's Basket Gourmet",
        storeAddress: 'North Main Road, Koregaon Park, Pune - 411001',
        inspectorCoords: '18.5362° N, 73.8940° E',
        shelfLocation: 'Aisle 4 - Premium Biscuits Shelf B2',
        stockReceivedDate: '2026-08-28',
        unitsOnShelf: 24
      },
      rawSuppliers: [
        { material: 'California Whole Almonds', supplierName: 'NutriPure Agro Impex', originLocation: 'JNPT Port Logistics Hub, Navi Mumbai', lotNumber: 'ALM-2026-092', purityScore: 99.2, qualityCertificateNo: 'QC-ALM-991' },
        { material: 'Organic Butter & Milk Solids', supplierName: 'Katraj Dairy Cooperative (Pune Zilla Sahakari Dudh Utpadak Sangh)', originLocation: 'Katraj Dairy Plant, Pune', lotNumber: 'DAI-2026-B11', purityScore: 99.8, qualityCertificateNo: 'QC-KTR-440' },
        { material: 'Foil Packaging Laminates', supplierName: 'UFlex Packaging Solutions', originLocation: 'MIDC Sanaswadi, Pune', lotNumber: 'UF-LAM-782', purityScore: 100, qualityCertificateNo: 'QC-UFL-108' }
      ],
      reverseStores: [
        {
          storeName: "Nature's Basket Gourmet",
          storeAddress: 'North Main Road, Koregaon Park, Pune - 411001',
          areaDistrict: 'Koregaon Park / East-Central',
          receivedUnits: 48,
          remainingUnits: 24,
          deliveryDate: '2026-08-28',
          status: 'active_shelf',
          contactPerson: 'Priya Saxena',
          phone: '+91 20 4122 7700',
          lat: 18.5362,
          lng: 73.8940,
          locality: 'Koregaon Park',
          violationSummary: 'Advisory: Relative shelf life statement without unambiguous MM/YYYY calendar expiry.'
        },
        {
          storeName: "Dorabjee's Heritage Supermarket",
          storeAddress: 'Moledina Road, Camp, Pune - 411001',
          areaDistrict: 'Camp / Central Pune',
          receivedUnits: 36,
          remainingUnits: 18,
          deliveryDate: '2026-08-29',
          status: 'active_shelf',
          contactPerson: 'Jehangir Dorabjee',
          phone: '+91 20 2613 2288',
          lat: 18.5175,
          lng: 73.8785,
          locality: 'Camp Cantonment',
          violationSummary: 'Audited sample: Batch declaration verified.'
        },
        {
          storeName: 'Star Bazaar Hypermarket',
          storeAddress: 'Phoenix Marketcity, Nagar Road, Viman Nagar, Pune - 411014',
          areaDistrict: 'Viman Nagar / East Pune',
          receivedUnits: 60,
          remainingUnits: 30,
          deliveryDate: '2026-08-30',
          status: 'active_shelf',
          contactPerson: 'Karthik Raman',
          phone: '+91 20 6689 0011',
          lat: 18.5626,
          lng: 73.9168,
          locality: 'Viman Nagar',
          violationSummary: 'Compliant stock checked during surveillance sweep.'
        }
      ],
      regionalAreaImpact: {
        regionName: 'Pune Metropolitan Surveillance Zone (MH-12 Circle)',
        stateCode: 'MH-12',
        totalOutletsAffected: 6,
        estimatedUnitsInMarket: 140,
        riskLevel: 'MODERATE',
        containmentStatus: 'Compliant Distribution Monitored',
        zonalOfficerInCharge: 'Vikram Sengupta (Legal Metrology Officer, Pune Division)'
      },
      smartEscalation: {
        escalationId: 'ESC-PUN-2026-0081',
        severityLevel: 'ROUTINE_ADVISORY',
        recipientRole: 'Zonal Metrology Inspection Cell (Pune Circle)',
        recipientName: 'Vikram Sengupta',
        recipientEmail: 'vikram.sengupta@yatarth.ai',
        sentTimestamp: '2026-09-07 02:40 PM',
        status: 'ACKNOWLEDGED',
        actionDirective: 'Routine sampling pass registered in Pune Circle. Label declaration advised for absolute date.'
      },
      recallStatus: 'active_distribution'
    }
  },
  {
    id: 'prod-lays',
    sku: 'LAY-CLS-050',
    name: "Lay's Classic Salted Potato Chips",
    category: 'Packaged Food & Snacks',
    brand: 'PepsiCo India',
    packSize: '50 g',
    batchNumber: 'LAY-EXP-2025-09',
    complianceScore: 42,
    status: 'non_compliant',
    lastScanDate: '2026-09-08 10:15',
    issuesCount: 3,
    criticalIssues: 2,
    owner: 'Suresh Kumar (FEO)',
    sides: [
      {
        id: 'side-lays-front',
        sideName: 'Front Panel',
        imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="750" viewBox="0 0 600 750"><rect width="600" height="750" fill="%23fef08a" rx="24"/><rect x="20" y="20" width="560" height="710" fill="%23ffffff" stroke="%23eab308" stroke-width="3" rx="16"/><circle cx="300" cy="200" r="100" fill="%23eab308" opacity="0.15"/><circle cx="300" cy="200" r="75" fill="%23e11d48"/><path d="M250 200 L350 200" stroke="%23ffffff" stroke-width="8"/><text x="300" y="210" font-family="sans-serif" font-size="44" font-weight="900" fill="%23ffffff" text-anchor="middle">Lay\'s</text><text x="300" y="340" font-family="sans-serif" font-size="26" font-weight="bold" fill="%23854d0e" text-anchor="middle">CLASSIC SALTED</text><text x="300" y="375" font-family="sans-serif" font-size="16" fill="%23a16207" text-anchor="middle">Made with Best Quality Farm-Grown Potatoes</text><rect x="60" y="440" width="480" height="110" fill="%23fef2f2" rx="12" stroke="%23ef4444" stroke-width="2"/><text x="80" y="475" font-family="sans-serif" font-size="14" font-weight="bold" fill="%23b91c1c">! CRITICAL WARNING: PRODUCT EXPIRED ON SHELF</text><text x="80" y="505" font-family="monospace" font-size="14" font-weight="bold" fill="%237f1d1d">MFG: 10/06/2025 | USE BY: 10/12/2025 (EXPIRED)</text><text x="80" y="530" font-family="sans-serif" font-size="12" fill="%23991b1b">Batch: LAY-EXP-2025-09 • Net Weight: 50 g</text><rect x="60" y="580" width="480" height="100" fill="%23f8fafc" stroke="%23cbd5e1" rx="10"/><text x="80" y="615" font-family="sans-serif" font-size="14" font-weight="bold" fill="%230f172a">MRP ₹ 20.00 (INCL. OF ALL TAXES)</text><text x="80" y="645" font-family="sans-serif" font-size="12" fill="%2364748b">Consumer Care: 1800-22-4020 (Print Faint / Partially Smudged)</text></svg>',
        boundingBoxes: [
          {
            id: 'box-lays-01',
            field: 'Product Identity',
            category: 'origin',
            x: 10,
            y: 35,
            width: 80,
            height: 15,
            detectedText: "Lay's Classic Salted Potato Chips",
            confidence: 99.8,
            status: 'detected'
          },
          {
            id: 'box-lays-02',
            field: 'Expiry Date (EXPIRED)',
            category: 'dates',
            x: 10,
            y: 62,
            width: 80,
            height: 14,
            detectedText: 'USE BY: 10/12/2025 (EXPIRED ON RETAIL SHELF)',
            confidence: 99.4,
            status: 'needs_review',
            violationId: 'viol-lays-01'
          },
          {
            id: 'box-lays-03',
            field: 'Batch Number',
            category: 'dates',
            x: 10,
            y: 78,
            width: 50,
            height: 8,
            detectedText: 'BATCH: LAY-EXP-2025-09',
            confidence: 98.9,
            status: 'detected'
          }
        ]
      },
      {
        id: 'side-lays-back',
        sideName: 'Back Panel',
        imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="750" viewBox="0 0 600 750"><rect width="600" height="750" fill="%23fef08a" rx="24"/><rect x="25" y="25" width="550" height="700" fill="%23ffffff" stroke="%23eab308" stroke-width="2" rx="16"/><text x="50" y="65" font-family="sans-serif" font-size="16" font-weight="bold" fill="%230f172a">MANUFACTURED & PACKED BY:</text><text x="50" y="95" font-family="sans-serif" font-size="13" fill="%23334155">PepsiCo India Holdings Pvt. Ltd., Village Channo, Patiala-Sangrur Road,</text><text x="50" y="115" font-family="sans-serif" font-size="13" fill="%23334155">District Sangrur, Punjab - 148106, India. (Mfg Lic: PB-LM-2018-9941)</text><text x="50" y="160" font-family="sans-serif" font-size="16" font-weight="bold" fill="%230f172a">CONSUMER GRIEVANCE REDRESSAL:</text><text x="50" y="190" font-family="sans-serif" font-size="13" fill="%23334155">Consumer Care Officer: PO Box 27, DLF Qutab Enclave, Gurugram, Haryana</text><text x="50" y="210" font-family="sans-serif" font-size="13" fill="%23dc2626">Toll-Free: 1800-22-4020 [Faint Ink / Low Font Height 1.8mm]</text><rect x="50" y="250" width="500" height="170" fill="%23fef2f2" rx="10" stroke="%23f87171"/><text x="70" y="285" font-family="sans-serif" font-size="15" font-weight="bold" fill="%23991b1b">TRACEABILITY LOT DECLARATION</text><text x="70" y="315" font-family="monospace" font-size="13" fill="%230f172a">BATCH ID: LAY-EXP-2025-09 | PROD LINE: CHN-LINE-4</text><text x="70" y="340" font-family="monospace" font-size="13" fill="%230f172a">MFG DATE: 10/06/2025 | EXPIRY: 10/12/2025</text><text x="70" y="370" font-family="sans-serif" font-size="13" font-weight="bold" fill="%23dc2626">STATUS: PAST 9 MONTHS OVERDUE FOR RECALL</text><text x="70" y="400" font-family="sans-serif" font-size="12" fill="%234b5563">FSSAI Central Lic No. 10014064000435 • Legal Metrology Reg: PB-LM-2018</text></svg>',
        boundingBoxes: [
          {
            id: 'box-lays-04',
            field: 'Manufacturer Address',
            category: 'manufacturer',
            x: 8,
            y: 8,
            width: 84,
            height: 14,
            detectedText: 'PepsiCo India Holdings Pvt. Ltd., Village Channo, Sangrur, Punjab',
            confidence: 99.5,
            status: 'detected'
          }
        ]
      }
    ],
    declarations: [
      { id: 'dec-lays-1', key: 'net_qty', label: 'Net Quantity', detectedValue: '50 g', standardRequired: 'Standard metric weight', status: 'detected', category: 'Metrology', confidence: 99.1 },
      { id: 'dec-lays-2', key: 'mrp', label: 'Maximum Retail Price', detectedValue: '₹ 20.00 (INCL. OF ALL TAXES)', standardRequired: 'Inclusive of all taxes phrase', status: 'detected', category: 'Pricing', confidence: 99.3 },
      { id: 'dec-lays-3', key: 'mfg_name', label: 'Manufacturer & Packer', detectedValue: 'PepsiCo India Holdings Pvt. Ltd. (Plant: Channo, Punjab)', standardRequired: 'Full corporate name and registered plant', status: 'detected', category: 'Corporate', confidence: 99.6 },
      { id: 'dec-lays-4', key: 'consumer_care', label: 'Consumer Support Helpline', detectedValue: '1800-22-4020 (Print Faint / Font 1.8mm)', standardRequired: 'Legible >= 2.0 mm font with active contact', status: 'needs_review', category: 'Consumer Protection', confidence: 81.2, notes: 'Print clarity on toll-free telephone falls below threshold.' },
      { id: 'dec-lays-5', key: 'dates', label: 'Date of Packing & Expiry', detectedValue: 'MFG: 10/06/2025 | USE BY: 10/12/2025 (EXPIRED)', standardRequired: 'Valid unexpired date on shelf', status: 'missing', category: 'Shelf Life', confidence: 99.9, notes: 'Product expired 9 months ago and is still placed on retail shelf for public sale.' }
    ],
    violations: [
      {
        id: 'viol-lays-01',
        productId: 'prod-lays',
        productName: "Lay's Classic Salted Potato Chips",
        sku: 'LAY-CLS-050',
        title: 'Sale of Expired Pre-Packaged Food Product (Critical Consumer Safety Violation)',
        category: 'Dates & Shelf Life',
        severity: 'critical',
        explanation: 'Package expiry was December 10, 2025. Product was seized from active retail shelf on current date. Offering expired packaged commodities for consumer sale constitutes a critical safety and Legal Metrology Rule violation requiring immediate stop-sale and batch quarantine.',
        evidence: 'Detected text: "MFG: 10/06/2025 | USE BY: 10/12/2025" found displayed on retail shelf at Star Bazaar Hypermarket on September 08, 2026.',
        recommendedAction: 'Immediate Seizure of Batch LAY-EXP-2025-09 from retail store. Backtrack through wholesaler & distributor to recall entire lot from regional market.',
        reviewStatus: 'open',
        detectedAt: '2026-09-08 10:15',
        assignedTo: 'Suresh Kumar',
        ruleCode: 'RULE-EXP-01'
      },
      {
        id: 'viol-lays-02',
        productId: 'prod-lays',
        productName: "Lay's Classic Salted Potato Chips",
        sku: 'LAY-CLS-050',
        title: 'Consumer Helpline Telephone Font Height Below Legibility Standard',
        category: 'Typography & Legibility',
        severity: 'medium',
        explanation: 'Toll-free customer contact number printed at 1.8 mm font height, which falls below the mandatory 2.0 mm threshold required under Legal Metrology Packaging Rules.',
        evidence: 'Measured character height: 1.8 mm on back panel.',
        recommendedAction: 'Direct brand owner to enlarge helpline text to minimum 2.5 mm on upcoming packaging runs.',
        reviewStatus: 'open',
        detectedAt: '2026-09-08 10:15',
        assignedTo: 'Suresh Kumar',
        ruleCode: 'RULE-TYPO-03'
      }
    ],
    history: [
      { date: '2026-09-08 10:15', score: 42, scannedBy: 'Yatarth AI Mobile Inspector v4.2', notes: 'Expired batch identified during routine retail shelf audit. Stop-sale order initiated.' }
    ],
    batchTrace: {
      batchId: 'LAY-EXP-2025-09',
      barcodeQr: '8901491101824',
      barcodeFormat: 'EAN-13 / GS1 DataBar',
      mfgDate: '2025-06-10',
      expDate: '2025-12-10',
      isExpired: true,
      mfgLicenseNumber: 'PB-LM-2018-9941',
      manufacturer: {
        entityName: 'PepsiCo India Holdings Pvt. Ltd.',
        brandOwner: 'PepsiCo Global Inc. / Frito-Lay Division',
        plantLocation: 'Village Channo, Patiala-Sangrur Highway, Dist. Sangrur, Punjab - 148106',
        plantManager: 'Harpreet Singh Sandhu (Director of Manufacturing)',
        contactPhone: '+91 1672 278 100',
        contactEmail: 'channo.qa@pepsico.com',
        fssaiLicense: '10014064000435',
        productionLine: 'Automated Continuous Fryer Line 4 (Capacity: 3.2 MT/hr)'
      },
      distributor: {
        name: 'Maharashtra Western Corridor C&F Logistics Hub',
        hubLocation: 'Urse Multi-Modal Logistics Terminal, Talegaon Expressway, Pune - 410506',
        dispatchInvoiceNo: 'DIS-MH12-2025-8842',
        dispatchDate: '2025-06-18',
        vehicleRegistration: 'MH-12-RN-8819',
        contactPerson: 'Rohan Kulkarni (+91 98220 44910)'
      },
      wholesaler: {
        name: 'Pune Metro Wholesale FMCG & Logistics Depot Hub 4',
        depotLocation: 'MIDC Industrial Area, Chakan-Talegaon Corridor, Pune - 410501',
        intakeDate: '2025-06-25',
        inventoryLotId: 'LOT-PUN-2025-7712',
        contactPhone: '+91 2135 664 100'
      },
      retailer: {
        storeName: 'Star Bazaar Hypermarket',
        storeAddress: 'Phoenix Marketcity, Nagar Road, Viman Nagar, Pune - 411014',
        inspectorCoords: '18.5626° N, 73.9168° E',
        shelfLocation: 'Aisle 2 - Snacks & Chips Rack C-04',
        stockReceivedDate: '2025-07-02',
        unitsOnShelf: 64
      },
      rawSuppliers: [
        {
          material: 'Process Grade Chip Potatoes (Kufri Chipsona-1)',
          supplierName: 'Kullu & Doaba Agro Farmers Producer Org (Contract Farming)',
          originLocation: 'Jalandhar & Hoshiarpur Agricultural Belt, Punjab',
          lotNumber: 'POT-AGR-2025-06',
          purityScore: 98.6,
          qualityCertificateNo: 'AGR-FSS-2025-992'
        },
        {
          material: 'Refined Palmolein Oil & TBHQ Antioxidant',
          supplierName: 'Adani Wilmar Edible Oil Refinery',
          originLocation: 'Mundra Port Processing Complex, Gujarat',
          lotNumber: 'OIL-PLM-2025-1102',
          purityScore: 99.4,
          qualityCertificateNo: 'QC-AW-2025-412'
        },
        {
          material: 'Iodised Salt (Vacuum Evaporated)',
          supplierName: 'Tata Chemicals Ltd. (Salt Division)',
          originLocation: 'Mithapur Marine Chemical Complex, Gujarat',
          lotNumber: 'SLT-2025-881',
          purityScore: 99.9,
          qualityCertificateNo: 'QC-TATA-SLT-091'
        },
        {
          material: 'Multi-layer Metallized CPP Nitrogen Barrier Foil',
          supplierName: 'UFlex Packaging Ltd. Flexible Laminates Unit II',
          originLocation: 'Sector 58, Noida Industrial Area, Uttar Pradesh',
          lotNumber: 'LAM-UFLX-2025-401',
          purityScore: 100.0,
          qualityCertificateNo: 'QC-UFLX-PKG-2025-18'
        }
      ],
      reverseStores: [
        {
          storeName: 'Star Bazaar Hypermarket',
          storeAddress: 'Phoenix Marketcity, Nagar Road, Viman Nagar, Pune - 411014',
          areaDistrict: 'Viman Nagar / East Pune',
          receivedUnits: 140,
          remainingUnits: 64,
          deliveryDate: '2025-07-02',
          status: 'quarantined',
          contactPerson: 'Karthik Raman (Store Mgr)',
          phone: '+91 20 6689 0011',
          lat: 18.5626,
          lng: 73.9168,
          locality: 'Viman Nagar',
          violationSummary: 'Primary Discovery Site: 64 expired units displayed on shelf. Expired on 10/12/2025.',
          seizureNoticeNo: 'DIR-SEIZE-MH12-881'
        },
        {
          storeName: 'D-Mart Supermarket',
          storeAddress: 'Baner-Pashan Link Road, Baner, Pune - 411045',
          areaDistrict: 'Baner / West Pune',
          receivedUnits: 180,
          remainingUnits: 52,
          deliveryDate: '2025-07-04',
          status: 'active_shelf',
          contactPerson: 'Manjunath Reddy',
          phone: '+91 20 2729 4400',
          lat: 18.5590,
          lng: 73.7868,
          locality: 'Baner',
          violationSummary: 'Active shelf sale of expired Batch LAY-EXP-2025-09. Mandatory stop-sale notice pending.',
          seizureNoticeNo: 'DIR-SEIZE-MH12-882'
        },
        {
          storeName: "Dorabjee's Heritage Supermarket",
          storeAddress: 'Moledina Road, Camp, Pune - 411001',
          areaDistrict: 'Camp / Central Pune',
          receivedUnits: 90,
          remainingUnits: 38,
          deliveryDate: '2025-07-03',
          status: 'active_shelf',
          contactPerson: 'Jehangir Dorabjee',
          phone: '+91 20 2613 2288',
          lat: 18.5175,
          lng: 73.8785,
          locality: 'Camp Cantonment',
          violationSummary: '38 expired units found displayed on central aisle gondola. Immediate seizure required.',
          seizureNoticeNo: 'DIR-SEIZE-MH12-883'
        },
        {
          storeName: 'More Megastore',
          storeAddress: 'Old Mumbai-Pune Highway, Chinchwad, PCMC, Pune - 411019',
          areaDistrict: 'PCMC / North Pune',
          receivedUnits: 120,
          remainingUnits: 34,
          deliveryDate: '2025-07-05',
          status: 'active_shelf',
          contactPerson: 'Nilesh Shinde',
          phone: '+91 20 2747 8820',
          lat: 18.6279,
          lng: 73.8009,
          locality: 'Chinchwad',
          violationSummary: 'Expired lot offered with dual price sticker. Violation of LM Rule 18 & Section 36.',
          seizureNoticeNo: 'DIR-SEIZE-MH12-884'
        },
        {
          storeName: 'Reliance Smart Bazaar',
          storeAddress: 'Karve Road, Near Paud Phata, Kothrud, Pune - 411038',
          areaDistrict: 'Kothrud / South-West Pune',
          receivedUnits: 80,
          remainingUnits: 28,
          deliveryDate: '2025-07-06',
          status: 'active_shelf',
          contactPerson: 'Sachin Kadam',
          phone: '+91 20 2544 9100',
          lat: 18.5074,
          lng: 73.8077,
          locality: 'Kothrud',
          violationSummary: '28 units on shelf past 9-month expiry; customer helpline print smudged.',
          seizureNoticeNo: 'DIR-SEIZE-MH12-885'
        },
        {
          storeName: "Nature's Basket Gourmet",
          storeAddress: 'North Main Road, Koregaon Park, Pune - 411001',
          areaDistrict: 'Koregaon Park / Central-East',
          receivedUnits: 60,
          remainingUnits: 19,
          deliveryDate: '2025-07-05',
          status: 'active_shelf',
          contactPerson: 'Priya Saxena',
          phone: '+91 20 4122 7700',
          lat: 18.5362,
          lng: 73.8940,
          locality: 'Koregaon Park',
          violationSummary: 'Expired units placed alongside imported snacks without valid declaration.',
          seizureNoticeNo: 'DIR-SEIZE-MH12-886'
        },
        {
          storeName: 'BigBasket Instant Retail Hub',
          storeAddress: 'Phase 1, Hinjawadi Infotech Park, Pune - 411057',
          areaDistrict: 'Hinjawadi / West Tech Zone',
          receivedUnits: 110,
          remainingUnits: 42,
          deliveryDate: '2025-07-07',
          status: 'active_shelf',
          contactPerson: 'Amit Deshmukh',
          phone: '+91 20 6790 3344',
          lat: 18.5913,
          lng: 73.7389,
          locality: 'Hinjawadi Phase 1',
          violationSummary: '42 units staged for rapid 10-minute dispatch from dark store shelf past expiry.',
          seizureNoticeNo: 'DIR-SEIZE-MH12-887'
        },
        {
          storeName: 'Spencers Hypermarket',
          storeAddress: 'Seasons Mall, Magarpatta City, Hadapsar, Pune - 411028',
          areaDistrict: 'Hadapsar / South-East Pune',
          receivedUnits: 150,
          remainingUnits: 45,
          deliveryDate: '2025-07-08',
          status: 'active_shelf',
          contactPerson: 'Santosh Patil',
          phone: '+91 20 6723 1100',
          lat: 18.5196,
          lng: 73.9315,
          locality: 'Magarpatta City',
          violationSummary: 'Unquarantined wholesale batch received from Chakan depot; 45 units on shelf.',
          seizureNoticeNo: 'DIR-SEIZE-MH12-888'
        }
      ],
      regionalAreaImpact: {
        regionName: 'Pune Metropolitan Surveillance Zone (MH-12 / PMRDA Circle)',
        stateCode: 'MH-12',
        totalOutletsAffected: 14,
        estimatedUnitsInMarket: 360,
        riskLevel: 'CRITICAL',
        containmentStatus: 'Zonal Stop-Sale Order Issued under Section 36/39 LM Act',
        zonalOfficerInCharge: 'Dr. Rajeshwar Kulkarni (Joint Controller of Legal Metrology, Pune Circle)'
      },
      smartEscalation: {
        escalationId: 'ESC-MH12-2026-9041',
        severityLevel: 'IMMEDIATE_STOP_SALE',
        recipientRole: 'Joint Controller of Legal Metrology (Pune Circle Head)',
        recipientName: 'Dr. Rajeshwar Kulkarni',
        recipientEmail: 'controller.pune@legalmetrology.mah.gov.in',
        sentTimestamp: '2026-09-08 10:18 AM',
        status: 'ENFORCEMENT_TEAM_DEPLOYED',
        actionDirective: 'Directive 58/2026: Order immediate physical seizure of Batch LAY-EXP-2025-09 across Star Bazaar Viman Nagar, D-Mart Baner, Dorabjee\'s Camp, and all 14 mapped Pune outlets. Freeze Chakan wholesale lot and summon PepsiCo Channo plant director within 48 hours.'
      },
      recallStatus: 'quarantine_ordered'
    }
  },
  {
    id: 'prod-02',
    sku: 'YAT-SP-002',
    name: 'Organic Turmeric Powder',
    category: 'Spices & Seasoning',
    brand: 'VedaPure Botanicals',
    packSize: '100 g',
    batchNumber: 'VP-TURM-2026',
    complianceScore: 58,
    status: 'non_compliant',
    lastScanDate: '2026-09-07 16:15',
    issuesCount: 3,
    criticalIssues: 2,
    owner: 'Dr. Anita Desai (SIO)',
    sides: [
      {
        id: 'side-02-front',
        sideName: 'Front Panel',
        imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="750" viewBox="0 0 600 750"><rect width="600" height="750" fill="%23fefce8" rx="24"/><rect x="25" y="25" width="550" height="700" fill="%23ffffff" stroke="%23eab308" stroke-width="2" rx="16"/><text x="300" y="140" font-family="sans-serif" font-size="32" font-weight="bold" fill="%23713f12" text-anchor="middle">VEDAPURE</text><text x="300" y="180" font-family="sans-serif" font-size="22" font-weight="bold" fill="%23ca8a04" text-anchor="middle">ORGANIC TURMERIC POWDER</text><text x="300" y="210" font-family="sans-serif" font-size="14" fill="%23854d0e" text-anchor="middle">100% High Curcumin Salem Golden Spice</text><rect x="60" y="440" width="480" height="180" fill="%23fef3c7" rx="12" stroke="%23f59e0b"/><text x="80" y="480" font-family="sans-serif" font-size="18" font-weight="bold" fill="%23713f12">NET WEIGHT: 100g</text><text x="80" y="520" font-family="sans-serif" font-size="22" font-weight="bold" fill="%23dc2626">MRP Rs 65/-</text><text x="80" y="545" font-family="sans-serif" font-size="12" font-weight="bold" fill="%23b91c1c">[OFFENCE: Missing "(INCL. OF ALL TAXES)"]</text><text x="80" y="585" font-family="sans-serif" font-size="14" fill="%23475569">Customer Support: 080-4999 (Incomplete phone number)</text><text x="80" y="605" font-family="sans-serif" font-size="12" font-weight="bold" fill="%23b91c1c">[OFFENCE: Helpline digits truncated & missing email]</text></svg>',
        boundingBoxes: [
          {
            id: 'box-turm-1',
            field: 'MRP Without Mandatory Clause',
            category: 'mrp',
            x: 10,
            y: 67,
            width: 80,
            height: 10,
            detectedText: 'MRP Rs 65/-',
            confidence: 99.5,
            status: 'needs_review',
            violationId: 'viol-02'
          },
          {
            id: 'box-turm-2',
            field: 'Truncated Consumer Helpline',
            category: 'consumer_care',
            x: 10,
            y: 77,
            width: 80,
            height: 8,
            detectedText: 'Customer Support: 080-4999',
            confidence: 94.2,
            status: 'needs_review',
            violationId: 'viol-03'
          }
        ]
      }
    ],
    declarations: [
      { id: 'dec-t1', key: 'net_qty', label: 'Net Quantity', detectedValue: '100g', standardRequired: 'Space required between numerical value and unit "100 g"', status: 'needs_review', category: 'Metrology', confidence: 96.0 },
      { id: 'dec-t2', key: 'mrp', label: 'Maximum Retail Price', detectedValue: 'MRP Rs 65/-', standardRequired: 'Must state "Inclusive of all taxes" or "Incl. of all taxes"', status: 'missing', category: 'Pricing', confidence: 99.5, notes: 'Missing statutory tax declaration clause.' },
      { id: 'dec-t3', key: 'consumer_care', label: 'Consumer Care Helpline', detectedValue: '080-4999', standardRequired: 'Valid 10-digit STD or 1800 toll-free number with operational email', status: 'missing', category: 'Consumer Protection', confidence: 94.2, notes: 'Incomplete telephone digits detected; missing email address.' },
      { id: 'dec-t4', key: 'origin', label: 'Country of Origin', detectedValue: 'India', standardRequired: 'Clear Country of Origin declaration', status: 'detected', category: 'Trade Origin', confidence: 98.1 }
    ],
    violations: [
      {
        id: 'viol-02',
        productId: 'prod-02',
        productName: 'Organic Turmeric Powder',
        sku: 'YAT-SP-002',
        title: 'Statutory "Inclusive of all taxes" clause absent from retail price',
        category: 'MRP & Pricing',
        severity: 'critical',
        explanation: 'The MRP is printed as "MRP Rs 65/-" without the mandatory text "(Inclusive of all taxes)" or "(Incl. of all taxes)". Packaged commodities legal rules require clear disclosure that the retail price already incorporates all applicable taxes.',
        evidence: 'Extracted price string: "MRP Rs 65/-" (Bounding Box: Front Panel x:10, y:67)',
        recommendedAction: 'Issue formal notice to manufacturer to rectify print cylinder to "MRP ₹ 65.00 (INCL. OF ALL TAXES)".',
        reviewStatus: 'open',
        detectedAt: '2026-09-07 16:15',
        assignedTo: 'Dr. Anita Desai',
        ruleCode: 'RULE-MRP-01'
      },
      {
        id: 'viol-03',
        productId: 'prod-02',
        productName: 'Organic Turmeric Powder',
        sku: 'YAT-SP-002',
        title: 'Consumer care contact telephone number truncated and missing email',
        category: 'Consumer Care',
        severity: 'critical',
        explanation: 'Legal Metrology rules mandate complete operational contact details. The detected phone number is incomplete ("080-4999", only 7 digits) and lacks an email address.',
        evidence: 'Detected text: "Customer Support: 080-4999"',
        recommendedAction: 'Mandate full operational 10/11 digit telephone or 1800 toll-free number and designated email address on revised batch.',
        reviewStatus: 'open',
        detectedAt: '2026-09-07 16:15',
        assignedTo: 'Dr. Anita Desai',
        ruleCode: 'RULE-CARE-02'
      }
    ],
    history: [
      { date: '2026-09-07 16:15', score: 58, scannedBy: 'Yatarth AI Engine v4.2', notes: 'Critical statutory non-compliance notice triggered. Retail sale seizure recommended.' }
    ],
    batchTrace: {
      batchId: 'VP-TURM-2026',
      barcodeQr: '8906012451992',
      barcodeFormat: 'EAN-13',
      mfgDate: '2026-04-10',
      expDate: '2027-04-10',
      isExpired: false,
      mfgLicenseNumber: 'MH-LM-2022-7718',
      manufacturer: {
        entityName: 'VedaPure Botanicals Processing Unit',
        brandOwner: 'VedaPure Consumer Goods Ltd.',
        plantLocation: 'Plot No. C-18, MIDC Sanaswadi, Shirur, Pune District - 412208',
        plantManager: 'Mahesh Deshpande (Quality Officer)',
        contactPhone: '+91 2137 662 100',
        contactEmail: 'qa.sanaswadi@vedapure.in',
        fssaiLicense: '11520038000491',
        productionLine: 'High-Purity Spice Grinding & Nitrogen Flushing Line 2'
      },
      distributor: {
        name: 'Western Maharashtra Agro-FMCG Hub',
        hubLocation: 'Talegaon Dabhade Logistics Park, Pune - 410507',
        dispatchInvoiceNo: 'INV-VEDA-PUN-2026-119',
        dispatchDate: '2026-05-12',
        vehicleRegistration: 'MH-14-GH-3312',
        contactPerson: 'Abhay Joshi'
      },
      wholesaler: {
        name: 'Marketyard Wholesale Spice & Commodity Terminal',
        depotLocation: 'Gultekdi Market Yard, Gate No. 4, Swargate, Pune - 411037',
        intakeDate: '2026-05-18',
        inventoryLotId: 'LOT-SPICE-PUN-881',
        contactPhone: '+91 20 2426 7711'
      },
      retailer: {
        storeName: 'BigBasket Instant Retail Hub',
        storeAddress: 'Phase 1, Hinjawadi Infotech Park, Pune - 411057',
        inspectorCoords: '18.5913° N, 73.7389° E',
        shelfLocation: 'Rack 3B - Spices & Condiments',
        stockReceivedDate: '2026-06-01',
        unitsOnShelf: 48
      },
      rawSuppliers: [
        { material: 'Salem Golden Turmeric Rhizomes', supplierName: 'Sangli Farmers Agro Producer Syndicate', originLocation: 'Sangli Agricultural Yard, Maharashtra', lotNumber: 'TUR-SNG-2026', purityScore: 99.1, qualityCertificateNo: 'QC-SNG-881' },
        { material: 'Multilayer Food-Grade Standup Pouches', supplierName: 'UFlex Packaging Ltd.', originLocation: 'MIDC Sanaswadi, Pune', lotNumber: 'UF-PCH-2026', purityScore: 100, qualityCertificateNo: 'QC-UFL-411' }
      ],
      reverseStores: [
        {
          storeName: 'BigBasket Instant Retail Hub',
          storeAddress: 'Phase 1, Hinjawadi Infotech Park, Pune - 411057',
          areaDistrict: 'Hinjawadi / West Tech Zone',
          receivedUnits: 90,
          remainingUnits: 48,
          deliveryDate: '2026-06-01',
          status: 'active_shelf',
          contactPerson: 'Amit Deshmukh',
          phone: '+91 20 6790 3344',
          lat: 18.5913,
          lng: 73.7389,
          locality: 'Hinjawadi Phase 1',
          violationSummary: 'Missing mandatory "(INCL. OF ALL TAXES)" clause on retail price declaration.'
        },
        {
          storeName: 'Grahak Peth Consumer Cooperative',
          storeAddress: 'Tilak Road, Sadashiv Peth, Swargate, Pune - 411030',
          areaDistrict: 'Swargate / South-Central',
          receivedUnits: 60,
          remainingUnits: 29,
          deliveryDate: '2026-06-03',
          status: 'active_shelf',
          contactPerson: 'Suryakant Pathak',
          phone: '+91 20 2447 1822',
          lat: 18.5018,
          lng: 73.8527,
          locality: 'Swargate',
          violationSummary: 'Truncated consumer helpline phone number (080-4999); non-compliant under Rule 6.'
        },
        {
          storeName: 'D-Mart Supermarket',
          storeAddress: 'Baner-Pashan Link Road, Baner, Pune - 411045',
          areaDistrict: 'Baner / West Pune',
          receivedUnits: 120,
          remainingUnits: 36,
          deliveryDate: '2026-06-05',
          status: 'active_shelf',
          contactPerson: 'Manjunath Reddy',
          phone: '+91 20 2729 4400',
          lat: 18.5590,
          lng: 73.7868,
          locality: 'Baner',
          violationSummary: 'Non-compliant print cylinder used for MRP string across entire batch.'
        }
      ],
      regionalAreaImpact: {
        regionName: 'Pune Metropolitan District (MH-12 West & Central Circle)',
        stateCode: 'MH-12',
        totalOutletsAffected: 8,
        estimatedUnitsInMarket: 210,
        riskLevel: 'HIGH',
        containmentStatus: 'Rectification Notice Dispatched to VedaPure Sanaswadi Plant',
        zonalOfficerInCharge: 'Dr. Anita Desai (Senior Inspection Officer, Pune)'
      },
      smartEscalation: {
        escalationId: 'ESC-MH12-2026-4410',
        severityLevel: 'URGENT_DISTRIBUTOR_RECALL',
        recipientRole: 'Legal Metrology Officer (Pune Zone 2)',
        recipientName: 'Dr. Anita Desai',
        recipientEmail: 'anita.desai@legalmetrology.mah.gov.in',
        sentTimestamp: '2026-09-07 04:30 PM',
        status: 'ACKNOWLEDGED',
        actionDirective: 'Directive 19/2026: Mandate manufacturer VedaPure to recall non-compliant packaging from retail distribution across Pune district within 5 days.'
      },
      recallStatus: 'warning_flagged'
    }
  },
  {
    id: 'prod-03',
    sku: 'YAT-GR-003',
    name: 'Classic Basmati Rice',
    category: 'Grains & Staples',
    brand: 'Royal Crest Agrotech',
    packSize: '5 kg',
    batchNumber: 'RC-BAS-8902',
    complianceScore: 88,
    status: 'warning',
    lastScanDate: '2026-09-06 11:20',
    issuesCount: 1,
    criticalIssues: 0,
    owner: 'Suresh Kumar (FEO)',
    sides: [
      {
        id: 'side-03-front',
        sideName: 'Front Panel',
        imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="750" viewBox="0 0 600 750"><rect width="600" height="750" fill="%23f0fdf4" rx="24"/><rect x="25" y="25" width="550" height="700" fill="%23ffffff" stroke="%2316a34a" stroke-width="2" rx="16"/><text x="300" y="140" font-family="sans-serif" font-size="34" font-weight="bold" fill="%2314532d" text-anchor="middle">ROYAL CREST</text><text x="300" y="180" font-family="sans-serif" font-size="24" font-weight="bold" fill="%2315803d" text-anchor="middle">CLASSIC BASMATI RICE</text><text x="300" y="215" font-family="sans-serif" font-size="14" fill="%23166534" text-anchor="middle">Aged Himalayan Extra Long Grain</text><rect x="60" y="440" width="480" height="180" fill="%23dcfce7" rx="12" stroke="%2322c55e"/><text x="80" y="480" font-family="sans-serif" font-size="15" font-weight="bold" fill="%23b45309">NET QUANTITY: 5 kg (Font height: 2.8mm - Below 4.0mm requirement for &gt;1kg)</text><text x="80" y="520" font-family="sans-serif" font-size="18" font-weight="bold" fill="%2314532d">MRP ₹ 640.00 (INCL. OF ALL TAXES)</text><text x="80" y="560" font-family="sans-serif" font-size="14" fill="%23166534">Country of Origin: India | Packed by: Royal Crest Agrotech, Karnal, Haryana</text><text x="80" y="590" font-family="sans-serif" font-size="13" fill="%23166534">Care: support@royalcrest.in | Toll Free: 1800-200-5555</text></svg>',
        boundingBoxes: [
          {
            id: 'box-rice-1',
            field: 'Net Quantity Font Height',
            category: 'net_quantity',
            x: 10,
            y: 58,
            width: 80,
            height: 8,
            detectedText: 'NET QUANTITY: 5 kg',
            confidence: 97.8,
            status: 'needs_review',
            violationId: 'viol-05'
          }
        ]
      }
    ],
    declarations: [
      { id: 'dec-r1', key: 'net_qty', label: 'Net Quantity Height Ratio', detectedValue: '5 kg (2.8mm font height)', standardRequired: 'Minimum 4.0mm font height for packages exceeding 1 kg and up to 5 kg', status: 'needs_review', category: 'Metrology', confidence: 97.8, notes: 'Measured typography height is 2.8mm, which is below the mandatory 4.0mm requirement.' },
      { id: 'dec-r2', key: 'mrp', label: 'Maximum Retail Price', detectedValue: '₹ 640.00 (INCL. OF ALL TAXES)', standardRequired: 'Explicit tax inclusive indicator', status: 'detected', category: 'Pricing', confidence: 99.4 },
      { id: 'dec-r3', key: 'origin', label: 'Country of Origin', detectedValue: 'Country of Origin: India', standardRequired: 'Country of origin statement', status: 'detected', category: 'Trade Origin', confidence: 99.9 },
      { id: 'dec-r4', key: 'consumer_care', label: 'Customer Redressal', detectedValue: 'support@royalcrest.in / 1800-200-5555', standardRequired: 'Designated telephone & email', status: 'detected', category: 'Consumer Protection', confidence: 98.4 }
    ],
    violations: [
      {
        id: 'viol-05',
        productId: 'prod-03',
        productName: 'Classic Basmati Rice',
        sku: 'YAT-GR-003',
        title: 'Net quantity declaration font size below statutory height threshold',
        category: 'Net Quantity',
        severity: 'medium',
        explanation: 'For pre-packaged commodities with net quantity exceeding 1 kg and up to 5 kg, the minimum font height for the quantity numeral must be at least 4.0 mm under Schedule II metrology guidelines. Detected visual glyph height is 2.8 mm.',
        evidence: 'Detected visual letter height ratio: 2.8mm on 5 kg packaging canvas.',
        recommendedAction: 'Serve packaging rectification advisory to packer to enlarge font height to >= 4.0 mm on future print runs.',
        reviewStatus: 'under_review',
        detectedAt: '2026-09-06 11:20',
        assignedTo: 'Suresh Kumar',
        ruleCode: 'RULE-NET-01'
      }
    ],
    history: [
      { date: '2026-09-06 11:20', score: 88, scannedBy: 'Yatarth AI Engine v4.2', notes: 'Warning flagged on font sizing verification module.' }
    ]
  },
  {
    id: 'prod-04',
    sku: 'YAT-HN-004',
    name: 'Natural Forest Honey',
    category: 'Condiments & Spreads',
    brand: 'NectarBloom Pure Foods',
    packSize: '500 g',
    batchNumber: 'NB-HON-402',
    complianceScore: 42,
    status: 'non_compliant',
    lastScanDate: '2026-09-05 09:12',
    issuesCount: 3,
    criticalIssues: 2,
    owner: 'Vikram Sengupta (LMO)',
    sides: [
      {
        id: 'side-04-front',
        sideName: 'Front Panel',
        imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="750" viewBox="0 0 600 750"><rect width="600" height="750" fill="%23fffbeb" rx="24"/><rect x="25" y="25" width="550" height="700" fill="%23ffffff" stroke="%23d97706" stroke-width="2" rx="16"/><text x="300" y="140" font-family="sans-serif" font-size="34" font-weight="bold" fill="%2378350f" text-anchor="middle">NECTARBLOOM</text><text x="300" y="185" font-family="sans-serif" font-size="24" font-weight="bold" fill="%23b45309" text-anchor="middle">NATURAL FOREST HONEY</text><text x="300" y="215" font-family="sans-serif" font-size="14" fill="%2392400e" text-anchor="middle">100% Raw Wildflower Nectar</text><rect x="60" y="420" width="480" height="220" fill="%23fef3c7" rx="12" stroke="%23f59e0b"/><text x="80" y="460" font-family="sans-serif" font-size="16" font-weight="bold" fill="%2378350f">Net Contents: 500 g</text><text x="80" y="500" font-family="sans-serif" font-size="16" font-weight="bold" fill="%2378350f">MRP: ₹ 340.00 (INCL. OF ALL TAXES)</text><text x="80" y="540" font-family="sans-serif" font-size="14" font-weight="bold" fill="%23dc2626">! OFFENCE: Country of Origin Declaration Missing</text><text x="80" y="575" font-family="sans-serif" font-size="14" font-weight="bold" fill="%23dc2626">! OFFENCE: Consumer Care Email Address Missing</text><text x="80" y="610" font-family="sans-serif" font-size="13" fill="%23b45309">Batch Code: [Smudged / Low OCR Confidence]</text></svg>',
        boundingBoxes: [
          {
            id: 'box-honey-1',
            field: 'Missing Country of Origin',
            category: 'origin',
            x: 10,
            y: 72,
            width: 80,
            height: 6,
            detectedText: '[NOT DETECTED]',
            confidence: 0,
            status: 'missing',
            violationId: 'viol-06'
          },
          {
            id: 'box-honey-2',
            field: 'Consumer Care Email Absent',
            category: 'consumer_care',
            x: 10,
            y: 78,
            width: 80,
            height: 6,
            detectedText: '[EMAIL NOT DETECTED]',
            confidence: 0,
            status: 'missing',
            violationId: 'viol-07'
          }
        ]
      }
    ],
    declarations: [
      { id: 'dec-h1', key: 'origin', label: 'Country of Origin', detectedValue: 'MISSING', standardRequired: 'Clear Country of Origin text on PDP or back panel', status: 'missing', category: 'Trade Origin', confidence: 0, notes: 'Zero matches found across all scanned packaging planes.' },
      { id: 'dec-h2', key: 'consumer_care', label: 'Consumer Redressal Email', detectedValue: 'MISSING', standardRequired: 'Mandatory active email address for customer disputes', status: 'missing', category: 'Consumer Protection', confidence: 0 },
      { id: 'dec-h3', key: 'batch_num', label: 'Batch / Lot Identification', detectedValue: 'NB-HON-402 (Smudged)', standardRequired: 'Unambiguous legible lot/code string', status: 'needs_review', category: 'Traceability', confidence: 44.5, notes: 'Low OCR confidence score due to low ink density or smudged font.' },
      { id: 'dec-h4', key: 'mrp', label: 'Maximum Retail Price', detectedValue: '₹ 340.00 (INCL. OF ALL TAXES)', standardRequired: 'Tax inclusive formulation', status: 'detected', category: 'Pricing', confidence: 99.1 }
    ],
    violations: [
      {
        id: 'viol-06',
        productId: 'prod-04',
        productName: 'Natural Forest Honey',
        sku: 'YAT-HN-004',
        title: 'Country of Origin statement completely missing from packaging',
        category: 'Manufacturer & Origin',
        severity: 'critical',
        explanation: 'Every pre-packaged commodity must prominently declare the country where the goods were manufactured or packaged. No country of origin declaration was detected on any label surface.',
        evidence: 'Surveillance scan across all label regions returned zero matches for origin identifier.',
        recommendedAction: 'Issue statutory show cause notice for omission of country of origin under Rule 6(1)(j).',
        reviewStatus: 'open',
        detectedAt: '2026-09-05 09:12',
        assignedTo: 'Vikram Sengupta',
        ruleCode: 'RULE-ORG-01'
      },
      {
        id: 'viol-07',
        productId: 'prod-04',
        productName: 'Natural Forest Honey',
        sku: 'YAT-HN-004',
        title: 'Consumer grievance contact email address missing',
        category: 'Consumer Care',
        severity: 'critical',
        explanation: 'Legal Metrology rules mandate that consumer grievance details must provide both a phone number and an email address. The scanned artwork provides no electronic mail address.',
        evidence: 'Consumer care box lacks email domain or contact address.',
        recommendedAction: 'Instruct packer to include functional grievance redressal email address.',
        reviewStatus: 'open',
        detectedAt: '2026-09-05 09:12',
        assignedTo: 'Vikram Sengupta',
        ruleCode: 'RULE-CARE-01'
      }
    ],
    history: [
      { date: '2026-09-05 09:12', score: 42, scannedBy: 'Yatarth AI Engine v4.2', notes: 'High-risk non-compliance score. Distribution block order initiated.' }
    ]
  },
  {
    id: 'prod-05',
    sku: 'YAT-PC-005',
    name: 'Herbal Revitalizing Shampoo',
    category: 'Personal Care & Cosmetics',
    brand: 'Botanica Elements',
    packSize: '350 ml',
    batchNumber: 'BE-SHM-991',
    complianceScore: 98,
    status: 'compliant',
    lastScanDate: '2026-09-07 18:40',
    issuesCount: 0,
    criticalIssues: 0,
    owner: 'Dr. Anita Desai (SIO)',
    sides: [
      {
        id: 'side-05-front',
        sideName: 'Front Panel',
        imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="750" viewBox="0 0 600 750"><rect width="600" height="750" fill="%23f0f9ff" rx="24"/><rect x="25" y="25" width="550" height="700" fill="%23ffffff" stroke="%230284c7" stroke-width="2" rx="16"/><text x="300" y="140" font-family="sans-serif" font-size="30" font-weight="bold" fill="%230c4a6e" text-anchor="middle">BOTANICA ELEMENTS</text><text x="300" y="180" font-family="sans-serif" font-size="22" font-weight="bold" fill="%230369a1" text-anchor="middle">HERBAL REVITALIZING SHAMPOO</text><text x="300" y="210" font-family="sans-serif" font-size="14" fill="%230284c7" text-anchor="middle">Bhringraj, Amla & Rosemary Extract</text><rect x="60" y="440" width="480" height="190" fill="%23e0f2fe" rx="12" stroke="%230284c7"/><text x="80" y="480" font-family="sans-serif" font-size="16" font-weight="bold" fill="%230c4a6e">NET VOLUME: 350 ml</text><text x="80" y="515" font-family="sans-serif" font-size="16" font-weight="bold" fill="%230c4a6e">MRP ₹ 399.00 (INCL. OF ALL TAXES)</text><text x="80" y="550" font-family="sans-serif" font-size="13" fill="%23334155">Mfg Date: 09/2026 | Exp: 08/2028 | Batch: BE-SHM-991</text><text x="80" y="580" font-family="sans-serif" font-size="13" fill="%23334155">Country of Origin: India | Care: 1800-111-2233 / care@botanica.com</text><text x="80" y="605" font-family="sans-serif" font-size="12" font-weight="bold" fill="%2316a34a">✓ ALL STATUTORY LEGAL METROLOGY DECLARATIONS VERIFIED</text></svg>',
        boundingBoxes: [
          {
            id: 'box-shm-1',
            field: 'Volume Declaration',
            category: 'net_quantity',
            x: 10,
            y: 58,
            width: 80,
            height: 7,
            detectedText: 'NET VOLUME: 350 ml',
            confidence: 99.8,
            status: 'detected'
          },
          {
            id: 'box-shm-2',
            field: 'MRP Inclusive',
            category: 'mrp',
            x: 10,
            y: 65,
            width: 80,
            height: 7,
            detectedText: 'MRP ₹ 399.00 (INCL. OF ALL TAXES)',
            confidence: 99.6,
            status: 'detected'
          }
        ]
      }
    ],
    declarations: [
      { id: 'dec-s1', key: 'net_qty', label: 'Net Volume', detectedValue: '350 ml', standardRequired: 'Standard metric liquid unit', status: 'detected', category: 'Metrology', confidence: 99.8 },
      { id: 'dec-s2', key: 'mrp', label: 'Maximum Retail Price', detectedValue: '₹ 399.00 (INCL. OF ALL TAXES)', standardRequired: 'Standard inclusive price format', status: 'detected', category: 'Pricing', confidence: 99.6 },
      { id: 'dec-s3', key: 'dates', label: 'Mfg & Expiry Dates', detectedValue: 'Mfg: 09/2026 | Exp: 08/2028', standardRequired: 'Clear MM/YYYY format', status: 'detected', category: 'Shelf Life', confidence: 99.2 },
      { id: 'dec-s4', key: 'origin', label: 'Country of Origin', detectedValue: 'India', standardRequired: 'Clear country declaration', status: 'detected', category: 'Trade Origin', confidence: 99.7 },
      { id: 'dec-s5', key: 'consumer_care', label: 'Consumer Support Cell', detectedValue: '1800-111-2233 / care@botanica.com', standardRequired: 'Phone & email accessible', status: 'detected', category: 'Consumer Protection', confidence: 98.9 }
    ],
    violations: [],
    history: [
      { date: '2026-09-07 18:40', score: 98, scannedBy: 'Yatarth AI Engine v4.2', notes: 'Full statutory compliance verified. Certified clear for market distribution.' }
    ]
  },
  {
    id: 'prod-06',
    sku: 'YAT-BV-006',
    name: 'Classic Dark Instant Coffee',
    category: 'Beverages',
    brand: 'Equator Coffee Roasters',
    packSize: '200 g',
    batchNumber: 'EQ-ROAST-77',
    complianceScore: 76,
    status: 'warning',
    lastScanDate: '2026-09-06 17:05',
    issuesCount: 1,
    criticalIssues: 0,
    owner: 'Suresh Kumar (FEO)',
    sides: [
      {
        id: 'side-06-front',
        sideName: 'Front Panel',
        imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="750" viewBox="0 0 600 750"><rect width="600" height="750" fill="%23fdf4ff" rx="24"/><rect x="25" y="25" width="550" height="700" fill="%23ffffff" stroke="%23c084fc" stroke-width="2" rx="16"/><text x="300" y="140" font-family="sans-serif" font-size="30" font-weight="bold" fill="%23581c87" text-anchor="middle">EQUATOR COFFEE</text><text x="300" y="180" font-family="sans-serif" font-size="22" font-weight="bold" fill="%237e22ce" text-anchor="middle">CLASSIC DARK INSTANT COFFEE</text><text x="300" y="210" font-family="sans-serif" font-size="14" fill="%23a855f7" text-anchor="middle">100% Pure Agglomerated Coffee Blend</text><rect x="60" y="440" width="480" height="190" fill="%23f5d0fe" rx="12" stroke="%23c084fc"/><text x="80" y="480" font-family="sans-serif" font-size="16" font-weight="bold" fill="%23581c87">NET WEIGHT: 200 g</text><text x="80" y="515" font-family="sans-serif" font-size="16" font-weight="bold" fill="%23581c87">MRP ₹ 425.00 (INCL. OF ALL TAXES)</text><text x="80" y="550" font-family="sans-serif" font-size="13" font-weight="bold" fill="%239333ea">Imported Beans: Packed in India by Equator Foods (Missing Importer IEC code)</text><text x="80" y="585" font-family="sans-serif" font-size="13" fill="%236b21a8">Consumer Care: 022-6800-4411 | coffee@equator.com</text></svg>',
        boundingBoxes: [
          {
            id: 'box-cof-1',
            field: 'Importer Details Clarity',
            category: 'manufacturer',
            x: 10,
            y: 70,
            width: 80,
            height: 8,
            detectedText: 'Imported Beans: Packed in India by Equator Foods',
            confidence: 93.1,
            status: 'needs_review',
            violationId: 'viol-08'
          }
        ]
      }
    ],
    declarations: [
      { id: 'dec-c1', key: 'net_qty', label: 'Net Weight', detectedValue: '200 g', standardRequired: 'Standard metric weight', status: 'detected', category: 'Metrology', confidence: 99.4 },
      { id: 'dec-c2', key: 'mrp', label: 'Maximum Retail Price', detectedValue: '₹ 425.00 (INCL. OF ALL TAXES)', standardRequired: 'Tax inclusive standard', status: 'detected', category: 'Pricing', confidence: 98.8 },
      { id: 'dec-c3', key: 'manufacturer', label: 'Importer / Packer Attribution', detectedValue: 'Packed in India by Equator Foods (Imported Blend)', standardRequired: 'Full registered address and IEC importer registration details', status: 'needs_review', category: 'Corporate', confidence: 93.1, notes: 'Product blends imported ingredients; requires explicit importer entity clarification.' }
    ],
    violations: [
      {
        id: 'viol-08',
        productId: 'prod-06',
        productName: 'Classic Dark Instant Coffee',
        sku: 'YAT-BV-006',
        title: 'Importer identification and country of origin attribution ambiguity',
        category: 'Manufacturer & Origin',
        severity: 'medium',
        explanation: 'When commodities contain imported components or are packed from imported bulk lots, the name and address of the importer along with origin country of bulk raw material must be explicitly demarcated under legal metrology standards.',
        evidence: 'Label note: "Imported Beans: Packed in India by Equator Foods" lacks specific importer registered entity address.',
        recommendedAction: 'Specify "Raw coffee imported from Vietnam/Brazil; Imported & Marketed by: Equator Foods Ltd., Address..."',
        reviewStatus: 'open',
        detectedAt: '2026-09-06 17:05',
        assignedTo: 'Suresh Kumar',
        ruleCode: 'RULE-IMP-02'
      }
    ],
    history: [
      { date: '2026-09-06 17:05', score: 76, scannedBy: 'Yatarth AI Engine v4.2', notes: 'Importer attribution warning logged.' }
    ]
  }
];

export const COMPLIANCE_RULES: ComplianceRule[] = [
  {
    id: 'rule-01',
    code: 'RULE-MRP-01',
    title: 'Mandatory Tax-Inclusive Declaration on Retail Price',
    category: 'MRP & Pricing',
    description: 'Every pre-packaged commodity intended for retail sale must state Maximum Retail Price followed by "(Inclusive of all taxes)" or "(Incl. of all taxes)". No extraneous symbols or ambiguous abbreviations permitted under Rule 6(1)(e).',
    severity: 'critical',
    statutoryReference: 'Rule 6(1)(e) - Package Commodity Standards',
    active: true,
    version: '2.4.0',
    lastUpdated: '2026-08-15',
    matchCriteria: 'Regex: (MRP|M\\.R\\.P\\.?).*?(INCL(USIVE)?\\.?\\s+OF\\s+ALL\\s+TAXES)',
    enforcementThreshold: 'Mandatory for 100% SKU deployments'
  },
  {
    id: 'rule-02',
    code: 'RULE-NET-01',
    title: 'Minimum Font Height for Net Quantity Declaration',
    category: 'Net Quantity',
    description: 'The numeral representing net quantity must comply with minimum height standards according to net package weight: >=2mm up to 200g, >=4mm from 200g to 1kg, >=6mm above 1kg under Schedule II standards.',
    severity: 'medium',
    statutoryReference: 'Schedule II, Table 1 - Legibility Guidelines',
    active: true,
    version: '3.1.1',
    lastUpdated: '2026-07-22',
    matchCriteria: 'OCR Bounding Box Height >= prescribed millimeter threshold based on net content magnitude',
    enforcementThreshold: '95% compliance threshold'
  },
  {
    id: 'rule-03',
    code: 'RULE-ORG-01',
    title: 'Mandatory Country of Origin Disclosure',
    category: 'Manufacturer & Origin',
    description: 'The country of origin or manufacture must be explicitly and conspicuously printed on the principal display panel or information panel under Rule 6(1)(j).',
    severity: 'critical',
    statutoryReference: 'Rule 6(1)(j) - Country of Origin Mandate',
    active: true,
    version: '1.9.0',
    lastUpdated: '2026-08-01',
    matchCriteria: 'Regex: (COUNTRY\\s+OF\\s+ORIGIN|MADE\\s+IN|PRODUCED\\s+IN)\\s*:\\s*[A-Z]+',
    enforcementThreshold: 'Critical statutory blocker'
  },
  {
    id: 'rule-04',
    code: 'RULE-CARE-01',
    title: 'Dual Contact Channel Consumer Grievance Cell',
    category: 'Consumer Care',
    description: 'Every retail package must disclose name, address, telephone number, and email address of the person or office who can be contacted for consumer grievances under Rule 6(1)(n).',
    severity: 'critical',
    statutoryReference: 'Rule 6(1)(n) - Consumer Protection Mandate',
    active: true,
    version: '4.0.0',
    lastUpdated: '2026-08-20',
    matchCriteria: 'Detection of both valid telephone / toll-free string AND valid email address string in consumer care block',
    enforcementThreshold: 'Zero tolerance'
  },
  {
    id: 'rule-05',
    code: 'RULE-DAT-04',
    title: 'Unambiguous Manufacturing and Expiry Representation',
    category: 'Dates & Shelf Life',
    description: 'Month and year of manufacture or packaging must be declared in legible MM/YYYY or Month Year format. Relative statements must provide explicit date reference.',
    severity: 'medium',
    statutoryReference: 'Rule 6(1)(d) - Date Formatting Standard',
    active: true,
    version: '2.2.0',
    lastUpdated: '2026-06-30',
    matchCriteria: 'Regex: (MFG|PKD|PACKED|MANUFACTURED)\\s*[:.]?\\s*(\\d{2}[/-]\\d{4}|[A-Z]{3,9}\\s+\\d{4})',
    enforcementThreshold: 'High priority'
  },
  {
    id: 'rule-06',
    code: 'RULE-LEG-02',
    title: 'Contrast Ratio and Background Legibility',
    category: 'Typography & Legibility',
    description: 'Mandatory declarations must maintain a minimum contrast ratio of at least 4.5:1 against packaging background to prevent deceptive camouflage.',
    severity: 'low',
    statutoryReference: 'Rule 9(3) - Conspicuous Presentation Standard',
    active: true,
    version: '1.2.0',
    lastUpdated: '2026-05-12',
    matchCriteria: 'Luminance contrast ratio >= 4.5:1 on bounding box RGB histogram',
    enforcementThreshold: 'Recommended'
  }
];

export const MOCK_INSPECTIONS: Inspection[] = [
  {
    id: 'insp-101',
    code: 'INS-2026-089',
    title: 'Western Zone Legal Metrology Market Surveillance Audit',
    leadAuditor: 'Rajesh Varma (Controller)',
    status: 'in_progress',
    scheduledDate: '2026-09-08',
    facility: 'Regional Wholesale Distribution Hub B4',
    productsCount: 14,
    passedCount: 11,
    failedCount: 3,
    avgScore: 84.6,
    notes: 'Surveillance drive focusing on confectionery, pulses, and spices packaging declarations.',
    productIds: ['prod-01', 'prod-02', 'prod-03']
  },
  {
    id: 'insp-102',
    code: 'INS-2026-088',
    title: 'Personal Care Products Statutory Declarations Inspection',
    leadAuditor: 'Dr. Anita Desai (SIO)',
    status: 'completed',
    scheduledDate: '2026-09-02',
    completedDate: '2026-09-03',
    facility: 'Central Enforcement Testing Laboratory',
    productsCount: 8,
    passedCount: 8,
    failedCount: 0,
    avgScore: 97.2,
    notes: 'All 8 SKUs achieved 95%+ legal metrology compliance index.',
    productIds: ['prod-05']
  },
  {
    id: 'insp-103',
    code: 'INS-2026-087',
    title: 'Packaged Commodities Net Content Verification Drive',
    leadAuditor: 'Vikram Sengupta (LMO)',
    status: 'review',
    scheduledDate: '2026-09-05',
    facility: 'Port Logistics Inspection Terminal 2',
    productsCount: 19,
    passedCount: 14,
    failedCount: 5,
    avgScore: 78.4,
    notes: '5 items flagged with unit symbol and tax clause discrepancies pending seizure notice.',
    productIds: ['prod-04', 'prod-06']
  },
  {
    id: 'insp-104',
    code: 'INS-2026-090',
    title: 'National Retail Shelf Compliance Sampling',
    leadAuditor: 'Suresh Kumar (FEO)',
    status: 'scheduled',
    scheduledDate: '2026-09-18',
    facility: 'Multi-district retail inspection (40 stores)',
    productsCount: 45,
    passedCount: 0,
    failedCount: 0,
    avgScore: 0,
    notes: 'All 8 Products achieved 95%+ packaging rules compliance index.',
    productIds: ['prod-01', 'prod-02', 'prod-03', 'prod-04', 'prod-05', 'prod-06']
  },
  {
    id: 'insp-002',
    code: 'INS-2026-088',
    title: 'Edible Oils & Spices Label Verification',
    facility: 'Bhopal Distribution Terminal - Warehouse B',
    leadAuditor: 'Vikramaditya Verma',
    scheduledDate: '2026-03-29',
    status: 'in_progress',
    productsCount: 4,
    passedCount: 2,
    failedCount: 2,
    avgScore: 68.5,
    notes: '2 products flagged for non-compliant consumer helpline & MRP declaration.',
    productIds: ['prod-002', 'prod-003']
  }
];

export const MOCK_REPORTS: ReportItem[] = [
  {
    id: 'rep-001',
    reportNumber: 'REP-2026-00142',
    title: 'National Packaging Rules Verification Summary',
    type: 'Executive Summary',
    generatedAt: '2026-03-28 09:30 AM',
    author: 'Legal Metrology Compliance Office',
    scope: '6 Product Categories | 120 Products',
    complianceRate: 88.4,
    criticalIssuesCount: 4,
    status: 'ready',
    fileSize: '4.8 MB'
  },
  {
    id: 'rep-002',
    reportNumber: 'REP-2026-00139',
    title: 'Spice Packet Net Weight Rule Notice',
    type: 'Violation Matrix',
    generatedAt: '2026-03-27 04:15 PM',
    author: 'Field Enforcement Inspectorate',
    scope: 'Product Code: YAT-SP-002 (Batch VP-TURM-2026)',
    complianceRate: 58.0,
    criticalIssuesCount: 2,
    status: 'ready',
    fileSize: '2.1 MB'
  },
  {
    id: 'rep-003',
    reportNumber: 'REP-2026-00135',
    title: 'Personal Care Products Store Audit',
    type: 'Audit Inspection',
    generatedAt: '2026-03-26 11:00 AM',
    author: 'Dr. Rajesh Sharma',
    scope: '8 Cosmetics & Personal Care Products',
    complianceRate: 98.2,
    criticalIssuesCount: 0,
    status: 'ready',
    fileSize: '2.1 MB'
  }
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'user-01',
    name: 'Rajesh Varma',
    email: 'controller.lm@yatarth.ai',
    role: 'Controller of Legal Metrology',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    assignedProducts: 14,
    lastActive: 'Just now'
  },
  {
    id: 'user-02',
    name: 'Dr. Anita Desai',
    email: 'anita.desai@yatarth.ai',
    role: 'Senior Inspection Officer',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    assignedProducts: 9,
    lastActive: '5 mins ago'
  },
  {
    id: 'user-03',
    name: 'Vikram Sengupta',
    email: 'vikram.sengupta@yatarth.ai',
    role: 'Legal Metrology Officer',
    status: 'away',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    assignedProducts: 11,
    lastActive: '28 mins ago'
  },
  {
    id: 'user-04',
    name: 'Suresh Kumar',
    email: 'suresh.kumar@yatarth.ai',
    role: 'Field Enforcement Inspector',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    assignedProducts: 6,
    lastActive: '1 hour ago'
  }
];

export const AUDIT_LOGS: AuditLog[] = [
  { id: 'log-01', timestamp: '2026-09-08 09:15:22', actor: 'Rajesh Varma (Controller)', action: 'Issued Inspection Order', target: 'INS-2026-089', ipAddress: '10.10.14.2', severity: 'info' },
  { id: 'log-02', timestamp: '2026-09-08 08:44:09', actor: 'Yatarth AI Engine v4.2', action: 'Flagged Critical Legal Offence (Missing Origin)', target: 'Natural Forest Honey', ipAddress: 'Internal VPC', severity: 'warn' },
  { id: 'log-03', timestamp: '2026-09-07 20:10:41', actor: 'Dr. Anita Desai (SIO)', action: 'Issued Statutory Notice PDF', target: 'YAT-LM-2026-0941', ipAddress: '10.10.14.18', severity: 'info' },
  { id: 'log-04', timestamp: '2026-09-07 16:30:15', actor: 'Enforcement Security', action: 'Officer Credential Key Provisioned', target: 'Surveillance Webhook', ipAddress: '10.10.14.2', severity: 'security' },
  { id: 'log-05', timestamp: '2026-09-07 14:35:02', actor: 'Vikram Sengupta (LMO)', action: 'Status changed to Under Review', target: 'viol-05 (Classic Basmati Rice)', ipAddress: '10.10.14.55', severity: 'info' }
];
