import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Upload, 
  Scan, 
  Camera, 
  CheckCircle2, 
  RefreshCw,
  Zap, 
  Store, 
  MapPin, 
  FileText, 
  Info, 
  Navigation, 
  Check, 
  Download, 
  Eye, 
  ShieldCheck, 
  AlertTriangle, 
  XCircle,
  CameraOff,
  Crosshair,
  Maximize2,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  ArrowRight,
  Printer,
  Network,
  IndianRupee,
  Edit3,
  FileCheck
} from 'lucide-react';
import { Product, ReportItem, BoundingBox } from '../types';

export const ScanProductView: React.FC = () => {
  const { addNewScanResult, products, addNewReport, currentUser, setCurrentTab, setSelectedProductId, setSelectedTraceBatchId } = useApp();

  // Workflow Steps:
  // 1 = Shop & Location
  // 2 = Take Photo of Label
  // 3 = Running Rules Check
  // 4 = Photo Proof & Errors
  // 5 = Generate & Save Report
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Inspector & Store Metadata
  const [storeName, setStoreName] = useState<string>('Star Bazaar Hypermarket');
  const [storeLocation, setStoreLocation] = useState<string>('Detecting GPS location...');
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [gpsCoordinates, setGpsCoordinates] = useState<{ lat: number; lng: number } | null>({ lat: 12.9716, lng: 77.5946 });
  const [showOptionalFields, setShowOptionalFields] = useState<boolean>(false);
  const [sampleBatchId, setSampleBatchId] = useState<string>('SMP-2026-8812');
  const [observedRetailPrice, setObservedRetailPrice] = useState<string>('₹ 240.00');
  const [officerNotes, setOfficerNotes] = useState<string>('Sample collected from shelf during routine shop inspection.');

  // Statutory Fine & Legal Notice State (Editable)
  const [assessedFine, setAssessedFine] = useState<number>(25000);
  const [legalSection, setLegalSection] = useState<string>('Section 36(1) - Penalty for manufacturing/selling non-standard packages (Up to ₹25,000)');
  const [offenceType, setOffenceType] = useState<string>('First Offence (Compounding Notice under Sec 48)');
  const [inspectorFineNotes, setInspectorFineNotes] = useState<string>(
    'Sample collected from retail shelf during routine market inspection. Notice served under Section 36/39 Legal Metrology Act 2009.'
  );
  const [showNoticeModal, setShowNoticeModal] = useState<boolean>(false);

  // Selected Sample / Captured Image
  const [selectedPresetId, setSelectedPresetId] = useState<string>('prod-01');
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Rules Check Engine State
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [engineStage, setEngineStage] = useState<number>(0);
  const [engineProgress, setEngineProgress] = useState<number>(0);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);

  // Evidence & Bounding Boxes
  const [inspectedProduct, setInspectedProduct] = useState<Product>(products[0]);
  const [evidenceFilter, setEvidenceFilter] = useState<'all' | 'compliant' | 'violation'>('all');
  const [selectedBoxId, setSelectedBoxId] = useState<string | null>(null);
  const [capturedEvidenceLog, setCapturedEvidenceLog] = useState<string[]>([]);
  const [evidenceSnapshotTaken, setEvidenceSnapshotTaken] = useState<boolean>(false);

  // Report State
  const [generatedReport, setGeneratedReport] = useState<ReportItem | null>(null);
  const [isReportSaved, setIsReportSaved] = useState<boolean>(false);

  // Popular Store Quick Picks
  const STORE_SUGGESTIONS = [
    'Star Bazaar Hypermarket',
    'Reliance Smart Superstore',
    'D-Mart Wholesale Hub',
    'Spencer\'s Retail',
    'Nature\'s Basket Supermarket',
    'City Central Kirana Store'
  ];

  // Auto-detect inspector GPS location on mount
  useEffect(() => {
    detectInspectorLocation();
  }, []);

  const detectInspectorLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = parseFloat(position.coords.latitude.toFixed(4));
          const lng = parseFloat(position.coords.longitude.toFixed(4));
          setGpsCoordinates({ lat, lng });
          setStoreLocation(`${lat}° N, ${lng}° E • Zonal Ward 82`);
          setIsLocating(false);
        },
        () => {
          // Reliable fallback
          setGpsCoordinates({ lat: 12.9716, lng: 77.5946 });
          setStoreLocation('12.9716° N, 77.5946° E • Indiranagar 100ft Rd, Ward 82');
          setIsLocating(false);
        },
        { timeout: 4000 }
      );
    } else {
      setStoreLocation('12.9716° N, 77.5946° E • Central District Ward 82');
      setIsLocating(false);
    }
  };

  const activeProduct = products.find((p) => p.id === selectedPresetId) || products[0];

  // Run Rules Check
  const handleRunComplianceEngine = () => {
    const currentStore = storeName.trim() || 'Star Bazaar Hypermarket';
    const currentLocation = storeLocation.trim() || '12.9716° N, 77.5946° E';

    const mergedProduct: Product = {
      ...activeProduct,
      storeName: currentStore,
      storeLocation: currentLocation,
      sampleBatchId: sampleBatchId.trim() || `SMP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      observedRetailPrice: observedRetailPrice.trim() || '₹ 240.00',
      officerNotes: officerNotes.trim()
    };

    // Calculate statutory penalty based on Legal Metrology Act 2009
    const calculatedPenalty = mergedProduct.violations.reduce((sum, v) => {
      if (v.severity === 'critical') return sum + 25000;
      if (v.severity === 'medium') return sum + 10000;
      return sum + 5000;
    }, 0);

    setAssessedFine(calculatedPenalty);
    if (mergedProduct.violations.some(v => v.severity === 'critical')) {
      setLegalSection('Section 36(1) - Penalty for manufacturing/selling non-standard packages (Up to ₹25,000)');
    } else if (mergedProduct.violations.some(v => v.severity === 'medium')) {
      setLegalSection('Section 39 - Contravention of Packaged Commodity Rules 2011 (Up to ₹25,000)');
    } else if (mergedProduct.violations.length > 0) {
      setLegalSection('Section 32 - Failure to use standard metric units (Schedule I/II) (Up to ₹10,000)');
    } else {
      setLegalSection('Rule Compliant (Zero Statutory Penalty under PCR 2011)');
    }

    setInspectedProduct(mergedProduct);
    setCurrentStep(3); // Go to Engine Running
    setIsProcessing(true);
    setEngineStage(0);
    setEngineProgress(10);
    setEvidenceSnapshotTaken(false);
    setGeneratedReport(null);
    setIsReportSaved(false);

    setConsoleLogs([
      `[00:00:01] Starting Legal Metrology Rules Check...`,
      `[GPS Location Locked] Inspector Location: ${currentLocation}`,
      `[Shop Details] Store Name: ${currentStore}`,
      `[Product Sample] Selected Product: ${mergedProduct.name} (Code: ${mergedProduct.sku})`,
      `[Rules Check] Reading package label and testing rules (MRP, Net Qty, Dates, Company Name)...`
    ]);

    const stages = [
      `[Text Reading] Read 16 text fields on the package label.`,
      `[Net Quantity Check] Found: "${mergedProduct.declarations[0]?.detectedValue || '250 g'}". Checking font size requirement.`,
      `[MRP & Price Check] Found: "${mergedProduct.declarations[1]?.detectedValue || '₹ 185.00'}". Checking unit sale price requirement.`,
      mergedProduct.violations.length > 0 
        ? `[Rule Violation] Found ${mergedProduct.violations.length} packaging label error(s) under packaging rules.`
        : `[All Passed] All required labels meet legal rules.`,
      `[Penalty Assessment] Calculated Statutory Fine under Legal Metrology Act 2009: ₹ ${calculatedPenalty.toLocaleString('en-IN')}`,
      `[Proof Ready] Photo proof, editable statutory penalty assessment, and notice orders are ready.`
    ];

    let current = 0;
    const interval = setInterval(() => {
      current++;
      setEngineStage(current);
      setEngineProgress(Math.min(100, Math.round(((current + 1) / (stages.length + 1)) * 100)));
      
      if (stages[current - 1]) {
        setConsoleLogs((prev) => [...prev, stages[current - 1]]);
      }

      if (current >= stages.length) {
        clearInterval(interval);
        setTimeout(() => {
          setIsProcessing(false);
          setCurrentStep(4); // Move to Evidence Step
        }, 500);
      }
    }, 550);
  };

  // Step 4: Take Photo Proof Snapshot
  const handleTakeEvidenceSnapshot = () => {
    const timestamp = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const evidenceCode = `LM-PROOF-${Math.floor(1000 + Math.random() * 9000)}`;
    const record = `Proof #${evidenceCode} saved at ${timestamp} • Location: ${storeLocation} • Shop: ${storeName}`;
    setCapturedEvidenceLog((prev) => [record, ...prev]);
    setEvidenceSnapshotTaken(true);
  };

  // Step 5: Generate Report
  const handleGenerateReport = () => {
    const reportId = 'rep-' + Date.now();
    const reportNum = `LM-REP-${inspectedProduct.sku.replace('YAT-', '')}-${Math.floor(100 + Math.random() * 900)}`;
    
    const newReport: ReportItem = {
      id: reportId,
      reportNumber: reportNum,
      title: `${inspectedProduct.name} - Official Inspection Report`,
      type: 'Product Compliance',
      generatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      author: currentUser.name,
      scope: `Shop: ${storeName} (${storeLocation}) | Product: ${inspectedProduct.name}`,
      complianceRate: inspectedProduct.complianceScore,
      criticalIssuesCount: inspectedProduct.criticalIssues,
      status: 'ready',
      fileSize: '2.8 MB',
      storeName: storeName,
      storeLocation: storeLocation,
      productId: inspectedProduct.id,
      evidenceCount: (inspectedProduct.sides[0]?.boundingBoxes || []).length
    };

    setGeneratedReport(newReport);
    setCurrentStep(5); // Move to Report Step
  };

  // Step 6: Save Report for this particular product
  const handleSaveReportForProduct = () => {
    if (!generatedReport) return;

    // 1. Add to official reports archive
    addNewReport(generatedReport);

    // 2. Save inspected product with its store metadata
    addNewScanResult(inspectedProduct);
    setSelectedProductId(inspectedProduct.id);

    setIsReportSaved(true);
  };

  // Reset to start new inspection
  const handleReset = () => {
    setCurrentStep(1);
    setIsProcessing(false);
    setEvidenceSnapshotTaken(false);
    setGeneratedReport(null);
    setIsReportSaved(false);
    setCapturedImage(null);
  };

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCapturedImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Comprehensive Download CSV helper with fine calculation
  const handleDownloadReportCSV = () => {
    const noticeNum = generatedReport?.reportNumber || `LM-NOT-${inspectedProduct.sku.replace('YAT-', '')}-${Date.now().toString().slice(-4)}`;
    const headerRows = [
      `"GOVERNMENT OF INDIA - DIRECTORATE OF LEGAL METROLOGY"`,
      `"OFFICIAL NOTICE OF SEIZURE & COMPOUNDING PENALTY ASSESSMENT ORDER"`,
      `"Notice Number:","${noticeNum}"`,
      `"Assessment Date:","${new Date().toLocaleDateString('en-IN')} ${new Date().toLocaleTimeString('en-IN')}"`,
      `"Inspecting Officer:","${currentUser.name}"`,
      `"Retail Establishment:","${storeName}"`,
      `"GPS Location:","${storeLocation}"`,
      `"Product Name:","${inspectedProduct.name}"`,
      `"SKU / Code:","${inspectedProduct.sku}"`,
      `"Batch Number:","${inspectedProduct.sampleBatchId || inspectedProduct.batchNumber || 'SMP-2026-8812'}"`,
      `"Compliance Score:","${inspectedProduct.complianceScore}%"`,
      `"Total Violations:","${inspectedProduct.violations.length}"`,
      `"Applicable Statutory Section:","${legalSection}"`,
      `"Offence Severity:","${offenceType}"`,
      `"TOTAL ASSESSED COMPOUNDING PENALTY:","INR ${assessedFine.toLocaleString('en-IN')}"`,
      `"Statutory Directives / Order:","${inspectorFineNotes.replace(/"/g, '""')}"`,
      `""`,
      `"VIOLATIONS REGISTER & PENALTY BREAKDOWN:"`,
      `"Rule Code","Violation Description","Severity","Recommended Legal Action","Penalty Amount"`
    ];

    const violationRows = inspectedProduct.violations.map(v => 
      `"${v.ruleCode}","${v.title.replace(/"/g, '""')}","${v.severity.toUpperCase()}","${v.recommendedAction.replace(/"/g, '""')}","INR ${v.severity === 'critical' ? '25,000' : v.severity === 'medium' ? '10,000' : '5,000'}"`
    );

    const fullCsv = [...headerRows, ...violationRows].join('\n');
    const blob = new Blob([fullCsv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LegalMetrology_FineNotice_${inspectedProduct.sku}_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const currentSide = inspectedProduct.sides[0];
  const boundingBoxes = currentSide?.boundingBoxes || [];

  const filteredBoxes = boundingBoxes.filter((box: BoundingBox) => {
    if (evidenceFilter === 'all') return true;
    if (evidenceFilter === 'compliant') return box.status === 'detected';
    if (evidenceFilter === 'violation') return box.status === 'missing' || box.status === 'needs_review';
    return true;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in text-black font-sans">
      {/* Studio Header - High Contrast & Simple Words */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-black tracking-tight">Legal Metrology Product Scan & Inspection</h1>
            <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-full bg-blue-50 text-blue-800 border border-blue-300">
              OFFICIAL STORE SCAN
            </span>
          </div>
          <p className="text-sm font-semibold text-black mt-1">
            Scan product packages, automatically save shop location, check all legal rules, collect photo proof, and save official inspection reports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-black font-bold">Inspector:</span>
            <span className="font-black text-black">{currentUser.name}</span>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-black hover:bg-slate-100 text-xs font-bold transition-all shadow-xs"
          >
            <RefreshCw size={13} />
            <span>New Scan</span>
          </button>
        </div>
      </div>

      {/* 5-Step Inspector Workflow Navigation Bar - Clean, Bold Black Text */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {[
            { step: 1, label: '1. Store & Location', icon: Store, active: currentStep === 1, done: currentStep > 1 },
            { step: 2, label: '2. Capture Label', icon: Camera, active: currentStep === 2, done: currentStep > 2 },
            { step: 3, label: '3. Check Rules', icon: Scan, active: currentStep === 3, done: currentStep > 3 },
            { step: 4, label: '4. Proof & Violations', icon: Crosshair, active: currentStep === 4, done: currentStep > 4 },
            { step: 5, label: '5. Generate & Save Report', icon: FileText, active: currentStep === 5, done: isReportSaved }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.step}
                onClick={() => {
                  if (item.step <= Math.max(currentStep, 2)) {
                    setCurrentStep(item.step);
                  }
                }}
                className={`flex items-center gap-2.5 p-2.5 rounded-xl text-left transition-all border ${
                  item.active
                    ? 'bg-blue-50/90 border-blue-500 text-blue-950 shadow-2xs'
                    : item.done
                    ? 'bg-slate-50 border-slate-300 text-black hover:bg-slate-100'
                    : 'bg-white border-transparent text-slate-700 cursor-not-allowed'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  item.active
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : item.done
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : 'bg-slate-200 text-slate-800'
                }`}>
                  {item.done ? <Check size={14} className="stroke-[3]" /> : <Icon size={14} />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-black text-black truncate leading-tight">{item.label}</p>
                  <p className={`text-[11px] font-bold truncate ${item.active ? 'text-blue-900' : item.done ? 'text-emerald-800' : 'text-slate-800'}`}>
                    {item.active ? 'Current Step' : item.done ? 'Completed' : 'Next Step'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 1: Inspector Location & Store Premises */}
      {currentStep === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: GPS & Store Entry */}
          <div className="lg:col-span-7 space-y-5">
            {/* Automatic GPS Location Card */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-300">
                    <Navigation size={16} className={isLocating ? 'animate-spin' : ''} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-black">Automatic GPS Location</h3>
                    <p className="text-xs font-semibold text-black">Auto-saves shop location as official legal proof</p>
                  </div>
                </div>

                <button
                  onClick={detectInspectorLocation}
                  disabled={isLocating}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-black text-xs font-black transition-all border border-slate-300 shadow-xs"
                >
                  <RefreshCw size={12} className={isLocating ? 'animate-spin text-blue-600' : ''} />
                  <span>{isLocating ? 'Locating...' : 'Refresh GPS'}</span>
                </button>
              </div>

              {/* Coordinates Pill */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <MapPin size={16} className="text-emerald-700 flex-shrink-0" />
                  <div>
                    <span className="font-mono font-black text-black">{storeLocation}</span>
                    <span className="text-xs font-bold text-black block">Legal Metrology Inspection Zone</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 text-[10px] font-mono font-black rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                  GPS LOCKED
                </span>
              </div>
            </div>

            {/* Store Name Input & Quick Suggestions */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div>
                <label className="text-xs font-black text-black flex items-center gap-1.5 mb-1.5">
                  <Store size={15} className="text-blue-600" />
                  <span>Store / Shop Name</span>
                  <span className="text-rose-600 font-black">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Type shop name (e.g. Star Bazaar, Reliance Smart, D-Mart...)"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-bold text-black placeholder-slate-500 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              {/* Quick Pick Store Pills */}
              <div>
                <p className="text-xs font-bold text-black mb-2">Popular Retail Stores (1-Click to Select):</p>
                <div className="flex flex-wrap gap-1.5">
                  {STORE_SUGGESTIONS.map((store) => (
                    <button
                      key={store}
                      onClick={() => setStoreName(store)}
                      className={`px-3 py-1.5 text-xs rounded-lg border transition-all font-bold ${
                        storeName === store
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-slate-100 text-black border-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {store}
                    </button>
                  ))}
                </div>
              </div>

              {/* Collapsible Optional Parameters (Zero information overload!) */}
              <div className="pt-2 border-t border-slate-200">
                <button
                  onClick={() => setShowOptionalFields(!showOptionalFields)}
                  className="flex items-center justify-between w-full text-xs font-black text-black hover:text-blue-700 py-1"
                >
                  <span className="flex items-center gap-1.5">
                    <Info size={14} className="text-blue-600" />
                    Extra Details (Optional - Batch Number, Observed Price, Notes)
                  </span>
                  {showOptionalFields ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {showOptionalFields && (
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-300">
                    <div>
                      <label className="text-xs font-bold text-black block mb-1">Batch Number</label>
                      <input
                        type="text"
                        value={sampleBatchId}
                        onChange={(e) => setSampleBatchId(e.target.value)}
                        placeholder="SMP-2026-8812"
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-black focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-black block mb-1">Observed Shelf Price (MRP)</label>
                      <input
                        type="text"
                        value={observedRetailPrice}
                        onChange={(e) => setObservedRetailPrice(e.target.value)}
                        placeholder="₹ 240.00"
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-black focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-black block mb-1">Inspector Notes / Seizure Reason</label>
                      <input
                        type="text"
                        value={officerNotes}
                        onChange={(e) => setOfficerNotes(e.target.value)}
                        placeholder="e.g. Routine market check during festival season"
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-black focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Next Step Button */}
            <button
              onClick={() => setCurrentStep(2)}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow transition-all active:scale-98"
            >
              <span>Confirm Shop & Next: Scan Package Label</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Right Column: Clear Guidance */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-sm font-black text-black flex items-center gap-2">
                <ShieldCheck size={16} className="text-blue-600" />
                Legal Metrology Rules Checked
              </h3>
              <p className="text-xs font-semibold text-black leading-relaxed">
                As per <strong>The Legal Metrology Act, 2009</strong> and <strong>Packaged Commodities Rules (PCR), 2011</strong>, every packaged product sold in stores must follow these rules:
              </p>

              <div className="space-y-2 pt-2 border-t border-slate-200 text-xs">
                <div className="flex items-center gap-2 text-black font-semibold">
                  <CheckCircle2 size={15} className="text-emerald-700 flex-shrink-0" />
                  <span>Rule 6: Mandatory 6 items (MRP, Net Qty, Dates, Company Name, Address, Customer Care)</span>
                </div>
                <div className="flex items-center gap-2 text-black font-semibold">
                  <CheckCircle2 size={15} className="text-emerald-700 flex-shrink-0" />
                  <span>Rule 7: Numbers must be large enough to read easily (minimum font height)</span>
                </div>
                <div className="flex items-center gap-2 text-black font-semibold">
                  <CheckCircle2 size={15} className="text-emerald-700 flex-shrink-0" />
                  <span>Rule 18: MRP must include all taxes, and Unit Sale Price must be printed</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50 border border-blue-300 text-xs text-black space-y-1">
              <div className="flex items-center gap-1.5 font-black text-blue-900">
                <Info size={15} className="text-blue-700" />
                <span>Quick & Easy for Field Inspectors</span>
              </div>
              <p className="font-semibold text-black">
                All legal rules and location coordinates are filled automatically. Just enter the shop name and capture the package photo.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Capture / Select Packaging Label */}
      {currentStep === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Interactive Capture Area */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-black">Take Photo or Upload Package Label</h3>
                  <p className="text-xs font-semibold text-black">Use camera or upload a clear photo of the front or back package label</p>
                </div>
                <button
                  onClick={() => setCameraActive(!cameraActive)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all border ${
                    cameraActive
                      ? 'bg-rose-50 text-rose-800 border-rose-300'
                      : 'bg-blue-50 text-blue-800 border-blue-300'
                  }`}
                >
                  {cameraActive ? <CameraOff size={13} /> : <Camera size={13} />}
                  <span>{cameraActive ? 'Close Camera' : 'Open Camera'}</span>
                </button>
              </div>

              {/* Camera Simulator Viewfinder */}
              {cameraActive ? (
                <div className="relative rounded-2xl bg-slate-950 text-white overflow-hidden aspect-[4/3] flex flex-col items-center justify-center border border-slate-800 shadow-inner">
                  {/* Viewfinder Overlay Grid */}
                  <div className="absolute inset-4 border-2 border-dashed border-blue-400/70 rounded-xl pointer-events-none flex flex-col justify-between p-4">
                    <div className="flex justify-between items-center text-[10px] font-mono text-blue-200 font-bold">
                      <span>[ALIGN PACKAGE LABEL]</span>
                      <span>CAMERA ACTIVE</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-mono text-blue-200 font-bold">
                      <span>STORE: {storeName.slice(0, 24)}</span>
                      <span>GPS: LOCKED</span>
                    </div>
                  </div>

                  {/* Active sample image preview in viewfinder */}
                  <img
                    src={capturedImage || activeProduct.sides[0]?.imageUrl}
                    alt="Packaging Viewfinder"
                    className="w-full h-full object-contain opacity-85"
                  />

                  {/* Capture Trigger Button */}
                  <div className="absolute bottom-4 flex items-center gap-3">
                    <button
                      onClick={() => setCameraActive(false)}
                      className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-black text-xs flex items-center gap-2 shadow-lg active:scale-95 transition-all"
                    >
                      <Camera size={15} />
                      <span>Take Photo</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Drag and drop / file upload box */
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-2xl border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/40 p-8 flex flex-col items-center justify-center cursor-pointer transition-all group"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-xs border border-slate-300 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform mb-3">
                    <Upload size={24} />
                  </div>
                  <h4 className="text-sm font-black text-black group-hover:text-blue-700 transition-colors">
                    Click here to upload package photo
                  </h4>
                  <p className="text-xs font-semibold text-black mt-1 text-center max-w-sm">
                    Supports JPG, PNG, WEBP. Front display panels and label information panels are checked automatically.
                  </p>
                </div>
              )}

              {/* Current Preview Banner */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-300 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={capturedImage || activeProduct.sides[0]?.imageUrl}
                    alt={activeProduct.name}
                    className="w-12 h-12 object-contain bg-white p-1 rounded-lg border border-slate-300"
                  />
                  <div>
                    <h5 className="text-xs font-black text-black">{activeProduct.name}</h5>
                    <p className="text-xs font-bold text-black font-mono">Code: {activeProduct.sku} • Shop: {storeName}</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-300">
                  READY TO CHECK
                </span>
              </div>
            </div>

            {/* Run Engine Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-4 py-3.5 rounded-xl bg-white border border-slate-300 text-black hover:bg-slate-100 font-bold text-xs shadow-xs"
              >
                Back
              </button>
              <button
                onClick={handleRunComplianceEngine}
                className="flex-1 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow transition-all active:scale-98"
              >
                <Scan size={18} />
                <span>Run Legal Rules Check</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-500 text-center font-medium">
              * Used synthetic data for prototype demonstration
            </p>
          </div>

          {/* Right: Curated Inspected Commodity Presets */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-black flex items-center gap-2">
                  <Zap size={16} className="text-amber-500" />
                  Or Choose a Demo Product
                </h3>
                <span className="text-[10px] font-mono font-black text-blue-900 bg-blue-100 px-2 py-0.5 rounded border border-blue-300">
                  DEMO SAMPLES
                </span>
              </div>
              <p className="text-xs font-bold text-black">
                Pick a sample product to test how the system finds packaging label errors:
              </p>

              <div className="space-y-2.5">
                {products.slice(0, 4).map((p) => {
                  const isSelected = selectedPresetId === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        setSelectedPresetId(p.id);
                        setCapturedImage(null);
                      }}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                        isSelected
                          ? 'bg-blue-50 border-blue-500 shadow-xs'
                          : 'bg-white border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <img
                        src={p.sides[0]?.imageUrl}
                        alt={p.name}
                        className="w-10 h-10 object-contain bg-white rounded border border-slate-300 p-0.5"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black text-black truncate">{p.name}</h4>
                          <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded ${
                            p.complianceScore >= 85
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              : 'bg-rose-100 text-rose-900 border border-rose-300'
                          }`}>
                            Score: {p.complianceScore}/100
                          </span>
                        </div>
                        <p className="text-xs font-bold text-black mt-0.5 truncate">
                          {p.violations.length > 0 ? `${p.violations.length} error(s) found` : 'All Rules Passed (Compliant)'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-slate-200">
                <p className="text-[11px] text-slate-500 font-medium text-center sm:text-left">
                  * Used synthetic data for prototype demonstration
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Rules Check Running Telemetry */}
      {currentStep === 3 && (
        <div className="max-w-3xl mx-auto space-y-6 py-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-300">
                  <RefreshCw size={20} className="animate-spin text-blue-600" />
                </div>
                <div>
                  <h3 className="text-base font-black text-black">Checking Package Against Legal Rules...</h3>
                  <p className="text-xs font-bold text-black">Reading package text and checking MRP, Net Quantity, Dates, and company info</p>
                </div>
              </div>
              <span className="text-sm font-mono font-black text-blue-700 bg-blue-50 px-3 py-1 rounded-lg border border-blue-300">
                {engineProgress}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${engineProgress}%` }}
              />
            </div>

            {/* Live Progress Box */}
            <div className="bg-slate-900 rounded-xl p-4 font-mono text-xs text-slate-100 space-y-1.5 h-44 overflow-y-auto border border-slate-800">
              {consoleLogs.map((log, idx) => (
                <p
                  key={idx}
                  className={
                    log.includes('[Rule Violation]')
                      ? 'text-rose-400 font-bold'
                      : log.includes('[All Passed]') || log.includes('[GPS Location Locked]')
                      ? 'text-emerald-400 font-bold'
                      : 'text-slate-200'
                  }
                >
                  {log}
                </p>
              ))}
            </div>

            <div className="flex items-center justify-center text-xs text-black font-bold gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span>Analyzing package label surfaces and measuring number heights...</span>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: Take & Review Visual Evidence */}
      {currentStep === 4 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 7 cols: Interactive Packaging Label with Bounding Boxes */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200">
                <div>
                  <h3 className="text-sm font-black text-black flex items-center gap-2">
                    <Crosshair size={16} className="text-blue-600" />
                    Package Label Photo & Marked Proof
                  </h3>
                  <p className="text-xs font-semibold text-black">Colored boxes show detected label text and rule errors</p>
                </div>

                {/* Evidence Filters */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-300 text-xs">
                  <button
                    onClick={() => setEvidenceFilter('all')}
                    className={`px-2.5 py-1 rounded-md font-black transition-all ${
                      evidenceFilter === 'all' ? 'bg-white text-black shadow-2xs border border-slate-300' : 'text-black'
                    }`}
                  >
                    All ({boundingBoxes.length})
                  </button>
                  <button
                    onClick={() => setEvidenceFilter('compliant')}
                    className={`px-2.5 py-1 rounded-md font-black transition-all ${
                      evidenceFilter === 'compliant' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-emerald-800'
                    }`}
                  >
                    Pass
                  </button>
                  <button
                    onClick={() => setEvidenceFilter('violation')}
                    className={`px-2.5 py-1 rounded-md font-black transition-all ${
                      evidenceFilter === 'violation' ? 'bg-rose-600 text-white shadow-2xs' : 'text-rose-800'
                    }`}
                  >
                    Violations ({inspectedProduct.violations.length})
                  </button>
                </div>
              </div>

              {/* Interactive Packaging Image with Bounding Boxes */}
              <div className="relative rounded-xl border border-slate-300 bg-slate-50 overflow-hidden flex items-center justify-center p-2 min-h-[380px]">
                <img
                  src={inspectedProduct.sides[0]?.imageUrl}
                  alt={inspectedProduct.name}
                  className="max-h-[360px] w-auto object-contain select-none"
                />

                {/* Render Bounding Boxes */}
                {filteredBoxes.map((box: BoundingBox) => {
                  const isViolation = box.status === 'missing' || box.status === 'needs_review';
                  const isSelected = selectedBoxId === box.id;

                  return (
                    <div
                      key={box.id}
                      onClick={() => setSelectedBoxId(box.id)}
                      style={{
                        left: `${box.x}%`,
                        top: `${box.y}%`,
                        width: `${box.width}%`,
                        height: `${box.height}%`
                      }}
                      className={`absolute cursor-pointer transition-all border-2 rounded ${
                        isViolation
                          ? isSelected
                            ? 'border-rose-600 bg-rose-500/30 ring-2 ring-rose-400'
                            : 'border-rose-500 bg-rose-500/20 hover:bg-rose-500/30'
                          : isSelected
                          ? 'border-emerald-600 bg-emerald-500/30 ring-2 ring-emerald-400'
                          : 'border-emerald-500 bg-emerald-500/20 hover:bg-emerald-500/30'
                      }`}
                      title={`${box.field}: ${box.detectedText}`}
                    >
                      <span className={`absolute -top-5 left-0 px-1.5 py-0.5 text-[9px] font-mono font-black text-white rounded shadow-xs whitespace-nowrap ${
                        isViolation ? 'bg-rose-600' : 'bg-emerald-600'
                      }`}>
                        {box.field}
                      </span>
                    </div>
                  );
                })}

                {/* Watermark overlay for legal validity */}
                <div className="absolute bottom-2 left-2 bg-slate-900/90 backdrop-blur-xs text-white text-[11px] font-mono font-bold px-2.5 py-1 rounded-md border border-slate-700 pointer-events-none">
                  GPS: {storeLocation.split('•')[0]} | Store: {storeName} | Time: {new Date().toLocaleTimeString('en-IN')}
                </div>
              </div>

              {/* Take Evidence Snapshot Action */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  onClick={handleTakeEvidenceSnapshot}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95"
                >
                  <Camera size={14} className="text-emerald-400" />
                  <span>Save Photo Proof</span>
                </button>

                {evidenceSnapshotTaken && (
                  <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-300 flex items-center gap-1.5 animate-in fade-in">
                    <CheckCircle2 size={14} className="text-emerald-700" />
                    Photo Proof Saved with Time & Location Stamp!
                  </span>
                )}
              </div>

              {/* Captured Evidence Log List */}
              {capturedEvidenceLog.length > 0 && (
                <div className="p-3 bg-slate-100 rounded-xl border border-slate-300 space-y-1">
                  <p className="text-xs font-black font-mono text-black uppercase tracking-wider">
                    Saved Photo Proof List:
                  </p>
                  {capturedEvidenceLog.map((log, idx) => (
                    <p key={idx} className="text-xs font-mono font-bold text-black flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-600" />
                      <span>{log}</span>
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right 5 cols: Detected Statutory Violations & Next Step */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-black">Rule Check Results</h3>
                <span className={`px-2.5 py-0.5 text-xs font-black font-mono rounded ${
                  inspectedProduct.complianceScore >= 85
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : 'bg-rose-100 text-rose-900 border border-rose-300'
                }`}>
                  Score: {inspectedProduct.complianceScore}/100
                </span>
              </div>

              {/* Offence List - Dark High Contrast Black Text */}
              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                {inspectedProduct.violations.length > 0 ? (
                  inspectedProduct.violations.map((viol) => (
                    <div
                      key={viol.id}
                      className="p-3 rounded-xl bg-rose-50 border border-rose-300 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-rose-950 flex items-center gap-1.5">
                          <AlertTriangle size={14} className="text-rose-600 flex-shrink-0" />
                          {viol.title}
                        </span>
                        <span className="text-[10px] font-mono font-black bg-rose-200 text-rose-900 px-1.5 py-0.2 rounded border border-rose-300">
                          {viol.ruleCode}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-black leading-relaxed">{viol.explanation}</p>
                      <p className="text-xs text-rose-950 font-black mt-1">
                        Required Action: {viol.recommendedAction}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-center space-y-1">
                    <CheckCircle2 size={24} className="text-emerald-700 mx-auto" />
                    <h5 className="text-xs font-black text-emerald-900">All Rules Passed!</h5>
                    <p className="text-xs font-bold text-black">This packaging label conforms completely with all Legal Metrology rules.</p>
                  </div>
                )}
              </div>

              {/* STATUTORY FINE & COMPOUNDING PENALTY ASSESSMENT (EDITABLE) */}
              <div className="p-4 rounded-2xl bg-amber-50/80 border-2 border-amber-300 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold shadow-2xs">
                      <IndianRupee size={15} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                        Statutory Fine Assessment
                      </h4>
                      <p className="text-[10px] font-semibold text-slate-600">
                        Legal Metrology Act, 2009 & PCR 2011
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-mono font-black rounded-md bg-amber-200 text-amber-900 border border-amber-300">
                    EDITABLE
                  </span>
                </div>

                {/* Total Fine Display & Input */}
                <div className="p-3 bg-white rounded-xl border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div>
                    <span className="text-[11px] font-bold text-slate-700 block">Assessed Penalty (Fine):</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-base font-black text-slate-900">₹</span>
                      <input
                        type="number"
                        value={assessedFine}
                        onChange={(e) => setAssessedFine(Math.max(0, parseInt(e.target.value) || 0))}
                        step="1000"
                        className="w-32 text-lg font-black text-slate-950 font-mono bg-amber-50/60 border border-amber-400 rounded-lg px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  {/* Quick Fill Buttons */}
                  <div className="flex flex-col sm:items-end gap-1">
                    <span className="text-[10px] font-bold text-slate-500">Quick Select:</span>
                    <div className="flex items-center gap-1">
                      {[10000, 25000, 35000, 50000].map(amt => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setAssessedFine(amt)}
                          className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded border transition-all ${
                            assessedFine === amt 
                              ? 'bg-amber-600 text-white border-amber-600 shadow-2xs' 
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                          }`}
                        >
                          ₹{amt / 1000}k
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Applicable Section Selector */}
                <div>
                  <label className="text-[11px] font-bold text-slate-800 block mb-1">
                    Applicable Legal Section:
                  </label>
                  <select
                    value={legalSection}
                    onChange={(e) => setLegalSection(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Section 36(1) - Penalty for manufacturing/selling non-standard packages (Up to ₹25,000)">Section 36(1) - Non-standard pre-packed commodity (Up to ₹25,000)</option>
                    <option value="Section 36(2) - Sale of pre-packaged commodity at price higher than MRP (Up to ₹50,000)">Section 36(2) - Sale above MRP / Overcharging (Up to ₹50,000)</option>
                    <option value="Section 39 - Contravention of Packaged Commodity Rules 2011 (Up to ₹25,000)">Section 39 - Contravention of packaging & font size rules (Up to ₹25,000)</option>
                    <option value="Section 32 - Failure to use standard metric units (Schedule I/II) (Up to ₹10,000)">Section 32 - Failure to use standard metric units (Up to ₹10,000)</option>
                    <option value="Section 48/49 - Compounding of Offences by Corporate Packers">Section 48/49 - Corporate Compounding & Packer Liability</option>
                  </select>
                </div>

                {/* Offence Classification */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-700 block mb-0.5">Offence Category:</label>
                    <select
                      value={offenceType}
                      onChange={(e) => setOffenceType(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-semibold text-slate-900 focus:outline-none"
                    >
                      <option value="First Offence (Compounding Notice under Sec 48)">1st Offence (Compounding Permitted)</option>
                      <option value="Repeat Offence (Non-compoundable court referral)">Repeat Offence (2x Penalty / Court)</option>
                      <option value="Packaging Rectification Advisory Only">Advisory (Zero Penalty Notice)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-700 block mb-0.5">Compliance Window:</label>
                    <span className="block px-2.5 py-1 text-xs font-mono font-bold bg-slate-100 border border-slate-300 rounded-lg text-slate-800">
                      15 Days Notice
                    </span>
                  </div>
                </div>

                {/* Inspector Compounding Directive */}
                <div>
                  <label className="text-[10px] font-bold text-slate-700 block mb-0.5">Inspector Directives to Packer / Seller:</label>
                  <textarea
                    rows={2}
                    value={inspectorFineNotes}
                    onChange={(e) => setInspectorFineNotes(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Download Options in Step 4 */}
                <div className="pt-2 border-t border-amber-200 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setShowNoticeModal(true)}
                    className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95"
                  >
                    <Printer size={14} className="text-amber-400" />
                    <span>Download PDF Notice</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadReportCSV}
                    className="py-2 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-900 font-black text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-all active:scale-95"
                  >
                    <FileSpreadsheet size={14} className="text-emerald-700" />
                    <span>Download CSV</span>
                  </button>
                </div>
              </div>

              {/* Generate Report Action */}
              <div className="pt-2 border-t border-slate-200 space-y-2">
                <button
                  onClick={handleGenerateReport}
                  className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-sm hover:shadow active:scale-98 transition-all"
                >
                  <FileText size={16} />
                  <span>Proceed to Step 5: Save in Govt Registry</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: Generate & Save Official Inspection Report */}
      {currentStep === 5 && (
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Official Report Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-300 shadow-sm space-y-6">
            {/* Report Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
              <div>
                <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-300">
                  OFFICIAL FORM LM-IR-2026
                </span>
                <h2 className="text-xl font-black text-black mt-1">
                  Legal Metrology Official Inspection Report
                </h2>
                <p className="text-xs text-black font-mono font-bold">
                  Report Number: {generatedReport?.reportNumber || 'LM-REP-2026-X'}
                </p>
              </div>

              <div className="text-left sm:text-right text-xs space-y-0.5">
                <p className="font-black text-black">Date: {new Date().toLocaleDateString('en-IN')}</p>
                <p className="text-black font-mono font-bold">Inspector: {currentUser.name}</p>
                <p className="text-emerald-800 font-black font-mono">Status: Verified & Certified</p>
              </div>
            </div>

            {/* Shop & Product Summary Table */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-300 text-xs">
              <div>
                <span className="text-xs text-black block font-black">Store / Shop Name:</span>
                <span className="font-black text-black text-sm">{storeName}</span>
                <span className="text-xs text-black block mt-0.5 font-mono font-bold">{storeLocation}</span>
              </div>
              <div>
                <span className="text-xs text-black block font-black">Inspected Product:</span>
                <span className="font-black text-black text-sm">{inspectedProduct.name}</span>
                <span className="text-xs text-black block mt-0.5 font-mono font-bold">Code: {inspectedProduct.sku}</span>
              </div>
              <div>
                <span className="text-xs text-black block font-black">Inspection Result:</span>
                <span className={`font-black text-sm ${
                  inspectedProduct.complianceScore >= 85 ? 'text-emerald-800' : 'text-rose-700'
                }`}>
                  Score: {inspectedProduct.complianceScore}/100
                </span>
                <span className="text-xs text-black block mt-0.5 font-bold">
                  {inspectedProduct.violations.length} rule violation(s) found
                </span>
              </div>
            </div>

            {/* Rules Broken & Errors Found */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-black uppercase tracking-wider font-mono">
                Rules Broken & Errors Found
              </h4>

              {inspectedProduct.violations.length > 0 ? (
                <div className="border border-slate-300 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-300 text-black font-mono text-[11px] font-black">
                        <th className="p-3">Rule Code</th>
                        <th className="p-3">Problem Found</th>
                        <th className="p-3">What the Law Requires</th>
                        <th className="p-3 text-right">Individual Penalty</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {inspectedProduct.violations.map((v, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="p-3 font-mono font-black text-rose-700">{v.ruleCode}</td>
                          <td className="p-3 text-black font-bold">{v.title}</td>
                          <td className="p-3 text-black font-medium">{v.explanation}</td>
                          <td className="p-3 text-right font-mono font-black text-black">
                            {v.severity === 'critical' ? '₹ 25,000' : '₹ 10,000'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-amber-50/90 border-t-2 border-amber-300 text-xs">
                      <tr>
                        <td colSpan={3} className="p-3 font-bold text-slate-800">
                          <span className="font-black text-slate-900 uppercase">Assessed Statutory Compounding Fine:</span>
                          <span className="text-slate-600 block text-[11px] font-normal">{legalSection}</span>
                        </td>
                        <td className="p-3 text-right font-mono font-black text-base text-amber-950">
                          ₹ {assessedFine.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              ) : (
                <p className="text-xs text-emerald-900 bg-emerald-50 p-3 rounded-lg border border-emerald-300 font-bold">
                  No rule violations found. Product packaging conforms completely with all legal rules.
                </p>
              )}
            </div>

            {/* Statutory Fine Assessment Box in Step 5 */}
            <div className="p-4 rounded-xl bg-amber-50/90 border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-black text-slate-900 flex items-center gap-1.5">
                  <IndianRupee size={15} className="text-amber-700" />
                  Assessed Compounding Penalty under LM Act 2009:
                </span>
                <p className="text-[11px] text-slate-700 mt-0.5">
                  {legalSection} • {offenceType}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black font-mono text-amber-950">
                  ₹ {assessedFine.toLocaleString('en-IN')}
                </span>
                <button
                  onClick={() => setShowNoticeModal(true)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-black text-xs flex items-center gap-1 shadow-2xs"
                >
                  <Printer size={13} className="text-amber-400" />
                  <span>View Notice</span>
                </button>
              </div>
            </div>

            {/* SAVE REPORT SECTION - Clean, prominent, and definitive */}
            <div className="p-5 rounded-2xl bg-blue-50 border border-blue-300 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-black text-black flex items-center gap-2">
                    <ShieldCheck size={18} className="text-blue-600" />
                    Save Official Report for This Product
                  </h3>
                  <p className="text-xs font-bold text-black mt-0.5">
                    Permanently saves this official inspection report in the government records for {storeName}.
                  </p>
                </div>

                {!isReportSaved ? (
                  <button
                    onClick={handleSaveReportForProduct}
                    className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-sm hover:shadow active:scale-98 transition-all"
                  >
                    <Check size={16} className="stroke-[3]" />
                    <span>Save Report for this Product</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-100 text-emerald-900 font-black text-xs border border-emerald-300 shadow-xs">
                    <CheckCircle2 size={16} className="text-emerald-700" />
                    <span>Report Successfully Saved in Government Records!</span>
                  </div>
                )}
              </div>

              {/* Direct Export & Navigation Actions (Available both before and after saving) */}
              <div className="pt-3 border-t border-blue-200 flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setShowNoticeModal(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-black text-xs font-black shadow-2xs transition-all"
                >
                  <Printer size={14} className="text-amber-600" />
                  <span>Download Statutory Notice (PDF)</span>
                </button>

                <button
                  onClick={handleDownloadReportCSV}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-black text-xs font-black shadow-2xs transition-all"
                >
                  <FileSpreadsheet size={14} className="text-emerald-700" />
                  <span>Download Excel / CSV File</span>
                </button>

                {isReportSaved && (
                  <>
                    <button
                      onClick={() => {
                        setSelectedTraceBatchId(inspectedProduct.sampleBatchId || inspectedProduct.batchNumber);
                        setCurrentTab('backtrack');
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-black border border-amber-300 shadow-2xs transition-all"
                    >
                      <Network size={14} className="text-amber-800" />
                      <span>Backtrack Batch & Suppliers</span>
                    </button>

                    <button
                      onClick={() => setCurrentTab('analysis_results')}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-2xs transition-all ml-auto"
                    >
                      <Eye size={14} />
                      <span>View Full Analysis</span>
                    </button>

                    <button
                      onClick={() => setCurrentTab('reports')}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-black hover:bg-slate-800 text-white text-xs font-black shadow-2xs transition-all"
                    >
                      <FileText size={14} />
                      <span>All Saved Reports</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OFFICIAL STATUTORY NOTICE MODAL (PDF / PRINTABLE) */}
      {showNoticeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-4 border border-slate-300 text-slate-900 font-sans my-8">
            {/* Header with official styling */}
            <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
              <span className="text-[11px] font-mono font-bold tracking-widest text-slate-600 block">
                GOVERNMENT OF MAHARASHTRA / GOVERNMENT OF INDIA
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-950 uppercase tracking-tight">
                Directorate of Legal Metrology
              </h2>
              <p className="text-xs font-bold text-slate-700">
                Zonal Enforcement Cell • Packaged Commodities Surveillance Unit
              </p>
              <span className="inline-block mt-2 px-3 py-0.5 rounded bg-slate-900 text-white font-mono font-black text-[11px]">
                FORM LM-NOT-2026 • STATUTORY SEIZURE & COMPOUNDING PENALTY NOTICE
              </span>
            </div>

            {/* Notice Metadata */}
            <div className="grid grid-cols-2 gap-3 text-xs p-3 bg-slate-50 rounded-xl border border-slate-300 font-mono">
              <div>
                <span className="text-slate-500 font-bold block">Notice Ref:</span>
                <span className="font-black text-slate-900">{generatedReport?.reportNumber || `LM-NOT-${inspectedProduct.sku.replace('YAT-', '')}-${Date.now().toString().slice(-4)}`}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block">Date of Notice:</span>
                <span className="font-black text-slate-900">{new Date().toLocaleDateString('en-IN')}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block">Inspecting Officer:</span>
                <span className="font-black text-slate-900">{currentUser.name}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block">Store / Premises:</span>
                <span className="font-black text-slate-900">{storeName}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-500 font-bold block">GPS Coords:</span>
                <span className="font-black text-slate-900">{storeLocation}</span>
              </div>
            </div>

            {/* Product & Offence Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Offending Commodity & Violations
              </h4>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-300 text-xs space-y-1">
                <p><strong>Inspected Commodity:</strong> {inspectedProduct.name} ({inspectedProduct.sku})</p>
                <p><strong>Batch / Lot:</strong> {inspectedProduct.sampleBatchId || inspectedProduct.batchNumber || 'SMP-2026-8812'}</p>
                <p><strong>Compliance Score:</strong> {inspectedProduct.complianceScore}/100 ({inspectedProduct.violations.length} violation(s) detected)</p>
              </div>

              <div className="border border-slate-300 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-100 font-mono text-[10px] font-black border-b border-slate-300">
                    <tr>
                      <th className="p-2">Rule Code</th>
                      <th className="p-2">Infraction</th>
                      <th className="p-2 text-right">Statutory Penalty</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {inspectedProduct.violations.map((v, i) => (
                      <tr key={i}>
                        <td className="p-2 font-mono font-bold text-rose-700">{v.ruleCode}</td>
                        <td className="p-2 text-slate-800">{v.title}</td>
                        <td className="p-2 text-right font-mono font-bold">
                          {v.severity === 'critical' ? '₹ 25,000' : '₹ 10,000'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Statutory Assessment Box */}
            <div className="p-4 rounded-xl bg-amber-50 border-2 border-amber-400 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-black text-amber-950 uppercase">Total Assessed Compounding Fine:</span>
                <span className="text-xl font-black font-mono text-amber-950">₹ {assessedFine.toLocaleString('en-IN')}</span>
              </div>
              <p className="text-[11px] text-slate-800">
                <strong>Governing Law:</strong> {legalSection}
              </p>
              <p className="text-[11px] text-slate-800">
                <strong>Order Directive:</strong> {inspectorFineNotes}
              </p>
            </div>

            {/* Legal Footer & Signature */}
            <div className="pt-3 border-t border-slate-300 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-slate-800">15-Day Statutory Show-Cause Notice</p>
                <p className="text-[10px] text-slate-500">Issued under Section 48 / 49 Legal Metrology Act 2009</p>
              </div>
              <div className="text-right">
                <div className="w-32 border-b border-slate-800 mb-1 ml-auto" />
                <p className="font-black text-slate-900">{currentUser.name}</p>
                <p className="text-[10px] text-slate-600">Legal Metrology Inspector, Pune Circle</p>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2 no-print">
              <button
                type="button"
                onClick={() => setShowNoticeModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-xs text-slate-700"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleDownloadReportCSV}
                className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 font-bold text-xs text-slate-900 flex items-center gap-1.5"
              >
                <FileSpreadsheet size={14} className="text-emerald-700" />
                <span>Download CSV</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs flex items-center gap-1.5 shadow-sm"
              >
                <Printer size={14} className="text-amber-400" />
                <span>Print / Save as PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Prototype Demonstration Disclaimer */}
      <div className="pt-4 pb-2 border-t border-slate-200 text-center">
        <p className="text-xs text-slate-500 font-medium tracking-wide">
          Used synthetic data for prototype demonstration
        </p>
      </div>
    </div>
  );
};
