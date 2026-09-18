import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Plus, 
  Calendar, 
  Building2, 
  User, 
  FileText, 
  ArrowRight,
  X
} from 'lucide-react';
import { Inspection } from '../types';

export const InspectionsView: React.FC = () => {
  const { 
    inspections, 
    updateInspectionStatus, 
    addNewInspection, 
    setCurrentTab,
    addNewReport 
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [leadAuditor, setLeadAuditor] = useState('Dr. Rajesh Sharma');
  const [facility, setFacility] = useState('Bengaluru Zonal Market & Warehouse Area 4');
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().slice(0, 10));

  const stages: { key: Inspection['status']; label: string; badge: string }[] = [
    { key: 'scheduled', label: 'Scheduled', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
    { key: 'in_progress', label: 'Field Verification In Progress', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
    { key: 'review', label: 'Under Legal Review', badge: 'bg-purple-50 text-purple-700 border-purple-200' },
    { key: 'completed', label: 'Inspection Concluded', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  ];

  const handleCreateInspection = (e: React.FormEvent) => {
    e.preventDefault();
    const newInspection: Inspection = {
      id: `ins-${Date.now()}`,
      code: `INS-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: title || 'Periodic Store Inspection',
      facility: facility || 'Retail Hub & Supermarket Zone',
      leadAuditor: leadAuditor,
      scheduledDate: scheduledDate,
      status: 'scheduled',
      productsCount: 6,
      passedCount: 4,
      failedCount: 2,
      avgScore: 82,
      notes: 'Scheduled store inspection for packaging rules compliance.',
      productIds: ['prod-001', 'prod-002']
    };
    addNewInspection(newInspection);
    setIsModalOpen(false);
    setTitle('');
    setFacility('');
  };

  const handleGenerateReport = (insp: Inspection) => {
    addNewReport({
      title: `${insp.title} - Official Inspection Report`,
      type: 'Audit Inspection',
      author: insp.leadAuditor,
      scope: `${insp.facility} (${insp.productsCount} Products)`,
      complianceRate: insp.avgScore,
      criticalIssuesCount: insp.failedCount,
      status: 'ready',
      fileSize: '3.2 MB'
    });
    setCurrentTab('reports');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Store & Field Inspections</h1>
            <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-full bg-teal-100 text-teal-900 border border-teal-300">
              INSPECTION PIPELINE
            </span>
          </div>
          <p className="text-xs text-black font-medium mt-1">
            Coordinate store visits, product label checks, and inspection reports across zones.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-sm hover:shadow transition-all active:scale-95"
        >
          <Plus size={15} />
          <span>Schedule Inspection</span>
        </button>
      </div>

      {/* Kanban Stages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stages.map((stage) => {
          const items = inspections.filter((i: Inspection) => i.status === stage.key);
          return (
            <div key={stage.key} className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-md text-xs font-bold border ${stage.badge}`}>
                    {stage.label}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-xs font-mono font-black bg-slate-100 text-black border border-slate-300">
                  {items.length}
                </span>
              </div>

              <div className="space-y-3 min-h-[450px]">
                {items.length === 0 ? (
                  <div className="h-36 rounded-xl border border-dashed border-slate-300 bg-white/60 flex items-center justify-center text-xs text-black font-bold">
                    No active audits in {stage.label.toLowerCase()}
                  </div>
                ) : (
                  items.map((insp: Inspection) => (
                    <div
                      key={insp.id}
                      className="p-4 rounded-xl bg-white border border-slate-200 hover:border-teal-400 hover:shadow-md transition-all space-y-3 cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono font-bold text-teal-900 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                          {insp.code}
                        </span>
                        <span className="text-[11px] text-black font-mono font-bold flex items-center gap-1">
                          <Calendar size={12} /> {insp.scheduledDate}
                        </span>
                      </div>

                      <h4 className="text-xs font-black text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-1">
                        {insp.title}
                      </h4>

                      <div className="flex items-center gap-1.5 text-xs text-black font-medium">
                        <Building2 size={13} className="text-slate-600 flex-shrink-0" />
                        <span className="truncate">{insp.facility}</span>
                      </div>

                      {/* Scores & Counts */}
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 grid grid-cols-3 gap-1 text-center font-mono text-[11px]">
                        <div>
                          <p className="text-black font-bold text-[10px]">Products</p>
                          <p className="text-slate-900 font-black">{insp.productsCount}</p>
                        </div>
                        <div>
                          <p className="text-emerald-800 font-bold text-[10px]">Passed</p>
                          <p className="text-emerald-800 font-black">{insp.passedCount}</p>
                        </div>
                        <div>
                          <p className="text-rose-800 font-bold text-[10px]">Violations</p>
                          <p className="text-rose-800 font-black">{insp.failedCount}</p>
                        </div>
                      </div>

                      {/* Stage Progression Action */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-1 text-[11px] text-black font-bold">
                          <User size={12} className="text-slate-600" />
                          <span>{insp.leadAuditor.split(' ')[0]}</span>
                        </div>

                        {stage.key !== 'completed' ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const nextMap: Record<Inspection['status'], Inspection['status']> = {
                                scheduled: 'in_progress',
                                in_progress: 'review',
                                review: 'completed',
                                completed: 'completed'
                              };
                              updateInspectionStatus(insp.id, nextMap[stage.key]);
                            }}
                            className="text-xs font-mono font-bold text-teal-800 hover:text-teal-900 flex items-center gap-1 hover:underline"
                          >
                            <span>Advance Stage</span>
                            <ArrowRight size={12} />
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleGenerateReport(insp);
                            }}
                            className="text-xs font-mono font-black text-emerald-800 hover:text-emerald-900 hover:underline flex items-center gap-1"
                          >
                            <FileText size={12} />
                            <span>Generate Report</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Schedule Audit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl p-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            >
              <X size={17} />
            </button>

            <h3 className="text-base font-black text-slate-900 mb-1">Schedule Store Inspection</h3>
            <p className="text-xs text-black font-medium mb-4">Authorize inspection team and schedule product compliance check.</p>

            <form onSubmit={handleCreateInspection} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-black block mb-1">Inspection Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q4 Packaged Food Store Check"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-black font-bold focus:outline-none focus:border-teal-600 focus:bg-white focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-black block mb-1">Inspecting Officer</label>
                  <select
                    value={leadAuditor}
                    onChange={(e) => setLeadAuditor(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-black font-bold focus:outline-none focus:border-teal-600 focus:bg-white"
                  >
                    <option value="Dr. Rajesh Sharma">Dr. Rajesh Sharma (Controller of Legal Metrology)</option>
                    <option value="Sunita Verma">Sunita Verma (Senior Inspection Officer)</option>
                    <option value="Kavita Nair">Kavita Nair (Legal Metrology Officer)</option>
                    <option value="Anil Deshmukh">Anil Deshmukh (Field Enforcement Inspector)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-black block mb-1">Scheduled Date</label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-black font-bold focus:outline-none focus:border-teal-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-black block mb-1">Store / Market Location</label>
                <input
                  type="text"
                  required
                  value={facility}
                  onChange={(e) => setFacility(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-black font-bold focus:outline-none focus:border-teal-600 focus:bg-white focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-sm active:scale-98 transition-all"
                >
                  Confirm & Schedule Inspection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
