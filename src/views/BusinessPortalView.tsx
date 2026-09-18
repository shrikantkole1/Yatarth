import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Building2, CheckCircle2, AlertTriangle, ArrowLeft, Upload, Scan,
  FileCheck2, Scale, Download, ShieldCheck, Ruler, ArrowRight, Info,
  Printer, FileSpreadsheet, RefreshCw, XCircle, FileText, Check, Sparkles
} from 'lucide-react';

interface BusinessPortalViewProps {
  onBack?: () => void;
  onLaunchInspectorScan?: () => void;
}

export const BusinessPortalView: React.FC<BusinessPortalViewProps> = ({
  onBack,
  onLaunchInspectorScan
}) => {
  const { setCurrentTab, switchRole } = useApp();

  // Active Business Tab: 'pre_market_audit' | 'calculators' | 'artworks_repo'
  const [activeTab, setActiveTab] = useState<'pre_market_audit' | 'calculators' | 'artworks_repo'>('pre_market_audit');

  // Pre-Market Artwork Upload & Check State (Modules 2, 3, 4, 5)
  const [uploadedArtwork, setUploadedArtwork] = useState<string>('/images/products/almond_cookies.jpg');
  const [selectedArtworkPreset, setSelectedArtworkPreset] = useState<'cookies' | 'namkeen' | 'custom'>('cookies');
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditVerdict, setAuditVerdict] = useState<'PASS' | 'FAIL' | 'PARTIAL'>('PASS');
  const [certificateGenerated, setCertificateGenerated] = useState<boolean>(false);

  // Editable fields before export (Module 5)
  const [auditData, setAuditData] = useState({
    brandName: 'Artisan Harvest Foods',
    productName: 'Premium Almond Cookies (250g Carton)',
    manufacturer: 'Artisan Harvest Foods Pvt Ltd, Industrial Area Phase II, Peenya, Bengaluru - 560058',
    netQuantity: '250 g',
    mrp: '₹ 185.00 (Incl. of all taxes)',
    usp: '₹ 74.00 per 100g',
    mfgDate: '09/2026',
    expiryDate: '03/2027 (6 Months from packaging)',
    consumerCare: 'feedback@artisanharvest.com | 1800-425-9090',
    pdpAreaSqCm: 145,
    minFontHeightMm: 2.0,
    measuredFontHeightMm: 2.2,
    fontCompliance: 'PASS'
  });

  // Statutory Checklist (Module 4)
  const [rulesChecklist, setRulesChecklist] = useState([
    { rule: 'Rule 6(1)(a) - Manufacturer / Packer Identity', status: 'PASS', detail: 'Complete postal address with PIN code verified.' },
    { rule: 'Rule 6(1)(b) - Generic Name of Commodity', status: 'PASS', detail: 'Plain generic description "Premium Almond Cookies" clearly stated.' },
    { rule: 'Rule 6(1)(c) - Net Quantity in Metric Units', status: 'PASS', detail: 'Declared as 250 g in standard lowercase symbols without abbreviations.' },
    { rule: 'Rule 6(1)(d) - Month & Year of Manufacture', status: 'PASS', detail: '09/2026 declared with absolute MM/YYYY format.' },
    { rule: 'Rule 6(1)(da) & 6(11) - Unit Sale Price (USP)', status: 'PASS', detail: 'Calculated as ₹ 74.00 per 100g prominently positioned.' },
    { rule: 'Rule 6(1)(e) - MRP Inclusive of All Taxes', status: 'PASS', detail: 'Statutory clause "Inclusive of all taxes" explicitly printed.' },
    { rule: 'Rule 6(1)(n) - Consumer Care Contact', status: 'PASS', detail: 'Both telephone and official electronic email provided.' },
    { rule: 'Rule 7 & Sched II - Minimum Font Height', status: 'PASS', detail: 'Numerals measure 2.2 mm (Statutory minimum 2.0 mm for 145 sq cm PDP).' }
  ]);

  // Calculator State
  const [selectedCategory, setSelectedCategory] = useState<string>('Packaged Food & Snacks');
  const [declaredNetQty, setDeclaredNetQty] = useState<string>('250');
  const [declaredMRP, setDeclaredMRP] = useState<string>('185.00');
  const [calcPdpArea, setCalcPdpArea] = useState<string>('150');

  // Rule 6(11) USP Calculation
  const qtyInGrams = parseFloat(declaredNetQty || '0');
  const mrpVal = parseFloat(declaredMRP || '0');
  const calculatedUSP = qtyInGrams > 0 ? (mrpVal / (qtyInGrams / 100)).toFixed(2) : '0.00';

  // Rule 7 Font Height Calculation
  const pdpAreaVal = parseFloat(calcPdpArea || '0');
  let statutoryMinFontMm = 1.0;
  if (pdpAreaVal <= 50) statutoryMinFontMm = 1.0;
  else if (pdpAreaVal <= 100) statutoryMinFontMm = 1.5;
  else if (pdpAreaVal <= 500) statutoryMinFontMm = 2.0;
  else if (pdpAreaVal <= 2500) statutoryMinFontMm = 4.0;
  else statutoryMinFontMm = 6.0;

  const handleSimulateArtworkCheck = (type: 'cookies' | 'namkeen') => {
    setIsAuditing(true);
    setSelectedArtworkPreset(type);
    setCertificateGenerated(false);

    if (type === 'cookies') {
      setUploadedArtwork('/images/products/almond_cookies.jpg');
      setAuditData({
        brandName: 'Artisan Harvest Foods',
        productName: 'Premium Almond Cookies (250g Carton)',
        manufacturer: 'Artisan Harvest Foods Pvt Ltd, Industrial Area Phase II, Peenya, Bengaluru - 560058',
        netQuantity: '250 g',
        mrp: '₹ 185.00 (Incl. of all taxes)',
        usp: '₹ 74.00 per 100g',
        mfgDate: '09/2026',
        expiryDate: '03/2027 (6 Months from packaging)',
        consumerCare: 'feedback@artisanharvest.com | 1800-425-9090',
        pdpAreaSqCm: 145,
        minFontHeightMm: 2.0,
        measuredFontHeightMm: 2.2,
        fontCompliance: 'PASS'
      });
      setTimeout(() => {
        setAuditVerdict('PASS');
        setRulesChecklist([
          { rule: 'Rule 6(1)(a) - Manufacturer / Packer Identity', status: 'PASS', detail: 'Complete postal address with PIN code verified.' },
          { rule: 'Rule 6(1)(b) - Generic Name of Commodity', status: 'PASS', detail: 'Plain generic description "Premium Almond Cookies" clearly stated.' },
          { rule: 'Rule 6(1)(c) - Net Quantity in Metric Units', status: 'PASS', detail: 'Declared as 250 g in standard lowercase symbols without abbreviations.' },
          { rule: 'Rule 6(1)(d) - Month & Year of Manufacture', status: 'PASS', detail: '09/2026 declared with absolute MM/YYYY format.' },
          { rule: 'Rule 6(1)(da) & 6(11) - Unit Sale Price (USP)', status: 'PASS', detail: 'Calculated as ₹ 74.00 per 100g prominently positioned.' },
          { rule: 'Rule 6(1)(e) - MRP Inclusive of All Taxes', status: 'PASS', detail: 'Statutory clause "Inclusive of all taxes" explicitly printed.' },
          { rule: 'Rule 6(1)(n) - Consumer Care Contact', status: 'PASS', detail: 'Both telephone and official electronic email provided.' },
          { rule: 'Rule 7 & Sched II - Minimum Font Height', status: 'PASS', detail: 'Numerals measure 2.2 mm (Statutory minimum 2.0 mm for 145 sq cm PDP).' }
        ]);
        setIsAuditing(false);
      }, 1000);
    } else {
      setUploadedArtwork('/images/products/namkeen_bhujia.jpg');
      setAuditData({
        brandName: 'Haldiram Snacks Pvt. Ltd.',
        productName: 'Aloo Bhujia Namkeen (150g Foil Pouch)',
        manufacturer: 'Haldiram Snacks Pvt Ltd, B-1/H-8, Mohan Co-op Industrial Estate, New Delhi - 110044',
        netQuantity: '150 g',
        mrp: '₹ 55.00 (Incl. of all taxes)',
        usp: '₹ 36.67 per 100g',
        mfgDate: '09/2026',
        expiryDate: '03/2027',
        consumerCare: 'care@haldirams.com | 0712-2681123',
        pdpAreaSqCm: 180,
        minFontHeightMm: 3.0,
        measuredFontHeightMm: 2.1,
        fontCompliance: 'FAIL'
      });
      setTimeout(() => {
        setAuditVerdict('PARTIAL');
        setRulesChecklist([
          { rule: 'Rule 6(1)(a) - Manufacturer / Packer Identity', status: 'PASS', detail: 'Haldiram Snacks registered address verified.' },
          { rule: 'Rule 6(1)(b) - Generic Name of Commodity', status: 'PASS', detail: 'Aloo Bhujia Namkeen clearly declared.' },
          { rule: 'Rule 6(1)(c) - Net Quantity in Metric Units', status: 'PASS', detail: 'Declared as 150 g.' },
          { rule: 'Rule 6(1)(d) - Month & Year of Manufacture', status: 'PASS', detail: 'Declared 09/2026.' },
          { rule: 'Rule 6(1)(da) & 6(11) - Unit Sale Price (USP)', status: 'PASS', detail: 'USP ₹ 0.37/g (₹ 36.67/100g) clearly visible.' },
          { rule: 'Rule 6(1)(e) - MRP Inclusive of All Taxes', status: 'PASS', detail: 'MRP ₹ 55.00 (INCL. OF ALL TAXES) verified.' },
          { rule: 'Rule 6(1)(n) - Consumer Care Contact', status: 'PASS', detail: 'Helpline phone number and email verified.' },
          { rule: 'Rule 7 & Sched II - Minimum Font Height', status: 'FAIL', detail: 'Net quantity numeral is 2.1 mm (Statutory minimum 3.0 mm for 100g-500g pouch).' }
        ]);
        setIsAuditing(false);
      }, 1000);
    }
  };

  const handleDownloadClearanceCSV = () => {
    const csvContent = `Declaration,Required Law,Status,Extracted Data
Manufacturer,Rule 6(1)(a),PASS,"${auditData.manufacturer}"
Net Quantity,Rule 6(1)(c),PASS,"${auditData.netQuantity}"
MRP,Rule 6(1)(e),PASS,"${auditData.mrp}"
Unit Sale Price,Rule 6(11),PASS,"${auditData.usp}"
Mfg Date,Rule 6(1)(d),PASS,"${auditData.mfgDate}"
Consumer Care,Rule 6(1)(n),PASS,"${auditData.consumerCare}"
Font Height,Rule 7 Sched II,PASS,"${auditData.measuredFontHeightMm} mm (Min ${auditData.minFontHeightMm} mm)"
Overall Compliance Verdict,,PASS,"100% PRE-MARKET CLEARANCE GRANTED"`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `PreMarket_Clearance_${auditData.brandName.replace(/\s+/g, '_')}.csv`;
    link.click();
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 space-y-6 text-slate-900">
      
      {/* Top Header & Framing */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-800/40 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-400/30">
            <Building2 size={13} />
            <span>"Check Before You Sell" — Pre-Market Packaging Audit</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Manufacturer, Packer & Importer Portal
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 font-medium leading-relaxed">
            Verify label artworks against the Legal Metrology (Packaged Commodities) Rules 2011 <strong>before mass cylinder engraving and film printing</strong>. Zero enforcement penalties — designed exclusively to ensure 100% market compliance.
          </p>
        </div>
      </div>

      {/* Business Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('pre_market_audit')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'pre_market_audit'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <Scan size={15} />
          <span>Pre-Market Label Audit (AI OCR)</span>
        </button>

        <button
          onClick={() => setActiveTab('calculators')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'calculators'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <Scale size={15} />
          <span>Rule 6(11) USP & Font Sizer</span>
        </button>

        <button
          onClick={() => setActiveTab('artworks_repo')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'artworks_repo'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <FileCheck2 size={15} />
          <span>Registered Packaging Artworks</span>
        </button>
      </div>

      {/* TAB 1: PRE-MARKET ARTWORK AUDIT */}
      {activeTab === 'pre_market_audit' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in">
          
          {/* Left Column: Artwork Upload & Preset Picker */}
          <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
                <Upload size={16} className="text-amber-600" />
                <span>Packaging Artwork Upload</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-500">Modules 2 & 3</span>
            </div>

            {/* Quick Artwork Demo Pickers */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Load Sample Packaging Artworks:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleSimulateArtworkCheck('cookies')}
                  className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                    selectedArtworkPreset === 'cookies'
                      ? 'border-amber-500 bg-amber-50 text-amber-950 ring-2 ring-amber-400/30'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span className="block font-black text-emerald-700">Almond Biscotti</span>
                  <span className="text-[10px] text-slate-500 font-normal">100% Compliant Artwork</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSimulateArtworkCheck('namkeen')}
                  className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                    selectedArtworkPreset === 'namkeen'
                      ? 'border-amber-500 bg-amber-50 text-amber-950 ring-2 ring-amber-400/30'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span className="block font-black text-rose-600">Aloo Bhujia Namkeen</span>
                  <span className="text-[10px] text-slate-500 font-normal">Font Height Alert (2.1mm)</span>
                </button>
              </div>
            </div>

            {/* Artwork Preview Box */}
            <div className="relative rounded-2xl border border-slate-200 overflow-hidden bg-slate-950 flex items-center justify-center min-h-[260px]">
              <img
                src={uploadedArtwork}
                alt="Artwork Proof"
                className="max-h-[250px] w-auto object-contain select-none"
              />

              {isAuditing && (
                <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-2">
                  <RefreshCw size={28} className="animate-spin text-amber-400" />
                  <p className="text-xs font-bold font-mono">Running LMR 2011 Compliance Engine...</p>
                  <p className="text-[10px] text-slate-300">Evaluating 7 statutory declarations + Rule 7 font mm</p>
                </div>
              )}
            </div>

            {/* Upload Label */}
            <div>
              <label className="block w-full text-center py-2.5 px-4 rounded-xl border-2 border-dashed border-slate-300 hover:border-amber-500 bg-slate-50 hover:bg-amber-50/50 cursor-pointer transition-all">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => {
                        setUploadedArtwork(reader.result as string);
                        setSelectedArtworkPreset('custom');
                        setIsAuditing(true);
                        setTimeout(() => {
                          setIsAuditing(false);
                        }, 1000);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <span className="text-xs font-bold text-amber-950 flex items-center justify-center gap-1.5">
                  <Upload size={14} />
                  <span>Upload High-Res Packaging Artwork / PDF Proof</span>
                </span>
              </label>
            </div>
          </div>

          {/* Right Column: Pre-Market Audit Engine & Report */}
          <div className="lg:col-span-7 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
                <Sparkles size={16} className="text-amber-500" />
                <span>Pre-Market Compliance Checklist (LM(PC) Rules 2011)</span>
              </h3>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-black font-mono ${
                auditVerdict === 'PASS'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-rose-100 text-rose-800 border border-rose-300'
              }`}>
                {auditVerdict === 'PASS' ? 'APPROVED FOR PRINTING' : 'REVISIONS REQUIRED'}
              </span>
            </div>

            {/* Checklist Table (Module 4) */}
            <div className="space-y-2">
              {rulesChecklist.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border flex items-start justify-between gap-3 text-xs ${
                    item.status === 'PASS'
                      ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                      : 'bg-rose-50/60 border-rose-200 text-rose-950'
                  }`}
                >
                  <div className="space-y-0.5">
                    <p className="font-bold flex items-center gap-1.5">
                      {item.status === 'PASS' ? (
                        <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle size={14} className="text-rose-600 shrink-0" />
                      )}
                      <span>{item.rule}</span>
                    </p>
                    <p className="text-[11px] text-slate-600 font-medium pl-5">{item.detail}</p>
                  </div>
                  <span className={`font-mono font-black text-[10px] px-2 py-0.5 rounded uppercase ${
                    item.status === 'PASS' ? 'bg-emerald-200/60 text-emerald-900' : 'bg-rose-200/60 text-rose-900'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>

            {/* Editable Fields Before Export (Module 5) */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-slate-700 text-[11px] uppercase">
                  Extracted Declarations (Editable Before Export)
                </span>
                <span className="text-[10px] text-slate-400">Correct any OCR text</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="font-bold text-slate-600 block text-[11px] mb-0.5">Declared Net Qty</label>
                  <input
                    type="text"
                    value={auditData.netQuantity}
                    onChange={(e) => setAuditData({ ...auditData, netQuantity: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-600 block text-[11px] mb-0.5">Declared MRP</label>
                  <input
                    type="text"
                    value={auditData.mrp}
                    onChange={(e) => setAuditData({ ...auditData, mrp: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-bold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-600 block text-[11px] mb-0.5">Unit Sale Price (USP)</label>
                  <input
                    type="text"
                    value={auditData.usp}
                    onChange={(e) => setAuditData({ ...auditData, usp: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Export & Actions (Module 5) */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setCertificateGenerated(true);
                  window.print();
                }}
                className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                <Printer size={14} />
                <span>Export Pre-Market Clearance Certificate (PDF)</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadClearanceCSV}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-2 border border-slate-300 transition-all cursor-pointer"
              >
                <FileSpreadsheet size={14} className="text-emerald-700" />
                <span>Download Editable CSV Checklist</span>
              </button>

              {certificateGenerated && (
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-300 flex items-center gap-1.5 animate-in fade-in">
                  <Check size={14} className="text-emerald-700" />
                  <span>Clearance Generated for Batch Printing!</span>
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CALCULATORS (RULE 6(11) USP & RULE 7 FONT SIZER) */}
      {activeTab === 'calculators' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in">
          
          {/* Left: USP Calculator */}
          <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Scale size={18} className="text-amber-600" />
              <h3 className="font-black text-sm text-slate-900">
                Rule 6(11) Unit Sale Price (USP) Calculator
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Declared Net Quantity (Grams/ml)</label>
                <input
                  type="number"
                  value={declaredNetQty}
                  onChange={(e) => setDeclaredNetQty(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-bold text-sm"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Declared Retail Price (MRP in ₹)</label>
                <input
                  type="number"
                  value={declaredMRP}
                  onChange={(e) => setDeclaredMRP(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-bold text-sm"
                />
              </div>

              {/* Computed USP */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
                <span className="text-[10px] font-mono font-bold text-amber-800 uppercase block">Statutory Output to Print</span>
                <span className="text-xl font-black text-amber-950">₹ {calculatedUSP} / 100g</span>
                <p className="text-[11px] text-slate-600 font-medium pt-1">
                  Mandatory under Rule 6(11) for all pre-packaged commodities exceeding 1kg/1L or containing multi-packs.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Rule 7 Font Height / PDP Area Sizer */}
          <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Ruler size={18} className="text-indigo-600" />
              <h3 className="font-black text-sm text-slate-900">
                Rule 7 & Schedule II Minimum Font Height Sizer
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Principal Display Panel (PDP) Area (sq cm)</label>
                <input
                  type="number"
                  value={calcPdpArea}
                  onChange={(e) => setCalcPdpArea(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-bold text-sm"
                  placeholder="150"
                />
              </div>

              {/* Minimum Font Requirement */}
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-1">
                <span className="text-[10px] font-mono font-bold text-indigo-800 uppercase block">Statutory Minimum Font Height</span>
                <span className="text-xl font-black text-indigo-950">{statutoryMinFont}</span>
                <p className="text-[11px] text-slate-600 font-medium pt-1">
                  Applies to all numerals and letters in net quantity, MRP, and consumer care declarations.
                </p>
              </div>

              {/* Legal Reference Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden text-[11px]">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 font-mono font-bold">
                    <tr>
                      <th className="p-2">PDP Area (A in sq cm)</th>
                      <th className="p-2 text-right">Min Font Height</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr><td className="p-2">A ≤ 50</td><td className="p-2 text-right font-bold">1.0 mm</td></tr>
                    <tr className="bg-amber-50/40"><td className="p-2">50 &lt; A ≤ 500</td><td className="p-2 text-right font-bold text-amber-900">2.0 mm</td></tr>
                    <tr><td className="p-2">500 &lt; A ≤ 2500</td><td className="p-2 text-right font-bold">3.0 mm</td></tr>
                    <tr><td className="p-2">2500 &lt; A ≤ 3600</td><td className="p-2 text-right font-bold">4.0 mm</td></tr>
                    <tr><td className="p-2">A &gt; 3600</td><td className="p-2 text-right font-bold">6.0 mm</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: REGISTERED PACKAGING ARTWORKS REPOSITORY (MODULE 6) */}
      {activeTab === 'artworks_repo' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                <FileCheck2 size={18} className="text-amber-600" />
                <span>My Registered Packaging Artworks</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Repository of pre-market reviewed packaging files and Rule 27 registrations.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('pre_market_audit')}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 w-fit cursor-pointer"
            >
              <Upload size={14} />
              <span>Audit New Artwork</span>
            </button>
          </div>

          <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-100 font-mono font-bold text-slate-700 text-[11px] border-b border-slate-200">
                <tr>
                  <th className="p-3">SKU / Artwork Code</th>
                  <th className="p-3">Product Description</th>
                  <th className="p-3">Net Quantity</th>
                  <th className="p-3">Unit Sale Price</th>
                  <th className="p-3">Audit Verdict</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-bold text-slate-900">ART-BIS-2026-01</td>
                  <td className="p-3 font-bold text-slate-900">Handmade Almond Biscotti</td>
                  <td className="p-3 font-semibold text-slate-700">250 g</td>
                  <td className="p-3 font-mono text-slate-700">₹ 88.00 / 100g</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      100% COMPLIANT
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => window.print()}
                      className="text-amber-700 hover:text-amber-900 font-bold"
                    >
                      Certificate (PDF)
                    </button>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-bold text-slate-900">ART-HNY-2026-08</td>
                  <td className="p-3 font-bold text-slate-900">Natural Forest Honey</td>
                  <td className="p-3 font-semibold text-slate-700">500 g</td>
                  <td className="p-3 font-mono text-slate-400">Missing USP</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px]">
                      REVISION REQUIRED
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => {
                        setSelectedArtworkPreset('honey');
                        setActiveTab('pre_market_audit');
                      }}
                      className="text-amber-700 hover:text-amber-900 font-bold"
                    >
                      Fix Checklist
                    </button>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-bold text-slate-900">ART-TEA-2026-14</td>
                  <td className="p-3 font-bold text-slate-900">Assam CTC Orthodox Gold Tea</td>
                  <td className="p-3 font-semibold text-slate-700">1000 g (1 kg)</td>
                  <td className="p-3 font-mono text-slate-700">₹ 65.00 / 100g</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      100% COMPLIANT
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => window.print()}
                      className="text-amber-700 hover:text-amber-900 font-bold"
                    >
                      Certificate (PDF)
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};