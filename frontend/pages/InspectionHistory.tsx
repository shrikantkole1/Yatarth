import React, { useState, useEffect } from 'react';
import { useAuth } from '../../src/contexts/AuthContext';
import { getInspectionsApi } from '../../src/services/api';
import { Link } from 'react-router-dom';
import { ScanLine, CheckCircle2, AlertTriangle, XCircle, Clock, Plus, Search, Filter, RefreshCw, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Inspection {
  _id: string;
  inspector_id: string;
  inspector_name: string;
  product_name: string;
  category: string;
  batch_number?: string;
  status: 'CREATED' | 'UPLOADING' | 'PROCESSING' | 'NEEDS_REVIEW' | 'COMPLETED' | 'FAILED';
  overall_result?: 'PASS' | 'FAIL' | 'NEEDS_REVIEW' | null;
  createdAt: string;
  views?: any;
}

const statusBadgeConfig: Record<string, { label: string; bg: string; text: string; icon: React.ElementType }> = {
  'COMPLETED':    { label: 'Completed',    bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', icon: CheckCircle2 },
  'PROCESSING':   { label: 'AI Processing', bg: 'bg-blue-50 border-blue-200',    text: 'text-blue-700',    icon: Clock },
  'NEEDS_REVIEW': { label: 'Needs Review',  bg: 'bg-amber-50 border-amber-200',   text: 'text-amber-700',   icon: AlertTriangle },
  'CREATED':      { label: 'Created',       bg: 'bg-slate-100 border-slate-200',  text: 'text-slate-700',   icon: Clock },
  'UPLOADING':    { label: 'Uploading',     bg: 'bg-indigo-50 border-indigo-200', text: 'text-indigo-700', icon: Clock },
  'FAILED':       { label: 'Failed',        bg: 'bg-red-50 border-red-200',       text: 'text-red-700',      icon: XCircle },
};

export function InspectionHistory() {
  const { profile } = useAuth();
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchInspections = async () => {
    setLoading(true);
    try {
      const data = await getInspectionsApi({
        inspector_id: profile?.uid,
        status: statusFilter,
        q: search,
      });
      const list = Array.isArray(data) ? data : data.inspections || [];
      setInspections(list);
    } catch (err) {
      console.error('Failed to load inspections:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInspections();
  }, [profile?.uid, statusFilter]);

  const filtered = inspections.filter((i) => {
    if (search) {
      const lower = search.toLowerCase();
      return (
        i.product_name.toLowerCase().includes(lower) ||
        i.category.toLowerCase().includes(lower) ||
        (i.batch_number && i.batch_number.toLowerCase().includes(lower))
      );
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ScanLine className="w-7 h-7 text-blue-600" />
            Inspection Log
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Audit history for Legal Metrology Packaged Commodities Rule Compliance
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchInspections}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 transition-all text-xs font-bold flex items-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4" /> Refresh Log
          </button>

          <Link
            to="/create-inspection"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> New Label Scan
          </Link>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 flex flex-wrap gap-3 shadow-sm">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search commodity name, category, or batch..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Statuses</option>
          <option value="COMPLETED">Completed</option>
          <option value="PROCESSING">Processing</option>
          <option value="NEEDS_REVIEW">Needs Review</option>
        </select>
      </div>

      {/* Inspection List Table / Cards */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-xs font-semibold text-slate-500">Loading Yatarth AI Inspection Logs...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
          <ScanLine className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Inspections Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Scan a packaged commodity label using Yatarth AI to automatically audit Legal Metrology rule compliance.
          </p>
          <Link
            to="/create-inspection"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md"
          >
            <Plus className="w-4 h-4" /> Scan First Product
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((inspection) => {
            const badge = statusBadgeConfig[inspection.status] || statusBadgeConfig['CREATED'];
            const StatusIcon = badge.icon;
            const frontView = inspection.views?.front?.image_url || inspection.views?.back?.image_url;

            return (
              <Link
                key={inspection._id}
                to={`/inspections/${inspection._id}`}
                className="bg-white rounded-2xl border border-slate-200 hover:border-blue-400 p-5 shadow-sm hover:shadow-md transition-all flex gap-4 group"
              >
                {/* Thumbnail */}
                <div className="w-24 h-24 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                  {frontView ? (
                    <img src={frontView} alt={inspection.product_name} className="w-full h-full object-cover" />
                  ) : (
                    <ScanLine className="w-8 h-8 text-slate-400" />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                        {inspection.category}
                      </span>

                      <div className={`px-2.5 py-0.5 rounded-full border text-[11px] font-bold flex items-center gap-1 ${badge.bg} ${badge.text}`}>
                        <StatusIcon className="w-3 h-3" />
                        {badge.label}
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                      {inspection.product_name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Batch: <span className="font-medium text-slate-700">{inspection.batch_number || 'N/A'}</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 pt-2 mt-2">
                    <span>{inspection.inspector_name}</span>
                    <span>{formatDistanceToNow(new Date(inspection.createdAt))} ago</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
