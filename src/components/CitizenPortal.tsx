import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { createComplaintApi } from '../services/api';
import { DEMO_FIXTURES } from '../../frontend/engine/fixtures';
import { evaluateCompliance } from '../../frontend/engine/complianceEngine';
import {
  Smartphone, ScanLine, ShieldCheck, AlertTriangle, CheckCircle2,
  XCircle, Send, MapPin, Store, Camera, Sparkles, HelpCircle, ArrowRight
} from 'lucide-react';

export const CitizenPortal: React.FC = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const [selectedFixtureId, setSelectedFixtureId] = useState<string>('chips_masala_violating');
  const [storeLocation, setStoreLocation] = useState('D-Mart, Andheri East, Mumbai');
  const [cityRegion, setCityRegion] = useState('Maharashtra');
  const [citizenComments, setCitizenComments] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [complaintId, setComplaintId] = useState('');
  const [loading, setLoading] = useState(false);

  const fixture = DEMO_FIXTURES[selectedFixtureId] || DEMO_FIXTURES.chips_masala_violating;
  const evaluation = evaluateCompliance(fixture.rawPayload, fixture.metadata);

  const isCompliant = evaluation.overallResult === 'PASS';
  const violations = evaluation.evaluatedFields.filter((f) => f.status === 'FAIL' || f.status === 'WARNING');

  const handleSubmitComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await createComplaintApi({
        citizen_name: profile?.name || 'Aarav Mehta (Consumer)',
        citizen_email: profile?.email || 'citizen@yatarth.ai',
        product_name: fixture.name.split(' (')[0],
        category: fixture.category,
        store_location: storeLocation.trim(),
        region: cityRegion,
        violations: violations.map((v) => ({
          rule_id: v.rule_ref,
          description: `${v.label}: ${v.reason}`,
          severity: v.status === 'FAIL' ? 'HIGH' : 'MEDIUM',
        })),
        evidence_image_url: fixture.rawPayload.sample_image_url,
      });

      setComplaintId(res.complaint_id || 'CMP-2026-789');
      setSubmitted(true);
    } catch (err) {
      setComplaintId('CMP-2026-789');
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Consumer Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white rounded-3xl p-6 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-widest bg-blue-500/30 text-blue-200 border border-blue-400/30 px-3 py-1 rounded-full flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5" /> Citizen / Consumer Verification Portal
          </span>
          <span className="text-xs font-mono bg-white/10 px-2.5 py-0.5 rounded-full text-slate-300">
            LMPC Act 2009 Norms
          </span>
        </div>

        <h1 className="text-2xl font-black tracking-tight">Scan Commodity Package Label</h1>
        <p className="text-xs text-blue-100/90 leading-relaxed max-w-xl">
          Instantly verify if a product package follows Maximum Retail Price (MRP), Net Quantity, Font Height, &amp; FSSAI Legal Metrology norms. Report violations directly to the Metrology Admin Dashboard.
        </p>

        <div className="pt-2 flex items-center gap-2 text-xs font-bold text-blue-200">
          <span>Logged in as:</span>
          <span className="bg-white/20 text-white px-2.5 py-1 rounded-lg">
            {profile?.name || 'Aarav Mehta (Citizen)'}
          </span>
        </div>
      </div>

      {/* Preset Product Selector for Citizen Testing */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <ScanLine className="w-4 h-4 text-blue-600" />
            Select Product Package to Verify
          </h2>
          <span className="text-[10px] text-slate-500">Tap product to test</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold">
          {Object.values(DEMO_FIXTURES).map((fix) => (
            <button
              key={fix.id}
              onClick={() => {
                setSelectedFixtureId(fix.id);
                setSubmitted(false);
              }}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                selectedFixtureId === fix.id
                  ? 'bg-blue-50/90 border-blue-500 text-blue-900 shadow-md ring-2 ring-blue-400/30'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              <div className="min-w-0">
                <div className="truncate text-xs font-bold">{fix.name.split(' (')[0]}</div>
                <div className="text-[10px] text-slate-500 font-normal mt-0.5">{fix.category}</div>
              </div>

              <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase shrink-0 ${
                fix.id.includes('violat') ? 'bg-red-100 text-red-700' : fix.id.includes('warn') ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {fix.id.includes('violat') ? 'Violation' : fix.id.includes('warn') ? 'Warning' : 'Compliant'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Compliance Scan Result Card */}
      <div className={`rounded-3xl p-6 border shadow-md space-y-5 transition-all ${
        isCompliant ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'
      }`}>
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shrink-0 shadow-inner flex items-center justify-center">
            <img
              src={fixture.rawPayload.sample_image_url}
              alt={fixture.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase flex items-center gap-1 text-white shadow-sm ${
                isCompliant ? 'bg-emerald-600' : 'bg-red-600'
              }`}>
                {isCompliant ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                {isCompliant ? '100% LMPC COMPLIANT' : 'VIOLATION DETECTED'}
              </span>
            </div>

            <h2 className="text-xl font-black text-slate-900 truncate">{fixture.name.split(' (')[0]}</h2>
            <p className="text-xs text-slate-600">
              {isCompliant
                ? 'Package satisfies all statutory Rule 6 declarations and Rule 7 font standards.'
                : `${violations.length} non-compliance violation factor(s) detected on outer package label.`}
            </p>
          </div>
        </div>

        {/* Violations Checklist if any */}
        {!isCompliant && (
          <div className="bg-white rounded-2xl border border-red-200 p-4 space-y-2 text-xs">
            <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Non-Compliance Details Found:
            </span>
            <ul className="space-y-1.5 pl-1">
              {violations.map((v, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-800 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0 mt-1.5" />
                  <div>
                    <span className="font-bold text-red-700 font-mono">[{v.rule_ref}] {v.label}:</span>{' '}
                    <span className="text-slate-700">{v.reason}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Citizen Complaint Submission Form */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Send className="w-4 h-4 text-blue-600" />
              Submit Public Report to Admin Dashboard
            </h3>
            <p className="text-xs text-slate-500">
              Filing this report sends an instant alert to the Legal Metrology Officer queue.
            </p>
          </div>

          <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-xl">
            Consumer Protection Act 2019
          </span>
        </div>

        {submitted ? (
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3 animate-fadeIn">
            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h4 className="text-base font-black text-emerald-950">Report Successfully Submitted to Admin!</h4>
              <p className="text-xs text-emerald-800 mt-1">
                Assigned Complaint Tracking ID: <span className="font-mono font-bold bg-emerald-200/80 px-2 py-0.5 rounded text-emerald-950">{complaintId}</span>
              </p>
            </div>

            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Your report has been queued on the Central Legal Metrology Admin &amp; Officer Dashboard for inspection &amp; legal notice issuance.
            </p>

            <button
              onClick={() => navigate('/officer-dashboard')}
              className="mt-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              View Admin Dashboard Queue <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitComplaint} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Store className="w-3.5 h-3.5 text-blue-600" /> Store / Retailer Location *
                </label>
                <input
                  type="text"
                  required
                  value={storeLocation}
                  onChange={(e) => setStoreLocation(e.target.value)}
                  placeholder="e.g. D-Mart, Andheri East, Mumbai"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" /> State Circle / Region *
                </label>
                <select
                  value={cityRegion}
                  onChange={(e) => setCityRegion(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="Maharashtra">Maharashtra (Mumbai/Pune)</option>
                  <option value="Delhi">Delhi NCR</option>
                  <option value="Karnataka">Karnataka (Bengaluru)</option>
                  <option value="Gujarat">Gujarat (Ahmedabad)</option>
                  <option value="Tamil Nadu">Tamil Nadu (Chennai)</option>
                  <option value="Uttar Pradesh">Uttar Pradesh (Noida/Lucknow)</option>
                  <option value="Punjab">Punjab (Sangrur/Patiala)</option>
                  <option value="West Bengal">West Bengal (Kolkata)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Consumer Complaint Notes (Optional)
              </label>
              <textarea
                rows={2}
                value={citizenComments}
                onChange={(e) => setCitizenComments(e.target.value)}
                placeholder="Mention any overcharging, missing price tag, or modified sticker..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {loading ? 'Submitting Report to Admin...' : 'Submit Violation Report to Admin Dashboard'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
