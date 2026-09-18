import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  Plus, 
  Menu, 
  ZoomIn, 
  ZoomOut, 
  Network, 
  Globe, 
  LogOut 
} from 'lucide-react';

interface NavbarProps {
  onOpenAuth: () => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (c: boolean | ((prev: boolean) => boolean)) => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenAuth,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  isMobileSidebarOpen,
  setIsMobileSidebarOpen
}) => {
  const { 
    currentTab, 
    setCurrentTab, 
    setIsCopilotOpen,
    zoomScale,
    setZoomScale
  } = useApp();

  const tabLabels: Record<string, string> = {
    overview: 'Legal Metrology Command Center',
    scan_product: 'Product Inspection & Scanning',
    analysis_results: 'Inspection Findings & Photo Proof',
    products: 'Registered Products List',
    backtrack: 'Supply Chain & Batch Backtracking (Pune Map)',
    compliance: 'Packaging Rules & Checks',
    violations: 'Rule Violations & Notices',
    inspections: 'Store Inspections & Audits',
    reports: 'Official Inspection Reports',
    analytics: 'Inspection Analytics & Numbers',
    compliance_rules: 'Packaging Rules & Laws',
    team: 'Inspection Officers & Team',
    settings: 'System Settings',
  };

  const handleToggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setIsMobileSidebarOpen((prev) => !prev);
    } else {
      setIsSidebarCollapsed((prev) => !prev);
    }
  };

  return (
    <header className="h-16 px-4 sm:px-6 border-b border-slate-300 bg-white sticky top-0 z-20 flex items-center justify-between shadow-xs">
      {/* Left: Sidebar Toggle Hamburger & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleToggleSidebar}
          className="p-2 -ml-1 rounded-xl text-black hover:bg-slate-100 transition-colors flex items-center justify-center border border-slate-300 shadow-2xs"
          title="Toggle Navigation Sidebar (Ctrl+B)"
        >
          <Menu size={18} />
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-black">
          <span className="text-blue-700 font-black">Yatarth AI</span>
          <span className="text-black font-bold">/</span>
          <span className="text-black capitalize font-black text-sm truncate max-w-[260px] sm:max-w-none">
            {tabLabels[currentTab] || currentTab.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Right: Actions, Zoom In/Out & Navigation Buttons */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Interactive Interface Zoom In & Out Controls */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-300 text-xs shadow-2xs">
          <button
            onClick={() => setZoomScale((z) => Math.max(z - 10, 70))}
            className="p-1.5 rounded-lg text-black hover:text-blue-700 hover:bg-white transition-all active:scale-95"
            title="Zoom Out Interface"
          >
            <ZoomOut size={15} />
          </button>
          <button
            onClick={() => setZoomScale(100)}
            className="px-2.5 py-1 font-mono text-xs font-black text-black hover:text-blue-700 hover:bg-white rounded-lg transition-all"
            title="Reset Zoom to 100%"
          >
            {zoomScale}%
          </button>
          <button
            onClick={() => setZoomScale((z) => Math.min(z + 10, 150))}
            className="p-1.5 rounded-lg text-black hover:text-blue-700 hover:bg-white transition-all active:scale-95"
            title="Zoom In Interface"
          >
            <ZoomIn size={15} />
          </button>
        </div>

        {/* Quick Scan Action */}
        <button
          onClick={() => setCurrentTab('scan_product')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <Plus size={14} strokeWidth={3} />
          <span className="hidden sm:inline">Scan Label</span>
        </button>

        {/* Quick Backtrack Trace Action */}
        <button
          onClick={() => setCurrentTab('backtrack')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-black transition-all shadow-2xs active:scale-95 cursor-pointer ${
            currentTab === 'backtrack'
              ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
              : 'bg-blue-50/80 hover:bg-blue-100 text-blue-950 border-blue-300'
          }`}
          title="Supply Chain & Batch Backtracking (Pune Map)"
        >
          <Network size={14} className={currentTab === 'backtrack' ? 'text-white' : 'text-blue-700'} />
          <span className="hidden sm:inline">Backtrack Trace</span>
        </button>

        {/* Public SaaS Portal Landing Page Button */}
        <button
          onClick={() => setCurrentTab('landing')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition-all shadow-sm active:scale-95 border border-slate-700 cursor-pointer"
          title="Return to Public GovTech Landing Page"
        >
          <Globe size={14} className="text-amber-400" />
          <span className="hidden md:inline">Gov Portal</span>
        </button>

        {/* Yatarth AI Trigger */}
        <button
          onClick={() => setIsCopilotOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-blue-900 border border-blue-300 text-xs font-black transition-all shadow-2xs group cursor-pointer"
          title="Open Yatarth AI"
        >
          <Sparkles size={14} className="text-blue-600 group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">Yatarth AI</span>
        </button>

        {/* Logout to Landing Page */}
        <button
          onClick={() => setCurrentTab('landing')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-800 hover:text-rose-700 border border-slate-300 hover:border-rose-300 text-xs font-black transition-all shadow-2xs cursor-pointer ml-1"
          title="Logout & Return to Landing Page"
        >
          <LogOut size={14} className="text-rose-600" />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};
