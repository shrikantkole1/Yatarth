import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Scan, 
  Sparkles, 
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const ComplianceView: React.FC = () => {
  const { setCurrentTab, setIsCopilotOpen } = useApp();

  const standards = [
    { name: 'Net Quantity / Weight Rule', passing: 5, total: 6, percent: 83, status: '1 Warning (Font size small on Basmati Rice)' },
    { name: 'Retail Price & Tax Clause (MRP)', passing: 5, total: 6, percent: 83, status: '1 Violation (Turmeric missing tax text)' },
    { name: 'Country of Origin Declaration', passing: 5, total: 6, percent: 83, status: '1 Violation (Honey missing country of origin)' },
    { name: 'Customer Care Helpline & Email Rule', passing: 4, total: 6, percent: 67, status: '2 Violations (Missing email, short phone number)' },
    { name: 'Mfg Date, Batch & Expiry Traceability', passing: 5, total: 6, percent: 83, status: '1 Warning (Expiry date format unclear)' },
    { name: 'Typography & Print Clarity Rule', passing: 6, total: 6, percent: 100, status: 'All 6 Products Passed (100% OK)' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Packaging Rules & Compliance Matrix</h1>
            <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-full bg-teal-100 text-teal-900 border border-teal-300">
              OFFICIAL RULES
            </span>
          </div>
          <p className="text-xs text-black font-medium mt-1">
            Real-time compliance monitoring mapped against packaging rules, mandatory details, and legal standards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentTab('reports')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-black hover:bg-slate-50 shadow-xs"
          >
            <FileSpreadsheet size={14} className="text-teal-700" />
            <span>Download Rules Summary</span>
          </button>
          <button
            onClick={() => setCurrentTab('scan_product')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-sm hover:shadow"
          >
            <Scan size={14} />
            <span>Scan Product Label</span>
          </button>
        </div>
      </div>

      {/* Standards Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {standards.map((std, idx) => (
          <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3.5 hover:border-slate-300 transition-all">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-xs font-extrabold text-black leading-snug">{std.name}</h3>
              <span className={`px-2.5 py-0.5 rounded-md text-xs font-mono font-black ${
                std.percent === 100 ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                std.percent >= 80 ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-rose-100 text-rose-900 border border-rose-300'
              }`}>
                {std.percent}%
              </span>
            </div>

            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  std.percent === 100 ? 'bg-emerald-600' :
                  std.percent >= 80 ? 'bg-amber-500' : 'bg-rose-600'
                }`}
                style={{ width: `${std.percent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-black font-bold">
              <span>{std.passing} of {std.total} Products Passed</span>
              <span className="text-[10px] font-black text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                Rule OK
              </span>
            </div>

            <p className={`text-xs border-t border-slate-200 pt-2.5 flex items-center gap-1.5 font-bold ${
              std.percent === 100 ? 'text-emerald-800' : 'text-amber-900'
            }`}>
              {std.percent === 100 ? (
                <CheckCircle2 size={15} className="text-emerald-700 flex-shrink-0" />
              ) : (
                <AlertTriangle size={15} className="text-amber-700 flex-shrink-0" />
              )}
              <span className="truncate">{std.status}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Category Compliance Matrix Table */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h3 className="text-sm font-black text-slate-900 tracking-tight">Rule Compliance Breakdown by Category</h3>
            <p className="text-xs text-black font-medium">Percentage of checked products meeting packaging rules across each department</p>
          </div>
          <button
            onClick={() => setIsCopilotOpen(true)}
            className="text-xs text-blue-700 hover:text-blue-800 hover:underline flex items-center gap-1 font-bold"
          >
            <Sparkles size={13} /> Ask Yatarth AI to Analyze Gaps
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-black text-black uppercase tracking-wider">
                <th className="py-3.5 px-4">Product Category</th>
                <th className="py-3.5 px-3 text-center">Net Qty</th>
                <th className="py-3.5 px-3 text-center">MRP & Tax</th>
                <th className="py-3.5 px-3 text-center">Dates & Shelf</th>
                <th className="py-3.5 px-3 text-center">Customer Care</th>
                <th className="py-3.5 px-3 text-center">Origin</th>
                <th className="py-3.5 px-4 text-right">Category Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono">
              {[
                { cat: 'Packaged Food & Snacks', nq: '100%', mrp: '100%', dates: '92%', care: '100%', org: '100%', score: 94 },
                { cat: 'Spices & Seasoning', nq: '96%', mrp: '0% (VIOLATION)', dates: '98%', care: '0% (VIOLATION)', org: '100%', score: 58 },
                { cat: 'Grains & Staples', nq: '85% (FONT)', mrp: '100%', dates: '100%', care: '100%', org: '100%', score: 88 },
                { cat: 'Condiments & Spreads', nq: '100%', mrp: '100%', dates: '85%', care: '0% (VIOLATION)', org: '0% (VIOLATION)', score: 42 },
                { cat: 'Personal Care & Cosmetics', nq: '100%', mrp: '100%', dates: '100%', care: '100%', org: '100%', score: 98 },
                { cat: 'Beverages', nq: '100%', mrp: '100%', dates: '100%', care: '100%', org: '90%', score: 76 },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-sans font-black text-slate-900">{row.cat}</td>
                  <td className="py-3.5 px-3 text-center text-black font-bold">{row.nq}</td>
                  <td className={`py-3.5 px-3 text-center font-black ${row.mrp.includes('VIOLATION') ? 'text-red-700 bg-red-50' : 'text-black'}`}>{row.mrp}</td>
                  <td className="py-3.5 px-3 text-center text-black font-bold">{row.dates}</td>
                  <td className={`py-3.5 px-3 text-center font-black ${row.care.includes('VIOLATION') ? 'text-red-700 bg-red-50' : 'text-black'}`}>{row.care}</td>
                  <td className={`py-3.5 px-3 text-center font-black ${row.org.includes('VIOLATION') ? 'text-red-700 bg-red-50' : 'text-black'}`}>{row.org}</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full font-black text-xs ${
                      row.score >= 85 ? 'bg-blue-100 text-blue-900 border border-blue-300' :
                      row.score >= 70 ? 'bg-yellow-100 text-yellow-900 border border-yellow-300' : 'bg-red-100 text-red-900 border border-red-300'
                    }`}>
                      {row.score}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
