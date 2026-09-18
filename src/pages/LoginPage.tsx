import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, DEFAULT_PROFILES } from '../contexts/AuthContext';
import {
  ShieldCheck, Lock, Mail, UserCheck, ArrowRight, Sparkles,
  Smartphone, Building2, ShieldAlert, KeyRound, CheckCircle2
} from 'lucide-react';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [activeRole, setActiveRole] = useState<'officer' | 'inspector' | 'admin' | 'citizen'>('officer');
  const [email, setEmail] = useState('officer@yatarth.ai');
  const [password, setPassword] = useState('officer123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const roleConfig: Record<string, { title: string; subtitle: string; icon: React.ElementType; defaultEmail: string; color: string; desc: string }> = {
    officer: {
      title: 'Metrology Officer / Auditor',
      subtitle: 'Central Legal Metrology Surveillance & Notice Issuance',
      icon: ShieldAlert,
      defaultEmail: 'officer@yatarth.ai',
      color: 'from-blue-600 to-indigo-600',
      desc: 'Access region compliance heatmap, review citizen reports & issue legal notices.',
    },
    inspector: {
      title: 'Field Metrology Inspector',
      subtitle: '360° Multi-Angle Scan & Label Evidence Collection',
      icon: ShieldCheck,
      defaultEmail: 'inspector@yatarth.ai',
      color: 'from-indigo-600 to-purple-600',
      desc: 'Perform 360° product label OCR scans and measure font heights in field audits.',
    },
    admin: {
      title: 'Super Admin System',
      subtitle: 'System Administration, Rule Engines & Threshold Config',
      icon: KeyRound,
      defaultEmail: 'admin@yatarth.ai',
      color: 'from-slate-800 to-slate-950',
      desc: 'Configure LMPC rule thresholds, manage user accounts & system audit logs.',
    },
    citizen: {
      title: 'Consumer / Citizen Portal',
      subtitle: 'Public Product Verification & Violation Reporting',
      icon: Smartphone,
      defaultEmail: 'citizen@yatarth.ai',
      color: 'from-emerald-600 to-teal-600',
      desc: 'Instantly verify product MRP/Net Qty norms & submit complaints to admin dashboard.',
    },
  };

  const handleRoleSelect = (role: 'officer' | 'inspector' | 'admin' | 'citizen') => {
    setActiveRole(role);
    setEmail(roleConfig[role].defaultEmail);
    setPassword(`${role}123`);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password, activeRole);
      if (activeRole === 'citizen') {
        navigate('/officer-dashboard');
      } else {
        navigate('/officer-dashboard');
      }
    } catch (err: any) {
      setError('Invalid credentials. Please check your role email & password.');
    } finally {
      setLoading(false);
    }
  };

  const currentRoleInfo = roleConfig[activeRole];
  const RoleIcon = currentRoleInfo.icon;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-950 text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glow Overlay */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative z-10">
        {/* Left Branding & Info Column */}
        <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800/80">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-lg">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight text-white">Yatarth AI</h1>
                <p className="text-xs text-blue-400 font-bold">Legal Metrology Statutory Engine</p>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-black leading-tight text-white">
                Legal Metrology Act (LMR 2011) Enterprise Portal
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Role-Based Access Control (RBAC) portal for Legal Metrology Officers, Field Inspectors, Super Admins, and Citizens to audit packaged commodities.
              </p>
            </div>

            <div className="space-y-2 pt-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Rule 6 &amp; Rule 7 Statutory Rule Engine</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>National GIS Violation Heatmap</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Citizen Complaint &amp; Legal Notice Pipeline</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono flex justify-between items-center">
            <span>Security Level: Tier-3 RBAC</span>
            <span>Version 1.0.0</span>
          </div>
        </div>

        {/* Right Authentication Form Column */}
        <div className="lg:col-span-7 p-8 space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/20">
              Select Portal Role
            </span>
            <h3 className="text-xl font-black text-white mt-1">Portal Account Sign In</h3>
          </div>

          {/* Role Selection Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs">
            {(['officer', 'inspector', 'admin', 'citizen'] as const).map((roleKey) => (
              <button
                key={roleKey}
                type="button"
                onClick={() => handleRoleSelect(roleKey)}
                className={`py-2 px-2 rounded-xl font-bold transition-all text-center capitalize cursor-pointer ${
                  activeRole === roleKey
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {roleKey}
              </button>
            ))}
          </div>

          {/* Role Description Header */}
          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-start gap-3 text-xs">
            <div className={`p-2.5 rounded-xl bg-gradient-to-r ${currentRoleInfo.color} text-white shrink-0 shadow-md`}>
              <RoleIcon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs">{currentRoleInfo.title}</h4>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{currentRoleInfo.desc}</p>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px] tracking-wider">
                Official Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px] tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-semibold">
                {error}
              </div>
            )}

            {/* Quick Demo Login Credentials Buttons */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] space-y-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Quick Demo Credentials Fill:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => handleRoleSelect('officer')}
                  className="px-2.5 py-1 bg-blue-600/20 border border-blue-500/30 text-blue-300 font-bold rounded-lg hover:bg-blue-600/40 transition-all text-[10px] cursor-pointer"
                >
                  Officer (`officer123`)
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleSelect('inspector')}
                  className="px-2.5 py-1 bg-purple-600/20 border border-purple-500/30 text-purple-300 font-bold rounded-lg hover:bg-purple-600/40 transition-all text-[10px] cursor-pointer"
                >
                  Inspector (`inspector123`)
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleSelect('citizen')}
                  className="px-2.5 py-1 bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 font-bold rounded-lg hover:bg-emerald-600/40 transition-all text-[10px] cursor-pointer"
                >
                  Citizen (`citizen123`)
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleSelect('admin')}
                  className="px-2.5 py-1 bg-slate-700/50 border border-slate-600 text-slate-300 font-bold rounded-lg hover:bg-slate-700 transition-all text-[10px] cursor-pointer"
                >
                  Admin (`admin123`)
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : `Sign In as ${currentRoleInfo.title.split(' ')[0]}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
