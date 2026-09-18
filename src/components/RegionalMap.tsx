import React, { useState } from 'react';
import { MapPin, ShieldAlert, CheckCircle2, AlertTriangle, XCircle, ChevronRight, TrendingUp, Building2, Filter } from 'lucide-react';

export interface RegionData {
  id: string;
  name: string;
  stateCode: string;
  complianceScore: number;
  totalScans: number;
  violationsCount: number;
  noticeCount: number;
  primaryViolationRule: string;
  topCategory: string;
  xPercent: number; // Map pin position X%
  yPercent: number; // Map pin position Y%
}

export const REGIONS_DATA: RegionData[] = [
  {
    id: 'MH',
    name: 'Maharashtra (Mumbai & Pune)',
    stateCode: 'MH',
    complianceScore: 94,
    totalScans: 1420,
    violationsCount: 85,
    noticeCount: 14,
    primaryViolationRule: 'Rule 6(11) Unit Sale Price Format',
    topCategory: 'Food & Beverages',
    xPercent: 32,
    yPercent: 58,
  },
  {
    id: 'DL',
    name: 'Delhi NCR (Delhi & Gurgaon)',
    stateCode: 'DL',
    complianceScore: 82,
    totalScans: 1150,
    violationsCount: 207,
    noticeCount: 38,
    primaryViolationRule: 'Rule 6(1)(f) Mfg/Expiry Date Blur',
    topCategory: 'Cosmetics & Personal Care',
    xPercent: 38,
    yPercent: 30,
  },
  {
    id: 'KA',
    name: 'Karnataka (Bengaluru)',
    stateCode: 'KA',
    complianceScore: 88,
    totalScans: 890,
    violationsCount: 107,
    noticeCount: 19,
    primaryViolationRule: 'Rule 6 Import Country of Origin',
    topCategory: 'Electronics & Electricals',
    xPercent: 36,
    yPercent: 74,
  },
  {
    id: 'GJ',
    name: 'Gujarat (Ahmedabad & Surat)',
    stateCode: 'GJ',
    complianceScore: 96,
    totalScans: 780,
    violationsCount: 31,
    noticeCount: 6,
    primaryViolationRule: 'Rule 7 Borderline Font Height',
    topCategory: 'Household Goods',
    xPercent: 22,
    yPercent: 48,
  },
  {
    id: 'TN',
    name: 'Tamil Nadu (Chennai)',
    stateCode: 'TN',
    complianceScore: 91,
    totalScans: 640,
    violationsCount: 57,
    noticeCount: 11,
    primaryViolationRule: 'Rule 6(1)(g) Helpline Email',
    topCategory: 'Textiles & Apparel',
    xPercent: 42,
    yPercent: 82,
  },
  {
    id: 'UP',
    name: 'Uttar Pradesh (Noida & Lucknow)',
    stateCode: 'UP',
    complianceScore: 68,
    totalScans: 950,
    violationsCount: 304,
    noticeCount: 62,
    primaryViolationRule: 'Rule 7 Font Size & Non-Metric Units (GMS)',
    topCategory: 'Food & Beverages',
    xPercent: 50,
    yPercent: 36,
  },
  {
    id: 'PB',
    name: 'Punjab & Haryana (Patiala & Sangrur)',
    stateCode: 'PB',
    complianceScore: 95,
    totalScans: 520,
    violationsCount: 26,
    noticeCount: 4,
    primaryViolationRule: 'Rule 6(1)(e) MRP Tax Phrase',
    topCategory: 'Food & Beverages',
    xPercent: 32,
    yPercent: 22,
  },
  {
    id: 'WB',
    name: 'West Bengal (Kolkata)',
    stateCode: 'WB',
    complianceScore: 74,
    totalScans: 710,
    violationsCount: 185,
    noticeCount: 41,
    primaryViolationRule: 'FSSAI Licence Number Missing',
    topCategory: 'Pharmaceuticals',
    xPercent: 68,
    yPercent: 46,
  },
];

