import React from 'react';
import { Smartphone, Monitor, ShieldCheck, ScanLine, LayoutDashboard, AlertTriangle, History } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface MobileFrameWrapperProps {
  children: React.ReactNode;
  isMobileFrame: boolean;
  onToggleFrame: () => void;
}

export const MobileFrameWrapper: React.FC<MobileFrameWrapperProps> = ({
  children,
  isMobileFrame,
  onToggleFrame,
}) => {
  const location = useLocation();
  const currentPath = location.pathname;

  if (!isMobileFrame) {
    return <>{children}</>;
  }

  return (
    <div className="py-8 px-4 flex flex-col items-center justify-center bg-slate-950 min-h-[calc(100vh-64px)]">
      {/* Smartphone Device Mockup Frame */}
      <div className="w-full max-w-[420px] bg-slate-900 rounded-[48px] p-3 border-4 border-slate-700 shadow-2xl shadow-blue-500/20 relative flex flex-col min-h-[780px] max-h-[850px] overflow-hidden">
        {/* Smartphone Top Notch & Camera */}
        <div className="w-36 h-5 bg-slate-950 rounded-b-2xl mx-auto flex items-center justify-center gap-2 shrink-0 z-30 mb-2">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700" />
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500/80" />
        </div>

        {/* Mobile App Screen Viewport Content */}
        <div className="flex-1 bg-slate-100 rounded-[32px] overflow-y-auto overflow-x-hidden p-2 text-slate-900 scrollbar-hide">
          {children}
        </div>

        {/* Mobile App Bottom Navigation Bar */}
        <nav className="bg-slate-900 border-t border-slate-800 rounded-b-[36px] px-3 py-2.5 flex items-center justify-around text-slate-400 text-[10px] font-bold shrink-0 mt-2 z-30">
          <Link
            to="/officer-dashboard"
            className={`flex flex-col items-center gap-1 transition-colors ${
              currentPath === '/' || currentPath === '/officer-dashboard' ? 'text-blue-400' : 'hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/create-inspection"
            className={`flex flex-col items-center gap-1 transition-colors ${
              currentPath === '/create-inspection' ? 'text-blue-400' : 'hover:text-white'
            }`}
          >
            <ScanLine className="w-4 h-4" />
            <span>Scan Label</span>
          </Link>

          <Link
            to="/inspections"
            className={`flex flex-col items-center gap-1 transition-colors ${
              currentPath === '/inspections' ? 'text-blue-400' : 'hover:text-white'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Audits</span>
          </Link>
        </nav>
      </div>

      <p className="text-xs text-slate-400 font-mono mt-4 flex items-center gap-2">
        <Smartphone className="w-4 h-4 text-emerald-400" />
        Simulated Mobile App View (Consumer / Inspector Smartphone Experience)
      </p>
    </div>
  );
};
