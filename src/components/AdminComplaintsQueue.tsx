import React, { useState, useEffect } from 'react';
import { getComplaintsApi, updateComplaintStatusApi } from '../services/api';
import {
  AlertTriangle, ShieldAlert, CheckCircle2, Clock, FileText,
  Building2, MapPin, ExternalLink, Send, ChevronRight, Eye, Sparkles
} from 'lucide-react';

interface Complaint {
  _id?: string;
  complaint_id: string;
  citizen_name: string;
  citizen_email: string;
  product_name: string;
  category: string;
  store_location: string;
  region: string;
  violations: Array<{ rule_id: string; description: string; severity: string }>;
  status: 'PENDING' | 'INVESTIGATING' | 'NOTICE_ISSUED' | 'RESOLVED' | 'REJECTED';
  evidence_image_url?: string;
  action_taken?: string;
  createdAt: string;
}

const statusBadgeMap: Record<string, { label: string; bg: string; text: string; icon: React.ElementType }> = {
  PENDING:       { label: 'Pending Review',    bg: 'bg-amber-50 border-amber-200',   text: 'text-amber-800',   icon: Clock },
  INVESTIGATING: { label: 'Under Investigation', bg: 'bg-blue-50 border-blue-200',    text: 'text-blue-700',    icon: Eye },
  NOTICE_ISSUED: { label: 'Legal Notice Issued', bg: 'bg-red-50 border-red-200',       text: 'text-red-700',      icon: ShieldAlert },
  RESOLVED:      { label: 'Case Resolved',      bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', icon: CheckCircle2 },
};

export const AdminComplaintsQueue: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const data = await getComplaintsApi();
      setComplaints(data || []);
      if (data && data.length > 0 && !selectedComplaint) {
        setSelectedComplaint(data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string, actionMsg: string) => {
    setUpdatingId(id);
    try {
      await updateComplaintStatusApi(id, newStatus, actionMsg);
      await fetchComplaints();

      if (selectedComplaint && selectedComplaint.complaint_id === id) {
        setSelectedComplaint((prev) => (prev ? { ...prev, status: newStatus as any, action_taken: actionMsg } : null));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const pendingCount = complaints.filter((c) => c.status === 'PENDING').length;
  const noticeCount = complaints.filter((c) => c.status === 'NOTICE_ISSUED').length;

  return (
    <div className="space-y-6">
      {/* Header Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Public Complaints</span>
          <div className="flex items-baseline justify-between mt-2">
            <h2 className="text-3xl font-black text-slate-900">{complaints.length}</h2>
            <AlertTriangle className="w-5 h-5 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">Pending Review</span>
          <div className="flex items-baseline justify-between mt-2">
            <h2 className="text-3xl font-black text-amber-600">{pendingCount}</h2>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider block">Legal Notices Issued</span>
          <div className="flex items-baseline justify-between mt-2">
            <h2 className="text-3xl font-black text-red-600">{noticeCount}</h2>
            <ShieldAlert className="w-5 h-5 text-red-500" />
          </div>
        </div>
      </div>

      {/* Main Queue & Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Complaints List Column */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 px-1">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              Citizen Reports Queue ({complaints.length})
            </h3>
            <button onClick={fetchComplaints} className="text-[11px] font-bold text-blue-600 hover:underline">
              Refresh Queue
            </button>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {complaints.map((c) => {
              const badge = statusBadgeMap[c.status] || statusBadgeMap.PENDING;
              const BadgeIcon = badge.icon;
              const isSelected = selectedComplaint?.complaint_id === c.complaint_id;

              return (
                <div
                  key={c.complaint_id}
                  onClick={() => setSelectedComplaint(c)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-blue-50/90 border-blue-500 shadow-xs ring-1 ring-blue-400/30'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold bg-slate-900 text-white px-2 py-0.5 rounded">
                      {c.complaint_id}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold flex items-center gap-1 ${badge.bg} ${badge.text}`}>
                      <BadgeIcon className="w-3 h-3" />
                      {badge.label}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-900 truncate">{c.product_name}</h4>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {c.store_location} • <span className="font-semibold text-slate-700">{c.region}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Complaint Enforcement Actions Column */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
          {selectedComplaint ? (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    ID: {selectedComplaint.complaint_id}
                  </span>
                  <h2 className="text-xl font-black text-slate-900 mt-1">{selectedComplaint.product_name}</h2>
                  <p className="text-xs text-slate-500">Reported by <span className="font-bold text-slate-700">{selectedComplaint.citizen_name}</span> ({selectedComplaint.citizen_email})</p>
                </div>

                <span className={`px-3 py-1 rounded-full border text-xs font-extrabold flex items-center gap-1.5 ${
                  statusBadgeMap[selectedComplaint.status]?.bg
                } ${statusBadgeMap[selectedComplaint.status]?.text}`}>
                  {selectedComplaint.status}
                </span>
              </div>

              {/* Location & Image Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="sm:col-span-2 space-y-3">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Retail Store Location</span>
                    <p className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                      <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                      {selectedComplaint.store_location} ({selectedComplaint.region})
                    </p>
                  </div>

                  {/* Flagged Violations List */}
                  <div className="bg-red-50/70 p-3.5 rounded-xl border border-red-200 space-y-2">
                    <span className="text-[10px] font-bold text-red-700 uppercase tracking-wider flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5" /> Flagged Rule Violations:
                    </span>
                    <ul className="space-y-1.5 pl-1">
                      {selectedComplaint.violations.map((v, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs font-semibold text-red-950">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0 mt-1.5" />
                          <span><strong className="font-mono text-red-800">[{v.rule_id}]:</strong> {v.description}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Evidence Image Thumbnail */}
                <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex flex-col justify-between p-2 shadow-inner min-h-[160px]">
                  <span className="text-[10px] font-mono text-slate-400 block px-1">Evidence Photo Scan</span>
                  <img
                    src={selectedComplaint.evidence_image_url || '/images/crispy_chips.jpg'}
                    alt="Evidence scan"
                    className="w-full h-28 object-contain my-auto"
                  />
                  <span className="text-[10px] text-emerald-400 font-mono text-center">300 DPI OCR Scan</span>
                </div>
              </div>

              {/* Enforcement Actions Buttons */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  Metrology Admin Enforcement Action
                </span>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleUpdateStatus(
                      selectedComplaint.complaint_id,
                      'NOTICE_ISSUED',
                      `Official Legal Notice issued under Section 36 of Legal Metrology Act 2009. Compounding Penalty ₹25,000 imposed on retailer ${selectedComplaint.store_location}.`
                    )}
                    disabled={updatingId === selectedComplaint.complaint_id}
                    className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <ShieldAlert className="w-4 h-4" /> Issue Legal Notice &amp; Fine (₹25,000)
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(
                      selectedComplaint.complaint_id,
                      'INVESTIGATING',
                      'Assigned to Field Metrology Inspector for physical store inspection & sample seizure.'
                    )}
                    disabled={updatingId === selectedComplaint.complaint_id}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-4 h-4" /> Assign Inspector Audit
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(
                      selectedComplaint.complaint_id,
                      'RESOLVED',
                      'Retailer updated product packaging to compliant LMPC 2011 format. Case closed.'
                    )}
                    disabled={updatingId === selectedComplaint.complaint_id}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Mark Case Resolved
                  </button>
                </div>

                {selectedComplaint.action_taken && (
                  <div className="pt-2 text-xs font-semibold text-slate-700 border-t border-slate-200">
                    <span className="text-slate-500 font-bold block text-[10px] uppercase">Current Enforcement Record:</span>
                    <p className="mt-0.5 text-slate-900">{selectedComplaint.action_taken}</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="py-16 text-center text-slate-400">
              Select a citizen complaint from the left queue to view details and issue notices.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
