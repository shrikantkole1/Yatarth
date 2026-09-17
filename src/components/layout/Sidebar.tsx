import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  Scan, 
  Boxes, 
  ShieldCheck, 
  AlertTriangle, 
  ClipboardList, 
  FileText, 
  BarChart3, 
  Sliders, 
  Users, 
  Settings,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Building2, 
  Network, 
  X,
  Globe
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (c: boolean | ((prev: boolean) => boolean)) => void;
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
  onOpenAuth: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isCollapsed, 
  setIsCollapsed, 
  isMobileOpen = false,
  setIsMobileOpen,
  onOpenAuth 
}) => {
  const { 
    currentTab, 
    setCurrentTab, 
    products, 
    allViolations, 
    inspections,
    currentUser, 
    setIsCopilotOpen
  } = useApp();

  const criticalViolationsCount = allViolations.filter(
    (v) => v.severity === 'critical' && v.reviewStatus !== 'resolved'
  ).length;

  const inProgressInspectionsCount = inspections.filter(
    (i) => i.status === 'in_progress'
  ).length;

  const navItems = [
    { 
      id: 'landing', 
      label: 'Gov Portal (Home)', 
      icon: Globe,
      badge: 'Public'
    },
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { 
      id: 'scan_product', 
      label: 'Scan Product', 
      icon: Scan, 
      highlight: true,
      badge: 'Rules Check'
    },
    { 
      id: 'products', 
      label: 'Products', 
      icon: Boxes, 
      count: products.length 
    },
    { 
      id: 'backtrack', 
      label: 'Backtrack Trace', 
      icon: Network,
      highlight: true,
      badge: 'Batch/Recall'
    },
    { 
      id: 'compliance', 
      label: 'Packaging Rules', 
      icon: ShieldCheck 
    },
    { 
      id: 'violations', 
      label: 'Rule Violations', 
      icon: AlertTriangle, 
      alertCount: criticalViolationsCount > 0 ? criticalViolationsCount : undefined 
    },
    { 
      id: 'inspections', 
      label: 'Store Inspections', 
      icon: ClipboardList, 
      count: inProgressInspectionsCount > 0 ? inProgressInspectionsCount : undefined 
    },
    { id: 'reports', label: 'Official Reports', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'compliance_rules', label: 'All Legal Rules', icon: Sliders },
    { id: 'team', label: 'Officers & Team', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
    if (setIsMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  return (
    <aside 
      className={`h-screen sticky top-0 flex flex-col justify-between border-r border-slate-300 bg-white shadow-sm transition-all duration-300 select-none flex-shrink-0 z-40 ${
        isCollapsed ? 'w-20 min-w-[5rem]' : 'w-64 min-w-[16rem]'
      } ${
        isMobileOpen
          ? 'max-lg:fixed max-lg:inset-y-0 max-lg:left-0 max-lg:shadow-2xl max-lg:translate-x-0 max-lg:z-50'
          : 'max-lg:fixed max-lg:inset-y-0 max-lg:left-0 max-lg:-translate-x-full lg:translate-x-0'
      }`}
    >
      {/* Top Header & Brand */}
      <div className="flex-shrink-0">
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-300 bg-white">
          {!isCollapsed ? (
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-700 to-indigo-700 flex items-center justify-center shadow-sm flex-shrink-0">
                <span className="font-mono font-black text-white text-lg">Y</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-black tracking-tight text-black text-base">Yatarth AI</span>
                  <span className="px-1.5 py-0.5 text-[9px] font-mono font-black rounded bg-blue-100 text-blue-900 border border-blue-300">
                    METROLOGY
                  </span>
                </div>
                <span className="text-xs font-bold text-black truncate max-w-[150px]">
                  Product Inspection
                </span>
              </div>
            </div>
          ) : (
            <div className="mx-auto w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-700 to-indigo-700 flex items-center justify-center shadow-sm">
              <span className="font-mono font-black text-white text-lg">Y</span>
            </div>
          )}

          <div className="flex items-center gap-1">
            {/* Close button on mobile/zoomed drawer */}
            {isMobileOpen && (
              <button
                onClick={() => setIsMobileOpen?.(false)}
                className="lg:hidden text-black hover:bg-slate-100 p-1.5 rounded-lg transition-colors"
                title="Close drawer"
              >
                <X size={18} />
              </button>
            )}

            {/* Desktop collapse/expand button */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-black hover:bg-slate-100 p-1.5 rounded-lg transition-colors hidden lg:flex"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? <ChevronRight size={18} className="stroke-[3]" /> : <ChevronLeft size={18} className="stroke-[3]" />}
            </button>
          </div>
        </div>

        {/* Organization / Division Card */}
        {!isCollapsed && (
          <div className="px-3 pt-3 pb-1 flex-shrink-0">
            <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-300 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 truncate">
                <Building2 size={16} className="text-blue-700 flex-shrink-0" />
                <div className="truncate">
                  <p className="font-black text-black truncate">Legal Metrology Division</p>
                  <p className="text-[11px] text-black font-bold">Central Inspection Wing</p>
                </div>
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 flex-shrink-0 ring-4 ring-emerald-200" title="System Active" />
            </div>
          </div>
        )}
      </div>

      {/* Navigation Links - All text bold black and high-contrast */}
      <nav className="flex-1 min-h-0 p-2 space-y-1 mt-1 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-black transition-all group relative ${
                isActive
                  ? 'bg-blue-50 text-blue-950 border border-blue-400 font-black shadow-xs'
                  : item.highlight
                  ? 'text-black bg-blue-50/50 hover:bg-blue-100 border border-blue-300 font-black'
                  : 'text-black hover:bg-slate-100 font-bold'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon
                size={18}
                className={`flex-shrink-0 transition-transform group-hover:scale-105 ${
                  isActive
                    ? 'text-blue-700 stroke-[2.5]'
                    : item.highlight
                    ? 'text-blue-700 stroke-[2.5]'
                    : 'text-black stroke-[2]'
                }`}
              />

              {!isCollapsed && (
                <>
                  <span className="truncate flex-1 text-left text-black font-black text-xs">{item.label}</span>

                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-wider rounded bg-blue-100 text-blue-900 border border-blue-300 font-black">
                      {item.badge}
                    </span>
                  )}

                  {item.count !== undefined && (
                    <span className="px-1.5 py-0.5 text-[10px] font-mono font-black rounded bg-slate-200 text-black border border-slate-300">
                      {item.count}
                    </span>
                  )}

                  {item.alertCount !== undefined && (
                    <span className="px-1.5 py-0.5 text-[10px] font-mono font-black rounded-full bg-rose-200 text-rose-950 border border-rose-400">
                      {item.alertCount}
                    </span>
                  )}
                </>
              )}

              {/* Collapsed notification indicator */}
              {isCollapsed && item.alertCount && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-600 animate-ping" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer / Copilot Trigger & User Switcher - Solid black text */}
      <div className="p-3 border-t border-slate-300 bg-white space-y-2 flex-shrink-0">
        {/* Yatarth AI Button */}
        <button
          onClick={() => {
            setIsCopilotOpen(true);
            if (setIsMobileOpen) setIsMobileOpen(false);
          }}
          className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-blue-50 border border-blue-300 hover:bg-blue-100 text-blue-950 transition-all shadow-xs text-xs font-black group`}
        >
          <Sparkles size={15} className="text-blue-600 group-hover:rotate-12 transition-transform" />
          {!isCollapsed && (
            <span className="truncate">Yatarth AI</span>
          )}
        </button>

        {/* Current Officer Persona Card */}
        <div className="pt-1">
          {!isCollapsed ? (
            <div className="p-2 rounded-lg bg-slate-100 border border-slate-300 flex items-center justify-between">
              <div className="flex items-center gap-2 overflow-hidden">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover border border-slate-400 flex-shrink-0"
                />
                <div className="truncate">
                  <p className="text-xs font-black text-black truncate">{currentUser.name}</p>
                  <p className="text-[10px] text-black font-bold truncate">{currentUser.role}</p>
                </div>
              </div>
              <button 
                onClick={onOpenAuth}
                className="text-xs text-blue-700 font-black hover:underline flex-shrink-0 ml-1"
                title="Switch Officer Persona"
              >
                Switch
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="w-full flex justify-center py-1"
              title={`${currentUser.name} (${currentUser.role})`}
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover border border-slate-400"
              />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
