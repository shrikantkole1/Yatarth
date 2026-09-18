import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  ExternalLink, 
  Sparkles,
  AlertTriangle,
  FileCheck
} from 'lucide-react';
import { ReviewStatus, SeverityLevel, Violation, TeamMember } from '../types';

export const ViolationsView: React.FC = () => {
  const { 
    allViolations, 
    updateViolationStatus, 
    assignViolation, 
    teamMembers, 
    setSelectedProductId, 
    setCurrentTab,
    setIsCopilotOpen
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'open' | 'critical' | 'high' | 'medium' | 'resolved'>('open');
  const [search, setSearch] = useState('');
  const [selectedViolation, setSelectedViolation] = useState<Violation | null>(allViolations[0] || null);

  const openCount = allViolations.filter((v: Violation) => v.reviewStatus === 'open').length;
  const criticalCount = allViolations.filter((v: Violation) => v.severity === 'critical' && v.reviewStatus !== 'resolved').length;
  const highCount = allViolations.filter((v: Violation) => v.severity === 'high' && v.reviewStatus !== 'resolved').length;
  const mediumCount = allViolations.filter((v: Violation) => v.severity === 'medium' && v.reviewStatus !== 'resolved').length;
  const resolvedCount = allViolations.filter((v: Violation) => v.reviewStatus === 'resolved').length;

  const filteredViolations = allViolations.filter((v: Violation) => {
    const matchesSearch =
      v.title.toLowerCase().includes(search.toLowerCase()) ||
      v.productName.toLowerCase().includes(search.toLowerCase()) ||
      v.sku.toLowerCase().includes(search.toLowerCase()) ||
      v.ruleCode.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'all') return true;
    if (activeTab === 'open') return v.reviewStatus === 'open';
    if (activeTab === 'critical') return v.severity === 'critical';
    if (activeTab === 'high') return v.severity === 'high';
    if (activeTab === 'medium') return v.severity === 'medium';
    if (activeTab === 'resolved') return v.reviewStatus === 'resolved';

    return true;
  });

  const getSeverityBadge = (severity: SeverityLevel) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-rose-100 text-rose-800 border border-rose-200">
            Critical
          </span>
        );
      case 'high':
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-orange-100 text-orange-800 border border-orange-200">
            High
          </span>
        );
      case 'medium':
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-amber-100 text-amber-800 border border-amber-200">
            Medium
          </span>
        );
      case 'low':
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-blue-100 text-blue-800 border border-blue-200">
            Low
          </span>
        );
    }
  };

  const getStatusBadge = (status: ReviewStatus) => {
    switch (status) {
      case 'open':
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-rose-50 text-rose-800 border border-rose-200">
            Open Notice
          </span>
        );
      case 'under_review':
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-amber-50 text-amber-800 border border-amber-200">
            Under Verification
          </span>
        );
      case 'resolved':
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
            Rectified
          </span>
        );
      case 'dismissed':
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-100 text-slate-600 border border-slate-200">
            Dismissed
          </span>
        );
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in text-slate-900">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900">Rule Violations & Notices Hub</h1>
            <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-md bg-rose-100 text-rose-900 border border-rose-300">
              {allViolations.length} RECORDED VIOLATIONS
            </span>
          </div>
          <p className="text-xs text-black font-medium mt-1">
            Review, assign, and track notices for product packaging rule violations and label errors.
          </p>
        </div>

        <button
          onClick={() => setIsCopilotOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-teal-300 text-teal-900 text-xs font-bold hover:bg-teal-50 transition-colors shadow-xs"
        >
          <Sparkles size={14} className="text-teal-700" />
          <span>Yatarth AI</span>
        </button>
      </div>

      {/* Tabs Row */}
      <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-200">
        {[
          { id: 'open', label: 'Open Notices', count: openCount },
          { id: 'critical', label: 'Critical Violations', count: criticalCount },
          { id: 'high', label: 'High Priority', count: highCount },
          { id: 'medium', label: 'Medium Priority', count: mediumCount },
          { id: 'resolved', label: 'Resolved / Fixed', count: resolvedCount },
          { id: 'all', label: 'All Records', count: allViolations.length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-teal-800 text-white shadow-xs'
                : 'text-black hover:text-slate-900 hover:bg-slate-100 bg-white border border-slate-300'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
              activeTab === tab.id ? 'bg-teal-950 text-teal-100' : 'bg-slate-200 text-black'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="p-3 rounded-xl bg-white border border-slate-300 shadow-xs flex items-center gap-2">
        <Search size={16} className="text-slate-600" />
        <input
          type="text"
          placeholder="Search violations by title, product code, rule code, or product name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-xs text-black font-semibold placeholder-slate-500 focus:outline-none"
        />
      </div>

      {/* Split Grid: Left 5 cols list | Right 7 cols violation detail view */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[750px] overflow-y-auto pr-1">
          {filteredViolations.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center text-xs text-black font-bold shadow-xs">
              No violations match your filter criteria.
            </div>
          ) : (
            filteredViolations.map((v: Violation) => {
              const isSelected = selectedViolation?.id === v.id;
              return (
                <div
                  key={v.id}
                  onClick={() => setSelectedViolation(v)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all text-left space-y-2 ${
                    isSelected
                      ? 'bg-teal-50/80 border-teal-500 shadow-xs ring-1 ring-teal-500'
                      : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {getSeverityBadge(v.severity)}
                      <span className="text-[11px] font-mono text-black font-black">{v.ruleCode}</span>
                    </div>
                    {getStatusBadge(v.reviewStatus)}
                  </div>

                  <div>
                    <h4 className="text-xs font-black text-slate-900 line-clamp-1">{v.title}</h4>
                    <p className="text-[11px] text-teal-900 font-bold font-mono mt-0.5">
                      {v.productName} (Code: {v.sku})
                    </p>
                  </div>

                  <p className="text-[11px] text-slate-800 font-medium line-clamp-2 leading-relaxed">
                    {v.explanation}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-black pt-1 border-t border-slate-200 font-bold">
                    <span>Officer: {v.assignedTo}</span>
                    <span className="font-mono">{v.detectedAt}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Detail Pane */}
        <div className="lg:col-span-7">
          {selectedViolation ? (
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-5 sticky top-24 text-slate-900">
              {/* Detail Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {getSeverityBadge(selectedViolation.severity)}
                    <span className="text-xs font-mono text-teal-900 font-black">
                      {selectedViolation.ruleCode}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-slate-100 text-black border border-slate-300">
                      {selectedViolation.category}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-slate-900 mt-1">
                    {selectedViolation.title}
                  </h3>
                  <p className="text-xs text-black font-medium">
                    Product: <span className="text-black font-black">{selectedViolation.productName}</span> • Product Code: <span className="text-black font-mono font-bold">{selectedViolation.sku}</span>
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSelectedProductId(selectedViolation.productId);
                    setCurrentTab('analysis_results');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-teal-100 hover:bg-teal-200 text-teal-950 border border-teal-300 text-xs font-bold flex items-center gap-1.5 flex-shrink-0 transition-colors shadow-2xs"
                >
                  <ExternalLink size={13} />
                  <span>Inspect Packaging Label</span>
                </button>
              </div>

              {/* Statutory Explanation */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-black text-black uppercase font-mono tracking-wider">
                  Legal Rule & Finding
                </h4>
                <p className="text-xs text-slate-900 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200 font-semibold">
                  {selectedViolation.explanation}
                </p>
              </div>

              {/* Extracted Image Evidence */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-black text-black uppercase font-mono tracking-wider">
                  Extracted Packaging Evidence Snippet
                </h4>
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 font-mono text-xs text-rose-950 font-black">
                  "{selectedViolation.evidence}"
                </div>
              </div>

              {/* Recommended Action */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-black text-teal-950 uppercase font-mono tracking-wider">
                  Required Action / Correction Notice
                </h4>
                <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-950 leading-relaxed font-bold">
                  {selectedViolation.recommendedAction}
                </div>
              </div>

              {/* Assignment & Status Controls */}
              <div className="pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-black block mb-1 font-mono">Assigned Inspection Officer</label>
                  <select
                    value={selectedViolation.assignedTo}
                    onChange={(e) => assignViolation(selectedViolation.id, e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-black focus:outline-none focus:bg-white"
                  >
                    {teamMembers.map((m: TeamMember) => (
                      <option key={m.id} value={m.name}>{m.name} ({m.role})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-black block mb-1 font-mono">Notice / Enforcement Status</label>
                  <div className="flex items-center gap-1.5">
                    {(['open', 'under_review', 'resolved'] as ReviewStatus[]).map((st) => (
                      <button
                        key={st}
                        onClick={() => updateViolationStatus(selectedViolation.id, st)}
                        className={`flex-1 py-2 text-xs font-black rounded-lg capitalize border transition-all ${
                          selectedViolation.reviewStatus === st
                            ? 'bg-teal-800 text-white border-teal-900 shadow-xs'
                            : 'bg-white border-slate-300 text-black hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        {st === 'resolved' ? 'Resolved' : st.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center text-xs text-black font-bold shadow-xs">
              Select a violation from the list to review evidence and required action.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
