import React, { useState } from 'react';
import {
  TrendingUp, BarChart3, ShieldCheck, DollarSign,
  PieChart, Award, ShieldAlert, CheckCircle2, Activity
} from 'lucide-react';

const monthlyTrends = [
  { month: 'Jan', audits: 420,  compliance: 88 },
  { month: 'Feb', audits: 510,  compliance: 90 },
  { month: 'Mar', audits: 640,  compliance: 85 },
  { month: 'Apr', audits: 780,  compliance: 92 },
  { month: 'May', audits: 890,  compliance: 89 },
  { month: 'Jun', audits: 1050, compliance: 94 },
  { month: 'Jul', audits: 1210, compliance: 91 },
  { month: 'Aug', audits: 1420, compliance: 95 },
];

const ruleViolations = [
  { rule: 'Rule 6(1)(e) — MRP Tax Statement',    count: 412, percent: 28, color: '#ef4444' },
  { rule: 'Rule 6(11) — Unit Sale Price (USP)',   count: 352, percent: 24, color: '#f59e0b' },
  { rule: 'Rule 7 — Numeral Font Height',         count: 323, percent: 22, color: '#3b82f6' },
  { rule: 'Rule 6(1)(a) — Manufacturer Address', count: 264, percent: 18, color: '#6366f1' },
  { rule: 'FSSAI Licence Number Code',            count: 118, percent:  8, color: '#10b981' },
];

const categoryRisk = [
  { category: 'Electronics & Electricals', compliance: 76, risk: 'HIGH',   audits: 890,  violations: 213 },
  { category: 'Cosmetics & Personal Care', compliance: 82, risk: 'HIGH',   audits: 1150, violations: 207 },
  { category: 'Food & Beverages',          compliance: 89, risk: 'MEDIUM', audits: 2420, violations: 266 },
  { category: 'Pharmaceuticals',           compliance: 94, risk: 'LOW',    audits: 710,  violations:  42 },
  { category: 'Household Goods',           compliance: 96, risk: 'LOW',    audits: 780,  violations:  31 },
];

const topViolatingBrands = [
  { brand: 'Wave Snacks Ltd',         category: 'Food & Beverages', violations: 48, penaltyFine: '?12,00,000', status: 'Notice Issued' },
  { brand: 'Sonic Wireless Audio',    category: 'Electronics',      violations: 38, penaltyFine: '?9,50,000',  status: 'Under Investigation' },
  { brand: 'Royale Herbal Cosmetics', category: 'Personal Care',    violations: 32, penaltyFine: '?8,00,000',  status: 'Notice Issued' },
  { brand: 'Crisp Foods India',       category: 'Food & Beverages', violations: 24, penaltyFine: '?6,00,000',  status: 'Resolved' },
];

const BAR_W = 560; const BAR_H = 190;
const BP = { top: 20, right: 12, bottom: 32, left: 48 };
const maxAudits = Math.max(...monthlyTrends.map(d => d.audits));

function BarChart() {
  const [hov, setHov] = useState<number | null>(null);
  const iW = BAR_W - BP.left - BP.right;
  const iH = BAR_H - BP.top  - BP.bottom;
  const gap = iW / monthlyTrends.length;
  const bW  = gap * 0.55;
  const yTicks = [0, 500, 1000, 1500].map(v => ({
    v, y: BP.top + iH - (v / maxAudits) * iH
  }));
  return (
    <svg viewBox={`0 0 ${BAR_W} ${BAR_H}`} className="w-full h-auto">
      <defs>
        <linearGradient id="bg1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6"/>
          <stop offset="100%" stopColor="#1e3a8a"/>
        </linearGradient>
        <linearGradient id="bg2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2563eb"/>
          <stop offset="100%" stopColor="#0B3D91"/>
        </linearGradient>
      </defs>
      {yTicks.map(t => (
        <g key={t.v}>
          <line x1={BP.left} x2={BAR_W-BP.right} y1={t.y} y2={t.y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3"/>
          <text x={BP.left-4} y={t.y+3} textAnchor="end" fontSize="8" fill="#94a3b8" fontFamily="monospace">{t.v}</text>
        </g>
      ))}
      {monthlyTrends.map((d, i) => {
        const bH = (d.audits / maxAudits) * iH;
        const x  = BP.left + gap*i + (gap - bW)/2;
        const y  = BP.top + iH - bH;
        const hi = hov === i;
        return (
          <g key={d.month} onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)} style={{cursor:'pointer'}}>
            {hi && <rect x={BP.left+gap*i} y={BP.top} width={gap} height={iH} fill="#eff6ff" rx="3"/>}
            <rect x={x} y={y} width={bW} height={bH} rx="4" fill={hi ? 'url(#bg2)' : 'url(#bg1)'}/>
            {hi && <text x={x+bW/2} y={y-4} textAnchor="middle" fontSize="8" fill="#1e40af" fontFamily="monospace" fontWeight="bold">{d.audits}</text>}
            <text x={x+bW/2} y={BAR_H-4} textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="bold">{d.month}</text>
          </g>
        );
      })}
    </svg>
  );
}