export const RegionalMap: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<RegionData>(REGIONS_DATA[0]);
  const [filterScore, setFilterScore] = useState<'ALL' | 'HIGH' | 'MED' | 'LOW'>('ALL');

  const filteredRegions = REGIONS_DATA.filter((r) => {
    if (filterScore === 'HIGH') return r.complianceScore >= 90;
    if (filterScore === 'MED') return r.complianceScore >= 75 && r.complianceScore < 90;
    if (filterScore === 'LOW') return r.complianceScore < 75;
    return true;
  });

  const getScoreColor = (score: number) => {
    if (score >= 90) return { bg: 'bg-emerald-500', text: 'text-emerald-600', border: 'border-emerald-500', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 };
    if (score >= 75) return { bg: 'bg-amber-500', text: 'text-amber-600', border: 'border-amber-500', badge: 'bg-amber-50 text-amber-800 border-amber-200', icon: AlertTriangle };
    return { bg: 'bg-red-500', text: 'text-red-600', border: 'border-red-500', badge: 'bg-red-50 text-red-700 border-red-200', icon: XCircle };
  };

  const selectedColors = getScoreColor(selectedRegion.complianceScore);
  const SelectedIcon = selectedColors.icon;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">
              National Legal Metrology Region Compliance Heatmap
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Interactive map displaying state-wise LMPC compliance scores & violation alerts
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1.5 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Score Filter:
          </span>
          <button
            onClick={() => setFilterScore('ALL')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all text-[11px] cursor-pointer ${
              filterScore === 'ALL' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Regions ({REGIONS_DATA.length})
          </button>
          <button
            onClick={() => setFilterScore('HIGH')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all text-[11px] cursor-pointer ${
              filterScore === 'HIGH' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            High (&ge;90%)
          </button>
          <button
            onClick={() => setFilterScore('MED')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all text-[11px] cursor-pointer ${
              filterScore === 'MED' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-amber-800 hover:bg-amber-100'
            }`}
          >
            Moderate (75-89%)
          </button>
          <button
            onClick={() => setFilterScore('LOW')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all text-[11px] cursor-pointer ${
              filterScore === 'LOW' ? 'bg-red-600 text-white shadow-xs' : 'text-red-700 hover:bg-red-100'
            }`}
          >
            Violations (&lt;75%)
          </button>
        </div>
      </div>

      {/* Map & Detail Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive India Stylized Map Container */}
        <div className="lg:col-span-7 bg-slate-950 rounded-2xl border border-slate-800 p-4 relative min-h-[380px] flex flex-col justify-between overflow-hidden shadow-inner">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono z-10">
            <span className="flex items-center gap-1.5 text-blue-400 font-bold">
              <Building2 className="w-4 h-4" /> Legal Metrology Central GIS Map
            </span>
            <div className="flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> High &ge;90%</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Med 75-89%</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" /> Low &lt;75%</span>
            </div>
          </div>

          {/* India Map Outline SVG Background */}
          <div className="absolute inset-0 opacity-20 flex items-center justify-center pointer-events-none p-6">
            <svg viewBox="0 0 400 450" className="w-full h-full stroke-blue-500 fill-blue-900/20 stroke-1">
              <path d="M150,30 L190,20 L230,50 L220,100 L280,120 L310,180 L290,230 L250,280 L220,380 L180,410 L150,350 L120,290 L80,240 L60,180 L90,120 Z" />
            </svg>
          </div>

          {/* Interactive Region Pin Markers */}
          <div className="relative w-full h-[320px]">
            {filteredRegions.map((region) => {
              const colors = getScoreColor(region.complianceScore);
              const isSelected = selectedRegion.id === region.id;
              const IconComp = colors.icon;

              return (
                <button
                  key={region.id}
                  onClick={() => setSelectedRegion(region)}
                  style={{
                    left: `${region.xPercent}%`,
                    top: `${region.yPercent}%`,
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 z-20 cursor-pointer ${
                    isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                  }`}
                  title={`${region.name}: ${region.complianceScore}% Compliance`}
                >
                  <div className="relative flex items-center justify-center">
                    {/* Pulsing ring for selected region */}
                    {isSelected && (
                      <span className={`absolute w-10 h-10 rounded-full animate-ping opacity-75 ${colors.bg}`} />
                    )}

                    {/* Pin Badge with Score */}
                    <div
                      className={`px-2.5 py-1 rounded-xl shadow-lg border text-white text-[11px] font-black font-mono flex items-center gap-1 transition-all ${
                        colors.bg
                      } ${isSelected ? 'ring-4 ring-white/30 shadow-blue-500/50' : 'opacity-90'}`}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{region.stateCode}: {region.complianceScore}%</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="text-[10px] text-slate-500 font-mono flex justify-between items-center z-10 border-t border-slate-900 pt-2">
            <span>Click any state marker pin to view regional audit statistics</span>
            <span>Real-time LMPC Sync</span>
          </div>
        </div>

        {/* Selected Region Detail Breakdown Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className={`p-5 rounded-2xl border transition-all ${selectedColors.badge}`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-white/80 border border-slate-200">
                Region Audit Profile
              </span>
              <div className={`px-3 py-1 rounded-full border text-xs font-black uppercase flex items-center gap-1.5 ${selectedColors.badge}`}>
                <SelectedIcon className="w-4 h-4" />
                {selectedRegion.complianceScore}% COMPLIANT
              </div>
            </div>

            <h3 className="text-xl font-black text-slate-900 mt-2">{selectedRegion.name}</h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Legal Metrology State Circle &amp; Retail Packaging Surveillance
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Audits</span>
              <span className="text-xl font-black text-slate-900 font-mono">{selectedRegion.totalScans}</span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Violations Flagged</span>
              <span className={`text-xl font-black font-mono ${selectedRegion.violationsCount > 100 ? 'text-red-600' : 'text-amber-700'}`}>
                {selectedRegion.violationsCount}
              </span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Notices Issued</span>
              <span className="text-xl font-black text-blue-600 font-mono">{selectedRegion.noticeCount}</span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Top Category</span>
              <span className="text-xs font-bold text-slate-800 truncate block mt-1">{selectedRegion.topCategory}</span>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5 text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Primary Regional Violation Factor
            </span>
            <p className="font-extrabold text-slate-900 flex items-center gap-1.5 text-xs">
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
              {selectedRegion.primaryViolationRule}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
