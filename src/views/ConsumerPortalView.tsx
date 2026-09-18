import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ConsumerGrievanceFormView } from './ConsumerGrievanceFormView';
import {
  User, ShieldAlert, Camera, Upload, CheckCircle2, AlertTriangle,
  Scale, FileText, Search, Clock, ArrowRight, HelpCircle, PhoneCall,
  Sparkles, ExternalLink, RefreshCw, XCircle
} from 'lucide-react';

export const ConsumerPortalView: React.FC = () => {
  const { setCurrentTab } = useApp();

  // Active Citizen Tab
  const [activeTab, setActiveTab] = useState<'scan' | 'overcharge' | 'form' | 'track'>('scan');

  // Quick Scan State (Modules 2 & 3 Simplified)
  const [selectedSample, setSelectedSample] = useState<'soda' | 'chips' | 'custom'>('soda');
  const [uploadedImage, setUploadedImage] = useState<string | null>('https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<{
    productName: string;
    declaredMRP: number;
    chargedPrice: number;
    usp: string;
    hasConsumerCare: boolean;
    hasMfgDate: boolean;
    hasTaxClause: boolean;
    coolingChargeAttempted: boolean;
    verdict: 'VIOLATION_DETECTED' | 'FAIR_COMPLIANT';
    issueDescription: string;
  }>({
    productName: 'Sparkling Lemonade Can (330ml)',
    declaredMRP: 40,
    chargedPrice: 55,
    usp: '₹ 12.12 per 100ml',
    hasConsumerCare: true,
    hasMfgDate: true,
    hasTaxClause: true,
    coolingChargeAttempted: true,
    verdict: 'VIOLATION_DETECTED',
    issueDescription: 'Vendor overcharged ₹15 above MRP citing "refrigeration / cooling charges". Under Section 36 of the Legal Metrology Act, 2009, this is strictly illegal.'
  });

  // Overcharge Calculator State
  const [calcMRP, setCalcMRP] = useState<string>('40');
  const [calcCharged, setCalcCharged] = useState<string>('55');
  const [calcShop, setCalcShop] = useState<string>('Transit Station Food Kiosk #4');

  const numMRP = parseFloat(calcMRP) || 0;
  const numCharged = parseFloat(calcCharged) || 0;
  const overchargeAmount = Math.max(0, numCharged - numMRP);

  // Tracking Query State
  const [searchTrackingId, setSearchTrackingId] = useState<string>('LMPC-2026-089');
  const [trackedRecord] = useState({
    id: 'LMPC-2026-089',
    product: 'Sparkling Lemonade (600ml Bottle)',
    vendor: 'Highway Express Retail, Shop #12',
    date: '14 Sep 2026',
    status: 'Notice Served under Section 36',
    officer: 'Vikram Sengupta (Legal Metrology Officer, Zone 2)',
    timeline: [
      { step: '1. Grievance Registered', date: '14 Sep 2026, 11:20 AM', done: true, desc: 'Citizen submitted bill and photo evidence of ₹15 overcharge.' },
      { step: '2. Optical AI Verification', date: '14 Sep 2026, 11:22 AM', done: true, desc: 'Yatarth AI verified declared MRP is ₹40; billed receipt shows ₹55.' },
      { step: '3. Legal Notice Issued', date: '15 Sep 2026, 03:40 PM', done: true, desc: 'Formal inspection order and summons served to vendor.' },
      { step: '4. Compounding Penalty / Redressal', date: 'In Progress (Expected 20 Sep 2026)', done: false, desc: 'Statutory compounding fine of ₹25,000 being levied under Section 36.' }
    ]
  });

  const handleSimulateScan = (type: 'soda' | 'chips') => {
    setIsScanning(true);
    setSelectedSample(type);
    if (type === 'soda') {
      setUploadedImage('https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80');
      setTimeout(() => {
        setScanResult({
          productName: 'Sparkling Lemonade Can (330ml)',
          declaredMRP: 40,
          chargedPrice: 55,
          usp: '₹ 12.12 per 100ml',
          hasConsumerCare: true,
          hasMfgDate: true,
          hasTaxClause: true,
          coolingChargeAttempted: true,
          verdict: 'VIOLATION_DETECTED',
          issueDescription: 'Vendor overcharged ₹15 above MRP citing "refrigeration / cooling charges". Under Section 36 of the Legal Metrology Act, 2009, this is strictly illegal.'
        });
        setIsScanning(false);
      }, 1000);
    } else {
      setUploadedImage('https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&auto=format&fit=crop&q=80');
      setTimeout(() => {
        setScanResult({
          productName: 'Crunchy Salted Potato Chips (50g)',
          declaredMRP: 20,
          chargedPrice: 20,
          usp: '₹ 40.00 per 100g',
          hasConsumerCare: true,
          hasMfgDate: true,
          hasTaxClause: true,
          coolingChargeAttempted: false,
          verdict: 'FAIR_COMPLIANT',
          issueDescription: 'Product complies with MRP declarations. Price charged matches statutory label. Unit Sale Price is properly declared under Rule 6(11).'
        });
        setIsScanning(false);
      }, 1000);
    }
  };

  const handleCustomFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result as string);
        setSelectedSample('custom');
        setIsScanning(true);
        setTimeout(() => {
          setScanResult({
            productName: file.name.replace(/\.[^/.]+$/, ''),
            declaredMRP: 150,
            chargedPrice: 175,
            usp: '₹ 75.00 per 100g',
            hasConsumerCare: true,
            hasMfgDate: false,
            hasTaxClause: false,
            coolingChargeAttempted: false,
            verdict: 'VIOLATION_DETECTED',
            issueDescription: 'Mandatory declaration "Inclusive of all taxes" is missing from MRP label. Date of manufacture is obscured or non-compliant under Rule 6(1)(d).'
          });
          setIsScanning(false);
        }, 1200);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 space-y-6 text-slate-900">
      
      {/* Top Citizen Header Banner */}
      <div className="bg-gradient-to-r from-sky-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-sky-800/40 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 font-mono text-xs font-bold border border-sky-400/30">
            <User size={13} />
            <span>Citizen Protection & Legal Metrology Cell</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Consumer Rights & Packaging Transparency
          </h1>
          <p className="text-xs sm:text-sm text-sky-100 font-medium leading-relaxed">
            Verify retail prices, check whether a retailer can charge extra for cooling, detect missing statutory declarations, and file legally actionable grievances under the Legal Metrology Act, 2009.
          </p>
        </div>
      </div>

      {/* Citizen Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('scan')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'scan'
              ? 'bg-sky-600 text-white shadow-md'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <Camera size={15} />
          <span>Quick Label & MRP Check</span>
        </button>

        <button
          onClick={() => setActiveTab('overcharge')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'overcharge'
              ? 'bg-sky-600 text-white shadow-md'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <Scale size={15} />
          <span>Overcharging Calculator</span>
        </button>

        <button
          onClick={() => setActiveTab('form')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'form'
              ? 'bg-sky-600 text-white shadow-md'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <FileText size={15} />
          <span>File Official Grievance</span>
        </button>

        <button
          onClick={() => setActiveTab('track')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'track'
              ? 'bg-sky-600 text-white shadow-md'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <Search size={15} />
          <span>Track Grievance Status</span>
        </button>
      </div>

      {/* TAB 1: QUICK CITIZEN SCAN & CHECK */}
      {activeTab === 'scan' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in">
          
          {/* Left Column: Image Upload & Sample Selection */}
          <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
                <Camera size={16} className="text-sky-600" />
                <span>Upload Product Label / Bill</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-500">Modules 2 & 3</span>
            </div>

            {/* Quick Demo Pickers */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Try Demo Product Samples:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleSimulateScan('soda')}
                  className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                    selectedSample === 'soda'
                      ? 'border-sky-500 bg-sky-50 text-sky-950 ring-2 ring-sky-400/30'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span className="block font-black text-rose-600">Soda Can (Violating)</span>
                  <span className="text-[10px] text-slate-500 font-normal">Overcharged by ₹15</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSimulateScan('chips')}
                  className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                    selectedSample === 'chips'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-400/30'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span className="block font-black text-emerald-700">Chips (Compliant)</span>
                  <span className="text-[10px] text-slate-500 font-normal">Fair MRP ₹20</span>
                </button>
              </div>
            </div>

            {/* Photo Preview */}
            <div className="relative rounded-2xl border border-slate-200 overflow-hidden bg-slate-950 flex items-center justify-center min-h-[260px]">
              {uploadedImage ? (
                <img
                  src={uploadedImage}
                  alt="Product"
                  className="max-h-[250px] w-auto object-contain select-none"
                />
              ) : (
                <div className="text-center p-4 text-slate-400">
                  <Upload size={32} className="mx-auto mb-2 text-slate-500" />
                  <p className="text-xs font-bold">No image uploaded</p>
                </div>
              )}

              {isScanning && (
                <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-2">
                  <RefreshCw size={28} className="animate-spin text-sky-400" />
                  <p className="text-xs font-bold font-mono">Yatarth AI Optical OCR Analyzing...</p>
                  <p className="text-[10px] text-slate-300">Detecting MRP, taxes & statutory declarations</p>
                </div>
              )}
            </div>

            {/* Upload Custom Image Button */}
            <div>
              <label className="block w-full text-center py-2.5 px-4 rounded-xl border-2 border-dashed border-slate-300 hover:border-sky-500 bg-slate-50 hover:bg-sky-50/50 cursor-pointer transition-all">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleCustomFileUpload}
                />
                <span className="text-xs font-bold text-sky-900 flex items-center justify-center gap-1.5">
                  <Upload size={14} />
                  <span>Upload Label Photo / Cash Receipt</span>
                </span>
              </label>
            </div>
          </div>

          {/* Right Column: AI Extraction & Citizen Verdict */}
          <div className="lg:col-span-7 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
                <Sparkles size={16} className="text-amber-500" />
                <span>AI Optical Extraction & Compliance Result</span>
              </h3>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-black font-mono ${
                scanResult.verdict === 'VIOLATION_DETECTED'
                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              }`}>
                {scanResult.verdict === 'VIOLATION_DETECTED' ? 'VIOLATION FOUND' : 'COMPLIANT'}
              </span>
            </div>

            {/* Key Comparison Card */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-mono font-bold text-slate-500 block">Declared MRP</span>
                <span className="text-lg font-black text-slate-900">₹ {scanResult.declaredMRP.toFixed(2)}</span>
                <span className="text-[10px] text-slate-400 block font-medium">Incl. of all taxes</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-mono font-bold text-slate-500 block">Charged Price</span>
                <span className={`text-lg font-black ${
                  scanResult.chargedPrice > scanResult.declaredMRP ? 'text-rose-600' : 'text-emerald-700'
                }`}>
                  ₹ {scanResult.chargedPrice.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-400 block font-medium">
                  {scanResult.chargedPrice > scanResult.declaredMRP
                    ? `+₹${scanResult.chargedPrice - scanResult.declaredMRP} illegal excess`
                    : 'Exact MRP match'}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
                <span className="text-[10px] uppercase font-mono font-bold text-slate-500 block">Unit Sale Price</span>
                <span className="text-xs font-black text-slate-900 block mt-1">{scanResult.usp}</span>
                <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">Rule 6(11) present</span>
              </div>
            </div>

            {/* Verdict Explanation Box */}
            <div className={`p-4 rounded-2xl border ${
              scanResult.verdict === 'VIOLATION_DETECTED'
                ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
            }`}>
              <div className="flex items-start gap-3">
                {scanResult.verdict === 'VIOLATION_DETECTED' ? (
                  <AlertTriangle size={20} className="text-rose-600 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 size={20} className="text-emerald-600 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <p className="font-black text-xs">
                    {scanResult.verdict === 'VIOLATION_DETECTED'
                      ? 'Statutory Offence Identified under Section 36'
                      : 'Packaging & Retail Pricing Compliant'}
                  </p>
                  <p className="text-xs leading-relaxed font-medium">
                    {scanResult.issueDescription}
                  </p>
                </div>
              </div>
            </div>

            {/* Declarations Checklist Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <div className="bg-slate-100 p-2.5 font-mono font-bold text-slate-800 text-[11px]">
                Statutory Packaging Declarations (LMR 2011)
              </div>
              <div className="divide-y divide-slate-100">
                <div className="p-2.5 flex items-center justify-between">
                  <span className="font-semibold text-slate-700">MRP Inclusive of All Taxes (Rule 6(1)(e))</span>
                  {scanResult.hasTaxClause ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1"><CheckCircle2 size={13} /> Present</span>
                  ) : (
                    <span className="text-rose-600 font-bold flex items-center gap-1"><XCircle size={13} /> Missing</span>
                  )}
                </div>
                <div className="p-2.5 flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Date of Manufacture / Packing (Rule 6(1)(d))</span>
                  {scanResult.hasMfgDate ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1"><CheckCircle2 size={13} /> Declared</span>
                  ) : (
                    <span className="text-rose-600 font-bold flex items-center gap-1"><XCircle size={13} /> Missing</span>
                  )}
                </div>
                <div className="p-2.5 flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Customer Redressal Contact (Rule 6(1)(n))</span>
                  {scanResult.hasConsumerCare ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1"><CheckCircle2 size={13} /> Complete</span>
                  ) : (
                    <span className="text-rose-600 font-bold flex items-center gap-1"><XCircle size={13} /> Truncated</span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {scanResult.verdict === 'VIOLATION_DETECTED' && (
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('form')}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
                >
                  <ShieldAlert size={15} />
                  <span>File Grievance Against This Retailer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('overcharge')}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 border border-slate-300 transition-all"
                >
                  <Scale size={14} />
                  <span>Calculate Legal Penalty & Overcharge</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: OVERCHARGING CALCULATOR */}
      {activeTab === 'overcharge' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm max-w-3xl mx-auto space-y-6 animate-in fade-in">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Scale size={20} className="text-sky-600" />
              <span>Overcharging Above MRP Legal Calculator</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Verify if cooling charges, handling fees, or transit markups violate Section 36 of the Legal Metrology Act, 2009.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Declared Maximum Retail Price (MRP)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  value={calcMRP}
                  onChange={(e) => setCalcMRP(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 font-bold text-sm bg-slate-50"
                  placeholder="40"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Amount Actually Charged by Vendor</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  value={calcCharged}
                  onChange={(e) => setCalcCharged(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 font-bold text-sm bg-slate-50"
                  placeholder="55"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">Store / Establishment Name & Location</label>
              <input
                type="text"
                value={calcShop}
                onChange={(e) => setCalcShop(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium text-xs bg-slate-50"
                placeholder="e.g. Airport Plaza Store #2, Pune Station"
              />
            </div>
          </div>

          {/* Calculator Output */}
          <div className={`p-5 rounded-2xl border ${
            overchargeAmount > 0
              ? 'bg-rose-50 border-rose-200 text-rose-950'
              : 'bg-emerald-50 border-emerald-200 text-emerald-950'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider block text-slate-600">
                  Calculated Illegal Excess Amount
                </span>
                <span className={`text-2xl font-black ${overchargeAmount > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                  {overchargeAmount > 0 ? `+₹ ${overchargeAmount.toFixed(2)} Excess Charged` : '₹ 0.00 (No Overcharging)'}
                </span>
              </div>

              {overchargeAmount > 0 && (
                <div className="text-right">
                  <span className="text-[10px] font-mono text-rose-700 font-bold uppercase block">Statutory Fine on Vendor</span>
                  <span className="text-sm font-black text-rose-800">Up to ₹ 25,000</span>
                  <span className="text-[10px] text-slate-500 block">Section 36, LM Act 2009</span>
                </div>
              )}
            </div>

            <div className="mt-3 pt-3 border-t border-rose-200/60 text-xs leading-relaxed font-medium">
              {overchargeAmount > 0 ? (
                <p>
                  <strong>Legal Clause:</strong> Under Section 36 of the Legal Metrology Act, 2009, whoever manufactures, packs, distributes or sells any pre-packaged commodity at a price higher than the declared retail sale price is punishable with a compounding fine of up to ₹25,000 for the first offence, and up to ₹50,000 or imprisonment for subsequent offences.
                </p>
              ) : (
                <p>
                  The price charged matches or is below the declared retail price. Retailers are permitted to offer discounts below MRP, but can never charge above it.
                </p>
              )}
            </div>
          </div>

          {overchargeAmount > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab('form')}
              className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <FileText size={15} />
              <span>Proceed to File Grievance with this Calculated Evidence</span>
            </button>
          )}
        </div>
      )}

      {/* TAB 3: FILE GRIEVANCE FORM (ConsumerGrievanceFormView) */}
      {activeTab === 'form' && (
        <div className="animate-in fade-in">
          <ConsumerGrievanceFormView
            onBackToHome={() => setActiveTab('scan')}
            onViewTracking={() => setActiveTab('track')}
          />
        </div>
      )}

      {/* TAB 4: TRACK GRIEVANCE STATUS */}
      {activeTab === 'track' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm max-w-3xl mx-auto space-y-6 animate-in fade-in">
          <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Search size={20} className="text-sky-600" />
                <span>Track Your Filed Grievance</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Real-time legal inspection & compounding notice timeline
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={searchTrackingId}
                onChange={(e) => setSearchTrackingId(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-300 font-mono text-xs font-bold w-40"
                placeholder="LMPC-2026-..."
              />
              <button
                type="button"
                className="px-3 py-1.5 rounded-xl bg-sky-600 text-white font-bold text-xs"
              >
                Track
              </button>
            </div>
          </div>

          {/* Grievance Summary Card */}
          <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-sky-900">{trackedRecord.id}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[11px]">
                {trackedRecord.status}
              </span>
            </div>
            <p className="font-black text-slate-900 text-sm">{trackedRecord.product}</p>
            <p className="text-slate-600 font-medium">Against: {trackedRecord.vendor} • Lodged: {trackedRecord.date}</p>
            <p className="text-slate-700 font-bold">Investigating Officer: {trackedRecord.officer}</p>
          </div>

          {/* Timeline */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-mono font-black text-slate-800 uppercase tracking-wider">
              Enforcement & Resolution Stages
            </h4>

            <div className="relative border-l-2 border-slate-200 ml-4 pl-6 space-y-6">
              {trackedRecord.timeline.map((item, idx) => (
                <div key={idx} className="relative">
                  <span className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${
                    item.done ? 'bg-emerald-600 ring-2 ring-emerald-200' : 'bg-amber-500 ring-2 ring-amber-200 animate-pulse'
                  }`} />
                  <div className="space-y-0.5 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900">{item.step}</span>
                      <span className="text-[11px] font-mono text-slate-500">{item.date}</span>
                    </div>
                    <p className="text-slate-600 font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
