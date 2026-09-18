import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Lock, Mail, User, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { TEAM_MEMBERS } from '../../data/mockData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, setCurrentUser, switchRole } = useApp();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handlePersonaSelect = (member: typeof TEAM_MEMBERS[0]) => {
    setCurrentUser(member);
    if (member.role.toLowerCase().includes('inspector')) {
      switchRole('inspector');
    } else {
      switchRole('controller');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div 
        className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 relative overflow-hidden text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-700 flex items-center justify-center shadow-sm">
            <span className="font-mono font-black text-white text-xl">Y</span>
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900">Enterprise Role & Department Switcher</h3>
            <p className="text-xs text-slate-500">Legal Metrology Multi-Role Authentication</p>
          </div>
        </div>

        {/* 4 Demo Roles Quick Switcher */}
        <div className="mb-5 p-3 rounded-xl bg-slate-50 border border-slate-200">
          <p className="text-[11px] font-mono text-blue-900 font-bold mb-2.5 flex items-center gap-1.5 uppercase">
            <ShieldCheck size={14} className="text-blue-700" />
            Instant Stakeholder Role Access
          </p>
          
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              onClick={() => {
                switchRole('business');
                onClose();
              }}
              className="p-2.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-left transition-all text-xs cursor-pointer"
            >
              <span className="font-black text-amber-950 block">🏭 Business / Packer</span>
              <span className="text-[10px] text-amber-800">Pre-Market Artwork Audit</span>
            </button>

            <button
              onClick={() => {
                switchRole('consumer');
                onClose();
              }}
              className="p-2.5 rounded-xl border border-sky-300 bg-sky-50 hover:bg-sky-100 text-left transition-all text-xs cursor-pointer"
            >
              <span className="font-black text-sky-950 block">👤 Citizen / Consumer</span>
              <span className="text-[10px] text-sky-800">Scan, Overcharge & Complain</span>
            </button>
          </div>

          <p className="text-[10px] font-mono text-slate-500 font-bold mb-1.5 uppercase">
            Enforcement Officers:
          </p>

          <div className="space-y-1.5">
            {TEAM_MEMBERS.map((member) => {
              const isSelected = currentUser.id === member.id;
              return (
                <button
                  key={member.id}
                  onClick={() => handlePersonaSelect(member)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition-all text-left cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 border border-blue-300 text-blue-900 font-semibold shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-7 h-7 rounded-full object-cover border border-slate-300"
                    />
                    <div>
                      <p className="font-semibold">{member.name}</p>
                      <p className="text-[10px] text-slate-500">{member.role}</p>
                    </div>
                  </div>
                  {isSelected && <CheckCircle2 size={16} className="text-blue-700" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex border-b border-slate-200 mb-4">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 pb-2 text-xs font-bold border-b-2 transition-all ${
              mode === 'login'
                ? 'border-teal-700 text-teal-800'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Officer Sign In
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 pb-2 text-xs font-bold border-b-2 transition-all ${
              mode === 'signup'
                ? 'border-teal-700 text-teal-800'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Register Verification Division
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onClose();
          }}
          className="space-y-3"
        >
          {mode === 'signup' && (
            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">Officer Full Name</label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. Rajesh Varma"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 focus:bg-white"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[11px] font-medium text-slate-700 block mb-1">Official ID / Email</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="officer.lm@yatarth.ai"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-700 block mb-1">Passcode / PIN</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 focus:bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-2.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm active:scale-98"
          >
            <span>{mode === 'login' ? 'Authenticate Officer Session' : 'Register Enforcement Unit'}</span>
            <ArrowRight size={14} />
          </button>
        </form>

        <p className="text-[11px] text-slate-500 text-center mt-4 font-mono">
          Protected with Government-Grade 256-bit AES cryptographic verification.
        </p>
      </div>
    </div>
  );
};
