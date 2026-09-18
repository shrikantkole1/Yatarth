import React, { useState, useEffect } from 'react';
import { getInspectionsApi, getComplaintsApi } from '../../src/services/api';
import { useAuth } from '../../src/contexts/AuthContext';
import { Link } from 'react-router-dom';
import {
  ShieldAlert, CheckCircle2, AlertTriangle, XCircle, ScanLine,
  TrendingUp, BarChart3, Plus, Search, Filter, BookOpen, UserCheck, Smartphone,
  FileText, Clock, ArrowRight, ShieldCheck, MapPin
} from 'lucide-react';

import { Sidebar } from '../../src/components/Sidebar';
import { RegionalMap } from '../../src/components/RegionalMap';
import { AdminComplaintsQueue } from '../../src/components/AdminComplaintsQueue';
import { CitizenPortal } from '../../src/components/CitizenPortal';
import { MobileFrameWrapper } from '../../src/components/MobileFrameWrapper';
import { DashboardAnalytics } from '../../src/components/DashboardAnalytics';
import { FileComplaintWizard } from '../../src/components/FileComplaintWizard';
import { ComplaintTracker } from '../../src/components/ComplaintTracker';
import { LEGAL_RULES_DATABASE } from '../components/RuleDetailModal';

interface Inspection {
  _id: string;
  inspector_name: string;
  product_name: string;
  category: string;
  batch_number?: string;
  status: string;
  overall_result?: string;
  createdAt: string;
}

interface OfficerDashboardProps {
  currentLang?: 'en' | 'hi' | 'mr';
}