const LINE_W = 560; const LINE_H = 170;
const LP = { top: 16, right: 12, bottom: 32, left: 40 };

function LineChart() {
  const [hov, setHov] = useState<number | null>(null);
  const iW = LINE_W - LP.left - LP.right;
  const iH = LINE_H - LP.top  - LP.bottom;
  const minC = 80, maxC = 100;
  const toX = (i: number) => LP.left + (i / (monthlyTrends.length-1)) * iW;
  const toY = (v: number) => LP.top  + iH - ((v-minC)/(maxC-minC)) * iH;
  const pts = monthlyTrends.map((d, i) => ({ x: toX(i), y: toY(d.compliance), ...d }));
  const poly = pts.map(p => `${p.x},${p.y}`).join(' ');
  const area = `M${pts[0].x},${LP.top+iH} ` + pts.map(p=>`L${p.x},${p.y}`).join(' ') + ` L${pts[pts.length-1].x},${LP.top+iH} Z`;
  const yTicks = [80,85,90,95,100];
  return (
    <svg viewBox={`0 0 ${LINE_W} ${LINE_H}`} className="w-full h-auto">
      <defs>
        <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#10b981" stopOpacity="0.20"/>
          <stop offset="100%" stopColor="#10b981" stopOpacity="0.01"/>
        </linearGradient>
      </defs>
      {yTicks.map(v => (
        <g key={v}>
          <line x1={LP.left} x2={LINE_W-LP.right} y1={toY(v)} y2={toY(v)} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3"/>
          <text x={LP.left-4} y={toY(v)+3} textAnchor="end" fontSize="8" fill="#94a3b8" fontFamily="monospace">{v}%</text>
        </g>
      ))}
      <path d={area} fill="url(#ag)"/>
      <polyline points={poly} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
      {pts.map((p,i) => (
        <g key={i} onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)} style={{cursor:'pointer'}}>
          <circle cx={p.x} cy={p.y} r={hov===i ? 6 : 4} fill={hov===i ? '#059669':'#10b981'} stroke="white" strokeWidth="2"/>
          {hov===i && (
            <>
              <rect x={p.x-22} y={p.y-24} width="44" height="16" rx="4" fill="#064e3b"/>
              <text x={p.x} y={p.y-13} textAnchor="middle" fontSize="8" fill="white" fontFamily="monospace" fontWeight="bold">{p.compliance}%</text>
            </>
          )}
          <text x={p.x} y={LINE_H-4} textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="bold">{p.month}</text>
        </g>
      ))}
    </svg>
  );
}

function RiskBadge({ risk }: { risk: string }) {
  const cls = risk==='HIGH' ? 'bg-red-50 text-red-700 border-red-100' :
              risk==='MEDIUM' ? 'bg-amber-50 text-amber-800 border-amber-100' :
                                'bg-emerald-50 text-emerald-700 border-emerald-100';
  return <span className={`px-2 py-0.5 rounded-full border text-[10px] font-black uppercase ${cls}`}>{risk}</span>;
}

