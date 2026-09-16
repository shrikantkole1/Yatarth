import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Bell, 
  Sparkles, 
  Plus, 
  CheckCheck, 
  AlertCircle, 
  CheckCircle2, 
  Info,
  ChevronDown,
  Menu,
  ZoomIn,
  ZoomOut,
  Network
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
    notifications, 
    markNotificationAsRead, 
    clearAllNotifications,
    setIsCopilotOpen,
    setIsCommandPaletteOpen,
    currentUser,
    zoomScale,
    setZoomScale
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

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
          <span className="text-black capitalize font-black text-sm truncate max-w-[220px] sm:max-w-none">
            {tabLabels[currentTab] || currentTab.replace('_', ' ')}
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-300 text-xs font-bold text-emerald-900">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
          <span>Rules Engine Active</span>
        </div>
      </div>

      {/* Right: Actions, Zoom In/Out, Search & Tools */}
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

        {/* Global Search Bar Trigger */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs text-black hover:border-slate-400 transition-all shadow-2xs w-48 lg:w-60"
        >
          <Search size={14} className="text-black" />
          <span className="truncate flex-1 text-left font-bold text-black">Search Product, Rule, Shop...</span>
          <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono font-bold text-black bg-slate-100 border border-slate-300 rounded shadow-2xs">
            ⌘K
          </kbd>
        </button>

        {/* Quick Scan Action */}
        <button
          onClick={() => setCurrentTab('scan_product')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs transition-all shadow-sm active:scale-95"
        >
          <Plus size={14} strokeWidth={3} />
          <span className="hidden sm:inline">Scan Label</span>
        </button>

        {/* Quick Backtrack Trace Action */}
        <button
          onClick={() => setCurrentTab('backtrack')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-black transition-all shadow-2xs active:scale-95 ${
            currentTab === 'backtrack'
              ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
              : 'bg-blue-50/80 hover:bg-blue-100 text-blue-950 border-blue-300'
          }`}
          title="Supply Chain & Batch Backtracking (Pune Map)"
        >
          <Network size={14} className={currentTab === 'backtrack' ? 'text-white' : 'text-blue-700'} />
          <span className="hidden sm:inline">Backtrack Trace</span>
        </button>

        {/* Yatarth AI Trigger */}
        <button
          onClick={() => setIsCopilotOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-blue-900 border border-blue-300 text-xs font-black transition-all shadow-2xs group"
          title="Open Yatarth AI"
        >
          <Sparkles size={14} className="text-blue-600 group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">Yatarth AI</span>
        </button>

        {/* Notifications Popover Trigger */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-black hover:bg-slate-100 transition-colors relative border border-slate-300 shadow-2xs"
            title="Notifications"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-600 ring-2 ring-white" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-slate-300 shadow-xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-black text-black">Inspection Alerts</h4>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.2 text-[10px] font-mono font-black rounded bg-blue-100 text-blue-900 border border-blue-300">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="text-xs text-blue-700 hover:underline flex items-center gap-1 font-black"
                  >
                    <CheckCheck size={13} />
                    Mark all read
                  </button>
                )}
              </div>

              <div className="mt-2 space-y-2 max-h-80 overflow-y-auto pr-1">
                {notifications.length === 0 ? (
                  <p className="text-xs font-bold text-black text-center py-6">No new alerts</p>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationAsRead(notif.id)}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                        notif.read
                          ? 'bg-white border-slate-200 text-black'
                          : 'bg-blue-50 border-blue-300 text-black font-semibold'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {notif.type === 'alert' && (
                          <AlertCircle size={15} className="text-rose-600 mt-0.5 flex-shrink-0" />
                        )}
                        {notif.type === 'success' && (
                          <CheckCircle2 size={15} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                        )}
                        {notif.type === 'info' && (
                          <Info size={15} className="text-blue-600 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-black">{notif.title}</p>
                          <p className="text-xs text-black mt-0.5 leading-snug font-medium">
                            {notif.description}
                          </p>
                          <span className="text-[11px] text-black font-mono font-bold mt-1 block">
                            {notif.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar & Switch Persona */}
        <button
          onClick={onOpenAuth}
          className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition-colors border border-slate-300"
          title="Switch Officer Persona"
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-8 h-8 rounded-xl object-cover border border-slate-300 shadow-2xs"
          />
          <ChevronDown size={14} className="text-black hidden sm:inline" />
        </button>
      </div>
    </header>
  );
};
