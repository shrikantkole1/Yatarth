import React from 'react';
import { useApp, UserRole } from '../../context/AppContext';
import { Shield, Building2, User, Landmark, Globe, CheckCircle2 } from 'lucide-react';

export const RoleSwitcherBanner: React.FC = () => {
  const { currentRole, switchRole, currentTab, setCurrentTab } = useApp();

  const roles: Array<{
    id: UserRole;
    label: string;
    sublabel: string;
    icon: React.ComponentType<{ size: number; className?: string }>;
    accentColor: string;
    bgColor: string;
    activeClass: string;
    description: string;
  }> = [
    {
      id: 'inspector',
      label: 'Inspector',
      sublabel: 'Field Enforcement',
      icon: Shield,
      accentColor: 'text-emerald-400',
      bgColor: 'bg-emerald-500/20',
      activeClass: 'bg-emerald-600 text-white border-emerald-400 shadow-md ring-2 ring-emerald-400/40',
      description: 'Scan & verify product labels, extract OCR declarations, verify Rule 7 font sizes, and issue Section 36 notices.'
    },
    {
      id: 'business',
      label: 'Business / Packer',
      sublabel: 'Pre-Market Compliance',
      icon: Building2,
      accentColor: 'text-amber-400',
      bgColor: 'bg-amber-500/20',
      activeClass: 'bg-amber-600 text-white border-amber-400 shadow-md ring-2 ring-amber-400/40',
      description: 'Check packaging artwork before mass printing, calculate statutory Unit Sale Price (USP), and export clearance certificates.'
    },
    {
      id: 'consumer',
      label: 'Consumer / Citizen',
      sublabel: 'Rights & Grievance',
      icon: User,
      accentColor: 'text-sky-400',
      bgColor: 'bg-sky-500/20',
      activeClass: 'bg-sky-600 text-white border-sky-400 shadow-md ring-2 ring-sky-400/40',
      description: 'Quick scan labels for overcharging above MRP, calculate illegal cooling fees under Sec 36, and file/track grievances.'
    },
    {
      id: 'controller',
      label: 'State Controller',
      sublabel: 'HQ Oversight & Recall',
      icon: Landmark,
      accentColor: 'text-indigo-400',
      bgColor: 'bg-indigo-500/20',
      activeClass: 'bg-indigo-600 text-white border-indigo-400 shadow-md ring-2 ring-indigo-400/40',
      description: 'Statewide command dashboard, violations repository, district analytics, and reverse supply chain batch recall orders.'
    }
  ];

  const currentRoleMeta = roles.find((r) => r.id === currentRole) || roles[3];

  return (
    <div className="bg-slate-950 text-white border-b border-slate-800 shadow-md py-2 px-4 z-40 transition-all select-none sticky top-0">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-2">
        {roles.map((r) => {
          const Icon = r.icon;
          const isActive = currentRole === r.id && currentTab !== 'landing';

          return (
            <button
              key={r.id}
              onClick={() => switchRole(r.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                isActive
                  ? r.activeClass
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-700/80 hover:border-slate-500'
              }`}
              title={`Switch to ${r.label} View`}
            >
              <Icon size={14} className={isActive ? 'text-white' : r.accentColor} />
              <span>{r.label}</span>
              {isActive && <CheckCircle2 size={12} className="text-white ml-0.5" />}
            </button>
          );
        })}

        <div className="h-4 w-px bg-slate-700 mx-1 hidden sm:block" />

        {/* Return to Public Landing Page */}
        <button
          onClick={() => setCurrentTab('landing')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
            currentTab === 'landing'
              ? 'bg-blue-600 text-white border-blue-400 ring-2 ring-blue-400/40'
              : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500'
          }`}
          title="View Public Legal Metrology Citizen Portal (Landing Page)"
        >
          <Globe size={14} className="text-amber-400" />
          <span>Gov Portal</span>
        </button>
      </div>
    </div>
  );
};