export const DashboardAnalytics: React.FC = () => (
  <div className="space-y-5">

    {/* KPI Strip */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { label: 'Total Penalty Fines',   value: '?45.5 L', sub: 'Section 36 Compounding',  Icon: DollarSign,   accent: 'text-emerald-400', dark: true  },
        { label: 'Legal Notices Issued',  value: '182',      sub: 'Section 36 Prosecutions', Icon: ShieldAlert,  accent: 'text-red-400',     dark: false },
        { label: 'Case Resolution Rate',  value: '86.4%',    sub: '+4.2% YoY Improvement',   Icon: CheckCircle2, accent: 'text-emerald-600', dark: false },
        { label: 'Avg Inspection Time',   value: '1.8 sec',  sub: 'Yatarth AI OCR Pipeline', Icon: TrendingUp,   accent: 'text-blue-500',    dark: false },
      ].map(k => (
        <div key={k.label} className={`rounded-2xl p-4 border shadow-sm ${k.dark ? 'bg-gradient-to-br from-slate-900 to-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{k.label}</span>
            <k.Icon className={`w-4 h-4 ${k.accent}`}/>
          </div>
          <p className={`text-2xl font-black font-mono mt-2 ${k.accent}`}>{k.value}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{k.sub}</p>
        </div>
      ))}
    </div>

    {/* Charts Row */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-blue-600"/>Monthly Audit Volume</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Jan – Aug 2026 • packaging scans</p>
          </div>
          <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full font-bold">8 months</span>
        </div>
        <BarChart/>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2"><Activity className="w-4 h-4 text-emerald-600"/>Compliance % Trend</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Jan – Aug 2026 • LMR 2011 targets</p>
          </div>
          <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full font-bold">Target =90%</span>
        </div>
        <LineChart/>
      </div>
    </div>

    {/* Violations + Category Risk */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4"><PieChart className="w-4 h-4 text-blue-600"/>Rule Violation Breakdown</h3>
        <div className="space-y-3.5">
          {ruleViolations.map(v => (
            <div key={v.rule}>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-800 truncate pr-2">{v.rule}</span>
                <span className="font-mono text-slate-400 shrink-0">{v.count} ({v.percent}%)</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div style={{ width:`${v.percent*3.5}%`, backgroundColor:v.color }} className="h-full rounded-full"/>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4"><ShieldCheck className="w-4 h-4 text-blue-600"/>Category Risk Index</h3>
        <div className="space-y-2">
          {categoryRisk.map(c => (
            <div key={c.category} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs hover:bg-slate-100 transition-colors">
              <div className="min-w-0">
                <p className="font-bold text-slate-900 truncate">{c.category}</p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{c.audits.toLocaleString()} scans · {c.violations} violations</p>
              </div>
              <div className="flex items-center gap-2 ml-3 shrink-0">
                <RiskBadge risk={c.risk}/>
                <span className="font-black font-mono text-slate-900 w-10 text-right">{c.compliance}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Brand Leaderboard */}
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2"><Award className="w-4 h-4 text-red-500"/>Top Non-Compliant Manufacturers</h3>
        <span className="text-[10px] text-slate-400 font-mono bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full">Section 36 Tracker</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse min-w-[500px]">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px] font-bold">
              <th className="pb-2"># Brand</th>
              <th className="pb-2 px-3">Category</th>
              <th className="pb-2 px-3">Violations</th>
              <th className="pb-2 px-3">Fine</th>
              <th className="pb-2 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {topViolatingBrands.map((b, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors">
                <td className="py-2.5 font-bold text-slate-900">
                  <span className="inline-flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 text-[10px] flex items-center justify-center font-mono">{i+1}</span>
                    {b.brand}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-slate-500">{b.category}</td>
                <td className="py-2.5 px-3 text-red-600 font-black font-mono">{b.violations}</td>
                <td className="py-2.5 px-3 text-emerald-700 font-bold font-mono">{b.penaltyFine}</td>
                <td className="py-2.5 text-right">
                  <span className={`inline-block px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${
                    b.status==='Notice Issued' ? 'bg-red-50 text-red-600 border border-red-100' :
                    b.status==='Resolved'      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                                 'bg-amber-50 text-amber-700 border border-amber-100'
                  }`}>{b.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);
