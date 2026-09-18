import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Boxes, 
  ShieldCheck, 
  AlertTriangle, 
  Flame, 
  ArrowUpRight, 
  Scan, 
  TrendingUp, 
  Clock, 
  ChevronRight, 
  Sparkles,
  BarChart2,
  Network
} from 'lucide-react';
import { Product, Violation } from '../types';

export const OverviewView: React.FC = () => {
  const { 
    products, 
    allViolations, 
    setCurrentTab, 
    setSelectedProductId, 
    setIsCopilotOpen 
  } = useApp();

  const totalScanned = products.length;
  const compliantCount = products.filter((p: Product) => p.status === 'compliant').length;
  const nonCompliantCount = products.filter((p: Product) => p.status === 'non_compliant').length;

  const avgComplianceScore = Math.round(
    products.reduce((acc: number, p: Product) => acc + p.complianceScore, 0) / (totalScanned || 1)
  );

  const criticalIssuesCount = allViolations.filter((v: Violation) => v.severity === 'critical' && v.reviewStatus !== 'resolved').length;
  const openViolationsCount = allViolations.filter((v: Violation) => v.reviewStatus === 'open').length;

  // Category counts
  const categoryBreakdown = [
    { label: 'MRP & Tax Inclusivity (Rule 6(1)(e))', count: 3, percent: 35, color: 'bg-rose-600' },
    { label: 'Net Quantity Font Sizing (Schedule II)', count: 2, percent: 25, color: 'bg-amber-500' },
    { label: 'Consumer Redressal Cell (Rule 6(1)(n))', count: 2, percent: 25, color: 'bg-cyan-600' },
    { label: 'Mfg / Expiry Format (Rule 6(1)(d))', count: 1, percent: 15, color: 'bg-indigo-600' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300 text-slate-900">
      {/* Top Banner / Official Callout */}
      <div className="relative rounded-2xl p-6 bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white shadow-md overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-mono text-teal-200 mb-2">
              <Sparkles size={13} className="text-teal-300" />
              <span>LEGAL METROLOGY COMPLIANCE SYSTEM</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Product Compliance & Inspection Dashboard
            </h1>
            <p className="text-teal-100 text-xs mt-1 max-w-2xl leading-relaxed font-medium">
              Automated label check, weight & MRP rules validation, font size check, and rule violation detection for packaged products.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setCurrentTab('backtrack')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-black text-xs shadow-sm active:scale-95 transition-all border border-blue-400"
            >
              <Network size={16} className="text-white stroke-[2.5]" />
              <span>Backtrack Trace & Pune Map</span>
            </button>
            <button
              onClick={() => setCurrentTab('scan_product')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-teal-50 text-teal-950 font-black text-xs shadow-sm active:scale-95 transition-all"
            >
              <Scan size={16} className="text-teal-800" />
              <span>Inspect Packaging Label</span>
            </button>
            <button
              onClick={() => setIsCopilotOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-700 text-white border border-teal-600 font-bold text-xs transition-all"
            >
              <Sparkles size={15} />
              <span>Yatarth AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Products Scanned */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs hover:shadow-sm transition-all">
          <div className="flex items-center justify-between text-black mb-2">
            <span className="text-xs font-black">Products Inspected</span>
            <div className="p-1.5 rounded-lg bg-teal-50 text-teal-800">
              <Boxes size={16} />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-black text-slate-900 font-mono">{totalScanned}</h3>
            <span className="text-[11px] font-mono font-black text-emerald-800 flex items-center gap-0.5">
              <ArrowUpRight size={12} /> +100% active
            </span>
          </div>
          <p className="text-[11px] text-black font-semibold mt-2">120 Products scheduled for check</p>
        </div>

        {/* Card 2: Metrology Index */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs hover:shadow-sm transition-all">
          <div className="flex items-center justify-between text-black mb-2">
            <span className="text-xs font-black">Rules Pass Rate</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800">
              <ShieldCheck size={16} />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <h3 className="text-2xl font-black text-slate-900 font-mono">{avgComplianceScore}%</h3>
              <span className="text-[11px] text-black font-bold">average</span>
            </div>
            <span className="text-[11px] font-mono font-black text-emerald-800 flex items-center gap-0.5">
              <ArrowUpRight size={12} /> +4.2% MoM
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-2.5 overflow-hidden border border-slate-200">
            <div 
              className="bg-gradient-to-r from-teal-600 to-emerald-600 h-full rounded-full" 
              style={{ width: `${avgComplianceScore}%` }}
            />
          </div>
        </div>

        {/* Card 3: Offences Detected */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs hover:shadow-sm transition-all">
          <div className="flex items-center justify-between text-black mb-2">
            <span className="text-xs font-black">Active Rule Violations</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-800">
              <AlertTriangle size={16} />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-black text-slate-900 font-mono">{openViolationsCount}</h3>
            <span className="text-[11px] font-mono font-black text-amber-800">
              {allViolations.length - openViolationsCount} fixed
            </span>
          </div>
          <p className="text-[11px] text-black font-semibold mt-2">Across Net Weight, MRP, and Helplines</p>
        </div>

        {/* Card 4: High-Risk Items */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs hover:shadow-sm transition-all">
          <div className="flex items-center justify-between text-black mb-2">
            <span className="text-xs font-black">Products with Violations</span>
            <div className="p-1.5 rounded-lg bg-rose-50 text-rose-800">
              <Flame size={16} />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-black text-rose-700 font-mono">{nonCompliantCount}</h3>
            <span className="px-1.5 py-0.5 text-[10px] font-mono font-black rounded bg-rose-100 text-rose-900 border border-rose-300">
              {criticalIssuesCount} Critical Flags
            </span>
          </div>
          <p className="text-[11px] text-black font-semibold mt-2">Correction notice required</p>
        </div>
      </div>

      {/* Main Charts & Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compliance Trend (2 cols) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <TrendingUp size={16} className="text-teal-700" />
                Inspection Pass Rate Trend
              </h3>
              <p className="text-xs text-black font-medium">Historical pass rates across store inspection rounds</p>
            </div>
            <span className="px-2.5 py-1 text-[10px] font-mono font-bold rounded bg-slate-100 text-black border border-slate-300">
              Last 6 Months
            </span>
          </div>

          {/* Interactive SVG Trend Chart */}
          <div className="h-56 w-full relative flex items-end pt-4 pb-2 bg-slate-50 rounded-xl border border-slate-200 p-2">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150">
              <defs>
                <linearGradient id="trendGradLight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0f766e" stopOpacity="0.20" />
                  <stop offset="100%" stopColor="#0f766e" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Horizontal Grid lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="#cbd5e1" strokeDasharray="3 3" />
              <line x1="0" y1="70" x2="500" y2="70" stroke="#cbd5e1" strokeDasharray="3 3" />
              <line x1="0" y1="110" x2="500" y2="110" stroke="#cbd5e1" strokeDasharray="3 3" />

              {/* Area */}
              <path
                d="M 0 120 Q 80 110, 125 90 T 250 65 T 375 45 T 500 25 L 500 150 L 0 150 Z"
                fill="url(#trendGradLight)"
              />
              {/* Line */}
              <path
                d="M 0 120 Q 80 110, 125 90 T 250 65 T 375 45 T 500 25"
                fill="none"
                stroke="#0f766e"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Data points */}
              <circle cx="125" cy="90" r="5" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
              <circle cx="250" cy="65" r="5" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
              <circle cx="375" cy="45" r="5" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
              <circle cx="500" cy="25" r="6" fill="#0f766e" stroke="#ffffff" strokeWidth="2" />
            </svg>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-black font-bold pt-3 border-t border-slate-200">
            <span>APR (64%)</span>
            <span>MAY (71%)</span>
            <span>JUN (78%)</span>
            <span>JUL (82%)</span>
            <span>AUG (86%)</span>
            <span className="text-teal-800 font-black">SEP (91% PROJ)</span>
          </div>
        </div>

        {/* Issues by Category & Risk Distribution (1 col) */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 mb-1">
              <BarChart2 size={16} className="text-teal-700" />
              Violations by Rule Category
            </h3>
            <p className="text-xs text-black font-medium mb-4">Product packaging rule violation breakdown</p>

            <div className="space-y-3.5">
              {categoryBreakdown.map((cat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-900 font-bold">{cat.label}</span>
                    <span className="text-black font-mono font-bold text-[11px]">{cat.count} issues ({cat.percent}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                    <div className={`${cat.color} h-full rounded-full`} style={{ width: `${cat.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Distribution Mini Matrix */}
          <div className="mt-6 pt-4 border-t border-slate-200 grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-lg bg-rose-50 border border-rose-200">
              <p className="text-[10px] font-mono font-bold text-rose-800 uppercase">Critical</p>
              <p className="text-lg font-black text-rose-900 font-mono mt-0.5">{criticalIssuesCount}</p>
            </div>
            <div className="p-2 rounded-lg bg-amber-50 border border-amber-200">
              <p className="text-[10px] font-mono font-bold text-amber-800 uppercase">Medium</p>
              <p className="text-lg font-black text-amber-900 font-mono mt-0.5">2</p>
            </div>
            <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200">
              <p className="text-[10px] font-mono font-bold text-emerald-800 uppercase">Conforming</p>
              <p className="text-lg font-black text-emerald-900 font-mono mt-0.5">{compliantCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Recent Scans & Critical Violations Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Scans Table */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Clock size={16} className="text-teal-700" />
              Recent Product Label Scans
            </h3>
            <button
              onClick={() => setCurrentTab('products')}
              className="text-xs text-teal-800 font-bold hover:underline flex items-center gap-1"
            >
              View All Products <ChevronRight size={13} />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {products.slice(0, 4).map((p: Product) => (
              <div 
                key={p.id} 
                onClick={() => {
                  setSelectedProductId(p.id);
                  setCurrentTab('analysis_results');
                }}
                className="py-3 flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center font-black text-teal-900 text-xs">
                    {p.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                      {p.name}
                    </h4>
                    <p className="text-[11px] text-slate-600 font-mono font-medium">
                      Code: {p.sku} • {p.category}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 text-xs font-mono font-black rounded ${
                    p.complianceScore >= 85 ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                    p.complianceScore >= 70 ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                    'bg-rose-100 text-rose-900 border border-rose-300'
                  }`}>
                    {p.complianceScore}/100
                  </span>
                  <ChevronRight size={14} className="text-slate-500 group-hover:text-slate-900" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Violations Alert Feed */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <AlertTriangle size={16} className="text-rose-600" />
              Active Rule Violations & Notices
            </h3>
            <button
              onClick={() => setCurrentTab('violations')}
              className="text-xs text-rose-800 font-bold hover:underline flex items-center gap-1"
            >
              Violations Hub <ChevronRight size={13} />
            </button>
          </div>

          <div className="space-y-2.5">
            {allViolations.slice(0, 3).map((v: Violation) => (
              <div 
                key={v.id} 
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-rose-300 transition-all flex items-start justify-between gap-3"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-1.5 py-0.2 text-[9px] font-mono font-bold uppercase rounded ${
                      v.severity === 'critical' ? 'bg-rose-100 text-rose-900 border border-rose-300' :
                      v.severity === 'high' ? 'bg-orange-100 text-orange-900 border border-orange-300' :
                      v.severity === 'medium' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                      'bg-blue-100 text-blue-900 border border-blue-300'
                    }`}>
                      {v.severity}
                    </span>
                    <span className="text-[10px] font-mono text-black font-bold">{v.ruleCode}</span>
                  </div>
                  <h4 className="text-xs font-black text-slate-900 line-clamp-1">{v.title}</h4>
                  <p className="text-[11px] text-slate-700 font-medium line-clamp-1">{v.productName} (Code: {v.sku})</p>
                </div>

                <button
                  onClick={() => {
                    setSelectedProductId(v.productId);
                    setCurrentTab('analysis_results');
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-xs text-teal-900 font-bold transition-colors flex-shrink-0 shadow-xs"
                >
                  Evidence
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
