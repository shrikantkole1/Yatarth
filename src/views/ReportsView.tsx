import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileText, 
  Printer, 
  Eye, 
  Plus, 
  Sparkles,
  FileSpreadsheet,
  X
} from 'lucide-react';
import { ReportItem, Product } from '../types';

export const ReportsView: React.FC = () => {
  const { reports, products, addNewReport, currentUser } = useApp();

  const [selectedReportType, setSelectedReportType] = useState<ReportItem['type']>('Product Compliance');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [previewReport, setPreviewReport] = useState<ReportItem | null>(reports[0] || null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newRep: ReportItem = {
        id: 'rep-' + Date.now(),
        reportNumber: `LM-REP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        title: `${selectedReportType} - Official Inspection Report`,
        type: selectedReportType,
        generatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        author: currentUser.name,
        scope: selectedCategory === 'all' ? 'All Retail Categories (6 Categories)' : selectedCategory,
        complianceRate: Math.round(products.reduce((a: number, b: Product) => a + b.complianceScore, 0) / products.length),
        criticalIssuesCount: products.reduce((a: number, b: Product) => a + b.criticalIssues, 0),
        status: 'ready',
        fileSize: '3.6 MB'
      };
      addNewReport(newRep);
      setPreviewReport(newRep);
      setIsGenerating(false);
    }, 600);
  };

  const handleDownloadCSV = (rep: ReportItem) => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Report Number,Title,Type,Pass Rate,Critical Errors,Generated At,Scope\n" +
      `"${rep.reportNumber}","${rep.title}","${rep.type}","${rep.complianceRate}%","${rep.criticalIssuesCount}","${rep.generatedAt}","${rep.scope}"\n\n` +
      "Product,SKU,Compliance Score,Status,Violations Count\n" +
      products.map((p: Product) => `"${p.name}","${p.sku}","${p.complianceScore}","${p.status}","${p.violations.length}"`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${rep.reportNumber}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in text-black font-sans">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-300">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-black tracking-tight">Official Inspection Reports</h1>
            <span className="px-2.5 py-0.5 text-xs font-mono font-black rounded-full bg-blue-100 text-blue-900 border border-blue-300">
              OFFICIAL RECORDS
            </span>
          </div>
          <p className="text-sm font-bold text-black mt-1">
            Create, view, print, and download official legal metrology inspection reports and test files.
          </p>
        </div>
      </div>

      {/* Generator Configuration Card */}
      <div className="p-5 rounded-2xl bg-white border border-slate-300 shadow-xs space-y-4">
        <h3 className="text-sm font-black text-black flex items-center gap-2">
          <Plus size={16} className="text-blue-600 stroke-[3]" />
          Create New Inspection Report
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="text-xs font-black text-black block mb-1">Report Type</label>
            <select
              value={selectedReportType}
              onChange={(e) => setSelectedReportType(e.target.value as any)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-black focus:outline-none focus:border-blue-600"
            >
              <option value="Product Compliance">Product Compliance Report</option>
              <option value="Audit Inspection">Store Inspection Report</option>
              <option value="Executive Summary">Executive Inspection Summary</option>
              <option value="Violation Matrix">Violations List Report</option>
              <option value="Comprehensive Audit">Full Store Audit Report</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-black text-black block mb-1">Category Filter</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-black focus:outline-none focus:border-blue-600"
            >
              <option value="all">All Product Categories</option>
              <option value="Packaged Food & Snacks">Packaged Food & Snacks</option>
              <option value="Spices & Seasoning">Spices & Seasoning</option>
              <option value="Grains & Staples">Grains & Staples</option>
              <option value="Beverages">Beverages</option>
              <option value="Personal Care & Cosmetics">Personal Care & Cosmetics</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-black text-black block mb-1">Errors Filter</label>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-black focus:outline-none focus:border-blue-600"
            >
              <option value="all">All Violations Included</option>
              <option value="critical_only">Critical Errors Only</option>
              <option value="advisory">Minor Discrepancies Only</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-sm hover:shadow active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>Generating Report...</>
              ) : (
                <>
                  <Sparkles size={14} />
                  <span>Generate Report</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Reports Library Table */}
      <div className="p-5 rounded-2xl bg-white border border-slate-300 shadow-xs space-y-3">
        <h3 className="text-xs font-black text-black uppercase font-mono tracking-wider">
          Saved Reports Archive ({reports.length})
        </h3>

        <div className="divide-y divide-slate-200">
          {reports.map((rep: ReportItem) => (
            <div
              key={rep.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 px-2.5 rounded-lg transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700 mt-0.5 border border-blue-200">
                  <FileText size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-black text-black">{rep.title}</h4>
                    <span className="px-1.5 py-0.2 text-[10px] font-mono font-black rounded bg-blue-100 text-blue-900 border border-blue-300">
                      {rep.type}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-black mt-0.5">{rep.scope}</p>
                  <div className="flex items-center gap-3 text-xs font-mono font-bold text-black mt-1">
                    <span>ID: {rep.reportNumber}</span>
                    <span>• Date: {rep.generatedAt}</span>
                    <span>• Officer: {rep.author}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right font-mono text-xs font-bold text-black">
                  <span className="block font-black text-blue-700 text-sm">{rep.complianceRate}% Score</span>
                  <span className="block text-rose-700">{rep.criticalIssuesCount} Violations</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setPreviewReport(rep)}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-black transition-colors"
                    title="View Report"
                  >
                    <Eye size={15} />
                  </button>
                  <button
                    onClick={() => handleDownloadCSV(rep)}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-emerald-800 transition-colors"
                    title="Download Excel / CSV"
                  >
                    <FileSpreadsheet size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Report Preview Modal */}
      {previewReport && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="w-full max-w-3xl bg-white border border-slate-300 rounded-2xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header Controls */}
            <div className="p-4 border-b border-slate-300 bg-slate-50 flex items-center justify-between no-print">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-blue-600" />
                <h3 className="text-xs font-black text-black font-mono">{previewReport.reportNumber}</h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-black text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Printer size={13} />
                  <span>Print / Save as PDF</span>
                </button>
                <button
                  onClick={() => setPreviewReport(null)}
                  className="p-1.5 rounded-lg text-black hover:bg-slate-200"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Document Body (Printable Area) */}
            <div className="p-8 overflow-y-auto space-y-6 text-black text-xs bg-white font-sans" id="printable-report">
              {/* Official Header */}
              <div className="flex items-start justify-between border-b-2 border-slate-300 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-xl text-blue-700">YATARTH AI</span>
                    <span className="text-[10px] font-mono font-black text-blue-900 bg-blue-100 border border-blue-300 px-2 py-0.5 rounded">
                      OFFICIAL INSPECTION REPORT
                    </span>
                  </div>
                  <p className="text-xs font-bold text-black">Legal Metrology Market Inspection System</p>
                  <p className="text-xs text-black font-mono font-bold">Report Number: {previewReport.reportNumber}</p>
                </div>

                <div className="text-right font-mono text-xs text-black font-bold space-y-0.5">
                  <p>Issue Date: {previewReport.generatedAt}</p>
                  <p>Inspecting Officer: {previewReport.author}</p>
                  <p>Status: <span className="text-emerald-800 font-black">VERIFIED & SIGNED</span></p>
                </div>
              </div>

              {/* Summary */}
              <div>
                <h4 className="text-xs font-black text-black uppercase font-mono tracking-wider mb-2">
                  1. Inspection Scope & Results
                </h4>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-300 space-y-2">
                  <p className="leading-relaxed text-black font-medium">
                    This official inspection report was verified in accordance with Legal Metrology Packaged Commodities Rules (PCR 2011), checking mandatory price declarations, net quantity standards, and manufacturer information.
                  </p>
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 font-mono text-xs">
                    <div>
                      <span className="text-black block font-bold">Scope:</span>
                      <span className="font-black text-black">{previewReport.scope}</span>
                    </div>
                    <div>
                      <span className="text-black block font-bold">Pass Rate:</span>
                      <span className="font-black text-blue-700">{previewReport.complianceRate}%</span>
                    </div>
                    <div>
                      <span className="text-black block font-bold">Rule Violations:</span>
                      <span className="font-black text-rose-700">{previewReport.criticalIssuesCount} Flags</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Scorecard */}
              <div>
                <h4 className="text-xs font-black text-black uppercase font-mono tracking-wider mb-2">
                  2. Product Test Results
                </h4>
                <div className="border border-slate-300 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 border-b border-slate-300 font-mono text-black font-black">
                      <tr>
                        <th className="p-2.5">Product Name</th>
                        <th className="p-2.5">Product Code</th>
                        <th className="p-2.5">Score</th>
                        <th className="p-2.5">Status</th>
                        <th className="p-2.5">Violations</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-mono">
                      {products.map((p: Product) => (
                        <tr key={p.id}>
                          <td className="p-2.5 font-sans font-bold text-black">{p.name}</td>
                          <td className="p-2.5 text-black font-bold">{p.sku}</td>
                          <td className="p-2.5 font-black text-blue-700">{p.complianceScore}/100</td>
                          <td className="p-2.5 uppercase text-[10px]">
                            <span className={`px-2 py-0.5 rounded font-black ${
                              p.status === 'compliant' ? 'text-emerald-900 bg-emerald-100 border border-emerald-300' :
                              p.status === 'warning' ? 'text-yellow-950 bg-yellow-100 border border-yellow-300' : 'text-rose-950 bg-rose-100 border border-rose-300'
                            }`}>
                              {p.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="p-2.5 text-black font-black">{p.issuesCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Digital Signature & Certification Stamp */}
              <div className="pt-4 border-t border-slate-300 flex items-center justify-between font-mono text-xs text-black">
                <div>
                  <p className="font-black text-black">LEGAL METROLOGY DIVISION</p>
                  <p className="font-bold">Official Digital Inspection Record</p>
                  <p>Verification Standard: Legal Metrology Act, 2009 & PCR 2011</p>
                </div>

                <div className="text-right border-2 border-dashed border-blue-600 p-2.5 rounded-lg text-blue-900 bg-blue-50">
                  <p className="font-black">DIGITALLY CERTIFIED</p>
                  <p className="text-[10px] font-bold">OFFICIAL INSPECTION SEAL</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