export function OfficerDashboard({ currentLang = 'en' }: OfficerDashboardProps) {
  const { profile } = useAuth();
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [complaintsCount, setComplaintsCount] = useState<number>(3);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);

  useEffect(() => {
    if (profile?.role === 'citizen') {
      setActiveTab('citizen-scan');
    }
  }, [profile?.role]);

  useEffect(() => {
    getInspectionsApi()
      .then((data) => {
        const list = Array.isArray(data) ? data : data.inspections || [];
        setInspections(list);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

    getComplaintsApi()
      .then((data) => {
        if (Array.isArray(data)) {
          setComplaintsCount(data.filter((c) => c.status === 'PENDING').length);
        }
      })
      .catch(() => null);
  }, []);

  const total = inspections.length;
  const passed = inspections.filter((i) => i.overall_result === 'PASS').length;
  const failed = inspections.filter((i) => i.overall_result === 'FAIL').length;
  const complianceRate = total > 0 ? Math.round((passed / total) * 100) : 100;

  const t = {
    en: {
      dashboardTitle: 'Metrology Admin & Officer Dashboard',
      dashboardSub: 'Legal Metrology (LMR 2011) Central Surveillance, Citizen Reports & Violations',
      heroFileTitle: 'File LMPC Complaint',
      heroFileDesc: 'Register non-compliant product label, missing MRP, USP or declarations.',
      heroTrackTitle: 'Track Complaint Status',
      heroTrackDesc: 'Check 4-stage resolution status with reference ID (e.g. CMP-2026-089).',
      heroScanTitle: 'LMPC AI Scanner',
      heroScanDesc: 'Instant AI extraction and compliance verification of product labels.',
      heroMapTitle: 'Region Heatmap',
      heroMapDesc: 'State-wise metrology compliance rates & active violation circles.',
      complianceRate: 'Compliance Rate',
      totalAudits: 'Total Audits',
      compliantPass: 'Compliant (PASS)',
      violationsFail: 'Violations (FAIL)',
    },
    hi: {
      dashboardTitle: 'विधिक माप विज्ञान प्रशासन एवं अधिकारी डैशबोर्ड',
      dashboardSub: 'विधिक माप विज्ञान (एलएमआर 2011) केंद्रीय निगरानी, नागरिक शिकायतें एवं उल्लंघन',
      heroFileTitle: 'LMPC शिकायत दर्ज करें',
      heroFileDesc: 'गैर-अनुपालन उत्पाद लेबल, लापता एमआरपी, यूएसपी या घोषणाएं पंजीकृत करें।',
      heroTrackTitle: 'शिकायत की स्थिति ट्रैक करें',
      heroTrackDesc: 'संदर्भ आईडी (जैसे CMP-2026-089) के साथ 4-स्तरीय समाधान स्थिति जांचें।',
      heroScanTitle: 'एलएमपीसी एआई स्कैनर',
      heroScanDesc: 'उत्पाद लेबलों का तत्काल एआई निष्कर्षण और अनुपालन सत्यापन।',
      heroMapTitle: 'क्षेत्रीय हीटमैप',
      heroMapDesc: 'राज्यवार विधिक माप विज्ञान अनुपालन दरें और सक्रिय उल्लंघन वृत्त।',
      complianceRate: 'अनुपालन दर',
      totalAudits: 'कुल लेखापरीक्षाएं',
      compliantPass: 'अनुपालन (पास)',
      violationsFail: 'उल्लंघन (फेल)',
    },
    mr: {
      dashboardTitle: 'वैध मापन शास्त्र प्रशासन व अधिकारी डॅशबोर्ड',
      dashboardSub: 'वैध मापन शास्त्र (LMR 2011) केंद्रीय देखरेख, नागरिक तक्रारी व उल्लंघन',
      heroFileTitle: 'LMPC तक्रार नोंदवा',
      heroFileDesc: 'अपात्र उत्पादन लेबल, गहाळ MRP, USP किंवा घोषणा नोंदवा.',
      heroTrackTitle: 'तक्रारीची स्थिती ट्रॅक करा',
      heroTrackDesc: 'संदर्भ आयडी (उदा. CMP-2026-089) सह 4-टप्प्यांची निवारण स्थिती तपासा.',
      heroScanTitle: 'LMPC AI स्कॅनर',
      heroScanDesc: 'उत्पादन लेबल्सचे त्वरित AI काढणे आणि पालन पडताळणी.',
      heroMapTitle: 'प्रादेशिक हीटमॅप',
      heroMapDesc: 'राज्यनिहाय मापन शास्त्र पालन दर आणि सक्रिय उल्लंघन वर्तुळे.',
      complianceRate: 'अनुपालन दर',
      totalAudits: 'एकूण ऑडिट',
      compliantPass: 'अनुपालन (पास)',
      violationsFail: 'उल्लंघन (फेल)',
    }
  }[currentLang];

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)] bg-slate-100">
      {/* Collapsible Sidebar Feature */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        pendingComplaintsCount={complaintsCount}
        isMobileFrame={isMobileFrame}
        onToggleMobileFrame={() => setIsMobileFrame(!isMobileFrame)}
      />

      {/* Main Content Area wrapped in optional Smartphone Frame */}
      <div className="flex-1 p-4 lg:p-8 overflow-x-hidden">
        <MobileFrameWrapper isMobileFrame={isMobileFrame} onToggleFrame={() => setIsMobileFrame(!isMobileFrame)}>
          {/* CITIZEN PORTAL SCANNER VIEW */}
          {profile?.role === 'citizen' || activeTab === 'citizen-scan' ? (
            <CitizenPortal />
          ) : (
            <>
              {/* TAB 1: OVERVIEW ANALYTICS */}
              {activeTab === 'overview' && (
                <div className="space-y-8 max-w-6xl mx-auto">
                  {/* Top Welcome Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="w-8 h-8 text-blue-800" />
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                          {t.dashboardTitle}
                        </h1>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 font-medium">
                        {t.dashboardSub}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setActiveTab('regional-map')}
                        className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
                      >
                        🗺️ View Region Heatmap
                      </button>

                      <Link
                        to="/create-inspection"
                        className="px-4 py-2.5 bg-[#0B3D91] hover:bg-[#14509E] text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-900/20 transition-all flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4 text-[#FF6A00]" /> New Label Scan
                      </Link>
                    </div>
                  </div>

                  {/* QUICK ACTION HERO BLOCK (Section 4 Spec) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Card 1: File LMPC Complaint */}
                    <div
                      onClick={() => setActiveTab('file-complaint')}
                      className="bg-gradient-to-br from-[#0B3D91] to-[#14509E] text-white rounded-2xl p-5 shadow-lg shadow-blue-900/15 cursor-pointer hover:scale-[1.02] transition-transform border border-blue-800 flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="p-2.5 bg-white/10 rounded-xl group-hover:bg-[#FF6A00] transition-colors">
                            <FileText className="w-6 h-6 text-white" />
                          </div>
                          <span className="text-[10px] font-extrabold uppercase bg-[#FF6A00] text-white px-2 py-0.5 rounded-full">
                            Govt Portal
                          </span>
                        </div>
                        <h3 className="text-base font-extrabold">{t.heroFileTitle}</h3>
                        <p className="text-xs text-blue-100 mt-1 leading-relaxed">{t.heroFileDesc}</p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-white/10 flex items-center text-xs font-bold text-blue-200 group-hover:text-white">
                        <span>Launch Wizard</span>
                        <ArrowRight className="w-4 h-4 ml-auto transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    {/* Card 2: Track Complaint Status */}
                    <div
                      onClick={() => setActiveTab('track-complaint')}
                      className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 cursor-pointer hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="p-2.5 bg-blue-50 text-[#0B3D91] rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <Clock className="w-6 h-6" />
                          </div>
                          <span className="text-[10px] font-extrabold uppercase bg-blue-100 text-[#0B3D91] px-2 py-0.5 rounded-full">
                            24x7 Live
                          </span>
                        </div>
                        <h3 className="text-base font-extrabold text-slate-900">{t.heroTrackTitle}</h3>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{t.heroTrackDesc}</p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-bold text-[#0B3D91]">
                        <span>Check Stage & Timeline</span>
                        <ArrowRight className="w-4 h-4 ml-auto transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    {/* Card 3: LMPC AI Scanner */}
                    <Link
                      to="/create-inspection"
                      className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                            <ScanLine className="w-6 h-6" />
                          </div>
                          <span className="text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                            Vision AI 2.0
                          </span>
                        </div>
                        <h3 className="text-base font-extrabold text-slate-900">{t.heroScanTitle}</h3>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{t.heroScanDesc}</p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-bold text-emerald-700">
                        <span>Scan Packaging</span>
                        <ArrowRight className="w-4 h-4 ml-auto transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>

                    {/* Card 4: Region Heatmap */}
                    <div
                      onClick={() => setActiveTab('regional-map')}
                      className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            <MapPin className="w-6 h-6" />
                          </div>
                          <span className="text-[10px] font-extrabold uppercase bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                            GIS Circles
                          </span>
                        </div>
                        <h3 className="text-base font-extrabold text-slate-900">{t.heroMapTitle}</h3>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{t.heroMapDesc}</p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-bold text-indigo-700">
                        <span>Explore GIS Map</span>
                        <ArrowRight className="w-4 h-4 ml-auto transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>

                  {/* Analytics Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.complianceRate}</p>
                      <div className="flex items-baseline justify-between mt-2">
                        <h2 className="text-3xl font-black text-slate-900">{complianceRate}%</h2>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" /> Target &gt;90%
                        </span>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.totalAudits}</p>
                      <div className="flex items-baseline justify-between mt-2">
                        <h2 className="text-3xl font-black text-slate-900">{total}</h2>
                        <span className="text-xs font-semibold text-slate-500">Scanned Products</span>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                      <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">{t.compliantPass}</p>
                      <div className="flex items-baseline justify-between mt-2">
                        <h2 className="text-3xl font-black text-emerald-700">{passed}</h2>
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                      <p className="text-xs font-bold text-red-700 uppercase tracking-wider">{t.violationsFail}</p>
                      <div className="flex items-baseline justify-between mt-2">
                        <h2 className="text-3xl font-black text-red-700">{failed}</h2>
                        <XCircle className="w-5 h-5 text-red-600" />
                      </div>
                    </div>
                  </div>

                  {/* Advanced Visual Charts Analytics */}
                  <DashboardAnalytics />

                  {/* Embedded Regional Map Preview */}
                  <RegionalMap />

                  {/* Embedded Citizen Complaints Queue */}
                  <AdminComplaintsQueue />
                </div>
              )}

              {/* TAB 2: FILE LMPC COMPLAINT WIZARD */}
              {activeTab === 'file-complaint' && (
                <div className="max-w-4xl mx-auto space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-black text-[#0B3D91] flex items-center gap-2">
                        <FileText className="w-7 h-7 text-[#FF6A00]" />
                        Official Consumer &amp; Inspector Grievance Filing
                      </h1>
                      <p className="text-xs text-slate-500 mt-1 font-medium">
                        LMPC Rules 2011 Mandatory Declarations Violation Report Form
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('overview')}
                      className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-all"
                    >
                      ← Back to Dashboard
                    </button>
                  </div>
                  <FileComplaintWizard />
                </div>
              )}

              {/* TAB 3: TRACK COMPLAINT STATUS */}
              {activeTab === 'track-complaint' && (
                <div className="max-w-4xl mx-auto space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-black text-[#0B3D91] flex items-center gap-2">
                        <Clock className="w-7 h-7 text-[#0B3D91]" />
                        Grievance Resolution &amp; Timeline Status Tracker
                      </h1>
                      <p className="text-xs text-slate-500 mt-1 font-medium">
                        Search by Complaint Reference ID (e.g. CMP-2026-089)
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('overview')}
                      className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-all"
                    >
                      ← Back to Dashboard
                    </button>
                  </div>
                  <ComplaintTracker />
                </div>
              )}

              {/* TAB 4: REGIONAL MAP HEATMAP */}
              {activeTab === 'regional-map' && (
                <div className="max-w-6xl mx-auto space-y-6">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-black text-slate-900">National Region Compliance Map</h1>
                    <span className="text-xs font-mono bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-bold">
                      8 Major State Circles
                    </span>
                  </div>
                  <RegionalMap />
                </div>
              )}

              {/* TAB 5: CITIZEN COMPLAINTS QUEUE */}
              {activeTab === 'citizen-reports' && (
                <div className="max-w-6xl mx-auto space-y-6">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                      <AlertTriangle className="w-7 h-7 text-red-600" />
                      Citizen Public Complaints &amp; Enforcement Queue
                    </h1>
                    <span className="text-xs font-mono bg-red-100 text-red-800 px-3 py-1 rounded-full font-bold">
                      Central Admin Queue
                    </span>
                  </div>
                  <AdminComplaintsQueue />
                </div>
              )}

              {/* TAB 6: ALL INSPECTION AUDITS */}
              {activeTab === 'inspections-log' && (
                <div className="max-w-6xl mx-auto space-y-6">
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-blue-600" />
                        Recent Legal Metrology Label Inspections
                      </h3>
                      <span className="text-xs font-semibold text-slate-400">{inspections.length} Records</span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 uppercase font-bold tracking-wider">
                            <th className="p-3 rounded-l-xl">Commodity Name</th>
                            <th className="p-3">Category</th>
                            <th className="p-3">Batch No</th>
                            <th className="p-3">Inspector</th>
                            <th className="p-3">Status</th>
                            <th className="p-3 text-right rounded-r-xl">Result</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {inspections.map((i) => (
                            <tr key={i._id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="p-3 font-bold text-slate-900">
                                <Link to={`/inspections/${i._id}`} className="hover:text-blue-600">
                                  {i.product_name}
                                </Link>
                              </td>
                              <td className="p-3 text-slate-600 font-medium">{i.category}</td>
                              <td className="p-3 text-slate-500 font-mono">{i.batch_number || 'N/A'}</td>
                              <td className="p-3 text-slate-600 font-medium">{i.inspector_name}</td>
                              <td className="p-3 font-semibold text-slate-700">{i.status}</td>
                              <td className="p-3 text-right font-black">
                                <span
                                  className={`inline-block px-2.5 py-1 rounded-md text-[10px] uppercase ${
                                    i.overall_result === 'PASS'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : i.overall_result === 'FAIL'
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-slate-100 text-slate-700'
                                  }`}
                                >
                                  {i.overall_result || 'PENDING'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: LMPC 2011 RULE REGISTRY */}
              {activeTab === 'rule-registry' && (
                <div className="max-w-6xl mx-auto space-y-6">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                      <BookOpen className="w-7 h-7 text-blue-600" />
                      LMPC Rules 2011 Statutory Rule Registry
                    </h1>
                    <span className="text-xs font-mono bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-bold">
                      G.S.R. 202(E) Gazette
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(LEGAL_RULES_DATABASE).map(([key, rule]) => (
                      <div key={key} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold bg-slate-900 text-white px-2.5 py-0.5 rounded">
                            {key}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">{rule.gazetteRef}</span>
                        </div>

                        <h3 className="text-sm font-extrabold text-slate-900">{rule.title}</h3>
                        <p className="text-xs text-slate-600 leading-relaxed">{rule.summary}</p>

                        <div className="pt-2 border-t border-slate-100 text-[11px] text-red-700 font-medium">
                          <strong>Penalty:</strong> {rule.penaltyProvision}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </MobileFrameWrapper>
      </div>
    </div>
  );
}

