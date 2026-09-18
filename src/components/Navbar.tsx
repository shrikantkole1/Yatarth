import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ShieldCheck, Plus, LayoutDashboard, History, UserCheck, LogOut, KeyRound } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { profile, isAuthenticated, logout, setRoleProfile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = location.pathname;

  if (currentPath === '/login') {
    return (
      <header className="bg-slate-950 border-b border-slate-800 text-white py-4 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white">Yatarth AI</span>
              <span className="ml-2 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                National Portal
              </span>
            </div>
          </div>
          <span className="text-xs text-slate-400 font-mono">Role-Based Access Control (RBAC) Enabled</span>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 p-0.5 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-white">Yatarth AI</span>
              <span className="bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                GovTech Cloud
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Legal Metrology Act (LMR 2011) Compliance Engine</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/80">
          <Link
            to="/officer-dashboard"
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              currentPath === '/officer-dashboard' || currentPath === '/'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
          </Link>

          <Link
            to="/create-inspection"
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              currentPath === '/create-inspection'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <Plus className="w-4 h-4" /> New Label Scan
          </Link>

          <Link
            to="/inspections"
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              currentPath === '/inspections'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <History className="w-4 h-4" /> Inspection Log
          </Link>
        </nav>

        {/* User Role & Logout Bar */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-800 p-1 rounded-xl border border-slate-700 flex items-center text-xs">
            <span className="text-[10px] text-slate-400 font-bold px-2 flex items-center gap-1">
              <UserCheck className="w-3 h-3 text-blue-400" /> Active Role:
            </span>
            <select
              value={profile?.role || 'officer'}
              onChange={(e) => setRoleProfile(e.target.value as any)}
              className="bg-slate-900 text-white text-xs font-bold py-1 px-2 rounded-lg border border-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="officer">Officer (Auditor)</option>
              <option value="inspector">Inspector (Field)</option>
              <option value="admin">Super Admin</option>
              <option value="citizen">Consumer / Citizen</option>
            </select>
          </div>

          {isAuthenticated && (
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="p-2.5 bg-red-600/20 hover:bg-red-600/40 text-red-300 hover:text-white border border-red-500/30 rounded-xl transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              title="Sign Out of Portal Session"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
