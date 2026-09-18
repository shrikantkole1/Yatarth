import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard, MapPin, AlertTriangle, ScanLine, BookOpen,
  Smartphone, Monitor, ChevronRight, ShieldCheck, UserCheck, Bell,
  FileText, Search
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  pendingComplaintsCount?: number;
  isMobileFrame?: boolean;
  onToggleMobileFrame?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  pendingComplaintsCount = 3,
  isMobileFrame = false,
  onToggleMobileFrame,
}) => {
  const { profile, setRoleProfile } = useAuth();
  const location = useLocation();

  const navItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'file-complaint', label: 'File LMPC Complaint', icon: FileText },
    { id: 'track-complaint', label: 'Track Complaint Status', icon: Search },
    { id: 'regional-map', label: 'Region-Wise Heatmap', icon: MapPin },
    {
      id: 'citizen-reports',
      label: 'Citizen Complaints Queue',
      icon: AlertTriangle,
      badge: pendingComplaintsCount > 0 ? pendingComplaintsCount : null,
    },
    { id: 'inspections-log', label: 'All Inspection Audits', icon: ScanLine },
    { id: 'rule-registry', label: 'LMPC 2011 Rule Book', icon: BookOpen },
  ];

  return (
    <aside className="w-full lg:w-64 bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-800 text-white p-4 flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        {/* Profile Card */}
        <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-md border border-blue-400/30">
              {profile?.role === 'citizen' ? 'Citizen Portal' : profile?.role === 'admin' ? 'Super Admin' : 'Metrology Officer'}
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <div>
            <h4 className="text-xs font-bold text-white truncate">{profile?.name}</h4>
            <p className="text-[11px] text-slate-400 truncate">{profile?.department}</p>
          </div>

          <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Switch Role:</span>
            <select
              value={profile?.role || 'officer'}
              onChange={(e) => setRoleProfile(e.target.value as any)}
              className="bg-slate-900 text-white text-[11px] font-bold py-1 px-1.5 rounded border border-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="officer">Officer</option>
              <option value="inspector">Inspector</option>
              <option value="admin">Admin</option>
              <option value="citizen">Citizen/Consumer</option>
            </select>
          </div>
        </div>

        {/* Sidebar Menu Items */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 block mb-2">
            Navigation Menu
          </span>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="px-2 py-0.5 bg-red-600 text-white font-extrabold text-[10px] rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Action Link: New Scan */}
        <Link
          to="/create-inspection"
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
        >
          <ScanLine className="w-4 h-4" /> Launch LMPC Scan
        </Link>
      </div>

      {/* Mobile Frame Viewport Toggle Footer */}
      <div className="pt-6 border-t border-slate-800 space-y-2 mt-6 lg:mt-0">
        <div className="text-[10px] text-slate-400 font-mono">Mobile App Simulation</div>
        <button
          onClick={onToggleMobileFrame}
          className={`w-full py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
            isMobileFrame
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
          }`}
        >
          <div className="flex items-center gap-2">
            {isMobileFrame ? <Smartphone className="w-4 h-4 text-emerald-400" /> : <Monitor className="w-4 h-4 text-slate-400" />}
            <span>{isMobileFrame ? 'Mobile App Frame ON' : 'Desktop Full View'}</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
