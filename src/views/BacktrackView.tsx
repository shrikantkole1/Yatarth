import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Network, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  Store, 
  Layers, 
  Truck, 
  Factory, 
  Wheat, 
  ShieldAlert, 
  Download, 
  ArrowRight, 
  MapPin, 
  Sparkles, 
  Ban, 
  ExternalLink, 
  QrCode, 
  Building2, 
  Map, 
  Bell, 
  Send, 
  Check, 
  Ruler, 
  ShieldCheck, 
  FileCheck2, 
  Clock,
  Phone,
  Mail,
  Copy,
  Radio,
  Users,
  RefreshCw,
  FolderOpen,
  Navigation,
  Compass,
  Eye,
  Shield,
  Map as MapIcon
} from 'lucide-react';
import { BatchTraceInfo, AffectedStoreLocation } from '../types';
import { PuneRegionMap } from '../components/PuneRegionMap';

export const BacktrackView: React.FC = () => {
  const { 
    products, 
    selectedTraceBatchId, 
    setSelectedTraceBatchId, 
    updateBatchRecallStatus, 
    setCurrentTab, 
    setSelectedProductId, 
    setIsCopilotOpen,
    resetToPuneMockData
  } = useApp();

  const casePanelRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNode, setSelectedNode] = useState<'retailer' | 'wholesaler' | 'distributor' | 'manufacturer' | 'suppliers'>('retailer');
  const [activeTab, setActiveTab] = useState<'case_dossier' | 'timeline' | 'reverse_stores' | 'regional_area' | 'escalation' | 'suppliers' | 'notice'>('case_dossier');
  const [quarantinedStoreNames, setQuarantinedStoreNames] = useState<string[]>([]);
  const [escalationStatus, setEscalationStatus] = useState<'DISPATCHED' | 'ACKNOWLEDGED' | 'ENFORCEMENT_TEAM_DEPLOYED'>('ENFORCEMENT_TEAM_DEPLOYED');
  const [alertSentToast, setAlertSentToast] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [reverseStoresViewMode, setReverseStoresViewMode] = useState<'map' | 'table'>('map');
  const [selectedStoreForDossier, setSelectedStoreForDossier] = useState<AffectedStoreLocation | null>(null);

  // Find active product matching the selected batch ID (defaults to Lay's chips if not found)
  const currentProduct = products.find(
    (p) => p.batchTrace?.batchId === selectedTraceBatchId || p.batchNumber === selectedTraceBatchId
  ) || products.find((p) => p.id === 'prod-lays') || products[0];

  const trace: BatchTraceInfo | undefined = currentProduct?.batchTrace;

  // Search filtered products that have batch traces
  const traceableProducts = products.filter(
    (p) => p.batchTrace !== undefined
  );

  const filteredTraceables = traceableProducts.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.batchNumber.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      (p.batchTrace?.batchId && p.batchTrace.batchId.toLowerCase().includes(q)) ||
      (p.batchTrace?.mfgLicenseNumber && p.batchTrace.mfgLicenseNumber.toLowerCase().includes(q))
    );
  });

  const handleSelectBatch = (batchId: string, caseName?: string) => {
    setSelectedTraceBatchId(batchId);
    setActiveTab('case_dossier');
    setSelectedStoreForDossier(null);
    setAlertSentToast(`Case File Docket opened for ${caseName || batchId}. Full intelligence & Pune surveillance maps loaded.`);
    setTimeout(() => setAlertSentToast(null), 4000);
    setTimeout(() => {
      casePanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);
  };

  const handleTriggerRecall = (batchId: string) => {
    updateBatchRecallStatus(batchId, 'quarantine_ordered');
  };

  const isStoreQuarantined = (store: AffectedStoreLocation) => {
    return (
      store.status === 'quarantined' || 
      quarantinedStoreNames.includes(store.storeName) || 
      trace?.recallStatus === 'quarantine_ordered'
    );
  };

  const handleQuarantineSingleStore = (storeName: string) => {
    setQuarantinedStoreNames(prev => [...new Set([...prev, storeName])]);
    setAlertSentToast(`Store quarantine order issued for ${storeName}`);
    setTimeout(() => setAlertSentToast(null), 3500);
  };

  const handleQuarantineAllStores = () => {
    if (!trace) return;
    const allNames = trace.reverseStores.map(s => s.storeName);
    setQuarantinedStoreNames(allNames);
    updateBatchRecallStatus(trace.batchId, 'quarantine_ordered');
    setAlertSentToast(`Critical quarantine order issued to all ${allNames.length} mapped retail stores across the zone!`);
    setTimeout(() => setAlertSentToast(null), 4000);
  };

  const handleCopyText = (text: string, idKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(idKey);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleBroadcastZonalAdvisory = () => {
    setAlertSentToast(`Zonal Containment Advisory broadcasted to 18 Field Enforcement Officers across ${trace?.regionalAreaImpact.regionName || 'Zone'}`);
    setTimeout(() => setAlertSentToast(null), 4000);
  };

  const handleResendEscalation = () => {
    setAlertSentToast(`Priority SMS & Email re-dispatched to Controller of Legal Metrology (${trace?.smartEscalation.recipientName})`);
    setTimeout(() => setAlertSentToast(null), 4000);
  };

  const handleDeployTeam = () => {
    setEscalationStatus('ENFORCEMENT_TEAM_DEPLOYED');
    setAlertSentToast(`Rapid Seizure Enforcement Squad dispatched to ${trace?.retailer.storeName} and regional wholesale depot.`);
    setTimeout(() => setAlertSentToast(null), 4000);
  };

  const handleDownloadNotice = () => {
    if (!trace) return;
    const noticeContent = 
`================================================================================
OFFICIAL LEGAL METROLOGY & CONSUMER SAFETY SEIZURE DIRECTIVE
CENTRAL ENFORCEMENT DIRECTORATE - PACKAGED COMMODITIES MONITORING
================================================================================
NOTICE NO: DIR-SEIZE-2026-${Math.floor(1000 + Math.random() * 9000)}
DATE OF ISSUANCE: ${new Date().toLocaleDateString('en-GB')}
ENFORCEMENT OFFICER: Suresh Kumar (Field Enforcement Inspector)
ZONAL JURISDICTION: Karnataka South Ward 82 / Central Metropolitan

1. TARGET PRODUCT & BATCH DETAILS:
   - Product Name: ${currentProduct.name}
   - Brand Owner: ${currentProduct.brand}
   - Batch ID: ${trace.batchId}
   - Manufacturing Date: ${trace.mfgDate}
   - Expiry / Use-By Date: ${trace.expDate} [${trace.isExpired ? 'CRITICAL: EXPIRED ON SHELF' : 'VALID'}]
   - Package Size / Net Qty: ${currentProduct.packSize}
   - Mfg License (State LM / FSSAI): ${trace.mfgLicenseNumber} / ${trace.manufacturer.fssaiLicense}

2. FOUND RETAIL LOCATION:
   - Store Name: ${trace.retailer.storeName}
   - Store Address: ${trace.retailer.storeAddress}
   - GPS Coordinates: ${trace.retailer.inspectorCoords}
   - Detected Shelf Units: ${trace.retailer.unitsOnShelf} units

3. UPSTREAM SUPPLY CHAIN TRACEABILITY:
   - Regional Wholesaler: ${trace.wholesaler.name} (${trace.wholesaler.depotLocation})
   - C&F / Distributor: ${trace.distributor.name} (Dispatch Inv: ${trace.distributor.dispatchInvoiceNo})
   - Manufacturing Plant: ${trace.manufacturer.entityName} (${trace.manufacturer.plantLocation})
   - Plant Supervisor: ${trace.manufacturer.plantManager}
   - Production Line: ${trace.manufacturer.productionLine}

4. UPSTREAM RAW MATERIAL & PACKAGING SUPPLIERS TRACE:
${trace.rawSuppliers.map((s, idx) => `   [${idx + 1}] ${s.material}: ${s.supplierName} (${s.originLocation}) | Lot: ${s.lotNumber} | Certificate: ${s.qualityCertificateNo}`).join('\n')}

5. MANDATED ENFORCEMENT ACTIONS:
   [!] IMMEDIATE SEIZURE OF ALL UNSOLD UNITS FROM RETAIL SHELF
   [!] QUARANTINE OF WAREHOUSE LOT AT WHOLESALE DEPOT (${trace.wholesaler.name})
   [!] FORMAL SHOW-CAUSE NOTICE SERVED TO MANUFACTURER (${trace.manufacturer.entityName})

ISSUED UNDER SECTION 36 / 39 LEGAL METROLOGY ACT, 2009.
================================================================================`;

    const blob = new Blob([noticeContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BATCH-RECALL-NOTICE-${trace.batchId}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in text-slate-900">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-300">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900">Supply Chain & Batch Backtracking</h1>
            <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded bg-blue-100 text-blue-900 border border-blue-300 flex items-center gap-1">
              <Network size={13} /> TRACEABILITY ENGINE
            </span>
          </div>
          <p className="text-xs text-black font-medium mt-1">
            Backtrack expired or non-compliant packaged goods from the retail store shelf back through the wholesaler, distributor, manufacturing plant, and upstream ingredient suppliers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              resetToPuneMockData();
              setAlertSentToast('Pune Surveillance Mock Data (MH-12 Circle) successfully reloaded!');
              setTimeout(() => setAlertSentToast(null), 3500);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 font-bold text-xs hover:bg-amber-100 transition-colors shadow-2xs cursor-pointer"
            title="Reload all Pune stores and violation data"
          >
            <RefreshCw size={14} className="text-amber-700" />
            <span>Reload Pune Surveillance Data</span>
          </button>
          <button
            onClick={() => setIsCopilotOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 border border-blue-300 text-blue-950 font-bold text-xs hover:bg-blue-100 transition-colors shadow-2xs"
          >
            <Sparkles size={14} className="text-blue-700" />
            <span>Ask Yatarth AI to Trace</span>
          </button>
          <button
            onClick={handleDownloadNotice}
            disabled={!trace}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
          >
            <Download size={14} />
            <span>Export Seizure Dossier</span>
          </button>
        </div>
      </div>

      {/* Dynamic Action Notification Toast */}
      {alertSentToast && (
        <div className="p-3.5 rounded-xl bg-blue-950 text-white border-2 border-blue-400 text-xs font-black shadow-lg flex items-center justify-between gap-3 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <Bell size={16} className="text-yellow-400 flex-shrink-0 animate-bounce" />
            <span>{alertSentToast}</span>
          </div>
          <button 
            onClick={() => setAlertSentToast(null)}
            className="text-blue-300 hover:text-white px-2 py-0.5 rounded text-xs cursor-pointer font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* End-to-End Enforcement 6-Step Flow */}
      <div className="rounded-2xl border-2 border-blue-400 bg-linear-to-b from-blue-50/70 via-white to-slate-50 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-200/80 pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded text-[10px] font-black uppercase font-mono bg-blue-700 text-white tracking-wider">
              Enforcement Pipeline
            </span>
            <span className="text-xs text-blue-950 font-black">
              6-Stage Legal Metrology Containment Architecture
            </span>
          </div>
          <span className="text-[11px] text-blue-900 font-bold flex items-center gap-1">
            <span>Scan Product</span>
            <span className="text-blue-400">→</span>
            <span>Batch & Dates</span>
            <span className="text-blue-400">→</span>
            <span>Upstream Plant</span>
            <span className="text-blue-400">→</span>
            <span>Reverse Stores</span>
            <span className="text-blue-400">→</span>
            <span>Pune Circle MH-12</span>
            <span className="text-blue-400">→</span>
            <span>Seizure Escalation</span>
          </span>
        </div>

        {/* 6 Step Interactive Horizontal Stepper */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {/* Step 1: Product */}
          <button 
            type="button"
            onClick={() => { 
              setActiveTab('case_dossier'); 
              setSelectedNode('retailer'); 
              casePanelRef.current?.scrollIntoView({ behavior: 'smooth' }); 
            }}
            className={`p-3 rounded-xl bg-white border text-center space-y-1 transition-all cursor-pointer ${
              activeTab === 'case_dossier' && selectedNode === 'retailer' 
                ? 'border-cyan-500 ring-2 ring-cyan-400 shadow-md bg-cyan-50/20' 
                : 'border-blue-200 shadow-2xs hover:border-cyan-400 hover:bg-cyan-50/30'
            }`}
          >
            <div className="w-10 h-10 mx-auto rounded-xl bg-cyan-100 border border-cyan-300 text-cyan-800 flex items-center justify-center font-black">
              <QrCode size={18} />
            </div>
            <div className="text-[11px] font-black text-black">
              <span className="text-cyan-700">1.</span> Product
            </div>
            <p className="text-[10px] text-slate-600 font-medium leading-tight">
              Scan product barcode or QR code
            </p>
            <div className="pt-1 text-[9px] font-mono font-bold text-slate-800 bg-slate-100 rounded">
              {trace?.barcodeQr || '8901491101824'}
            </div>
          </button>

          {/* Step 2: Batch / Lot */}
          <button 
            type="button"
            onClick={() => { 
              setActiveTab('case_dossier'); 
              casePanelRef.current?.scrollIntoView({ behavior: 'smooth' }); 
            }}
            className={`p-3 rounded-xl bg-white border text-center space-y-1 transition-all cursor-pointer ${
              activeTab === 'case_dossier'
                ? 'border-emerald-500 ring-2 ring-emerald-400 shadow-md bg-emerald-50/20' 
                : 'border-blue-200 shadow-2xs hover:border-emerald-400 hover:bg-emerald-50/30'
            }`}
          >
            <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center font-black">
              <FileCheck2 size={18} />
            </div>
            <div className="text-[11px] font-black text-black">
              <span className="text-emerald-700">2.</span> Batch / Lot
            </div>
            <p className="text-[10px] text-slate-600 font-medium leading-tight">
              Trace batch details & packaging date
            </p>
            <div className="pt-1 text-[9px] font-mono font-black text-blue-900 bg-blue-50 rounded truncate">
              {trace?.batchId || 'LAY-EXP-2025-09'}
            </div>
          </button>

          {/* Step 3: Supplier */}
          <button 
            type="button"
            onClick={() => { 
              setActiveTab('timeline'); 
              setSelectedNode('manufacturer'); 
              casePanelRef.current?.scrollIntoView({ behavior: 'smooth' }); 
            }}
            className={`p-3 rounded-xl bg-white border text-center space-y-1 transition-all cursor-pointer ${
              activeTab === 'timeline' && selectedNode === 'manufacturer'
                ? 'border-blue-500 ring-2 ring-blue-400 shadow-md bg-blue-50/20' 
                : 'border-blue-200 shadow-2xs hover:border-blue-400 hover:bg-blue-50/30'
            }`}
          >
            <div className="w-10 h-10 mx-auto rounded-xl bg-blue-100 border border-blue-300 text-blue-800 flex items-center justify-center font-black">
              <Factory size={18} />
            </div>
            <div className="text-[11px] font-black text-black">
              <span className="text-blue-700">3.</span> Supplier
            </div>
            <p className="text-[10px] text-slate-600 font-medium leading-tight">
              Identify manufacturer plant & raw sources
            </p>
            <div className="pt-1 text-[9px] font-bold text-slate-800 truncate bg-slate-100 rounded px-1">
              {trace?.manufacturer.entityName.split(' ')[0] || 'PepsiCo'}
            </div>
          </button>

          {/* Step 4: Stores / Locations */}
          <button 
            type="button"
            onClick={() => { 
              setActiveTab('case_dossier'); 
              casePanelRef.current?.scrollIntoView({ behavior: 'smooth' }); 
            }}
            className={`p-3 rounded-xl bg-white border text-center space-y-1 transition-all cursor-pointer ${
              activeTab === 'case_dossier' || activeTab === 'reverse_stores'
                ? 'border-purple-500 ring-2 ring-purple-400 shadow-md bg-purple-50/20' 
                : 'border-blue-200 shadow-2xs hover:border-purple-400 hover:bg-purple-50/30'
            }`}
          >
            <div className="w-10 h-10 mx-auto rounded-xl bg-purple-100 border border-purple-300 text-purple-800 flex items-center justify-center font-black">
              <Store size={18} />
            </div>
            <div className="text-[11px] font-black text-black">
              <span className="text-purple-700">4.</span> Reverse Stores
            </div>
            <p className="text-[10px] text-slate-600 font-medium leading-tight">
              Find all stores that received this batch
            </p>
            <div className="pt-1 text-[9px] font-mono font-bold text-purple-900 bg-purple-50 rounded">
              {trace?.reverseStores.length || 4} Mapped Outlets
            </div>
          </button>

          {/* Step 5: Area Containment */}
          <button 
            type="button"
            onClick={() => { 
              setActiveTab('regional_area'); 
              casePanelRef.current?.scrollIntoView({ behavior: 'smooth' }); 
            }}
            className={`p-3 rounded-xl bg-white border text-center space-y-1 transition-all cursor-pointer ${
              activeTab === 'regional_area' 
                ? 'border-amber-500 ring-2 ring-amber-400 shadow-md bg-amber-50/20' 
                : 'border-blue-200 shadow-2xs hover:border-amber-400 hover:bg-amber-50/30'
            }`}
          >
            <div className="w-10 h-10 mx-auto rounded-xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center font-black">
              <Map size={18} />
            </div>
            <div className="text-[11px] font-black text-black">
              <span className="text-amber-700">5.</span> Regional Area
            </div>
            <p className="text-[10px] text-slate-600 font-medium leading-tight">
              Identify affected area across zone
            </p>
            <div className="pt-1 text-[9px] font-mono font-bold text-amber-900 bg-amber-50 rounded">
              {trace?.regionalAreaImpact.stateCode || 'MH-12'} Circle
            </div>
          </button>

          {/* Step 6: Smart Alert & Escalation */}
          <button 
            type="button"
            onClick={() => { 
              setActiveTab('escalation'); 
              casePanelRef.current?.scrollIntoView({ behavior: 'smooth' }); 
            }}
            className={`p-3 rounded-xl bg-white border text-center space-y-1 transition-all cursor-pointer ${
              activeTab === 'escalation' 
                ? 'border-rose-500 ring-2 ring-rose-400 shadow-md bg-rose-50/20' 
                : 'border-blue-200 shadow-2xs hover:border-rose-400 hover:bg-rose-50/30'
            }`}
          >
            <div className="w-10 h-10 mx-auto rounded-xl bg-rose-100 border border-rose-300 text-rose-800 flex items-center justify-center font-black animate-pulse">
              <Bell size={18} />
            </div>
            <div className="text-[11px] font-black text-black">
              <span className="text-rose-700">6.</span> Smart Alert
            </div>
            <p className="text-[10px] text-slate-600 font-medium leading-tight">
              Auto-escalate to Senior/Head officer
            </p>
            <div className="pt-1 text-[9px] font-black text-rose-900 bg-rose-50 rounded">
              State Controller
            </div>
          </button>
        </div>

        {/* 5 Core Pillars Banner (from Slide 14) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 pt-2 border-t border-blue-200/60 text-xs">
          <div className="p-2.5 bg-blue-900 text-white rounded-xl flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-400 flex-shrink-0" />
            <div>
              <span className="font-bold text-[11px] block">Objective & Defensible</span>
              <span className="text-[10px] text-blue-200">Legal Metrology Rules 2011</span>
            </div>
          </div>

          <div className="p-2.5 bg-blue-900 text-white rounded-xl flex items-center gap-2">
            <Ruler size={16} className="text-cyan-300 flex-shrink-0" />
            <div>
              <span className="font-bold text-[11px] block">Real Measurement</span>
              <span className="text-[10px] text-blue-200">Calibrated real mm heights</span>
            </div>
          </div>

          <div className="p-2.5 bg-blue-900 text-white rounded-xl flex items-center gap-2">
            <Network size={16} className="text-amber-300 flex-shrink-0" />
            <div>
              <span className="font-bold text-[11px] block">Complete Visibility</span>
              <span className="text-[10px] text-blue-200">Product to upstream suppliers</span>
            </div>
          </div>

          <div className="p-2.5 bg-blue-900 text-white rounded-xl flex items-center gap-2">
            <Sparkles size={16} className="text-yellow-400 flex-shrink-0" />
            <div>
              <span className="font-bold text-[11px] block">Faster Action</span>
              <span className="text-[10px] text-blue-200">Instant batch quarantine notices</span>
            </div>
          </div>

          <div className="p-2.5 bg-blue-900 text-white rounded-xl flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-300 flex-shrink-0" />
            <div>
              <span className="font-bold text-[11px] block">Safer Consumers</span>
              <span className="text-[10px] text-blue-200">Zero expired goods on shelf</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar for Batches and Products */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-300 shadow-xs">
        <Search size={18} className="text-blue-700 ml-1 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search by Batch ID (e.g. LAY-EXP-2025-09), Product Name, Brand, or Manufacturer License..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent text-xs text-black font-semibold placeholder-slate-500 focus:outline-none"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs text-slate-500 hover:text-black font-bold px-2 py-0.5 rounded bg-slate-100"
          >
            Clear
          </button>
        )}
      </div>

      {/* Preset Quick Switcher Banner (Focus on Lay's chips expired case) */}
      <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
            <h3 className="text-xs font-black uppercase text-amber-950 font-mono tracking-wider">
              High Priority Backtracking Scenarios:
            </h3>
          </div>
          <span className="text-[11px] text-amber-900 font-bold">
            Select a product below to inspect its live supply chain trace:
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredTraceables.map((prod) => {
            const isSelected = prod.batchTrace?.batchId === currentProduct.batchTrace?.batchId;
            const isExp = prod.batchTrace?.isExpired;
            return (
              <button
                key={prod.id}
                onClick={() => handleSelectBatch(prod.batchTrace?.batchId || prod.batchNumber, prod.name)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected 
                    ? 'bg-white border-blue-600 shadow-md ring-2 ring-blue-500/30' 
                    : 'bg-white/80 hover:bg-white border-slate-300 hover:border-slate-400'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-black line-clamp-1">{prod.name}</span>
                      {isSelected && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-black bg-blue-600 text-white shrink-0">
                          OPEN CASE
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-700 font-mono font-bold mt-0.5">
                      Batch: {prod.batchTrace?.batchId || prod.batchNumber}
                    </p>
                  </div>
                  {isExp ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black bg-rose-100 text-rose-900 border border-rose-300 flex items-center gap-1 shrink-0">
                      <AlertTriangle size={11} /> EXPIRED
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black bg-emerald-100 text-emerald-900 border border-emerald-300 shrink-0">
                      VALID
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between text-[11px] text-black font-semibold mt-2 pt-2 border-t border-slate-100">
                  <span className="truncate max-w-[150px]">Store: {prod.batchTrace?.retailer.storeName}</span>
                  <span className="text-blue-700 font-black flex items-center gap-1 shrink-0">
                    <FolderOpen size={12} />
                    <span>Open Case & Pune Map</span>
                    <ArrowRight size={12} />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Backtrack Visualizer Area */}
      {trace ? (
        <div className="space-y-6">
          {/* Active Product & Batch Status Card */}
          <div className="p-5 rounded-2xl bg-white border border-slate-300 shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl border ${
                  trace.isExpired 
                    ? 'bg-rose-50 border-rose-300 text-rose-700' 
                    : 'bg-blue-50 border-blue-300 text-blue-700'
                }`}>
                  {trace.isExpired ? <ShieldAlert size={28} /> : <CheckCircle2 size={28} />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-black">{currentProduct.name}</h2>
                    <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-slate-100 text-black border border-slate-300">
                      {currentProduct.brand}
                    </span>
                    {trace.isExpired && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-black bg-rose-600 text-white animate-pulse">
                        EXPIRED ON RETAIL SHELF
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-black font-semibold mt-1">
                    <span>Batch ID: <strong className="font-mono font-black text-blue-900">{trace.batchId}</strong></span>
                    <span>•</span>
                    <span>Mfg Date: <strong className="font-mono">{trace.mfgDate}</strong></span>
                    <span>•</span>
                    <span>Expiry Date: <strong className={`font-mono ${trace.isExpired ? 'text-rose-700 font-black' : ''}`}>{trace.expDate}</strong></span>
                    <span>•</span>
                    <span>Mfg License: <strong className="font-mono">{trace.mfgLicenseNumber}</strong></span>
                  </div>
                </div>
              </div>

              {/* Action Buttons for Enforcement */}
              <div className="flex items-center gap-2">
                {trace.recallStatus === 'quarantine_ordered' ? (
                  <span className="px-3 py-1.5 rounded-xl bg-rose-100 text-rose-950 border border-rose-300 text-xs font-black flex items-center gap-1.5">
                    <Ban size={14} className="text-rose-700" /> BATCH QUARANTINE ORDERED
                  </span>
                ) : (
                  <button
                    onClick={() => handleTriggerRecall(trace.batchId)}
                    className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
                  >
                    <Ban size={14} />
                    <span>Issue Immediate Batch Quarantine</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setSelectedProductId(currentProduct.id);
                    setCurrentTab('analysis_results');
                  }}
                  className="px-3 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-black text-xs font-bold shadow-2xs flex items-center gap-1"
                >
                  <ExternalLink size={13} />
                  <span>Inspect Label</span>
                </button>
              </div>
            </div>

            {/* Expired Warning Callout Banner if Expired */}
            {trace.isExpired && (
              <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-xs flex items-start gap-3 text-rose-950">
                <AlertTriangle size={18} className="text-rose-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-black text-rose-900">Critical Expiry Warning Detected</h4>
                  <p className="mt-0.5 font-medium leading-relaxed">
                    This unit was discovered on retail shelves past its expiry date of <strong>{trace.expDate}</strong>. 
                    Under Legal Metrology & Food Safety standards, offering expired packaged commodities for retail sale mandates immediate seizure of remaining units at <strong>{trace.retailer.storeName}</strong> and upstream quarantine at wholesaler <strong>{trace.wholesaler.name}</strong>.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Supply Chain Chain-of-Custody Visual Timeline (Nodes Flow) */}
          <div className="p-6 rounded-2xl bg-white border border-slate-300 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-sm font-black text-slate-900">End-to-End Supply Chain Lineage</h3>
                <p className="text-xs text-black font-medium">
                  Click any stage below to inspect facility licenses, transit invoices, and plant records:
                </p>
              </div>

              {/* View switch */}
              <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-300">
                <button
                  onClick={() => setActiveTab('case_dossier')}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 ${
                    activeTab === 'case_dossier' 
                      ? 'bg-blue-600 shadow-xs text-white' 
                      : 'text-blue-950 font-bold hover:bg-slate-200'
                  }`}
                >
                  <FolderOpen size={13} />
                  <span>Case Dossier & Pune Map</span>
                  <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-black ${
                    activeTab === 'case_dossier' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-900 border border-blue-300'
                  }`}>
                    PRIMARY
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('timeline')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'timeline' ? 'bg-white shadow-xs text-blue-900' : 'text-slate-700 hover:text-black'
                  }`}
                >
                  Chain of Custody
                </button>
                <button
                  onClick={() => setActiveTab('reverse_stores')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'reverse_stores' ? 'bg-white shadow-xs text-purple-900' : 'text-slate-700 hover:text-black'
                  }`}
                >
                  Reverse Store Mapping ({trace.reverseStores?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab('regional_area')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'regional_area' ? 'bg-white shadow-xs text-amber-900' : 'text-slate-700 hover:text-black'
                  }`}
                >
                  Regional Impact ({trace.regionalAreaImpact?.stateCode || 'Zone'})
                </button>
                <button
                  onClick={() => setActiveTab('escalation')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'escalation' ? 'bg-white shadow-xs text-rose-900' : 'text-slate-700 hover:text-black'
                  }`}
                >
                  Smart Escalation
                </button>
                <button
                  onClick={() => setActiveTab('suppliers')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'suppliers' ? 'bg-white shadow-xs text-emerald-900' : 'text-slate-700 hover:text-black'
                  }`}
                >
                  Raw Material Suppliers ({trace.rawSuppliers.length})
                </button>
                <button
                  onClick={() => setActiveTab('notice')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'notice' ? 'bg-white shadow-xs text-blue-900' : 'text-slate-700 hover:text-black'
                  }`}
                >
                  Legal Seizure Notice
                </button>
              </div>
            </div>

            {/* Tab: Master Case Investigation Dossier & Pune Geospatial Maps (Primary Officer View) */}
            {activeTab === 'case_dossier' && (
              <div className="space-y-6" ref={casePanelRef}>
                {/* 1. Master Case Investigation Docket Header */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white shadow-md border border-blue-800">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-1 rounded text-[11px] font-black uppercase font-mono bg-blue-600 text-white tracking-wide flex items-center gap-1.5 shadow-xs">
                          <FolderOpen size={14} />
                          OFFICER CASE DOCKET: CASE-MH12-2026-{(trace.batchId.replace(/[^A-Z0-9]/gi, '')).slice(-4) || '8891'}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/15 text-blue-200 border border-white/20">
                          PUNE MH-12 CIRCLE
                        </span>
                        {trace.isExpired ? (
                          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-black bg-rose-600 text-white animate-pulse flex items-center gap-1 shadow-xs">
                            <AlertTriangle size={12} /> CRITICAL ACTIVE ENFORCEMENT
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-black bg-emerald-600 text-white flex items-center gap-1">
                            <CheckCircle2 size={12} /> SURVEILLANCE ACTIVE
                          </span>
                        )}
                      </div>
                      <h2 className="text-xl md:text-2xl font-black text-white mt-2.5 flex items-center gap-2">
                        <span>{currentProduct.name}</span>
                        <span className="text-blue-300 font-normal font-mono text-sm">({currentProduct.brand})</span>
                      </h2>
                      <p className="text-xs text-blue-100 font-medium mt-1 max-w-3xl leading-relaxed">
                        <strong>Alleged Violation:</strong> {trace.isExpired ? 'Retail distribution of expired packaged commodities endangering consumers' : 'Mandatory packaging rules and verification surveillance'} under The Legal Metrology Act, 2009 (Sections 36 & 39) & Packaged Commodities Rules 2011.
                      </p>
                    </div>

                    {/* Investigating Officer & Immediate Actions */}
                    <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-2.5 shrink-0">
                      <div className="p-3 rounded-xl bg-white/10 border border-white/15 text-xs text-left md:text-right backdrop-blur-xs">
                        <span className="text-[10px] text-blue-300 uppercase font-mono block">Investigating Officer</span>
                        <span className="font-black text-white text-sm block">Inspector Suresh Kumar</span>
                        <span className="text-[11px] text-blue-200 font-mono">Central Enforcement Directorate (MH-12)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleQuarantineAllStores}
                          className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-sm flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                        >
                          <Ban size={13} />
                          <span>Zone Seizure Order</span>
                        </button>
                        <button
                          onClick={handleDownloadNotice}
                          className="px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs border border-white/30 flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Download size={13} />
                          <span>Download Case Dossier</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Case Key Intelligence Numbers Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 pt-4 border-t border-blue-800/80 text-xs">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-[10px] text-blue-300 font-mono uppercase block">Target Batch ID</span>
                      <span className="text-sm font-mono font-black text-white">{trace.batchId}</span>
                      <span className="text-[10px] text-blue-200 block mt-0.5 font-mono">Exp: {trace.expDate}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-[10px] text-blue-300 font-mono uppercase block">Mapped Pune Outlets</span>
                      <span className="text-sm font-mono font-black text-amber-300">{trace.reverseStores?.length || 0} Physical Stores</span>
                      <span className="text-[10px] text-blue-200 block mt-0.5">100% Geolocated in Pune</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-[10px] text-blue-300 font-mono uppercase block">Shelf Risk Stock</span>
                      <span className="text-sm font-mono font-black text-rose-300">
                        {(trace.reverseStores || []).reduce((acc, s) => acc + s.remainingUnits, 0)} Units on Shelf
                      </span>
                      <span className="text-[10px] text-blue-200 block mt-0.5 font-mono">Immediate Seizure Mandated</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-[10px] text-blue-300 font-mono uppercase block">Enforcement Status</span>
                      <span className="text-sm font-black text-emerald-300 flex items-center gap-1">
                        <ShieldCheck size={14} />
                        {(trace.reverseStores || []).filter(s => isStoreQuarantined(s)).length} / {trace.reverseStores?.length || 0} Quarantined
                      </span>
                      <span className="text-[10px] text-blue-200 block mt-0.5 font-mono">Directives Dispatched</span>
                    </div>
                  </div>
                </div>

                {/* 2. PROMINENT GEOSPATIAL INTELLIGENCE & SURVEILLANCE MAP */}
                <div className="p-5 rounded-2xl bg-white border border-slate-300 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 rounded-lg bg-blue-100 text-blue-800">
                          <MapIcon size={18} />
                        </span>
                        <div>
                          <h3 className="text-sm font-black text-slate-900">
                            Pune Metropolitan Area (MH-12) Enforcement Surveillance Map
                          </h3>
                          <p className="text-xs text-slate-600 font-medium">
                            Geolocated retail outlets holding Batch <strong className="font-mono text-blue-900">{trace.batchId}</strong>. Pulsing red radar pins indicate active retail shelf inventory. Click any pin to inspect the store evidence docket.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setActiveTab('regional_area')}
                        className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-300 hover:bg-amber-100 text-amber-950 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Radio size={13} className="text-amber-700" />
                        <span>Zonal Containment Mode</span>
                      </button>
                      <button
                        onClick={handleQuarantineAllStores}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Ban size={13} />
                        <span>Quarantine All Stores</span>
                      </button>
                    </div>
                  </div>

                  {/* Embedded Pune Region Map Component */}
                  <PuneRegionMap 
                    stores={trace.reverseStores || []}
                    currentBatchId={trace.batchId}
                    isExpiredBatch={trace.isExpired}
                    onQuarantineStore={handleQuarantineSingleStore}
                    quarantinedStoreNames={quarantinedStoreNames}
                    onSelectStore={(store) => setSelectedStoreForDossier(store)}
                  />
                </div>

                {/* 3. STORE SURVEILLANCE ROSTER & SELECTED STORE INVESTIGATION DOSSIER */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Selected Store Inspector Card (1 col) */}
                  {(() => {
                    const activeStore = selectedStoreForDossier || (trace.reverseStores && trace.reverseStores[0]);
                    if (!activeStore) return null;
                    const isQ = isStoreQuarantined(activeStore);
                    return (
                      <div className="p-5 rounded-2xl bg-white border border-slate-300 shadow-xs space-y-4 flex flex-col justify-between">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                            <div className="flex items-center gap-2">
                              <Store size={18} className="text-blue-700" />
                              <h4 className="font-black text-xs text-slate-900 uppercase">Selected Store Dossier</h4>
                            </div>
                            {isQ ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black bg-rose-100 text-rose-950 border border-rose-300">
                                QUARANTINED
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black bg-amber-100 text-amber-950 border border-amber-300 animate-pulse">
                                ACTIVE ON SHELF
                              </span>
                            )}
                          </div>

                          <div>
                            <h3 className="font-black text-base text-black">{activeStore.storeName}</h3>
                            <p className="text-xs text-slate-700 mt-1 flex items-start gap-1">
                              <MapPin size={13} className="text-slate-400 mt-0.5 shrink-0" />
                              <span>{activeStore.storeAddress}</span>
                            </p>
                            <span className="mt-1 inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-800 border border-slate-200">
                              Zone: {activeStore.areaDistrict} • {activeStore.locality || 'Pune'}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                              <span className="text-[10px] text-slate-500 font-bold block uppercase">Shelf Stock Discovered</span>
                              <span className="text-base font-black text-rose-700 font-mono mt-0.5 block">{activeStore.remainingUnits} units</span>
                              <span className="text-[10px] text-slate-600 font-medium block">Out of {activeStore.receivedUnits} received</span>
                            </div>
                            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                              <span className="text-[10px] text-slate-500 font-bold block uppercase">Delivery / Invoice</span>
                              <span className="text-xs font-bold text-black font-mono mt-1 block">{activeStore.deliveryDate}</span>
                              <span className="text-[10px] text-emerald-800 font-bold block mt-0.5">Lot verified</span>
                            </div>
                          </div>

                          <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-600 font-medium">Store Manager:</span>
                              <span className="font-bold text-black">{activeStore.contactPerson}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-600 font-medium">Contact Phone:</span>
                              <a href={`tel:${activeStore.phone}`} className="text-blue-700 font-mono font-bold hover:underline flex items-center gap-1">
                                <Phone size={11} /> {activeStore.phone}
                              </a>
                            </div>
                            {activeStore.seizureNoticeNo && (
                              <div className="flex items-center justify-between pt-1 border-t border-slate-200/80">
                                <span className="text-slate-600 font-medium">Seizure Notice #:</span>
                                <span className="font-mono font-bold text-blue-950 text-[11px]">{activeStore.seizureNoticeNo}</span>
                              </div>
                            )}
                            {activeStore.lat && activeStore.lng && (
                              <div className="flex items-center justify-between pt-1 border-t border-slate-200/80">
                                <span className="text-slate-600 font-medium">GPS Coordinates:</span>
                                <span className="font-mono text-[10px] text-slate-800">{activeStore.lat.toFixed(4)}° N, {activeStore.lng.toFixed(4)}° E</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-slate-200">
                          {isQ ? (
                            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-xs font-bold text-emerald-900 flex items-center justify-center gap-1.5">
                              <CheckCircle2 size={14} className="text-emerald-600" />
                              <span>Quarantine Enforced at Outlet</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleQuarantineSingleStore(activeStore.storeName)}
                              className="w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <Ban size={13} />
                              <span>Order Immediate Store Seizure</span>
                            </button>
                          )}

                          {activeStore.lat && activeStore.lng && (
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${activeStore.lat},${activeStore.lng}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-900 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                            >
                              <Navigation size={13} className="text-blue-700" />
                              <span>Get GPS Directions to Store</span>
                              <ExternalLink size={11} className="text-slate-400" />
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Complete Mapped Store Roster (2 cols) */}
                  <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-slate-300 shadow-xs space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                      <div className="flex items-center gap-2">
                        <Store size={18} className="text-purple-700" />
                        <h4 className="font-black text-xs text-slate-900 uppercase">
                          All Mapped Retail Outlets ({trace.reverseStores?.length || 0} Stores in Pune Circle)
                        </h4>
                      </div>
                      <span className="text-xs font-bold text-slate-500">
                        Click any store to inspect on map
                      </span>
                    </div>

                    <div className="divide-y divide-slate-100 max-h-[380px] overflow-y-auto pr-1">
                      {(trace.reverseStores || []).map((store, idx) => {
                        const isQ = isStoreQuarantined(store);
                        const isSelected = (selectedStoreForDossier?.storeName || trace.reverseStores?.[0]?.storeName) === store.storeName;
                        return (
                          <div 
                            key={idx}
                            onClick={() => setSelectedStoreForDossier(store)}
                            className={`p-3 rounded-xl transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                              isSelected 
                                ? 'bg-blue-50/80 border border-blue-300 shadow-2xs' 
                                : 'hover:bg-slate-50'
                            }`}
                          >
                            <div className="space-y-0.5 flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-black text-xs text-black truncate">{store.storeName}</span>
                                {isQ ? (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-black bg-rose-100 text-rose-900 border border-rose-300 shrink-0">
                                    QUARANTINED
                                  </span>
                                ) : (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-black bg-amber-100 text-amber-900 border border-amber-300 shrink-0">
                                    ON SHELF
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-600 truncate flex items-center gap-1">
                                <MapPin size={11} className="text-slate-400 shrink-0" />
                                <span>{store.storeAddress}</span>
                              </p>
                              <div className="flex items-center gap-3 text-[10px] text-slate-700 font-mono mt-1">
                                <span>Zone: <strong>{store.areaDistrict}</strong></span>
                                <span>•</span>
                                <span>Contact: <strong>{store.phone}</strong></span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              <div className="text-right">
                                <span className="text-xs font-mono font-black text-rose-700 block">
                                  {store.remainingUnits} units
                                </span>
                                <span className="text-[10px] text-slate-500 font-medium block">
                                  on retail shelf
                                </span>
                              </div>

                              {isQ ? (
                                <span className="px-2.5 py-1 rounded-lg text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 flex items-center gap-1">
                                  <CheckCircle2 size={12} className="text-emerald-600" /> Notice
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleQuarantineSingleStore(store.storeName);
                                  }}
                                  className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-2xs transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
                                >
                                  <Ban size={11} />
                                  <span>Quarantine</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 4. UPSTREAM SUPPLY CHAIN LINEAGE SUMMARY BAR */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-300 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                    <div className="flex items-center gap-2">
                      <Network size={18} className="text-blue-700" />
                      <h4 className="font-black text-xs text-slate-900 uppercase">
                        Upstream Chain of Custody & Logistics Trace
                      </h4>
                    </div>
                    <button
                      onClick={() => setActiveTab('timeline')}
                      className="text-xs text-blue-700 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Inspect Facility Records & Invoices</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    {/* Retail Detection */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-blue-800 uppercase">Detection Site</span>
                        <Store size={14} className="text-blue-700" />
                      </div>
                      <span className="font-black text-black block">{trace.retailer.storeName}</span>
                      <span className="text-slate-600 text-[11px] block">{trace.retailer.shelfLocation}</span>
                      <span className="text-[10px] font-mono font-bold text-rose-700 block pt-1">{trace.retailer.unitsOnShelf} units on shelf</span>
                    </div>

                    {/* Wholesale Hub */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-amber-800 uppercase">Wholesale Hub</span>
                        <Layers size={14} className="text-amber-700" />
                      </div>
                      <span className="font-black text-black block">{trace.wholesaler.name}</span>
                      <span className="text-slate-600 text-[11px] block">{trace.wholesaler.depotLocation}</span>
                      <span className="text-[10px] font-mono font-bold text-slate-800 block pt-1">Lot: {trace.wholesaler.inventoryLotId}</span>
                    </div>

                    {/* Distributor Logistics */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-indigo-800 uppercase">Transit Logistics</span>
                        <Truck size={14} className="text-indigo-700" />
                      </div>
                      <span className="font-black text-black block">{trace.distributor.name}</span>
                      <span className="text-slate-600 text-[11px] block">Truck: {trace.distributor.vehicleRegistration}</span>
                      <span className="text-[10px] font-mono font-bold text-slate-800 block pt-1">Inv: {trace.distributor.dispatchInvoiceNo}</span>
                    </div>

                    {/* Manufacturing Plant */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-purple-800 uppercase">Producer Origin</span>
                        <Factory size={14} className="text-purple-700" />
                      </div>
                      <span className="font-black text-black block">{trace.manufacturer.entityName}</span>
                      <span className="text-slate-600 text-[11px] block">{trace.manufacturer.plantLocation}</span>
                      <span className="text-[10px] font-mono font-bold text-purple-900 block pt-1">LM: {trace.mfgLicenseNumber}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'timeline' && (
              <div className="space-y-6">
                {/* Horizontal Node Flow */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  {/* Node 1: Retailer (Where Found) */}
                  <div 
                    onClick={() => setSelectedNode('retailer')}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedNode === 'retailer' 
                        ? 'border-blue-600 bg-blue-50/70 shadow-sm' 
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                        <Store size={16} />
                      </span>
                      <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-blue-200 text-blue-950">
                        STAGE 1
                      </span>
                    </div>
                    <span className="text-xs font-black text-black block">Retail Store (Shelf)</span>
                    <p className="text-[11px] font-bold text-slate-800 line-clamp-1">{trace.retailer.storeName}</p>
                    <p className="text-[10px] text-slate-600 font-medium mt-1">Stocked: {trace.retailer.stockReceivedDate}</p>
                    <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] font-bold">
                      <span className="text-rose-700">{trace.retailer.unitsOnShelf} units on shelf</span>
                    </div>
                  </div>

                  {/* Node 2: Wholesaler */}
                  <div 
                    onClick={() => setSelectedNode('wholesaler')}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedNode === 'wholesaler' 
                        ? 'border-blue-600 bg-blue-50/70 shadow-sm' 
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                        <Layers size={16} />
                      </span>
                      <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-amber-200 text-amber-950">
                        STAGE 2
                      </span>
                    </div>
                    <span className="text-xs font-black text-black block">Regional Wholesaler</span>
                    <p className="text-[11px] font-bold text-slate-800 line-clamp-1">{trace.wholesaler.name}</p>
                    <p className="text-[10px] text-slate-600 font-medium mt-1">Lot: {trace.wholesaler.inventoryLotId}</p>
                    <div className="mt-2 pt-2 border-t border-slate-200/60 text-[10px] text-slate-600 font-bold">
                      Intake: {trace.wholesaler.intakeDate}
                    </div>
                  </div>

                  {/* Node 3: Distributor */}
                  <div 
                    onClick={() => setSelectedNode('distributor')}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedNode === 'distributor' 
                        ? 'border-blue-600 bg-blue-50/70 shadow-sm' 
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
                        <Truck size={16} />
                      </span>
                      <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-indigo-200 text-indigo-950">
                        STAGE 3
                      </span>
                    </div>
                    <span className="text-xs font-black text-black block">C&F / Distributor</span>
                    <p className="text-[11px] font-bold text-slate-800 line-clamp-1">{trace.distributor.name}</p>
                    <p className="text-[10px] text-slate-600 font-medium mt-1">Invoice: {trace.distributor.dispatchInvoiceNo}</p>
                    <div className="mt-2 pt-2 border-t border-slate-200/60 text-[10px] text-slate-600 font-bold">
                      Truck: {trace.distributor.vehicleRegistration}
                    </div>
                  </div>

                  {/* Node 4: Manufacturer Plant */}
                  <div 
                    onClick={() => setSelectedNode('manufacturer')}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedNode === 'manufacturer' 
                        ? 'border-blue-600 bg-blue-50/70 shadow-sm' 
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                        <Factory size={16} />
                      </span>
                      <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-purple-200 text-purple-950">
                        STAGE 4
                      </span>
                    </div>
                    <span className="text-xs font-black text-black block">Manufacturing Plant</span>
                    <p className="text-[11px] font-bold text-slate-800 line-clamp-1">{trace.manufacturer.entityName}</p>
                    <p className="text-[10px] text-slate-600 font-medium mt-1">Lic: {trace.mfgLicenseNumber}</p>
                    <div className="mt-2 pt-2 border-t border-slate-200/60 text-[10px] text-purple-900 font-bold">
                      Line: {trace.manufacturer.productionLine.slice(0, 18)}...
                    </div>
                  </div>

                  {/* Node 5: Upstream Suppliers */}
                  <div 
                    onClick={() => setSelectedNode('suppliers')}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedNode === 'suppliers' 
                        ? 'border-blue-600 bg-blue-50/70 shadow-sm' 
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                        <Wheat size={16} />
                      </span>
                      <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-950">
                        STAGE 5
                      </span>
                    </div>
                    <span className="text-xs font-black text-black block">Raw Material Suppliers</span>
                    <p className="text-[11px] font-bold text-slate-800">{trace.rawSuppliers.length} Verified Sources</p>
                    <p className="text-[10px] text-slate-600 font-medium mt-1">Farms & Packaging</p>
                    <div className="mt-2 pt-2 border-t border-slate-200/60 text-[10px] text-emerald-800 font-bold">
                      All Lots Registered
                    </div>
                  </div>
                </div>

                {/* Selected Node Details Drawer / Card */}
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                  {selectedNode === 'retailer' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Store size={18} className="text-blue-700" />
                          <h4 className="font-black text-sm text-black">Stage 1: Retail Store Shelf & Inspection Point</h4>
                        </div>
                        <span className="text-xs font-mono font-bold text-black bg-blue-100 px-2 py-0.5 rounded">
                          Detection Site
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                        <div className="p-3 bg-white rounded-lg border border-slate-200">
                          <span className="text-slate-500 font-medium block">Retailer Name</span>
                          <span className="font-black text-black text-sm">{trace.retailer.storeName}</span>
                          <span className="text-slate-700 block mt-1">{trace.retailer.storeAddress}</span>
                        </div>
                        <div className="p-3 bg-white rounded-lg border border-slate-200">
                          <span className="text-slate-500 font-medium block">Inspector Location & Shelf</span>
                          <span className="font-mono font-bold text-black">{trace.retailer.inspectorCoords}</span>
                          <span className="text-slate-700 block mt-1 font-semibold">{trace.retailer.shelfLocation}</span>
                        </div>
                        <div className="p-3 bg-white rounded-lg border border-slate-200">
                          <span className="text-slate-500 font-medium block">Shelf Stock Discovered</span>
                          <span className="font-black text-rose-700 text-sm">{trace.retailer.unitsOnShelf} units on shelf</span>
                          <span className="text-slate-700 block mt-1 font-medium">Received at Store: {trace.retailer.stockReceivedDate}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedNode === 'wholesaler' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Layers size={18} className="text-amber-700" />
                          <h4 className="font-black text-sm text-black">Stage 2: Regional Wholesale Distribution Depot</h4>
                        </div>
                        <span className="text-xs font-mono font-bold text-black bg-amber-100 px-2 py-0.5 rounded">
                          Intermediary Stockist
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                        <div className="p-3 bg-white rounded-lg border border-slate-200">
                          <span className="text-slate-500 font-medium block">Wholesaler Entity</span>
                          <span className="font-black text-black text-sm">{trace.wholesaler.name}</span>
                          <span className="text-slate-700 block mt-1">{trace.wholesaler.depotLocation}</span>
                        </div>
                        <div className="p-3 bg-white rounded-lg border border-slate-200">
                          <span className="text-slate-500 font-medium block">Inventory & Lot Identification</span>
                          <span className="font-mono font-bold text-black">{trace.wholesaler.inventoryLotId}</span>
                          <span className="text-slate-700 block mt-1 font-medium">Intake Date: {trace.wholesaler.intakeDate}</span>
                        </div>
                        <div className="p-3 bg-white rounded-lg border border-slate-200">
                          <span className="text-slate-500 font-medium block">Enforcement Contact</span>
                          <span className="font-mono font-bold text-black">{trace.wholesaler.contactPhone}</span>
                          <span className="text-emerald-700 block mt-1 font-bold">Quarantine notice can be served</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedNode === 'distributor' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Truck size={18} className="text-indigo-700" />
                          <h4 className="font-black text-sm text-black">Stage 3: Primary C&F Agent & Transit Logistics</h4>
                        </div>
                        <span className="text-xs font-mono font-bold text-black bg-indigo-100 px-2 py-0.5 rounded">
                          Transit Custody
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                        <div className="p-3 bg-white rounded-lg border border-slate-200">
                          <span className="text-slate-500 font-medium block">Logistics Partner</span>
                          <span className="font-black text-black text-sm">{trace.distributor.name}</span>
                          <span className="text-slate-700 block mt-1">{trace.distributor.hubLocation}</span>
                        </div>
                        <div className="p-3 bg-white rounded-lg border border-slate-200">
                          <span className="text-slate-500 font-medium block">Dispatch Invoice & Date</span>
                          <span className="font-mono font-bold text-black">{trace.distributor.dispatchInvoiceNo}</span>
                          <span className="text-slate-700 block mt-1 font-medium">Dispatched: {trace.distributor.dispatchDate}</span>
                        </div>
                        <div className="p-3 bg-white rounded-lg border border-slate-200">
                          <span className="text-slate-500 font-medium block">Vehicle Registration & Contact</span>
                          <span className="font-mono font-bold text-black">{trace.distributor.vehicleRegistration}</span>
                          <span className="text-slate-700 block mt-1 font-medium">{trace.distributor.contactPerson}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedNode === 'manufacturer' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Factory size={18} className="text-purple-700" />
                          <h4 className="font-black text-sm text-black">Stage 4: Manufacturing Plant & Corporate Entity</h4>
                        </div>
                        <span className="text-xs font-mono font-bold text-black bg-purple-100 px-2 py-0.5 rounded">
                          Producer Origin
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                        <div className="p-3 bg-white rounded-lg border border-slate-200">
                          <span className="text-slate-500 font-medium block">Manufacturer Entity</span>
                          <span className="font-black text-black text-sm">{trace.manufacturer.entityName}</span>
                          <span className="text-slate-700 block mt-1 font-bold">Brand: {trace.manufacturer.brandOwner}</span>
                          <span className="text-slate-600 block mt-1">{trace.manufacturer.plantLocation}</span>
                        </div>
                        <div className="p-3 bg-white rounded-lg border border-slate-200">
                          <span className="text-slate-500 font-medium block">Licenses & Production Line</span>
                          <span className="text-slate-700 block">LM Reg: <strong className="font-mono font-black text-black">{trace.mfgLicenseNumber}</strong></span>
                          <span className="text-slate-700 block">FSSAI Lic: <strong className="font-mono font-bold text-black">{trace.manufacturer.fssaiLicense}</strong></span>
                          <span className="text-slate-700 block mt-1 font-semibold text-purple-900">{trace.manufacturer.productionLine}</span>
                        </div>
                        <div className="p-3 bg-white rounded-lg border border-slate-200">
                          <span className="text-slate-500 font-medium block">Plant Management Contacts</span>
                          <span className="font-bold text-black block">{trace.manufacturer.plantManager}</span>
                          <span className="text-slate-700 block font-mono mt-1">{trace.manufacturer.contactPhone}</span>
                          <span className="text-blue-700 block font-mono">{trace.manufacturer.contactEmail}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedNode === 'suppliers' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Wheat size={18} className="text-emerald-700" />
                          <h4 className="font-black text-sm text-black">Stage 5: Upstream Ingredients & Packaging Suppliers</h4>
                        </div>
                        <span className="text-xs font-mono font-bold text-black bg-emerald-100 px-2 py-0.5 rounded">
                          Raw Inputs
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        {trace.rawSuppliers.map((s, idx) => (
                          <div key={idx} className="p-3 bg-white rounded-lg border border-slate-200 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="font-black text-black text-xs">{s.material}</span>
                              <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                Purity: {s.purityScore}%
                              </span>
                            </div>
                            <p className="text-slate-800 font-bold">{s.supplierName}</p>
                            <p className="text-slate-600 text-[11px] flex items-center gap-1">
                              <MapPin size={12} className="text-slate-500" /> {s.originLocation}
                            </p>
                            <div className="flex items-center justify-between text-[10px] font-mono pt-1 border-t border-slate-100 text-slate-700">
                              <span>Lot: {s.lotNumber}</span>
                              <span>Cert: {s.qualityCertificateNo}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab: Reverse Store Mapping (SIH 2026 Step 4) */}
            {activeTab === 'reverse_stores' && (
              <div className="space-y-4">
                {/* Banner & Summary Stats */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-purple-50/70 border border-purple-200">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase font-mono bg-purple-700 text-white">
                        Reverse Supply Mapping
                      </span>
                      <h4 className="font-black text-sm text-purple-950">
                        Outlets Receiving Flagged Batch {trace.batchId}
                      </h4>
                    </div>
                    <p className="text-xs text-purple-900 font-medium mt-1">
                      Surveillance system mapped all physical stores that received inventory from wholesale distribution lot {trace.wholesaler.inventoryLotId}.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center bg-white p-1 rounded-xl border border-purple-300 shadow-2xs">
                      <button
                        type="button"
                        onClick={() => setReverseStoresViewMode('map')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          reverseStoresViewMode === 'map' 
                            ? 'bg-purple-700 text-white shadow-xs' 
                            : 'text-purple-900 hover:bg-purple-100'
                        }`}
                      >
                        <MapIcon size={13} />
                        <span>Pune Map View</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setReverseStoresViewMode('table')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          reverseStoresViewMode === 'table' 
                            ? 'bg-purple-700 text-white shadow-xs' 
                            : 'text-purple-900 hover:bg-purple-100'
                        }`}
                      >
                        <Store size={13} />
                        <span>Table View ({trace.reverseStores?.length || 0})</span>
                      </button>
                    </div>

                    <button
                      onClick={handleQuarantineAllStores}
                      className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-sm flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                    >
                      <Ban size={14} />
                      <span>Quarantine All {trace.reverseStores?.length || 0} Outlets</span>
                    </button>
                  </div>
                </div>

                {/* Metric mini-cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">Mapped Outlets</span>
                    <div className="text-lg font-black text-black mt-0.5">{trace.reverseStores?.length || 0} Stores</div>
                    <span className="text-[10px] text-purple-700 font-bold">100% Traceable in Pune</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">Total Units Supplied</span>
                    <div className="text-lg font-black text-blue-900 mt-0.5">
                      {(trace.reverseStores || []).reduce((acc, s) => acc + s.receivedUnits, 0)} Units
                    </div>
                    <span className="text-[10px] text-slate-600 font-medium">To retail channels</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">Current Shelf Stock</span>
                    <div className="text-lg font-black text-rose-700 mt-0.5">
                      {(trace.reverseStores || []).reduce((acc, s) => acc + s.remainingUnits, 0)} Units
                    </div>
                    <span className="text-[10px] text-rose-800 font-bold">Risk to Consumers</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">Quarantined Outlets</span>
                    <div className="text-lg font-black text-emerald-800 mt-0.5">
                      {(trace.reverseStores || []).filter(s => isStoreQuarantined(s)).length} / {trace.reverseStores?.length || 0}
                    </div>
                    <span className="text-[10px] text-emerald-800 font-bold">Seizure Action Enforced</span>
                  </div>
                </div>

                {/* Conditional View: Pune Map vs Table */}
                {reverseStoresViewMode === 'map' ? (
                  <PuneRegionMap 
                    stores={trace.reverseStores || []}
                    currentBatchId={trace.batchId}
                    isExpiredBatch={trace.isExpired}
                    onQuarantineStore={handleQuarantineSingleStore}
                    quarantinedStoreNames={quarantinedStoreNames}
                  />
                ) : (
                /* Stores List Table */
                <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-2xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-black text-black uppercase tracking-wider">
                        <th className="p-3">Store / Retail Outlet</th>
                        <th className="p-3">Zonal District</th>
                        <th className="p-3 text-center">Received / On Shelf</th>
                        <th className="p-3">Delivery Date</th>
                        <th className="p-3">Store Contact</th>
                        <th className="p-3 text-center">Status</th>
                        <th className="p-3 text-right">Enforcement Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {(trace.reverseStores || []).map((store, idx) => {
                        const quarantined = isStoreQuarantined(store);
                        return (
                          <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-3">
                              <div className="font-black text-black text-sm flex items-center gap-1.5">
                                <Store size={15} className="text-purple-700 flex-shrink-0" />
                                <span>{store.storeName}</span>
                              </div>
                              <div className="text-[11px] text-slate-600 flex items-center gap-1 mt-0.5">
                                <MapPin size={12} className="text-slate-400 flex-shrink-0" />
                                <span>{store.storeAddress}</span>
                              </div>
                            </td>

                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                                {store.areaDistrict}
                              </span>
                            </td>

                            <td className="p-3 text-center font-mono">
                              <span className="font-bold text-slate-800">{store.receivedUnits} units</span>
                              <span className="text-slate-400 mx-1">/</span>
                              <span className={`font-black ${store.remainingUnits > 0 ? 'text-rose-700' : 'text-slate-500'}`}>
                                {store.remainingUnits} on shelf
                              </span>
                            </td>

                            <td className="p-3 font-mono font-medium text-slate-800">
                              {store.deliveryDate}
                            </td>

                            <td className="p-3">
                              <div className="font-bold text-black">{store.contactPerson}</div>
                              <a href={`tel:${store.phone}`} className="text-blue-700 font-mono text-[11px] hover:underline flex items-center gap-1 mt-0.5">
                                <Phone size={11} /> {store.phone}
                              </a>
                            </td>

                            <td className="p-3 text-center">
                              {quarantined ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-100 text-rose-950 border border-rose-300">
                                  <Ban size={11} /> QUARANTINED
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-950 border border-amber-300">
                                  <AlertTriangle size={11} /> ACTIVE ON SHELF
                                </span>
                              )}
                            </td>

                            <td className="p-3 text-right">
                              {quarantined ? (
                                <span className="text-[11px] font-bold text-emerald-800 flex items-center justify-end gap-1">
                                  <CheckCircle2 size={13} className="text-emerald-600" /> Notice Served
                                </span>
                              ) : (
                                <button
                                  onClick={() => handleQuarantineSingleStore(store.storeName)}
                                  className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-2xs transition-all active:scale-95 inline-flex items-center gap-1 cursor-pointer"
                                >
                                  <Ban size={12} />
                                  <span>Order Quarantine</span>
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                )}
              </div>
            )}

            {/* Tab: Regional Area Impact (SIH 2026 Step 5) */}
            {activeTab === 'regional_area' && trace.regionalAreaImpact && (
              <div className="space-y-4">
                {/* Region Header */}
                <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-300 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase font-mono bg-amber-700 text-white">
                        Area-Wise Surveillance & Containment
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase font-mono bg-rose-600 text-white animate-pulse">
                        {trace.regionalAreaImpact.riskLevel} RISK ZONE
                      </span>
                    </div>
                    <h3 className="text-base font-black text-black mt-1">
                      {trace.regionalAreaImpact.regionName}
                    </h3>
                    <p className="text-xs text-amber-950 font-semibold mt-0.5">
                      Surveillance perimeter active under Legal Metrology Directorate. Officer in charge: <strong>{trace.regionalAreaImpact.zonalOfficerInCharge}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={handleBroadcastZonalAdvisory}
                      className="px-3.5 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-black shadow-sm flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                    >
                      <Radio size={14} />
                      <span>Broadcast Zonal Advisory</span>
                    </button>
                    <button
                      onClick={handleDownloadNotice}
                      className="px-3 py-2 rounded-xl bg-white border border-amber-300 hover:bg-amber-100 text-amber-950 text-xs font-bold shadow-2xs flex items-center gap-1 cursor-pointer"
                    >
                      <Download size={13} />
                      <span>Download Containment Order</span>
                    </button>
                  </div>
                </div>

                {/* Regional Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">State & Circle Code</span>
                    <div className="text-xl font-mono font-black text-black mt-1">{trace.regionalAreaImpact.stateCode}</div>
                    <span className="text-xs font-medium text-slate-700 mt-0.5 block">Maharashtra / Pune Circle</span>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">Affected Outlets in Zone</span>
                    <div className="text-xl font-black text-rose-700 mt-1">{trace.regionalAreaImpact.totalOutletsAffected} Outlets</div>
                    <span className="text-xs font-medium text-slate-700 mt-0.5 block">Mapped across Pune & PCMC</span>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">Estimated Stock in Market</span>
                    <div className="text-xl font-black text-amber-700 mt-1">~{trace.regionalAreaImpact.estimatedUnitsInMarket} Units</div>
                    <span className="text-xs font-medium text-slate-700 mt-0.5 block">Across Pune Metropolitan Zone</span>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">Containment Status</span>
                    <div className="text-sm font-black text-emerald-800 mt-1 flex items-center gap-1">
                      <CheckCircle2 size={16} className="text-emerald-600" />
                      <span>Order Active</span>
                    </div>
                    <span className="text-xs font-medium text-slate-700 mt-0.5 block">{trace.regionalAreaImpact.containmentStatus}</span>
                  </div>
                </div>

                {/* Interactive Pune Geospatial Enforcement Map */}
                <PuneRegionMap 
                  stores={trace.reverseStores || []}
                  currentBatchId={trace.batchId}
                  isExpiredBatch={trace.isExpired}
                  onQuarantineStore={handleQuarantineSingleStore}
                  quarantinedStoreNames={quarantinedStoreNames}
                />

                {/* Regional Sub-Zones Breakdown Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-black text-xs text-black">Viman Nagar & Nagar Rd Corridor</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-100 text-rose-800">
                        Primary Discovery
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium">
                      Phoenix Marketcity, Nagar Rd, Kharadi IT Park
                    </p>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-600">Affected Stores: <strong>2</strong></span>
                      <span className="text-rose-700 font-bold">64 Units (Quarantined)</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-black text-xs text-black">Baner, Wakad & Hinjawadi</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-800">
                        Active Risk
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium">
                      Baner-Pashan Link Rd, Hinjawadi Phase 1 & 2
                    </p>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-600">Affected Stores: <strong>2</strong></span>
                      <span className="text-amber-700 font-bold">94 Units on Shelf</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-black text-xs text-black">Camp, Kothrud & Swargate</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 text-blue-800">
                        Central Zone
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium">
                      Moledina Rd, Karve Rd, Koregaon Park
                    </p>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-600">Affected Stores: <strong>3</strong></span>
                      <span className="text-blue-700 font-bold">85 Units on Shelf</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Smart Escalation Notice (SIH 2026 Step 6) */}
            {activeTab === 'escalation' && trace.smartEscalation && (
              <div className="space-y-4">
                {/* Escalation Header */}
                <div className="p-5 rounded-2xl bg-rose-50/70 border-2 border-rose-300 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase font-mono bg-rose-700 text-white">
                        Smart Escalation System
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase font-mono bg-emerald-700 text-white flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping" />
                        {escalationStatus}
                      </span>
                    </div>
                    <h3 className="text-base font-black text-black mt-1 flex items-center gap-2">
                      <span>Escalation Notice Ref:</span>
                      <span className="font-mono text-rose-900">{trace.smartEscalation.escalationId}</span>
                    </h3>
                    <p className="text-xs text-rose-950 font-semibold mt-0.5">
                      Automatically routed to Head of Legal Metrology upon detection of critical expiry violation.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={handleResendEscalation}
                      className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-sm flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                    >
                      <Send size={13} />
                      <span>Re-send Priority SMS & Email</span>
                    </button>
                    <button
                      onClick={handleDeployTeam}
                      className="px-3 py-2 rounded-xl bg-white border border-rose-300 hover:bg-rose-100 text-rose-950 text-xs font-bold shadow-2xs flex items-center gap-1 cursor-pointer"
                    >
                      <Users size={13} />
                      <span>Deploy Seizure Squad</span>
                    </button>
                  </div>
                </div>

                {/* Senior Officer Card & Directive Card */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Officer Recipient Card */}
                  <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h4 className="font-black text-xs text-slate-500 uppercase">Designated Senior Officer</h4>
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        State Headquarters
                      </span>
                    </div>
                    
                    <div>
                      <h5 className="font-black text-base text-black">{trace.smartEscalation.recipientName}</h5>
                      <span className="text-xs font-bold text-slate-700 block mt-0.5">
                        {trace.smartEscalation.recipientRole}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-800">
                      <div className="flex items-center gap-2">
                        <Mail size={13} className="text-slate-500" />
                        <a href={`mailto:${trace.smartEscalation.recipientEmail}`} className="text-blue-700 font-mono hover:underline">
                          {trace.smartEscalation.recipientEmail}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={13} className="text-slate-500" />
                        <span>Dispatched: <strong className="font-mono">{trace.smartEscalation.sentTimestamp}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ShieldCheck size={13} className="text-emerald-600" />
                        <span className="text-emerald-800 font-bold">Portal Log: Recorded on Central Database</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <button
                        onClick={() => handleCopyText(trace.smartEscalation.escalationId, 'esc-id')}
                        className="w-full py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-black text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {copiedId === 'esc-id' ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                        <span>{copiedId === 'esc-id' ? 'Copied Escalation ID!' : 'Copy Escalation ID'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Official Legal Directive Card */}
                  <div className="lg:col-span-2 p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <h4 className="font-black text-xs text-slate-500 uppercase">Enforcement Action Directive</h4>
                        <span className="text-[10px] font-mono font-bold bg-rose-100 text-rose-900 px-2 py-0.5 rounded">
                          {trace.smartEscalation.severityLevel}
                        </span>
                      </div>

                      <p className="mt-3 text-xs leading-relaxed text-slate-900 font-semibold bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                        "{trace.smartEscalation.actionDirective}"
                      </p>

                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 bg-blue-50/60 rounded-lg border border-blue-200">
                          <span className="text-slate-600 block text-[11px] font-bold">Legal Metrology Act, 2009</span>
                          <span className="font-black text-black">Section 36 & 39 Seizure Mandate</span>
                        </div>
                        <div className="p-2.5 bg-amber-50/60 rounded-lg border border-amber-200">
                          <span className="text-slate-600 block text-[11px] font-bold">Mandated Timeline</span>
                          <span className="font-black text-amber-950">Seizure within 24h / Summons 48h</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <span className="text-[11px] text-slate-600 font-medium">
                        Electronic signature verified via Yatarth Enforcement Key
                      </span>
                      <button
                        onClick={() => handleCopyText(trace.smartEscalation.actionDirective, 'directive')}
                        className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-900 hover:bg-blue-100 text-xs font-bold flex items-center gap-1 border border-blue-200 cursor-pointer"
                      >
                        {copiedId === 'directive' ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                        <span>{copiedId === 'directive' ? 'Directive Copied!' : 'Copy Directive'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Raw Material Suppliers Full Table */}
            {activeTab === 'suppliers' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-300 bg-slate-100 text-[11px] font-black text-black uppercase tracking-wider">
                      <th className="p-3">Material / Ingredient</th>
                      <th className="p-3">Supplier & Facility</th>
                      <th className="p-3">Origin Location</th>
                      <th className="p-3">Supplier Lot #</th>
                      <th className="p-3">Quality Certificate</th>
                      <th className="p-3 text-right">Purity Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {trace.rawSuppliers.map((s, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-3 font-black text-black">{s.material}</td>
                        <td className="p-3 font-bold text-slate-800">{s.supplierName}</td>
                        <td className="p-3 text-slate-700">{s.originLocation}</td>
                        <td className="p-3 font-mono font-bold text-black">{s.lotNumber}</td>
                        <td className="p-3 font-mono text-slate-700">{s.qualityCertificateNo}</td>
                        <td className="p-3 text-right font-mono font-black text-emerald-700">{s.purityScore}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Tab 3: Generated Legal Seizure Notice Preview */}
            {activeTab === 'notice' && (
              <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs space-y-2 overflow-x-auto shadow-inner">
                <div className="flex items-center justify-between pb-2 border-b border-slate-700">
                  <span className="text-amber-400 font-bold flex items-center gap-1.5">
                    <ShieldAlert size={14} /> OFFICIAL LEGAL NOTICE READY FOR ENFORCEMENT
                  </span>
                  <button
                    onClick={handleDownloadNotice}
                    className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] flex items-center gap-1"
                  >
                    <Download size={12} /> Download Notice
                  </button>
                </div>
                <pre className="whitespace-pre-wrap leading-relaxed text-slate-200 text-[11px]">
{`CENTRAL LEGAL METROLOGY & CONSUMER SAFETY ENFORCEMENT DIRECTIVE
================================================================================
NOTICE REF: LM-SEIZE-${trace.batchId}
TARGET: ${currentProduct.name} (Batch: ${trace.batchId})
EXPIRY STATUS: ${trace.isExpired ? 'EXPIRED (Use By: ' + trace.expDate + ')' : 'UNEXPIRED'}
FOUND AT: ${trace.retailer.storeName} (${trace.retailer.storeAddress})
UNITS RECORDED: ${trace.retailer.unitsOnShelf} units on shelf

SUPPLY LINEAGE AUDIT TRAIL:
1. RETAIL OUTLET: ${trace.retailer.storeName}
2. WHOLESALE HUB: ${trace.wholesaler.name} (Lot: ${trace.wholesaler.inventoryLotId})
3. LOGISTICS/DISTRIBUTOR: ${trace.distributor.name} (Dispatch: ${trace.distributor.dispatchInvoiceNo})
4. PRODUCER/MANUFACTURER: ${trace.manufacturer.entityName} (Lic: ${trace.mfgLicenseNumber})
   PLANT LOCATION: ${trace.manufacturer.plantLocation}
   DIRECTOR/MANAGER: ${trace.manufacturer.plantManager}

DIRECTIVE:
1. Cease all retail transactions of Batch ${trace.batchId} immediately.
2. Quarantine all remaining stock at Wholesaler depot (${trace.wholesaler.depotLocation}).
3. Issue formal show-cause summons to manufacturer within 48 hours.`}
                </pre>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-300">
          <AlertTriangle size={32} className="mx-auto text-amber-500 mb-2" />
          <h3 className="font-bold text-base text-black">No Trace Record Found</h3>
          <p className="text-xs text-slate-600 mt-1">Select a registered batch above to inspect its supply chain trace.</p>
        </div>
      )}
    </div>
  );
};
