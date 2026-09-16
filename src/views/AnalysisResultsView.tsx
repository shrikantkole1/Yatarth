import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  FileText, 
  ArrowLeft, 
  Sparkles, 
  Eye, 
  EyeOff,
  Printer,
  Network
} from 'lucide-react';
import { BoundingBox, ReviewStatus, Violation } from '../types';

export const AnalysisResultsView: React.FC = () => {
  const { 
    selectedProduct, 
    products, 
    setCurrentTab, 
    updateViolationStatus, 
    setIsCopilotOpen,
    addNewReport,
    currentUser,
    setSelectedTraceBatchId
  } = useApp();

  const product = selectedProduct || products[0];

  const [activeSideIndex, setActiveSideIndex] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showBoxes, setShowBoxes] = useState<boolean>(true);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [highlightedBoxId, setHighlightedBoxId] = useState<string | null>(null);

  const currentSide = product.sides[activeSideIndex] || product.sides[0];

  const filteredBoxes = (currentSide?.boundingBoxes || []).filter((box: BoundingBox) => {
    if (!showBoxes) return false;
    if (activeCategoryFilter === 'all') return true;
    return box.category === activeCategoryFilter;
  });

  const getStatusBadge = (status: 'compliant' | 'warning' | 'non_compliant') => {
    switch (status) {
      case 'compliant':
        return (
          <span className="px-2.5 py-1 text-xs font-black font-mono rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1.5 shadow-2xs">
            <CheckCircle2 size={14} className="text-emerald-700" /> PASSED (ALL RULES OK)
          </span>
        );
      case 'warning':
        return (
          <span className="px-2.5 py-1 text-xs font-black font-mono rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1.5 shadow-2xs">
            <AlertTriangle size={14} className="text-amber-700" /> NOTICE (MINOR ISSUE)
          </span>
        );
      case 'non_compliant':
        return (
          <span className="px-2.5 py-1 text-xs font-black font-mono rounded-full bg-rose-100 text-rose-950 border border-rose-300 flex items-center gap-1.5 shadow-2xs">
            <XCircle size={14} className="text-rose-700" /> RULE VIOLATION
          </span>
        );
    }
  };

  const getFieldStatusBadge = (status: 'detected' | 'missing' | 'needs_review') => {
    switch (status) {
      case 'detected':
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono font-black rounded bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
            <CheckCircle2 size={11} className="text-emerald-700" /> FOUND
          </span>
        );
      case 'missing':
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono font-black rounded bg-rose-100 text-rose-950 border border-rose-300 flex items-center gap-1">
            <XCircle size={11} className="text-rose-700" /> MISSING
          </span>
        );
      case 'needs_review':
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono font-black rounded bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
            <HelpCircle size={11} className="text-amber-700" /> NEEDS CHECK
          </span>
        );
    }
  };

  const handleExportReport = () => {
    addNewReport({
      id: 'rep-' + Date.now(),
      reportNumber: `LM-REP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      title: `${product.name} Official Inspection Report`,
      type: 'Product Compliance',
      generatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      author: currentUser.name,
      scope: `Shop: ${product.storeName || 'Central Store'} | Product Code: ${product.sku}`,
      complianceRate: product.complianceScore,
      criticalIssuesCount: product.criticalIssues,
      status: 'ready',
      fileSize: '2.4 MB',
      storeName: product.storeName,
      storeLocation: product.storeLocation,
      productId: product.id
    });
    setCurrentTab('reports');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in text-black font-sans">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-300">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentTab('products')}
            className="p-2 rounded-xl bg-white border border-slate-300 text-black hover:bg-slate-100 shadow-xs"
            title="Back to Products"
          >
            <ArrowLeft size={16} className="stroke-[3]" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-black">{product.name}</h1>
              {getStatusBadge(product.status)}
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-black font-mono font-bold mt-1">
              <span>Product Code: {product.sku}</span>
              <span>• Brand: {product.brand}</span>
              <span>• Batch: {product.sampleBatchId || product.batchNumber}</span>
              {product.storeName && (
                <span className="text-blue-900 bg-blue-100 px-2 py-0.5 rounded font-black border border-blue-300">
                  Shop: {product.storeName} {product.storeLocation ? `(${product.storeLocation})` : ''}
                </span>
              )}
              {product.observedRetailPrice && (
                <span className="text-black bg-slate-200 px-2 py-0.5 rounded font-black">
                  Observed Price: {product.observedRetailPrice}
                </span>
              )}
            </div>
            {product.officerNotes && (
              <p className="text-xs text-black font-bold mt-1.5 bg-slate-100 px-3 py-1 rounded-lg border border-slate-300 inline-block">
                Inspector Notes: {product.officerNotes}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedTraceBatchId(product.sampleBatchId || product.batchNumber);
              setCurrentTab('backtrack');
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 border border-blue-300 text-blue-950 text-xs font-black hover:bg-blue-100 transition-colors shadow-xs"
          >
            <Network size={14} className="text-blue-700" />
            <span>Backtrack Batch</span>
          </button>
          <button
            onClick={() => setIsCopilotOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-blue-300 text-blue-900 text-xs font-black hover:bg-blue-50 transition-colors shadow-xs"
          >
            <Sparkles size={14} className="text-blue-700" />
            <span>Ask Yatarth AI</span>
          </button>
          <button
            onClick={handleExportReport}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black transition-all shadow-sm active:scale-95"
          >
            <FileText size={15} />
            <span>Create Official Report</span>
          </button>
        </div>
      </div>

      {/* Score Summary Metrics Banner - Bold Black Text */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Compliance Score Gauge */}
        <div className="p-4 rounded-xl bg-white border border-slate-300 shadow-xs flex items-center gap-4">
          <div className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="#cbd5e1"
                strokeWidth="6"
                fill="transparent"
              />
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke={
                  product.complianceScore >= 85 ? '#16a34a' :
                  product.complianceScore >= 70 ? '#d97706' : '#dc2626'
                }
                strokeWidth="6"
                strokeDasharray={163.36}
                strokeDashoffset={163.36 - (163.36 * product.complianceScore) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <span className="absolute font-mono font-black text-black text-lg">
              {product.complianceScore}
            </span>
          </div>
          <div>
            <p className="text-xs font-black text-black">Rules Score</p>
            <p className="text-sm font-black text-black">
              {product.complianceScore >= 85 ? 'Passed All Rules' : product.complianceScore >= 70 ? 'Minor Issue' : 'Violations Found'}
            </p>
            <p className="text-[11px] text-black font-bold font-mono">Out of 100</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-300 shadow-xs">
          <p className="text-xs font-black text-black">Required Labels Checked</p>
          <h3 className="text-2xl font-black text-black font-mono mt-1">
            {product.declarations.length} / 6
          </h3>
          <p className="text-xs text-black font-bold">Mandatory items verified</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-300 shadow-xs">
          <p className="text-xs font-black text-black">Rule Violations Found</p>
          <h3 className="text-2xl font-black text-rose-700 font-mono mt-1">
            {product.violations.length}
          </h3>
          <p className="text-xs text-black font-bold">{product.criticalIssues} serious blocker(s)</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-300 shadow-xs">
          <p className="text-xs font-black text-black">Text Recognition Accuracy</p>
          <h3 className="text-2xl font-black text-blue-700 font-mono mt-1">98.4%</h3>
          <p className="text-xs text-black font-bold">Clear text confidence</p>
        </div>
      </div>

      {/* Main Split: Left 7 cols Visual Evidence Canvas | Right 5 cols Declarations & Violations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Packaging Canvas */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-300 shadow-xs space-y-3">
            {/* Canvas Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200">
              {/* Packaging Side Switcher */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-300">
                {product.sides.map((side, idx) => (
                  <button
                    key={side.id}
                    onClick={() => setActiveSideIndex(idx)}
                    className={`px-3 py-1 text-xs font-black rounded-lg transition-all ${
                      activeSideIndex === idx
                        ? 'bg-white text-black shadow-2xs border border-slate-300'
                        : 'text-black hover:bg-slate-200'
                    }`}
                  >
                    {side.sideName}
                  </button>
                ))}
              </div>

              {/* Viewport Zoom & Box Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setShowBoxes(!showBoxes)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-black rounded-lg border transition-all ${
                    showBoxes
                      ? 'bg-blue-100 border-blue-400 text-blue-950'
                      : 'bg-white border-slate-300 text-black'
                  }`}
                  title="Toggle highlight boxes"
                >
                  {showBoxes ? <Eye size={14} /> : <EyeOff size={14} />}
                  <span>{showBoxes ? 'Boxes ON' : 'Boxes OFF'}</span>
                </button>

                <button
                  onClick={() => setZoomLevel((z) => Math.min(z + 0.15, 1.6))}
                  className="p-1.5 rounded-lg bg-white border border-slate-300 text-black hover:bg-slate-100"
                  title="Zoom In"
                >
                  <ZoomIn size={14} />
                </button>
                <button
                  onClick={() => setZoomLevel((z) => Math.max(z - 0.15, 0.7))}
                  className="p-1.5 rounded-lg bg-white border border-slate-300 text-black hover:bg-slate-100"
                  title="Zoom Out"
                >
                  <ZoomOut size={14} />
                </button>
                <button
                  onClick={() => setZoomLevel(1)}
                  className="p-1.5 rounded-lg bg-white border border-slate-300 text-black hover:bg-slate-100"
                  title="Reset Zoom"
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>

            {/* Bounding Box Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
              <span className="text-black mr-1 font-sans font-bold">Category:</span>
              {[
                { id: 'all', label: 'All Items' },
                { id: 'mrp', label: 'MRP & Tax' },
                { id: 'net_quantity', label: 'Net Quantity' },
                { id: 'manufacturer', label: 'Company Name' },
                { id: 'dates', label: 'Dates & Expiry' },
                { id: 'consumer_care', label: 'Customer Care' },
                { id: 'origin', label: 'Country of Origin' }
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveCategoryFilter(filter.id)}
                  className={`px-3 py-1 rounded-full border text-xs transition-all font-sans font-black ${
                    activeCategoryFilter === filter.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : 'bg-slate-100 text-black border-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Interactive Image & Bounding Box Viewport */}
            <div className="relative rounded-xl overflow-hidden bg-slate-100 border border-slate-300 flex items-center justify-center p-4 min-h-[480px]">
              <div 
                className="relative transition-transform duration-200 origin-center max-w-full"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                {/* Packaging SVG / Image */}
                <img
                  src={currentSide?.imageUrl}
                  alt={currentSide?.sideName}
                  className="max-h-[580px] w-auto rounded-lg shadow-lg pointer-events-none select-none border border-slate-300 bg-white"
                />

                {/* Overlay Bounding Boxes */}
                {filteredBoxes.map((box: BoundingBox) => {
                  const isHighlighted = highlightedBoxId === box.id;
                  const isWarningOrMissing = box.status === 'missing' || box.status === 'needs_review';

                  return (
                    <div
                      key={box.id}
                      onClick={() => setHighlightedBoxId(box.id)}
                      className={`absolute rounded cursor-pointer transition-all duration-150 border-2 group ${
                        isHighlighted
                          ? 'border-blue-600 bg-blue-500/25 ring-4 ring-blue-400 z-20'
                          : isWarningOrMissing
                          ? 'border-rose-600 bg-rose-500/25 hover:bg-rose-500/40 z-10'
                          : 'border-emerald-600 bg-emerald-500/25 hover:bg-emerald-500/40 z-0'
                      }`}
                      style={{
                        left: `${box.x}%`,
                        top: `${box.y}%`,
                        width: `${box.width}%`,
                        height: `${box.height}%`,
                      }}
                    >
                      {/* Box Label Tag */}
                      <div className={`absolute -top-5 left-0 px-1.5 py-0.2 rounded text-[10px] font-mono font-black whitespace-nowrap shadow-xs pointer-events-none ${
                        isWarningOrMissing ? 'bg-rose-700 text-white' : 'bg-emerald-800 text-white'
                      }`}>
                        {box.field}
                      </div>

                      {/* Tooltip on Hover/Active */}
                      <div className="hidden group-hover:block absolute top-full left-0 mt-1 z-30 p-2.5 rounded-lg bg-white border border-slate-400 shadow-xl w-64 text-left pointer-events-none">
                        <p className="text-xs font-black text-black uppercase">{box.field}</p>
                        <p className="text-xs text-black font-bold mt-0.5">"{box.detectedText}"</p>
                        <div className="flex items-center justify-between text-[11px] text-black font-mono font-bold mt-1 pt-1 border-t border-slate-200">
                          <span>Confidence: {box.confidence}%</span>
                          <span className={box.status === 'detected' ? 'text-emerald-800 font-black' : 'text-rose-800 font-black'}>
                            {box.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <p className="text-xs text-black text-center font-bold">
              Click any box to inspect detected label details and rules.
            </p>
          </div>
        </div>

        {/* Right: Declarations Checklist & Violations Center */}
        <div className="lg:col-span-5 space-y-4">
          {/* Mandatory Declarations Table */}
          <div className="p-4 rounded-2xl bg-white border border-slate-300 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-black uppercase font-mono tracking-wider">
                Required Package Labels Checklist
              </h3>
              <span className="text-xs font-bold text-black font-mono">Rule 6 (PCR 2011)</span>
            </div>

            <div className="divide-y divide-slate-200">
              {product.declarations.map((dec) => (
                <div key={dec.id} className="py-2.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-black">{dec.label}</span>
                    {getFieldStatusBadge(dec.status)}
                  </div>
                  <div className="text-xs font-mono text-black font-bold bg-slate-100 p-2 rounded-lg border border-slate-300">
                    <span className="text-black text-xs font-bold font-sans block">Value Found on Package:</span>
                    {dec.detectedValue}
                  </div>
                  {dec.notes && (
                    <p className="text-xs text-amber-900 font-bold leading-tight">
                      ! {dec.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* AI Detected Violations */}
          <div className="p-4 rounded-2xl bg-white border border-slate-300 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-rose-600" />
                <h3 className="text-xs font-black text-black uppercase font-mono tracking-wider">
                  Rule Violations & Errors Found ({product.violations.length})
                </h3>
              </div>
              <span className="text-xs font-black text-rose-700 font-mono">Action Required</span>
            </div>

            {product.violations.length === 0 ? (
              <div className="text-center py-6 p-4 rounded-xl bg-emerald-50 border border-emerald-300">
                <CheckCircle2 size={24} className="text-emerald-700 mx-auto mb-2" />
                <p className="text-xs font-black text-black">All Rules Passed!</p>
                <p className="text-xs font-bold text-black mt-0.5">All required package labels meet legal standards.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {product.violations.map((v: Violation) => (
                  <div 
                    key={v.id}
                    className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 hover:border-rose-500 transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 text-[10px] font-mono font-black uppercase rounded border ${
                          v.severity === 'critical' ? 'bg-rose-200 text-rose-950 border-rose-400' :
                          v.severity === 'high' ? 'bg-orange-200 text-orange-950 border-orange-400' :
                          v.severity === 'medium' ? 'bg-amber-200 text-amber-950 border-amber-400' :
                          'bg-blue-200 text-blue-950 border-blue-400'
                        }`}>
                          {v.severity.toUpperCase()}
                        </span>
                        <span className="text-xs font-black text-black">{v.title}</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-black bg-white px-1.5 py-0.5 rounded border border-slate-300">
                        {v.ruleCode}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-black leading-relaxed">
                      {v.explanation}
                    </p>

                    <div className="text-xs font-semibold text-rose-950 bg-rose-100/70 p-2 rounded-lg border border-rose-200">
                      <span className="font-black block text-rose-900">Required Action:</span>
                      {v.recommendedAction}
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-rose-200 text-xs font-bold">
                      <span className="text-black">Status: {v.reviewStatus.toUpperCase()}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateViolationStatus(v.id, 'resolved')}
                          className="px-2.5 py-1 rounded bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs transition-colors"
                        >
                          Mark Fixed
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
