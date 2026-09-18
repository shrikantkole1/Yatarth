import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  BarChart3, 
  PieChart as PieIcon, 
  TrendingUp, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownRight, 
  Sparkles,
  ShieldAlert,
  Layers,
  CheckCircle2,
  Calendar,
  Filter,
  Clock,
  Boxes
} from 'lucide-react';
import { Product } from '../types';

export const AnalyticsView: React.FC = () => {
  const { products, setIsCopilotOpen } = useApp();
  const [activeMetricTab, setActiveMetricTab] = useState<'violations' | 'categories' | 'surveillance'>('violations');
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);
  const [hoveredPieSlice, setHoveredPieSlice] = useState<string | null>(null);

  // Bar Graph Data: Category-wise Compliance Score Comparison
  const categoryScores = [
    { category: 'Food & Snacks', score: 94, totalSkus: 34, nonCompliant: 2, color: '#2563eb' }, // Blue
    { category: 'Cosmetics', score: 98, totalSkus: 26, nonCompliant: 0, color: '#3b82f6' }, // Light Blue
    { category: 'Grains & Staples', score: 88, totalSkus: 22, nonCompliant: 3, color: '#eab308' }, // Yellow
    { category: 'Beverages', score: 76, totalSkus: 18, nonCompliant: 4, color: '#f97316' }, // Orange
    { category: 'Spices & Salts', score: 58, totalSkus: 20, nonCompliant: 8, color: '#ef4444' }, // Red
    { category: 'Condiments', score: 42, totalSkus: 14, nonCompliant: 9, color: '#dc2626' }, // Dark Red
  ];

  // Pie Chart Data: Distribution of Legal Metrology Violation Types
  const violationPieData = [
    { label: 'MRP or Tax Details Missing', count: 18, percentage: 36, color: '#ef4444', code: 'RULE-MRP-01' }, // Red
    { label: 'Net Quantity Font Too Small', count: 12, percentage: 24, color: '#f97316', code: 'RULE-NQ-01' },   // Orange
    { label: 'Customer Care / Email Missing', count: 9, percentage: 18, color: '#eab308', code: 'RULE-CARE-01' }, // Yellow
    { label: 'Country of Origin Missing', count: 6, percentage: 12, color: '#2563eb', code: 'RULE-ORG-01' }, // Blue
    { label: 'Expiry or Best Before Missing', count: 5, percentage: 10, color: '#60a5fa', code: 'RULE-DATE-01' }  // Light Blue
  ];

  // Monthly Sampling Volume Bar Data
  const monthlyAudits = [
    { month: 'Apr', compliant: 18, violations: 12, total: 30 },
    { month: 'May', compliant: 24, violations: 9, total: 33 },
    { month: 'Jun', compliant: 28, violations: 8, total: 36 },
    { month: 'Jul', compliant: 32, violations: 7, total: 39 },
    { month: 'Aug', compliant: 38, violations: 5, total: 43 },
    { month: 'Sep', compliant: 42, violations: 3, total: 45 }
  ];

  // Pie chart calculation helper
  let cumulativeAngle = 0;
  const pieSlices = violationPieData.map((slice) => {
    const startAngle = cumulativeAngle;
    const sliceAngle = (slice.percentage / 100) * 360;
    cumulativeAngle += sliceAngle;
    const endAngle = cumulativeAngle;

    // Convert angles to SVG path coordinates (center 100, 100, radius 72)
    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((endAngle - 90) * Math.PI) / 180;
    const x1 = 100 + 72 * Math.cos(startRad);
    const y1 = 100 + 72 * Math.sin(startRad);
    const x2 = 100 + 72 * Math.cos(endRad);
    const y2 = 100 + 72 * Math.sin(endRad);

    const largeArcFlag = sliceAngle > 180 ? 1 : 0;
    const pathData = `M 100 100 L ${x1} ${y1} A 72 72 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

    return {
      ...slice,
      pathData,
      startAngle,
      endAngle
    };
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in text-black font-sans">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-300">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-black tracking-tight">Inspection Numbers & Analytics</h1>
            <span className="px-2.5 py-0.5 text-xs font-mono font-black rounded-full bg-blue-100 text-blue-900 border border-blue-300">
              INSPECTION METRICS
            </span>
          </div>
          <p className="text-sm font-bold text-black mt-1">
            See overall pass rates, common label mistakes, category performance, and store inspection trends.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-300">
            <button
              onClick={() => setActiveMetricTab('violations')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                activeMetricTab === 'violations'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-black hover:bg-slate-200'
              }`}
            >
              Label Errors
            </button>
            <button
              onClick={() => setActiveMetricTab('categories')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                activeMetricTab === 'categories'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-black hover:bg-slate-200'
              }`}
            >
              Category Pass Rates
            </button>
            <button
              onClick={() => setActiveMetricTab('surveillance')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                activeMetricTab === 'surveillance'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-black hover:bg-slate-200'
              }`}
            >
              Monthly Trends
            </button>
          </div>

          <button
            onClick={() => setIsCopilotOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-sm transition-all active:scale-95"
          >
            <Sparkles size={14} />
            <span>Ask Yatarth AI</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid - Modern Executive Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Blue - Pass Rate */}
        <div className="rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Pass Rate (Rules OK)
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/80">
                <TrendingUp size={16} />
              </div>
            </div>

            <div className="flex items-baseline justify-between mt-3">
              <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-sans">
                86.4%
              </h3>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 flex items-center gap-1">
                <ArrowUpRight size={13} className="text-emerald-600" /> +4.2%
              </span>
            </div>

            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3.5 overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full transition-all" style={{ width: '86.4%' }} />
            </div>
          </div>

          <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>Target: Above 95%</span>
            <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">High Compliance</span>
          </div>
        </div>

        {/* Card 2: Orange - Fix Time */}
        <div className="rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Average Fix Time
              </span>
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-200/80">
                <Clock size={16} />
              </div>
            </div>

            <div className="flex items-baseline justify-between mt-3">
              <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-sans">
                2.4 <span className="text-xl font-bold text-slate-600">days</span>
              </h3>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 flex items-center gap-1">
                <ArrowDownRight size={13} className="text-emerald-600" /> 35% Faster
              </span>
            </div>

            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3.5 overflow-hidden">
              <div className="bg-orange-500 h-full rounded-full transition-all" style={{ width: '65%' }} />
            </div>
          </div>

          <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>Brand turnaround time</span>
            <span className="text-[11px] font-bold text-orange-800 bg-orange-50 px-2 py-0.5 rounded">Fast Recovery</span>
          </div>
        </div>

        {/* Card 3: Red - Active Violations */}
        <div className="rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Active Violations
              </span>
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200/80">
                <AlertTriangle size={16} />
              </div>
            </div>

            <div className="flex items-baseline justify-between mt-3">
              <h3 className="text-3xl sm:text-4xl font-black text-rose-600 tracking-tight font-sans">
                4 <span className="text-xl font-bold text-rose-500">Errors</span>
              </h3>
              <span className="text-xs font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200">
                Action Required
              </span>
            </div>

            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3.5 overflow-hidden">
              <div className="bg-rose-500 h-full rounded-full transition-all" style={{ width: '38%' }} />
            </div>
          </div>

          <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>Official notices pending</span>
            <span className="text-[11px] font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded">Under Review</span>
          </div>
        </div>

        {/* Card 4: Yellow/Gold - Total Products */}
        <div className="rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Products Checked
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200/80">
                <Boxes size={16} />
              </div>
            </div>

            <div className="flex items-baseline justify-between mt-3">
              <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-sans">
                120 <span className="text-xl font-black text-slate-900">Products</span>
              </h3>
              <span className="text-xs font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                6 Categories
              </span>
            </div>

            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3.5 overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full transition-all" style={{ width: '100%' }} />
            </div>
          </div>

          <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>Across 4 retail zones</span>
            <span className="text-[11px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded">All Monitored</span>
          </div>
        </div>
      </div>

      {/* Primary Analytics Section: Side-by-Side Visual Bar Graph & Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Columns: Interactive Horizontal & Vertical Bar Graphs */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-white border border-slate-300 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3 gap-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
                <BarChart3 size={18} />
              </div>
              <div>
                <h3 className="text-base font-black text-black">
                  Category Pass Rates
                </h3>
                <p className="text-xs font-bold text-black">Percentage of products that passed legal packaging rules</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono font-bold">
              <span className="flex items-center gap-1 text-black">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-600" /> &gt;85% Pass
              </span>
              <span className="flex items-center gap-1 text-black">
                <span className="w-2.5 h-2.5 rounded-sm bg-yellow-500" /> 70-85%
              </span>
              <span className="flex items-center gap-1 text-black">
                <span className="w-2.5 h-2.5 rounded-sm bg-red-500" /> &lt;70%
              </span>
            </div>
          </div>

          {/* Clean Horizontal Bar Graph - High Contrast Labels */}
          <div className="space-y-3 pt-1">
            {categoryScores.map((item, idx) => {
              const isHovered = hoveredBarIndex === idx;
              return (
                <div
                  key={idx}
                  onMouseEnter={() => setHoveredBarIndex(idx)}
                  onMouseLeave={() => setHoveredBarIndex(null)}
                  className={`p-2.5 rounded-xl transition-all ${
                    isHovered ? 'bg-slate-100 shadow-2xs scale-[1.01]' : ''
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-black text-black flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      {item.category}
                    </span>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-black text-xs font-bold">
                        {item.totalSkus} Products ({item.nonCompliant} with errors)
                      </span>
                      <span
                        className="font-black px-2 py-0.5 rounded text-xs border"
                        style={{
                          backgroundColor: `${item.color}20`,
                          color: item.color,
                          borderColor: item.color
                        }}
                      >
                        {item.score}%
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden relative">
                    <div
                      className="h-full rounded-full transition-all duration-500 relative"
                      style={{
                        width: `${item.score}%`,
                        backgroundColor: item.color
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Monthly Sampling Volume Comparison (Stacked Bar Visualization) */}
          <div className="pt-4 border-t border-slate-200">
            <h4 className="text-xs font-black text-black uppercase font-mono tracking-wider mb-3 flex items-center justify-between">
              <span>Monthly Store Inspections (Pass vs Errors)</span>
              <span className="text-xs font-bold text-black">226 Total Products Inspected</span>
            </h4>

            <div className="grid grid-cols-6 gap-2 text-center pt-2">
              {monthlyAudits.map((m, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <div className="w-full h-28 bg-slate-100 rounded-lg flex flex-col justify-end p-1 border border-slate-300">
                    {/* Red Violation Bar Portion */}
                    <div
                      className="w-full rounded-t-sm bg-red-500"
                      style={{ height: `${(m.violations / m.total) * 100}%` }}
                      title={`${m.violations} Violations`}
                    />
                    {/* Blue Compliant Bar Portion */}
                    <div
                      className="w-full rounded-b-sm bg-blue-600 mt-0.5"
                      style={{ height: `${(m.compliant / m.total) * 100}%` }}
                      title={`${m.compliant} Compliant`}
                    />
                  </div>
                  <span className="text-xs font-mono font-black text-black">{m.month}</span>
                  <span className="text-xs font-mono font-bold text-black">{m.total}</span>
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-center gap-6 text-xs font-mono font-bold text-black mt-3 pt-2 border-t border-slate-200">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-blue-600" /> Passed (No Errors)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-red-500" /> Failed (Notice Issued)
              </span>
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Interactive Pie Chart & Offence Breakdown */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-white border border-slate-300 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-orange-50 text-orange-600">
                <PieIcon size={18} />
              </div>
              <div>
                <h3 className="text-base font-black text-black">
                  Most Common Packaging Mistakes
                </h3>
                <p className="text-xs font-bold text-black">Distribution of label errors found during inspections</p>
              </div>
            </div>
          </div>

          {/* SVG Pie / Donut Chart */}
          <div className="relative flex flex-col items-center justify-center py-2">
            <svg viewBox="0 0 200 200" className="w-48 h-48 transform -rotate-90">
              {pieSlices.map((slice, i) => {
                const isHovered = hoveredPieSlice === slice.label;
                return (
                  <path
                    key={i}
                    d={slice.pathData}
                    fill={slice.color}
                    className="cursor-pointer transition-all duration-200 hover:opacity-90"
                    stroke="#ffffff"
                    strokeWidth={isHovered ? 4 : 2}
                    transform={isHovered ? 'scale(1.04) translate(-4, -4)' : undefined}
                    onMouseEnter={() => setHoveredPieSlice(slice.label)}
                    onMouseLeave={() => setHoveredPieSlice(null)}
                  />
                );
              })}
              {/* Inner circle to make donut chart */}
              <circle cx="100" cy="100" r="44" fill="#ffffff" />
            </svg>

            {/* Donut Center Label - Black, Bold */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-black font-mono">50</span>
              <span className="text-[10px] font-black text-black font-mono uppercase">TOTAL ERRORS</span>
            </div>
          </div>

          {/* Pie Chart Legend & Breakdown List - Solid Black Text */}
          <div className="space-y-2 pt-1 border-t border-slate-200">
            {violationPieData.map((item, idx) => {
              const isHovered = hoveredPieSlice === item.label;
              return (
                <div
                  key={idx}
                  onMouseEnter={() => setHoveredPieSlice(item.label)}
                  onMouseLeave={() => setHoveredPieSlice(null)}
                  className={`flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer ${
                    isHovered ? 'bg-slate-100 shadow-2xs' : ''
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="truncate">
                      <p className="text-xs font-black text-black truncate">{item.label}</p>
                      <p className="text-[10px] font-mono font-bold text-black">{item.code}</p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0 font-mono">
                    <span className="text-xs font-black text-black">{item.count}</span>
                    <span
                      className="text-xs font-black ml-2 px-2 py-0.5 rounded border"
                      style={{
                        backgroundColor: `${item.color}20`,
                        color: item.color,
                        borderColor: item.color
                      }}
                    >
                      {item.percentage}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Row: Products Risk Table with Clear Alignment and Black Text */}
      <div className="p-5 rounded-2xl bg-white border border-slate-300 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h3 className="text-base font-black text-black">
              All Inspected Products Table
            </h3>
            <p className="text-xs font-bold text-black">Complete list of inspected products with test scores, rule violations, and inspecting officer</p>
          </div>
          <span className="text-xs font-mono font-black text-blue-900 bg-blue-100 px-3 py-1 rounded-lg border border-blue-300">
            {products.length} Products Checked
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-300 bg-slate-100 text-xs font-mono text-black uppercase font-black">
                <th className="py-3 px-4 font-black">Product Name</th>
                <th className="py-3 px-3 font-black">Product Code</th>
                <th className="py-3 px-3 font-black">Category</th>
                <th className="py-3 px-3 font-black text-center">Score</th>
                <th className="py-3 px-3 font-black">Result</th>
                <th className="py-3 px-3 font-black text-center">Errors</th>
                <th className="py-3 px-4 font-black text-right">Inspector</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {products.map((p: Product) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-black text-black">{p.name}</td>
                  <td className="py-3.5 px-3 font-mono font-bold text-black">{p.sku}</td>
                  <td className="py-3.5 px-3 text-black font-semibold">{p.category}</td>
                  <td className="py-3.5 px-3 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full font-mono font-black text-xs ${
                        p.complianceScore >= 85
                          ? 'bg-blue-100 text-blue-900 border border-blue-300'
                          : p.complianceScore >= 70
                          ? 'bg-yellow-100 text-yellow-950 border border-yellow-300'
                          : 'bg-red-100 text-red-950 border border-red-300'
                      }`}
                    >
                      {p.complianceScore}%
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        p.status === 'compliant'
                          ? 'bg-blue-100 text-blue-900'
                          : p.status === 'warning'
                          ? 'bg-yellow-100 text-yellow-950'
                          : 'bg-red-100 text-red-950'
                      }`}
                    >
                      {p.status === 'compliant' ? 'PASSED' : p.status === 'warning' ? 'NOTICE' : 'FAILED'}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono font-black">
                    {p.criticalIssues > 0 ? (
                      <span className="text-red-700">{p.criticalIssues} Critical</span>
                    ) : p.issuesCount > 0 ? (
                      <span className="text-yellow-900">{p.issuesCount} Notice</span>
                    ) : (
                      <span className="text-emerald-700">0 Errors</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right text-black font-bold">{p.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
