import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  Cpu, 
  Key, 
  ShieldAlert, 
  Bell, 
  Copy, 
  Check, 
  Save
} from 'lucide-react';
import { AuditLog } from '../types';

export const SettingsView: React.FC = () => {
  const { auditLogs } = useApp();

  const [activeTab, setActiveTab] = useState<'org' | 'ai' | 'api' | 'security' | 'notifications'>('org');

  // Form states
  const [orgName, setOrgName] = useState('Directorate of Legal Metrology');
  const [jurisdiction, setJurisdiction] = useState('Legal Metrology (Packaged Commodities) Rules & Standards');
  const [ocrThreshold, setOcrThreshold] = useState(85);
  const [strictMetrology, setStrictMetrology] = useState(true);
  const [autoFlagContrast, setAutoFlagContrast] = useState(true);
  const [apiKeyCopied, setApiKeyCopied] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('https://surveillance.legalmetrology.gov.in/api/v1/enforcement-events');

  const handleCopyKey = () => {
    navigator.clipboard.writeText('yatarth_live_9f81a74e098bc19d3f');
    setApiKeyCopied(true);
    setTimeout(() => setApiKeyCopied(false), 2000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Application & Inspection Settings</h1>
            <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-full bg-teal-100 text-teal-900 border border-teal-300">
              CONFIG
            </span>
          </div>
          <p className="text-xs text-black font-medium mt-1">
            Configure department profile, AI inspection parameters, alert webhooks, and audit logs.
          </p>
        </div>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-200">
        {[
          { id: 'org', label: 'Department Profile', icon: Building2 },
          { id: 'ai', label: 'AI Parameters', icon: Cpu },
          { id: 'api', label: 'API & Webhooks', icon: Key },
          { id: 'security', label: 'Security & Audit Logs', icon: ShieldAlert },
          { id: 'notifications', label: 'Violation Alerts', icon: Bell }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-teal-50 text-teal-800 border border-teal-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon size={14} className={activeTab === tab.id ? 'text-teal-700' : 'text-slate-400'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Department Settings */}
      {activeTab === 'org' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-5 max-w-3xl">
          <h3 className="text-sm font-bold text-slate-900">Enforcement Authority Profile</h3>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Department / Enforcement Wing Name</label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Primary Packaging Legal Framework</label>
              <input
                type="text"
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white"
              />
            </div>

            <div className="pt-2">
              <button className="px-4 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm">
                <Save size={14} />
                <span>Save Department Profile</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: AI Engine Config */}
      {activeTab === 'ai' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-5 max-w-3xl">
          <h3 className="text-sm font-bold text-slate-900">Metrology OCR & Neural Model Calibration</h3>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-1">
                <span>OCR Confidence Rejection Cutoff</span>
                <span className="font-mono text-teal-700 font-bold">{ocrThreshold}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="99"
                value={ocrThreshold}
                onChange={(e) => setOcrThreshold(Number(e.target.value))}
                className="w-full accent-teal-600 bg-slate-100"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Readings with lower optical glyph confidence will require human reviewer sign-off.
              </p>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <p className="text-xs font-semibold text-slate-800">Strict Net Quantity Ratio Enforcement</p>
                <p className="text-[11px] text-slate-500">Flag labels if font height ratio is below prescribed millimeters</p>
              </div>
              <input
                type="checkbox"
                checked={strictMetrology}
                onChange={(e) => setStrictMetrology(e.target.checked)}
                className="w-4 h-4 accent-teal-600"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <p className="text-xs font-semibold text-slate-800">Automatic Contrast & Camouflage Detection</p>
                <p className="text-[11px] text-slate-500">Flag declarations with background luminance ratio &lt; 4.5:1</p>
              </div>
              <input
                type="checkbox"
                checked={autoFlagContrast}
                onChange={(e) => setAutoFlagContrast(e.target.checked)}
                className="w-4 h-4 accent-teal-600"
              />
            </div>

            <div className="pt-2">
              <button className="px-4 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm">
                <Save size={14} />
                <span>Apply Metrology Engine Parameters</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: API & Webhooks */}
      {activeTab === 'api' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-5 max-w-3xl">
          <h3 className="text-sm font-bold text-slate-900">Enforcement Gateway API & Webhook Dispatch</h3>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1 font-mono">Department API Secret Key</label>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  readOnly
                  value="yatarth_live_9f81a74e098bc19d3f"
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono text-slate-700"
                />
                <button
                  onClick={handleCopyKey}
                  className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1.5 border border-slate-200 transition-colors"
                >
                  {apiKeyCopied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                  <span>{apiKeyCopied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-black block mb-1 font-mono">Central Alert Webhook</label>
              <input
                type="text"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-black font-bold font-mono focus:outline-none focus:border-teal-600 focus:bg-white"
              />
              <p className="text-[11px] text-black font-medium mt-1">
                Sends an automated alert whenever a packaging scan finds rule violations.
              </p>
            </div>

            <div className="pt-2">
              <button className="px-4 py-2.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm">
                <Save size={14} />
                <span>Update Webhook Endpoint</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Security & Audit Logs */}
      {activeTab === 'security' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900">Official Audit & Action History</h3>
            <span className="text-[10px] font-mono text-teal-900 bg-teal-100 border border-teal-300 px-2 py-0.5 rounded font-bold">
              VERIFIED LOG
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 font-mono text-[11px] text-black font-black uppercase">
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Officer</th>
                  <th className="py-2.5 px-3">Action Taken</th>
                  <th className="py-2.5 px-3">Target Resource</th>
                  <th className="py-2.5 px-3">Terminal IP</th>
                  <th className="py-2.5 px-3 text-right">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {auditLogs.map((log: AuditLog) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 text-black font-semibold">{log.timestamp}</td>
                    <td className="py-2.5 px-3 text-slate-900 font-sans font-bold">{log.actor}</td>
                    <td className="py-2.5 px-3 text-teal-800 font-black">{log.action}</td>
                    <td className="py-2.5 px-3 text-black font-semibold">{log.target}</td>
                    <td className="py-2.5 px-3 text-slate-600 font-bold">{log.ipAddress}</td>
                    <td className="py-2.5 px-3 text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        log.severity === 'warn' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                        log.severity === 'security' ? 'bg-rose-100 text-rose-900 border border-rose-300' : 'bg-slate-100 text-black border border-slate-300'
                      }`}>
                        {log.severity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Notifications */}
      {activeTab === 'notifications' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 max-w-3xl">
          <h3 className="text-sm font-black text-slate-900">Violation Notice & Alert Preferences</h3>

          <div className="space-y-3">
            {[
              { title: 'Critical Rule Violation Alerts', desc: 'Instant alert when serious packaging errors or missing mandatory details are detected.' },
              { title: 'Weekly Inspection Summary Report', desc: 'Summary of store inspection results and rule violation notices.' },
              { title: 'Store Inspection Status Updates', desc: 'Alerts when scheduled store visits and checks finish or need sign-off.' }
            ].map((n, idx) => (
              <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <p className="text-xs font-bold text-black">{n.title}</p>
                  <p className="text-[11px] text-slate-700 font-medium">{n.desc}</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-teal-600" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
